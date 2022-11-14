import { validateSchema, generateTypeErrorMessage } from '../src/lib/schema-validator';
import { MESSAGE_STATUSES, MESSAGE_COMMANDS } from '../src/ws/constants';

describe('Schema tests', () => {
  it('should check array schema based on type', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'number',
      },
    };
    const res = validateSchema(schema)([1, 2, 3]);
    expect(res[0]).toBeTruthy();
  });

  it('should check array schema based on properties', () => {
    const schema = {
      type: 'array',
      items: {
        properties: {
          0: {
            type: 'string',
          },
          1: {
            type: 'number',
          },
        },
      },
    };
    const res = validateSchema(schema)(['1', 2]);
    expect(res[0]).toBeTruthy();
  });

  it('should check array schema check return error', () => {
    const schema = {
      type: 'array',
      items: {
        properties: {
          0: {
            type: 'boolean',
          },
          1: {
            type: 'number',
          },
        },
      },
    };
    const res = validateSchema(schema)([1, 2]);
    expect(res[0]).toBeFalsy();
    expect(res[1]).toBe(generateTypeErrorMessage(1, 'boolean'));
  });

  it('should check array schema based on properties with embedded array', () => {
    const schema = {
      type: 'array',
      items: {
        properties: {
          1: {
            type: 'array',
            items: {
              properties: {
                0: {
                  type: 'boolean',
                },
                1: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    };
    const res = validateSchema(schema)(['1', [false, '1']]);
    expect(res[0]).toBeTruthy();
  });

  it('should check in values', () => {
    const schema = {
      type: 'number',
      in: [1, 2, 3, 4],
    };
    const res = validateSchema(schema)(1);
    expect(res[0]).toBeTruthy();
    const res2 = validateSchema(schema)(5);
    expect(res2[0]).toBeFalsy();
  });

  it('should check object', () => {
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
        test2: {
          type: 'number',
          in: [0, 10, 20],
        },
        test3: {
          type: 'boolean',
        },
      },
    };
    const obj = {
      test: [1, 2, 3],
      test2: 10,
      test3: false,
    };
    const obj2 = {
      test: [1, 2, 3],
      test2: 1,
      test3: false,
    };
    const res = validateSchema(schema)(obj);
    expect(res[0]).toBeTruthy();
    const res2 = validateSchema(schema)(obj2);
    expect(res2[0]).toBeFalsy();
  });

  it('should validate ref', () => {
    /** @type {Schema} */
    const PayloadDTOSchema = {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        errorType: {
          type: 'number',
        },
        messageStatus: {
          type: 'array',
          items: {
            type: 'number',
            in: Object.values(MESSAGE_STATUSES),
          },
        },
      },
      required: [],
    };

    /** @type {Schema} */
    const MessageDTOSchema = {
      type: 'array',
      items: {
        properties: {
          0: {
            type: 'number',
            in: Object.values(MESSAGE_STATUSES),
          },
          1: {
            type: 'string',
            in: Object.values(MESSAGE_COMMANDS),
          },
          2: {
            type: 'object',
            ref: PayloadDTOSchema,
          },
        },
      },
    };

    const res = validateSchema(MessageDTOSchema)([1, 'message', {}]);
    expect(res[0]).toBe(true);
  });

  it('should validate required params', () => {
    /** @type {Schema} */
    const PayloadDTOSchema = {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        errorType: {
          type: 'number',
        },
        messageStatus: {
          type: 'array',
          items: {
            type: 'number',
            in: Object.values(MESSAGE_STATUSES),
          },
        },
      },
      required: ['message'],
    };

    /** @type {Schema} */
    const MessageDTOSchema = {
      type: 'array',
      items: {
        properties: {
          0: {
            type: 'number',
            in: Object.values(MESSAGE_STATUSES),
          },
          1: {
            type: 'string',
            in: Object.values(MESSAGE_COMMANDS),
          },
          2: {
            type: 'object',
            ref: PayloadDTOSchema,
          },
        },
      },
    };

    const res = validateSchema(MessageDTOSchema)([1, 'message', {}]);
    expect(res[0]).toBeFalsy();
    const res2 = validateSchema(MessageDTOSchema)([1, 'message', { message: 'test' }]);
    expect(res2[0]).toBeTruthy();
    PayloadDTOSchema.required = ['message', 'errorType'];
    const res3 = validateSchema(MessageDTOSchema)([1, 'message', { message: 'test' }]);
    expect(res3[0]).toBeFalsy();
    const res4 = validateSchema(MessageDTOSchema)([1, 'message', { message: 'test', errorType: 1 }]);
    expect(res4[0]).toBeTruthy();
    const res5 = validateSchema(MessageDTOSchema)([1, 'message', { message: 'test', errorType: '1' }]);
    expect(res5[0]).toBeFalsy();
  });
});
