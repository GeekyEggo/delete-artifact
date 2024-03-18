![CI](https://github.com/GeekyEggo/delete-artifact/workflows/CI/badge.svg)
![Example](https://github.com/GeekyEggo/delete-artifact/workflows/Example/badge.svg)

# Delete artifacts

A GitHub Action for deleting artifacts within the workflow run. This can be useful when artifacts are shared across jobs, but are no longer needed when the workflow is complete.

## ✅ Compatibility

| `actions/upload-artifact` | `geekyeggo/delete-artifact` |
| ------------------------- | --------------------------- |
| `@v1`, `@v2`, `@v3`       | `@v1`, `@v2`                |
| `@v4`                     | ~~@v4~~, `@v5`              |

> [!NOTE]
> `geekyeggo/delete-artifact@v4` has been deprecated in favour of `geekyeggo/delete-artifact@v5` which removes the requirement of the `token` parameter.

## ⚡ Usage

See [action.yml](action.yml)

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

    - uses: geekyeggo/delete-artifact@v5
      with:
          name: my-artifact
```

### Specify multiple names

```yml
steps:
    - uses: geekyeggo/delete-artifact@v5
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
    - uses: geekyeggo/delete-artifact@v5
      with:
          name: okay-to-keep
          failOnError: false
```
