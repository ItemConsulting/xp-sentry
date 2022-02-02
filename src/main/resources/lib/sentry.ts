import {getVersion} from "/lib/xp/admin";
const Sentry = Java.type("io.sentry.Sentry");
const ProtocolUser = Java.type("io.sentry.protocol.User");
const ProtocolRequest = Java.type("io.sentry.protocol.Request");
const ProtocolRuntime = Java.type("io.sentry.protocol.SentryRuntime");

export type Context = Record<string, unknown>;
export type Primitive = number | string | boolean | symbol | null | undefined;

export interface User {
  [key: string]: any;
  id?: string;
  ip_address?: string;
  email?: string;
  username?: string;
}

export interface Request {
  url?: string;
  method?: string;
  queryString?: string;
}

export interface TraceHeader {
  name: string;
  traceId: string;
  spanId: string;
  sampled: boolean;
  tracingEnabled: boolean;
}

interface JavaScope {
  setTag(key: string, value: string): void;
  setContexts(name: string, context: Context | null): void;
  setUser(user: typeof ProtocolUser): void;
  getUser(): typeof ProtocolUser;
  setExtra(key: string, value: string): void;
  clearBreadcrumbs(): void;
  setRequest(request: typeof ProtocolRequest): void;
}

export const SENTRY_TRACE_HEADER = "sentry-trace";
export const SENTRY_NO_TRACE_ID = "00000000000000000000000000000000";

/**
 * Whether the client is enabled or not
 * @return true if its enabled or false otherwise.
 */
export function isEnabled(): boolean {
  return Sentry.isEnabled();
}

export function configureScope(callback: (scope: Scope) => void): void {
  Sentry.configureScope((scope: any) => {
    const config = new Scope(scope);
    callback(config);
  });
}


export function withScope(callback: (scope: Scope) => void): void {
  Sentry.withScope((scope: any) => {
    const config = new Scope(scope);
    callback(config);
  });
}

export function captureMessage(message: string): string {
  return Sentry.captureMessage(message);
}

export function captureException(exception: unknown, hint?: string): string {
  return Sentry.captureException(exception, hint);
}

export function clearBreadcrumbs(): void {
  Sentry.clearBreadcrumbs();
}

export function startTransaction({ name, operation , description, bindToScope }: StartTransactionParams): Transaction {
  const transaction = Sentry.startTransaction(name, operation, description, bindToScope ?? false);

  return {
    toSentryTrace(): TraceHeader {
      return parseTraceHeaders(transaction.toSentryTrace())
    },

    finish() {
      transaction.finish();
    }
  }
}

interface Transaction {
  toSentryTrace(): TraceHeader;
  finish(): void;
}

interface StartTransactionParams {
  name: string;
  operation?: string;
  description?: string;
  bindToScope?: boolean;
}

export function traceHeaders(): TraceHeader | undefined {
  const config = Sentry.traceHeaders();

  if (config) {
    return parseTraceHeaders(config);
  } else {
    return undefined;
  }
}

function parseTraceHeaders(config: any): TraceHeader {
  return {
    name: config.getName(),
    traceId: config.getTraceId().toString(),
    spanId: config.getSpanId().toString(),
    sampled: config.isSampled(),
    tracingEnabled: config.getTraceId().toString() !== SENTRY_NO_TRACE_ID
  }
}

export function close(): void {
  Sentry.close();
}

export class Scope {
  javaScope: JavaScope;

  constructor(javaScope: JavaScope) {
    this.javaScope = javaScope;

    // Set runtime to be XP
    const runtime = new ProtocolRuntime();
    runtime.setName("Enonic XP");
    runtime.setVersion(getVersion());
    this.javaScope.setContexts("runtime", runtime);
  }

  /**
   * Set key:value that will be sent as tags data with the event.
   * Can also be used to unset a tag by passing undefined.
   * @param key String key of tag
   * @param value Value of tag
   */
  setTag(key: string, value: Primitive): this {
    this.javaScope.setTag(key, String(value))
    return this;
  }

  /**
   * Set an object that will be merged sent as tags data with the event.
   * @param tags Tags context object to merge into current context.
   */
  setTags(tags: Record<string, Primitive>): this {
    for (let key in tags) {
      this.setTag(key, tags[key])
    }

    return this;
  }

  /**
   * Sets context data with the given name.
   * @param name of the context
   * @param context an object containing context data. This data will be normalized. Pass `null` to unset the context.
   */
  setContext(name: string, context: Context | null): this {
    this.javaScope.setContexts(name, context)
    return this;
  }

  setRequest(req: Request): this {
    const request = new ProtocolRequest();

    if (req.url) {
      request.setUrl(req.url);
    }

    if (req.method) {
      request.setMethod(req.method);
    }

    if (req.queryString) {
      request.setQueryString(req.queryString);
    }

    this.javaScope.setRequest(request);

    return this;
  }

  /**
   * Updates user context information for future events.
   *
   * @param user User context object to be set in the current context. Pass `null` to unset the user.
   */
  setUser(user: User | null): this {
    const javaUser = new ProtocolUser();

    if(user) {
      if (user.id) {
        javaUser.setId(user.id);
      }
      if (user.email) {
        javaUser.setEmail(user.email);
      }
      if (user.username) {
        javaUser.setUsername(user.username);
      }
      if (user.ip_address) {
        javaUser.setIpAddress(user.ip_address);
      }
    }

    this.javaScope.setUser(javaUser);
    return this;
  }

  /**
   * Returns the `User` if there is one
   */
  getUser(): User | undefined {
    return this.javaScope.getUser();
  }

  /**
   * Set an object that will be merged sent as extra data with the event.
   * @param extras Extras object to merge into current context.
   */
  setExtras(extras: Record<string, unknown>): this {
    for (let key in extras) {
      this.setExtra(key, extras[key]);
    }
    return this;
  }
  /**
   * Set key:value that will be sent as extra data with the event.
   * @param key String of extra
   * @param extra Any kind of data. This data will be normalized.
   */
  setExtra(key: string, extra: unknown): this {
    this.javaScope.setExtra(key, String(extra))
    return this;
  }

  /**
   * Clear all the breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.javaScope.clearBreadcrumbs();
  }
}
