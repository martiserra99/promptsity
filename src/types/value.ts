import { PromptObject } from 'prompts';

import { Value } from 'mongu';

export type ValuePrompts = PromptObject;

export type ValueReturn = Value;

export type ValueVariables = { [key: string]: Value };
