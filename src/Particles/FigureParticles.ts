import {FigureParticle, IParticle} from './index'
import {getNormalizedSvgPointsByViewPort, getPointsFromSvgPath, getSvgPathBounds} from '../heplers/svg';
import {callWhenArgsChanged} from '../heplers/function';
import {Easings} from '../heplers/easing';

type Options = {
    radius: number,
    speed: number,
    easing: Easings,
    color: string,
    accuracyFactor: number,
    scaleToViewPortFactor: number,
    paths: string[],
};

class FigureParticles {
    private particles: IParticle[] = [];

    constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly bound: {
            width: number,
            height: number,
        },
        private readonly options: Options,
    ) {
        this.updateFigure = callWhenArgsChanged(this.updateFigure, this);
        this.update();
    }

    draw(): void {
        this.particles.map((particle) => {
            particle.draw(this.context);
        });
    }

    update(): void {
        this.updateFigure(
            this.options.paths,
            this.options.accuracyFactor,
            this.options.scaleToViewPortFactor,
            this.bound.width,
            this.bound.height,
            this.options.speed,
            this.options.easing,
        );
    }

    getPoints(): {readonly x: number, readonly y: number}[] {
        return this.particles.map((particle) => particle.getPoint())
    }

    private updateFigure(
        paths: string[],
        accuracyFactor: number,
        scaleToViewPortFactor: number,
        boundWidth: number,
        boundHeight: number,
        speed: number,
        easing: Easings,
    ): void {
        this.particles = [];
        const bounds = getSvgPathBounds(paths.join(' '));
        const points = paths.reduce((points: {x: number, y: number}[], path) => {
            points = [
                ...points,
                ...getNormalizedSvgPointsByViewPort(
                    getPointsFromSvgPath(path, accuracyFactor),
                    bounds,
                    boundWidth,
                    boundHeight,
                    scaleToViewPortFactor,
                )
            ];
            return points;
        }, []);

        for (let i = 0; i < points.length; i++) {
            this.particles.push(
                new FigureParticle(
                    this.bound,
                    points[i].x,
                    points[i].y,
                    this.options,
                )
            );
        }
    }
}

export {
    FigureParticles,
}
