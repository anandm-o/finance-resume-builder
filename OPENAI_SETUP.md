# OpenAI API Setup Guide for AI Resume Parsing

## 🚀 **What This Enables:**

Your Finance Resume Builder now has **AI-powered resume parsing** that can:
- **Extract information** from uploaded resumes (PDF/DOCX)
- **Enhance bullet points** with finance-specific language
- **Fill missing gaps** with AI suggestions
- **Optimize content** for ATS systems
- **Generate professional** finance terminology

## 🔑 **Step 1: Get OpenAI API Key**

1. **Go to** [OpenAI Platform](https://platform.openai.com/)
2. **Sign up** or **Sign in** to your account
3. **Go to** "API Keys" in the left sidebar
4. **Click** "Create new secret key"
5. **Name it** `finance-resume-builder`
6. **Copy the key** (starts with `sk-...`)

## ⚠️ **Important Security Notes:**

- **Never share** your API key publicly
- **Keep it secure** - it's like a password
- **Monitor usage** - OpenAI charges per request
- **Free tier available** - $5 credit to start

## 🔧 **Step 2: Add to Environment Variables**

Add this line to your `.env.local` file:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your_actual_api_key_here
```

**Your complete `.env.local` should now look like:**

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI Configuration
OPENAI_API_KEY=sk-your_actual_api_key_here

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

## 🎯 **Step 3: Test AI Integration**

1. **Save** your `.env.local` file
2. **Restart** your development server (`npm run dev`)
3. **Go to** `/upload` page
4. **Upload a resume** to test AI parsing

## 💰 **Costs & Usage:**

### **Free Tier:**
- **$5 credit** when you sign up
- **Enough for** ~100-200 resume parses
- **No credit card** required initially

### **Paid Tier:**
- **$0.03 per 1K tokens** (very affordable)
- **Typical resume parse**: 500-1000 tokens
- **Cost per resume**: ~$0.015 - $0.03

### **Token Usage:**
- **Resume parsing**: ~500-800 tokens
- **Content enhancement**: ~300-500 tokens
- **Total per resume**: ~800-1300 tokens

## 🧪 **Testing Your Setup:**

### **Test with Sample Resume:**
1. **Create a simple** Word/PDF resume
2. **Upload it** to your app
3. **Watch AI** extract and enhance content
4. **Check console** for any errors

### **What to Look For:**
- **No API key errors** in console
- **AI processing steps** display correctly
- **Parsed data** appears in preview
- **Enhanced content** shows improvements

## 🚨 **Common Issues & Solutions:**

### **"Invalid API Key" Error:**
- **Check** your `.env.local` file
- **Verify** the key starts with `sk-`
- **Restart** your development server

### **"Rate Limit" Error:**
- **Wait** a few minutes
- **Check** your OpenAI usage dashboard
- **Upgrade** to paid plan if needed

### **"Model Not Found" Error:**
- **Ensure** you have access to GPT-4
- **Check** your OpenAI account status
- **Verify** API key permissions

## 🔒 **Security Best Practices:**

1. **Never commit** `.env.local` to GitHub
2. **Use environment variables** in production
3. **Monitor API usage** regularly
4. **Set spending limits** in OpenAI dashboard
5. **Rotate API keys** periodically

## 📱 **Production Deployment:**

### **Vercel:**
- Add `OPENAI_API_KEY` in Environment Variables
- Redeploy your application

### **Netlify:**
- Add `OPENAI_API_KEY` in Site Settings
- Trigger new deployment

### **Other Platforms:**
- Add environment variable in your hosting platform
- Ensure it's named exactly `OPENAI_API_KEY`

## 🎉 **What You Get:**

With AI integration, your app becomes:
- **Intelligent**: Understands resume content
- **Efficient**: Automates data extraction
- **Professional**: Enhances finance language
- **Comprehensive**: Identifies missing elements
- **Competitive**: Industry-leading features

## 💡 **Pro Tips:**

- **Start with free tier** to test functionality
- **Monitor costs** in OpenAI dashboard
- **Use realistic resumes** for testing
- **Backup your API key** securely
- **Test with different** file formats

## 🆘 **Need Help?**

1. **Check OpenAI** [documentation](https://platform.openai.com/docs)
2. **Verify API key** format and permissions
3. **Test with simple** resume first
4. **Check browser console** for errors
5. **Restart server** after changes

---

**🎯 You're now building an AI-powered resume builder!** 

The combination of Firebase (authentication + database) + OpenAI (AI parsing + enhancement) makes your app a **professional-grade tool** that can compete with expensive enterprise solutions! 🚀✨

