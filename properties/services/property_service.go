package services

import (
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	propertyClient "properties/clients/property"
	queueClient "properties/clients/queue"
	"properties/dtos"
	model "properties/models"
	e "properties/utils/errors"
	"strings"
	"sync"

	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type propertyService struct{}

type propertyServiceInterface interface {
	GetProperty(id string) (dtos.PropertyDto, e.ApiError)
	GetProperties() (dtos.PropertiesDto, e.ApiError)
	InsertMany(propertiesDto dtos.PropertiesDto) (dtos.PropertiesDto, e.ApiError)
	InsertProperty(propertyDto dtos.PropertyDto) (dtos.PropertyDto, e.ApiError)
	GetByParam(param string) ([]string, e.ApiError)
	DeletePropertys(userid int) e.ApiError
	DeleteProperty(id primitive.ObjectID) e.ApiError
}

var (
	PropertyService propertyServiceInterface
)

func init() {
	PropertyService = &propertyService{}
}

func (s *propertyService) GetProperties() (dtos.PropertiesDto, e.ApiError) {
	var properties = propertyClient.GetAll()
	var propertiesDtoArray dtos.PropertiesDto

	var wg sync.WaitGroup
	wg.Add(len(properties))

	for _, property := range properties {
		var propertyDto dtos.PropertyDto

		if property.Id.Hex() == "000000000000000000000000" {
			return propertiesDtoArray, e.NewBadRequestApiError("error in insert")
		}
		wg.Done()
		// go func(url string) {
		// 	defer wg.Done()
		// 	fileName := RandStringBytes() + ".jpg"
		// 	fmt.Println("Downloading", url, "to", fileName)

		// 	output, err := os.Create(fileName)
		// 	if err != nil {
		// 		log.Fatal("Error while creating", fileName, "- ", err)
		// 	}
		// 	defer output.Close()

		// 	res, err := http.Get(url)
		// 	if err != nil {
		// 		log.Fatal("http get error: ", err)
		// 	} else {
		// 		defer res.Body.Close()
		// 		_, err = io.Copy(output, res.Body)
		// 		if err != nil {
		// 			log.Fatal("Error while downloading", url, "-", err)

		// 		} else {
		// 			fmt.Println("Downloaded", fileName)
		// 		}
		// 	}
		// }(property.Image)
		propertyDto.Tittle = property.Tittle
		propertyDto.Size = property.Size
		propertyDto.Description = property.Description
		propertyDto.Bathrooms = property.Bathrooms
		propertyDto.City = property.City
		propertyDto.Street = property.Street
		propertyDto.Price = property.Price
		propertyDto.Rooms = property.Rooms
		propertyDto.Image = property.Image
		propertyDto.UserId = property.UserId
		propertyDto.Id = property.Id.Hex()

		propertiesDtoArray = append(propertiesDtoArray, propertyDto)
	}
	wg.Wait()
	return propertiesDtoArray, nil

}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandStringBytes() string {
	b := make([]byte, 10)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func (s *propertyService) GetProperty(id string) (dtos.PropertyDto, e.ApiError) {

	var property model.Property = propertyClient.GetById(id)

	var propertyDto dtos.PropertyDto

	if property.Id.Hex() == "000000000000000000000000" {
		return propertyDto, e.NewBadRequestApiError("property not found")
	}
	propertyDto.Tittle = property.Tittle
	propertyDto.Size = property.Size
	propertyDto.Description = property.Description
	propertyDto.Bathrooms = property.Bathrooms
	propertyDto.City = property.City
	propertyDto.Street = property.Street
	propertyDto.Price = property.Price
	propertyDto.Rooms = property.Rooms
	propertyDto.Image = property.Image
	propertyDto.UserId = property.UserId
	propertyDto.Id = property.Id.Hex()

	return propertyDto, nil
}

func (s *propertyService) InsertProperty(propertyDto dtos.PropertyDto) (dtos.PropertyDto, e.ApiError) {

	var property model.Property

	var properties = propertyClient.GetAll()
	var wg sync.WaitGroup
	wg.Add(len(properties))

	property.Tittle = propertyDto.Tittle
	property.Size = propertyDto.Size
	property.Price = propertyDto.Price
	property.Rooms = propertyDto.Rooms
	property.Bathrooms = propertyDto.Bathrooms
	property.Description = propertyDto.Description
	property.Image = propertyDto.Image
	property.City = propertyDto.City
	property.UserId = propertyDto.UserId
	property.Street = propertyDto.Street
	property.UserId = propertyDto.UserId

	property = propertyClient.Insert(property)

	if property.Id.Hex() == "000000000000000000000000" {
		return propertyDto, e.NewBadRequestApiError("error in insert")
	}
	go func(url string, id string) {
		defer wg.Done()
		fileName := id + ".jpg"
		fmt.Println("Downloading", url, "to", fileName)

		output, err := os.Create(fileName)
		if err != nil {
			log.Fatal("Error while creating", fileName, "- ", err)
		}
		defer output.Close()

		res, err := http.Get(url)
		if err != nil {
			log.Fatal("http get error: ", err)
		} else {
			defer res.Body.Close()
			_, err = io.Copy(output, res.Body)
			if err != nil {
				log.Fatal("Error while downloading", url, "-", err)
			} else {
				fmt.Println("Downloaded", fileName)
			}
		}
	}(property.Image, property.Id.Hex())
	propertyDto.Tittle = property.Tittle
	propertyDto.Size = property.Size
	propertyDto.Bathrooms = property.Bathrooms
	propertyDto.Image = property.Image
	propertyDto.City = property.City
	propertyDto.Street = property.Street
	propertyDto.Price = property.Price
	propertyDto.Rooms = property.Rooms
	propertyDto.Image = property.Image
	propertyDto.UserId = property.UserId
	propertyDto.Id = property.Id.Hex()
	err := queueClient.SendMessage(property.Id.Hex(), "create", property.Id.Hex())
	log.Debug(err)

	return propertyDto, nil
}

func DownloadImage(url string, name string) {
	resp, _ := http.Get(url)
	defer resp.Body.Close()
	path := strings.Join([]string{"/images", name}, "/")
	file, _ := os.Create((path))
	defer file.Close()
	_, _ = io.Copy(file, resp.Body)
}

func (s *propertyService) InsertMany(propertiesDto dtos.PropertiesDto) (dtos.PropertiesDto, e.ApiError) {
	var propertiesDtoArray dtos.PropertiesDto
	var properties = propertyClient.GetAll()
	total := len(propertiesDto)
	processed := make(chan string, total)
	var wg sync.WaitGroup
	wg.Add(len(properties))

	for _, propertyDto := range propertiesDto {
		var property model.Property

		property.Tittle = propertyDto.Tittle
		property.Size = propertyDto.Size
		property.Image = propertyDto.Image
		property.Price = propertyDto.Price
		property.Rooms = propertyDto.Rooms
		property.Bathrooms = propertyDto.Bathrooms
		property.Description = propertyDto.Description
		property.UserId = propertyDto.UserId
		property.City = propertyDto.City
		property.Street = propertyDto.Street

		property = propertyClient.Insert(property)
		// go DownloadImage(property.Image, property.Image)

		if property.Id.Hex() == "000000000000000000000000" {
			processed <- "error"
			return propertiesDto, e.NewBadRequestApiError("error in insert")
		}
		processed <- "complete"
		go func(url string, id string) {
			defer wg.Done()
			fileName := id + ".jpg"
			fmt.Println("Downloading", url, "to", fileName)

			output, err := os.Create(fileName)
			if err != nil {
				log.Fatal("Error while creating", fileName, "- ", err)
			}
			defer output.Close()

			res, err := http.Get(url)
			if err != nil {
				log.Fatal("http get error: ", err)
			} else {
				defer res.Body.Close()
				_, err = io.Copy(output, res.Body)
				if err != nil {
					log.Fatal("Error while downloading", url, "-", err)
				} else {
					fmt.Println("Downloaded", fileName)
				}
			}
		}(property.Image, property.Id.Hex())
		propertyDto.Tittle = property.Tittle
		propertyDto.Size = property.Size
		propertyDto.Bathrooms = property.Bathrooms
		propertyDto.City = property.City
		propertyDto.Street = property.Street
		propertyDto.Price = property.Price
		propertyDto.Image = property.Image
		propertyDto.Rooms = property.Rooms
		propertyDto.UserId = property.UserId
		propertyDto.Id = property.Id.Hex()

		err := queueClient.SendMessage(property.Id.Hex(), "create", property.Id.Hex())
		log.Debug(err)
		propertiesDtoArray = append(propertiesDtoArray, propertyDto)
	}

	return propertiesDtoArray, nil
}

//func (s *propertyService) GetRandom(cantidad int) (dtos.PropertyDto, e.ApiError) {}

func Unique(strSlice []string) []string {
	keys := make(map[string]bool)
	list := []string{}
	for _, entry := range strSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func (s *propertyService) GetByParam(param string) ([]string, e.ApiError) {
	var properties = propertyClient.GetAll()

	var array []string

	for _, property := range properties {

		if property.Id.Hex() == "000000000000000000000000" {
			return array, e.NewBadRequestApiError("error in get")
		}

		if param == "city" {
			array = append(array, property.City)
		}

	}
	return Unique(array), nil
}

func (s *propertyService) DeletePropertys(userid int) e.ApiError {

	var property model.Property
	property.UserId = userid

	err := propertyClient.DeletePropertys(property)
	if err != nil {
		return e.NewInternalServerApiError("Error deleting properties", err)
	}
	return nil
}

func (s *propertyService) DeleteProperty(id primitive.ObjectID) e.ApiError {

	var property model.Property
	property.Id = id

	err := propertyClient.DeleteProperty(property)
	if err != nil {
		return e.NewInternalServerApiError("Error deleting property", err)
	}
	return nil
}
