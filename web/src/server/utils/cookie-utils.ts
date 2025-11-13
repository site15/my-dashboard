import cookie, { SerializeOptions } from 'cookie';

export function getCookies(req: any) {
  const cookieHeader = (req.headers as any)?.['cookie'];
  if (!cookieHeader) {
    return {};
  }
  return cookie.parse(cookieHeader);
}

export function getCookie(req: any, name: string) {
  const cookieHeader = (req.headers as any)?.['cookie'];
  if (!cookieHeader) {
    return;
  }
  const cookies = cookie.parse(cookieHeader);
  return cookies[name];
}

export function setCookie(
  res: any,
  name: string,
  value?: string | null,
  options?: SerializeOptions
) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(name, value || 'empty', options)
  );
}
