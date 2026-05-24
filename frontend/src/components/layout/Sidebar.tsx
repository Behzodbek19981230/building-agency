import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface Props {
  items: NavItem[];
  basePath: string;
}

export function Sidebar({ items, basePath }: Props) {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-border hidden lg:block">
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              to={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
