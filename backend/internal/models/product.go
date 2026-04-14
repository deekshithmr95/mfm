package models

import "time"

type Product struct {
	ID              string   `json:"id" firestore:"id"`
	Name            string   `json:"name" firestore:"name"`
	FarmerID        string   `json:"farmerId" firestore:"farmerId"`
	FarmerName      string   `json:"farmer" firestore:"farmerName"`
	Image           string   `json:"image" firestore:"image"`
	OriginalPrice   float64  `json:"originalPrice" firestore:"originalPrice"`
	OfferPrice      float64  `json:"offerPrice" firestore:"offerPrice"`
	DiscountPercent int      `json:"discountPercent" firestore:"discountPercent"`
	Stock           int      `json:"stock" firestore:"stock"`
	Category        string   `json:"category" firestore:"category"`
	Unit            string   `json:"unit" firestore:"unit"`
	Description     string   `json:"description" firestore:"description"`
	CreatedAt       string   `json:"createdAt" firestore:"createdAt"`

	// Farmer provenance
	FarmerLocation string `json:"farmerLocation,omitempty" firestore:"farmerLocation,omitempty"`
	FarmerSince    string `json:"farmerSince,omitempty" firestore:"farmerSince,omitempty"`
	FarmingMethod  string `json:"farmingMethod,omitempty" firestore:"farmingMethod,omitempty"`
	Certifications []string `json:"certifications,omitempty" firestore:"certifications,omitempty"`

	// Harvest info
	HarvestDate string `json:"harvestDate,omitempty" firestore:"harvestDate,omitempty"`
	ShelfLife   string `json:"shelfLife,omitempty" firestore:"shelfLife,omitempty"`

	// Badges: seasonal | featured | just_harvested | bestseller | new
	Badges []string `json:"badges,omitempty" firestore:"badges,omitempty"`

	// Social proof
	Rating      float64 `json:"rating,omitempty" firestore:"rating,omitempty"`
	ReviewCount int     `json:"reviewCount,omitempty" firestore:"reviewCount,omitempty"`
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
