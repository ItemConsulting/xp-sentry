const Parser = Java.type("ua_parser.Parser");

export function parseUserAgent(req: XP.Request): UserAgentData {
  const uaParser = new Parser();
  const client: UserAgentClient = uaParser.parse(req.headers["User-Agent"]);

  return {
    browser: {
      name: client.userAgent.family,
      version: getVersionString([client.userAgent.major, client.userAgent.minor, client.userAgent.patch])
    },

    os: {
      name: client.os.family,
      version: getVersionString([client.os.major, client.os.minor, client.os.patch, client.os.patchMinor])
    },

    device: {
      family: client.device.family !== "Other"
        ? client.device.family
        : undefined
    },
  };
}

function getVersionString(arr: Array<string | undefined>): string | null {
  const version = arr
    .filter((v) => v && v.length > 0)
    .join(".")

  return version.length > 0 ? version : null;
}

export interface UserAgentData {
  browser: {
    name?: string;
    version: string | null;
  }

  os: {
    name?: string;
    version: string | null;
  }

  device: {
    family?: string;
  }
}

interface UserAgentClient {
  device: {
    family?: string
  }

  userAgent: {
    family?: string;
    major?: string;
    minor?: string;
    patch?: string;
  }

  os: {
    family?: string;
    major?: string;
    minor?: string;
    patch?: string;
    patchMinor?: string;
  }
}
