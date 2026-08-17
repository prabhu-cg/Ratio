import { useId, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
}

export function Tabs({ items, defaultTabId, className = '' }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const baseId = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === activeId);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveId(items[(index + 1) % items.length].id);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveId(items[(index - 1 + items.length) % items.length].id);
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Tabs"
        onKeyDown={handleKeyDown}
        className="flex gap-1 border-b border-border-default"
      >
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              className={`relative -mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                selected
                  ? 'border-brand text-text-heading'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="pt-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
