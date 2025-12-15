terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
}

module "security" {
  source = "./modules/security"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
}

module "s3" {
  source = "./modules/s3"
  
  project_name = var.project_name
  environment  = var.environment
}

module "ecr" {
  source = "./modules/ecr"
  
  project_name = var.project_name
  environment  = var.environment
}

module "rds" {
  source = "./modules/rds"
  
  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  db_security_group_id = module.security.db_security_group_id
}

module "secrets" {
  source = "./modules/secrets"
  
  project_name = var.project_name
  environment  = var.environment
  rds_endpoint = module.rds.rds_endpoint
  rds_username = module.rds.rds_username
  rds_password = module.rds.rds_password
  db_name      = "yr_db_fyp"
}

module "iam" {
  source = "./modules/iam"
  
  project_name = var.project_name
  environment  = var.environment
  s3_bucket_arn = module.s3.s3_bucket_arn
  secrets_arn   = module.secrets.secrets_arn
  ecr_repository_arn = module.ecr.repository_arn
}

module "ec2" {
  source = "./modules/ec2"
  
  project_name           = var.project_name
  environment            = var.environment
  vpc_id                 = module.vpc.vpc_id
  public_subnet_id       = module.vpc.public_subnet_ids[0]
  ec2_security_group_id  = module.security.ec2_security_group_id
  ec2_instance_profile   = module.iam.ec2_instance_profile_name
  ecr_repository_url     = module.ecr.repository_url
}