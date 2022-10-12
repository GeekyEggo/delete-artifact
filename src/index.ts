import * as core from "@actions/core";
import RuntimeHttpClient from "./runtime-http-client";
import { fail } from "./utils";
import { getDefaultFilter } from "./artifact-filter";

/**
 * The main run function.
 */
async function run(): Promise<void> {
    const client = new RuntimeHttpClient();

    // get the artifacts
    const artifacts = await client.listArtifacts();
    if (!artifacts.success) {
        fail("Failed to load artifacts.");
        return;
    }

    let failureCount = 0;
    const filter = getDefaultFilter();

    // iterate over the matching artifacts
    for (const artifact of filter(artifacts.data.value)) {
        const del = await client.deleteArtifact(artifact.url);

        if (del.success) {
            core.info(`Successfully deleted artifact: "${artifact.name}"`);
        } else {
            core.error(`Failed to delete artifact: "${artifact.name}"`);
            failureCount++;
        }
    }

    // determine the overall success
    if (failureCount > 0) {
        fail("1 or more artifacts failed to delete.");
    }
}

run();

