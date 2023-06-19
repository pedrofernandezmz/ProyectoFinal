package router

import (
	"fmt"
	propertyController "properties/controllers/property"

	"time"

	cors "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var Gin_router *gin.Engine

func init() {
	Gin_router = gin.Default()
	Gin_router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
}

func MapUrls() {
	// Products Mapping
	Gin_router.GET("/properties/:parameters/id", propertyController.Get)

	Gin_router.GET("/properties/:parameters", propertyController.GetByParam)
	Gin_router.GET("/properties/all", propertyController.GetAll)
	Gin_router.POST("/properties/load", propertyController.Insert)
	Gin_router.POST("/properties/import", propertyController.InsertMany)

	fmt.Println("Finishing mappings configurations")
}
