import { getPropertyType } from '~/client/utils/schema';

export function Responses({ responses }) {
  const statusCodes = Object.keys(responses).map((statusCode) => ({
    statusCode,
    ...responses[statusCode],
  }));

  return (
    <ul className="divide-y divide-gray-200">
      {statusCodes.map((response) => (
        <li key={response.statusCode} className="py-4 text-sm space-y-2">
          <div className="flex items-baseline space-x-2">
            <h5 className="font-medium">{response.statusCode}</h5>
            {response.schema ? (
              <div className="font-mono text-gray-600 text-xs">
                {getPropertyType(response.schema)}
              </div>
            ) : null}
          </div>
          {response.description ? (
            <p>{response.description}</p>
          ) : (
            <p className="text-xs text-gray-300">No description available</p>
          )}
        </li>
      ))}
    </ul>
  );
}
