import { Value } from 'mongu';

import { mongu } from 'mongu';

import { Position } from '../types/position';
import { ElementFlow } from './element';
import { ValuePrompts, ValueReturn, ValueVariables } from '../types/value';

import { ElementPrompts, ElementReturn, ElementVariables } from './element';

/**
 * This class represents a point in the execution.
 */
export class Point {
  public positions: Position[];
  public variables: { [key: string]: Value };

  constructor(positions: Position[], variables: { [key: string]: Value }) {
    this.positions = positions;
    this.variables = variables;
  }

  get currentPosition(): Position {
    return this.positions[this.positions.length - 1];
  }

  get previousPositions(): Position[] {
    return this.positions.slice(0, this.positions.length - 1);
  }

  static create(
    elementFlow: ElementFlow,
    positions: Position[],
    variables: { [key: string]: Value } = {}
  ): Point {
    const element = elementFlow.get(positions);

    if (element instanceof ElementPrompts)
      return PointPrompts.new(element, positions, variables);

    if (element instanceof ElementReturn)
      return PointReturn.new(element, positions, variables);

    if (element instanceof ElementVariables)
      return PointVariables.new(element, positions, variables);

    return new Point(positions, variables);
  }

  addVariables(variables: { [key: string]: Value }): Point {
    const vars = { ...this.variables, ...variables };
    return new Point(this.positions, vars);
  }
}

/**
 * It is a point that represents prompts.
 */
export class PointPrompts extends Point {
  constructor(
    public value: ValuePrompts,
    positions: Position[],
    variables: { [key: string]: Value }
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementPrompts,
    positions: Position[],
    variables: { [key: string]: Value }
  ): PointPrompts {
    const value = (mongu(element.value, variables) as unknown) as ValuePrompts;
    return new PointPrompts(value, positions, variables);
  }

  addVariables(variables: { [key: string]: Value }): PointPrompts {
    const vars = { ...this.variables, ...variables };
    return new PointPrompts(this.value, this.positions, vars);
  }
}

/**
 * It is a point that represents a return.
 */
export class PointReturn extends Point {
  constructor(
    public value: ValueReturn,
    positions: Position[],
    variables: { [key: string]: Value }
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementReturn,
    positions: Position[],
    variables: { [key: string]: Value }
  ): PointReturn {
    const value = mongu(element.value, variables) as ValueReturn;
    return new PointReturn(value, positions, variables);
  }

  addVariables(variables: { [key: string]: Value }): PointReturn {
    const vars = { ...this.variables, ...variables };
    return new PointReturn(this.value, this.positions, vars);
  }
}

/**
 * It is a point that represents variables.
 */
export class PointVariables extends Point {
  constructor(
    public value: ValueVariables,
    positions: Position[],
    variables: { [key: string]: Value }
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementVariables,
    positions: Position[],
    variables: { [key: string]: Value }
  ): PointVariables {
    const value = mongu(element.value, variables) as ValueVariables;
    return new PointVariables(value, positions, variables);
  }

  addVariables(variables: { [key: string]: Value }): PointVariables {
    const vars = { ...this.variables, ...variables };
    return new PointVariables(this.value, this.positions, vars);
  }
}
