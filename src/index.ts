import type { Product, ProductList, Category } from './types.ts';

async function getTotalPages(category: Category): Promise<number> {
	let response = await fetch(`https://servicespub.prod.api.aws.grupokabum.com.br/catalog/v2/products-by-category/${category}?page_number=1&page_size=100&facet_filters=&sort=most_searched&is_prime=false&payload_data=products_category_filters&include=gift`);

	if (!response.ok) {
		throw new Error("Requisição falhou.");
	}

	const data: ProductList = await response.json();

	return data.meta.total_pages_count;
}

async function fetchCurrentPage(page: number, category: Category): Promise<ProductList> {
	let response = await fetch(`https://servicespub.prod.api.aws.grupokabum.com.br/catalog/v2/products-by-category/${category}?page_number=${page}&page_size=100&facet_filters=&sort=most_searched&is_prime=false&payload_data=products_category_filters&include=gift`);
	
	if (!response.ok) {
		throw new Error("ERRO DE REQUISIÇÃO");
	}

	return await response.json();
}

async function fetchProducts(category: Category) {
	const totalPagesCount: number = await getTotalPages(category);

	for (let currentPage = 1; currentPage <= totalPagesCount; currentPage++) {
		let productList: ProductList = await fetchCurrentPage(currentPage, category);
		productList.data.forEach((product: Product) => {
			console.log(product.attributes.title);
		});
	}
}

const categories: Category[] = ["hardware", "perifericos", "gamer", "computadores"];

categories.forEach(
	async (element: Category) => {
		await fetchProducts(element);
	}
);
