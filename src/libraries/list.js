'use strict';

var deepEqual = require('./deepequal');
var util = require('./util');
var grob = {};

grob.combine = function () {
    var i, l, result = [];
    for (i = 0; i < arguments.length; i++) {
        l = arguments[i];
        if (l) {
            result = result.concat(l);
        }
    }
    return result;
};

grob.contains = function (l, value) {
    for (var i = 0; i < l.length; i += 1) {
        if (deepEqual.deepEqual(l[i], value)) {
            return true;
        }
    }
    return false;
};

grob.equals = function (o1, o2) {
    return deepEqual.deepEqual(o1, o2);
};

grob.count = function (l) {
    if (l && l.length) {
        return l.length;
    } else {
        return 0;
    }
};

grob.cull = function (l, booleans) {
    if (!l) { return []; }
    if (!booleans) { return l; }
    var i, keep, results = [];
    for (i = 0; i < l.length; i++) {
        // Cycle through the list of boolean values.
        keep = booleans[i % booleans.length];
        if (keep) {
            results.push(l[i]);
        }
    }
    return results;
};

grob.distinct = function(l) {
    if (!l) { return []; }
    var i, length, value,
        result = [],
        seen = [];
    for (i = 0, length = l.length; i < length; i += 1) {
        value = l[i];
        if (!grob.contains(seen, value)) {
            seen.push(value);
            result.push(l[i]);
        }
    }
    return result;
};

grob.first = function (l) {
    if (!l || l.length === 0) { return null; }
    return l[0];
};

grob.get = function (l, i) {
    if (!l || l.length === 0) { return null; }
    return l[i];
};

grob.interleave = function () {
    if (arguments.length === 0) return [];
    var results = [];
    var elIndex = 0;
    while (true) {
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg.length > elIndex) {
                results.push(arg[elIndex]);
            } else {
                return results;
            }
        }
        elIndex += 1;
    }
};

grob.last = function (l) {
    if (!l || l.length === 0) { return null; }
    return l[l.length - 1];
};

grob.pick = function (l, amount, seed) {
    if (!l || l.length === 0 || amount <= 0) {
        return [];
    }
    if (!seed && seed !== 0) {
        seed = Math.random();
    }
    var rand = util.randomGenerator(seed || 0);
    var results = [];
    for (var i = 0; i < amount; i += 1) {
        results.push(l[Math.floor(rand(0, l.length))]);
    }
    return results;
};

grob.randomSample = function (l, amount, seed) {
    if (!l || l.length === 0 || amount <= 0) {
        return [];
    }
    if (!seed && seed !== 0) {
        seed = Math.random();
    }
    var shuffledlist = grob.shuffle(l, seed);
    if (!amount) { return shuffledlist; }
    return grob.slice(shuffledlist, 0, amount);
};

grob.repeat = function (l, amount, perItem) {
    if (!l) { return []; }
    if (amount <= 0) { return []; }
    var i, j, v,
        newList = [];
    if (!perItem) {
        for (i = 0; i < amount; i += 1) {
            newList.push.apply(newList, l);
        }
    } else {
        for (i = 0; i < l.length; i += 1) {
            v = l[i];
            for (j = 0; j < amount; j += 1) {
                newList.push(v);
            }
        }
    }
    return newList;
};

grob.rest = function (l) {
    if (!l) { return []; }
    return l.slice(1);
};

grob.reverse = function (l) {
    return l.slice().reverse();

};

grob.second = function (l) {
    if (!l || l.length < 2) { return null; }
    return l[1];
};

grob.shift = function (l, amount) {
    // If the amount is bigger than the number of items, wrap around.
    if (!l) { return []; }
    amount = amount % l.length;
    var head = l.slice(0, amount),
        result = l.slice(amount);
    result.push.apply(result, head);
    return result;
};

grob.shuffle = function (l, seed) {
    var i, j, tmp, r;
    if (!seed && seed !== 0) {
        seed = Math.random();
    }
    r = util.randomGenerator(seed || 0);
    for (i = l.length - 1; i > 0; i--) {
        j = Math.floor(r(0, i + 1));
        tmp = l[i];
        l[i] = l[j];
        l[j] = tmp;
    }
    return l;
};

grob.slice = function (l, start, size, invert) {
    if (!l) { return []; }
    var firstList, secondList;
    if (!invert) {
        return l.slice(start, start + size);
    } else {
        firstList = l.slice(0, start);
        secondList = l.slice(start + size);
        firstList.push.apply(firstList, secondList);
        return firstList;
    }
};

grob.sort = function (l, key) {
    if (key) {
        if (typeof key === 'string') {
            return l.slice().sort(function (a, b) {
                if (a[key] > b[key]) { return 1; }
                else if (a[key] === b[key]) { return 0; }
                else { return -1; }
            });
        } else if (typeof key === 'function') {
            return l.slice().sort(key);
        }
    }
    if (l && l[0] !== undefined && l[0] !== null && typeof l[0] === 'number') {
        return l.slice().sort(function (a, b) { return a - b; });
    }
    return l.slice().sort();
};

grob.switch = function (index) {
    var nLists = (arguments.length - 1);
    index = index % nLists;
    if (index < 0) {
        index += nLists;
    }
    return arguments[index + 1];
};

grob.takeEvery = function (l, n, offset) {
    var i, results = [];
    offset = offset || 0;
    for (i = 0; i < l.length; i += 1) {
        if (i % n === offset) {
            results.push(l[i]);
        }
    }
    return results;
};

grob.zipMap = function (keys, vals) {
    var i, k, v,
        m = {},
        minLength = Math.min(keys.length, vals.length);
    for (i = 0; i < minLength; i += 1) {
        k = keys[i];
        v = vals[i];
        m[k] = v;
    }
    return m;
};

module.exports = grob;
