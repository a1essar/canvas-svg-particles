import {IParticle, BackgroundParticle} from './index'

type Options = {
    count: number,
    radius: number,
    color: string,
};

class BackgroundParticles {
    private particles: IParticle[] = [];

    constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly bound: {
            width: number,
            height: number,
        },
        private readonly options: Options,
    ) {
        this.update();
    }

    draw(): void {
        this.particles.map((particle, i) => {
            particle.draw(this.context);
        });
    }

    update(): void {
        this.updateParticlesCount();
    }

    getPoints(): {readonly x: number, readonly y: number}[] {
        return this.particles.map((particle) => particle.getPoint())
    }

    private updateParticlesCount(): void {
        const count = Math.round(this.options.count);
        if (count <= 0) {
            this.particles = [];
        } else if (this.particles.length > count) {
            this.particles = this.particles.slice(0, this.particles.length - count);
        } else if (this.particles.length < count) {
            for (let i = 0; i <= count - this.particles.length; i++) {
                this.particles.push(
                    new BackgroundParticle(
                        this.bound,
                        this.options,
                    )
                );
            }
        }
    }
}

export {
    BackgroundParticles,
}
