package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/dariubs/percent"
)

type Product struct {
	Name                   string            `json:"name"`
	Description            string            `json:"description"`
	Brand                  string            `json:"brand"`
	Categories             []string          `json:"categories"`
	HierarchicalCategories map[string]string `json:"hierarchicalCategories"`
	Type                   string            `json:"type"`
	Price                  float64           `json:"price"`
	OriginalPrice          float64           `json:"original_price"`
	Discount               bool              `json:"has_discount"`
	PriceRange             string            `json:"price_range"`
	Image                  string            `json:"image"`
	Url                    string            `json:"url"`
	FreeShipping           bool              `json:"free_shipping"`
	Popularity             int               `json:"popularity"`
	Rating                 int               `json:"ratingrating"`
	ObjectID               string            `json:"objectID"`
}

type AlgoliaSecrets struct {
	Secrets string `json:"secrets"`
	Index   string `json:"index"`
	Url     string `json:"url"`
}

func HandleRequest(ctx context.Context) {
	//dataindex191020-dev

	// Initialize a session in us-east-1 that the SDK will use
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1")},
	)
	if err != nil {
		fmt.Println("Unable to create a new session %v", err)
	}
	// init S3 bucket session
	svc := s3.New(sess)
	// Get S3 Bucket Item
	requestInput := &s3.GetObjectInput{
		Bucket: aws.String("dataindex191020-dev"),
		Key:    aws.String("products.json"),
	}
	result, err := svc.GetObject(requestInput)
	if err != nil {
		fmt.Println(err)
	}
	defer result.Body.Close()

	// Read the document
	body, err := ioutil.ReadAll(result.Body)
	if err != nil {
		fmt.Println(err)
	}
	// Convert document to a String
	bodyString := fmt.Sprintf("%s", body)

	// Send data to indexing function
	indexProductItems(bodyString)
}

func main() {
	lambda.Start(HandleRequest)
}

func indexProductItems(json_data string) {
	// Initiate Algolia client
	client := search.NewClient(os.Getenv("APP_ID"), os.Getenv("ALGOLIA_API_KEY"))
	index := client.InitIndex(os.Getenv("ALGOLIA_INDEX"))

	var products []Product

	// Convert string to bytes
	data := []byte(json_data)
	// unmarshal items to product struct array
	err := json.Unmarshal(data, &products)
	if err != nil {
		fmt.Println("error unmarshalling products")
		fmt.Println(err)
	}
	// iterate over products
	for i, product := range products {
		found := contains(product.Categories, "camera")
		if found == true {
			//if  camera category found, get 20% of price
			perc := percent.PercentFloat(20, product.Price)
			// round to the lowest whole integer and update product index from slice
			// after reducing cost by 20%
			products[i].Price = float64(int64(product.Price - perc))
			products[i].OriginalPrice = product.Price
			products[i].Discount = true
		}
	}
	// Batching is done automatically by the API client
	_, err = index.SaveObjects(products)
	if err != nil {
		fmt.Println("error indexing products")
		fmt.Println(err)
	}
}

// Iterate over Slice (Array) and returns true if string contained found  regardless of casing
func contains(s []string, e string) bool {
	for _, a := range s {
		if strings.Contains(strings.ToLower(a), strings.ToLower(e)) {
			return true
		}
	}
	return false
}
