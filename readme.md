# Buildroles

This repo is responsible for building the deploy roles for my cdk stacks on github. It enables keyless authentication with github by adding Github as an trusted entity via it's ODIC log in. It leverages conditional targeting on the repo to allow specific buildroles for different projects that deploy with my account.

# References:
- https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services