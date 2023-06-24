package app

import (
	userController "users/controllers/user"

	log "github.com/sirupsen/logrus"
)

func mapUrls() {

	// Users Mapping
	router.GET("/user/:id", userController.GetUserById)
	router.GET("/user", userController.GetUsers)
	router.POST("/user", userController.UserInsert)
	router.POST("/login", userController.Login)
	router.DELETE("/userdelete/:id", userController.DeleteUser)

	log.Info("Finishing mappings configurations")
}
