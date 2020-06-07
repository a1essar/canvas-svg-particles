class Loop {
    private id: number;
    private callback: () => void;

    start(callback: () => void): void {
        this.callback = callback;
        this.draw();
    }

    stop(): void {
        cancelAnimationFrame(this.id);
    }

    private readonly draw = () => {
        this.callback();
        this.id = requestAnimationFrame(this.draw);
    }
}

export {
    Loop,
}
