# Backend - Invoice Manager

This is the backend for the Invoice Manager application. It is built with Go and Gin, and uses PostgreSQL as the database.

## Prerequisites

- Go
- PostgreSQL

## Installation

1. Install dependencies:

   ```sh
   go mod tidy
   ```

2. Set up the database:

   ```sh
   psql -U postgres -c "CREATE DATABASE invoice_manager;"
   psql -U postgres -d invoice_manager -f schema.sql
   ```

3. Configure the database connection in `db/db.go`.

### Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```properties
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_totally_safe_password
DB_NAME=invoice_db
```

## Running the Server

Start the backend server:

```sh
go run main.go
```

The server will be running at `http://localhost:8080`.

## API Endpoints

- `GET /invoices`: Get a list of invoices.
- `POST /invoices`: Create a new invoice.
- `GET /invoices/:id`: Get an invoice by ID.
- `PUT /invoices/:id`: Update an invoice by ID.
- `DELETE /invoices/:id`: Delete an invoice by ID.

## License

This project is licensed under the MIT License.
