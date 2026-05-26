import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | '...')[] = [1];
  if (page > 3) pages.push('...');
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push('...');
  pages.push(totalPages);
  return pages;
}

export function Pagination({ page, totalPages, total, limit, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  const from = total && limit ? (page - 1) * limit + 1 : null;
  const to = total && limit ? Math.min(page * limit, total) : null;

  return (
    <div className={clsx('flex flex-col sm:flex-row items-center justify-between gap-4 py-2', className)}>
      {/* Info */}
      {total != null && from != null && to != null ? (
        <p className="text-sm text-muted-foreground order-2 sm:order-1">
          <span className="font-medium text-foreground">{from}–{to}</span>
          {' '}/ {total} ta natija
        </p>
      ) : (
        <p className="text-sm text-muted-foreground order-2 sm:order-1">
          <span className="font-medium text-foreground">{page}</span> / {totalPages} sahifa
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Prev */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={clsx(
            'h-10 px-3 flex items-center gap-1.5 rounded-xl border text-sm font-medium transition-all',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            page === 1
              ? 'border-border text-muted-foreground'
              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5',
          )}
          aria-label="Oldingi"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className="w-10 h-10 flex items-center justify-center text-sm text-muted-foreground select-none"
              >
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p)}
                className={clsx(
                  'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all',
                  p === page
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5',
                )}
              >
                {p}
              </button>
            ),
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className={clsx(
            'h-10 px-3 flex items-center gap-1.5 rounded-xl border text-sm font-medium transition-all',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            page === totalPages
              ? 'border-border text-muted-foreground'
              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5',
          )}
          aria-label="Keyingi"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
