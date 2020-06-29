export function jsonifyError(err: Error) {
  return Object.getOwnPropertyNames(err).reduce(
    (json, key) => (json[key] = err[key]),
    {}
  );
}
