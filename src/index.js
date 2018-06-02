/*!
 * Differify v1.1.0
 * http://netilon.com/
 *
 * Copyright 2018 Netilon (Fabian Orue)
 * Released under the MIT license
 *
 * Date: 2018-06-02 01:52 GMT-0300 (ART)
 */


'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


var returnTypes = {
    ARRAY: 'array',
    JSON_OBJECT: 'json'
};

var valueStatus = {
    'ADDED': 'added',
    'DELETED': 'deleted',
    'MODIFIED': 'modified'
};

function valueData(valueA, valueB, status) {
    return {
        original: valueA,
        diff: valueB,
        status: status
    };
};

function propertyData(path, property, valueA, valueB, status) {
    return {
        path: path !== '' && property !== null ? path + '.' + property : path,
        property: property,
        value: new valueData(valueA, valueB, status)
    };
};

function isArray(value) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
        return true;
    }
    return false;
}

function isObject(value) {
    if (!isArray(value) && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        return true;
    }
    return false;
}

function isString(value) {
    if (typeof value == 'string') {
        return true;
    }
    return false;
}

function isFunction(value) {
    if (typeof value == 'function') {
        return true;
    }
    return false;
}

function isDate(value) {
    if (Object.prototype.toString.call(value) == '[object Date]') {
        return true;
    }

    return false;
}

function isDefined(value) {
    if (value !== undefined && value !== null) {
        return true;
    }

    return false;
}

function ifNotDefinedGetDefault(object, property, defaultValue) {
    return (object !== undefined && isDefined(object[property]) ? object[property] : defaultValue);
}

function getTypes() {
    return {
        UNDEFINED: 0,
        OBJECT: 1,
        ARRAY: 2,
        STRING: 3,
        NUMBER: 4,
        FUNCTION: 5,
        DATE: 6
    };
}

function getTypeOf(value) {
    var types = getTypes();
    if (!isDefined(value)) {
        return types.UNDEFINED;
    } else if (isString(value)) {
        return types.STRING;
    } else if (isArray(value)) {
        return types.ARRAY;
    } else if (isDate(value)) {
        return types.DATE;
    } else if (isObject(value)) {
        return types.OBJECT;
    } else if (isFunction(value)) {
        return types.FUNCTION;
    }

    return types.NUMBER;
}

function clone(obj) {
    if (null == obj || "object" != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj))) {
        return obj;
    }
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function arrayDiff(arrayA, arrayB, compareEachElement) {
    compareEachElement = compareEachElement || false;
    var map = {};
    var key;
    var ret = [];

    if (!compareEachElement) {

        if (arrayA.length !== arrayB.length) {
            ret.push(valueData(arrayA, arrayB, valueStatus.MODIFIED));
        } else {
            var a = arrayA.toString();
            var b = arrayB.toString();
            if (a !== b) {
                ret.push(valueData(arrayA, arrayB, valueStatus.MODIFIED));
            }
        }

        return ret;
    }

    function convertToKey(value) {
        return isObject(value) ? JSON.stringify(value) : isArray(value) ? value.toString() : value + '';
    }

    for (var index in arrayA) {
        ret[index] = new valueData(arrayA[index], null, valueStatus.DELETED);
        key = convertToKey(arrayA[index]);
        if (map[key] === undefined) {
            map[key] = { index: index, count: 0 };
        } else {
            ++map[key].count;
        }
    }

    index = 0;
    var mappedValue;
    for (index in arrayB) {
        key = convertToKey(arrayB[index]);
        mappedValue = map[key];
        if (mappedValue === undefined) {
            ret.push(new valueData(null, arrayB[index], valueStatus.ADDED));
        } else if (mappedValue.count === 0) {
            if (ret[mappedValue.index] !== undefined) {
                ret.splice(mappedValue.index, 1);
                delete map[key];
            }
        } else if (mappedValue.count > 0) {
            ret.push(new valueData(null, arrayB[index], valueStatus.ADDED));
            --mappedValue.count;
        }
    }

    return ret;
};


function _getDiff(objectA, objectB, config, parent, diffResponse) {
    if (config.deep === 0) {
        return diffResponse.data;
    }
    var types = getTypes();
    var typeA = getTypeOf(objectA);
    var typeB = getTypeOf(objectB);

    if (typeA !== typeB) {
        diffResponse.aggregator(new propertyData(parent, null, typeA === types.FUNCTION ? objectA.toString() : objectA, typeB === types.FUNCTION ? objectB.toString() : objectB, valueStatus.MODIFIED));
        return diffResponse.data;
    } else if (typeA === types.OBJECT && typeB === types.OBJECT) {
        var objectBCopy = clone(objectB);

        for (var property in objectA) {
            if (objectA.hasOwnProperty(property)) {
                if (objectB.hasOwnProperty(property) && objectB[property] !== undefined) {

                    delete objectBCopy[property];

                    typeA = getTypeOf(objectA[property]);
                    typeB = getTypeOf(objectB[property]);

                    if (typeA !== typeB) {
                        diffResponse.aggregator(new propertyData(parent, property, typeA === types.FUNCTION ? objectA[property].toString() : objectA[property], typeB === types.FUNCTION ? objectB[property].toString() : objectB[property], valueStatus.MODIFIED));
                    } else if (typeA === types.UNDEFINED && typeB === types.UNDEFINED) {
                        if (objectA[property] !== objectB[property]) {
                            diffResponse.aggregator(new propertyData(parent, property, JSON.stringify(objectA[property]), objectB[property], valueStatus.MODIFIED));
                        }
                        continue;
                    } else if (typeA === types.DATE && typeB === types.DATE) {
                        if (objectA[property].getTime() !== objectB[property].getTime()) {
                            diffResponse.aggregator(new propertyData(parent, property, objectA[property], objectB[property], valueStatus.MODIFIED));
                        }
                        continue;
                    } else if (typeA === types.ARRAY && typeB === types.ARRAY) {

                        var arrayCompareResult = diffResponse.caller.arrayDiff(objectA[property], objectB[property], config.scan.arrays);
                        if (arrayCompareResult.length > 0) {
                            diffResponse.aggregator(new propertyData(parent, property, objectA[property], arrayCompareResult, valueStatus.MODIFIED));
                        }
                        continue;
                    } else if (typeA === types.OBJECT && typeB === types.OBJECT) {
                        --config.deep;
                        var newDiffResponse = DiffResponseFactory(diffResponse);
                        newDiffResponse.clearData();
                        var diff = _getDiff(objectA[property], objectB[property], config, parent + '.' + property, newDiffResponse);
                        if (config.returnType && config.returnType === returnTypes.JSON_OBJECT) {
                            diffResponse.data[property] = diff;
                        } else {
                            diffResponse.data = diffResponse.data.concat(diff);
                        }
                        continue;
                    }
                } else {
                    diffResponse.aggregator(new propertyData(parent, property, objectA[property], null, valueStatus.DELETED));
                }
            }
        }
        property = null;
        for (property in objectBCopy) {
            if (objectB.hasOwnProperty(property)) {
                diffResponse.aggregator(new propertyData(parent, property, null, objectBCopy[property], valueStatus.ADDED));
            }
        }
    } else if (typeA === types.DATE && typeB === types.DATE) {
        if (objectA.getTime() !== objectB.getTime()) {
            diffResponse.aggregator(new propertyData(parent, property, objectA, objectB, valueStatus.MODIFIED));
        }
    } else if (typeA === types.ARRAY && typeB === types.ARRAY) {
        var arrayCompareResult = diffResponse.caller.arrayDiff(objectA, objectB, config.scan.arrays);
        if (arrayCompareResult.length > 0) {
            diffResponse.aggregator(new propertyData(parent, null, objectA, arrayCompareResult, valueStatus.MODIFIED));
        }
    } else {
        if ((objectA = objectA.toString()) !== (objectB = objectB.toString())) {
            diffResponse.aggregator(new propertyData(parent, null, objectA, objectB, valueStatus.MODIFIED));
        }
    }

    return diffResponse.data;
}

function Configuration(_config){
    this.deep = ifNotDefinedGetDefault(_config, 'deep', 3);
    this.scan = ifNotDefinedGetDefault(_config, 'scan', { arrays: true });
    this.returnType = ifNotDefinedGetDefault(_config, 'returnType', returnTypes.JSON_OBJECT);
}

function DiffResponseFactory (diffResponse) {
    
    return {
        data: ifNotDefinedGetDefault(diffResponse, 'data', null),
        aggregator: ifNotDefinedGetDefault(diffResponse, 'aggregator', null),
        caller: ifNotDefinedGetDefault(diffResponse, 'caller', null),
        clearData: ifNotDefinedGetDefault(diffResponse, 'clearData', null)
    };
    
}

function getDiff(objectA, objectB, config) {
    if (config) {
        config = new Configuration(config);
    } else {
        config = new Configuration();
    }
    var parent = '$root';

    var diffResponse = DiffResponseFactory();
    diffResponse.caller = this;

    if (config.returnType === returnTypes.JSON_OBJECT) {
        
        function aggregator(data) {
            if (data.property !== null) {
                this.data[data.property] = data;
            } else {
                this.data = data;
            }
        };
        
        function clearData(){
            this.data = {};
        }
        
        diffResponse.aggregator = aggregator;
        diffResponse.clearData = clearData;
        diffResponse.clearData();
    } else {
        
        function aggregator(data) {
            this.data.push(data);
        };
        
        function clearData(){
            this.data = [];
        }
        
        diffResponse.aggregator = aggregator;
        diffResponse.clearData = clearData;
        diffResponse.clearData();
    }

    return _getDiff(objectA, objectB, config, parent, diffResponse);
}

module.exports = {
    arrayDiff: arrayDiff,
    getDiff: getDiff
};