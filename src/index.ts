import type { KabumProduct, KabumResponse, Category, Product } from './types.js';
import { fetchPage } from './services/kabum-service.js';

async function processData(product: Product): Promise<void> {
	console.log(product);	
}

function convertToSchema(product: KabumProduct, category: Category): Product {
	return {
		id: product.id,
		title: product.attributes.title,
		category: category,
		image: product.attributes.images[0],
	}
}

async function collectCategory(category: Category): Promise<void> {
	let response: KabumResponse = await fetchPage(category, 1);
	const totalPagesCount = response.meta.total_pages_count;

	response.data.forEach(async (p: any) => {
		await processData(convertToSchema(p, category));
	});

	for (let currentPage = 2; currentPage <= totalPagesCount; currentPage++) {
		let response: KabumResponse = await fetchPage(category, currentPage);
		response.data.forEach(async (p: any): Promise<void> => {
			await processData(
				convertToSchema(p, category)
			);
		});
	}
}

const categories: Category[] = ["hardware", "perifericos", "gamer", "computadores"];
for (const category of categories) {
	await collectCategory(category);
}

