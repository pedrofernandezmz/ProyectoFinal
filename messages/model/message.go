package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	Id         primitive.ObjectID `bson:"_id"`
	UserId     int                `bson:"userid"`
	PropertyId string             `bson:"propertyid"`
	Body       string             `bson:"body"`
	CreatedAt  string             `bson:"createdat"`
}

type Messages []Message
