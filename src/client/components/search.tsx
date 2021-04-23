import { MagnifyingGlassIcon, SlashIcon } from '@modulz/radix-icons';
import { handleChange } from '@rakered/forms';
import { matchSorter } from 'match-sorter';
import { useEffect, useRef } from 'react';

type FormData = {
  query: string;
};

function search({ nodes, query, keys }) {
  if (!query || !query.trim().length) {
    return nodes;
  }

  const terms = query.split(' ').filter(Boolean);

  return terms.reduceRight(
    (results, term) =>
      matchSorter(results, term, {
        keys,
      }),
    nodes,
  );
}

export function Search({ onChange, nodes, keys }) {
  const propagateChange = handleChange<FormData>(({ query }) => {
    onChange(search({ nodes, query, keys }));
  });

  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const listener = (event) => {
      if (event.key === 'Escape') {
        inputRef.current.value = '';
        onChange(nodes);
        return;
      }

      // Ignore active element as well, otherwise we wouldn't be able to type the trigger key
      if (
        event.key !== '/' ||
        !inputRef.current ||
        inputRef.current === document.activeElement
      ) {
        return;
      }

      inputRef.current.focus();
      event.preventDefault();
    };

    document.body.addEventListener('keydown', listener);
    return () => document.body.removeEventListener('keydown', listener);
  }, [inputRef]);

  return (
    <form
      className="w-full flex justify-center items-center px-4 pb-2"
      onChange={propagateChange}
    >
      <div className="relative">
        <div className="absolute h-full flex items-center px-2 text-gray-600">
          <MagnifyingGlassIcon />
        </div>
        <div className="absolute right-0 h-full flex items-center px-2 text-gray-600 font-mono">
          <div className="w-6 h-6 align-middle border border-gray-200 rounded flex items-center justify-center text-gray-400">
            <SlashIcon />
          </div>
        </div>
        <input
          ref={inputRef}
          placeholder="Search"
          className="border bg-gray-100 text-gray-600 py-2 px-8 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          name="query"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
