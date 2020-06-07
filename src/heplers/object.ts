function isObject(value) {
    if (typeof value === 'object' && value != null && !value.length && !(value instanceof Node)) {
        return true;
    }

    return false;
}

function deepMutableExtend<T1 extends object, T2 extends Partial<T1>>(target: T1, partial: T2) {
    for (const [key, value] of Object.entries(partial)) {
        if (!target.hasOwnProperty(key)) {
            continue;
        }

        if (isObject(target[key]) && isObject(value)) {
            target[key] = deepMutableExtend(target[key], value);
            continue;
        }

        target[key] = value;
    }

    return target;
}

function shallowEqualArrays(arrA, arrB) {
    if (arrA === arrB) {
        return true;
    }

    if (!arrA || !arrB) {
        return false;
    }

    const len = arrA.length;

    if (arrB.length !== len) {
        return false;
    }

    for (let i = 0; i < len; i++) {
        if (arrA[i] !== arrB[i]) {
            return false;
        }
    }

    return true;
}

export {
    deepMutableExtend,
    shallowEqualArrays,
};
