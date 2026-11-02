export type Category = "hardware" | "perifericos" | "computadores" | "gamer";

export interface KabumProduct {
	id: number;
	attributes: { 
		title: string;
		price: number;
		discount_percentage: number;
		images: string[];
	};
}

export interface KabumResponse {
	meta: { total_pages_count: number };
	data: Product[];
}

// Database schemas
export interface Product {
	id: number;
	title: string;
	category: Category;
	image: string | undefined;
}

export interface Registry {
	id?: number;
	productId: number;
	price: number;
	discountPercentage: number;
	registeredAt: Date;
}
