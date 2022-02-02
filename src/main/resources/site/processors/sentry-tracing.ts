import * as Sentry from "/lib/sentry";
import {forceArray} from "/lib/array";

const TRACE_ID_NONE = "00000000000000000000000000000000";

export function responseProcessor(req: XP.Request, res: XP.Response): XP.Response {
  const traceId = req.headers[Sentry.SENTRY_TRACE_HEADER] ?? Sentry.traceHeaders()?.traceId

  if (traceId && traceId !== TRACE_ID_NONE) {
    if (!res.pageContributions) {
      res.pageContributions = {};
    }

    res.pageContributions.headBegin = forceArray(res.pageContributions.headBegin)
      .concat(`<meta name="sentry-trace" content="${traceId}">`);

    res.headers = {
      ...res.headers ?? {},
      [Sentry.SENTRY_TRACE_HEADER]: traceId
    };
  }

  return res;
}
