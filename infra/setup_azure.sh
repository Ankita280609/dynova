#!/bin/bash

# Configuration
RESOURCE_GROUP="DynovaAI_RG"
LOCATION="eastus"
LANG_SERVICE_NAME="dynova-language-$RANDOM"
SAFETY_SERVICE_NAME="dynova-safety-$RANDOM"

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting Azure Resource Provisioning for Dynova...${NC}"

# Check if az CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI could not be found. Please install it to proceed."
    exit 1
fi

# Create Resource Group
echo "Creating Resource Group: $RESOURCE_GROUP..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none

# Create Azure AI Language Service
echo "Creating Azure AI Language Service: $LANG_SERVICE_NAME..."
az cognitiveservices account create \
    --name $LANG_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind TextAnalytics \
    --sku F0 \
    --location $LOCATION \
    --yes \
    --output none

# Create Azure Content Safety Service
echo "Creating Azure Content Safety Service: $SAFETY_SERVICE_NAME..."
az cognitiveservices account create \
    --name $SAFETY_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind ContentSafety \
    --sku F0 \
    --location $LOCATION \
    --yes \
    --output none

# Retrieve Keys and Endpoints
echo -e "${GREEN}Retrieving Keys and Endpoints...${NC}"

LANG_ENDPOINT=$(az cognitiveservices account show --name $LANG_SERVICE_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
LANG_KEY=$(az cognitiveservices account keys list --name $LANG_SERVICE_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

SAFETY_ENDPOINT=$(az cognitiveservices account show --name $SAFETY_SERVICE_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
SAFETY_KEY=$(az cognitiveservices account keys list --name $SAFETY_SERVICE_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

echo "--------------------------------------------------"
echo -e "${GREEN}Provisioning Complete!${NC}"
echo "Please add the following to your backend .env file:"
echo ""
echo "AZURE_LANGUAGE_ENDPOINT=$LANG_ENDPOINT"
echo "AZURE_LANGUAGE_KEY=$LANG_KEY"
echo "AZURE_CONTENT_SAFETY_ENDPOINT=$SAFETY_ENDPOINT"
echo "AZURE_CONTENT_SAFETY_KEY=$SAFETY_KEY"
echo "--------------------------------------------------"
