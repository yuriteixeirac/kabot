import type { Category, ProductList } from '../types.ts';

export function buildUrl(category: Category, page: number): string {
	return `https://servicespub.prod.api.aws.grupokabum.com.br/catalog/v2/products-by-category/${category}?page_number=${page}&page_size=100&facet_filters=&sort=most_searched&is_prime=false&payload_data=products_category_filters&include=gift`;
}

export async function fetchPage(category: Category, page: number): Promise<ProductList> {
	const currentPage: string = buildUrl(category, page);
	const response = await fetch(currentPage);

	if (!response.ok) {
		throw new Error(`Erro ao requisitar página: ${currentPage}`);
	}

	return await response.json();
}
