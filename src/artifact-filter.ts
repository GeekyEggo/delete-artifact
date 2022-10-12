import * as core from "@actions/core";
import minimatch from "minimatch";
import { Artifact } from "./typings/github-artifacts";
import { getInputBoolean, getInputMultilineValues } from "./utils";

type Filter = (artifacts: Artifact[]) => IterableIterator<Artifact>;

/**
 * Gets a filter that enables filtering of artifacts based on an exact match of their name.
 * @param {string[]} names The names to match.
 * @returns {Filter} The exact match filter.
 */
function getExactMatchFilter(names: string[]): Filter {
    return function* filter(artifacts: Artifact[]): IterableIterator<Artifact> {
        for (const name of names) {
            const artifact = artifacts.find((a) => a.name == name);
            if (artifact != null) {
                yield artifact;
            } else {
                core.warning(
                    `Unable to delete artifact "${name}"; the artifact was not found.`
                );
            }
        }
    };
}

/**
 * Gets a filter that enables filtering of artifacts based on glob-pattern matching their name.
 * @param {string[]} names The names to match.
 * @returns {Filter} The glob match filter.
 */
function getGlobMatchFilter(names: string[]): Filter {
    const isMatch = (artifact: Artifact): boolean =>
        names.some((pattern) => minimatch(artifact.name, pattern));

    return function* filter(artifacts: Artifact[]): IterableIterator<Artifact> {
        for (const artifact of artifacts.filter(isMatch)) {
            yield artifact;
        }
    };
}

/**
 * Gets the default filter based on the action settings.
 * @returns {Filter} The filter to be used when determining which artifacts to delete.
 */
export function getDefaultFilter(): Filter {
    const names = getInputMultilineValues("name");

    return getInputBoolean("useGlob")
        ? getGlobMatchFilter(names)
        : getExactMatchFilter(names);
}

