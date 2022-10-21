terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  required_version = ">= 0.14.9"

  # s3 bucket to store the infrastructure state. This backed must be created manually.
  # https://www.terraform.io/docs/language/settings/backends/s3.html
  backend "s3" {}
}

provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  region  = var.region
  default_tags {
    tags = {
      project     = var.project
      team        = var.team
      environment = var.environment
      repository  = var.repo
    }
  }
}

# Provider for certificates
# Custom domains can only work with certificated hosted in us-east-1 (N. Virginia region)
# Well played AWS!
provider "aws" {
  alias   = "nvirginia"
  shared_credentials_files = ["~/.aws/credentials"]
  region  = "us-east-1"
  default_tags {
    tags = {
      project     = var.project
      team        = var.team
      environment = var.environment
      repository  = var.repo
    }
  }
}

module "static_website" {
  source = "git::git@github.com:wiris/terraform-modules.git//modules/cf-s3_staticweb"      # This field needs to be filled whith a path or as shown in the terraform documentation https://www.terraform.io/language/modules/sources

  project       = var.project
  dns_zone      = var.dns_zone
  fqdn          = var.fqdn
  environment   = var.environment
  team          = var.team
  region        = var.region
  repo          = var.repo
  bucket_name   = var.bucket_name
  is_staging    = var.is_staging
  function_name = var.function_name

  providers = {
    aws = aws
    aws.nvirginia = aws.nvirginia
  }
}

output "aws_iam_access_key" {
  value = module.static_website.aws_iam_access_key
}

output "aws_iam_secret_access_key" {
  value = module.static_website.aws_iam_secret_access_key
  sensitive = true
}
