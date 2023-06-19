package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Address struct {
}

type Property struct {
	Id          primitive.ObjectID `bson:"_id"`
	Tittle      string             `bson:"tittle"`
	Description string             `bson:"description"`
	Size        int                `bson:"size"`
	Rooms       int                `bson:"rooms"`
	Bathrooms   int                `bson:"bathrooms"`
	Price       int                `bson:"price"`
	Image       string             `bson:"image"`
	UserId      int                `bson:"userid"`
	Street      string             `bson:"street"`
	City        string             `bson:"city"`
}
type Properties []Property
