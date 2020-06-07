import {hexToRGBA} from './string';

export type Point = {
    x: number,
    y: number,
};

export function findDistance(
    start: Point,
    end: Point
): number {
    const dx = start.x - end.x;
    const dy = start.y - end.y;
    return Math.sqrt(dx*dx + dy*dy);
}

export function getCalculatedColorByDistance(
    distance: number,
    visibilityDistance: number,
    color: string,
): string {
    const alpha = 1 - distance/visibilityDistance;
    return hexToRGBA(color, alpha);
}
