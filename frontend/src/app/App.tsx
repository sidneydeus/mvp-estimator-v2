import { EstimatorPage } from '../pages/EstimatorPage';

export function App() {
  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <div>
            <img src="/logo_mvp_estimator.webp" alt="MVP Estimator" className="main-logo" />
            <p className="subtitle">
              Cole sua ideia, gere um backlog estruturado e obtenha uma estimativa de horas com IA.
            </p>
          </div>
        </div>
        <span className="badge accent">
          <span>POST</span>
          <code>/api/estimates</code>
        </span>
      </header>

      <div className="grid">
        <EstimatorPage />
      </div>
    </div>
  );
}
