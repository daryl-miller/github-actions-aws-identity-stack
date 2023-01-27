import * as cdk from 'aws-cdk-lib';
import { OpenIdConnectProvider, Role, OpenIdConnectPrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { repositoryIdentityConfig } from './config';

function createGithubDeployRole(scope: Construct, githubOIDCProvider: OpenIdConnectProvider, config: repositoryIdentityConfig): void  {
  
  const {repository, managedPolicies, permissionsBoundary, policyStatements, owner} = config
  const name = `${owner}-${repository}`
  const role = new Role(scope, `${name}-GithubDeployRole`, {
    assumedBy: new OpenIdConnectPrincipal(githubOIDCProvider, {
      StringEquals: {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      },
      StringLike: {
        "token.actions.githubusercontent.com:sub":
        `repo:${config.owner}/${config.repository}:${config.branchFilter ?? '*'}`, 
      },
    }),
    roleName: `${name}-GithubDeployRole`,
    managedPolicies,
    permissionsBoundary,
    description: `This role is used to deploy from github for ${name}`,
    maxSessionDuration: cdk.Duration.hours(1),
  });

  if (policyStatements)
    policyStatements.map(policy => role.addToPolicy(policy))
}

export class AwsIdentityProviderGithubStack extends cdk.Stack {
  constructor(scope: Construct, id: string, repositoryConfigs: repositoryIdentityConfig[], props?: cdk.StackProps) {
    super(scope, id, props);

    const githubProvider = new OpenIdConnectProvider(this, 'githubProvider', {
      url: `https://token.actions.githubusercontent.com`,
      clientIds: ['sts.amazonaws.com'],
    });

    repositoryConfigs.map(config => {
      createGithubDeployRole(this, githubProvider, config)
    })

  }
}
