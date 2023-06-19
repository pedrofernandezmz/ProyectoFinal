package router

import (
	"fmt"

	messageController "messages/controllers/message"
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
	Gin_router.GET("/messages/:id", messageController.GetMessageById)
	Gin_router.GET("/properties/:id/messages", messageController.GetMessagesByPropertyId)

	Gin_router.DELETE("/messages/:id", messageController.DeleteMessage)
	Gin_router.POST("/message", messageController.MessageInsert)

	fmt.Println("Finishing mappings configurations")
}
