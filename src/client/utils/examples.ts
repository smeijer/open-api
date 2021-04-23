import stripIdent from 'common-tags/lib/stripIndent';
import stringify from 'json-stringify-pretty-compact';

import { getExampleObject } from '~/client/utils/schema';

/**
 * This function will create a code sample, and return the example object
 * using the operation and schema definitions
 */
export function createCodeExample({
  operation,
  definitions,
}): { object: Record<string, unknown>; javascript: string } {
  const bodyParam = operation.parameters.find((param) => param.in === 'body');
  const object =
    bodyParam?.example || getExampleObject(bodyParam?.schema, definitions);
  const url = `${operation.baseURL}${operation.path}`;
  const method = operation.method.toUpperCase();

  const javascript = stripIdent`
fetch('${url}', {
  method: '${method}',
  headers: { 'content-type': 'application/json' },${
    Object.keys(object).length
      ? `\n  body: JSON.stringify(${stringify(object)
          .split('\n')
          .map((x) => `  ${x}`)
          .join('\n')
          .trim()}),`
      : ''
  }
});`;

  return {
    object,
    javascript,
  };
}
