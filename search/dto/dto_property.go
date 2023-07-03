package dto

type PropertyArrayDto struct {
	Id          string   `json:"id"`
	Tittle      []string `json:"tittle"`
	Description []string `json:"description"`
	Size        []int    `json:"size"`
	// Rooms       []int    `json:"rooms"`
	// Bathrooms   []int    `json:"bathrooms"`
	// Price       []int    `json:"price"`
	Image       []string `json:"image"`
	UserId      []int    `json:"userid"`
	Street      []string `json:"street"`
	City        []string `json:"city"`
}

type PropertyDto struct {
	Id          string `json:"id"`
	Tittle      string `json:"tittle"`
	Description string `json:"description"`
	Size        int    `json:"size"`
	// Rooms       int    `json:"rooms"`
	// Bathrooms   int    `json:"bathrooms"`
	// Price       int    `json:"price"`
	Image       string `json:"image"`
	UserId      int    `json:"userid"`
	Street      string `json:"street"`
	City        string `json:"city"`
}

type PropertiesDto []PropertyDto
type PropertiesArrayDto []PropertyArrayDto
