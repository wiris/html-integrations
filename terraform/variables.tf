# Use inputs variable to set default values to Terraform variables.
# Set the Terraform variables values using .tfvars files and adding that file as -var-file flag parameter:
# $ terraform plan -var-file staging.tfvars

variable "environment" {
  description = "The environment where to mount the infrastructure."
  type        = string

  validation {
    condition     = can(regex("staging|production", var.environment))
    error_message = "The 'environment' input variable MUST be one of the following strings: \"staging\" or \"production\". Use -var-file flag or TF_VAR_ environment variable."
  }
}

variable "dns_zone" {
  description = "The domain to use as route53 zone"
  type        = string
}

variable "fqdn" {
  description = "The subdomain to use as route53 zone"
  type        = string
}

variable "project" {
  description = ""
  type        = string
}

variable "bucket_name" {
  description = ""
  type        = string
}

variable "team" {
  description = ""
  type        = string
}

variable "region" {
  description = ""
  type        = string
}

variable "repo" {
  description = ""
  type        = string
}

variable "is_staging" {
  type = bool
}

variable "function_name" {
  description = ""
  default = "basic_auth"
  type        = string
}
