export function forceArray<A>(data: A | Array<A> | undefined): Array<A>;
export function forceArray<A>(
  data: A | ReadonlyArray<A> | undefined
): ReadonlyArray<A>;
export function forceArray<A>(
  data: A | Array<A> | undefined
): ReadonlyArray<A> {
  data = data || [];
  return Array.isArray(data) ? data : [data];
}
