import type { Connection } from "mariadb";
import type { Product } from "../types.js";

export async function upsertProduct(conn: Connection, product: Product): Promise<number> {
	const result = await conn.query(
		'INSERT INTO product (id, title, category, image) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, category = ?, image = ?',
		[product.id, product.title, product.category, product.image, product.title, product.category, product.image]
	);
	return result.insertId;
}

