import {getUser} from "/lib/xp/auth";
import {getSiteConfig} from "/lib/xp/portal";
import * as Sentry from "/lib/sentry";
import {parseUserAgent} from "/lib/user-agent";
import {type SiteConfig} from "../site-config";

export function filter(
  req: XP.Request,
  next: (req: XP.Request) => XP.Response
): XP.Response {
  const {browser, os, device} = parseUserAgent(req);

  Sentry.configureScope((scope) => {
    scope
      .setTags({
        branch: req.branch,
        repositoryId: req.repositoryId,
      })
      .setRequest({
        url: req.url,
        method: req.method
      })
      .setContext("browser", browser)
      .setContext("os", os);

    if (device.family) {
      scope.setContext("device", {
        family: device.family
      })
    }

    if (getSiteConfig<SiteConfig>().sendPersonalInformation) {
      const user = getUser();

      scope.setUser({
        id: user?.key,
        email: user?.email,
        ip_address: req.remoteAddress,
        username: user?.displayName
      })
    }
  });

  // run controllers
  const transaction = Sentry.startTransaction({
    name: "composePage",
    operation: "task",
    bindToScope: true
  })

  const res = next(req)

  transaction.finish();

  return res;
}
