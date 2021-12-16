import type { JSONSchema6 } from 'json-schema';

export type JSONSchema = JSONSchema6;

/**
 * Take a JSON-Schema property, and return a string representation of the type
 */
export function getPropertyType(property) {
  if (property?.items?.type) {
    return `${property.items.type}[]`;
  }

  if (property?.items?.$ref) {
    return `${property.items.$ref.split('/').slice(-1)[0]}[]`;
  }

  if (property?.$ref) {
    return property.$ref.split('/').slice(-1)[0];
  }

  return property.type;
}

/**
 * Takes a Operation, and returns the matching OP color based on method and
 * deprecation flag
 */
export function getColor({ method, deprecated }) {
  const colors = {
    post: 'green',
    put: 'orange',
    get: 'blue',
    delete: 'red',
  };

  return deprecated ? 'gray' : colors[method];
}

/**
 * A quick and dirty way to convert definitions to example code. We
 * don't handle all cases. In a real world app we would also need to
 * resolve deeply nested properties schemas.
 */
export function getExampleObject(
  refObject,
  definitions: Record<string, JSONSchema>,
) {
  const obj = {};

  if (!refObject?.items?.$ref && !refObject?.$ref) {
    return obj;
  }

  const pointer = refObject.items?.$ref || refObject.$ref;

  // skip '#/components' || '#/definitions'
  const definition = pointer
    .split('/')
    .slice(2)
    .reduce((value, key) => value[key], definitions);

  if (!definition.properties) {
    return obj;
  }

  for (const [key, property] of Object.entries<Record<string, any>>(
    definition.properties,
  )) {
    if (typeof property === 'boolean') {
      obj[key] = property;
    } else if ('example' in property) {
      obj[key] = property['example'];
    } else if (property.$ref) {
      obj[key] = getExampleObject(property, definitions);
    } else if (property.items?.['$ref']) {
      obj[key] = [getExampleObject(property.items, definitions)];
    } else if (property.type === 'integer') {
      obj[key] = 0;
    } else if (property.items) {
      obj[key] = [property.items['type']];
    } else if (property.enum) {
      obj[key] = property.enum[0];
    } else {
      obj[key] = property.type;
    }
  }

  return refObject.items ? [obj] : obj;
}

const methodToActionMap = {
  get: ['get', 'find', 'take'],
  post: ['post', 'create', 'insert', 'make'],
  put: ['put', 'update', 'edit', 'modify'],
  patch: ['patch', 'update', 'edit', 'modify'],
  delete: ['delete', 'remove'],
};

/**
 * Converts the swagger definition to a flat list of operations
 */
export function getOperations(data) {
  if (!data) {
    return [];
  }

  const groups = {};

  const operations = Object.keys(data.paths)
    .map((path) =>
      Object.entries<Record<string, unknown>>(data.paths[path] || {}).map(
        ([method, operation]) => {
          // use pointers to link groups and operations
          const groupName = operation.tags?.[0] || path.split('/')[1];

          if (!groups[groupName]) {
            groups[groupName] = data.tags?.find(
              (t) => t.name === groupName,
            ) || {
              name: groupName,
            };
            groups[groupName].operations = [];
          }

          // openapi v3 defines urls in 'servers', swagger does not
          const baseURL = Array.isArray(data.servers)
            ? data.servers[0].url
            : `${data.schemes[0]}://${data.host}${data.basePath}`;

          const id = operation.operationId as string;

          return {
            id: id.startsWith(groupName + '/') ? id : `${groupName}/${id}`,
            group: groups[groupName],
            baseURL,
            path,
            method,
            keywords: methodToActionMap[method],
            ...operation,

            // add some explicitly for typescript inference
            deprecated: operation.deprecated,

            // swagger 2 vs openapi 3
            parameters:
              (operation.requestBody
                ? [
                    {
                      in: 'body',
                      ...(operation.requestBody as any)?.content[
                        'application/json'
                      ],
                    },
                  ]
                : operation.parameters) || [],
          };
        },
      ),
    )
    .flat()
    // don't show deprecated methods
    .filter((operation) => !operation.deprecated);

  for (const operation of operations) {
    groups[operation.group.name].operations.push(operation);
  }

  return operations;
}

export function groupOperationsByGroupName(operations) {
  return Object.values(
    operations.reduce((groups, next) => {
      if (!groups[next.group.name]) {
        groups[next.group.name] = { group: next.group, operations: [] };
      }

      groups[next.group.name].operations.push(next);
      return groups;
    }, {}),
  );
}
