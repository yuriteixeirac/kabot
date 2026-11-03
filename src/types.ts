export type Category = "hardware" | "perifericos" | "computadores" | "gamer";

export interface KabumProduct {
	id: number;
	attributes: { 
		title: string;
		price: number;
		images: string[];
		price_with_discount: number;
		offer: {
			price_with_discount: number;
		} | undefined
	};
}

export interface KabumResponse {
	meta: { total_pages_count: number };
	data: KabumProduct[];
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
	registeredAt: Date;
}
