output "ec2_instance_profile_name" {
  value = aws_iam_instance_profile.ec2_profile.name
}

output "cicd_user_access_key" {
  value = aws_iam_access_key.cicd_user_key.id
}

output "cicd_user_secret_key" {
  value = aws_iam_access_key.cicd_user_key.secret
  sensitive = true
}