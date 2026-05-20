function isLocalhost(hostname: string) {
  return ['localhost', '127.0.0.1', '::1'].includes(hostname);
}

function resolveApiUrl() {
  const fallbackUrl = import.meta.env.PROD ? '/api' : 'http://localhost:3333/api';
  const configuredUrl = import.meta.env.VITE_API_URL || fallbackUrl;

  if (typeof window === 'undefined') {
    return configuredUrl;
  }

  const browserIsLocal = isLocalhost(window.location.hostname);
  const apiHostname = new URL(configuredUrl, window.location.origin).hostname;

  if (!browserIsLocal && isLocalhost(apiHostname)) {
    return '/api';
  }

  return configuredUrl;
}

const API_URL = resolveApiUrl();

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('assistech:token');
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Nao foi possivel conectar com a API. Verifique se o backend esta rodando ou acesse o link publicado da Vercel.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao comunicar com o servidor.');
  }

  return data as T;
}

export const apiUrl = API_URL;
