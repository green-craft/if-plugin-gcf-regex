/* eslint-disable prettier/prettier */

import { GCFRegex } from '../../../lib';

import { ERRORS } from '../../../util/errors';

const { InputValidationError, ConfigValidationError } = ERRORS;

describe('lib/gcf-regex: ', () => {
  describe('GCFRegex: ', () => {
    const globalConfig = {
      parameter: 'cloud/instance-type',
      match: '/(?<=_)[^_]+?(?=_|$)/g',
      output: 'gcf-cloud/instance-type',
    };
    const regex = GCFRegex(globalConfig);

    describe('init: ', () => {
      it('successfully initalized.', () => {
        expect(regex).toHaveProperty('metadata');
        expect(regex).toHaveProperty('execute');
      });
    });

    describe('execute(): ', () => {
      it('successfully applies Regex strategy to given input.', async () => {
        const cloudInstanceType = 'Standard_DS1_v2';
        expect.assertions(1);

        const expectedResult = [
          {
            timestamp: '2021-01-01T00:00:00Z',
            duration: 3600,
            'cloud/instance-type': cloudInstanceType,
            'gcf-cloud/instance-type': 'DS1 v2',
          },
        ];

        const result = await regex.execute([
          {
            timestamp: '2021-01-01T00:00:00Z',
            duration: 3600,
            'cloud/instance-type': cloudInstanceType,
          },
        ]);

        expect(result).toStrictEqual(expectedResult);
      });

      it('throws an error when `parameter` does not match to `match`.', async () => {
        const cloudInstanceType = 'Standard_DS1_v2';
        const expectedMessage = `GCFRegex: \`${cloudInstanceType}\` does not match the /^[A-z]*_([^_]+?)_([^_]+?)_([^_]+?)$/ regex expression.`;

        const globalConfig = {
          parameter: 'cloud/instance-type',
          match: '^[A-z]*_([^_]+?)_([^_]+?)_([^_]+?)$',
          output: 'gcf-cloud/instance-type',
        };
        const regex = GCFRegex(globalConfig);

        expect.assertions(1);

        try {
          await regex.execute([
            {
              timestamp: '2021-01-01T00:00:00Z',
              duration: 3600,
              'cloud/instance-type': cloudInstanceType,
            },
          ]);
        } catch (error) {
          expect(error).toStrictEqual(
            new InputValidationError(expectedMessage)
          );
        }
      });

      it('throws an error on missing global config.', async () => {
        const expectedMessage = 'GCFRegex: Configuration data is missing.';

        const config = undefined;
        const regex = GCFRegex(config!);

        expect.assertions(1);

        try {
          await regex.execute([
            {
              timestamp: '2021-01-01T00:00:00Z',
              duration: 3600,
            },
          ]);
        } catch (error) {
          expect(error).toStrictEqual(
            new ConfigValidationError(expectedMessage)
          );
        }
      });

      it('throws an error on missing params in input.', async () => {
        const expectedMessage =
          'GCFRegex: `cloud/instance-type` is missing from the input.';

        expect.assertions(1);

        try {
          await regex.execute([
            {
              timestamp: '2021-01-01T00:00:00Z',
              duration: 3600,
            },
          ]);
        } catch (error) {
          expect(error).toStrictEqual(
            new InputValidationError(expectedMessage)
          );
        }
      });
    });
  });
});
