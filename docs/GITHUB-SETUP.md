# 🚀 GitHub Repository Setup Guide

Follow these steps to deploy AdamGuard AV to AWS using GitHub Actions.

## Repository Already Configured

Your repository is: **https://github.com/tulwegroup/adamguard-av**

## Step 1: Add GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Click **"New repository secret"** and add each of these:

### Required Secrets

| Name | Value | How to Get |
|------|-------|------------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key | [AWS Console](https://console.aws.amazon.com/iam) → IAM → Users → Security credentials |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | Same as above (only shown once!) |
| `NEXTAUTH_SECRET` | Random 64-char string | Run: `openssl rand -base64 64` |
| `JWT_SECRET` | Random 64-char string | Run: `openssl rand -base64 64` |

### Optional Secrets

| Name | Value | Purpose |
|------|-------|---------|
| `SENTRY_AUTH_TOKEN` | Sentry token | Error tracking |
| `STRIPE_SECRET_KEY` | Stripe key | Payment processing |

## Step 4: Create AWS Resources

### 4.1 Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name adamguard-pro \
  --region us-east-1
```

### 4.2 Create Secrets in AWS Secrets Manager

```bash
# Database password (note it for CloudFormation)
aws secretsmanager create-secret \
  --name adamguard/production/db-password \
  --secret-string "YourSecurePassword123!"

# NextAuth secret
aws secretsmanager create-secret \
  --name adamguard/production/nextauth-secret \
  --secret-string "$(openssl rand -base64 64)"

# JWT secret
aws secretsmanager create-secret \
  --name adamguard/production/jwt-secret \
  --secret-string "$(openssl rand -base64 64)"
```

## Step 5: Deploy Infrastructure

### Option A: Via GitHub Actions (Recommended)

1. Go to **Actions** tab in your repository
2. Click **"AdamGuard Pro CI/CD"**
3. Click **"Run workflow"**
4. Select `production` environment
5. Click **"Run workflow"**

### Option B: Via Command Line

```bash
# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name adamguard-production \
  --template-body file://aws/cloudformation.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=DbPassword,ParameterValue=YourSecurePassword123 \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region us-east-1

# Wait for completion (takes ~15-20 minutes)
aws cloudformation wait stack-create-complete \
  --stack-name adamguard-production \
  --region us-east-1
```

## Step 6: Get Your Application URL

```bash
# Get CloudFront URL
aws cloudformation describe-stacks \
  --stack-name adamguard-production \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text \
  --region us-east-1
```

## Step 7: Configure Custom Domain (Optional)

1. Request SSL certificate in AWS Certificate Manager (us-east-1)
2. Validate certificate via DNS
3. Update CloudFront distribution to use your domain
4. Update `NEXTAUTH_URL` environment variable

## 🎉 Done!

Your application is now live on AWS!

### Architecture Deployed

```
CloudFront (CDN)
      ↓
Application Load Balancer
      ↓
ECS Fargate (Next.js)
      ↓
┌─────────┼─────────┐
↓         ↓         ↓
RDS     Redis      S3
PostgreSQL
```

### Estimated Monthly Cost: ~$240

### Useful Commands

```bash
# View logs
aws logs tail /ecs/adamguard-production --follow

# Scale up
aws ecs update-service \
  --cluster adamguard-production-cluster \
  --service adamguard-production-service \
  --desired-count 4

# Check health
curl https://your-cloudfront-url/api
```

## 🆘 Troubleshooting

### Deployment Failed
1. Check GitHub Actions logs
2. Verify AWS secrets are set correctly
3. Ensure your AWS user has sufficient permissions

### Application Not Loading
1. Check ECS task logs in CloudWatch
2. Verify security groups allow traffic
3. Check health check endpoint: `/api`

### Database Connection Issues
1. Verify RDS is in available state
2. Check security group allows ECS to RDS traffic
3. Verify DATABASE_URL secret is correct

---

Need help? Check the [AWS Deployment Guide](AWS-DEPLOYMENT.md) for more details.
