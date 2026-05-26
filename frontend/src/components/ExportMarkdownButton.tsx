import { useState } from 'react';
import { backlogToMarkdown } from '../utils/markdown';
import type { BacklogResult } from '../domain/types';

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportMarkdownButton(props: { result: BacklogResult }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const md = backlogToMarkdown(props.result);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const md = backlogToMarkdown(props.result);
    const date = new Date().toISOString().slice(0, 10);
    download(`mvp-estimator-${date}.md`, md);
  }

  return (
    <div className="row">
      <button
        className={`btn ${copied ? 'success' : ''}`}
        onClick={handleCopy}
        type="button"
        aria-label="Copiar backlog em Markdown"
      >
        {copied ? '✓ Copiado!' : '📋 Copiar Markdown'}
      </button>
      <button
        className="btn"
        onClick={handleDownload}
        type="button"
        aria-label="Baixar backlog como arquivo .md"
      >
        ⬇ Baixar .md
      </button>
    </div>
  );
}
