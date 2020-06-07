import { ConnectionPoint } from '../Connections';

interface IConnection {
    draw(
        context: CanvasRenderingContext2D,
        start: ConnectionPoint,
        end: ConnectionPoint,
        visibilityDistance: number,
    ): void;
}

interface IParticles {
    draw(): void;
    update(): void;
    getPoints(): {readonly x: number, readonly y: number}[];
}

type Options = {
    backgroundVisibilityDistance: number,
    figureVisibilityDistance: number,
}

class ParticlesConnections {
    constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly connections: IConnection,
        private readonly backgroundParticles: IParticles,
        private readonly figureParticles: IParticles,
        private readonly options: Options,
    ) {}

    draw(): void {
        this.backgroundParticles.draw();
        this.figureParticles.draw();
        this.drawPointsConnections(
            this.backgroundParticles.getPoints(),
            this.options.backgroundVisibilityDistance,
        );
        this.drawPointsConnections(
            this.figureParticles.getPoints(),
            this.options.figureVisibilityDistance,
        );
    }

    update(): void {
        this.backgroundParticles.update();
        this.figureParticles.update();
    }

    private drawPointsConnections(
        points: {readonly x: number, readonly y: number}[],
        visibilityDistance: number,
    ) {
        for(let i = 0; i < points.length; i++) {
            for(let j = i + 1; j < points.length; j++) {
                const start = points[i];
                const end = points[j];
                this.connections.draw(this.context, start, end, visibilityDistance);
            }
        }
    }
}

export {
    ParticlesConnections,
}
