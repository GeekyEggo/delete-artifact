import * as core from '@actions/core';
import { HttpClient } from '@actions/http-client';
import { BearerCredentialHandler } from '@actions/http-client/auth';

export class RuntimeHttpClient {
    /**
     * A runtime HTTP client used to communicate with the current workflow runtime directly.
     */
    constructor() {
        this.apiVersion = '6.0-preview';

        const runtimeUrl = process.env['ACTIONS_RUNTIME_URL'];
        const runId = process.env['GITHUB_RUN_ID'];
        this.listArtifactsUrl = `${runtimeUrl}_apis/pipelines/workflows/${runId}/artifacts?api-version=${this.apiVersion}`;
        
        this.client = new HttpClient('action/artifact', [
            new BearerCredentialHandler(process.env['ACTIONS_RUNTIME_TOKEN'])
        ]);

        this.requestOptions = {
            "Accept": `application/json;api-version=${this.apiVersion}`
        };
    }

    /**
     * Deletes the artifact at the supplied URL.
     * @param {string} url The URL of the artifact.
     * @returns {object} An object containing the `success` state.
     */
    async deleteArtifact(url) {
        try {
            const response = await this.client.del(url, this.requestOptions);
            const body = await response.readBody();

            if (this.isStatusCodeSuccess(response.message.statusCode)) {
                return { success: true };
            } else {
                core.info(`Failed to delete artifact; status code ${response.message.statusCode}`);
            }
        } catch (e) {
            core.debug(e);
        }

        return { success: false };
    }

    /**
     * Lists the artifacts associated with the current runtime.
     * @returns {object} An object containing the `success` state, and the `data` containing the artifacts.
     */
    async listArtifacts() {
        try {
            const response = await this.client.get(this.listArtifactsUrl, this.requestOptions);
            const body = await response.readBody();

            if (this.isStatusCodeSuccess(response.message.statusCode)) {
                return {
                    success: true,
                    data: JSON.parse(body)
                }
            } else {
                core.info(`Failed to list artifacts; status code ${response.message.statusCode}`);
            }
        } catch (e) {
            core.debug(e)
        }

        return {
            success: false,
        }
    }

    /**
     * Determines whether the provided status code indicates a successful response.
     * @param {string} statusCode 
     * @returns {boolean} True when the status code should be considered successful.
     */
    isStatusCodeSuccess(statusCode) {
        if (!statusCode) {
            return false
        }
        
        return statusCode >= 200 && statusCode < 300
    }
}
