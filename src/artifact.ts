import type * as github from "@actions/github";

/**
 * Collection of artifacts associated with a workflow run.
 */
export type ListWorkflowRunArtifactsResponse = ReturnType<
    ReturnType<
        typeof github.getOctokit
    >["rest"]["actions"]["listWorkflowRunArtifacts"]
> extends Promise<infer X>
    ? X
    : never;

/**
 * Workflow run artifact.
 */
export type Artifact =
    ListWorkflowRunArtifactsResponse["data"]["artifacts"] extends (infer ElementType)[]
        ? ElementType
        : never;

