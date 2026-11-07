# Kabot

Bot que coleta, analisa e armazena produtos e preços da Kabum, servindo como base para integração com sistemas de automação.

## Como funciona

- Percorre as principais categorias usando a API pública do catálogo da Kabum.
- Salva os produtos e registra o preço em snapshots de 6 horas, totalizando 4 registros por dia.
- Compara o preço atual com a média dos últimos 30 dias (usa em torno de 112 registros) e, se estiver abaixo, grava a promoção em `promocoes.log`.

## Requisitos

- Node.js 20.6+
- MariaDB

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o banco e aplique o schema:

   ```bash
   docker run -d --name kabot --env-file .env -v ./data/schema.sql:/docker-entrypoint-initdb.d/init.sql:ro -p 3306:3306 -d mariadb
   ```

3. Crie um arquivo `.env` na raiz, baseando-se em `.env.example`:

   ```env
   MARIADB_USER=root
   MARIADB_PASSWORD=root
   MARIADB_DATABASE=kabot
   ```

## Uso

```bash
npx tsc && node --env-file .env dist/index.js
```

> O projeto não carrega o `.env` automaticamente. Sem `--env-file` (ou sem as
> variáveis exportadas no ambiente), o `src/index.ts` usa valores padrão fixos.

## Estrutura

```
src/
├── index.ts                     # ponto de entrada
├── types.ts                     # tipos e categorias
├── services/kabum-service.ts    # coleta e análise de preços
└── repository/                  # acesso ao banco (produto, registro, conexão)
data/schema.sql                  # schema do MariaDB
```

## Modelo de dados

- `product`: catálogo de produtos (id da Kabum, título, categoria e imagem).
- `registry`: histórico de preços, com um registro por produto a cada snapshot
  de 6 horas (chave única por `product_id`, `registered_at` e `snapshot_quarter`).

