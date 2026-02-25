# AdamGuard Pro - AWS Deployment Guide

This guide covers deploying AdamGuard Pro to AWS using ECS Fargate, RDS PostgreSQL, ElastiCache Redis, and CloudFront.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- Docker installed locally
- GitHub repository (for CI/CD)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud                                 │
│                                                                  │
│  ┌──────────────┐     ┌──────────────────────────────────────┐  │
│  │ CloudFront   │────▶│          Application Load Balancer    │  │
│  │   (CDN)      │     └──────────────────────────────────────┘  │
│  └──────────────┘                      │                         │
│                                        ▼                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    ECS Fargate Cluster                      │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │ │
│  │  │   Task 1    │  │   Task 2    │  │   Task N    │         │ │
│  │  │ (Next.js)   │  │ (Next.js)   │  │ (Next.js)   │         │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │ │
│  └────────────────────────────────────────────────────────────┘ │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │    RDS      │     │ ElastiCache │     │     S3      │       │
│  │ PostgreSQL  │     │    Redis    │     │   Assets    │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Option 1: One-Click CloudFormation Deployment

```bash
# Deploy complete infrastructure
aws cloudformation create-stack \
  --stack-name adamguard-production \
  --template-body file://aws/cloudformation.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=DbPassword,ParameterValue=your-secure-password \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### Option 2: Using Deployment Script

```bash
# Deploy to staging
bash deploy.sh staging us-east-1

# Deploy to production (requires confirmation)
bash deploy.sh production us-east-1
```

### Option 3: Local Development

```bash
# Start local development environment
bash start-local.sh

# Access the application
# http://localhost:3000
```

## 📦 Step-by-Step Deployment

### Step 1: Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name adamguard-pro \
  --region us-east-1

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### Step 2: Build and Push Docker Image

```bash
# Build the Docker image
docker build -t adamguard-pro .

# Tag for ECR
docker tag adamguard-pro:latest \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/adamguard-pro:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/adamguard-pro:latest
```

### Step 3: Create Secrets in AWS Secrets Manager

```bash
# Database URL
aws secretsmanager create-secret \
  --name adamguard/production/database-url \
  --secret-string "postgresql://adamguard:PASSWORD@HOST:5432/adamguard"

# NextAuth Secret
aws secretsmanager create-secret \
  --name adamguard/production/nextauth-secret \
  --generate-random-password --password-length 64

# JWT Secret
aws secretsmanager create-secret \
  --name adamguard/production/jwt-secret \
  --generate-random-password --password-length 64
```

### Step 4: Deploy Infrastructure

```bash
# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name adamguard-production \
  --template-body file://aws/cloudformation.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=DbPassword,ParameterValue=your-secure-password \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

# Wait for completion
aws cloudformation wait stack-create-complete \
  --stack-name adamguard-production
```

### Step 5: Get Deployment Outputs

```bash
# Get Load Balancer URL
aws cloudformation describe-stacks \
  --stack-name adamguard-production \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text

# Get CloudFront URL
aws cloudformation describe-stacks \
  --stack-name adamguard-production \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text
```

## 🔧 CI/CD Pipeline Setup

### GitHub Actions Configuration

1. Add the following secrets to your GitHub repository:

   - `AWS_ACCESS_KEY_ID` - AWS access key
   - `AWS_SECRET_ACCESS_KEY` - AWS secret key
   - `NEXTAUTH_SECRET` - NextAuth secret
   - `JWT_SECRET` - JWT secret
   - `SENTRY_AUTH_TOKEN` (optional) - Sentry auth token for error tracking

2. Push to main branch to trigger automatic deployment:

```bash
git push origin main
```

The pipeline will:
- Run linting and tests
- Build Docker image
- Push to ECR
- Deploy to ECS
- Run security scans

### Manual Deployment via GitHub Actions

Go to Actions → AdamGuard Pro CI/CD → Run workflow

Select environment: `staging` or `production`

## 🔐 Security Configuration

### SSL/TLS Certificate (Production)

```bash
# Request ACM certificate
aws acm request-certificate \
  --domain-name adamguard.com \
  --subject-alternative-names "*.adamguard.com" \
  --validation-method DNS \
  --region us-east-1

# Add DNS validation records to your domain
# Then update CloudFront to use the certificate
```

### WAF (Web Application Firewall)

```bash
# Create WAF Web ACL
aws wafv2 create-web-acl \
  --name adamguard-web-acl \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

## 📊 Monitoring & Logging

### CloudWatch Dashboards

The deployment includes:
- ECS CPU/Memory metrics
- ALB request counts and latency
- RDS database metrics
- ElastiCache Redis metrics

### Log Groups

- `/ecs/adamguard-production` - Application logs
- `/aws/rds/adamguard-production` - Database logs

### Alerts

Configure CloudWatch Alarms for:
- High CPU utilization (>80%)
- High memory utilization (>80%)
- Database connections (>80% of max)
- 5XX error rates (>1%)

## 💰 Cost Estimation

### Production Environment (Monthly)

| Service | Configuration | Est. Cost |
|---------|--------------|-----------|
| ECS Fargate | 2 tasks, 1 vCPU, 2GB | ~$50 |
| RDS PostgreSQL | db.t3.medium, Multi-AZ | ~$100 |
| ElastiCache Redis | cache.t3.medium, 2 nodes | ~$60 |
| ALB | Application Load Balancer | ~$20 |
| CloudFront | 100GB transfer | ~$10 |
| S3 | 10GB storage | ~$0.25 |
| **Total** | | **~$240/month** |

### Cost Optimization Tips

1. Use Reserved Instances for RDS
2. Use Savings Plans for ECS
3. Enable S3 Intelligent Tiering
4. Use CloudFront for caching

## 🔄 Database Migrations

```bash
# Connect to RDS
aws rds describe-db-instances \
  --db-instance-identifier adamguard-production-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text

# Run migrations (from a bastion host or ECS task)
npx prisma migrate deploy
```

## 📱 PWA Configuration

The application includes PWA support with:
- Offline functionality
- Push notifications
- Home screen installation

Update `public/manifest.json` with your production domain.

## 🔧 Troubleshooting

### Common Issues

**1. ECS tasks failing health checks**
```bash
# Check task logs
aws logs tail /ecs/adamguard-production --since 1h

# Check task definition
aws ecs describe-tasks --cluster adamguard-production-cluster --tasks TASK_ID
```

**2. Database connection issues**
```bash
# Verify security groups allow ECS to RDS traffic
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Check RDS status
aws rds describe-db-instances --db-instance-identifier adamguard-production-db
```

**3. CloudFront 502 errors**
```bash
# Check ALB health
aws elbv2 describe-target-health --target-group-arn tg-xxxxx

# Verify SSL certificates
aws acm list-certificates
```

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth encryption key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `JWT_SECRET` | JWT signing key | Yes |
| `NODE_ENV` | Environment (production) | Yes |

## 🚦 Health Check Endpoints

- `/api` - API health check
- `/api/health` - Detailed health status

## 📞 Support

For deployment issues:
1. Check CloudWatch logs
2. Review ECS task events
3. Contact DevOps team

---

**AdamGuard Pro** - AI-Powered Antivirus Protection
