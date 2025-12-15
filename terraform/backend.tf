terraform {
  backend "s3" {
    bucket         = "fyp-yr-terraform-state-ap-southeast-1"
    key            = "terraform.tfstate"
    region         = "ap-southeast-1"
    use_lockfile   = true
    dynamodb_table = "fyp-yr-terraform-locks"
    encrypt        = true
  }
}