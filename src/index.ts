import type { Category } from './types.js';
import type { Connection } from 'mariadb';
import { closeDb, getDb } from './repository/database-singleton.js';
import { collectCategory } from './services/kabum-service.js';

async function main() {
	const conn: Connection = await getDb({
		user: process.env.MARIADB_USER as string,
		password: process.env.MARIADB_PASSWORD as string,
		host: 'localhost',
		port: 3306,
		database: process.env.MARIADB_DATABASE || 'kabot'
	});
	
	const categories: Category[] = ["hardware", "perifericos", "gamer", "computadores"];

	let seenProducts: Set<number> = new Set<number>();
	for (const category of categories) {
		await collectCategory(conn, category, seenProducts);
	}

	await closeDb();
}

main();

