import { Value } from 'mongu';

/**
 * It represents the union of list, condition, loop, prompts, return and variables.
 */
export type Json = JsonFlow | JsonItem;

/**
 * It represents the union of list, condition and loop.
 */
export type JsonFlow = JsonList | JsonCond | JsonLoop;

/**
 * It represents a list.
 */
export type JsonList = (JsonCond | JsonLoop | JsonItem)[];

/**
 * It represents a condition.
 */
export type JsonCond = { cond: { if: Value; then: JsonList; else: JsonList } };

/**
 * It represents a loop.
 */
export type JsonLoop = { loop: { while: Value; do: JsonList } };

/**
 * It represents the union of prompts, return and variables.
 */
export type JsonItem = JsonPrompts | JsonReturn | JsonVariables;

/**
 * It represents prompts.
 */
export type JsonPrompts = { prompts: Value };

/**
 * It represents what is returned.
 */
export type JsonReturn = { return: Value };

/**
 * It represents variables.
 */
export type JsonVariables = { variables: Value };
