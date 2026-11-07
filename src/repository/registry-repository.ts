import { SqlError, type Connection } from "mariadb";
import type { Registry } from "../types.js";

export async function insertRegistry(conn: Connection, registry: Registry) {
	let registeredAt: string = registry.registeredAt.toISOString().slice(0, 10);
	try {
		await conn.query(
			'INSERT INTO registry (product_id, price, registered_at, snapshot_quarter) VALUES (?, ?, ?, ?)',
			[registry.productId, registry.price, registeredAt, registry.snapshotQuarter]
		);

	} catch (err) {
		if (err instanceof SqlError && err.code == 'ER_DUP_ENTRY') {
			await conn.query(
				'UPDATE registry SET price = ? WHERE product_id = ? AND registered_at = ? AND snapshot_quarter = ?',
				[registry.price, registry.productId, registeredAt, registry.snapshotQuarter]
			);
		}
	}
}

export async function queryRegistryHistory(conn: Connection, registry: Registry): Promise<number> {
	const result = await conn.query<{ average: number | null }>(
		'SELECT AVG(price) as average FROM registry WHERE registered_at > ADD_MONTHS(CURRENT_DATE, -1) AND product_id = ?',
		[registry.productId]
	);
	return result.average ?? 0;
}

