// https://easings.net/
export enum Easings {
    easeOutBack = 'easeOutBack',
    easeInCubic = 'easeInCubic',
    easeOutBounce = 'easeOutBounce',
    easeInBounce = 'easeInBounce',
}

export const easing: {[k in Easings]: (x: number) => number} = {
    [Easings.easeOutBack]: function (x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    [Easings.easeInCubic]: function (x: number): number {
        return x * x * x;
    },
    [Easings.easeOutBounce]: function (x: number): number {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    },
    [Easings.easeInBounce]: function (x: number): number {
        return 1 - this[Easings.easeOutBounce](1 - x);
    }
};
