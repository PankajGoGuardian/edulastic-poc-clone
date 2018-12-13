"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "multipleChoice", {
  enumerable: true,
  get: function get() {
    return _mcq.default;
  }
});
Object.defineProperty(exports, "orderList", {
  enumerable: true,
  get: function get() {
    return _orderlist.default;
  }
});
Object.defineProperty(exports, "clozeText", {
  enumerable: true,
  get: function get() {
    return _clozeText.default;
  }
});
Object.defineProperty(exports, "graph", {
  enumerable: true,
  get: function get() {
    return _graph.default;
  }
});

var _mcq = _interopRequireDefault(require("./mcq"));

var _orderlist = _interopRequireDefault(require("./orderlist"));

var _clozeText = _interopRequireDefault(require("./clozeText"));

var _graph = _interopRequireDefault(require("./graph"));
