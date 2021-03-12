import { AxiosInstance } from "axios";

export namespace JIRA {
  export interface User {
    self: string;
    key: string;
    accountId: string;
    accountType: string;
    name: string;
    emailAddress: string;
    avatarUrls: {
      "16x16": string;
      "24x24": string;
      "32x32": string;
      "48x48": string;
    };
    displayName: string;
    active: true;
    timeZone: string;
    locale: string;
    groups: {
      size: number;
      items: [
        {
          name: string;
          self: string;
        }
      ];
      pagingCallback: {};
      callback: {};
      "max-results": number;
    };
    applicationRoles: {
      size: number;
      items: [
        {
          key: string;
          groups: ["<string>"];
          name: string;
          defaultGroups: ["<string>"];
          selectedByDefault: true;
          defined: true;
          numberOfSeats: 43;
          remainingSeats: 45;
          userCount: 50;
          userCountDescription: string;
          hasUnlimitedSeats: true;
          platform: true;
        }
      ];
      pagingCallback: {};
      callback: {};
      "max-results": number;
    };
    expand: string;
  }
  export interface IssueStatus {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: {
      self: string;
      id: number;
      key: string;
      colorName: string;
      name: string;
    };
  }

  export interface IssuePriority {
    self: string;
    iconUrl: string;
    name: string;
    id: string;
  }

  export interface IssueType {
    self: string;
    id: string;
    description: string;
    iconUrl: string;
    name: string;
    subtask: boolean;
    avatarId: number;
  }

  export interface IssueProject {
    self: string;
    key: string;
    name: string;
  }

  export interface Issue {
    id: string;
    key: string;
    self: string;
    status: string;
    fields: {
      summary: string;
      status: IssueStatus;
      priority: IssuePriority;
      issuetype: IssueType;
      project: IssueProject;
      labels: string[];
      [k: string]: unknown;
    };
  }
}

export interface JIRADetails {
  key: string;
  summary: string;
  url: string;
  status: string;
  type: {
    name: string;
    icon: string;
  };
  project: {
    name: string;
    url: string;
    key: string;
  };
  estimate: string | number;
  labels: readonly { name: string; url: string }[];
}

export interface ActionInputs {
  ISSUE_KEY: string;
  JIRA_TOKEN: string;
  JIRA_DOMAIN: string;
  GITHUB_TOKEN: string;
}

export interface JIRAClient {
  client: AxiosInstance;
  assignUser: (x: { userId: string; issueKey: string }) => Promise<void>;
  findUser: (x: {
    displayName: string;
    issueKey: string;
  }) => Promise<JIRA.User>;
  getIssue: (key: string) => Promise<JIRA.Issue>;
  getTicketDetails: (key: string) => Promise<JIRADetails>;
}
