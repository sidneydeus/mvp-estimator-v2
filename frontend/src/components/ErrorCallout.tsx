import type { ReactNode } from 'react';

export function ErrorCallout(props: { title: string; children?: ReactNode }) {
  return (
    <div className="callout danger fade-in" role="alert" aria-live="assertive">
      <div className="row" style={{ gap: 8, marginBottom: props.children ? 8 : 0 }}>
        <span aria-hidden="true">⚠️</span>
        <strong>{props.title}</strong>
      </div>
      {props.children ? <div>{props.children}</div> : null}
    </div>
  );
}
