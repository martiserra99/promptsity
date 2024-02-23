import { PromptObject } from 'prompts';

import { Value } from 'mongu';

/**
 * It represents prompts.
 */
export type ValuePrompts = PromptObject;

/**
 * It represents what is returned.
 */
export type ValueReturn = Value;

/**
 * It represents variables. Each property corresponds to a variable.
 */
export type ValueVariables = { [key: string]: Value };
