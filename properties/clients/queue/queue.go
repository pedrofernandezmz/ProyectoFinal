package queue

import (
	"context"
	"fmt"
	e "properties/utils/errors"
	"time"

	log "github.com/sirupsen/logrus"

	amqp "github.com/rabbitmq/amqp091-go"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ:", err)
	}
}

func SendMessage(itemId string, action string, message string) e.ApiError {
	conn, err := amqp.Dial("amqp://user:password@rabbit:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")

	defer conn.Close()

	channel, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer channel.Close()

	err = channel.ExchangeDeclare(
		"properties",
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return e.NewBadRequestApiError("Failed to declare an exhange")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	routingKey := fmt.Sprintf("%s.%s", itemId, action)
	body := message
	err = channel.PublishWithContext(ctx,
		"properties",
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(body),
		})
	if err != nil {
		return e.NewBadRequestApiError("Failed to publish a message")
	}
	log.Printf("[x] Sent %s\n", body)
	return nil
}
