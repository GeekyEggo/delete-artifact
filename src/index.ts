import { DefaultArtifactClient } from "@actions/artifact";
import * as core from "@actions/core";
import { getDefaultFilter } from "./artifact-filter";
import { fail } from "./utils";

(async function () {
    try {
        const client = new DefaultArtifactClient();
        let failureCount = 0;

        // Get the artifacts associated with this workflow run.
        const { artifacts } = await client.listArtifacts();
        const filter = getDefaultFilter();

        // Iterate over the filtered artifacts, and remove them.
        for (const { name } of filter(artifacts)) {
            try {
                await client.deleteArtifact(name);
            } catch (e) {
                core.error(
                    `Failed to delete artifact: "${name}": ${e instanceof Error ? e.message : e}`,
                );

                failureCount++;
            }
        }

        if (failureCount > 0) {
            fail(
                `Failed to delete ${failureCount} artifact${
                    failureCount !== 1 ? "s" : ""
                }.`,
            );
        }
    } catch (err) {
        core.setFailed(<string | Error>err);
    }
})();
