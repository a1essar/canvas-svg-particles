type PathList = [any][];
type SvgPoints = {
    x: number,
    y: number
}[]

function getPointsFromSvgPath(path: string, accuracyFactor = 0.05): SvgPoints {
    accuracyFactor = Math.min(Math.max(accuracyFactor, 0), 1);
    const absolutePath = getAbsolutePathList(getParsedSvgPath(path))
        .reduce((path, list) => {
            path += list.shift();
            path += list.join(',');
            return path;
        }, '');
    const points = [];
    const svgPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPathElement.setAttribute('d', absolutePath);
    const step = svgPathElement.getTotalLength() * accuracyFactor;

    for (let i = 0; i <= step + 1; i++) {
        points.push(svgPathElement.getPointAtLength(svgPathElement.getTotalLength()/step * i));
    }

    return points;
}

function getNormalizedSvgPointsByViewPort(
    points: SvgPoints,
    bounds: number[],
    maxX: number,
    maxY: number,
    scaleToViewPortFactor = 0.5,
): {x: number, y: number}[] {
    scaleToViewPortFactor = Math.min(Math.max(scaleToViewPortFactor, 0), 1);
    const [
        left,
        top,
        right,
        bottom,
    ] = bounds;

    const width = right - Math.abs(left);
    const height = bottom - Math.abs(top);
    const scaleMap = {[width]: maxX, [height]: maxY};
    const scaleRatio = scaleMap[Math.max(width, height)] / Math.max(width, height) * scaleToViewPortFactor;

    const normalized = (a, b) => a - b;
    const scale = (a) => a * scaleRatio;
    const center = (a, b, c) => a + b/2 - c/2;

    return points.map((point) => {
        return {
            x: center(scale(normalized(point.x, Math.abs(left))), maxX, width * scaleRatio),
            y: center(scale(normalized(point.y, Math.abs(top))), maxY, height * scaleRatio),
        }
    });
}

// https://github.com/dy/svg-path-bounds/
// [left, top, right, bottom]
function getSvgPathBounds(path: string): number[] {
    const commands = getAbsolutePathList(getParsedSvgPath(path));
    const bounds = [Infinity, Infinity, -Infinity, -Infinity];

    for (let i = 0, l = commands.length; i < l; i++) {
        const points = commands[i].slice(1);

        for (let j = 0; j < points.length; j += 2) {
            if (points[j + 0] < bounds[0]) bounds[0] = points[j + 0];
            if (points[j + 1] < bounds[1]) bounds[1] = points[j + 1];
            if (points[j + 0] > bounds[2]) bounds[2] = points[j + 0];
            if (points[j + 1] > bounds[3]) bounds[3] = points[j + 1];
        }
    }

    return bounds;
}

// https://github.com/jkroso/parse-svg-path
function getParsedSvgPath(path: any): PathList {
    const numbersRegex = getParsedSvgPath.numbersRegex;
    const segment = getParsedSvgPath.segmentRegex;
    const typesMap = getParsedSvgPath.typesMap;
    const data = [];

    path.replace(segment, (_, command, args) => {
        let type = command.toLowerCase();
        const numbers = args.match(numbersRegex);
        args = numbers ? numbers.map(Number) : [];

        if (type == 'm' && args.length > 2) {
            data.push([command].concat(args.splice(0, 2)));
            type = 'l';
            command = command == 'm' ? 'l' : 'L';
        }

        while (true) {
            if (args.length == typesMap[type]) {
                args.unshift(command);
                return data.push(args);
            }

            if (args.length < typesMap[type]) {
                throw new Error('malformed path data')
            }

            data.push([command].concat(args.splice(0, typesMap[type])));
        }
    });

    return data;
}

getParsedSvgPath.typesMap = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0};
getParsedSvgPath.segmentRegex = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
getParsedSvgPath.numbersRegex = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;

// https://github.com/jkroso/abs-svg-path
function getAbsolutePathList(path): PathList {
    let startX = 0;
    let startY = 0;
    let x = 0;
    let y = 0;

    return path.map((seg) => {
        seg = seg.slice();
        const type = seg[0];
        const command = type.toUpperCase();

        // is relative
        if (type != command) {
            seg[0] = command;
            switch (type) {
                case 'a':
                    seg[6] += x;
                    seg[7] += y;
                    break;
                case 'v':
                    seg[1] += y;
                    break;
                case 'h':
                    seg[1] += x;
                    break;
                default:
                    for (let i = 1; i < seg.length; ) {
                        seg[i++] += x;
                        seg[i++] += y;
                    }
            }
        }

        // update cursor state
        switch (command) {
            case 'Z':
                x = startX;
                y = startY;
                break;
            case 'H':
                x = seg[1];
                break;
            case 'V':
                y = seg[1];
                break;
            case 'M':
                x = startX = seg[1];
                y = startY = seg[2];
                break;
            default:
                x = seg[seg.length - 2];
                y = seg[seg.length - 1];
        }

        return seg;
    });
}

export {
    getPointsFromSvgPath,
    getNormalizedSvgPointsByViewPort,
    getSvgPathBounds,
};
