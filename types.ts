export type Category = "hardware" | "perifericos" | "computadores" | "gamer";

export interface Product {
	id: number;
	attributes: { title: string };
}

export interface ProductList {
	meta: { total_pages_count: number };
	data: Product[];
}


