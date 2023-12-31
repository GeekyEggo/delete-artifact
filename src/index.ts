import * as core from "@actions/core";
import { ArtifactClient } from "./artifact-client";
import { getDefaultFilter } from "./artifact-filter";
import { fail } from "./utils";

(async function () {
    try {
        const client = new ArtifactClient(core.getInput("token"));
        let failureCount = 0;

        // Get the artifacts associated with this workflow run.
        const artifacts = await client.list();
        const filter = getDefaultFilter();

        // Iterate over the filtered artifacts, and remove them.
        for (const { id, name } of filter(artifacts)) {
            if (await client.del(id)) {
                core.info(`Successfully deleted artifact: "${name}"`);
            } else {
                core.error(`Failed to delete artifact: "${name}"`);
                failureCount++;
            }
        }

        if (failureCount > 0) {
            fail(
                `Failed to delete ${failureCount} artifact${
                    failureCount !== 1 ? "s" : ""
                }.`
            );
        }
    } catch (err) {
        // @ts-ignore
        core.setFailed(err);
    }
})();
