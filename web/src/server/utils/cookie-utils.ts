/* eslint-disable @typescript-eslint/no-explicit-any */
import { SerializeOptions, parse, serialize } from './cookie';

export function getCookies(req: any) {
  const cookieHeader = (req.headers as any)?.['cookie'];
  if (!cookieHeader) {
    return {};
  }
  return parse(cookieHeader);
}

export function getCookie(req: any, name: string) {
  const cookieHeader = (req.headers as any)?.['cookie'];
  if (!cookieHeader) {
    return;
  }
  const cookies = parse(cookieHeader);
  return cookies[name];
}

export function setCookie(
  res: any,
  name: string,
  value?: string | null,
  options?: SerializeOptions
) {
  res.setHeader('Set-Cookie', serialize(name, value || 'empty', options));
}
