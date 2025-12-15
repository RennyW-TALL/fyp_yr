output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "rds_username" {
  value = aws_db_instance.main.username
}

output "rds_password" {
  value = random_password.db_password.result
  sensitive = true
}