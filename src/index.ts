import type { KabumResponse, Category, Product, Registry } from './types.js';
import { fetchPage, convertToProductSchema } from './services/kabum-service.js';
import type { Connection } from 'mariadb';
import { getDb } from './repository/database-singleton.js';
import { upsertProduct } from './repository/product-repository.js';
import { insertRegistry } from './repository/registry-repository.js';

async function processData(conn: Connection, product: Product, registry: Registry): Promise<void> {
	await upsertProduct(conn, product);
	await insertRegistry(conn, registry);
}

async function collectCategory(category: Category): Promise<void> {
	let conn = await getDb({
		user: process.env.MARIADB_USER || 'root',
		host: process.env.MARIADB_HOST || 'localhost',
		password: process.env.MARIADB_PASSWORD || 'root',
		port: (process.env.MARIADB_PORT || 3306) as number,
		database: process.env.MARIADB_USER || 'kabot',
	});

	let response: KabumResponse = await fetchPage(category, 1);
	const totalPagesCount = response.meta.total_pages_count;

	response.data.forEach(async (p: any) => {
		let [product, registry] = convertToProductSchema(p, category);
		await processData(conn, product, registry); 
	});

	for (let currentPage = 2; currentPage <= totalPagesCount; currentPage++) {
		let response: KabumResponse = await fetchPage(category, currentPage);
		response.data.forEach(async (p: any): Promise<void> => {
			let [product, registry] = convertToProductSchema(p, category);
			await processData(
				conn,
				product,
				registry
			);
		});
	}
}

const categories: Category[] = ["hardware", "perifericos", "gamer", "computadores"];
for (const category of categories) {
	await collectCategory(category);
}

