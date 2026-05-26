import { useMemo, useState } from 'react';
import { createEstimate } from '../api/estimates';
import type { ApiError, ApiSuccess, BacklogResult } from '../domain/types';
import { IdeaForm } from '../components/IdeaForm';
import { ErrorCallout } from '../components/ErrorCallout';
import { EstimateResult } from '../components/EstimateResult';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { HttpError } from '../api/http';

const IDEA_MIN = 10;
const IDEA_MAX = 2000;

export function EstimatorPage() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacklogResult | null>(null);
  const [error, setError] = useState<{ title: string; message?: string; details?: unknown } | null>(null);

  const isValid = useMemo(() => idea.trim().length >= IDEA_MIN, [idea]);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await createEstimate(idea.trim());
      if (response.success) {
        const ok = response as ApiSuccess<BacklogResult>;
        setResult(ok.data);
        return;
      }
      const apiErr = response as ApiError;
      setError({
        title: apiErr.error.code || 'Erro',
        message: apiErr.error.message,
        details: apiErr.error.details,
      });
    } catch (e) {
      if (e instanceof HttpError) {
        const title = e.code || `HTTP_${e.status}`;
        const message =
          e.status === 408
            ? 'O processamento demorou mais que 60s. Tente novamente com uma descrição menor.'
            : e.message;
        setError({ title, message, details: e.details });
        return;
      }
      const message = e instanceof Error ? e.message : 'Erro inesperado no frontend';
      setError({ title: 'FRONTEND_ERROR', message });
    } finally {
      setLoading(false);
    }
  }

  function onClear() {
    setIdea('');
    setResult(null);
    setError(null);
  }

  return (
    <>
      <IdeaForm value={idea} onChange={setIdea} disabled={loading} maxLength={IDEA_MAX} />

      {/* Actions */}
      <div className="card">
        <h3 className="sectionTitle">Ações</h3>
        <div className="row">
          <button
            className="btn primary"
            disabled={!isValid || loading}
            onClick={onSubmit}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Gerando…
              </>
            ) : (
              '⚡ Gerar estimativa'
            )}
          </button>

          <button className="btn" disabled={loading} onClick={onClear}>
            🗑 Limpar
          </button>

          <span className="badge">
            Mín: <code>{IDEA_MIN}</code> chars
          </span>
          <span className="badge">
            Timeout: <code>60s</code>
          </span>
        </div>
        <p className="muted" style={{ margin: '10px 0 0' }}>
          Ao enviar, você concorda que esta é uma estimativa aproximada baseada em tokens de complexidade.
        </p>
      </div>

      {/* Error */}
      {error && (
        <ErrorCallout title={error.title}>
          <div className="muted">{error.message}</div>
          {error.details ? (
            <pre
              style={{
                marginTop: 10,
                whiteSpace: 'pre-wrap',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 12,
                borderRadius: 10,
                fontSize: 12,
              }}
            >
              {JSON.stringify(error.details, null, 2)}
            </pre>
          ) : null}
        </ErrorCallout>
      )}

      {/* Loading skeleton */}
      {loading && <LoadingSkeleton />}

      {/* Result */}
      {result && !loading && <EstimateResult result={result} />}
    </>
  );
}
