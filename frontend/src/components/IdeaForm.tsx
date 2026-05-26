export function IdeaForm(props: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength: number;
}) {
  const used = props.value.length;
  const remaining = props.maxLength - used;
  const pct = (used / props.maxLength) * 100;
  const barClass = pct >= 95 ? 'danger' : pct >= 80 ? 'warn' : '';

  return (
    <div className="card">
      <h3 className="sectionTitle">1 — Descreva sua ideia</h3>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
        maxLength={props.maxLength}
        placeholder="Ex: Quero um app de delivery para pets que permita agendar passeios, banho e tosa, com pagamento integrado e rastreamento em tempo real..."
        aria-label="Descrição da ideia de software"
      />

      <div className="progress-bar-wrap" role="progressbar" aria-valuenow={used} aria-valuemax={props.maxLength}>
        <div
          className={`progress-bar-fill ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="row" style={{ marginTop: 8, justifyContent: 'space-between' }}>
        <span className="muted">
          {remaining > 0 ? (
            <><strong style={{ color: barClass === 'danger' ? 'var(--danger)' : barClass === 'warn' ? 'var(--warning)' : 'var(--text)' }}>{remaining}</strong> caracteres restantes</>
          ) : (
            <span style={{ color: 'var(--danger)' }}>Limite atingido</span>
          )}
        </span>
        <span className="muted">Dica: inclua público-alvo, features e restrições.</span>
      </div>
    </div>
  );
}
