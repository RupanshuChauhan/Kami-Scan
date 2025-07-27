# KamiScan - AI-Powered PDF Smart Summarizer

KamiScan is a modern AI-powered PDF smart summarizer website with cutting-edge features and a professional design.

## ✨ Features

- **Zero Latency AI Processing** - Instant PDF summarization using advanced AI
- **Google Sign-In Authentication** - Secure user authentication
- **Admin Privileges** - Free unlimited access
- **Liquify Navigation Bar** - Modern animated header with magic effects
- **Professional Design** - Beautiful header and footer with gradient themes
- **Instant Touch Effects** - Magic button animations and hover effects
- **In-Website Purchases** - Integrated payment system for premium features
- **User Profile System** - Complete profile management with settings
- **Privacy Controls** - Comprehensive privacy and notification settings
- **Usage Analytics** - Track document processing statistics

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local` and configure your API keys:
   - GEMINI_API_KEY (for AI processing)
   - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET (for OAuth)
   - STRIPE keys (for payments)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Animations:** Framer Motion for smooth transitions
- **AI Processing:** Google Gemini AI
- **Authentication:** NextAuth.js with Google Provider
- **Payments:** Stripe integration
- **Icons:** Lucide React
- **File Handling:** React Dropzone

## 📁 Project Structure

```
src/
├── app/
│   ├── api/summarize/     # PDF processing API
│   ├── profile/           # User profile page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── Header.tsx         # Liquify navigation header
│   ├── Footer.tsx         # Professional footer
│   └── PDFUploader.tsx    # AI PDF processor
└── lib/                   # Utilities and configurations
```

## 🔧 Configuration

The application includes:
- Responsive design for all devices
- Dark theme with purple/blue gradients
- Toast notifications for user feedback
- Error handling and validation
- SEO optimization

## 🎨 Design Features

- **Modern Gradient Backgrounds**
- **Liquid Animation Effects**
- **Magic Button Interactions**
- **Professional Typography**
- **Instant Visual Feedback**

## 🔐 Admin Access

The email `vaivhavchauhan2162003@gmail.com` has unlimited free access to all features.

## 📝 License

MIT License - Built with ❤️ for intelligent document processing.
