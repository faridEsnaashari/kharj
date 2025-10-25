export function getToken(headerObject: {
  authorization?: string;
}): string | false {
  if (!headerObject.authorization) {
    return false;
  }

  const token = headerObject.authorization.split('Bearer ')[1];
  if (token.length < 1) {
    return false;
  }

  return token;
}
