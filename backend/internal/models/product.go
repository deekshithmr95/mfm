package models

import "time"

type Product struct {
	ID              string   `json:"id" dynamodbav:"id"`
	Name            string   `json:"name" dynamodbav:"name"`
	FarmerID        string   `json:"farmerId" dynamodbav:"farmerId"`
	FarmerName      string   `json:"farmer" dynamodbav:"farmerName"`
	Image           string   `json:"image" dynamodbav:"image"`
	OriginalPrice   float64  `json:"originalPrice" dynamodbav:"originalPrice"`
	OfferPrice      float64  `json:"offerPrice" dynamodbav:"offerPrice"`
	DiscountPercent int      `json:"discountPercent" dynamodbav:"discountPercent"`
	Stock           int      `json:"stock" dynamodbav:"stock"`
	Category        string   `json:"category" dynamodbav:"category"`
	Unit            string   `json:"unit" dynamodbav:"unit"`
	Description     string   `json:"description" dynamodbav:"description"`
	CreatedAt       string   `json:"createdAt" dynamodbav:"createdAt"`

	// Farmer provenance
	FarmerLocation string `json:"farmerLocation,omitempty" dynamodbav:"farmerLocation,omitempty"`
	FarmerSince    string `json:"farmerSince,omitempty" dynamodbav:"farmerSince,omitempty"`
	FarmingMethod  string `json:"farmingMethod,omitempty" dynamodbav:"farmingMethod,omitempty"`
	Certifications []string `json:"certifications,omitempty" dynamodbav:"certifications,omitempty"`

	// Harvest info
	HarvestDate string `json:"harvestDate,omitempty" dynamodbav:"harvestDate,omitempty"`
	ShelfLife   string `json:"shelfLife,omitempty" dynamodbav:"shelfLife,omitempty"`

	// Badges: seasonal | featured | just_harvested | bestseller | new
	Badges []string `json:"badges,omitempty" dynamodbav:"badges,omitempty"`

	// Social proof
	Rating      float64 `json:"rating,omitempty" dynamodbav:"rating,omitempty"`
	ReviewCount int     `json:"reviewCount,omitempty" dynamodbav:"reviewCount,omitempty"`
}

type CreateProductInput struct {
	Name            string   `json:"name"`
	Image           string   `json:"image"`
	OriginalPrice   float64  `json:"originalPrice"`
	OfferPrice      float64  `json:"offerPrice"`
	DiscountPercent int      `json:"discountPercent"`
	Stock           int      `json:"stock"`
	Category        string   `json:"category"`
	Unit            string   `json:"unit"`
	Description     string   `json:"description"`
	FarmerLocation  string   `json:"farmerLocation,omitempty"`
	FarmerSince     string   `json:"farmerSince,omitempty"`
	FarmingMethod   string   `json:"farmingMethod,omitempty"`
	Certifications  []string `json:"certifications,omitempty"`
	HarvestDate     string   `json:"harvestDate,omitempty"`
	ShelfLife       string   `json:"shelfLife,omitempty"`
	Badges          []string `json:"badges,omitempty"`
	Rating          float64  `json:"rating,omitempty"`
	ReviewCount     int      `json:"reviewCount,omitempty"`
}

type UpdateProductInput struct {
	Name            *string   `json:"name,omitempty"`
	Image           *string   `json:"image,omitempty"`
	OriginalPrice   *float64  `json:"originalPrice,omitempty"`
	OfferPrice      *float64  `json:"offerPrice,omitempty"`
	DiscountPercent *int      `json:"discountPercent,omitempty"`
	Stock           *int      `json:"stock,omitempty"`
	Category        *string   `json:"category,omitempty"`
	Unit            *string   `json:"unit,omitempty"`
	Description     *string   `json:"description,omitempty"`
	FarmerLocation  *string   `json:"farmerLocation,omitempty"`
	FarmerSince     *string   `json:"farmerSince,omitempty"`
	FarmingMethod   *string   `json:"farmingMethod,omitempty"`
	Certifications  []string  `json:"certifications,omitempty"`
	HarvestDate     *string   `json:"harvestDate,omitempty"`
	ShelfLife       *string   `json:"shelfLife,omitempty"`
	Badges          []string  `json:"badges,omitempty"`
	Rating          *float64  `json:"rating,omitempty"`
	ReviewCount     *int      `json:"reviewCount,omitempty"`
}

func NewProduct(input CreateProductInput, farmerID, farmerName string) Product {
	return Product{
		ID:              "",
		Name:            input.Name,
		FarmerID:        farmerID,
		FarmerName:      farmerName,
		Image:           input.Image,
		OriginalPrice:   input.OriginalPrice,
		OfferPrice:      input.OfferPrice,
		DiscountPercent: input.DiscountPercent,
		Stock:           input.Stock,
		Category:        input.Category,
		Unit:            input.Unit,
		Description:     input.Description,
		CreatedAt:       time.Now().UTC().Format(time.RFC3339),
		FarmerLocation:  input.FarmerLocation,
		FarmerSince:     input.FarmerSince,
		FarmingMethod:   input.FarmingMethod,
		Certifications:  input.Certifications,
		HarvestDate:     input.HarvestDate,
		ShelfLife:       input.ShelfLife,
		Badges:          input.Badges,
		Rating:          input.Rating,
		ReviewCount:     input.ReviewCount,
	}
}
