import type { Connection } from "mariadb";
import type { Registry } from "../types.js";

export async function insertRegistry(conn: Connection, registry: Registry): Promise<number> {
	const result = await conn.query(
		'INSERT INTO registry (product_id, price, registered_at) VALUES (?, ?, ?)',
		[registry.productId, registry.price, registry.registeredAt]
	);
	return result.insertId;
}

