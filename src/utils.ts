import axios from "axios";
import { JIRA, JIRAClient } from "./types";

export const getJIRAClient = (domain: string, token: string): JIRAClient => {
  const client = axios.create({
    baseURL: `https://${domain}/rest/api/3`,
    timeout: 2000,
    headers: { Authorization: `Basic ${token}` },
  });

  const findUser: JIRAClient["findUser"] = async ({
    displayName,
    issueKey,
  }) => {
    try {
      const projectKey = issueKey.split("-")[0];
      const { data } = await client.get<JIRA.User[]>(
        `user/assignable/multiProjectSearch?query=${displayName}&projectKeys=${projectKey}'`
      );
      return data?.[0];
    } catch (e) {
      throw e;
    }
  };

  const assignUser: JIRAClient["assignUser"] = async ({ userId, issueKey }) => {
    await client.put<JIRA.User[]>(`issue/${issueKey}/assignee`, {
      accountId: userId,
    });
  };

  const getIssue: JIRAClient["getIssue"] = async (id) => {
    try {
      const response = await client.get<JIRA.Issue>(
        `/issue/${id}?fields=project,summary,issuetype,labels,status,customfield_10016`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const getTicketDetails: JIRAClient["getTicketDetails"] = async (key) => {
    try {
      const issue: JIRA.Issue = await getIssue(key);
      const {
        fields: {
          assignee,
          issuetype: type,
          project,
          summary,
          customfield_10016: estimate,
          labels: rawLabels,
          status: issueStatus,
        },
      } = issue;

      const labels = rawLabels.map((label) => ({
        name: label,
        url: `${baseURL}/issues?jql=${encodeURIComponent(
          `project = ${project.key} AND labels = ${label} ORDER BY created DESC`
        )}`,
      }));

      return {
        key,
        summary,
        url: `${baseURL}/browse/${key}`,
        status: issueStatus.name,
        type: {
          name: type.name,
          icon: type.iconUrl,
        },
        assignee,
        project: {
          name: project.name,
          url: `${baseURL}/browse/${project.key}`,
          key: project.key,
        },
        estimate:
          typeof estimate === "string" || typeof estimate === "number"
            ? estimate
            : "N/A",
        labels,
      };
    } catch (e) {
      throw e;
    }
  };

  return {
    client,
    getTicketDetails,
    getIssue,
    findUser,
    assignUser,
  };
};
