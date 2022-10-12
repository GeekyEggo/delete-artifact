/**
 * Defines the response supplied when listing the artifacts associated with a workflow.
 */
export interface ListArtifactsResponse {
    count: number;
    value: Artifact[];
}

/**
 * An artifact.
 */
export interface Artifact {
    containerId: number;
    fileContainerResourceUrl: string;
    name: string;
    signedContent?: any,
    size: number;
    type: any;
    url: string;
}
