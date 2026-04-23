provider "aws" {
  region = "us-east-1"
}

# Example: ECR Repository for the container
resource "aws_ecr_repository" "app_repo" {
  name                 = "godemode-${var.project_name}"
  image_tag_mutability = "MUTABLE"
}

variable "project_name" {
  type    = string
  default = "app"
}
