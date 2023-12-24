import * as github from "@actions/github";
import { Artifact } from "./artifact";

/**
 * Client responsible for interacting with workflow run artifacts.
 */
export class ArtifactClient {
    /**
     * Octokit client responsible for making calls to GitHub.
     */
    private readonly octokit: ReturnType<typeof github.getOctokit>;

    /**
     * Initializes a new instance of the {@link ArtifactClient}.
     * @param token GitHub token with read and write access to actions.
     */
    constructor(token: string) {
        this.octokit = github.getOctokit(token);
    }

    /**
     * Deletes the specified artifact.
     * @param artifactId Artifact identifier.
     * @returns `true` when deletion was successful; otherwise `false`.
     */
    public async del(artifactId: number): Promise<boolean> {
        const { status } = await this.octokit.rest.actions.deleteArtifact({
            ...github.context.repo,
            artifact_id: artifactId,
        });

        return this.success(status);
    }

    /**
     * Lists the artifacts associated with the workflow run.
     * @returns The artifacts.
     */
    public async list(): Promise<Artifact[]> {
        const res = await this.octokit.rest.actions.listWorkflowRunArtifacts({
            ...github.context.repo,
            run_id: parseInt(process.env.GITHUB_RUN_ID),
        });

        if (!this.success(res.status)) {
            throw new Error("Failed to load artifacts");
        }

        return res.data.artifacts;
    }

    /**
     * Determines whether the specified {@link statusCode} denotes a successful response.
     * @param statusCode Status code.
     * @returns `true` when the status code is 2xx.
     */
    private success(statusCode: number): boolean {
        return (
            statusCode !== undefined && statusCode >= 200 && statusCode < 300
        );
    }
}
