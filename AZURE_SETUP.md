# Azure Resource Setup - Manual Guide (No CLI Required)

Since you don't have Azure CLI installed, here's how to create the resources manually through the Azure Portal:

## Option 1: Install Azure CLI (Recommended if you use Azure frequently)

```bash
# Install Azure CLI on macOS
brew install azure-cli

# Login to Azure
az login

# Then run the script
./infra/setup_azure.sh
```

---

## Option 2: Manual Setup via Azure Portal (Easier for one-time setup)

### Step 1: Create Azure AI Language Service

1. Go to https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Language Service"** or **"Text Analytics"**
4. Click **Create**
5. Fill in:
   - **Subscription**: Your subscription
   - **Resource Group**: Create new → `DynovaAI_RG`
   - **Region**: `East US`
   - **Name**: `dynova-language-001` (or any unique name)
   - **Pricing Tier**: `Free F0` (or S if F0 is unavailable)
6. Click **Review + Create** → **Create**
7. **After deployment**, go to the resource:
   - Click **"Keys and Endpoint"** in the left menu
   - Copy **KEY 1** and **Endpoint**
   - Save these for later!

### Step 2: Create Azure AI Content Safety Service

1. In Azure Portal, click **"Create a resource"** again
2. Search for **"Content Safety"**
3. Click **Create**
4. Fill in:
   - **Subscription**: Your subscription
   - **Resource Group**: Use existing → `DynovaAI_RG`
   - **Region**: `East US`
   - **Name**: `dynova-safety-001` (or any unique name)
   - **Pricing Tier**: `Free F0`
5. Click **Review + Create** → **Create**
6. **After deployment**, go to the resource:
   - Click **"Keys and Endpoint"**
   - Copy **KEY 1** and **Endpoint**
   - Save these!

### Step 3: Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

---

## Step 4: Add to Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your **dynova** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (use the values you copied above):

```
AZURE_LANGUAGE_ENDPOINT=<paste your Language Service endpoint>
AZURE_LANGUAGE_KEY=<paste your Language Service KEY 1>
AZURE_CONTENT_SAFETY_ENDPOINT=<paste your Content Safety endpoint>
AZURE_CONTENT_SAFETY_KEY=<paste your Content Safety KEY 1>
GEMINI_API_KEY=<paste your Gemini API key>
```

5. Make sure to select **Production**, **Preview**, AND **Development** for each variable

---

## Step 5: Deploy

```bash
# Commit your changes
git add .
git commit -m "Add Azure AI and Gemini integration"

# Push to trigger Vercel deployment
git push origin main
```

That's it! Vercel will automatically deploy with the new environment variables.

---

## Quick Reference: What Each Service Does

- **Azure AI Language**: Analyzes sentiment of form responses (positive/neutral/negative)
- **Azure Content Safety**: Moderates content for inappropriate material
- **Google Gemini**: Powers the "Generate with AI" button to create forms from prompts
