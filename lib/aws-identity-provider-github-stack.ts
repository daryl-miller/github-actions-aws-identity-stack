import * as cdk from 'aws-cdk-lib';
import { Conditions, OpenIdConnectProvider, Role, WebIdentityPrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { repositoryIdentityConfig } from './config';

const githubDomain = 'token.actions.githubusercontent.com';

function buildCondition(config: repositoryIdentityConfig): Conditions {

  const repoTarget = `repo:${config.owner}/${config.repository}:${config.branchFilter ?? 'main'}`
  
  return {
    StringLike: {
      [`${githubDomain}:sub`]: repoTarget,
    },
  };
}

function buildGithubDeployRole(scope: Construct, principal: WebIdentityPrincipal, config: repositoryIdentityConfig): Role {
  const {repository, managedPolicies, permissionsBoundary, policyStatements, owner} = config
  const name = `${owner}-${repository}`
  const role = new Role(scope, `${name}-GithubDeployRole`, {
    assumedBy: principal,
    roleName: `${name}-GithubDeployRole`,
    managedPolicies,
    permissionsBoundary,
    description: `This role is used to deploy from github for ${name}`,
    maxSessionDuration: cdk.Duration.hours(1),
  });

  if (!policyStatements)
    return role

  policyStatements.map(policy => role.addToPolicy(policy))

  return role
}

function createWebIdentity(scope: Construct, githubOIDCProvider: OpenIdConnectProvider, config: repositoryIdentityConfig): void  {
  
  const conditions = buildCondition(config)
  const githubWebIdentityPrincipal = new WebIdentityPrincipal(
    githubOIDCProvider.openIdConnectProviderArn,
    conditions
  )

  buildGithubDeployRole(scope, githubWebIdentityPrincipal, config)

}

export class AwsIdentityProviderGithubStack extends cdk.Stack {
  constructor(scope: Construct, id: string, repositoryConfigs: repositoryIdentityConfig[], props?: cdk.StackProps) {
    super(scope, id, props);

    const githubProvider = new OpenIdConnectProvider(this, 'githubProvider', {
      url: `https://${githubDomain}`,
      clientIds: ['sts.amazonaws.com'],
    });

    repositoryConfigs.map(config => {
      createWebIdentity(this, githubProvider, config)
    })

  }
}
