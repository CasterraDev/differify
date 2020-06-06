!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.Differify=r():t.Differify=r()}(this,(function(){return function(t){var r={};function n(e){if(r[e])return r[e].exports;var o=r[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=r,n.d=function(t,r,e){n.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:e})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,r){if(1&r&&(t=n(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(n.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var o in t)n.d(e,o,function(r){return t[r]}.bind(null,o));return e},n.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(r,"a",r),r},n.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},n.p="",n(n.s=0)}([function(t,r,n){"use strict";function e(t,r){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);r&&(e=e.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),n.push.apply(n,e)}return n}function o(t){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?e(Object(n),!0).forEach((function(r){u(t,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):e(Object(n)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))}))}return t}function u(t,r,n){return r in t?Object.defineProperty(t,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[r]=n,t}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}
/*!
 * Copyright(c) 2020 Fabian Roberto Orue <fabianorue@gmail.com>
 * BSD Licensed
 */function a(t){return t&&!Array.isArray(t)&&"object"===i(t)}function c(t){return t&&"string"==typeof t&&t.length>0}function f(t,r){return t.hasOwnProperty?t.hasOwnProperty(r):void 0!==t[r]}n.r(r);var l={REFERENCE:"REFERENCE",DIFF:"DIFF",STRING:"STRING"};function s(t){if(this.compareArraysInOrder=!0,this.mode={array:l.DIFF,object:l.DIFF,function:l.REFERENCE},a(t)&&("boolean"==typeof t.compareArraysInOrder&&(this.compareArraysInOrder=t.compareArraysInOrder),a(t.mode))){var r=Object.values(l);if(c(t.mode.array)){var n=t.mode.array.toUpperCase();-1!==r.indexOf(n)&&(this.mode.array=n)}if(c(t.mode.object)){var e=t.mode.object.toUpperCase();-1!==r.indexOf(e)&&(this.mode.object=e)}if(c(t.mode.function)){var o=t.mode.function.toUpperCase();o!==l.REFERENCE&&o!==l.STRING||(this.mode.function=o)}}}var p={ADDED:"ADDED",DELETED:"DELETED",MODIFIED:"MODIFIED",EQUAL:"EQUAL"};function g(t,r,n){var e=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return{original:t,current:r,status:n,changes:e}}function E(t,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return{_:t,status:r,changes:n}}var y={string:null,number:null,function:null,object:null},D={};function h(t,r){return t===r?g(t,r,p.EQUAL):g(t,r,p.MODIFIED,1)}function b(t,r){if(t===r)return g(t,r,p.EQUAL);var n=i(t);if(n!==i(r))return g(t,r,p.MODIFIED,1);var e=y[n];return e?e(t,r):h(t,r)}function d(t,r){return t.getTime()===r.getTime()?g(t,r,p.EQUAL):g(t,r,p.MODIFIED,1)}function v(t,r){var n,e,o=0;t.length>r.length||t.length===r.length?(n=t,e=r,o=-1):(n=r,e=t,o=1);var u,i=[],a=0;for(u=0;u<e.length;++u)i.push(b(t[u],r[u])),a+=i[u].changes||0;if(-1===o)for(;u<n.length;++u)i.push(g(t[u],null,p.DELETED,1)),++a;else if(1===o)for(;u<n.length;++u)i.push(g(null,r[u],p.ADDED,1)),++a;return E(i,a>0?p.MODIFIED:p.EQUAL,a)}function O(t,r){var n;n=t.length>r.length||t.length===r.length?t:r;var e,o,u,i,a,c,f=Object.create(null),l=[],s=0,y=[];for(e=0;e<n.length;++e)e<t.length&&(void 0!==(o=f[i=JSON.stringify(t[e])])?((u=l[o]).a=t[e],c=b(u.a,u.b),y[o]=void 0!==c._?g(c._.original,c._.current,c.status,c.changes):c,y[o].status!==p.EQUAL?++s:--s,delete f[i]):(l.push({a:t[e],b:null}),y.push(g(t[e],null,p.DELETED,1)),++s,f[i]=l.length-1)),e<r.length&&(void 0!==(o=f[a=JSON.stringify(r[e])])?((u=l[o]).b=r[e],c=b(u.a,u.b),y[o]=void 0!==c._?g(u.a,u.b,c.status,c.changes):c,y[o].status!==p.EQUAL?++s:--s,delete f[a]):(l.push({b:r[e],a:null}),f[a]=l.length-1,y.push(g(null,r[e],p.ADDED,1)),++s));return E(y,s>0?p.MODIFIED:p.EQUAL,s)}function m(t,r){var n=t.toString(),e=r.toString();return n===e?g(n,e,p.EQUAL):g(n,e,p.MODIFIED,1)}function I(t,r){var n={},e=0,o=0,u=0;for(var i in t)f(t,i)&&(++e,f(r,i)?n[i]=b(t[i],r[i]):n[i]=g(t[i],null,p.DELETED,1),u+=n[i].changes);for(var a in r)f(r,a)&&(++o,f(t,a)||(n[a]=g(null,r[a],p.ADDED,1),u+=n[a].changes));return 0===e&&0===o?E(null,p.EQUAL,u):E(n,u>0?p.MODIFIED:p.EQUAL,u)}function j(t,r){var n=Object.prototype.toString.call(t);if(n===Object.prototype.toString.call(r)){var e=D[n];return e?e(t,r):h(t,r)}return g(t,r,p.MODIFIED)}var F=function(t){var r={};r[l.DIFF]=I,r[l.REFERENCE]=function(t,r){var n=h(t,r);return E(null,n.status,n.changes)},r[l.STRING]=function(t,r){var n=function(t,r){var n=JSON.stringify(t),e=JSON.stringify(r);return n===e?g(n,e,p.EQUAL):g(n,e,p.MODIFIED,1)}(t,r);return E(null,n.status,n.changes)};var n={};n[l.DIFF]=t.compareArraysInOrder?v:O,n[l.REFERENCE]=function(t,r){var n=h(t,r);return E(null,n.status,n.changes)},n[l.STRING]=function(t,r){var n,e,o=(e=r,(n=t).length===e.length&&JSON.stringify(n)===JSON.stringify(e)?g(n,e,p.EQUAL):g(n,e,p.MODIFIED,1));return E(null,o.status,o.changes)};var e={};e[l.REFERENCE]=h,e[l.STRING]=m,y.string=h,y.number=h,y.boolean=h,y.function=e[t.mode.function],y.object=j,D["[object Array]"]=n[t.mode.array],D["[object Date]"]=d,D["[object Object]"]=r[t.mode.object]},A=function(t,r){if((u=t)&&Array.isArray(u)){for(var n,e=[],o=0;o<t.length;o++)(n=r(t[o]))&&e.push(n);return e}var u;if("object"===i(t)){var a,c={};for(var f in t)t.hasOwnProperty(f)&&(a=r(t[f]))&&(c[f]=a);return c}return r(t)},S=function t(r){return r._?A(r._,t):r.status===p.DELETED?r.original:r.current},_=function t(r){return r._?A(r._,t):r.status===p.ADDED?r.current:r.original},L=function(t){return function r(n){return n._&&n.changes>0?A(n._,r):n.status===p.EQUAL?null:t(n)}},R=function(t){var r=t===p.DELETED?"original":"current",n=t===p.EQUAL;return function e(o){return o._&&(n||o.changes>0)?A(o._,e):o.status===t?o[r]:null}},U=function(t){return t.mode.object===l.DIFF&&t.mode.array===l.DIFF},N=function(t){if("string"==typeof t){var r=t.toUpperCase().trim();return-1!==Object.values(p).indexOf(r)?r:null}return null};function M(t){this.config=new s(t),F(this.config)}M.prototype.setConfig=function(t){this.config=new s(t),F(this.config)},M.prototype.getConfig=function(){return{compareArraysInOrder:this.config.compareArraysInOrder,mode:o({},this.config.mode)}},M.prototype.compare=function(t,r){return function(t,r){var n=i(t);if(n!==i(r))return g(t,r,p.MODIFIED,1);var e=y[n];return e?e(t,r):h(t,r)}(t,r)},M.prototype.applyLeftChanges=function(t){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t&&t._&&U(this.config)?A(t._,r?L(_):_):null},M.prototype.applyRightChanges=function(t){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t&&t._&&U(this.config)?A(t._,r?L(S):S):null},M.prototype.filterDiffByStatus=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:p.MODIFIED,n=N(r);return t&&t._&&n&&U(this.config)?A(t._,R(r)):null},r.default=M}]).default}));