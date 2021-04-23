import { Parameters } from '~/client/components/parameters';
import { Responses } from '~/client/components/responses';

function getDefinition(refObject, definitions) {
  if (!refObject?.$ref) {
    return null;
  }

  const name = refObject.$ref.split('/').slice(-1)[0];
  return definitions[name];
}

export function OperationDetails({ operation, definitions }) {
  const bodyParam = operation.parameters.find((param) => param.in === 'body');
  const definition = getDefinition(bodyParam?.schema, definitions);

  return (
    <div>
      <h2 className="text-2xl pb-4">{operation.id}</h2>
      <p className="font-light pb-4">{operation.summary}</p>

      <div>
        <h4 className="py-4 border-b border-gray-200 font-medium">
          Parameters
        </h4>
        <Parameters schema={definition} />

        <h4 className="mt-4 py-4 border-b border-gray-200 font-medium">
          Responses
        </h4>
        <Responses responses={operation.responses} />
      </div>
    </div>
  );
}
