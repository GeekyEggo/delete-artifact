![CI](https://github.com/GeekyEggo/delete-artifact/workflows/CI/badge.svg)
![Example](https://github.com/GeekyEggo/delete-artifact/workflows/Example/badge.svg)

# Delete artifacts

A GitHub Action for deleting artifacts within the workflow run. This can be useful when artifacts are shared across jobs, but are no longer needed when the workflow is complete.

## ✅ Compatibility

| `actions/upload-artifact` | `geekyeggo/delete-artifact` |
| ------------------------- | --------------------------- |
| `@v1`, `@v2`, `@v3`       | `@v1`, `@v2`                |
| `@v4`                     | `@v4`                       |

## ⚡ Usage

See [action.yml](action.yml)

> [!IMPORTANT]
> Support for `actions/upload-artifact@v4` utilizes the GitHub REST API, and requires a permissive [`GITHUB_TOKEN`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token), or a PAT with read and write access to `actions`.

### Delete an individual artifact

```yml
steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Create test file
      run: echo hello > test.txt

    - uses: actions/upload-artifact@v4
      with:
          name: my-artifact
          path: test.txt

    - uses: geekyeggo/delete-artifact@v4
      with:
          name: my-artifact
```

### Specify multiple names

```yml
steps:
    - uses: geekyeggo/delete-artifact@v4
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
    - uses: geekyeggo/delete-artifact@v4
      with:
          name: okay-to-keep
          failOnError: false
```
