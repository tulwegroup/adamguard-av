# AdamGuard Pro - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+
- npm/bun package manager
- Docker (optional)
- SSL certificates for HTTPS

---

## 📱 Mobile Deployment (iOS & Android)

### Setup Capacitor

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialize Capacitor
npx cap init AdamGuard Pro com.adamguard.pro

# Add platforms
npx cap add android
npx cap add ios

# Sync after build
npm run build && npx cap sync
```

### iOS Deployment

```bash
# Open in Xcode
npx cap open ios

# Build for App Store
# 1. Configure signing in Xcode
# 2. Archive the app
# 3. Upload to App Store Connect
```

**iOS Requirements:**
- macOS with Xcode 15+
- Apple Developer Account ($99/year)
- iOS 14.0+ deployment target

### Android Deployment

```bash
# Open in Android Studio
npx cap open android

# Build APK/AAB
cd android
./gradlew assembleRelease
./gradlew bundleRelease
```

**Android Requirements:**
- Android Studio Hedgehog+
- Google Play Developer Account ($25 one-time)
- minSdkVersion 22 (Android 5.1+)

---

## 🔐 Authentication Setup

### Environment Variables

```env
# .env.production
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Email Service (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@adamguard.security

# Database
DATABASE_URL=postgresql://user:pass@host:5432/adamguard

# Push Notifications
FIREBASE_PROJECT_ID=adamguard-pro
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@adamguard-pro.iam.gserviceaccount.com
```

---

## 📧 Email Configuration

### Using Resend

```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'AdamGuard Pro <security@adamguard.security>',
  to: ['user@example.com'],
  subject: 'Security Alert',
  html: '<h1>Threat Detected</h1>'
});
```

### Using SendGrid

```bash
npm install @sendgrid/mail
```

---

## 🔒 RBAC Implementation

### Protecting API Routes

```typescript
import { hasPermission } from '@/lib/rbac';
import { verify } from 'jsonwebtoken';

export async function protectedRoute(
  request: Request, 
  requiredPermission: Permission
) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  const decoded = verify(token, JWT_SECRET);
  
  if (!hasPermission(decoded.role, requiredPermission)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Continue with authorized request
}
```

### Frontend Permission Check

```typescript
import { useAuth } from '@/lib/auth/context';

function ScanButton() {
  const { hasPermission } = useAuth();
  
  if (!hasPermission('scan:full')) {
    return null;
  }
  
  return <Button>Start Full Scan</Button>;
}
```

---

## 🐳 Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t adamguard-pro .
docker run -p 3000:3000 adamguard-pro
```

---

## ☁️ Cloud Deployment Options

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### AWS Amplify

```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

### Google Cloud Run

```bash
gcloud run deploy adamguard-pro \
  --source . \
  --platform managed \
  --region us-central1
```

---

## 🔔 Push Notifications

### Firebase Cloud Messaging Setup

1. Create Firebase project
2. Add Android/iOS apps
3. Download `google-services.json` (Android)
4. Download `GoogleService-Info.plist` (iOS)
5. Configure server key

### Send Push Notification

```typescript
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

await admin.messaging().send({
  token: userDeviceToken,
  notification: {
    title: '⚠️ Threat Detected',
    body: 'Trojan.Emotet blocked in Downloads folder'
  },
  data: {
    type: 'threat_alert',
    threatId: '123'
  }
});
```

---

## 📊 Monitoring & Analytics

### Recommended Tools
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Infrastructure monitoring
- **Google Analytics** - User analytics

---

## ✅ Pre-launch Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Database backups configured
- [ ] Email service tested
- [ ] Push notifications working
- [ ] RBAC permissions verified
- [ ] Mobile apps tested on devices
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] Error monitoring active

---

## 📞 Support

- Documentation: https://docs.adamguard.security
- Support Email: support@adamguard.security
- Status Page: https://status.adamguard.security
