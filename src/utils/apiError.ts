import i18n from '@/i18n';

type AnyRecord = Record<string, any>;

function pickMessageFromBody(body: any): string | undefined {
  if (!body) return undefined;
  if (typeof body === 'string') return body;
  if (typeof body?.message === 'string') return body.message;
  if (Array.isArray(body?.issues) && body.issues.length) {
    // zod-like: [{ message, path }]
    const first = body.issues[0];
    if (typeof first?.message === 'string') return first.message;
  }
  if (typeof body?.error === 'string') return body.error;
  return undefined;
}

export function getApiErrorMessage(
  errorOrResponse: any,
  fallbackKey: string = 'unknownError'
): string {
  // ts-rest response shape: { status, body }
  const maybeRes = errorOrResponse as AnyRecord;
  if (maybeRes && typeof maybeRes.status === 'number' && 'body' in maybeRes) {
    return (
      pickMessageFromBody(maybeRes.body) ??
      i18n.t(fallbackKey) ??
      String(fallbackKey)
    );
  }

  // axios-like / fetch-like errors
  const err = errorOrResponse as AnyRecord;
  const fromResponse =
    pickMessageFromBody(err?.response?.data) ??
    pickMessageFromBody(err?.response?.body);
  if (fromResponse) return fromResponse;

  const fromBody = pickMessageFromBody(err?.body);
  if (fromBody) return fromBody;

  if (typeof err?.message === 'string' && err.message.trim())
    return err.message;

  return i18n.t(fallbackKey) ?? String(fallbackKey);
}
