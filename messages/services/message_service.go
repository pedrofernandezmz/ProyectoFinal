package services

import (
	messageClient "messages/clients/message"
	"messages/dto"
	model "messages/model"
	e "messages/utils/errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type messageService struct{}

type MessageServiceInterface interface {
	GetMessageById(id string) (dto.MessageDto, e.ApiError)
	InsertMessage(messageDto dto.MessageDto) (dto.MessageDto, e.ApiError)
	GetMessageByPropertyId(id string) (dto.MessagesDto, e.ApiError)
	DeleteMessage(id primitive.ObjectID) e.ApiError
}

var (
	MessageService MessageServiceInterface
)

func init() {
	MessageService = &messageService{}
}

func (s *messageService) GetMessageById(id string) (dto.MessageDto, e.ApiError) {

	var message model.Message = messageClient.GetMessageById(id)

	var messageDto dto.MessageDto

	if message.Id.Hex() == "000000000000000000000000" {
		return messageDto, e.NewBadRequestApiError("message not found")
	}

	messageDto.PropertyId = message.PropertyId
	messageDto.UserId = message.UserId
	messageDto.Body = message.Body
	messageDto.CreatedAt = message.CreatedAt
	messageDto.Id = message.Id.Hex()

	return messageDto, nil
}

func (s *messageService) GetMessageByPropertyId(id string) (dto.MessagesDto, e.ApiError) {

	var messages = messageClient.GetMessageByPropertyId(id)

	var messagesArrayDto dto.MessagesDto
	for _, message := range messages {
		var messageDto dto.MessageDto
		if message.Id.Hex() == "000000000000000000000000" {
			return messagesArrayDto, e.NewBadRequestApiError("error in insert")
		}
		messageDto.PropertyId = message.PropertyId
		messageDto.UserId = message.UserId
		messageDto.Body = message.Body
		messageDto.CreatedAt = message.CreatedAt
		messageDto.Id = message.Id.Hex()
		messagesArrayDto = append(messagesArrayDto, messageDto)
	}

	return messagesArrayDto, nil
}
func (s *messageService) DeleteMessage(id primitive.ObjectID) e.ApiError {

	var message model.Message
	message.Id = id

	err := messageClient.DeleteMessage(message)
	if err != nil {
		return e.NewInternalServerApiError("Error deleting message", err)
	}
	return nil
}

func (s *messageService) InsertMessage(messageDto dto.MessageDto) (dto.MessageDto, e.ApiError) {

	var message model.Message

	message.PropertyId = messageDto.PropertyId
	message.UserId = messageDto.UserId
	message.Body = messageDto.Body
	message.CreatedAt = time.Now().Format("2006/01/02 15:04:05")

	message = messageClient.InsertMessage(message)

	if message.Id.Hex() == "000000000000000000000000" {
		return messageDto, e.NewBadRequestApiError("error in insert")
	}
	messageDto.Body = message.Body
	messageDto.CreatedAt = message.CreatedAt
	messageDto.PropertyId = message.PropertyId
	messageDto.UserId = message.UserId
	messageDto.Id = message.Id.Hex()

	return messageDto, nil
}
