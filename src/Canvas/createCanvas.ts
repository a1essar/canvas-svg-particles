type Options = {
    width: number,
    height: number,
    zIndex: string,
}

function createCanvas(root: HTMLElement, options: Options): HTMLCanvasElement {
    const {
        width,
        height,
        zIndex
    } = options;
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = zIndex;
    root.appendChild(canvas);
    return canvas;
}

export {
    createCanvas,
}
