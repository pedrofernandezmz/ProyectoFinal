package solrController

import (
	"net/http"
	"search/dto"
	"search/services"
	client "search/services/repositories"
	con "search/utils/solr"

	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

var (
	Solr = services.NewSolrServiceImpl(
		(*client.SolrClient)(con.NewSolrClient("solr", 8983, "property")),
	)
)

func GetQuery(c *gin.Context) {
	var propertiesArrayDto dto.PropertiesArrayDto
	query := c.Param("solrQuery")

	propertiesArrayDto, err := Solr.GetQuery(query)
	if err != nil {
		log.Debug(propertiesArrayDto)
		c.JSON(http.StatusBadRequest, propertiesArrayDto)
		return
	}

	c.JSON(http.StatusOK, propertiesArrayDto)

}

func Add(c *gin.Context) {
	id := c.Param("id")
	err := Solr.Add(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{})
}
