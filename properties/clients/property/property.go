package property

import (
	"context"
	"fmt"
	model "properties/models"
	"properties/utils/db"

	log "github.com/sirupsen/logrus"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetById(id string) model.Property {
	var property model.Property
	db := db.MongoDb
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println(err)
		return property
	}
	err = db.Collection("properties").FindOne(context.TODO(), bson.D{{"_id", objID}}).Decode(&property)
	if err != nil {
		fmt.Println(err)
		return property
	}
	return property

}

func GetAll() model.Properties {
	var properties model.Properties

	db := db.MongoDb

	cursor, err := db.Collection("properties").Find(context.TODO(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.TODO(), &properties); err != nil {
		log.Fatal(err)
	}

	return properties
}

//func GetRandom(cantidad int) model.Properties {}

func Insert(property model.Property) model.Property {
	db := db.MongoDb
	insertProperty := property
	insertProperty.Id = primitive.NewObjectID()
	_, err := db.Collection("properties").InsertOne(context.TODO(), &insertProperty)

	if err != nil {
		fmt.Println(err)
		return property
	}
	fmt.Println("id insertada: ", insertProperty.Id)
	property.Id = insertProperty.Id
	return property
}

func GetCity() model.Properties {
	var properties model.Properties

	db := db.MongoDb

	cursor, err := db.Collection("properties").Find(context.TODO(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.TODO(), &properties); err != nil {
		log.Fatal(err)
	}

	return properties
}

// func GetCountry() model.Properties {
// 	var properties model.Properties

// 	db := db.MongoDb

// 	cursor, err := db.Collection("properties").Find(context.TODO(), bson.D{{}})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if err = cursor.All(context.TODO(), &properties); err != nil {
// 		log.Fatal(err)
// 	}

// 	return properties
// }
// func GetService() model.Properties {
// 	var properties model.Properties

// 	db := db.MongoDb

// 	cursor, err := db.Collection("properties").Find(context.TODO(), bson.D{{}})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if err = cursor.All(context.TODO(), &properties); err != nil {
// 		log.Fatal(err)
// 	}

// 	return properties
// }
