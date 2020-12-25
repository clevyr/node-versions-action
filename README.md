# Node Matrix Action

This action outputs a matrix with the current Node versions. Useful in tandem with [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

## Inputs

### `repo`

**Required** Docker repo to prepend to `extra_tags`.

## Outputs

### `matrix`

Matrix JSON to be used in another job.

## Example usage

```yaml
gen-matrix:
  name: Generate Matrix
  runs-on: ubuntu-latest
  outputs:
    matrix: ${{ steps.gen-matrix.outputs.matrix }}
  steps:
    - name: Generate Matrix
      uses: clevyr/node-matrix-action@v1
      id: gen-matrix
      with:
        repo: clevyr/node

build:
  name: Build Node ${{ matrix.node_version }} Image
  runs-on: ubuntu-latest
  needs: [gen-matrix]
  strategy:
    matrix: ${{ fromJson(needs.gen-matrix.outputs.matrix) }}
  steps:
    [...]
```
