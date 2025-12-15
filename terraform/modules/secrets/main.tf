resource "aws_secretsmanager_secret" "db_credentials" {
  name = "${var.project_name}-${var.environment}-db-credentials-${random_string.suffix.result}"
  
  tags = {
    Name = "${var.project_name}-${var.environment}-db-credentials"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    endpoint = var.rds_endpoint
    username = var.rds_username
    password = var.rds_password
    dbname   = var.db_name
  })
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}