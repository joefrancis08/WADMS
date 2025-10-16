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

  // Helper function to truncate long text
  const truncateLabel = (text, max = 18) =>
    text.length <= max ? text : text.slice(0, max) + '…';

  return (
    <nav
      aria-label='Breadcrumb'
      className='flex flex-row items-center text-slate-100 text-sm gap-1 relative select-none'
    >
      {/* First (persistent) item */}
      <span
        title={firstItem.label}
        onClick={!firstItem.isActive ? firstItem.onClick : undefined}
        className={`${
          firstItem.isActive
            ? 'font-semibold text-base text-white cursor-default'
            : 'hover:underline cursor-pointer transition-all'
        } max-w-[180px] truncate`}
      >
        {truncateLabel(firstItem.label)}
      </span>

      {/* Ellipsis dropdown for middle items */}
      {hiddenItems.length > 0 && (
        <>
          <ChevronRight className='h-4 w-4 text-slate-400' />
          <div ref={dropdownRef} className='relative'>
            <button
              onClick={() => setShowMore(!showMore)}
              className='p-1 hover:bg-slate-700 rounded-md transition'
              aria-label='Show hidden breadcrumbs'
            >
              <Ellipsis className='h-4 w-4 -mb-2 text-slate-300' />
            </button>

            {showMore && (
              <div
                className='absolute left-0 mt-2 bg-slate-800 border border-slate-700 rounded-md shadow-lg p-2 flex flex-col gap-1 z-10 min-w-[12rem] animate-fade-slide'
              >
                {hiddenItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      item.onClick?.();
                      setShowMore(false);
                    }}
                    title={item.label}
                    className={`text-left px-2 py-1 rounded transition truncate max-w-[200px] ${
                      item.isActive
                        ? 'font-semibold text-green-400 bg-slate-700'
                        : 'text-slate-200 hover:bg-slate-700 hover:text-white'
                    }`}
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
            className={`${
              item.isActive
                ? 'font-semibold text-base cursor-default'
                : 'hover:underline cursor-pointer transition-all'
            } max-w-[180px] truncate`}
          >
            {truncateLabel(item.label)}
          </span>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
