package message

import (
	"context"
	"fmt"
	model "messages/model"
	"messages/utils/db"
	e "messages/utils/errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetMessageById(id string) model.Message {
	var message model.Message
	db := db.MongoDb
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println(err)
		return message
	}
	err = db.Collection("messages").FindOne(context.TODO(), bson.D{{"_id", objID}}).Decode(&message)
	if err != nil {
		fmt.Println(err)
		return message
	}
	return message

}

func InsertMessage(message model.Message) model.Message {
	db := db.MongoDb
	insertMessage := message
	insertMessage.Id = primitive.NewObjectID()
	_, err := db.Collection("messages").InsertOne(context.TODO(), &insertMessage)

	if err != nil {
		fmt.Println(err)
		return message
	}

	fmt.Println("id insertada: ", insertMessage.Id)
	message.Id = insertMessage.Id
	return message
}

func GetMessageByPropertyId(id string) model.Messages {
	var messages model.Messages
	db := db.MongoDb

	cursor, err := db.Collection("messages").Find(context.TODO(), bson.D{{"propertyid", id}})
	if err != nil {
		fmt.Println(err)
		return messages
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var message model.Message
		err := cursor.Decode(&message)
		if err != nil {
			fmt.Println(err)
		}
		messages = append(messages, message)
	}
	if err := cursor.Err(); err != nil {
		fmt.Println(err)
	}

	return messages
}

func DeleteMessage(message model.Message) e.ApiError {
	db := db.MongoDb

	filter := bson.M{"_id": message.Id}

	result, err := db.Collection("messages").DeleteOne(context.Background(), filter)

	if err != nil {
		return e.NewInternalServerApiError("Error deleting", err)
	}

	if result.DeletedCount == 0 {
		return e.NewNotFoundApiError("Message not found")
	}

	return nil
}
