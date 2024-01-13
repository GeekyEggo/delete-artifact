<!--

## {version}

🚨 Break
✨ Add
🐞 Fix
♻️ Update

-->

# Change Log

## v4.1

-   Add default token.
-   Fix over-arching `catch` output; errors now correctly result in a failed run ([@TheMrMilchmann ](https://github.com/TheMrMilchmann)).

## v4.0

-   Add support for artifacts uploaded with `actions/upload-artifact@v4`.
-   Add requirement of `token` with read and write access to actions.
-   Update requests to use GitHub REST API.
-   Deprecate support for `actions/upload-artifact@v1`, `actions/upload-artifact@v2`, and `actions/upload-artifact@v3` (please use `geekyeggo/delete-artifact@v2`).

## v2.0

-   Add support for glob pattern matching via `useGlob`.

## v1.0

-   Initial release.
