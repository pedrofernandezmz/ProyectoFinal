package messageController

import (
	"fmt"
	"messages/dto"
	service "messages/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetMessageById(c *gin.Context) {

	id := c.Param("id")

	messageDto, er := service.MessageService.GetMessageById(id)

	// Error del Insert
	if er != nil {
		c.JSON(er.Status(), er)
		return
	}

	c.JSON(http.StatusOK, messageDto)
}

func MessageInsert(c *gin.Context) {
	var messageDto dto.MessageDto
	err := c.BindJSON(&messageDto)

	// Error Parsing json param
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	messageDto, er := service.MessageService.InsertMessage(messageDto)

	// Error del Insert
	if er != nil {
		c.JSON(er.Status(), er)
		return
	}

	c.JSON(http.StatusCreated, messageDto)
}

func GetMessagesByPropertyId(c *gin.Context) {
	id := c.Param("id")

	messagesDto, er := service.MessageService.GetMessageByPropertyId(id)

	// Error del Insert
	if er != nil {
		c.JSON(er.Status(), er)
		return
	}

	c.JSON(http.StatusOK, messagesDto)
}

func DeleteMessage(c *gin.Context) {
	id := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = service.MessageService.DeleteMessage(objID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
