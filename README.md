# JIRA auto assign

:octocat: A fast 🔥 TypeScript GitHub Action that will auto-assign JIRA issue
from PR github action
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Example usage

```yml
uses: cyrus-za/jira-auto-assign@master
with:
  issue-key: PRJ-123
  jira-token: ${{ secrets.JIRA_TOKEN }}
  github-token: ${{ secrets.GITHUB_TOKEN }}
  jira-domain: your-domain.atlassian.net
```

## Inputs

### `issue-key`

**Required** The JIRA ticket ID e.g. PRJ-123

### `jira-domain`

**Required** The subdomain of JIRA cloud that you use to access it. Ex:
"your-domain.atlassian.net".

### `jira-token`

**Required** Token used to update Jira Issue. Check below for more details on
how to generate the token.

### `github-token`

**Required** Github Token used to fetch PR info. Defaults to
{{ secrets.GITHUB_TOKEN }}

## Outputs

None

## `jira-token`

Since tokens are private, we suggest adding them as
[GitHub secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets).

The Jira token is used to fetch issue information via the Jira REST API. To get
the token:-

1. Generate an
   [API token via JIRA](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)
2. Create the encoded token in the format of
   `base64Encode(<username>:<api_token>)`. For example, if the username is
   `ci@example.com` and the token is `954c38744be9407ab6fb`, then
   `ci@example.com:954c38744be9407ab6fb` needs to be base64 encoded to form
   `Y2lAZXhhbXBsZS5jb206OTU0YzM4NzQ0YmU5NDA3YWI2ZmI=`
3. The above value (in this example
   `Y2lAZXhhbXBsZS5jb206OTU0YzM4NzQ0YmU5NDA3YWI2ZmI=`) needs to be added as the
   `JIRA_TOKEN` secret in your GitHub project.

Note: The user should have the
[required permissions (mentioned under GET Issue)](https://developer.atlassian.com/cloud/jira/platform/rest/v3/?utm_source=%2Fcloud%2Fjira%2Fplatform%2Frest%2F&utm_medium=302#api-rest-api-3-issue-issueIdOrKey-get).

## Build

`yarn install`

`yarn build`

We package everything to a single file with Vercel's
[ncc](https://github.com/vercel/ncc). Outputs to `dist/index.js`.

## Related Reading

- [GitHub Action Metadata Syntax](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/metadata-syntax-for-github-actions)
