const generateTypeErrorMessage = (v, type) => `${v.toString()} is NOT type of ${type}`;
const generateInError = (v, _in) => `${v.toString()} is NOT in: ${_in.toString()}`;
const generateRequiredError = (vName) => `${vName} is required to be passed`;

/**
 * @param {any} obj
 * @param {JSONSchema} schema
 * @return {[boolean, string?]}
 * */
export const checkSchema = (obj, schema) => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < schema.length; i += 1) {
      const curr = obj[i];
      const { type } = schema[i];
      if (typeof curr !== type) {
        return [false, generateTypeErrorMessage(curr, type)];
      }
      if (typeof curr === type && type === 'object' && schema[i].ref && !Array.isArray(curr)) {
        return checkSchema(curr, schema[i].ref);
      }
      if (schema[i].in && !schema[i].in.includes(curr)) {
        return [false, generateInError(curr, schema[i].in)];
      }
    }
  } else if (typeof obj === 'object') {
    if (typeof obj !== typeof schema) {
      return [false, generateTypeErrorMessage(obj, typeof schema)];
    }
    const schemaEntries = Object.entries(schema.properties);
    for (let i = 0; i < schemaEntries.length; i += 1) {
      const [key, properties] = schemaEntries[i];
      if (obj[key] === undefined && schema.required.includes(key)) {
        return [false, generateRequiredError(key)];
      }
      if (obj[key] !== undefined && properties.type !== typeof obj[key]) {
        if (!Array.isArray(obj[key])) {
          return [false, generateTypeErrorMessage(key, properties.type)];
        }
        if (!(Array.isArray(obj[key]) && properties.type === 'array')) {
          return [false, generateTypeErrorMessage(key, properties.type)];
        }
      }

      if (properties.in && !properties.in.includes(obj[key])) {
        return [false, generateInError(key, properties.in)];
      }
      if (properties?.type === 'array' && !Array.isArray(obj[key]) && obj[key] !== undefined) {
        return [false, generateTypeErrorMessage(key, properties.type)];
      }
      if (Array.isArray(obj[key]) && properties?.type === 'array') {
        if (properties?.items?.ref) {
          return checkSchema(obj[key], properties.ref);
        }

        if (properties?.items?.type) {
          const arr = obj[key];
          for (let j = 0; j < arr.length; j += 1) {
            const item = arr[j];
            // eslint-disable-next-line valid-typeof
            if (typeof item !== properties.items.type) {
              return [false, generateTypeErrorMessage(arr, properties.items.type)];
            }
            if (properties.items.in && !properties.items.in.includes(item)) {
              return [false, generateInError(item, properties.items.in)];
            }
          }
        }
      }
    }
  }
  return [true];
};
