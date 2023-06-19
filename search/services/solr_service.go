package services

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"search/dto"
	client "search/services/repositories"
	e "search/utils/errors"
	"strconv"

	logger "github.com/sirupsen/logrus"
)

type SolrService struct {
	solr *client.SolrClient
}

func NewSolrServiceImpl(
	solr *client.SolrClient,
) *SolrService {
	return &SolrService{
		solr: solr,
	}
}

func (s *SolrService) Add(id string) e.ApiError {
	var propertyDto dto.PropertyDto
	resp, err := http.Get("http://host.docker.internal:8090/properties/" + id + "/id")
	if err != nil {
		logger.Debugf("error getting property %s: %v", id, err)
		return e.NewBadRequestApiError("error getting property " + id)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		logger.Debugf("bad status code %d", resp.StatusCode)
		return e.NewBadRequestApiError("bad status code " + strconv.Itoa(resp.StatusCode))
	}

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		logger.Debugf("error reading response body: %v", err)
		return e.NewBadRequestApiError("error reading response body")
	}

	err = json.Unmarshal(body, &propertyDto)

	if err != nil {
		logger.Debugf("error in unmarshal of property %s: %v", id, err)
		return e.NewBadRequestApiError("error in unmarshal of property")
	}

	err = s.solr.AddClient(propertyDto)
	if err != nil {
		logger.Debugf("error adding to solr: %v", err)
		return e.NewInternalServerApiError("Adding to Solr error", err)
	}
	return nil
}

func (s *SolrService) GetQuery(query string) (dto.PropertiesArrayDto, e.ApiError) {
	var propertiesArrayDto dto.PropertiesArrayDto

	propertiesArrayDto, err := s.solr.GetQuery(query)
	if err != nil {
		return propertiesArrayDto, e.NewBadRequestApiError("Solr failed")
	}

	return propertiesArrayDto, nil
}
