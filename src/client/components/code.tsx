// ignore order, because Prism must be loaded before the prism assets
// eslint-disable-next-line simple-import-sort/imports
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-json.min';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';

import { useMemo } from 'react';

function Code({
  children,
  lang = 'json',
  theme = 'dark',
}: {
  children: string;
  lang?: 'json' | 'bash' | 'js' | 'yaml';
  theme?: 'light' | 'dark';
}) {
  const highlighted = useMemo(
    () => Prism.highlight(children, Prism.languages[lang], lang),
    [children],
  );

  return (
    <pre
      className={`bg-gray-${
        theme === 'light' ? '100' : '700'
      }! p-4! leading-normal! m-0! text-sm! theme-${theme} language-${lang}`}
    >
      <code
        className={`theme-${theme} language-${lang}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}

export default Code;
