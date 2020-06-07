import {
    findDistance,
    getCalculatedColorByDistance,
} from '../heplers/point';

type ConnectionPoint = {
    x: number,
    y: number,
};

type Options = {
    color: string,
}

class Connection {
    constructor(private readonly options: Options) {}

    draw(
        context: CanvasRenderingContext2D,
        start: ConnectionPoint,
        end: ConnectionPoint,
        visibilityDistance: number,
    ): void {
        const distance = findDistance(start, end);

        if (distance < visibilityDistance) {
            context.beginPath();
            context.strokeStyle = getCalculatedColorByDistance(distance, visibilityDistance, this.options.color);
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
            context.closePath();
        }
    }
}

export {
    Connection,
    ConnectionPoint,
}
