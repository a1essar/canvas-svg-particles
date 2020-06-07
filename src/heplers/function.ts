import {shallowEqualArrays} from './object'

function callWhenArgsChanged(fn, context) {
    let prevArgs;

    return function(...args) {
        if(!shallowEqualArrays(prevArgs, args)) {
            prevArgs = args;
            return fn.apply(context || this, arguments);
        }
    };
}

export {
    callWhenArgsChanged,
};
