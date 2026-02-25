#!/bin/bash
# AdamGuard Pro - AWS Secrets Setup Script
# Creates AWS Secrets Manager secrets for production deployment

set -e

REGION="${AWS_REGION:-us-east-1}"
ENV="${ENVIRONMENT:-production}"

echo "=========================================="
echo "AdamGuard Pro - AWS Secrets Setup"
echo "=========================================="
echo "Region: $REGION"
echo "Environment: $ENV"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq not found. Please install it first."
    exit 1
fi

# Generate a secure random secret
generate_secret() {
    openssl rand -base64 48 | tr -d '\n'
}

# Create or update a secret
create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    echo "Setting secret: $secret_name"
    
    # Check if secret exists
    if aws secretsmanager describe-secret --secret-id "$secret_name" --region "$REGION" &> /dev/null; then
        echo "  → Updating existing secret..."
        aws secretsmanager put-secret-value \
            --secret-id "$secret_name" \
            --secret-string "$secret_value" \
            --region "$REGION" > /dev/null
    else
        echo "  → Creating new secret..."
        aws secretsmanager create-secret \
            --name "$secret_name" \
            --secret-string "$secret_value" \
            --description "AdamGuard Pro - $secret_name" \
            --region "$REGION" > /dev/null
    fi
}

echo "Generating secrets..."
echo ""

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(generate_secret)
create_secret "adamguard/nextauth" "$NEXTAUTH_SECRET"
echo "  ✅ NEXTAUTH_SECRET created"

# Generate JWT_SECRET
JWT_SECRET=$(generate_secret)
create_secret "adamguard/jwt" "$JWT_SECRET"
echo "  ✅ JWT_SECRET created"

# Generate API Key for internal services
API_KEY=$(generate_secret)
create_secret "adamguard/api-key" "$API_KEY"
echo "  ✅ API_KEY created"

echo ""
echo "=========================================="
echo "✅ Secrets created successfully!"
echo "=========================================="
echo ""
echo "📋 Secret Names:"
echo "   - adamguard/nextauth"
echo "   - adamguard/jwt"
echo "   - adamguard/api-key"
echo ""
echo "📝 To use in ECS Task Definition:"
echo '   {"name": "NEXTAUTH_SECRET", "valueFrom": "arn:aws:secretsmanager:'$REGION':<account-id>:secret:adamguard/nextauth"}'
echo '   {"name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:'$REGION':<account-id>:secret:adamguard/jwt"}'
echo ""
echo "⚠️  IMPORTANT: Store these secrets securely!"
echo "   These are now stored in AWS Secrets Manager"
echo "=========================================="
