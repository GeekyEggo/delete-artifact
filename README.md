![CI](https://github.com/GeekyEggo/delete-artifact/workflows/CI/badge.svg)
![Example](https://github.com/GeekyEggo/delete-artifact/workflows/Example/badge.svg)

# Delete artifacts

A GitHub Action for deleting artifacts within the workflow run. This can be useful when artifacts are shared across jobs, but are no longer needed when the workflow is complete.

## ⚡ Usage

See [action.yml](action.yml)

> **Warning**
> From version 2 onwards, glob (wildcard) support is on by default, and is fulfilled by [minimatch](https://www.npmjs.com/package/minimatch); this can be disabled by setting `useGlob` to `false`.

### Delete an individual artifact

```yml
steps:
    - uses: actions/checkout@v2

    - run: echo hello > world.txt

    - uses: actions/upload-artifact@v2
      with:
          name: my-artifact
          path: world.txt

    # delete-artifact
    - uses: geekyeggo/delete-artifact@v2
      with:
          name: my-artifact
```

### Specify multiple names

```yml
steps:
    - uses: geekyeggo/delete-artifact@2
      with:
          name: |
              artifact-*
              binary-file
              output
```

## 🚨 Error vs Fail

By default, the action will fail when it was not possible to delete an artifact (with the exception of name mismatches). When the deletion of an artifact is not integral to the success of a workflow, it is possible to error without failure. All errors are logged.

```yml
steps:
    - uses: geekyeggo/delete-artifact@v2
      with:
          name: okay-to-keep
          failOnError: false
```

## ⚠ Disclaimer

This action utilizes a preview version of GitHub's runtime API; the API is subject to change at any time which may result in failures of this action.

