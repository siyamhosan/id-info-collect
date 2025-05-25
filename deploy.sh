#!/bin/bash

# 🚀 Production Deployment Script for University ID Card Application
# This script performs security checks and deploys the application safely

set -e  # Exit on any error

echo "🔒 Starting Production Deployment with Security Checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    echo "Please copy env.example to .env and configure it:"
    echo "cp env.example .env"
    exit 1
fi

print_status ".env file found"

# Check if DATABASE_URL is set
if ! grep -q "^DATABASE_URL=" .env; then
    print_error "DATABASE_URL not set in .env file"
    exit 1
fi

print_status "DATABASE_URL configured"

# Check if NODE_ENV is set to production
if ! grep -q "^NODE_ENV=production" .env; then
    print_warning "NODE_ENV is not set to production"
    echo "Setting NODE_ENV=production for this deployment"
    export NODE_ENV=production
fi

print_status "Production environment configured"

# Security audit
echo "🔍 Running security audit..."
npm audit --audit-level=high
if [ $? -ne 0 ]; then
    print_error "Security vulnerabilities found! Please fix them before deploying."
    echo "Run: npm audit fix"
    exit 1
fi

print_status "Security audit passed"

# Type checking
echo "🔧 Running type checks..."
npm run check
if [ $? -ne 0 ]; then
    print_error "Type checking failed!"
    exit 1
fi

print_status "Type checking passed"

# Linting
echo "📝 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    print_error "Linting failed!"
    exit 1
fi

print_status "Linting passed"

# Build the application
echo "🏗️ Building application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

print_status "Application built successfully"

# Database migration (if needed)
echo "🗄️ Running database migrations..."
npm run db:push
if [ $? -ne 0 ]; then
    print_error "Database migration failed!"
    exit 1
fi

print_status "Database migrations completed"

# Test the build
echo "🧪 Testing the build..."
timeout 10s npm run preview > /dev/null 2>&1 &
PREVIEW_PID=$!
sleep 5

# Check if the server is running
if kill -0 $PREVIEW_PID 2>/dev/null; then
    print_status "Build test passed"
    kill $PREVIEW_PID
else
    print_error "Build test failed - server didn't start"
    exit 1
fi

# Security headers check (if server is accessible)
echo "🛡️ Checking security headers..."
if command -v curl &> /dev/null; then
    # This would need to be adapted based on your deployment URL
    print_warning "Manual security header verification needed after deployment"
    echo "Run: curl -I https://your-domain.com/"
    echo "Verify these headers are present:"
    echo "  - X-Frame-Options: DENY"
    echo "  - X-Content-Type-Options: nosniff"
    echo "  - Content-Security-Policy"
    echo "  - Strict-Transport-Security (if HTTPS)"
else
    print_warning "curl not available - manual security header check needed"
fi

# Final deployment steps
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Deploy the 'build' directory to your production server"
echo "2. Ensure environment variables are set on the server"
echo "3. Start the application with: node build"
echo "4. Verify security headers are working"
echo "5. Test the application functionality"
echo "6. Monitor logs for any issues"
echo ""
echo "Security reminders:"
echo "- Ensure HTTPS is enabled"
echo "- Monitor rate limiting logs"
echo "- Set up database backups"
echo "- Configure log monitoring"
echo ""

print_status "Deployment preparation completed successfully!"

# Optional: Create deployment package
read -p "Create deployment package? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    PACKAGE_NAME="id-card-app-${TIMESTAMP}.tar.gz"
    
    echo "📦 Creating deployment package..."
    tar -czf $PACKAGE_NAME build/ package.json package-lock.json .env.example SECURITY.md README.md
    
    print_status "Deployment package created: $PACKAGE_NAME"
    echo "Upload this package to your production server"
fi

echo "🎉 Deployment preparation complete!" 