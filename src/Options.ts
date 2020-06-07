import type {Easings} from './heplers/easing';

type Options = {
    root: HTMLElement
    scene: {
        backgroundColor: string,
    }
    particles: {
        backgroundParticles: {
            count: number,
            radius: number,
            color: string,
        },
        figure: {
            paths: string[],
            radius: number,
            color: string,
            accuracyFactor: number,
            scaleToViewPortFactor: number,
            easing: Easings,
            speed: number,
        }
    },
    connections: {
        backgroundVisibilityDistance: number,
        figureVisibilityDistance: number,
        color: string,
    },
    loop: {
        onBeforeRender?(): void,
        onAfterRender?(): void,
    }
};

export {
    Options,
}
