import { Options } from './Options';
import { Scene, SceneResizer } from './Scene';
import { Loop } from './Loop';
import {
    FigureParticles,
    BackgroundParticles,
    ParticlesConnections,
    ParticlesRenderLoop,
} from './Particles';
import { Connection } from './Connections';
import { getRandomInt } from './heplers/number';
import { deepMutableExtend } from './heplers/object';
import { Easings } from './heplers/easing';

class Main {
    private readonly options: Options = {
        root: document.getElementById('particles'),
        scene: {
            backgroundColor: '#000',
        },
        particles: {
            backgroundParticles: {
                count: 100,
                color: '#fff',
                radius: getRandomInt(4, 2),
            },
            figure: {
                paths: [],
                color: '#f00',
                radius: getRandomInt(4, 2),
                accuracyFactor: 0.05,
                scaleToViewPortFactor: 0.8,
                easing: Easings.easeInCubic,
                speed: 100,
            }
        },
        connections: {
            figureVisibilityDistance: 100,
            backgroundVisibilityDistance: 100,
            color: '#fff',
        },
        loop: {
            onBeforeRender: () => {},
            onAfterRender: () => {},
        }
    };

    private loop: ParticlesRenderLoop;
    private scene: Scene;
    private sceneResizer: SceneResizer;

    constructor(options: Partial<Options>) {
        this.updateConfig(options);

        this.scene = new Scene(this.options.root, 0, this.options.scene);
        this.sceneResizer = new SceneResizer(this.scene);
        this.loop = new ParticlesRenderLoop(
            this.scene,
            new Loop(),
            new ParticlesConnections(
                this.scene.context,
                new Connection(this.options.connections),
                new BackgroundParticles(
                    this.scene.context,
                    this.scene.size,
                    this.options.particles.backgroundParticles,
                ),
                new FigureParticles(
                    this.scene.context,
                    this.scene.size,
                    this.options.particles.figure,
                ),
                this.options.connections,
            ),
            this.options.loop,
        );
    }

    public updateConfig(options: Partial<Options>): void {
        deepMutableExtend(this.options, options);
    }

    public destroy(): void {
        this.loop.stop();
        this.scene.destroy();
        this.sceneResizer.destroy();
        this.loop = null;
        this.scene = null;
        this.sceneResizer = null;
    }

    static Easings = Easings
}

// @ts-ignore
module.exports = Main;
