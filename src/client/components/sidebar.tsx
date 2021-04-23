import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { Search } from '~/client/components/search';
import { groupOperationsByGroupName } from '~/client/utils/schema';

let LAST_CLICK = Date.now();

export function Sidebar({ operations }) {
  const router = useRouter();
  const { query } = router;

  const scrollRef = useRef<HTMLDivElement>();

  const selectedPage = Array.isArray(query.page)
    ? query.page.join('/')
    : query.page;

  const [suggestions, setSuggestions] = useState(operations);
  const grouped = groupOperationsByGroupName(suggestions);

  // Scroll the menu to the visible
  useEffect(() => {
    if (!scrollRef.current || !selectedPage) {
      return;
    }

    const invokedByClick = Date.now() - LAST_CLICK < 200;
    if (invokedByClick) {
      return;
    }

    const menuItem = scrollRef.current.querySelector(
      `a[href="/${selectedPage}"]`,
    ) as HTMLElement;

    if (!menuItem) {
      return;
    }

    scrollRef.current.scrollTo({
      top: menuItem.offsetTop - 50,
      behavior: 'smooth',
    });
  }, [selectedPage, scrollRef]);

  return (
    <aside className="h-screen fixed top-0 left-0 border-r border-gray-200 w-72 flex flex-col flex-none">
      <div className="p-4">
        <img src="/logo-text.svg" />
      </div>

      <Search
        onChange={setSuggestions}
        nodes={operations}
        keys={['path', 'method', 'keywords', 'summary']}
      />

      <div className="relative h-0">
        <div
          className="h-6 z-10"
          style={{
            width: `calc(100% - .5rem)`,
            boxShadow: 'inset 0 3rem 1.5rem -1.5rem #fff',
          }}
        />
      </div>
      <div className="flex-auto overflow-y-auto relative" ref={scrollRef}>
        {grouped.map(({ group, operations }) => (
          <div key={group.name}>
            <h2 className="font-medium uppercase px-4 py-2 mt-4 text-sm">
              {group.name}
            </h2>

            {operations.map((operation) => (
              <Link key={operation.id} href={`/${operation.id}`} shallow>
                <a
                  onClick={() => {
                    LAST_CLICK = Date.now();
                  }}
                  className={clsx(
                    'text-sm font-light px-4 py-2 hover:bg-gray-50 truncate flex justify-between items-center w-full cursor-pointer space-x-4',
                    {
                      'font-medium bg-gray-100': selectedPage === operation.id,
                    },
                  )}
                >
                  <span className="truncate">{operation.summary}</span>
                  <span className="text-gray-400 text-xs">
                    {operation.method}
                  </span>
                </a>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
