-- MariaDB Schema

CREATE TABLE product (
	id INT PRIMARY KEY,
	title VARCHAR(320) NOT NULL,
	category VARCHAR(50) NOT NULL,
	image VARCHAR(512) NOT NULL
);

CREATE TABLE registry (
	id INT PRIMARY KEY AUTO_INCREMENT,
	price DECIMAL(9, 2) NOT NULL,
	product_id INT NOT NULL,
	registered_at DATE NOT NULL DEFAULT CURRENT_DATE,
	snapshot_quarter INT NOT NULL CHECK (snapshot_quarter BETWEEN 0 AND 3), -- sob a intenção de registrar novas entradas 4 vezes por dia

	UNIQUE (product_id, registered_at, snapshot_quarter),
	FOREIGN KEY (product_id) REFERENCES product(id)
);
