# Terraform Infrastructure

This Terraform configuration creates a complete AWS infrastructure for a React frontend and PHP backend application.

## Architecture

- **VPC**: Custom VPC with public and private subnets
- **S3**: Static website hosting for React frontend
- **EC2**: Ubuntu instance with Docker for PHP backend
- **RDS**: MySQL database (free tier)
- **ECR**: Container registry for Docker images
- **Secrets Manager**: Database credentials storage
- **IAM**: Roles and policies for EC2 and CI/CD

## Deployment

1. Copy `terraform.tfvars.example` to `terraform.tfvars` and update values
2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Plan the deployment:
   ```bash
   terraform plan
   ```
4. Apply the configuration:
   ```bash
   terraform apply
   ```

## GitHub Secrets Required

After deployment, add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: From terraform output `cicd_user_access_key`
- `AWS_SECRET_ACCESS_KEY`: From terraform output `cicd_user_secret_key`
- `S3_BUCKET_NAME`: From terraform output `s3_bucket_name`
- `ECR_REPOSITORY`: Repository name (fyp-yr-dev-backend)
- `EC2_INSTANCE_ID`: From AWS console or terraform state

## Free Tier Resources

All resources are configured to stay within AWS free tier limits:
- EC2: t3.small instance
- RDS: db.t3.micro with 20GB storage
- S3: Standard storage
- VPC: No additional charges