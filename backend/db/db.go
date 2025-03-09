package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
    err := godotenv.Load()
    if err != nil {
        log.Println("⚠️ Warning: .env file not found, using default values")
    }

    dbHost := getEnv("DB_HOST", "localhost")
    dbPort := getEnv("DB_PORT", "5432")
    dbUser := getEnv("DB_USER", "myuser")
    dbPassword := getEnv("DB_PASSWORD", "mypassword")
    dbName := getEnv("DB_NAME", "invoice_db")

    connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        dbHost, dbPort, dbUser, dbPassword, dbName)

    DB, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal("Database connection error:", err)
    }

    if err = DB.Ping(); err != nil {
        log.Fatal("Database is unreachable:", err)
    }

    fmt.Println("✅ Connected to PostgreSQL database successfully!")

	createEnumQuery := `
		DO $$ BEGIN
			CREATE TYPE invoice_status AS ENUM ('Unpaid', 'Pending', 'Paid');
		EXCEPTION
			WHEN duplicate_object THEN null;
		END $$;
	`

	_, err = DB.Exec(createEnumQuery)
	if err != nil {
		log.Fatal(err)
	}

	createTableQuery := `
		CREATE TABLE IF NOT EXISTS invoices (
			id SERIAL PRIMARY KEY,
			service_name VARCHAR(100),
			invoice_number INT UNIQUE,
			date DATE,
			amount FLOAT,
			status invoice_status
		);
	`

	_, err = DB.Exec(createTableQuery)
	if err != nil {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
    if value, exists := os.LookupEnv(key); exists {
        return value
    }
    return fallback
}