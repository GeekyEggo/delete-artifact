import * as core from "@actions/core";

/**
 * Attempts to fail the action based on the `failOnError` input; otherwise an error is logged.
 * @param msg The message to log as the error, or the failure.
 */
export function fail(msg: string): void {
    if (getInputBoolean("failOnError")) {
        core.setFailed(msg);
    } else {
        core.error(msg);
    }
}

/**
 * Attempts to get a truthy input based on the specified name.
 * @param  name The name of the input property.
 * @returns `true` when the input property is truthy; otherwise false.
 */
export function getInputBoolean(name: string): boolean {
    const value = core.getInput(name);
    return value === "true" || value === "1";
}

/**
 * Gets the input for the specified name, and splits the value by new line.
 * Credit to https://github.com/softprops
 * @param name The name of the input property.
 * @returns The values.
 */
export function getInputMultilineValues(name: string): string[] {
    return core
        .getInput(name)
        .split(/\r?\n/)
        .filter((name) => name)
        .map((name) => name.trim());
}
