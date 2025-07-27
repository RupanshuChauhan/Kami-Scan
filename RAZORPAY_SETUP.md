# KamiScan Razorpay Payment Integration

This application now uses **Razorpay** instead of Stripe for payment processing, which is perfect for Indian users and businesses.

## Payment Plans

1. **Free Plan**: ₹0 - 5 PDF summaries per month
2. **Starter Plan**: ₹299/month - 50 PDF summaries per month
3. **Professional Plan**: ₹899/month - 500 PDF summaries per month  
4. **Enterprise Plan**: ₹2,499/month - Unlimited PDF summaries

## Setup Instructions

### 1. Razorpay Account Setup

1. Create a Razorpay account at [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Complete KYC verification
3. Get your API credentials from Settings > API Keys
4. Note down your `Key ID` and `Key Secret`

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"

# Other required variables
DATABASE_URL="your-neon-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ADMIN_EMAIL="vaivhavchauhan2162003@gmail.com"
```

### 3. Database Migration

Run the database migration to update the payment schema:

```bash
npx prisma db push
```

### 4. Test the Integration

1. Start the development server: `npm run dev`
2. Go to `/pricing` page
3. Try the payment flow (use test mode for development)

## Features

- **Indian Currency Support**: All payments in INR (₹)
- **Secure Payment Processing**: Signature verification for all transactions
- **Subscription Management**: Automatic plan upgrades and usage tracking
- **Admin Privileges**: Free unlimited access for admin users
- **Real-time Updates**: Immediate subscription activation after payment

## Payment Flow

1. User selects a plan on the pricing page
2. Razorpay checkout opens with prefilled details
3. User completes payment via UPI, cards, or net banking
4. Payment is verified using Razorpay signatures
5. User subscription is automatically updated
6. Usage limits are applied based on the selected plan

## Security

- All payments are processed securely through Razorpay
- Payment signatures are verified server-side
- No sensitive payment data is stored in the application
- Webhook signature validation prevents tampering

## Admin Features

Users with the admin email (`vaivhavchauhan2162003@gmail.com`) automatically get:
- Unlimited free access to all features
- No payment required
- Full administrative privileges

## Production Deployment

1. Switch to Razorpay live mode
2. Update environment variables with live credentials
3. Ensure proper webhook configuration
4. Test the complete payment flow

## Support

For payment-related issues, users can contact Razorpay support or reach out through the application's contact form.
