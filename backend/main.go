package main

import (
	"fmt"
	"log"
	"time"

	"invoice-manager/db"
	"invoice-manager/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
    db.InitDB()

    router := gin.Default()

    // Enable CORS
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        ExposeHeaders:    []string{"Content-Length"},
        // AllowOriginFunc: func(origin string) bool {
        //     return origin == "http://localhost:3000"
        // },
        MaxAge: 12 * time.Hour,
    }))

    routes.SetupRoutes(router)

    fmt.Println("Server is running on port 8080...")
    log.Fatal(router.Run(":8080"))
}

