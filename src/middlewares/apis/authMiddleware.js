const validate = (token) => {
  const validToken = true;
  if (!validToken || !token) {
    return false;
  }
  return true;
};

export function authMiddleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  console.log(token);
  
  return { isvalid: validate(token) };
}
