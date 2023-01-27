import { ManagedPolicy } from 'aws-cdk-lib/aws-iam'
import { repositoryIdentityConfig } from './types'

export * from './types'

export const repositoryConfigs: repositoryIdentityConfig[] = [
    { 
        owner: 'daryl-miller',
        repository: 'github-actions-aws-identity-stack', 
        policyStatements: [],
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')]
     },
     { 
        owner: 'daryl-miller',
        repository: 'cdk-iam', 
        policyStatements: [],
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')]
     },
]