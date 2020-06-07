import { IParticle, IParticleWithPoint, ParticleOptions } from './index';
import { getRandomInt } from '../heplers/number';
import { Easings, easing } from '../heplers/easing';

type Options = {
    radius: number,
    speed: number,
    easing: Easings,
} & ParticleOptions;

enum StartPostions {
    Left,
    Top,
    Right,
    Bottom
}

class FigureParticle implements IParticle, IParticleWithPoint {
    private x: number;
    private y: number;
    private dx: number;
    private dy: number;
    private dt: number = 0;
    private increase: number = Number((Math.PI * 2 / 100).toFixed(2));
    private isTargetReached = false;
    private readonly targetX;
    private readonly targetY;
    private readonly startX;
    private readonly startY;
    private readonly targetDistance;
    private readonly endAngle = Number((Math.PI * 2).toFixed(2));
    private readonly randomFactor = Math.random();

    constructor(
        private readonly bound: {
            width: number,
            height: number,
        },
        targetX: number,
        targetY: number,
        private readonly options: Options
    ) {
        const startPosition = getRandomInt(3);
        const startPositionOffset = 100;

        switch (startPosition) {
            case StartPostions.Left:
                this.x = 0 - startPositionOffset;
                this.y = Number((getRandomInt(this.bound.height)).toFixed(2));
                break;
            case StartPostions.Top:
                this.x = Number((getRandomInt(this.bound.width)).toFixed(2));
                this.y = Number((this.bound.height).toFixed(2)) + startPositionOffset;
                break;
            case StartPostions.Right:
                this.x = Number((this.bound.width).toFixed(2)) + startPositionOffset;
                this.y = Number((getRandomInt(this.bound.height)).toFixed(2));
                break;
            case StartPostions.Bottom:
                this.x = Number((getRandomInt(this.bound.width)).toFixed(2));
                this.y = 0 - startPositionOffset;
                break;
        }

        this.targetX = Number(targetX.toFixed(2));
        this.targetY = Number(targetY.toFixed(2));

        this.startX = this.x;
        this.startY = this.y;

        const deltaX = this.targetX - this.x;
        const deltaY = this.targetY - this.y;
        this.targetDistance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        this.dx = Number((this.targetDistance * 0.01).toFixed(2));
        this.dy = Number((this.targetDistance * 0.01).toFixed(2));
    }

    draw(context: CanvasRenderingContext2D) {
        this.x = Number(this.x.toFixed(2));
        this.y = Number(this.y.toFixed(2));
        context.fillStyle = this.options.color;
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            Math.round(this.options.radius),
            0,
            this.endAngle,
            false
        );
        context.fill();
        this.move();
    }

    getPoint(): { readonly x: number; readonly y: number } {
        return {
            x: this.x,
            y: this.y,
        }
    }

    private move() {
        if (!this.isTargetReached) {
            this.moveToTarget();
        } else {
            this.moveRandom();
        }
    }

    private moveToTarget() {
        const deltaX = this.targetX - this.startX;
        const deltaY = this.targetY - this.startY;
        const iterations = this.options.speed;

        if (this.dt > iterations) {
            this.isTargetReached = true;
            return;
        }

        const deltaRemainX = deltaX * (this.dt / iterations);
        const deltaRemainY = deltaY * (this.dt / iterations);

        const dx = easing[this.options.easing](deltaRemainX / deltaX);
        const dy = easing[this.options.easing](deltaRemainY / deltaY);

        this.x = deltaX * dx + this.startX;
        this.y = deltaY * dy + this.startY;

        this.dt++;
    }

    private moveRandom() {
        this.x += (this.targetX - Math.abs(this.x + this.dx * 2 * this.randomFactor * Math.sin(this.dt * 1))) / (this.dx * 1);
        this.y += (this.targetY - Math.abs(this.y + this.dy * 2 * this.randomFactor * Math.sin(this.dt * 1))) / (this.dy * 1);
        this.dt += this.increase;
    }
}

export {
    FigureParticle,
}
