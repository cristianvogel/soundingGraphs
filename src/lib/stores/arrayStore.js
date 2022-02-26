// custom arrayStore by miunau , extended by CAV

import { writable} from 'svelte/store';
import {addFunction, op} from 'arquero'

export function arrayStore(value = []) {
  const store = writable(value);

  const wrap = (method) => {
    return (...args) => {
      let ret;
      store.update((value) => {
        ret = value[method](...args);
        return value;
      });
      return ret;
    };
  };

  // use this one for Arquero stdlib ops
  const wrapOp = (method) => {
    return (...args) => {
      let ret; // console.log('arg: '+arg + ' op: '+op[method].name)
      store.update((value) => {
        ret = op[method]( value, ...args);
        return value;
      });
      return ret;
    };
  };

  /**
   * @param arr can be an Array or Array of Objects uses Arquero join semantics
   * @param el element to prune
   * @returns {*} pruned Array
   */
  function prune( arr, el ) {
        arr.forEach( (_el, _idx, _arr) => {
          if (op.equal(_el, el)) arr.splice(_idx, 1)
        })
    return arr
  }

// https://uwdata.github.io/arquero/api/extensibility
  addFunction('prune', prune, { override: true })

  return {
    ...store,
    push: wrap('push'),
    pop: wrap('pop'),
    shift: wrap('shift'),
    unshift: wrap('unshift'),
    reverse: wrap('reverse'),
    slice: wrap('slice'),
    splice: wrap('splice'),
    prune: wrapOp('prune')
  };
}

// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_function_calls
