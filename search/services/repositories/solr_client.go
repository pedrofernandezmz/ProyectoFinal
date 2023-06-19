package repositories

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"

	"search/dto"
	e "search/utils/errors"
	"strings"

	log "github.com/sirupsen/logrus"
	logger "github.com/sirupsen/logrus"
	"github.com/stevenferrer/solr-go"
)

type SolrClient struct {
	Client     *solr.JSONClient
	Collection string
}

func (sc *SolrClient) AddClient(PropertyDto dto.PropertyDto) e.ApiError {
	var addPropertyDto dto.AddDto
	addPropertyDto.Add = dto.DocDto{Doc: PropertyDto}
	data, err := json.Marshal(addPropertyDto)

	reader := bytes.NewReader(data)
	if err != nil {
		return e.NewBadRequestApiError("Error getting json")
	}
	resp, err := sc.Client.Update(context.TODO(), sc.Collection, solr.JSON, reader)
	logger.Debug(resp)
	if err != nil {
		return e.NewBadRequestApiError("Error in solr")
	}

	er := sc.Client.Commit(context.TODO(), sc.Collection)
	if er != nil {
		logger.Debug("Error committing load")
		return e.NewInternalServerApiError("Error committing to solr", er)
	}
	return nil
}

func (sc *SolrClient) GetQuery(query string) (dto.PropertiesArrayDto, e.ApiError) {
	var response dto.SolrResponseDto
	var propertiesArrayDto dto.PropertiesArrayDto
	query = strings.Replace(query, " ", "%20", -1)

	q, err := http.Get("http://host.docker.internal:8983/solr/property/select?q=" + query + "&df=text")

	if err != nil {
		return propertiesArrayDto, e.NewBadRequestApiError("error getting from solr")
	}

	defer q.Body.Close()

	err = json.NewDecoder(q.Body).Decode(&response)

	if err != nil {
		log.Debug("error: ", err)
		return propertiesArrayDto, e.NewBadRequestApiError("error in unmarshal")
	}

	for _, doc := range response.Response.Docs {
		propertyArrayDto := doc
		propertiesArrayDto = append(propertiesArrayDto, propertyArrayDto)
	}

	return propertiesArrayDto, nil
}
