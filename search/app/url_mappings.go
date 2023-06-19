package app

import (
	solrController "search/controllers/solr"

	log "github.com/sirupsen/logrus"
)

func mapUrls() {
	router.GET("/search/:solrQuery", solrController.GetQuery)
	router.GET("/properties/:id", solrController.Add)

	log.Info("Finishing mappings configurations")
}
