import MarkdownIT from 'markdown-it';

import { getPropertyType } from '~/client/utils/schema';

const md = new MarkdownIT();

export function Parameters({ schema }) {
  if (!schema?.properties || Object.keys(schema.properties).length === 0) {
    return <p className="text-gray-400 text-xs py-4">No parameters</p>;
  }

  const properties = Object.entries<Record<string, any>>(schema.properties);

  return (
    <ul className="divide-y divide-gray-200">
      {properties.map(([name, property]) => (
        <li key={name} className="py-4 text-sm space-y-2">
          <div className="flex items-baseline space-x-2">
            <h5 className="font-medium">{name}</h5>
            {property.required ? (
              <span className="font-mono uppercase text-orange-600">
                required
              </span>
            ) : (
              <span className="font-mono text-gray-600 text-xs">optional</span>
            )}
            <div className="font-mono text-gray-600 text-xs">
              {getPropertyType(property)}
            </div>
          </div>
          {property.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: md.render(property.description),
              }}
            />
          ) : (
            <p className="text-xs text-gray-300">No description available</p>
          )}
        </li>
      ))}
    </ul>
  );
}
