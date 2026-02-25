# 🛡️ AdamGuard Pro - AI-Powered Antivirus Dashboard

A modern, production-ready antivirus dashboard with AI-powered threat detection, zero-day protection, and comprehensive security management.

![AdamGuard Pro](https://img.shields.io/badge/AdamGuard-Pro-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![AWS](https://img.shields.io/badge/AWS-ECS%20Fargate-orange?style=flat-square&logo=amazon-aws)

## ✨ Features

### 🔐 Security Features
- **Real-time Protection** - Continuous malware scanning and threat detection
- **AI-Powered Analysis** - 4 AI security agents for advanced threat detection
- **Zero-Day Protection** - Proactive defense against unknown threats
- **Quarantine Management** - Safe isolation and recovery of threats

### 👥 User Management
- **Role-Based Access Control (RBAC)** - Granular permissions system
- **User Modes** - Child, Grandparent, Parent, Guest modes
- **Team Management** - Collaborative security monitoring
- **Super Admin Dashboard** - Complete organization control

### 💰 Subscription Plans

| Plan | Price | Devices | Features |
|------|-------|---------|----------|
| Essential | Free | 1 | Basic protection |
| Family | $6.99/mo | 5 | AI protection, parental controls |
| Business | $14.99/mo | 25 | Team management, VPN, SLA |
| Enterprise | $24.99/seat | Unlimited | SSO, SIEM, 24/7 support |

### 🌍 Regional Pricing
- Supports 10 global regions with PPP adjustments
- 22 languages supported
- Localized currency and pricing

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/tulwegroup/adamguard-av.git
cd adamguard-av

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State**: Zustand
- **Database**: Prisma + PostgreSQL
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Animations**: Framer Motion

## ☁️ AWS Deployment

### Prerequisites
- AWS Account
- GitHub repository
- Domain name (optional)

### One-Click Deployment

```bash
# Deploy to production
bash deploy.sh production us-east-1
```

### GitHub Actions CI/CD

The repository includes a complete CI/CD pipeline. To enable automatic deployments:

1. **Fork this repository** to your GitHub account

2. **Add GitHub Secrets** (Settings → Secrets and variables → Actions):

   | Secret | Description |
   |--------|-------------|
   | `AWS_ACCESS_KEY_ID` | Your AWS access key |
   | `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
   | `NEXTAUTH_SECRET` | Random 64-character string |
   | `JWT_SECRET` | Random 64-character string |

3. **Push to main branch** - Deployment triggers automatically!

### Generate Secrets

```bash
# Generate random secrets
openssl rand -base64 64
```

### Infrastructure

The CloudFormation template creates:
- ✅ VPC with public/private subnets
- ✅ ECS Fargate cluster with auto-scaling
- ✅ RDS PostgreSQL (Multi-AZ)
- ✅ ElastiCache Redis cluster
- ✅ Application Load Balancer
- ✅ CloudFront CDN
- ✅ S3 for assets
- ✅ Secrets Manager

### Estimated Monthly Cost: ~$240

## 📁 Project Structure

```
├── .github/workflows/     # CI/CD pipelines
├── aws/                   # AWS deployment files
│   ├── cloudformation.yaml
│   └── ecs-task-definition.json
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   │   ├── admin/       # Super admin dashboard
│   │   ├── ai/          # AI protection features
│   │   ├── dashboard/   # Main dashboard
│   │   ├── license/     # License management
│   │   ├── modes/       # User modes
│   │   ├── pricing/     # Pricing page
│   │   ├── scan/        # Scan management
│   │   └── ui/          # UI components (shadcn)
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities & configs
├── Dockerfile            # Production Docker image
├── docker-compose.yml    # Local development
└── deploy.sh            # One-click deployment
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth encryption key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `JWT_SECRET` | JWT signing key | Yes |

## 🧪 Local Development with Docker

```bash
# Start local infrastructure
bash start-local.sh

# Access services:
# - App: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - Grafana: http://localhost:3001
```

## 📊 Monitoring

- **CloudWatch** - Metrics and logs
- **Grafana** - Custom dashboards (included in docker-compose)
- **Health Checks** - `/api` endpoint

## 🔐 Security

- All secrets stored in AWS Secrets Manager
- VPC with private subnets for database/cache
- SSL/TLS via CloudFront/ACM
- Non-root Docker container

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

**Built with ❤️ for security. Powered by AI.**

🚀 **[Deploy to AWS now!](docs/AWS-DEPLOYMENT.md)**
