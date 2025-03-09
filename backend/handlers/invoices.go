package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"invoice-manager/db"
	"invoice-manager/models"

	"github.com/gin-gonic/gin"
)

func GetInvoices(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	sortField := c.DefaultQuery("sortField", "id")
	sortOrder := c.DefaultQuery("sortOrder", "asc")
	search := c.DefaultQuery("search", "")

	offset := (page - 1) * pageSize

	query := `
		SELECT id, service_name, invoice_number, date, amount, status
		FROM invoices
		WHERE service_name ILIKE '%' || $3 || '%' OR invoice_number::text ILIKE '%' || $3 || '%'
		ORDER BY ` + sortField + ` ` + sortOrder + `
		LIMIT $1 OFFSET $2
	`

	rows, err := db.DB.Query(query, pageSize, offset, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var invoices []models.Invoice
	for rows.Next() {
		var inv models.Invoice
		if err := rows.Scan(&inv.ID, &inv.ServiceName, &inv.InvoiceNumber, &inv.Date, &inv.Amount, &inv.Status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		invoices = append(invoices, inv)
	}

	var total int
	countQuery := `
		SELECT COUNT(*)
		FROM invoices
		WHERE service_name ILIKE '%' || $1 || '%' OR invoice_number::text ILIKE '%' || $1 || '%'
	`
	err = db.DB.QueryRow(countQuery, search).Scan(&total)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"invoices": invoices,
		"total":    total,
	})
}

func CreateInvoice(c *gin.Context) {
    var inv models.Invoice
    if err := c.ShouldBindJSON(&inv); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    query := "INSERT INTO invoices (service_name, invoice_number, date, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id"
    err := db.DB.QueryRow(query, inv.ServiceName, inv.InvoiceNumber, inv.Date, inv.Amount, inv.Status).Scan(&inv.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, inv)
}

func GetInvoiceByID(c *gin.Context) {
    id := c.Param("id")
    var inv models.Invoice
    query := "SELECT id, service_name, invoice_number, date, amount, status FROM invoices WHERE id = $1"
    err := db.DB.QueryRow(query, id).Scan(&inv.ID, &inv.ServiceName, &inv.InvoiceNumber, &inv.Date, &inv.Amount, &inv.Status)
    if err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }

    c.JSON(http.StatusOK, inv)
}

func UpdateInvoice(c *gin.Context) {
    id := c.Param("id")
    var inv models.Invoice
    if err := c.ShouldBindJSON(&inv); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    query := "UPDATE invoices SET service_name=$1, invoice_number=$2, date=$3, amount=$4, status=$5 WHERE id=$6"
    _, err := db.DB.Exec(query, inv.ServiceName, inv.InvoiceNumber, inv.Date, inv.Amount, inv.Status, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Invoice updated"})
}

func DeleteInvoice(c *gin.Context) {
    id := c.Param("id")
    query := "DELETE FROM invoices WHERE id=$1"
    _, err := db.DB.Exec(query, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted"})
}
