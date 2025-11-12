import { ChevronRight, Ellipsis } from 'lucide-react';
import { useState, useRef } from 'react';
import useOutsideClick from '../hooks/useOutsideClick';

const Breadcrumb = ({ items = [] }) => {
  const [showMore, setShowMore] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setShowMore(false));

  if (!items.length) return null;

  // Always show first and last two items
  const firstItem = items[0];
  const lastTwo = items.slice(-2);
  const hiddenItems = items.slice(1, -2); // middle items

  // Truncate helper
  const truncateLabel = (text, max = 18) =>
    (text || '').length <= max ? text : `${text.slice(0, max)}…`;

  return (
    <nav
      aria-label='Breadcrumb'
      className='relative flex select-none flex-row items-center gap-1 text-sm text-slate-700'
    >
      {/* First item */}
      <span
        title={firstItem.label}
        onClick={!firstItem.isActive ? firstItem.onClick : undefined}
        className={[
          'max-w-[200px] truncate',
          firstItem.isActive
            ? 'font-semibold text-emerald-700 cursor-default'
            : 'hover:underline cursor-pointer transition-colors',
        ].join(' ')}
      >
        {truncateLabel(firstItem.label)}
      </span>

      {/* Ellipsis for hidden middle items */}
      {hiddenItems.length > 0 && (
        <>
          <ChevronRight className='h-4 w-4 text-slate-400' />
          <div ref={dropdownRef} className='relative'>
            <button
              onClick={() => setShowMore((v) => !v)}
              className='cursor-pointer rounded-md p-1 text-slate-600 transition hover:bg-slate-100'
              aria-label='Show hidden breadcrumbs'
              type='button'
            >
              <Ellipsis className='-mb-2 h-4 w-4' />
            </button>

            {showMore && (
              <div className='absolute left-0 z-40 mt-2 min-w-[14rem] rounded-md border border-slate-200 bg-white p-2 shadow-lg'>
                {hiddenItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      item.onClick?.();
                      setShowMore(false);
                    }}
                    title={item.label}
                    className={[
                      'w-full truncate rounded-md px-2 py-1 text-left text-sm transition',
                      item.isActive
                        ? 'bg-emerald-50 font-semibold text-emerald-700'
                        : 'cursor-pointer text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                    type='button'
                  >
                    {truncateLabel(item.label)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Last two items */}
      {lastTwo.map((item, index) => (
        <div key={index} className='flex items-center gap-1'>
          <ChevronRight className='h-4 w-4 text-slate-400' />
          <span
            title={item.label}
            onClick={!item.isActive ? item.onClick : undefined}
            className={[
              'max-w-[200px] truncate',
              item.isActive
                ? 'font-semibold text-emerald-700 cursor-default'
                : 'hover:underline cursor-pointer transition-colors',
            ].join(' ')}
          >
            {truncateLabel(item.label)}
          </span>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
