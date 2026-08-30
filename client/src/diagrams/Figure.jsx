export function Figure({ viewBox, ariaLabel, caption, children, maxWidth = 640 }) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-xl border border-border-soft bg-card p-5 overflow-x-auto">
        <svg
          viewBox={viewBox}
          role="img"
          aria-label={ariaLabel}
          xmlns="http://www.w3.org/2000/svg"
          className="text-text mx-auto block"
          style={{ maxWidth, width: '100%', height: 'auto' }}
        >
          <defs>
            <marker id="lesson-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      <figcaption className="text-xs text-muted text-center mt-2.5 max-w-lg mx-auto">{caption}</figcaption>
    </figure>
  );
}

export const F = { fontMono: 'JetBrains Mono, monospace', fontBody: 'Varela Round, sans-serif' };
