import { StackProps } from "aws-cdk-lib";
import { IManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";

export interface GitHubStackProps extends StackProps {
    readonly repositoryConfig: { owner: string; repo: string; filter?: string }[];
}

export interface repositoryIdentityConfig {
    /**
   * This is the Owner for the repo can be username or organisation name
   *
   */
    owner: string;
    /**
   * Repo name e.g. aws-identity-provider-github
   *
   */
    repository: string;
    /**
   * Branch that is allowed to assume role. Either targets all branches or one branch .e.g main
   * To select all branches use *
   * @default - 'ref:refs/heads/main'
   */
    branchFilter?: string;
    //
    /**
   * Policy to be attached to assumed role for repo
   *
   */
    policyStatements?: PolicyStatement[],
    /**
     *  managed policy to attach
     * 
     */
    managedPolicies?: IManagedPolicy[],
    /**
     *  Permission boundaries allow you to limit the access of a policy
     * 
     */
    permissionsBoundary?: IManagedPolicy

}