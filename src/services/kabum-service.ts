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
	const product: Product = {
		id: kabumProduct.id,
		title: kabumProduct.attributes.title,
		category: category,
		image: kabumProduct.attributes.images?.[0] ?? "",
	}

	const registry: Registry = {
		productId: kabumProduct.id,
		price: kabumProduct.attributes.price,
		discountPercentage: kabumProduct.attributes.discount_percentage,
		registeredAt: new Date(),
	}

	return [product, registry];
}
