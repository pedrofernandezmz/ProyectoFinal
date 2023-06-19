package main

import (
	"properties/router"
	"properties/utils/cache"

	"properties/utils/db"

	"fmt"
)

func main() {
	router.MapUrls()

	err := db.Init_db()
	defer db.Disconect_db()
	cache.Init_cache()

	if err != nil {
		fmt.Println("Cannot init db")
		fmt.Println(err)
		return
	}
	fmt.Println("Starting server")
	router.Gin_router.Run(":8090")
}
