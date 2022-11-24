/**
 * @typedef {(v: any) => (s: Schema) => (ValidationResult)} Validator
 * */

export const generateTypeErrorMessage = (v, type) => `${v?.toString()} is NOT type of ${type}`;
export const generateInError = (v, _in) => `${v?.toString()} is NOT in: ${_in.toString()}`;
export const generateRequiredError = (vName) => `${vName} is required to be passed`;

const valid = [true, ''];

/** @type Validator */
const isObject = (v) => () => [typeof v === 'object' && !Array.isArray(v) && v !== null, generateTypeErrorMessage(v, 'object')];
/** @type Validator */
const isArray = (v) => () => [Array.isArray(v), generateTypeErrorMessage(v, 'array')];
/** @type Validator */
const isNumber = (v) => () => [typeof v === 'number', generateTypeErrorMessage(v, 'number')];
/** @type Validator */
const isString = (v) => () => [typeof v === 'string', generateTypeErrorMessage(v, 'string')];
/** @type Validator */
const isBoolean = (v) => () => [typeof v === 'boolean', generateTypeErrorMessage(v, 'boolean')];
/** @type Validator */
const isNull = (v) => () => [v === null, generateTypeErrorMessage(v, 'null')];
/** @type Validator */
const hasProperties = () => (schema) => [!!schema.items?.properties, 'No properties'];
/** @type Validator */
const hasType = () => (schema) => [!!schema?.items?.type, 'Doesn\'t have types'];
/** @type Validator */
const hasIn = () => (schema) => [!!schema.in, 'Doesn\'t have types'];
/** @type Validator */
const isProperTypes = (v) => (schema) => [
  typeof v === schema.type,
  generateTypeErrorMessage(v, schema.type),
];

/**
 * @return {{ res: ValidationResult, check: (v: (s: Schema) => ValidationResult ) => this }}
 * */
const validatorChain = (schema) => ({
  res: [],
  isValid: undefined,
  message: '',
  value() {
    return [!!this.isValid, this.message];
  },
  map(validator) {
    if (this.isValid === false) return this;
    if (typeof validator !== 'function') return this;

    const [isValid, message] = validator(schema);
    this.isValid = isValid;
    this.message = message;
    return this;
  },
  or(...validatorFns) {
    for (let i = 0; i < validatorFns.length; i += 1) {
      const fn = validatorFns[i];
      const res = fn(schema);
      if (res[0]) {
        this.res = res;
        return this;
      }
    }
    this.res = [false, 'No validator matches'];
    return this;
  },
  check(validatorFn) {
    if (typeof validatorFn === 'function'
            && (this.res[0] === true || this.res[0] === undefined)) {
      const res = validatorFn(schema);
      if (res[0] === undefined) {
        this.res = [false, 'Invalid validator function'];
        return this;
      }
      this.res = res;
    }
    return this;
  },
});

/**
 * @type {Validator}
 * */
const checkByType = (v) => (schema) => {
  const { res } = validatorChain(schema)
    .check(hasType());
  if (res[0] === true) {
    return v.reduce(
      (validator, value) => validator
        .check(isProperTypes(value)),
      validatorChain(schema.items),
    ).res;
  }
  return valid;
};

/**
 * @type {Validator}
 * */
const checkArrProperties = (v) => (schema) => {
  if (schema.type !== 'array') return [false, 'Invalid schema type'];
  const { res } = validatorChain(schema).check(hasProperties());
  if (res[0] === false) return valid;
  const entries = Object.entries(schema.items.properties);
  for (let i = 0; i < entries.length; i += 1) {
    // eslint-disable-next-line no-use-before-define
    const result = validateSchema(entries[i][1])(v[entries[i][0]]);
    if (result[0] === false) {
      return result;
    }
  }
  return valid;
};

/** @type Validator */
const checkObjectProperties = (v) => (schema) => {
  const { properties } = schema;
  if (properties === undefined) return valid;
  const propKeys = Object.keys(properties);
  for (let i = 0; i < propKeys.length; i += 1) {
    const key = propKeys[i];
    if (v[key]) {
      const result = validateSchema(schema.properties[key])(v[key]);
      if (result[0] === false) return result;
    }
  }
  return valid;
};

/** @type Validator */
const isIn = (v) => (schema) => [
  schema.in.includes(v),
  generateInError(v, schema.in),
];

/** @type Validator */
const checkIn = (v) => (schema) => {
  const validator = validatorChain(schema);
  if (validator.check(hasIn()).res[0] === false) return valid;
  const { res } = validator
    .or(
      isNull(v),
      isNumber(v),
      isString(v),
      isBoolean(v),
    );
  return (!res[0]) ? [false, 'In works with number(s), string(s), boolean(s), null(s)'] : validator.check(isIn(v)).res;
};

/** @type Validator */
const isValidArray = (v) => (schema) => {
  const validator = validatorChain(schema);
  const { res } = validator
    .check(isArray(v))
    .check(checkByType(v))
    .check(checkArrProperties(v))
    .check(checkIn(v));
  return res;
};

/** @type Validator */
const checkRequired = (v) => (schema) => {
  if (schema.required && schema.properties) {
    const keys = Object.values(schema.required);
    for (let i = 0; i < keys.length; i += 1) {
      if (!v[keys[i]]) return [false, generateRequiredError(keys[i])];
    }
  }
  return valid;
};

/** @type Validator */
const checkRef = (v) => (schema) => {
  if (schema.ref === undefined) return valid;
  return validateSchema(schema.ref)(v);
};

/** @type Validator */
const isValidObject = (v) => (schema) => {
  const validator = validatorChain(schema);
  const { res } = validator
    .check(isObject(v))
    .check(checkRef(v))
    .check(checkObjectProperties(v))
    .check(checkRequired(v));
  return res;
};

const checkCanBeEmpty = (v) => (schema) => {
  const { notEmpty } = schema;
  if (!v && notEmpty) {
    return [false, 'Value is not provided'];
  }
  return valid;
};

const isValidPrimitive = (v) => (schema) => {
  const validator = validatorChain(schema);
  const { res } = validator
    .check(isProperTypes(v))
    .check(checkIn(v))
    .check(checkCanBeEmpty(v));
  return res;
};

/**
 * @param {Schema} schema
 * @return {(o: any) => ValidationResult}
 * */
export function validateSchema(schema) {
  return (obj) => {
    if (!schema) return [true, 'Schema was not passed'];
    const { type } = schema;
    if (!type) return [true, `Unknown type passed: ${type}`];
    const checker = validatorChain(schema);
    switch (type) {
      case 'array':
        return checker
          .check(isArray(obj))
          .check(isValidArray(obj))
          .res;
      case 'object':
        return checker
          .check(isObject(obj))
          .check(isValidObject(obj))
          .res;
      default:
        return checker
          .check(isValidPrimitive(obj))
          .res;
    }
  };
}
