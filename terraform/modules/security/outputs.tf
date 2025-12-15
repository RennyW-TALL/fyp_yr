output "ec2_security_group_id" {
  value = aws_security_group.ec2.id
}

output "db_security_group_id" {
  value = aws_security_group.rds.id
}