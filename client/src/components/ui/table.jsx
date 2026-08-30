import { cn } from '../../lib/utils.js';

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full text-sm border-collapse', className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }) {
  return <thead className={cn('border-b border-border-soft', className)} {...props} />;
}

export function TBody(props) {
  return <tbody {...props} />;
}

export function TR({ className, ...props }) {
  return <tr className={cn('border-b border-border-soft/60 last:border-0', className)} {...props} />;
}

export function TH({ className, ...props }) {
  return (
    <th
      className={cn('px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted', className)}
      {...props}
    />
  );
}

export function TD({ className, ...props }) {
  return <td className={cn('px-3 py-2.5 text-text', className)} {...props} />;
}
