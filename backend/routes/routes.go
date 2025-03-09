package routes

import (
	"invoice-manager/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
    router.GET("/invoices", handlers.GetInvoices)
    router.POST("/invoices", handlers.CreateInvoice)
    router.GET("/invoices/:id", handlers.GetInvoiceByID)
    router.PUT("/invoices/:id", handlers.UpdateInvoice)
    router.DELETE("/invoices/:id", handlers.DeleteInvoice)
}
