output "vpc_id" {
  value = module.vpc.vpc_id
}

output "s3_bucket_name" {
  value = module.s3.s3_bucket_name
}

output "ec2_public_ip" {
  value = module.ec2.elastic_ip
}

output "ec2_instance_id" {
  value = module.ec2.instance_id
}

output "rds_endpoint" {
  value = module.rds.rds_endpoint
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "cicd_user_access_key" {
  value = module.iam.cicd_user_access_key
  sensitive = true
}

output "cicd_user_secret_key" {
  value = module.iam.cicd_user_secret_key
  sensitive = true
}