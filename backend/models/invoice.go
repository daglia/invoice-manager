package models

type Invoice struct {
    ID            int     `json:"id"`
    ServiceName   string  `json:"service_name"`
    InvoiceNumber int     `json:"invoice_number"`
    Date          string  `json:"date"`
    Amount        float64 `json:"amount"`
    Status        string  `json:"status"`
}