import { createConnection, type Connection, type ConnectionConfig } from 'mariadb';

let db: Connection | undefined;

export async function getDb(conn: ConnectionConfig): Promise<Connection> {
	if (!db) {
		db = await createConnection(conn);
	}
	return db;
}

export async function closeDb(): Promise<void> {
	if (db) await db.close();
}

