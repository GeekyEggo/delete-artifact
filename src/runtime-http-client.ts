import * as core from '@actions/core';
import { BearerCredentialHandler } from '@actions/http-client/auth';
import { HttpClient } from '@actions/http-client';
import { IHeaders } from '@actions/http-client/interfaces';
import { ListArtifactsResponse } from './typings/github-artifacts';

/**
 * The basic process environment variables.
 */
declare var process : {
    env: {
        ACTIONS_RUNTIME_URL: string;
        GITHUB_RUN_ID: string;
        ACTIONS_RUNTIME_TOKEN: string;
    }
}

/**
 * A basic response from the runtime HttpClient in relation to artifacts.
 */
interface ArtifactResponse {
    success: boolean;
}

/**
 * Defines the response when listing the artifacts.
 */
interface ListArtifactsResponseWrapper extends ArtifactResponse {
    data: ListArtifactsResponse;
}

export default class RuntimeHttpClient {
    private static API_VERSION: string = '6.0-preview';

    private client: HttpClient;
    private headers: IHeaders;

    /**
     * A runtime HTTP client used to communicate with the current workflow runtime directly.
     */
    constructor() {
        this.client = new HttpClient('action/artifact', [
            new BearerCredentialHandler(process.env['ACTIONS_RUNTIME_TOKEN'])
        ]);

        this.headers = {
            'Accept': `application/json;api-version=${RuntimeHttpClient.API_VERSION}`
        };
    }

    /**
     * Deletes the artifact at the supplied URL.
     * @param {string} url The URL of the artifact.
     * @returns {ArtifactResponse} An object containing the `success` state.
     */
    public async deleteArtifact(url: string) : Promise<ArtifactResponse> {
        try {
            const response = await this.client.del(url, this.headers);
            const body = await response.readBody();

            if (this.isStatusCodeSuccess(response.message.statusCode)) {
                return { success: true };
            } else {
                core.info(`Failed to delete artifact; status code ${response.message.statusCode}`);
            }
        } catch (e: any) {
            core.debug(e);
        }

        return { success: false };
    }

    /**
     * Lists the artifacts associated with the current runtime.
     * @returns {ListArtifactsResponse} An object containing the `success` state, and the `data` containing the artifacts.
     */
    public async listArtifacts(): Promise<ListArtifactsResponseWrapper> {
        try {
            const uri = `${process.env.ACTIONS_RUNTIME_URL}_apis/pipelines/workflows/${process.env.GITHUB_RUN_ID}/artifacts?api-version=${RuntimeHttpClient.API_VERSION}`;
            const response = await this.client.get(uri, this.headers);
            const body = await response.readBody();

            if (this.isStatusCodeSuccess(response.message.statusCode)) {
                return {
                    success: true,
                    data: JSON.parse(body)
                }
            } else {
                core.info(`Failed to list artifacts; status code ${response.message.statusCode}`);
            }
        } catch (e : any) {
            core.debug(e)
        }

        return {
            success: false,
            data: {
                count: 0,
                value: []
            }
        };
    }

    /**
     * Determines whether the provided status code indicates a successful response.
     * @param {number|undefined} statusCode The status code.
     * @returns {boolean} True when the status code should be considered successful.
     */
    public isStatusCodeSuccess(statusCode: number | undefined) : boolean {
        if (!statusCode) {
            return false
        }
        
        return statusCode >= 200 && statusCode < 300
    }
}
