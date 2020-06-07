import { IParticle, IParticleWithPoint, ParticleOptions } from './index';

type Options = {
    radius: number,
} & ParticleOptions;

class BackgroundParticle implements IParticle, IParticleWithPoint {
    private x: number;
    private y: number;
    private dx: number;
    private dy: number;
    private readonly endAngle = Number((Math.PI * 2).toFixed(2));

    constructor(
        private readonly bound: {
            width: number,
            height: number,
        },
        private readonly options: Options,
    ) {
        this.x = Math.random() * this.bound.width;
        this.y = Math.random() * this.bound.height;
        this.dx = -1 + Math.random() * 2;
        this.dy = -1 + Math.random() * 2;
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.options.color;
        context.beginPath();
        context.arc(
            Number(this.x.toFixed(2)),
            Number(this.y.toFixed(2)),
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
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.options.radius > this.bound.width) {
            this.x = this.options.radius;
        } else if(this.x - this.options.radius < 0) {
            this.x = this.bound.width - this.options.radius;
        }

        if (this.y + this.options.radius > this.bound.height) {
            this.y = this.options.radius;
        } else if(this.y - this.options.radius < 0) {
            this.y = this.bound.height - this.options.radius;
        }
    }
}

export {
    BackgroundParticle,
}
