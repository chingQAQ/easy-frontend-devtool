"use strict";

var app = require('./index');

var arr = [1, 2, 3];

var log = function log(arr) {
  return arr.map(function (a) {
    return a;
  });
};

app.aaa();
setTimeout(function () {
  console.log(log.apply(void 0, arr));
  // console.log(log.apply(void 0, arr));
}, 1000);
