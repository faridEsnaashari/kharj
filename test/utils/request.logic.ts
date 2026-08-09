import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';

export type KharjResponse<Res> = {
  success: boolean;
  message: 'string';
  data: Res;
};

export type SignedInUser = {
  token: string;
};

export async function makeReq<Res>(
  app: NestExpressApplication,
  {
    method,
    body,
    query,
    baseUrl,
    token,
  }: {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    body?: Record<string, unknown>;
    query?: Record<string, string>;
    baseUrl: string;
    token?: string;
  },
): Promise<KharjResponse<Res>> {
  let url = baseUrl;
  if (query) {
    url = addUrlQuery(url, query);
  }
  const req = request(app.getHttpServer())[method](url);

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  const result = await req.send(body ?? undefined);

  return result.body as KharjResponse<Res>;
}

export function makeAppReq(app: NestExpressApplication) {
  return <Res>({
    method,
    body,
    query,
    baseUrl,
    token,
  }: Parameters<typeof makeReq>[1]) => {
    return makeReq<Res>(app, { method, body, query, baseUrl, token });
  };
}

function addUrlQuery(baseUrl: string, obj: Record<string, string>) {
  const params = new URLSearchParams(obj).toString();

  return params ? `${baseUrl}?${params}` : baseUrl;
}
