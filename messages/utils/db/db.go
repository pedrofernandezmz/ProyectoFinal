package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoDb *mongo.Database
var client *mongo.Client

func Disconect_db() {

	client.Disconnect(context.TODO())
}

func Init_db() error {

	clientOpts := options.Client().ApplyURI("mongodb://root:root@mongo_db:27017/?authMechanism=SCRAM-SHA-256")
	cli, err := mongo.Connect(context.TODO(), clientOpts)
	client = cli
	if err != nil {
		return err
	}

	MongoDb = client.Database("Properties")

	return nil
}
