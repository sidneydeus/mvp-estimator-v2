export class HttpError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function timeoutSignal(timeoutMs: number): AbortSignal {
  if ('AbortSignal' in globalThis && 'timeout' in (AbortSignal as any)) {
    return AbortSignal.timeout(timeoutMs);
  }
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  // garante que GC não segure o timer em casos longos
  controller.signal.addEventListener('abort', () => clearTimeout(id), { once: true });
  return controller.signal;
}

export async function postJson<TResponse>(
  url: string,
  body: unknown,
  opts?: { timeoutMs?: number },
): Promise<TResponse> {
  const timeoutMs = opts?.timeoutMs ?? 65000;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: timeoutSignal(timeoutMs),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (payload && typeof payload === 'object' && 'error' in (payload as any)) {
      const err = (payload as any).error;
      throw new HttpError(err.message || 'Erro na API', response.status, err.code, err.details);
    }
    throw new HttpError('Erro na API', response.status);
  }

  return payload as TResponse;
}

