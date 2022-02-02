type LibMap = import("enonic-types/libs").EnonicLibraryMap;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __non_webpack_require__: <
  K extends keyof LibMap | string = string
  >(
  path: K
) => K extends keyof LibMap ? LibMap[K] : unknown;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const resolve: (path: string) => import("/lib/thymeleaf").ResourceKey;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const app: {
  name: string;
  version: string;
  config: { [key: string]: string };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const log: {
  info: (...args: unknown[]) => void;
  warning: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

declare module "*.svg" {
  const content: string;
  export default content;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __: {
  newBean: (bean: string) => unknown;
  toNativeObject: <A = unknown>(beanResult: A) => A;
  toScriptValue: (a: any) => any;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const Java: {
  type<A = any>(className: string): A;
};
