# Deploying Azure AI + Gemini Integration to Vercel

## Step 1: Add Environment Variables in Vercel Dashboard

Go to your Vercel project settings and add these environment variables:

### Required for Azure Services (Get from running `./infra/setup_azure.sh`):
```
AZURE_LANGUAGE_ENDPOINT=https://your-language-service.cognitiveservices.azure.com/
AZURE_LANGUAGE_KEY=your_language_key_here
AZURE_CONTENT_SAFETY_ENDPOINT=https://your-safety-service.cognitiveservices.azure.com/
AZURE_CONTENT_SAFETY_KEY=your_safety_key_here
```

### Required for Gemini (Get from https://makersuite.google.com/app/apikey):
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Existing Variables (Keep these):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**How to add in Vercel:**
1. Go to https://vercel.com/dashboard
2. Select your `dynova` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Make sure to add them for **Production**, **Preview**, and **Development** environments

---

## Step 2: Provision Azure Resources

Run the provisioning script locally (requires Azure CLI):

```bash
cd /Users/adityapathak/.gemini/antigravity/scratch/dynova
./infra/setup_azure.sh
```

This will output the keys and endpoints. Copy them to Vercel as shown in Step 1.

**Don't have Azure CLI?** You can manually create resources in Azure Portal:
- Create a "Language" service (Text Analytics)
- Create a "Content Safety" service
- Copy the keys and endpoints from each

---

## Step 3: Commit and Push Your Code

```bash
cd /Users/adityapathak/.gemini/antigravity/scratch/dynova

# Stage all changes
git add .

# Commit
git commit -m "Add Azure AI Language, Content Safety, and Gemini integration"

# Push to main branch (or your default branch)
git push origin main
```

Vercel will automatically detect the push and trigger a deployment.

---

## Step 4: Verify Deployment

1. **Wait for build**: Check the Vercel dashboard for the build status
2. **Check deployment logs**: Look for any errors in the build/deployment logs
3. **Test the endpoints**:
   - Go to your deployed URL
   - Navigate to the Form Editor
   - Click **"Generate with AI"** button
   - Enter a prompt like "Create a feedback form"
   - Verify it generates a form

---

## Step 5: Test Azure Services (Optional)

You can test the backend endpoints directly:

### Test Sentiment Analysis:
```bash
curl -X POST https://your-app.vercel.app/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this app!"}'
```

### Test Content Moderation:
```bash
curl -X POST https://your-app.vercel.app/api/ai/moderate \
  -H "Content-Type: application/json" \
  -d '{"text": "Test message"}'
```

---

## Troubleshooting

### If deployment fails:
1. Check Vercel build logs for specific errors
2. Verify all environment variables are set correctly
3. Make sure `package.json` has the new dependencies:
   - `@azure/ai-text-analytics`
   - `@azure-rest/ai-content-safety`
   - `@google/generative-ai`

### If AI generation doesn't work:
1. Check browser console for errors
2. Verify `GEMINI_API_KEY` is set in Vercel
3. Check backend logs in Vercel dashboard

### If Azure services fail:
1. Verify the endpoints and keys are correct
2. Check Azure Portal to ensure services are active
3. Verify you have quota/credits available

---

## Summary Checklist

- [ ] Add all 5 environment variables in Vercel
- [ ] Run `./infra/setup_azure.sh` or manually create Azure resources
- [ ] Commit changes: `git add . && git commit -m "Add AI integration"`
- [ ] Push to trigger deployment: `git push origin main`
- [ ] Wait for Vercel to build and deploy
- [ ] Test the "Generate with AI" feature
- [ ] Verify Azure services are working

**That's it!** Your Dynova app will now have AI-powered form generation using your Azure credits.
