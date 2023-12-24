declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /**
             * Current workflow run identifier.
             */
            GITHUB_RUN_ID: string;

            /**
             * Repository of this workflow run in the format {OWNER}/{REPOSITORY}.
             */
            GITHUB_REPOSITORY: string;
        }
    }
}

export {};

