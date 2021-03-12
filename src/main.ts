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

    const {
      repository,
      organization: { login: owner },
      pull_request: pullRequest,
    } = github.context.payload;

    if (typeof repository === "undefined") {
      throw new Error(`Missing 'repository' from github action context.`);
    }
    if (typeof pullRequest === "undefined") {
      throw new Error(`Missing 'pull_request' from github action context.`);
    }

    const { name: repo } = repository;

    // github octokit client with given token
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const {
      data: {
        head: { user: prOwner },
      },
    } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullRequest?.number,
    });

    const username = prOwner?.login;
    if (!username) throw new Error("Cannot find PR owner");

    const { data: user } = await octokit.users.getByUsername({
      username,
    });

    if (!user?.name) throw new Error(`User not found: ${user?.name}`);

    const jira = getJIRAClient(JIRA_DOMAIN, JIRA_TOKEN);

    const jiraUser = await jira.findUser({
      displayName: user.name,
      issueKey: ISSUE_KEY,
    });
    if (!jiraUser) throw new Error(`JIRA account not found for ${user.name}`);
    const { assignee } = await jira.getTicketDetails(ISSUE_KEY);
    if (!assignee) throw new Error("Assignee not found");
    if (assignee.name === jiraUser.name) {
      console.log(`${ISSUE_KEY} is already assigned to ${assignee.name}`);
      return;
    }
    await jira.assignUser({ userId: jiraUser.accountId, issueKey: ISSUE_KEY });
    console.log(`${ISSUE_KEY} assigned to ${jiraUser.name}`);
  } catch (error) {
    console.log({ error });
    core.setFailed(error.message);
    process.exit(1);
  }
}

run();
