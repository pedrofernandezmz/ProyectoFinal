package services

import (
	"consumer/config"
	client "consumer/services/repositories"
	"fmt"
	"net/http"
	"strings"

	log "github.com/sirupsen/logrus"
)

type ConsumerService struct {
	queue *client.QueueClient
}

func NewConsumer(
	queue *client.QueueClient,
) *ConsumerService {
	return &ConsumerService{
		queue: queue,
	}
}

func (s *ConsumerService) TopicConsumer(topic string) {
	err := s.queue.ProcessMessages(config.EXCHANGE, topic, func(id string) {
		var resp *http.Response
		var err error
		strs := strings.Split(id, ".")
		if len(strs) < 2 {
			resp, err = http.Get(fmt.Sprintf("http://host.docker.internal:8000/properties/" + id))
		}
		log.Debug("Propertie sent " + id)
		if err != nil {
			log.Debug("error in get request")
			log.Debug(resp)
		}
	})
	if err != nil {
		log.Error("Error starting consumer processing", err)
	}
}
