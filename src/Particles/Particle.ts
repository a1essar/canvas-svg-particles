type ParticleOptions = {
    color: string,
};

interface IParticle extends IParticleWithPoint {
    draw(context: CanvasRenderingContext2D);
}

interface IParticleConstructor {
    new(options: ParticleOptions);
}

interface IParticleWithPoint {
    getPoint(): {readonly x: number, readonly y: number}
}

export {
    IParticle,
    IParticleConstructor,
    IParticleWithPoint,
    ParticleOptions,
}
