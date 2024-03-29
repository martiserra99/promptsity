import { Value } from 'mongu';

import { JsonList } from '../types/json';
import { Position } from '../types/position';

import { Point, PointPrompts, PointVariables, PointReturn } from './point';

import { ElementList, ElementFlow, ElementItem } from './element';

import { Navigate } from './navigate';

export type StepPoint = PointPrompts | PointReturn | PointVariables;
export type StopPoint = PointPrompts | PointReturn;

/**
 * This class contains all the logic to get access to the initial and next points.
 */
class Prompts {
  private readonly element: ElementList;

  constructor(json: JsonList) {
    this.element = new ElementList(json);
  }

  /**
   * It returns the initial prompts point.
   *
   * @returns The initial prompts point.
   */
  initial(): PointPrompts {
    const positions = this._initialPositions(this.element);
    const point = Point.create(this.element, positions) as StepPoint;
    return this._nextStopPoint(point) as PointPrompts;
  }

  /**
   * It returns the next prompts point or return point.
   *
   * @param point The prompts point.
   * @param values The values.
   * @returns The next prompts point or return point.
   */
  next(point: PointPrompts, values: { [key: string]: Value }): StopPoint {
    const nextPoint = this._nextStopPoint(
      this._nextStepPoint(point.addVariables(values))
    );
    return nextPoint;
  }

  _initialPositions(element: ElementFlow): Position[] {
    let position = Navigate.down(element);
    while (position !== null) {
      const positions = this._initialPositionsFromPosition(element, position);
      if (positions.length > 0) return positions;
      position = Navigate.next(element, position);
    }
    return [];
  }

  _initialPositionsFromPosition(
    element: ElementFlow,
    position: Position
  ): Position[] {
    const child = element.get([position]);
    if (child instanceof ElementItem) return [position];
    const positions = this._initialPositions(child as ElementFlow);
    if (positions.length > 0) return [position, ...positions];
    return [];
  }

  _nextStopPoint(point: StepPoint): StopPoint {
    let nextPoint = point;
    while (nextPoint instanceof PointVariables) {
      nextPoint = this._nextStepPoint(nextPoint);
    }
    return nextPoint as StopPoint;
  }

  _nextStepPoint(point: StepPoint): StepPoint {
    return this._nextPoint(this._nextPointVariables(point));
  }

  _nextPointVariables(point: StepPoint): StepPoint {
    return point instanceof PointVariables
      ? point.addVariables(point.value as { [key: string]: Value })
      : point;
  }

  _nextPoint(point: Point): StepPoint {
    const nextPoint = this._nextPointLevel(point);
    if (nextPoint) return nextPoint;
    return this._nextPoint(this._upPoint(point));
  }

  _nextPointLevel(point: Point): StepPoint | null {
    const next = this._nextPointLevelNext(point);
    if (next) {
      const down = this._nextPointLevelDown(next);
      if (down) return down;
      return this._nextPointLevel(next);
    }
    return null;
  }

  _nextPointLevelNext(point: Point): Point | null {
    const previousPositions = point.previousPositions;
    const elementFlow = this.element.get(previousPositions) as ElementFlow;
    const currentPosition = point.currentPosition;
    const variables = point.variables;
    const position = Navigate.next(elementFlow, currentPosition, variables);
    if (position !== null) {
      const positions = [...previousPositions, position];
      return Point.create(this.element, positions, variables);
    }
    return null;
  }

  _nextPointLevelDown(point: Point): StepPoint | null {
    const element = this.element.get(point.positions);
    if (element instanceof ElementFlow) {
      const position = Navigate.down(element, point.variables);
      if (position !== null) {
        const positions = [...point.positions, position];
        const next = Point.create(this.element, positions, point.variables);
        const nextDown = this._nextPointLevelDown(next);
        if (nextDown) return nextDown;
        return this._nextPointLevel(next);
      }
      return null;
    }
    return point as StepPoint;
  }

  _upPoint(point: Point): Point {
    return Point.create(this.element, point.previousPositions, point.variables);
  }
}

export default Prompts;
