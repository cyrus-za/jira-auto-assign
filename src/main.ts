import * as core from "@actions/core";
import * as github from "@actions/github";
import { ActionInputs } from "./types";

import { getJIRAClient } from "./utils";

const getInputs = (): ActionInputs => {
  const JIRA_TOKEN: string = core.getInput("jira-token", { required: true });
  const GITHUB_TOKEN: string = core.getInput("github-token", {
    required: true,
  });
  const JIRA_DOMAIN: string = core.getInput("jira-domain", {
    required: true,
  });
  const ISSUE_KEY: string = core.getInput("issue-key", {
    required: true,
  });

  return {
    ISSUE_KEY,
    JIRA_TOKEN,
    GITHUB_TOKEN,
    JIRA_DOMAIN: JIRA_DOMAIN.endsWith("/")
      ? JIRA_DOMAIN.replace(/\/$/, "")
      : JIRA_DOMAIN,
  };
};

async function run() {
  try {
    const inputs = getInputs();
    core.debug(`inputs: ${JSON.stringify(inputs, null, 2)}`);
    const { JIRA_TOKEN, GITHUB_TOKEN, JIRA_DOMAIN, ISSUE_KEY } = inputs;

    // github octokit client with given token
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { actor } = github.context;

    const { data: user } = await octokit.users.getByUsername({
      username: actor,
    });

    if (!user.name) throw new Error(`User not found: ${actor}`);

    const jira = getJIRAClient(JIRA_DOMAIN, JIRA_TOKEN);

    const { accountId, name } = await jira.findUser({
      displayName: user.name,
      issueKey: ISSUE_KEY,
    });
    const { assignee } = await jira.getTicketDetails(ISSUE_KEY);
    if (assignee.name === name) {
      console.log(`${ISSUE_KEY} is already assigned to ${name}`);
      return;
    }
    await jira.assignUser({ userId: accountId, issueKey: ISSUE_KEY });
    console.log(`${ISSUE_KEY} assigned to ${name}`);
  } catch (error) {
    console.log({ error });
    core.setFailed(error.message);
    process.exit(1);
  }
}

run();
