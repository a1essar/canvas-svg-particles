import { createCanvas } from '../Canvas';

type SceneSize = {
    width: number,
    height: number,
};

type Options = {
    backgroundColor: string,
};

class Scene {
    private readonly canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public size: SceneSize = {
        width: 0,
        height: 0,
    };

    constructor(
        private readonly root: HTMLElement,
        private readonly zIndex: number,
        private readonly options: Options,
    ) {
        this.updateSize();
        this.canvas = this.createCanvas(this.zIndex);
        this.context = this.canvas.getContext('2d', { alpha: false });
        this.clear();
    }

    clear(): void {
        this.context.fillStyle = this.options.backgroundColor;
        this.context.fillRect(0,0, this.size.width, this.size.height);
    }

    destroy(): void {
        this.canvas.remove();
    }

    public updateCanvasSize(): void {
        this.updateSize();
        this.canvas.height = this.size.height;
        this.canvas.width = this.size.width;
    }

    private updateSize(): void {
        const {
            width,
            height,
        } = this.root.getBoundingClientRect();

        this.size.width = width;
        this.size.height = height;
    }

    private createCanvas(zIndex = 0): HTMLCanvasElement {
        return createCanvas(this.root, {
            width: this.size.width,
            height: this.size.height,
            zIndex: String(zIndex),
        });
    }
}

export {
    Scene,
}
