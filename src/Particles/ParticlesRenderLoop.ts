interface IScene {
    clear(): void;
}

interface IParticlesConnections {
    draw(): void;
    update(): void;
}

interface ILoop {
    start(callback: () => void): void;
    stop(): void;
}

type Options = {
    onBeforeRender?(): void,
    onAfterRender?(): void,
};

class ParticlesRenderLoop {
    constructor(
        scene: IScene,
        private readonly loop: ILoop,
        particlesConnections: IParticlesConnections,
        options: Options,
    ) {
        this.loop.start(() => {
            options?.onBeforeRender();
            scene.clear();
            particlesConnections.draw();
            particlesConnections.update();
            options?.onAfterRender();
        })
    }

    public stop(): void {
        this.loop.stop();
    }
}

export {
    ParticlesRenderLoop,
}
