# Terraform Bootstrap

This creates the S3 bucket and DynamoDB table for Terraform remote state management.

## Setup

1. Run bootstrap first:
   ```bash
   cd bootstrap
   terraform init
   terraform apply
   ```

2. Then initialize main infrastructure:
   ```bash
   cd ..
   terraform init
   terraform apply
   ```

## Resources Created

- S3 bucket: `fyp-yr-terraform-state-ap-southeast-1`
- DynamoDB table: `fyp-yr-terraform-locks`