# CAUTION: This file is under version control and is added in the git repository.
# Use this file only to set non-sensible data. 
# If you need to set Terraform environment variables with sensible data, please, use TF_VAR_ or -var flag.
# https://www.terraform.io/docs/language/values/variables.html

project         = "html-integrations"
dns_zone        = "wiris.kitchen"
fqdn            = "integrations.wiris.kitchen"
environment     = "staging"
team            = "Integrations"
region          = "eu-west-2"
repo            = "https://github.com/wiris/html-integrations/"
bucket_name     = "wiris-integrations-staging-html"
is_staging      = false             # If enviroment is not staging change it to true.
