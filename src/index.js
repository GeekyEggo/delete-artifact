import { RuntimeHttpClient } from './runtimeHttpClient';
import * as core from '@actions/core';

/**
 * Gets the artifact names supplied by the input workflow.
 * Credit to https://github.com/softprops
 * @returns {object} The artifact names.
 */
function getNames() {
    return core.getInput('name')
        .split(/\r?\n/)
        .filter(name => name)
        .map(name => name.trim());
}

/**
 * Attempts to fail the action based on the `failOnError` input; otherwise an error is logged.
 * @param {string} msg The message to log as the error, or the failure.
 */
function fail(msg) {
    const failOnError = core.getInput('failOnError');

    if (failOnError.toLowerCase() === 'true' || failOnError === '1') {
        core.setFailed(msg);
    } else {
        core.error(msg);
    }
}

/**
 * The main run function.
 */
async function run() {
    const client = new RuntimeHttpClient(process.env);

    // get the artifacts
    const artifacts = await client.listArtifacts();
    if (!artifacts.success) {
        fail('Failed to load artifacts; debug logs may be available.');
        return;
    }
    JSON.stringify({
        artifacts,
        names: getNames()
    }, null, 2).split("\n").map(l => core.info(l));

    // iterate over the supplied artifact names and attempt to delete them
    let success = true;
    for (const name of getNames()) {
        const subset = artifacts.data.value.filter(a => a.name === name || (new RegExp(name).test(a.name)));
        if (subset.length) {
            for (const artifact of subset) {
                const del = await client.deleteArtifact(artifact.url);
                if (del.success) {
                    core.info(`Successfully deleted artifact "${artifact.name}".`);
                } else {
                    core.error(`Failed to delete artifact "${artifact.name}"; debug logs may be available.`);
                    success = false;
                }
            }
        } else {
            core.warning(`Unable to delete artifact "${name}"; the artifact was not found.`);
        }
    }

    // determine the overall success
    if (!success) {
        fail('1 or more artifacts failed to delete.');
    }
}

run();
