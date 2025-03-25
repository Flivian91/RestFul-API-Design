export function logMiddleware(req) {
  return { res: req.method + " " + req.url };
}
