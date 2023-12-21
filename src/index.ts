import prompts from 'prompts';

import { JsonList } from './types/json';

import Prompts, { StopPoint } from './classes/prompts';

import { PointPrompts, PointReturn } from './classes/point';

export async function promptsity(json: JsonList) {
  const instance = new Prompts(json);
  let point: StopPoint = instance.initial();
  while (point instanceof PointPrompts) {
    const variables = await prompts(point.value);
    point = instance.next(point, variables);
  }
  const returnPoint = point as PointReturn;
  return returnPoint.value;
}

export type Json = JsonList;
