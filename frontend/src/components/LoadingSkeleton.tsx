export function LoadingSkeleton() {
  return (
    <div className="card fade-in" aria-busy="true" aria-label="Gerando estimativa...">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton skeleton-line" style={{ width: 120 }} />
        <div className="skeleton skeleton-line" style={{ width: 180 }} />
      </div>

      {/* Stats skeleton */}
      <div className="estimate-summary">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="estimate-stat">
            <div className="skeleton skeleton-line" style={{ width: '60%', height: 10 }} />
            <div className="skeleton skeleton-line" style={{ width: '80%', height: 28, marginTop: 6 }} />
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Vision skeleton */}
      <div className="skeleton skeleton-line" style={{ width: 140, height: 10, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 72, borderRadius: 14 }} />

      <div className="divider" />

      {/* Epics skeleton */}
      <div className="skeleton skeleton-line" style={{ width: 80, height: 10, marginBottom: 12 }} />
      {[1, 2].map((i) => (
        <div key={i} className="epic" style={{ marginTop: 12 }}>
          <div className="row" style={{ gap: 12, marginBottom: 10 }}>
            <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-line" style={{ width: '50%' }} />
              <div className="skeleton skeleton-line" style={{ width: '30%', height: 10 }} />
            </div>
          </div>
          <div className="skeleton skeleton-line" style={{ width: '90%' }} />
          <div className="skeleton skeleton-line" style={{ width: '70%' }} />

          {[1, 2].map((j) => (
            <div key={j} className="story" style={{ marginTop: 10 }}>
              <div className="skeleton skeleton-line" style={{ width: '60%' }} />
              <div className="skeleton skeleton-line" style={{ width: '85%' }} />
              <div className="skeleton skeleton-line" style={{ width: '40%', height: 10 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
