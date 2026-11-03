import type { Connection } from 'mariadb';
import { upsertProduct } from '../repository/product-repository.js';
import { insertRegistry } from '../repository/registry-repository.js';
import type { Category, KabumResponse, KabumProduct, Product, Registry } from '../types.ts';

export function buildUrl(category: Category, page: number): string {
	return `https://servicespub.prod.api.aws.grupokabum.com.br/catalog/v2/products-by-category/${category}?page_number=${page}&page_size=100&facet_filters=&sort=most_searched&is_prime=false&payload_data=products_category_filters&include=gift`;
}

export async function fetchPage(category: Category, page: number): Promise<KabumResponse> {
	const currentPage: string = buildUrl(category, page);
	const response = await fetch(currentPage);

	if (!response.ok) {
		throw new Error(`Erro ao requisitar página: ${currentPage}`);
	}

	return await response.json();
}

export function convertToProductSchema(kabumProduct: KabumProduct, category: Category): [Product, Registry] {
	const attributes = kabumProduct.attributes;
	const product: Product = {
		id: kabumProduct.id,
		title: attributes.title,
		category: category,
		image: attributes.images?.[0] ?? "",
	}

	const registry: Registry = {
		productId: kabumProduct.id,
		price: attributes.offer?.price_with_discount ?? attributes.price_with_discount,
		registeredAt: new Date(),
	}

	return [product, registry];
}

async function processData(conn: Connection, kabumProduct: KabumProduct, category: Category): Promise<void> {
	let [product, registry] = convertToProductSchema(kabumProduct, category);

	await upsertProduct(conn, product);
	await insertRegistry(conn, registry);
}

export async function collectCategory(conn: Connection, category: Category, seen: Set<number>): Promise<void> {
	let response: KabumResponse = await fetchPage(category, 1);
	const totalPagesCount = response.meta.total_pages_count;

	for (const product of response.data) {
		if (seen.has(product.id)) continue;
		await processData(conn, product, category);
		seen.add(product.id);
	} 

	for (let currentPage = 2; currentPage <= totalPagesCount; currentPage++) {
		let response: KabumResponse = await fetchPage(category, currentPage);

		for (const product of response.data) {
			if (seen.has(product.id)) continue;
			await processData(conn, product, category);
			seen.add(product.id);
		}
	}
}

