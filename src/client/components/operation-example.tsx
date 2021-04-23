import { ChevronDownIcon, PlayIcon, UpdateIcon } from '@modulz/radix-icons';
import stripIdent from 'common-tags/lib/stripIndent';
import stringify from 'json-stringify-pretty-compact';
import { Fragment, useEffect, useState } from 'react';

import Code from '~/client/components/code';
import { createCodeExample } from '~/client/utils/examples';
import { getColor } from '~/client/utils/schema';

export function highlightPath(path) {
  return path
    .split('/')
    .filter(Boolean)
    .map((part, idx) =>
      /^{.*}$/.test(part) ? (
        <Fragment key={`${part}-${idx}`}>
          /<span className="text-pink-400">{part}</span>
        </Fragment>
      ) : (
        `/${part}`
      ),
    );
}

export function OperationExample({ operation, definitions }) {
  const color = getColor(operation);
  const method = operation.method.toUpperCase();
  const example = createCodeExample({ definitions, operation });

  const [state, setState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    data: any;
    error?: string;
  }>({
    status: 'idle',
    data: null,
  });

  useEffect(() => {
    setState({
      status: 'idle',
      data: null,
    });
  }, [operation.id]);

  async function transition() {
    switch (state.status) {
      case 'idle': {
        return;
      }

      case 'loading': {
        try {
          const data = await fetch('/api/simulate', {
            method: method,
            headers: {
              'content-type': 'application/json',
            },
            body: method === 'GET' ? undefined : JSON.stringify(example.object),
          }).then((res) =>
            res.json().then((data) => ({
              headers: Object.fromEntries(res.headers.entries()),
              data,
              statusCode: res.status,
              statusText: res.statusText,
            })),
          );

          setState({ status: 'success', data });
        } catch (e) {
          console.error('error during request', e);
          setState({ ...state, status: 'error', error: e.message });
        }
      }
    }
  }

  useEffect(() => {
    transition();
  }, [state.status]);

  return (
    <>
      <div className="bg-gray-800 text-white rounded-lg overflow-hidden">
        <div className="flex justify-between items-stretch px-4 py-2">
          <div className="flex text-xs font-mono items-baseline font-medium space-x-4">
            <div className={`text-${color}-400 uppercase`}>{method}</div>
            <p className="font-light text-gray-300">
              {highlightPath(operation.path)}
            </p>
          </div>
          <div className="text-gray-300 text-xs items-baseline font-mono flex items-center space-x-1">
            <span>Node.js</span>
            <ChevronDownIcon height={12} />
          </div>
        </div>

        <div className="bg-gray-700">
          <Code lang="js">{example.javascript}</Code>
        </div>
      </div>

      <div className="bg-gray-100 text-gray-400 rounded-lg overflow-hidden">
        <div className="bg-gray-200 flex justify-between items-stretch px-4 py-2">
          <div className="flex text-xs font-mono items-baseline font-medium space-x-4">
            <div className="uppercase text-gray-500">response</div>
          </div>
          <button
            onClick={() =>
              setState({ status: 'loading', data: example.object })
            }
            className="inline-flex hover:text-green-400 focus:outline-none rounded"
          >
            <PlayIcon />
          </button>
        </div>

        <div className="bg-gray-100 rounded-b">
          {state.status === 'success' ? (
            <>
              <Code theme="light" lang="yaml">{stripIdent`
HTTP/1.1 ${state.data.statusCode} ${state.data.statusText}
${Object.entries(state.data.headers)
  .map(([header, value]) => `${header}: ${value}`)
  .join('\n')
  .trim()}
`}</Code>
              <Code theme="light" lang="json">
                {stringify(state.data.data)}
              </Code>
            </>
          ) : state.status === 'loading' ? (
            <div className="text-xs font-mono font-medium p-4 flex items-center justify-center">
              <UpdateIcon className="animate-spin" />
            </div>
          ) : (
            <div className="text-xs font-mono font-medium p-4">
              Click the play button to execute this request
            </div>
          )}
        </div>
      </div>
    </>
  );
}
