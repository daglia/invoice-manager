# Invoice Manager

Invoice Manager is a web application for managing invoices, payment methods, and services. It includes a frontend built with React and Ant Design, and a backend built with Go and Gin.

## Project Structure

- `/backend`: Contains the backend code.
- `/frontend`: Contains the frontend code.

## Getting Started

### Prerequisites

- Node.js
- Go
- PostgreSQL

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/daglia/invoice-manager.git
   cd invoice-manager
   ```

2. Set up the backend:

   ```sh
   cd backend
   go mod tidy
   ```

3. Set up the frontend:
   ```sh
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in both the `backend` and `frontend` directories with the following content:

#### Backend `.env` file:

```properties
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_totally_safe_password
DB_NAME=invoice_db
```

#### Frontend `.env` file:

```properties
VITE_API_URL=http://localhost:8080
```

### Running the Application

1. Start the backend server:

   ```sh
   cd backend
   go run main.go
   ```

2. Start the frontend development server:

   ```sh
   cd ../frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License.
