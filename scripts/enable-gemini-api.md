# How to Enable Gemini API for Google Cloud

## Option 1: Manual Steps (Recommended)

1. **Sign in to Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Sign in with your Google account

2. **Select your project**
   - In the top navigation bar, click on the project dropdown
   - Select project `blog-6a0bf` (or create it if it doesn't exist)

3. **Enable the Gemini API**
   - Go to "APIs & Services" → "Library"
   - Search for "Gemini API" or "Generative AI API"
   - Click on "Gemini API" 
   - Click "Enable"

4. **Alternative direct link** (if the above doesn't work):
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Make sure you're in the correct project
   - Click "Enable"

## Option 2: Using Google Cloud CLI

If you have `gcloud` CLI installed:

```bash
# Install gcloud CLI (if not already installed)
# macOS: brew install google-cloud-sdk

# Authenticate
gcloud auth login

# Set your project
gcloud config set project blog-6a0bf

# Enable the Gemini API
gcloud services enable generativelanguage.googleapis.com
```

## Option 3: Alternative Translation Methods

If you continue having issues with Gemini API, consider:

1. **Use a different translation service** (LibreTranslate, DeepL, etc.)
2. **Manual translation** for important content
3. **Use a different Google Cloud project** that already has the API enabled

## Troubleshooting

- **403 Error**: Make sure you have the necessary permissions for the project
- **Project not found**: Create a new project or check the project ID
- **API not available**: The Gemini API might not be available in your region 