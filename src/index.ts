import type { Product, ProductList, Category } from './types.js';
import { buildUrl, fetchPage } from './services/kabum-service.js';

function processData(product: Product): void {
	console.log(product.attributes.title);
}

async function collectCategory(category: Category) {
	let response = await fetchPage(category, 1);
	const totalPagesCount = response.meta.total_pages_count;

	response.data.forEach(processData);

	for (let currentPage = 2; currentPage <= totalPagesCount; currentPage++) {
		let response: ProductList = await fetchPage(category, currentPage);
		response.data.forEach(processData);
	}
}

const categories: Category[] = ["hardware", "perifericos", "gamer", "computadores"];
for (const category of categories) {
	await collectCategory(category);
}
