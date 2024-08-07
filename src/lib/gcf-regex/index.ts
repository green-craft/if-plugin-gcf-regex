/* eslint-disable prettier/prettier */
import { z } from 'zod';

import { buildErrorMessage } from '../../util/helpers';
import { ERRORS } from '../../util/errors';
import { validate } from '../../util/validations';

import { PluginInterface } from '../../interfaces';
import { ConfigParams, PluginParams } from '../../types/common';
import caseMatch from './caseMatcher'

const { InputValidationError, ConfigValidationError } = ERRORS;

export const GCFRegex = (globalConfig: ConfigParams): PluginInterface => {
  const errorBuilder = buildErrorMessage(GCFRegex.name);
  const metadata = {
    kind: 'execute',
  };

  /**
   * Checks global config value are valid.
   */
  const validateGlobalConfig = () => {
    if (!globalConfig) {
      throw new ConfigValidationError(
        errorBuilder({ message: 'Configuration data is missing' })
      );
    }
    const schema = z.object({
      parameter: z.string().min(1),
      match: z.string().min(1),
      output: z.string(),
    });

    return validate<z.infer<typeof schema>>(schema, globalConfig);
  };

  /**
   * Checks for required fields in input.
   */
  const validateSingleInput = (input: PluginParams, parameter: string) => {
    if (!input[parameter]) {
      throw new InputValidationError(
        errorBuilder({
          message: `\`${parameter}\` is missing from the input`,
        })
      );
    }

    return input;
  };

  /**
   * Executes the regex of the given parameter.
   */
  const execute = async (inputs: PluginParams[]) => {
    const safeGlobalConfig = validateGlobalConfig();
    const { parameter: parameter, match, output } = safeGlobalConfig;

    return inputs.map(input => {
      const safeInput = Object.assign(
        {},
        input,
        validateSingleInput(input, parameter)
      );

      return {
        ...input,
        [output]: matchReturnAllWithInBetweenSpaces(safeInput, parameter, match),
      };
    });
  };

  /**
   * Extracts a substring from the given input parameter that matches the provided regular expression pattern.
   */
  const matchReturnAllWithInBetweenSpaces = (
    input: PluginParams,
    parameter: string,
    match: string
  ) => {
    if (!match.startsWith('/')) {
      match = '/' + match;
    }

    if (!match.endsWith('/g') && !match.endsWith('/')) {
      match += '/';
    }

    console.warn(`[GCF Custom plugin] Executing...,
      input parameter is ${JSON.stringify(input)}
      
      `)
    const regex = eval(match);
    const matchedItem = input[parameter].match(regex);

    if (!matchedItem || !matchedItem[0]) {
      throw new InputValidationError(
        errorBuilder({
          message: `\`${input[parameter]}\` does not match the ${match} regex expression`,
        })
      );
    }

    console.warn(`[GCF Custom plugin] Here are your inputs:
      regex input: ${regex},
      input string: ${input[parameter]},
      matched items: ${matchedItem} with type ${typeof(matchedItem)} and length ${matchedItem.length}}
      `)

    let result = '';
    for (let i = 0; i < matchedItem.length; i++) {
      result += matchedItem[i] + ' ';
    }
    console.warn(`[GCF Custom plugin] =====Result of instance type is ${result}. Matching case`)
    const matched_result = caseMatch(result.trim())

    return matched_result.trim(); // remove trailing space from final result
  };

  return {
    metadata,
    execute,
  };
};
