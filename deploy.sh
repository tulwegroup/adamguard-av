#!/bin/bash

# ===========================================
# AdamGuard Pro - AWS Deployment Script
# ===========================================
# This script deploys AdamGuard Pro to AWS ECS
# Usage: ./deploy.sh [environment] [region]
# Example: ./deploy.sh production us-east-1

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
AWS_REGION=${2:-us-east-1}
ECR_REPO="adamguard-pro"
ECS_CLUSTER="adamguard-${ENVIRONMENT}-cluster"
ECS_SERVICE="adamguard-${ENVIRONMENT}-service"
TASK_DEFINITION="aws/ecs-task-definition.json"

# Print functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if logged in to AWS
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "Not logged in to AWS. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "All prerequisites met!"
}

# Build Docker image
build_image() {
    log_info "Building Docker image..."
    
    docker build -t ${ECR_REPO}:${ENVIRONMENT} -t ${ECR_REPO}:latest .
    
    log_success "Docker image built successfully!"
}

# Push to ECR
push_to_ecr() {
    log_info "Pushing to Amazon ECR..."
    
    # Get ECR registry
    ECR_REGISTRY=$(aws sts get-caller-identity --query 'Account' --output text).dkr.ecr.${AWS_REGION}.amazonaws.com
    
    # Login to ECR
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
    
    # Create repository if it doesn't exist
    aws ecr describe-repositories --repository-names ${ECR_REPO} --region ${AWS_REGION} 2>/dev/null || \
        aws ecr create-repository --repository-name ${ECR_REPO} --region ${AWS_REGION}
    
    # Tag and push
    docker tag ${ECR_REPO}:${ENVIRONMENT} ${ECR_REGISTRY}/${ECR_REPO}:${ENVIRONMENT}
    docker tag ${ECR_REPO}:latest ${ECR_REGISTRY}/${ECR_REPO}:latest
    docker push ${ECR_REGISTRY}/${ECR_REPO}:${ENVIRONMENT}
    docker push ${ECR_REGISTRY}/${ECR_REPO}:latest
    
    log_success "Image pushed to ECR successfully!"
    
    echo "IMAGE_URI=${ECR_REGISTRY}/${ECR_REPO}:${ENVIRONMENT}" >> $GITHUB_ENV 2>/dev/null || true
}

# Deploy to ECS
deploy_to_ecs() {
    log_info "Deploying to Amazon ECS..."
    
    ECR_REGISTRY=$(aws sts get-caller-identity --query 'Account' --output text).dkr.ecr.${AWS_REGION}.amazonaws.com
    IMAGE_URI="${ECR_REGISTRY}/${ECR_REPO}:${ENVIRONMENT}"
    
    # Update task definition with new image
    TASK_DEF_ARN=$(aws ecs describe-task-definition \
        --task-definition adamguard-${ENVIRONMENT}-task \
        --query 'taskDefinition.taskDefinitionArn' \
        --output text 2>/dev/null || echo "")
    
    if [ -z "$TASK_DEF_ARN" ]; then
        log_warning "Task definition not found. Creating new one..."
        
        # Create task definition from template
        sed "s|YOUR_ACCOUNT_ID|$(aws sts get-caller-identity --query 'Account' --output text)|g" ${TASK_DEFINITION} > /tmp/task-def.json
        
        aws ecs register-task-definition \
            --cli-input-json file:///tmp/task-def.json \
            --region ${AWS_REGION}
    else
        # Update existing task definition
        aws ecs describe-task-definition \
            --task-definition adamguard-${ENVIRONMENT}-task \
            --query 'taskDefinition' > /tmp/task-def-base.json
        
        # Update image in task definition
        IMAGE_ESCAPED=$(echo "$IMAGE_URI" | sed 's/\//\\\//g')
        sed -i "s|\"image\": \"[^\"]*\"|\"image\": \"${IMAGE_ESCAPED}\"|g" /tmp/task-def-base.json
        
        # Remove unnecessary fields
        jq 'del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)' \
            /tmp/task-def-base.json > /tmp/task-def.json
        
        aws ecs register-task-definition \
            --cli-input-json file:///tmp/task-def.json \
            --region ${AWS_REGION}
    fi
    
    # Update service
    aws ecs update-service \
        --cluster ${ECS_CLUSTER} \
        --service ${ECS_SERVICE} \
        --task-definition adamguard-${ENVIRONMENT}-task \
        --region ${AWS_REGION}
    
    # Wait for deployment
    log_info "Waiting for deployment to complete..."
    aws ecs wait services-stable \
        --cluster ${ECS_CLUSTER} \
        --services ${ECS_SERVICE} \
        --region ${AWS_REGION}
    
    log_success "Deployment to ECS completed successfully!"
}

# Deploy CloudFormation stack
deploy_cloudformation() {
    log_info "Deploying CloudFormation stack..."
    
    STACK_NAME="adamguard-${ENVIRONMENT}"
    
    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${AWS_REGION} &> /dev/null; then
        log_info "Updating existing stack..."
        aws cloudformation update-stack \
            --stack-name ${STACK_NAME} \
            --template-body file://aws/cloudformation.yaml \
            --parameters \
                ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
                ParameterKey=DbPassword,ParameterValue=${DB_PASSWORD:-adamguard123} \
            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
            --region ${AWS_REGION}
    else
        log_info "Creating new stack..."
        aws cloudformation create-stack \
            --stack-name ${STACK_NAME} \
            --template-body file://aws/cloudformation.yaml \
            --parameters \
                ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
                ParameterKey=DbPassword,ParameterValue=${DB_PASSWORD:-adamguard123} \
            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
            --region ${AWS_REGION}
    fi
    
    # Wait for stack to complete
    log_info "Waiting for CloudFormation stack to complete..."
    aws cloudformation wait stack-update-complete \
        --stack-name ${STACK_NAME} \
        --region ${AWS_REGION} 2>/dev/null || \
    aws cloudformation wait stack-create-complete \
        --stack-name ${STACK_NAME} \
        --region ${AWS_REGION}
    
    log_success "CloudFormation deployment completed!"
}

# Get deployment info
get_deployment_info() {
    log_info "Getting deployment information..."
    
    # Get Load Balancer URL
    LB_DNS=$(aws cloudformation describe-stacks \
        --stack-name adamguard-${ENVIRONMENT} \
        --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
        --output text \
        --region ${AWS_REGION} 2>/dev/null || echo "")
    
    # Get CloudFront URL
    CF_URL=$(aws cloudformation describe-stacks \
        --stack-name adamguard-${ENVIRONMENT} \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
        --output text \
        --region ${AWS_REGION} 2>/dev/null || echo "")
    
    echo ""
    echo "=========================================="
    echo "        Deployment Information"
    echo "=========================================="
    echo "Environment: ${ENVIRONMENT}"
    echo "Region: ${AWS_REGION}"
    echo "ECS Cluster: ${ECS_CLUSTER}"
    echo "ECS Service: ${ECS_SERVICE}"
    if [ -n "$LB_DNS" ]; then
        echo "Load Balancer: http://${LB_DNS}"
    fi
    if [ -n "$CF_URL" ]; then
        echo "CloudFront URL: ${CF_URL}"
    fi
    echo "=========================================="
}

# Main deployment function
main() {
    echo ""
    echo "=========================================="
    echo "   AdamGuard Pro - AWS Deployment"
    echo "=========================================="
    echo "Environment: ${ENVIRONMENT}"
    echo "Region: ${AWS_REGION}"
    echo "=========================================="
    echo ""
    
    # Confirm deployment for production
    if [ "${ENVIRONMENT}" == "production" ]; then
        log_warning "You are about to deploy to PRODUCTION!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled."
            exit 0
        fi
    fi
    
    # Run deployment steps
    check_prerequisites
    build_image
    push_to_ecr
    deploy_to_ecs
    get_deployment_info
    
    log_success "Deployment completed successfully!"
}

# Run main function
main "$@"
