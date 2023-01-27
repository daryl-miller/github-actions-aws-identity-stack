#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsIdentityProviderGithubStack } from '../lib/aws-identity-provider-github-stack';
import { repositoryConfigs } from '../lib/config'


const app = new cdk.App();
new AwsIdentityProviderGithubStack(app, 'AwsIdentityProviderGithubStack', repositoryConfigs, {
    env: {
        account: '589560249530'
    }
});