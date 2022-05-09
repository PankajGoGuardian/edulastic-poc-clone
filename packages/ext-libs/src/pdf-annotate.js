// eslint-disable-next-line
var pdfjsViewer = require('pdfjs-dist/web/pdf_viewer.js') // pdfjs-dist - v2.1.266
var { aws } = require('@edulastic/constants')
var { uploadToS3, getYoutubeId, notification } = require('@edulastic/common')
const { themeColor } = require('@edulastic/colors')
const { allowedImageFileTypes } = require('@edulastic/common/src/helpers')
;(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory()
  else if (typeof define === 'function' && define.amd) define([], factory)
  else if (typeof exports === 'object') exports['PDFAnnotate'] = factory()
  else root['PDFAnnotate'] = factory()
})(this, function () {
  return /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {} // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId])
        /******/ return installedModules[moduleId].exports // Create a new module (and put it into the cache)
      /******/
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ exports: {},
        /******/ id: moduleId,
        /******/ loaded: false,
        /******/
      }) // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ) // Flag the module as loaded
      /******/
      /******/ /******/ module.loaded = true // Return the exports of the module
      /******/
      /******/ /******/ return module.exports
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
    /******/
    /******/ /******/ return __webpack_require__(0)
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0  default export of PDFJSAnnotate */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        exports.default = _PDFJSAnnotate2.default
        module.exports = exports['default']

        /***/
      },
      /* 1 named export of StoreAdapter,LocalStoreAdapter,UI,render... */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _StoreAdapter = __webpack_require__(2)

        var _StoreAdapter2 = _interopRequireDefault(_StoreAdapter)

        var _LocalStoreAdapter = __webpack_require__(8)

        var _LocalStoreAdapter2 = _interopRequireDefault(_LocalStoreAdapter)

        var _render = __webpack_require__(10)

        var _render2 = _interopRequireDefault(_render)

        var _UI = __webpack_require__(28)

        var _UI2 = _interopRequireDefault(_UI)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        exports.default = {
          /**
           * Abstract class that needs to be defined so PDFJSAnnotate
           * knows how to communicate with your server.
           */
          StoreAdapter: _StoreAdapter2.default,

          /**
           * Implementation of StoreAdapter that stores annotation data to localStorage.
           */
          LocalStoreAdapter: _LocalStoreAdapter2.default,

          /**
           * Abstract instance of StoreAdapter
           */
          __storeAdapter: new _StoreAdapter2.default(),

          /**
           * Getter for the underlying StoreAdapter property
           *
           * @return {StoreAdapter}
           */
          getStoreAdapter: function getStoreAdapter() {
            return this.__storeAdapter
          },

          /**
           * Setter for the underlying StoreAdapter property
           *
           * @param {StoreAdapter} adapter The StoreAdapter implementation to be used.
           */
          setStoreAdapter: function setStoreAdapter(adapter) {
            // TODO this throws an error when bundled
            // if (!(adapter instanceof StoreAdapter)) {
            //   throw new Error('adapter must be an instance of StoreAdapter');
            // }

            this.__storeAdapter = adapter
          },

          /**
           * UI is a helper for instrumenting UI interactions for creating,
           * editing, and deleting annotations in the browser.
           */
          UI: _UI2.default,

          /**
           * Render the annotations for a page in the PDF Document
           *
           * @param {SVGElement} svg The SVG element that annotations should be rendered to
           * @param {PageViewport} viewport The PDFPage.getViewport data
           * @param {Object} data The StoreAdapter.getAnnotations data
           * @return {Promise}
           */
          render: _render2.default,

          /**
           * Convenience method for getting annotation data
           *
           * @alias StoreAdapter.getAnnotations
           * @param {String} documentId The ID of the document
           * @param {String} pageNumber The page number
           * @return {Promise}
           */
          getAnnotations: function getAnnotations(documentId, pageNumber) {
            var _getStoreAdapter

            return (_getStoreAdapter = this.getStoreAdapter()).getAnnotations.apply(
              _getStoreAdapter,
              arguments
            )
          },
        }
        module.exports = exports['default']

        /***/
      },
      /* 2 StoreAdapter implementation */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i]
              descriptor.enumerable = descriptor.enumerable || false
              descriptor.configurable = true
              if ('value' in descriptor) descriptor.writable = true
              Object.defineProperty(target, descriptor.key, descriptor)
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps)
            if (staticProps) defineProperties(Constructor, staticProps)
            return Constructor
          }
        })()

        var _abstractFunction = __webpack_require__(3)

        var _abstractFunction2 = _interopRequireDefault(_abstractFunction)

        var _event = __webpack_require__(4)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        // Adapter should never be invoked publicly

        var StoreAdapter = (function () {
          /**
           * Create a new StoreAdapter instance
           *
           * @param {Object} [definition] The definition to use for overriding abstract methods
           */

          function StoreAdapter() {
            var _this = this

            var definition =
              arguments.length <= 0 || arguments[0] === undefined
                ? {}
                : arguments[0]

            _classCallCheck(this, StoreAdapter)

            // Copy each function from definition if it is a function we know about
            Object.keys(definition).forEach(function (key) {
              if (
                typeof definition[key] === 'function' &&
                typeof _this[key] === 'function'
              ) {
                _this[key] = definition[key]
              }
            })
          }

          /**
           * Get all the annotations for a given document and page number.
           *
           * @param {String} documentId The ID for the document the annotations belong to
           * @param {Number} pageNumber The number of the page the annotations belong to
           * @return {Promise}
           */

          _createClass(StoreAdapter, [
            {
              key: '__getAnnotations',
              value: function __getAnnotations(documentId, pageNumber) {
                ;(0, _abstractFunction2.default)('getAnnotations')
              },
            },
            {
              key: 'getAnnotation',

              /**
               * Get the definition for a specific annotation.
               *
               * @param {String} documentId The ID for the document the annotation belongs to
               * @param {String} annotationId The ID for the annotation
               * @return {Promise}
               */
              value: function getAnnotation(documentId, annotationId) {
                ;(0, _abstractFunction2.default)('getAnnotation')
              },

              /**
               * Add an annotation
               *
               * @param {String} documentId The ID for the document to add the annotation to
               * @param {String} pageNumber The page number to add the annotation to
               * @param {Object} annotation The definition for the new annotation
               * @return {Promise}
               */
            },
            {
              key: '__addAnnotation',
              value: function __addAnnotation(
                documentId,
                pageNumber,
                annotation
              ) {
                ;(0, _abstractFunction2.default)('addAnnotation')
              },
            },
            {
              key: '__editAnnotation',

              /**
               * Edit an annotation
               *
               * @param {String} documentId The ID for the document
               * @param {String} pageNumber the page number of the annotation
               * @param {Object} annotation The definition of the modified annotation
               * @return {Promise}
               */
              value: function __editAnnotation(
                documentId,
                pageNumber,
                annotation
              ) {
                ;(0, _abstractFunction2.default)('editAnnotation')
              },
            },
            {
              key: '__deleteAnnotation',

              /**
               * Delete an annotation
               *
               * @param {String} documentId The ID for the document
               * @param {String} annotationId The ID for the annotation
               * @return {Promise}
               */
              value: function __deleteAnnotation(documentId, annotationId) {
                ;(0, _abstractFunction2.default)('deleteAnnotation')
              },
            },
            {
              key: 'getComments',

              /**
               * Get all the comments for an annotation
               *
               * @param {String} documentId The ID for the document
               * @param {String} annotationId The ID for the annotation
               * @return {Promise}
               */
              value: function getComments(documentId, annotationId) {
                ;(0, _abstractFunction2.default)('getComments')
              },

              /**
               * Add a new comment
               *
               * @param {String} documentId The ID for the document
               * @param {String} annotationId The ID for the annotation
               * @param {Object} content The definition of the comment
               * @return {Promise}
               */
            },
            {
              key: '__addComment',
              value: function __addComment(documentId, annotationId, content) {
                ;(0, _abstractFunction2.default)('addComment')
              },
            },
            {
              key: '__deleteComment',

              /**
               * Delete a comment
               *
               * @param {String} documentId The ID for the document
               * @param {String} commentId The ID for the comment
               * @return {Promise}
               */
              value: function __deleteComment(documentId, commentId) {
                ;(0, _abstractFunction2.default)('deleteComment')
              },
            },

            {
              key: 'getVideos',
              value: function getVideos(documentId, annotationId) {
                ;(0, _abstractFunction2.default)('getVideos')
              },
            },
            {
              key: '__addVideo',
              value: function __addVideo(documentId, annotationId, content) {
                ;(0, _abstractFunction2.default)('addVideo')
              },
            },
            {
              key: '__deleteVideo',
              value: function __deleteVideo(documentId, commentId) {
                ;(0, _abstractFunction2.default)('deleteVideo')
              },
            },
            {
              key: 'getImages',
              value: function getVideos(documentId, annotationId) {
                ;(0, _abstractFunction2.default)('getImages')
              },
            },
            {
              key: '__addImage',
              value: function __addVideo(documentId, annotationId, content) {
                ;(0, _abstractFunction2.default)('addImage')
              },
            },
            {
              key: '__deleteImage',
              value: function __deleteImage(documentId, commentId) {
                ;(0, _abstractFunction2.default)('deleteImage')
              },
            },

            {
              key: 'getAnnotations',
              get: function get() {
                return this.__getAnnotations
              },
              set: function set(fn) {
                this.__getAnnotations = function getAnnotations(
                  documentId,
                  pageNumber
                ) {
                  return fn
                    .apply(undefined, arguments)
                    .then(function (annotations) {
                      // TODO may be best to have this happen on the server
                      if (annotations.annotations) {
                        annotations.annotations.forEach(function (a) {
                          a.documentId = documentId
                        })
                      }
                      return annotations
                    })
                }
              },
            },
            {
              key: 'addAnnotation',
              get: function get() {
                return this.__addAnnotation
              },
              set: function set(fn) {
                this.__addAnnotation = function addAnnotation(
                  documentId,
                  pageNumber,
                  annotation
                ) {
                  return fn
                    .apply(undefined, arguments)
                    .then(function (annotation) {
                      ;(0,
                      _event.fireEvent)('annotation:add', documentId, pageNumber, annotation)
                      return annotation
                    })
                }
              },
            },
            {
              key: 'editAnnotation',
              get: function get() {
                return this.__editAnnotation
              },
              set: function set(fn) {
                this.__editAnnotation = function editAnnotation(
                  documentId,
                  annotationId,
                  annotation
                ) {
                  return fn
                    .apply(undefined, arguments)
                    .then(function (annotation) {
                      ;(0,
                      _event.fireEvent)('annotation:edit', documentId, annotationId, annotation)
                      return annotation
                    })
                }
              },
            },
            {
              key: 'deleteAnnotation',
              get: function get() {
                return this.__deleteAnnotation
              },
              set: function set(fn) {
                this.__deleteAnnotation = function deleteAnnotation(
                  documentId,
                  annotationId
                ) {
                  return fn
                    .apply(undefined, arguments)
                    .then(function (success) {
                      if (success) {
                        ;(0, _event.fireEvent)(
                          'annotation:delete',
                          documentId,
                          annotationId
                        )
                      }
                      return success
                    })
                }
              },
            },
            {
              key: 'addComment',
              get: function get() {
                return this.__addComment
              },
              set: function set(fn) {
                this.__addComment = function addComment(
                  documentId,
                  annotationId,
                  content
                ) {
                  return fn
                    .apply(undefined, arguments)
                    .then(function (comment) {
                      ;(0,
                      _event.fireEvent)('comment:add', documentId, annotationId, comment)
                      return comment
                    })
                }
              },
            },
            {
              key: 'deleteComment',
              get: function get() {
                return this.__deleteComment
              },
              set: function set(fn) {
                this.__deleteComment = function deleteComment(
                  documentId,
                  commentId
                ) {
                  return fn
                    .apply(undefined, arguments)
                    .then(function (success) {
                      if (success) {
                        ;(0, _event.fireEvent)(
                          'comment:delete',
                          documentId,
                          commentId
                        )
                      }
                      return success
                    })
                }
              },
            },
            {
              key: 'addVideo',
              get: function get() {
                return this.__addVideo
              },
              set: function set(fn) {
                this.__addVideo = function addVideo(
                  documentId,
                  annotationId,
                  content
                ) {
                  return fn.apply(undefined, arguments).then((url) => {
                    ;(0, _event.fireEvent)(
                      'video:add',
                      documentId,
                      annotationId,
                      url
                    )
                    return url
                  })
                }
              },
            },
            {
              key: 'deleteVideo',
              get: function get() {
                return this.__deleteVideo
              },
              set: function set(fn) {
                this.__deleteVideo = function deleteVideo(documentId, url) {
                  return fn.apply(undefined, arguments).then((success) => {
                    if (success) {
                      ;(0, _event.fireEvent)('video:delete', documentId, url)
                    }
                    return success
                  })
                }
              },
            },
            {
              key: 'addImage',
              get: function get() {
                return this.__addImage
              },
              set: function set(fn) {
                this.__addImage = function addImage(
                  documentId,
                  annotationId,
                  content
                ) {
                  return fn.apply(undefined, arguments).then((url) => {
                    ;(0, _event.fireEvent)(
                      'image:add',
                      documentId,
                      annotationId,
                      url
                    )
                    return url
                  })
                }
              },
            },
            {
              key: 'deleteImage',
              get: function get() {
                return this.__deleteImage
              },
              set: function set(fn) {
                this.__deleteImage = function deleteImage(documentId, url) {
                  return fn.apply(undefined, arguments).then((success) => {
                    if (success) {
                      ;(0, _event.fireEvent)('image:delete', documentId, url)
                    }
                    return success
                  })
                }
              },
            },
          ])

          return StoreAdapter
        })()

        exports.default = StoreAdapter
        module.exports = exports['default']

        /***/
      },
      /* 3 abstractFunction checker for storeAdapter*/
      /***/ function (module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = abstractFunction
        /**
         * Throw an Error for an abstract function that hasn't been implemented.
         *
         * @param {String} name The name of the abstract function
         */
        function abstractFunction(name) {
          throw new Error(name + ' is not implemented')
        }
        module.exports = exports['default']

        /***/
      },
      /* 4 doc click event handler for store adapter*/
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.fireEvent = fireEvent
        exports.addEventListener = addEventListener
        exports.removeEventListener = removeEventListener

        var _events = __webpack_require__(5)

        var _events2 = _interopRequireDefault(_events)

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var emitter = new _events2.default()

        var clickNode = void 0

        /**
         * Handle document.click event
         *
         * @param {Event} e The DOM event to be handled
         */
        document.addEventListener('click', function handleDocumentClick(e) {
          if (!(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
            return
          }

          var target = (0, _utils.findAnnotationAtPoint)(e.clientX, e.clientY)

          // Emit annotation:blur if clickNode is no longer clicked
          if (clickNode && clickNode !== target) {
            emitter.emit('annotation:blur', clickNode)
          }

          // Emit annotation:click if target was clicked
          if (target) {
            emitter.emit('annotation:click', target)
          }

          clickNode = target
        })

        // var mouseOverNode;
        // document.addEventListener('mousemove', function handleDocumentMousemove(e) {
        //   var target = findAnnotationAtPoint(e.clientX, e.clientY);
        //
        //   // Emit annotation:mouseout if target was mouseout'd
        //   if (mouseOverNode && !target) {
        //     emitter.emit('annotation:mouseout', mouseOverNode);
        //   }
        //
        //   // Emit annotation:mouseover if target was mouseover'd
        //   if (target && mouseOverNode !== target) {
        //     emitter.emit('annotation:mouseover', target);
        //   }
        //
        //   mouseOverNode = target;
        // });

        function fireEvent() {
          emitter.emit.apply(emitter, arguments)
        }
        function addEventListener() {
          emitter.on.apply(emitter, arguments)
        }
        function removeEventListener() {
          emitter.removeListener.apply(emitter, arguments)
        }

        /***/
      },
      /* 5 event emitters code for SA*/
      /***/ function (module, exports) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        function EventEmitter() {
          this._events = this._events || {}
          this._maxListeners = this._maxListeners || undefined
        }
        module.exports = EventEmitter

        // Backwards-compat with node 0.10.x
        EventEmitter.EventEmitter = EventEmitter

        EventEmitter.prototype._events = undefined
        EventEmitter.prototype._maxListeners = undefined

        // By default EventEmitters will print a warning if more than 10 listeners are
        // added to it. This is a useful default which helps finding memory leaks.
        EventEmitter.defaultMaxListeners = 10

        // Obviously not all Emitters should be limited to 10. This function allows
        // that to be increased. Set to zero for unlimited.
        EventEmitter.prototype.setMaxListeners = function (n) {
          if (!isNumber(n) || n < 0 || isNaN(n))
            throw TypeError('n must be a positive number')
          this._maxListeners = n
          return this
        }

        EventEmitter.prototype.emit = function (type) {
          var er, handler, len, args, i, listeners

          if (!this._events) this._events = {}

          // If there is no 'error' event listener then throw.
          if (type === 'error') {
            if (
              !this._events.error ||
              (isObject(this._events.error) && !this._events.error.length)
            ) {
              er = arguments[1]
              if (er instanceof Error) {
                throw er // Unhandled 'error' event
              }
              throw TypeError('Uncaught, unspecified "error" event.')
            }
          }

          handler = this._events[type]

          if (isUndefined(handler)) return false

          if (isFunction(handler)) {
            switch (arguments.length) {
              // fast cases
              case 1:
                handler.call(this)
                break
              case 2:
                handler.call(this, arguments[1])
                break
              case 3:
                handler.call(this, arguments[1], arguments[2])
                break
              // slower
              default:
                args = Array.prototype.slice.call(arguments, 1)
                handler.apply(this, args)
            }
          } else if (isObject(handler)) {
            args = Array.prototype.slice.call(arguments, 1)
            listeners = handler.slice()
            len = listeners.length
            for (i = 0; i < len; i++) listeners[i].apply(this, args)
          }

          return true
        }

        EventEmitter.prototype.addListener = function (type, listener) {
          var m

          if (!isFunction(listener))
            throw TypeError('listener must be a function')

          if (!this._events) this._events = {}

          // To avoid recursion in the case that type === "newListener"! Before
          // adding it to the listeners, first emit "newListener".
          if (this._events.newListener)
            this.emit(
              'newListener',
              type,
              isFunction(listener.listener) ? listener.listener : listener
            )

          if (!this._events[type])
            // Optimize the case of one listener. Don't need the extra array object.
            this._events[type] = listener
          else if (isObject(this._events[type]))
            // If we've already got an array, just append.
            this._events[type].push(listener)
          // Adding the second element, need to change to array.
          else this._events[type] = [this._events[type], listener]

          // Check for listener leak
          if (isObject(this._events[type]) && !this._events[type].warned) {
            if (!isUndefined(this._maxListeners)) {
              m = this._maxListeners
            } else {
              m = EventEmitter.defaultMaxListeners
            }

            if (m && m > 0 && this._events[type].length > m) {
              this._events[type].warned = true
              console.error(
                '(node) warning: possible EventEmitter memory ' +
                  'leak detected. %d listeners added. ' +
                  'Use emitter.setMaxListeners() to increase limit.',
                this._events[type].length
              )
              if (typeof console.trace === 'function') {
                // not supported in IE 10
                console.trace()
              }
            }
          }

          return this
        }

        EventEmitter.prototype.on = EventEmitter.prototype.addListener

        EventEmitter.prototype.once = function (type, listener) {
          if (!isFunction(listener))
            throw TypeError('listener must be a function')

          var fired = false

          function g() {
            this.removeListener(type, g)

            if (!fired) {
              fired = true
              listener.apply(this, arguments)
            }
          }

          g.listener = listener
          this.on(type, g)

          return this
        }

        // emits a 'removeListener' event iff the listener was removed
        EventEmitter.prototype.removeListener = function (type, listener) {
          var list, position, length, i

          if (!isFunction(listener))
            throw TypeError('listener must be a function')

          if (!this._events || !this._events[type]) return this

          list = this._events[type]
          length = list.length
          position = -1

          if (
            list === listener ||
            (isFunction(list.listener) && list.listener === listener)
          ) {
            delete this._events[type]
            if (this._events.removeListener)
              this.emit('removeListener', type, listener)
          } else if (isObject(list)) {
            for (i = length; i-- > 0; ) {
              if (
                list[i] === listener ||
                (list[i].listener && list[i].listener === listener)
              ) {
                position = i
                break
              }
            }

            if (position < 0) return this

            if (list.length === 1) {
              list.length = 0
              delete this._events[type]
            } else {
              list.splice(position, 1)
            }

            if (this._events.removeListener)
              this.emit('removeListener', type, listener)
          }

          return this
        }

        EventEmitter.prototype.removeAllListeners = function (type) {
          var key, listeners

          if (!this._events) return this

          // not listening for removeListener, no need to emit
          if (!this._events.removeListener) {
            if (arguments.length === 0) this._events = {}
            else if (this._events[type]) delete this._events[type]
            return this
          }

          // emit removeListener for all listeners on all events
          if (arguments.length === 0) {
            for (key in this._events) {
              if (key === 'removeListener') continue
              this.removeAllListeners(key)
            }
            this.removeAllListeners('removeListener')
            this._events = {}
            return this
          }

          listeners = this._events[type]

          if (isFunction(listeners)) {
            this.removeListener(type, listeners)
          } else if (listeners) {
            // LIFO order
            while (listeners.length)
              this.removeListener(type, listeners[listeners.length - 1])
          }
          delete this._events[type]

          return this
        }

        EventEmitter.prototype.listeners = function (type) {
          var ret
          if (!this._events || !this._events[type]) ret = []
          else if (isFunction(this._events[type])) ret = [this._events[type]]
          else ret = this._events[type].slice()
          return ret
        }

        EventEmitter.prototype.listenerCount = function (type) {
          if (this._events) {
            var evlistener = this._events[type]

            if (isFunction(evlistener)) return 1
            else if (evlistener) return evlistener.length
          }
          return 0
        }

        EventEmitter.listenerCount = function (emitter, type) {
          return emitter.listenerCount(type)
        }

        function isFunction(arg) {
          return typeof arg === 'function'
        }

        function isNumber(arg) {
          return typeof arg === 'number'
        }

        function isObject(arg) {
          return typeof arg === 'object' && arg !== null
        }

        function isUndefined(arg) {
          return arg === void 0
        }

        /***/
      },
      /* 6 utilities for lib*/
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.BORDER_COLOR = undefined
        exports.findSVGContainer = findSVGContainer
        exports.findSVGAtPoint = findSVGAtPoint
        exports.findAnnotationAtPoint = findAnnotationAtPoint
        exports.pointIntersectsRect = pointIntersectsRect
        exports.getOffsetAnnotationRect = getOffsetAnnotationRect
        exports.getAnnotationRect = getAnnotationRect
        exports.scaleUp = scaleUp
        exports.scaleDown = scaleDown
        exports.getScroll = getScroll
        exports.getOffset = getOffset
        exports.disableUserSelect = disableUserSelect
        exports.enableUserSelect = enableUserSelect
        exports.getMetadata = getMetadata

        var _createStylesheet = __webpack_require__(7)

        var _createStylesheet2 = _interopRequireDefault(_createStylesheet)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var BORDER_COLOR = (exports.BORDER_COLOR = '#00BFFF')

        var userSelectStyleSheet = (0, _createStylesheet2.default)({
          body: {
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
          },
        })
        userSelectStyleSheet.setAttribute(
          'data-pdf-annotate-user-select',
          'true'
        )

        /**
         * Find the SVGElement that contains all the annotations for a page
         *
         * @param {Element} node An annotation within that container
         * @return {SVGElement} The container SVG or null if it can't be found
         */
        function findSVGContainer(node) {
          var parentNode = node

          while (
            (parentNode = parentNode.parentNode) &&
            parentNode !== document
          ) {
            if (
              parentNode.nodeName.toUpperCase() === 'SVG' &&
              parentNode.getAttribute('data-pdf-annotate-container') === 'true'
            ) {
              return parentNode
            }
          }

          return null
        }

        /**
         * Find an SVGElement container at a given point
         *
         * @param {Number} x The x coordinate of the point
         * @param {Number} y The y coordinate of the point
         * @return {SVGElement} The container SVG or null if one can't be found
         */
        function findSVGAtPoint(x, y) {
          var elements = document.querySelectorAll(
            'svg[data-pdf-annotate-container="true"]'
          )

          for (var i = 0, l = elements.length; i < l; i++) {
            var el = elements[i]
            var rect = el.getBoundingClientRect()

            if (pointIntersectsRect(x, y, rect)) {
              return el
            }
          }

          return null
        }

        /**
         * Find an Element that represents an annotation at a given point
         *
         * @param {Number} x The x coordinate of the point
         * @param {Number} y The y coordinate of the point
         * @return {Element} The annotation element or null if one can't be found
         */
        function findAnnotationAtPoint(x, y) {
          var svg = findSVGAtPoint(x, y)
          if (!svg) {
            return
          }
          var elements = svg.querySelectorAll('[data-pdf-annotate-type]')

          // Find a target element within SVG
          for (var i = 0, l = elements.length; i < l; i++) {
            var el = elements[i]
            if (pointIntersectsRect(x, y, getOffsetAnnotationRect(el))) {
              return el
            }
          }

          return null
        }

        /**
         * Determine if a point intersects a rect
         *
         * @param {Number} x The x coordinate of the point
         * @param {Number} y The y coordinate of the point
         * @param {Object} rect The points of a rect (likely from getBoundingClientRect)
         * @return {Boolean} True if a collision occurs, otherwise false
         */
        function pointIntersectsRect(x, y, rect) {
          return (
            y >= rect.top &&
            y <= rect.bottom &&
            x >= rect.left &&
            x <= rect.right
          )
        }

        /**
         * Get the rect of an annotation element accounting for offset.
         *
         * @param {Element} el The element to get the rect of
         * @return {Object} The dimensions of the element
         */
        function getOffsetAnnotationRect(el) {
          var rect = getAnnotationRect(el)

          var _getOffset = getOffset(el)

          var offsetLeft = _getOffset.offsetLeft
          var offsetTop = _getOffset.offsetTop

          return {
            top: rect.top + offsetTop,
            left: rect.left + offsetLeft,
            right: rect.right + offsetLeft,
            bottom: rect.bottom + offsetTop,
          }
        }

        /**
         * Get the rect of an annotation element.
         *
         * @param {Element} el The element to get the rect of
         * @return {Object} The dimensions of the element
         */
        function getAnnotationRect(el) {
          var h = 0,
            w = 0,
            x = 0,
            y = 0
          var rect = el.getBoundingClientRect()
          // TODO this should be calculated somehow
          var LINE_OFFSET = 16

          switch (el.nodeName.toLowerCase()) {
            case 'path':
              var minX = void 0,
                maxX = void 0,
                minY = void 0,
                maxY = void 0

              el.getAttribute('d')
                .replace(/Z/, '')
                .split('M')
                .splice(1)
                .forEach(function (p) {
                  var s = p.split(' ').map(function (i) {
                    return parseInt(i, 10)
                  })

                  if (typeof minX === 'undefined' || s[0] < minX) {
                    minX = s[0]
                  }
                  if (typeof maxX === 'undefined' || s[2] > maxX) {
                    maxX = s[2]
                  }
                  if (typeof minY === 'undefined' || s[1] < minY) {
                    minY = s[1]
                  }
                  if (typeof maxY === 'undefined' || s[3] > maxY) {
                    maxY = s[3]
                  }
                })

              h = maxY - minY
              w = maxX - minX
              x = minX
              y = minY
              break

            case 'line':
              h =
                parseInt(el.getAttribute('y2'), 10) -
                parseInt(el.getAttribute('y1'), 10)
              w =
                parseInt(el.getAttribute('x2'), 10) -
                parseInt(el.getAttribute('x1'), 10)
              x = parseInt(el.getAttribute('x1'), 10)
              y = parseInt(el.getAttribute('y1'), 10)

              if (h === 0) {
                h += LINE_OFFSET
                y -= LINE_OFFSET / 2
              }
              break

            case 'text':
              h = rect.height
              w = rect.width
              x = parseInt(el.getAttribute('x'), 10)
              y = parseInt(el.getAttribute('y'), 10) - h
              break

            case 'g':
              var _getOffset2 = getOffset(el)

              var offsetLeft = _getOffset2.offsetLeft
              var offsetTop = _getOffset2.offsetTop

              h = rect.height
              w = rect.width
              x = rect.left - offsetLeft
              y = rect.top - offsetTop

              if (el.getAttribute('data-pdf-annotate-type') === 'strikeout') {
                h += LINE_OFFSET
                y -= LINE_OFFSET / 2
              }
              break

            case 'rect':
            case 'svg':
              h = parseInt(el.getAttribute('height'), 10)
              w = parseInt(el.getAttribute('width'), 10)
              x = parseInt(el.getAttribute('x'), 10)
              y = parseInt(el.getAttribute('y'), 10)
              break
          }

          // Result provides same properties as getBoundingClientRect
          var result = {
            top: y,
            left: x,
            width: w,
            height: h,
            right: x + w,
            bottom: y + h,
          }

          // For the case of nested SVG (point annotations) and grouped
          // lines or rects no adjustment needs to be made for scale.
          // I assume that the scale is already being handled
          // natively by virtue of the `transform` attribute.
          if (!['svg', 'g'].includes(el.nodeName.toLowerCase())) {
            result = scaleUp(findSVGAtPoint(rect.left, rect.top), result)
          }

          return result
        }

        /**
         * Adjust scale from normalized scale (100%) to rendered scale.
         *
         * @param {SVGElement} svg The SVG to gather metadata from
         * @param {Object} rect A map of numeric values to scale
         * @return {Object} A copy of `rect` with values scaled up
         */
        function scaleUp(svg, rect) {
          var result = {}

          var _getMetadata = getMetadata(svg)

          var viewport = _getMetadata.viewport

          Object.keys(rect).forEach(function (key) {
            result[key] = rect[key] * viewport.scale
          })

          return result
        }

        /**
         * Adjust scale from rendered scale to a normalized scale (100%).
         *
         * @param {SVGElement} svg The SVG to gather metadata from
         * @param {Object} rect A map of numeric values to scale
         * @return {Object} A copy of `rect` with values scaled down
         */
        function scaleDown(svg, rect) {
          var result = {}

          var _getMetadata2 = getMetadata(svg)

          var viewport = _getMetadata2.viewport

          Object.keys(rect).forEach(function (key) {
            result[key] = rect[key] / viewport.scale
          })

          return result
        }

        /**
         * Get the scroll position of an element, accounting for parent elements
         *
         * @param {Element} el The element to get the scroll position for
         * @return {Object} The scrollTop and scrollLeft position
         */
        function getScroll(el) {
          var scrollTop = 0
          var scrollLeft = 0
          var parentNode = el

          while (
            (parentNode = parentNode.parentNode) &&
            parentNode !== document
          ) {
            scrollTop += parentNode.scrollTop
            scrollLeft += parentNode.scrollLeft
          }

          return { scrollTop: scrollTop, scrollLeft: scrollLeft }
        }

        /**
         * Get the offset position of an element, accounting for parent elements
         *
         * @param {Element} el The element to get the offset position for
         * @return {Object} The offsetTop and offsetLeft position
         */
        function getOffset(el) {
          var parentNode = el

          while (
            (parentNode = parentNode.parentNode) &&
            parentNode !== document
          ) {
            if (parentNode.nodeName.toUpperCase() === 'SVG') {
              break
            }
          }

          var rect = parentNode.getBoundingClientRect()

          return { offsetLeft: rect.left, offsetTop: rect.top }
        }

        /**
         * Disable user ability to select text on page
         */
        function disableUserSelect() {
          if (!userSelectStyleSheet.parentNode) {
            document.head.appendChild(userSelectStyleSheet)
          }
        }

        /**
         * Enable user ability to select text on page
         */
        function enableUserSelect() {
          if (userSelectStyleSheet.parentNode) {
            userSelectStyleSheet.parentNode.removeChild(userSelectStyleSheet)
          }
        }

        /**
         * Get the metadata for a SVG container
         *
         * @param {SVGElement} svg The SVG container to get metadata for
         */
        function getMetadata(svg) {
          if (!svg) return null
          return {
            documentId: svg.getAttribute('data-pdf-annotate-document'),
            pageNumber: parseInt(
              svg.getAttribute('data-pdf-annotate-page'),
              10
            ),
            viewport: JSON.parse(
              svg.getAttribute('data-pdf-annotate-viewport')
            ),
          }
        }

        /***/
      },
      /* 7 createStyleSheet for render */
      /***/ function (module, exports) {
        module.exports = function createStyleSheet(blocks) {
          var style = document.createElement('style')
          var text = Object.keys(blocks)
            .map(function (selector) {
              return processRuleSet(selector, blocks[selector])
            })
            .join('\n')

          style.setAttribute('type', 'text/css')
          style.appendChild(document.createTextNode(text))

          return style
        }

        function processRuleSet(selector, block) {
          return selector + ' {\n' + processDeclarationBlock(block) + '\n}'
        }

        function processDeclarationBlock(block) {
          return Object.keys(block)
            .map(function (prop) {
              return processDeclaration(prop, block[prop])
            })
            .join('\n')
        }

        function processDeclaration(prop, value) {
          if (!isNaN(value) && value != 0) {
            value = value + 'px'
          }

          return hyphenate(prop) + ': ' + value + ';'
        }

        function hyphenate(prop) {
          return prop.replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase()
          })
        }

        /***/
      },
      /* 8 LocalStoreAdapter implementation */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _uuid = __webpack_require__(9)

        var _uuid2 = _interopRequireDefault(_uuid)

        var _StoreAdapter2 = __webpack_require__(2)

        var _StoreAdapter3 = _interopRequireDefault(_StoreAdapter2)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            )
          }
          return call &&
            (typeof call === 'object' || typeof call === 'function')
            ? call
            : self
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError(
              'Super expression must either be null or a function, not ' +
                typeof superClass
            )
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          )
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass)
        }

        // StoreAdapter for working with localStorage
        // This is ideal for testing, examples, and prototyping

        var LocalStoreAdapter = (function (_StoreAdapter) {
          _inherits(LocalStoreAdapter, _StoreAdapter)

          function LocalStoreAdapter() {
            _classCallCheck(this, LocalStoreAdapter)

            return _possibleConstructorReturn(
              this,
              Object.getPrototypeOf(LocalStoreAdapter).call(this, {
                getAnnotations: function getAnnotations(
                  documentId,
                  pageNumber
                ) {
                  return new Promise(function (resolve, reject) {
                    var annotations = _getAnnotations(documentId).filter(
                      function (i) {
                        return i.page === pageNumber && i.class === 'Annotation'
                      }
                    )

                    resolve({
                      documentId: documentId,
                      pageNumber: pageNumber,
                      annotations: annotations,
                    })
                  })
                },
                getAnnotation: function getAnnotation(
                  documentId,
                  annotationId
                ) {
                  return Promise.resolve(
                    _getAnnotations(documentId)[
                      findAnnotation(documentId, annotationId)
                    ]
                  )
                },
                addAnnotation: function addAnnotation(
                  documentId,
                  pageNumber,
                  annotation
                ) {
                  return new Promise(function (resolve, reject) {
                    annotation.class = 'Annotation'
                    annotation.uuid = (0, _uuid2.default)()
                    annotation.page = pageNumber

                    var annotations = _getAnnotations(documentId)
                    annotations.push(annotation)
                    updateAnnotations(documentId, annotations)

                    resolve(annotation)
                  })
                },
                editAnnotation: function editAnnotation(
                  documentId,
                  annotationId,
                  annotation
                ) {
                  return new Promise(function (resolve, reject) {
                    var annotations = _getAnnotations(documentId)
                    annotations[
                      findAnnotation(documentId, annotationId)
                    ] = annotation
                    updateAnnotations(documentId, annotations)

                    resolve(annotation)
                  })
                },
                deleteAnnotation: function deleteAnnotation(
                  documentId,
                  annotationId
                ) {
                  return new Promise(function (resolve, reject) {
                    var index = findAnnotation(documentId, annotationId)
                    if (index > -1) {
                      var annotations = _getAnnotations(documentId)
                      annotations.splice(index, 1)
                      updateAnnotations(documentId, annotations)
                    }

                    resolve(true)
                  })
                },
                getComments: function getComments(documentId, annotationId) {
                  return new Promise(function (resolve, reject) {
                    resolve(
                      _getAnnotations(documentId).filter(function (i) {
                        return (
                          i.class === 'Comment' && i.annotation === annotationId
                        )
                      })
                    )
                  })
                },
                addComment: function addComment(
                  documentId,
                  annotationId,
                  content
                ) {
                  return new Promise(function (resolve, reject) {
                    var comment = {
                      class: 'Comment',
                      uuid: (0, _uuid2.default)(),
                      annotation: annotationId,
                      content: content,
                    }

                    var annotations = _getAnnotations(documentId)
                    annotations.push(comment)
                    updateAnnotations(documentId, annotations)

                    resolve(comment)
                  })
                },
                deleteComment: function deleteComment(documentId, commentId) {
                  return new Promise(function (resolve, reject) {
                    _getAnnotations(documentId)
                    var index = -1
                    var annotations = _getAnnotations(documentId)
                    for (var i = 0, l = annotations.length; i < l; i++) {
                      if (annotations[i].uuid === commentId) {
                        index = i
                        break
                      }
                    }

                    if (index > -1) {
                      annotations.splice(index, 1)
                      updateAnnotations(documentId, annotations)
                    }

                    resolve(true)
                  })
                },
                getVideos: function getVideos(documentId, annotationId) {
                  return new Promise((resolve, reject) => {
                    resolve(
                      _getAnnotations(documentId).filter(
                        (i) =>
                          i.class === 'Video' && i.annotation === annotationId
                      )
                    )
                  })
                },
                addVideo: function addVideo(documentId, annotationId, content) {
                  return new Promise((resolve, reject) => {
                    var comment = {
                      class: 'Video',
                      uuid: (0, _uuid2.default)(),
                      annotation: annotationId,
                      content,
                    }
                    var annotations = _getAnnotations(documentId)
                    annotations.push(comment)
                    updateAnnotations(documentId, annotations)
                    resolve(comment)
                  })
                },
                deleteVideo: function deleteVideo(documentId, commentId) {
                  return new Promise((resolve, reject) => {
                    _getAnnotations(documentId)
                    var index = -1
                    var annotations = _getAnnotations(documentId)
                    for (var i = 0, l = annotations.length; i < l; i++) {
                      if (annotations[i].uuid === commentId) {
                        index = i
                        break
                      }
                    }
                    if (index > -1) {
                      annotations.splice(index, 1)
                      updateAnnotations(documentId, annotations)
                    }
                    resolve(true)
                  })
                },
                getImages: function getImages(documentId, annotationId) {
                  return new Promise((resolve, reject) => {
                    resolve(
                      _getAnnotations(documentId).filter(
                        (i) =>
                          i.class === 'Image' && i.annotation === annotationId
                      )
                    )
                  })
                },
                addImage: function addImage(documentId, annotationId, content) {
                  return new Promise((resolve, reject) => {
                    var comment = {
                      class: 'Image',
                      uuid: (0, _uuid2.default)(),
                      annotation: annotationId,
                      content,
                    }
                    var annotations = _getAnnotations(documentId)
                    annotations.push(comment)
                    updateAnnotations(documentId, annotations)
                    resolve(comment)
                  })
                },
                deleteImage: function deleteImage(documentId, commentId) {
                  return new Promise((resolve, reject) => {
                    _getAnnotations(documentId)
                    var index = -1
                    var annotations = _getAnnotations(documentId)
                    for (var i = 0, l = annotations.length; i < l; i++) {
                      if (annotations[i].uuid === commentId) {
                        index = i
                        break
                      }
                    }
                    if (index > -1) {
                      annotations.splice(index, 1)
                      updateAnnotations(documentId, annotations)
                    }
                    resolve(true)
                  })
                },
              })
            )
          }

          return LocalStoreAdapter
        })(_StoreAdapter3.default)

        exports.default = LocalStoreAdapter

        function _getAnnotations(documentId) {
          return (
            JSON.parse(localStorage.getItem(documentId + '/annotations')) || []
          )
        }

        function updateAnnotations(documentId, annotations) {
          localStorage.setItem(
            documentId + '/annotations',
            JSON.stringify(annotations)
          )
        }

        function findAnnotation(documentId, annotationId) {
          var index = -1
          var annotations = _getAnnotations(documentId)
          for (var i = 0, l = annotations.length; i < l; i++) {
            if (annotations[i].uuid === annotationId) {
              index = i
              break
            }
          }
          return index
        }
        module.exports = exports['default']

        /***/
      },
      /* 9 uuid patter generator */
      /***/ function (module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = uuid
        var REGEXP = /[xy]/g
        var PATTERN = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

        function replacement(c) {
          var r = (Math.random() * 16) | 0
          var v = c == 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }

        /**
         * Generate a univierally unique identifier
         *
         * @return {String}
         */
        function uuid() {
          return PATTERN.replace(REGEXP, replacement)
        }
        module.exports = exports['default']

        /***/
      },
      /* 10 render implementation */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = render

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _appendChild = __webpack_require__(11)

        var _appendChild2 = _interopRequireDefault(_appendChild)

        var _renderScreenReaderHints = __webpack_require__(20)

        var _renderScreenReaderHints2 = _interopRequireDefault(
          _renderScreenReaderHints
        )

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /**
         * Render the response from PDFJSAnnotate.getStoreAdapter().getAnnotations to SVG
         *
         * @param {SVGElement} svg The SVG element to render the annotations to
         * @param {Object} viewport The page viewport data
         * @param {Object} data The response from PDFJSAnnotate.getStoreAdapter().getAnnotations
         * @return {Promise} Settled once rendering has completed
         *  A settled Promise will be either:
         *    - fulfilled: SVGElement
         *    - rejected: Error
         */
        function render(svg, viewport, data, authoringMode) {
          return new Promise(function (resolve, reject) {
            // Reset the content of the SVG
            svg.innerHTML = ''
            svg.setAttribute('data-pdf-annotate-container', true)
            svg.setAttribute(
              'data-pdf-annotate-viewport',
              JSON.stringify(viewport)
            )
            svg.removeAttribute('data-pdf-annotate-document')
            svg.removeAttribute('data-pdf-annotate-page')

            // If there's no data nothing can be done
            if (!data) {
              return resolve(svg)
            }

            svg.setAttribute('data-pdf-annotate-document', data.documentId)
            svg.setAttribute('data-pdf-annotate-page', data.pageNumber)

            // Make sure annotations is an array
            if (
              !Array.isArray(data.annotations) ||
              data.annotations.length === 0
            ) {
              return resolve(svg)
            }

            // Append annotation to svg
            data.annotations.forEach(function (a) {
              ;(0, _appendChild2.default)(svg, a, viewport, authoringMode)
            })

            resolve(svg)
          })
        }
        module.exports = exports['default']

        /***/
      },
      /* 11 appendChild implementation*/
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = appendChild

        var _objectAssign = __webpack_require__(12)

        var _objectAssign2 = _interopRequireDefault(_objectAssign)

        var _renderLine = __webpack_require__(13)

        var _renderLine2 = _interopRequireDefault(_renderLine)

        var _renderPath = __webpack_require__(16)

        var _renderPath2 = _interopRequireDefault(_renderPath)

        var _renderPoint = __webpack_require__(17)

        var _renderPoint2 = _interopRequireDefault(_renderPoint)

        var _renderRect = __webpack_require__(18)

        var _renderRect2 = _interopRequireDefault(_renderRect)

        var _renderText = __webpack_require__(19)

        var _renderText2 = _interopRequireDefault(_renderText)

        var _renderVideo = __webpack_require__(35)
        var _renderVideo2 = _interopRequireDefault(_renderVideo)
        var _renderImage = __webpack_require__(37)
        var _renderImage2 = _interopRequireDefault(_renderImage)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var isFirefox = /firefox/i.test(navigator.userAgent)

        /**
         * Get the x/y translation to be used for transforming the annotations
         * based on the rotation of the viewport.
         *
         * @param {Object} viewport The viewport data from the page
         * @return {Object}
         */
        function getTranslation(viewport) {
          var x = void 0
          var y = void 0

          // Modulus 360 on the rotation so that we only
          // have to worry about four possible values.
          switch (viewport.rotation % 360) {
            case 0:
              x = y = 0
              break
            case 90:
              x = 0
              y = (viewport.width / viewport.scale) * -1
              break
            case 180:
              x = (viewport.width / viewport.scale) * -1
              y = (viewport.height / viewport.scale) * -1
              break
            case 270:
              x = (viewport.height / viewport.scale) * -1
              y = 0
              break
          }

          return { x: x, y: y }
        }

        /**
         * Transform the rotation and scale of a node using SVG's native transform attribute.
         *
         * @param {Node} node The node to be transformed
         * @param {Object} viewport The page's viewport data
         * @return {Node}
         */
        function transform(node, viewport) {
          var trans = getTranslation(viewport)

          // var SVG natively transform the element
          node.setAttribute(
            'transform',
            'scale(' +
              viewport.scale +
              ') rotate(' +
              viewport.rotation +
              ') translate(' +
              trans.x +
              ', ' +
              trans.y +
              ')'
          )

          // Manually adjust x/y for nested SVG nodes
          if (!isFirefox && node.nodeName.toLowerCase() === 'svg') {
            node.setAttribute(
              'x',
              parseInt(node.getAttribute('x'), 10) * viewport.scale
            )
            node.setAttribute(
              'y',
              parseInt(node.getAttribute('y'), 10) * viewport.scale
            )

            var x = parseInt(node.getAttribute('x', 10))
            var y = parseInt(node.getAttribute('y', 10))
            var width = parseInt(node.getAttribute('width'), 10)
            var height = parseInt(node.getAttribute('height'), 10)
            var path = node.querySelector('path')
            var rect = node.querySelector('rect')
            var svg = path.parentNode

            // Scale width/height
            ;[node, path, rect].forEach(function (n) {
              n.setAttribute(
                'width',
                parseInt(n.getAttribute('width'), 10) * viewport.scale
              )
              n.setAttribute(
                'height',
                parseInt(n.getAttribute('height'), 10) * viewport.scale
              )
            })

            transform(path, viewport)

            switch (viewport.rotation % 360) {
              case 90:
                node.setAttribute('x', viewport.width - y - width)
                node.setAttribute('y', x)
                svg.setAttribute('x', 1)
                svg.setAttribute('y', 0)
                break
              case 180:
                node.setAttribute('x', viewport.width - x - width)
                node.setAttribute('y', viewport.height - y - height)
                svg.setAttribute('y', 2)
                break
              case 270:
                node.setAttribute('x', y)
                node.setAttribute('y', viewport.height - x - height)
                svg.setAttribute('x', -1)
                svg.setAttribute('y', 0)
                break
            }
          }

          return node
        }

        /**
         * Append an annotation as a child of an SVG.
         *
         * @param {SVGElement} svg The SVG element to append the annotation to
         * @param {Object} annotation The annotation definition to render and append
         * @param {Object} viewport The page's viewport data
         * @return {SVGElement} A node that was created and appended by this function
         */
        function appendChild(svg, annotation, viewport, authoringMode) {
          if (!viewport) {
            viewport = JSON.parse(
              svg.getAttribute('data-pdf-annotate-viewport')
            )
          }

          var child = void 0
          switch (annotation.type) {
            case 'area':
            case 'highlight':
            case 'mask':
              child = (0, _renderRect2.default)(annotation)
              break
            case 'strikeout':
              child = (0, _renderLine2.default)(annotation)
              break
            case 'point':
              child = (0, _renderPoint2.default)(annotation)
              break
            case 'textbox':
              child = (0, _renderText2.default)(annotation)
              break
            case 'drawing':
              child = (0, _renderPath2.default)(annotation)
              break
            case 'video':
              child = (0, _renderVideo2.default)(annotation)
              break
            case 'image':
              child = (0, _renderImage2.default)(annotation)
              break
          }

          // If no type was provided for an annotation it will result in node being null.
          // Skip appending/transforming if node doesn't exist.
          if (child) {
            // Set attributes
            child.setAttribute('data-pdf-annotate-id', annotation.uuid)
            child.setAttribute('data-pdf-annotate-type', annotation.type)
            if (!annotation.protected && authoringMode) {
              child.setAttribute('data-view-mode', 'edit')
            }
            child.setAttribute('aria-hidden', true)

            svg.appendChild(transform(child, viewport))
          }

          return child
        }
        module.exports = exports['default']

        /***/
      },
      /* 12 object assign util */
      /***/ function (module, exports) {
        /* eslint-disable no-unused-vars */
        'use strict'
        var hasOwnProperty = Object.prototype.hasOwnProperty
        var propIsEnumerable = Object.prototype.propertyIsEnumerable

        function toObject(val) {
          if (val === null || val === undefined) {
            throw new TypeError(
              'Object.assign cannot be called with null or undefined'
            )
          }

          return Object(val)
        }

        module.exports =
          Object.assign ||
          function (target, source) {
            var from
            var to = toObject(target)
            var symbols

            for (var s = 1; s < arguments.length; s++) {
              from = Object(arguments[s])

              for (var key in from) {
                if (hasOwnProperty.call(from, key)) {
                  to[key] = from[key]
                }
              }

              if (Object.getOwnPropertySymbols) {
                symbols = Object.getOwnPropertySymbols(from)
                for (var i = 0; i < symbols.length; i++) {
                  if (propIsEnumerable.call(from, symbols[i])) {
                    to[symbols[i]] = from[symbols[i]]
                  }
                }
              }
            }

            return to
          }

        /***/
      },
      /* 13 renderLine implementation */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderLine

        var _setAttributes = __webpack_require__(14)

        var _setAttributes2 = _interopRequireDefault(_setAttributes)

        var _normalizeColor = __webpack_require__(15)

        var _normalizeColor2 = _interopRequireDefault(_normalizeColor)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /**
         * Create SVGLineElements from an annotation definition.
         * This is used for anntations of type `strikeout`.
         *
         * @param {Object} a The annotation definition
         * @return {SVGGElement} A group of all lines to be rendered
         */
        function renderLine(a) {
          var group = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'g'
          )
          ;(0, _setAttributes2.default)(group, {
            stroke: (0, _normalizeColor2.default)(a.color || '#f00'),
            strokeWidth: 1,
          })

          a.rectangles.forEach(function (r) {
            var line = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'line'
            )

            ;(0, _setAttributes2.default)(line, {
              x1: r.x,
              y1: r.y,
              x2: r.x + r.width,
              y2: r.y,
            })

            group.appendChild(line)
          })

          return group
        }
        module.exports = exports['default']

        /***/
      },
      /* 14 setAttributes */
      /***/ function (module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = setAttributes
        var UPPER_REGEX = /[A-Z]/g

        // Don't convert these attributes from camelCase to hyphenated-attributes
        var BLACKLIST = ['viewBox']

        var keyCase = function keyCase(key) {
          if (BLACKLIST.indexOf(key) === -1) {
            key = key.replace(UPPER_REGEX, function (match) {
              return '-' + match.toLowerCase()
            })
          }
          return key
        }

        /**
         * Set attributes for a node from a map
         *
         * @param {Node} node The node to set attributes on
         * @param {Object} attributes The map of key/value pairs to use for attributes
         */
        function setAttributes(node, attributes) {
          Object.keys(attributes).forEach(function (key) {
            node.setAttribute(keyCase(key), attributes[key])
          })
        }
        module.exports = exports['default']

        /***/
      },
      /* 15 normalize color */
      /***/ function (module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = normalizeColor
        var REGEX_HASHLESS_HEX = /^([a-f0-9]{6}|[a-f0-9]{3})$/i

        /**
         * Normalize a color value
         *
         * @param {String} color The color to normalize
         * @return {String}
         */
        function normalizeColor(color) {
          if (REGEX_HASHLESS_HEX.test(color)) {
            color = '#' + color
          }
          return color
        }
        module.exports = exports['default']

        /***/
      },
      /* 16 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderPath

        var _setAttributes = __webpack_require__(14)

        var _setAttributes2 = _interopRequireDefault(_setAttributes)

        var _normalizeColor = __webpack_require__(15)

        var _normalizeColor2 = _interopRequireDefault(_normalizeColor)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /**
         * Create SVGPathElement from an annotation definition.
         * This is used for anntations of type `drawing`.
         *
         * @param {Object} a The annotation definition
         * @return {SVGPathElement} The path to be rendered
         */
        function renderPath(a) {
          var d = []
          var path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          )

          for (var i = 0, l = a.lines.length; i < l; i++) {
            var p1 = a.lines[i]
            var p2 = a.lines[i + 1]
            if (p2) {
              d.push('M' + p1[0] + ' ' + p1[1] + ' ' + p2[0] + ' ' + p2[1])
            }
          }

          ;(0, _setAttributes2.default)(path, {
            d: d.join(' ') + 'Z',
            stroke: (0, _normalizeColor2.default)(a.color || '#000'),
            strokeWidth: a.width || 1,
            fill: 'none',
          })

          return path
        }
        module.exports = exports['default']

        /***/
      },
      /* 17 SVG for Comment Tool*/
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderPoint

        var _setAttributes = __webpack_require__(14)

        var _setAttributes2 = _interopRequireDefault(_setAttributes)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var SIZE = 25
        var D =
          'm5.96968,15.58726a7.20087,7.20087 0 0 1 -0.30932,-0.76781l-0.01549,0a7.2261,7.2261 0 0 1 6.53852,-9.5306l0,0a7.21843,7.21843 0 1 1 0.34661,14.42916a7.14054,7.14054 0 0 1 -3.07121,-0.69102c-3.76223,0.74368 -3.46937,0.69102 -3.55492,0.69102a0.61863,0.61863 0 0 1 -0.60656,-0.74037l0.67237,-3.39039z'

        function renderPoint(a) {
          var commentSvg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
          )
          commentSvg.setAttribute('width', SIZE)
          commentSvg.setAttribute('height', SIZE)
          commentSvg.setAttribute('x', a.x)
          commentSvg.setAttribute('y', a.y)
          commentSvg.setAttribute('data-annotate-type', 'comment')

          var rect = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'rect'
          )
          rect.setAttribute('width', SIZE)
          rect.setAttribute('height', SIZE)
          rect.setAttribute('stroke', '#EFA12C')
          rect.setAttribute('fill', '#EFA12C')
          rect.setAttribute('stroke-width', 0)

          var path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          )
          path.setAttribute('d', D)
          path.setAttribute('stroke-width', 0.5)
          path.setAttribute('stroke', '#ffffff')
          path.setAttribute('fill', '#ffffff')

          commentSvg.appendChild(rect)
          commentSvg.appendChild(path)
          return commentSvg
        }
        module.exports = exports['default']

        /***/
      },
      /* 18 render rectangle */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function (obj) {
                return typeof obj
              }
            : function (obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol
                  ? 'symbol'
                  : typeof obj
              }

        exports.default = renderRect

        var _setAttributes = __webpack_require__(14)

        var _setAttributes2 = _interopRequireDefault(_setAttributes)

        var _normalizeColor = __webpack_require__(15)

        var _normalizeColor2 = _interopRequireDefault(_normalizeColor)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /**
         * Create SVGRectElements from an annotation definition.
         * This is used for anntations of type `area` and `highlight`.
         *
         * @param {Object} a The annotation definition
         * @return {SVGGElement|SVGRectElement} A group of all rects to be rendered
         */
        function renderRect(a) {
          if (a.type === 'highlight') {
            var _ret = (function () {
              var group = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'g'
              )
              ;(0, _setAttributes2.default)(group, {
                fill: (0, _normalizeColor2.default)(a.color || '#ff0'),
                fillOpacity: 0.2,
              })

              a.rectangles.forEach(function (r) {
                group.appendChild(createRect(r))
              })

              return {
                v: group,
              }
            })()

            if (
              (typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) ===
              'object'
            )
              return _ret.v
          } else if (a.type === 'mask') {
            var rect = createRect(a)
            ;(0, _setAttributes2.default)(rect, {
              fill: (0, _normalizeColor2.default)('#fff'),
              fillOpacity: 1,
            })
            return rect
          } else {
            var rect = createRect(a)
            ;(0, _setAttributes2.default)(rect, {
              stroke: (0, _normalizeColor2.default)(a.color || '#f00'),
              fill: 'none',
            })

            return rect
          }
        }

        function createRect(r) {
          var rect = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'rect'
          )

          ;(0, _setAttributes2.default)(rect, {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
          })

          return rect
        }
        module.exports = exports['default']

        /***/
      },
      /* 19 render text */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderText

        var _setAttributes = __webpack_require__(14)

        var _setAttributes2 = _interopRequireDefault(_setAttributes)

        var _normalizeColor = __webpack_require__(15)

        var _normalizeColor2 = _interopRequireDefault(_normalizeColor)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /**
         * Create SVGTextElement from an annotation definition.
         * This is used for anntations of type `textbox`.
         *
         * @param {Object} a The annotation definition
         * @return {SVGTextElement} A text to be rendered
         */
        function renderText(a) {
          var text = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'text'
          )

          text.setAttribute('data-annotate-type', 'textBox')
          ;(0, _setAttributes2.default)(text, {
            x: a.x,
            y: a.y + (parseInt(a.size, 10) || 0),
            fill: (0, _normalizeColor2.default)(a.color || '#000'),
            fontSize: a.size,
          })
          text.innerHTML = a.content

          return text
        }
        module.exports = exports['default']

        /***/
      },
      /* 20 renderScreenReaderHints */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderScreenReaderHints

        var _insertScreenReaderHint = __webpack_require__(21)

        var _insertScreenReaderHint2 = _interopRequireDefault(
          _insertScreenReaderHint
        )

        var _initEventHandlers = __webpack_require__(27)

        var _initEventHandlers2 = _interopRequireDefault(_initEventHandlers)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        // TODO This is not the right place for this to live
        ;(0, _initEventHandlers2.default)()

        /**
         * Insert hints into the DOM for screen readers.
         *
         * @param {Array} annotations The annotations that hints are inserted for
         */
        function renderScreenReaderHints(annotations) {
          annotations = Array.isArray(annotations) ? annotations : []

          // Insert hints for each type
          Object.keys(SORT_TYPES).forEach(function (type) {
            var sortBy = SORT_TYPES[type]
            annotations
              .filter(function (a) {
                return a.type === type
              })
              .sort(sortBy)
              .forEach(function (a, i) {
                return (0, _insertScreenReaderHint2.default)(a, i + 1)
              })
          })
        }

        // Sort annotations first by y, then by x.
        // This allows hints to be injected in the order they appear,
        // which makes numbering them easier.
        function sortByPoint(a, b) {
          if (a.y < b.y) {
            return a.x - b.x
          } else {
            return 1
          }
        }

        // Sort annotation by it's first rectangle
        function sortByRectPoint(a, b) {
          return sortByPoint(a.rectangles[0], b.rectangles[0])
        }

        // Sort annotation by it's first line
        function sortByLinePoint(a, b) {
          var lineA = a.lines[0]
          var lineB = b.lines[0]
          return sortByPoint(
            { x: lineA[0], y: lineA[1] },
            { x: lineB[0], y: lineB[1] }
          )
        }

        // Arrange supported types and associated sort methods
        var SORT_TYPES = {
          highlight: sortByRectPoint,
          strikeout: sortByRectPoint,
          drawing: sortByLinePoint,
          textbox: sortByPoint,
          point: sortByPoint,
          area: sortByPoint,
          mask: sortByPoint,
        }
        module.exports = exports['default']

        /***/
      },
      /* 21 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = insertScreenReaderHint

        var _createScreenReaderOnly = __webpack_require__(22)

        var _createScreenReaderOnly2 = _interopRequireDefault(
          _createScreenReaderOnly
        )

        var _insertElementWithinChildren = __webpack_require__(23)

        var _insertElementWithinChildren2 = _interopRequireDefault(
          _insertElementWithinChildren
        )

        var _insertElementWithinElement = __webpack_require__(24)

        var _insertElementWithinElement2 = _interopRequireDefault(
          _insertElementWithinElement
        )

        var _renderScreenReaderComments = __webpack_require__(25)

        var _renderScreenReaderComments2 = _interopRequireDefault(
          _renderScreenReaderComments
        )

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        // Annotation types that support comments
        var COMMENT_TYPES = ['highlight', 'point', 'area']

        /**
         * Insert a hint into the DOM for screen readers for a specific annotation.
         *
         * @param {Object} annotation The annotation to insert a hint for
         * @param {Number} num The number of the annotation out of all annotations of the same type
         */
        function insertScreenReaderHint(annotation) {
          var num =
            arguments.length <= 1 || arguments[1] === undefined
              ? 0
              : arguments[1]

          switch (annotation.type) {
            case 'highlight':
            case 'strikeout':
              var rects = annotation.rectangles
              var first = rects[0]
              var last = rects[rects.length - 1]

              ;(0, _insertElementWithinElement2.default)(
                (0, _createScreenReaderOnly2.default)(
                  'Begin ' + annotation.type + ' annotation ' + num,
                  annotation.uuid
                ),
                first.x,
                first.y,
                annotation.page,
                true
              )
              ;(0, _insertElementWithinElement2.default)(
                (0, _createScreenReaderOnly2.default)(
                  'End ' + annotation.type + ' annotation ' + num,
                  annotation.uuid + '-end'
                ),
                last.x + last.width,
                last.y,
                annotation.page,
                false
              )
              break

            case 'textbox':
            case 'point':
              var text =
                annotation.type === 'textbox'
                  ? ' (content: ' + annotation.content + ')'
                  : ''

              ;(0, _insertElementWithinChildren2.default)(
                (0, _createScreenReaderOnly2.default)(
                  annotation.type + ' annotation ' + num + text,
                  annotation.uuid
                ),
                annotation.x,
                annotation.y,
                annotation.page
              )
              break

            case 'drawing':
            case 'area':
              var x =
                typeof annotation.x !== 'undefined'
                  ? annotation.x
                  : annotation.lines[0][0]
              var y =
                typeof annotation.y !== 'undefined'
                  ? annotation.y
                  : annotation.lines[0][1]

              ;(0, _insertElementWithinChildren2.default)(
                (0, _createScreenReaderOnly2.default)(
                  'Unlabeled drawing',
                  annotation.uuid
                ),
                x,
                y,
                annotation.page
              )
              break
          }

          // Include comments in screen reader hint
          if (COMMENT_TYPES.includes(annotation.type)) {
            ;(0, _renderScreenReaderComments2.default)(
              annotation.documentId,
              annotation.uuid
            )
          }
        }
        module.exports = exports['default']

        /***/
      },
      /* 22 */
      /***/ function (module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = createScreenReaderOnly
        /**
         * Create a node that is only visible to screen readers
         *
         * @param {String} content The text content that should be read by screen reader
         * @param {String} [annotationId] The ID of the annotation assocaited
         * @return {Element} An Element that is only visible to screen readers
         */
        function createScreenReaderOnly(content, annotationId) {
          var node = document.createElement('div')
          var text = document.createTextNode(content)
          node.appendChild(text)
          node.setAttribute('id', 'pdf-annotate-screenreader-' + annotationId)
          node.style.position = 'absolute'
          node.style.left = '-10000px'
          node.style.top = 'auto'
          node.style.width = '1px'
          node.style.height = '1px'
          node.style.overflow = 'hidden'
          return node
        }
        module.exports = exports['default']

        /***/
      },
      /* 23 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = insertElementWithinChildren

        var _insertElementWithinElement = __webpack_require__(24)

        var _insertElementWithinElement2 = _interopRequireDefault(
          _insertElementWithinElement
        )

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        function _toConsumableArray(arr) {
          if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
              arr2[i] = arr[i]
            }
            return arr2
          } else {
            return Array.from(arr)
          }
        }

        /**
         * Insert an element at a point within the document.
         * This algorithm will try to insert between elements if possible.
         * It will however use `insertElementWithinElement` if it is more accurate.
         *
         * @param {Element} el The element to be inserted
         * @param {Number} x The x coordinate of the point
         * @param {Number} y The y coordinate of the point
         * @param {Number} pageNumber The page number to limit elements to
         * @return {Boolean} True if element was able to be inserted, otherwise false
         */
        function insertElementWithinChildren(el, x, y, pageNumber) {
          // Try and use most accurate method of inserting within an element
          if (
            (0, _insertElementWithinElement2.default)(
              el,
              x,
              y,
              pageNumber,
              true
            )
          ) {
            return true
          }

          // Fall back to inserting between elements
          var svg = document.querySelector(
            'svg[data-pdf-annotate-page="' + pageNumber + '"]'
          )
          var rect = svg.getBoundingClientRect()
          var nodes = [].concat(
            _toConsumableArray(
              svg.parentNode.querySelectorAll('.textLayer > div')
            )
          )

          y = (0, _utils.scaleUp)(svg, { y: y }).y + rect.top
          x = (0, _utils.scaleUp)(svg, { x: x }).x + rect.left

          // Find the best node to insert before
          for (var i = 0, l = nodes.length; i < l; i++) {
            var n = nodes[i]
            var r = n.getBoundingClientRect()
            if (y <= r.top) {
              n.parentNode.insertBefore(el, n)
              return true
            }
          }

          // If all else fails try to append to the bottom
          var textLayer = svg.parentNode.querySelector('.textLayer')
          if (textLayer) {
            var textRect = textLayer.getBoundingClientRect()
            if ((0, _utils.pointIntersectsRect)(x, y, textRect)) {
              textLayer.appendChild(el)
              return true
            }
          }

          return false
        }
        module.exports = exports['default']

        /***/
      },
      /* 24 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = insertElementWithinElement

        var _utils = __webpack_require__(6)

        function _toConsumableArray(arr) {
          if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
              arr2[i] = arr[i]
            }
            return arr2
          } else {
            return Array.from(arr)
          }
        }

        /**
         * Insert an element at a point within the document.
         * This algorithm will only insert within an element amidst it's text content.
         *
         * @param {Element} el The element to be inserted
         * @param {Number} x The x coordinate of the point
         * @param {Number} y The y coordinate of the point
         * @param {Number} pageNumber The page number to limit elements to
         * @param {Boolean} insertBefore Whether the element is to be inserted before or after x
         * @return {Boolean} True if element was able to be inserted, otherwise false
         */
        function insertElementWithinElement(
          el,
          x,
          y,
          pageNumber,
          insertBefore
        ) {
          var OFFSET_ADJUST = 2

          // If inserting before adjust `x` by looking for element a few px to the right
          // Otherwise adjust a few px to the left
          // This is to allow a little tolerance by searching within the box, instead
          // of getting a false negative by testing right on the border.
          x = Math.max(x + OFFSET_ADJUST * (insertBefore ? 1 : -1), 0)

          var node = textLayerElementFromPoint(x, y + OFFSET_ADJUST, pageNumber)
          if (!node) {
            return false
          }

          // Now that node has been found inverse the adjustment for `x`.
          // This is done to accomodate tolerance by cutting off on the outside of the
          // text boundary, instead of missing a character by cutting off within.
          x = x + OFFSET_ADJUST * (insertBefore ? -1 : 1)

          var svg = document.querySelector(
            'svg[data-pdf-annotate-page="' + pageNumber + '"]'
          )
          var left =
            (0, _utils.scaleDown)(svg, {
              left: node.getBoundingClientRect().left,
            }).left - svg.getBoundingClientRect().left
          var temp = node.cloneNode(true)
          var head = temp.innerHTML.split('')
          var tail = []

          // Insert temp off screen
          temp.style.position = 'absolute'
          temp.style.top = '-10000px'
          temp.style.left = '-10000px'
          document.body.appendChild(temp)

          while (head.length) {
            // Don't insert within HTML tags
            if (head[head.length - 1] === '>') {
              while (head.length) {
                tail.unshift(head.pop())
                if (tail[0] === '<') {
                  break
                }
              }
            }

            // Check if width of temp based on current head value satisfies x
            temp.innerHTML = head.join('')
            var width = (0, _utils.scaleDown)(svg, {
              width: temp.getBoundingClientRect().width,
            }).width
            if (left + width <= x) {
              break
            }
            tail.unshift(head.pop())
          }

          // Update original node with new markup, including element to be inserted
          node.innerHTML = head.join('') + el.outerHTML + tail.join('')
          temp.parentNode.removeChild(temp)

          return true
        }

        /**
         * Get a text layer element at a given point on a page
         *
         * @param {Number} x The x coordinate of the point
         * @param {Number} y The y coordinate of the point
         * @param {Number} pageNumber The page to limit elements to
         * @return {Element} First text layer element found at the point
         */
        function textLayerElementFromPoint(x, y, pageNumber) {
          var svg = document.querySelector(
            'svg[data-pdf-annotate-page="' + pageNumber + '"]'
          )
          if (!svg) {
            return
          }

          var rect = svg.getBoundingClientRect()
          y = (0, _utils.scaleUp)(svg, { y: y }).y + rect.top
          x = (0, _utils.scaleUp)(svg, { x: x }).x + rect.left
          return []
            .concat(
              _toConsumableArray(
                svg.parentNode.querySelectorAll(
                  '.textLayer [data-canvas-width]'
                )
              )
            )
            .filter(function (el) {
              return (0,
              _utils.pointIntersectsRect)(x, y, el.getBoundingClientRect())
            })[0]
        }
        module.exports = exports['default']

        /***/
      },
      /* 25 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderScreenReaderComments

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _insertScreenReaderComment = __webpack_require__(26)

        var _insertScreenReaderComment2 = _interopRequireDefault(
          _insertScreenReaderComment
        )

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /**
         * Insert the comments into the DOM to be available by screen reader
         *
         * Example output:
         *   <div class="screenReaderOnly">
         *    <div>Begin highlight 1</div>
         *    <ol aria-label="Comments">
         *      <li>Foo</li>
         *      <li>Bar</li>
         *      <li>Baz</li>
         *      <li>Qux</li>
         *    </ol>
         *  </div>
         *  <div>Some highlighted text goes here...</div>
         *  <div class="screenReaderOnly">End highlight 1</div>
         *
         * NOTE: `screenReaderOnly` is not a real class, just used for brevity
         *
         * @param {String} documentId The ID of the document
         * @param {String} annotationId The ID of the annotation
         * @param {Array} [comments] Optionally preloaded comments to be rendered
         * @return {Promise}
         */
        function renderScreenReaderComments(
          documentId,
          annotationId,
          comments
        ) {
          var promise = void 0

          if (Array.isArray(comments)) {
            promise = Promise.resolve(comments)
          } else {
            promise = _PDFJSAnnotate2.default
              .getStoreAdapter()
              .getComments(documentId, annotationId)
          }

          return promise.then(function (comments) {
            // Node needs to be found by querying DOM as it may have been inserted as innerHTML
            // leaving `screenReaderNode` as an invalid reference (see `insertElementWithinElement`).
            var node = document.getElementById(
              'pdf-annotate-screenreader-' + annotationId
            )
            if (node) {
              var list = document.createElement('ol')
              list.setAttribute(
                'id',
                'pdf-annotate-screenreader-comment-list-' + annotationId
              )
              list.setAttribute('aria-label', 'Comments')
              node.appendChild(list)
              comments.forEach(_insertScreenReaderComment2.default)
            }
          })
        }
        module.exports = exports['default']

        /***/
      },
      /* 26 */
      /***/ function (module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = insertScreenReaderComment
        /**
         * Insert a comment into the DOM to be available by screen reader
         *
         * @param {Object} comment The comment to be inserted
         */
        function insertScreenReaderComment(comment) {
          if (!comment) {
            return
          }

          var list = document.querySelector(
            '#pdf-annotate-screenreader-' + comment.annotation + ' ol'
          )
          if (list) {
            var item = document.createElement('li')
            item.setAttribute(
              'id',
              'pdf-annotate-screenreader-comment-' + comment.uuid
            )
            item.appendChild(document.createTextNode('' + comment.content))
            list.appendChild(item)
          }
        }
        module.exports = exports['default']

        /***/
      },
      /* 27 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = initEventHandlers

        var _insertScreenReaderHint = __webpack_require__(21)

        var _insertScreenReaderHint2 = _interopRequireDefault(
          _insertScreenReaderHint
        )

        var _renderScreenReaderHints = __webpack_require__(20)

        var _renderScreenReaderHints2 = _interopRequireDefault(
          _renderScreenReaderHints
        )

        var _insertScreenReaderComment = __webpack_require__(26)

        var _insertScreenReaderComment2 = _interopRequireDefault(
          _insertScreenReaderComment
        )

        var _renderScreenReaderComments = __webpack_require__(25)

        var _renderScreenReaderComments2 = _interopRequireDefault(
          _renderScreenReaderComments
        )

        var _event = __webpack_require__(4)

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /**
         * Initialize the event handlers for keeping screen reader hints synced with data
         */
        function initEventHandlers() {
          ;(0, _event.addEventListener)('annotation:add', function (
            documentId,
            pageNumber,
            annotation
          ) {
            reorderAnnotationsByType(documentId, pageNumber, annotation.type)
          })
          ;(0, _event.addEventListener)('annotation:edit', function (
            documentId,
            annotationId,
            annotation
          ) {
            reorderAnnotationsByType(
              documentId,
              annotation.page,
              annotation.type
            )
          })
          ;(0, _event.addEventListener)('annotation:delete', removeAnnotation)
          ;(0, _event.addEventListener)('comment:add', insertComment)
          ;(0, _event.addEventListener)('comment:delete', removeComment)
          ;(0, _event.addEventListener)('video:add', insertVideo)
          ;(0, _event.addEventListener)('video:delete', removeVideo)
          ;(0, _event.addEventListener)('image:add', insertImage)
          ;(0, _event.addEventListener)('image:delete', removeImage)
        }

        /**
         * Reorder the annotation numbers by annotation type
         *
         * @param {String} documentId The ID of the document
         * @param {Number} pageNumber The page number of the annotations
         * @param {Strig} type The annotation type
         */
        function reorderAnnotationsByType(documentId, pageNumber, type) {
          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .getAnnotations(documentId, pageNumber)
            .then(function (annotations) {
              return annotations.annotations.filter(function (a) {
                return a.type === type
              })
            })
            .then(function (annotations) {
              annotations.forEach(function (a) {
                removeAnnotation(documentId, a.uuid)
              })

              return annotations
            })
            .then(_renderScreenReaderHints2.default)
        }

        /**
         * Remove the screen reader hint for an annotation
         *
         * @param {String} documentId The ID of the document
         * @param {String} annotationId The Id of the annotation
         */
        function removeAnnotation(documentId, annotationId) {
          removeElementById('pdf-annotate-screenreader-' + annotationId)
          removeElementById(
            'pdf-annotate-screenreader-' + annotationId + '-end'
          )
        }

        /**
         * Insert a screen reader hint for a comment
         *
         * @param {String} documentId The ID of the document
         * @param {String} annotationId The ID of tha assocated annotation
         * @param {Object} comment The comment to insert a hint for
         */
        function insertComment(documentId, annotationId, comment) {
          var list = document.querySelector(
            'pdf-annotate-screenreader-comment-list-' + annotationId
          )
          var promise = void 0

          if (!list) {
            promise = (0, _renderScreenReaderComments2.default)(
              documentId,
              annotationId,
              []
            ).then(function () {
              list = document.querySelector(
                'pdf-annotate-screenreader-comment-list-' + annotationId
              )
              return true
            })
          } else {
            promise = Promise.resolve(true)
          }

          promise.then(function () {
            ;(0, _insertScreenReaderComment2.default)(comment)
          })
        }

        /**
         * Remove a screen reader hint for a comment
         *
         * @param {String} documentId The ID of the document
         * @param {String} commentId The ID of the comment
         */
        function removeComment(documentId, commentId) {
          removeElementById('pdf-annotate-screenreader-comment-' + commentId)
        }

        function insertVideo(documentId, annotationId, url) {
          var list = document.querySelector(
            `pdf-annotate-screenreader-video-list-${annotationId}`
          )
          var promise = void 0
          if (!list) {
            promise = (0, _renderScreenReaderComments2.default)(
              documentId,
              annotationId,
              []
            ).then(() => {
              list = document.querySelector(
                `pdf-annotate-screenreader-video-list-${annotationId}`
              )
              return true
            })
          } else {
            promise = Promise.resolve(true)
          }
          promise.then(() => {
            ;(0, _insertScreenReaderComment2.default)(url)
          })
        }
        function removeVideo(documentId, videoId) {
          removeElementById(`pdf-annotate-screenreader-video-${videoId}`)
        }
        function insertImage(documentId, annotationId, url) {
          var list = document.querySelector(
            `pdf-annotate-screenreader-image-list-${annotationId}`
          )
          var promise = void 0
          if (!list) {
            promise = (0, _renderScreenReaderComments2.default)(
              documentId,
              annotationId,
              []
            ).then(() => {
              list = document.querySelector(
                `pdf-annotate-screenreader-image-list-${annotationId}`
              )
              return true
            })
          } else {
            promise = Promise.resolve(true)
          }
          promise.then(() => {
            ;(0, _insertScreenReaderComment2.default)(url)
          })
        }
        function removeImage(documentId, imageId) {
          removeElementById(`pdf-annotate-screenreader-image-${imageId}`)
        }

        /**
         * Remove an element from the DOM by it's ID if it exists
         *
         * @param {String} elementID The ID of the element to be removed
         */
        function removeElementById(elementId) {
          var el = document.getElementById(elementId)
          if (el) {
            el.parentNode.removeChild(el)
          }
        }
        module.exports = exports['default']

        /***/
      },
      /* 28 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _event = __webpack_require__(4)

        var _edit = __webpack_require__(29)
        var _update = __webpack_require__(39)

        var _pen = __webpack_require__(30)

        var _point = __webpack_require__(31)

        var _rect = __webpack_require__(32)

        var _text = __webpack_require__(33)

        var _page = __webpack_require__(34)

        var _video = __webpack_require__(36)
        var _image = __webpack_require__(38)

        exports.default = {
          addEventListener: _event.addEventListener,
          removeEventListener: _event.removeEventListener,
          fireEvent: _event.fireEvent,
          disableEdit: _edit.disableEdit,
          enableEdit: _edit.enableEdit,
          disableUpdate: _update.disableUpdate,
          enableUpdate: _update.enableUpdate,
          disablePen: _pen.disablePen,
          enablePen: _pen.enablePen,
          setPen: _pen.setPen,
          disablePoint: _point.disablePoint,
          enablePoint: _point.enablePoint,
          setColor: _rect.setColor,
          disableRect: _rect.disableRect,
          enableRect: _rect.enableRect,
          disableText: _text.disableText,
          removeTextInput: _text.removeTextInput,
          enableText: _text.enableText,
          setText: _text.setText,
          createPage: _page.createPage,
          renderPage: _page.renderPage,
          enableVideo: _video.enableVideoPoint,
          disableVideo: _video.disableVideoPoint,
          enableImage: _image.enableImagePoint,
          disableImage: _image.disableImagePoint,
        }
        module.exports = exports['default']

        /***/
      },
      /* 29 Here is the edit  */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _slicedToArray = (function () {
          function sliceIterator(arr, i) {
            var _arr = []
            var _n = true
            var _d = false
            var _e = undefined
            try {
              for (
                var _i = arr[Symbol.iterator](), _s;
                !(_n = (_s = _i.next()).done);
                _n = true
              ) {
                _arr.push(_s.value)
                if (i && _arr.length === i) break
              }
            } catch (err) {
              _d = true
              _e = err
            } finally {
              try {
                if (!_n && _i['return']) _i['return']()
              } finally {
                if (_d) throw _e
              }
            }
            return _arr
          }
          return function (arr, i) {
            if (Array.isArray(arr)) {
              return arr
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i)
            } else {
              throw new TypeError(
                'Invalid attempt to destructure non-iterable instance'
              )
            }
          }
        })()

        exports.enableEdit = enableEdit
        exports.disableEdit = disableEdit

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _appendChild = __webpack_require__(11)

        var _appendChild2 = _interopRequireDefault(_appendChild)

        var _event = __webpack_require__(4)

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        function _toConsumableArray(arr) {
          if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
              arr2[i] = arr[i]
            }
            return arr2
          } else {
            return Array.from(arr)
          }
        }

        var _enabled = false
        var _enabledUpdate = false
        var isDragging = false,
          overlay = void 0
        var dragOffsetX = void 0,
          dragOffsetY = void 0,
          dragStartX = void 0,
          dragStartY = void 0
        var OVERLAY_BORDER_SIZE = 3

        /**
         * Create an overlay for editing an annotation.
         *
         * @param {Element} target The annotation element to apply overlay for
         */
        function createEditOverlay(target) {
          destroyEditOverlay()
          if (target.getAttribute('data-view-mode') !== 'edit') {
            return
          }

          overlay = document.createElement('div')
          var anchor = document.createElement('a')
          var parentNode = (0, _utils.findSVGContainer)(target).parentNode
          var id = target.getAttribute('data-pdf-annotate-id')
          var rect = (0, _utils.getAnnotationRect)(target)
          var styleLeft = rect.left - OVERLAY_BORDER_SIZE
          var styleTop = rect.top - OVERLAY_BORDER_SIZE

          overlay.setAttribute('id', 'pdf-annotate-edit-overlay')
          overlay.setAttribute('data-target-id', id)
          overlay.style.boxSizing = 'content-box'
          overlay.style.position = 'absolute'
          overlay.style.top = styleTop + 'px'
          overlay.style.left = styleLeft + 'px'
          overlay.style.width = rect.width + 'px'
          overlay.style.height = rect.height + 'px'
          overlay.style.border =
            OVERLAY_BORDER_SIZE + 'px solid ' + _utils.BORDER_COLOR
          overlay.style.borderRadius = OVERLAY_BORDER_SIZE + 'px'

          anchor.innerHTML = '×'
          anchor.setAttribute('href', 'javascript://')
          anchor.style.background = '#fff'
          anchor.style.borderRadius = '20px'
          anchor.style.border = '1px solid #bbb'
          anchor.style.color = '#bbb'
          anchor.style.fontSize = '16px'
          anchor.style.padding = '2px'
          anchor.style.textAlign = 'center'
          anchor.style.textDecoration = 'none'
          anchor.style.position = 'absolute'
          anchor.style.top = '-13px'
          anchor.style.right = '-13px'
          anchor.style.width = '25px'
          anchor.style.height = '25px'

          overlay.appendChild(anchor)
          parentNode.appendChild(overlay)
          document.addEventListener('click', handleDocumentClick)
          document.addEventListener('keyup', handleDocumentKeyup)
          document.addEventListener('mousedown', handleDocumentMousedown)
          anchor.addEventListener('click', deleteAnnotation)
          anchor.addEventListener('mouseover', function () {
            anchor.style.color = '#35A4DC'
            anchor.style.borderColor = '#999'
            anchor.style.boxShadow = '0 1px 1px #ccc'
          })
          anchor.addEventListener('mouseout', function () {
            anchor.style.color = '#bbb'
            anchor.style.borderColor = '#bbb'
            anchor.style.boxShadow = ''
          })
          overlay.addEventListener('mouseover', function () {
            if (!isDragging) {
              anchor.style.display = ''
            }
          })
          overlay.addEventListener('mouseout', function () {
            anchor.style.display = 'none'
          })
        }

        /**
         * Destroy the edit overlay if it exists.
         */
        function destroyEditOverlay() {
          if (overlay) {
            overlay.parentNode.removeChild(overlay)
            overlay = null
          }

          document.removeEventListener('click', handleDocumentClick)
          document.removeEventListener('keyup', handleDocumentKeyup)
          document.removeEventListener('mousedown', handleDocumentMousedown)
          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.enableUserSelect)()
        }

        /**
         * Delete currently selected annotation
         */
        function deleteAnnotation() {
          if (!overlay) {
            return
          }

          var annotationId = overlay.getAttribute('data-target-id')
          var nodes = document.querySelectorAll(
            '[data-pdf-annotate-id="' + annotationId + '"]'
          )
          var svg = overlay.parentNode.querySelector('svg.annotationLayer')

          var _getMetadata = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata.documentId

          ;[].concat(_toConsumableArray(nodes)).forEach(function (n) {
            n.parentNode.removeChild(n)
          })

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .deleteAnnotation(documentId, annotationId)

          destroyEditOverlay()
        }

        /**
         * Handle document.click event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentClick(e) {
          if (!(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
            return
          }

          // Remove current overlay
          var overlay = document.getElementById('pdf-annotate-edit-overlay')
          if (overlay) {
            if (isDragging || e.target === overlay) {
              return
            }

            destroyEditOverlay()
          }
        }

        /**
         * Handle document.keyup event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentKeyup(e) {
          if (
            overlay &&
            e.keyCode === 46 &&
            e.target.nodeName.toLowerCase() !== 'textarea' &&
            e.target.nodeName.toLowerCase() !== 'input'
          ) {
            deleteAnnotation()
          }
        }

        /**
         * Handle document.mousedown event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentMousedown(e) {
          if (e.target !== overlay) {
            return
          }

          // Highlight and strikeout annotations are bound to text within the document.
          // It doesn't make sense to allow repositioning these types of annotations.
          var annotationId = overlay.getAttribute('data-target-id')
          var target = document.querySelector(
            '[data-pdf-annotate-id="' + annotationId + '"]'
          )
          var type = target.getAttribute('data-pdf-annotate-type')

          if (type === 'highlight' || type === 'strikeout') {
            return
          }

          isDragging = true
          dragOffsetX = e.clientX
          dragOffsetY = e.clientY
          dragStartX = overlay.offsetLeft
          dragStartY = overlay.offsetTop

          overlay.style.background = 'rgba(255, 255, 255, 0.7)'
          overlay.style.cursor = 'move'
          overlay.querySelector('a').style.display = 'none'

          document.addEventListener('mousemove', handleDocumentMousemove)
          document.addEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.disableUserSelect)()
        }

        /**
         * Handle document.mousemove event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentMousemove(e) {
          var annotationId = overlay.getAttribute('data-target-id')
          var parentNode = overlay.parentNode
          var rect = parentNode.getBoundingClientRect()
          var y = dragStartY + (e.clientY - dragOffsetY)
          var x = dragStartX + (e.clientX - dragOffsetX)
          var minY = 0
          var maxY = rect.height
          var minX = 0
          var maxX = rect.width

          if (y > minY && y + overlay.offsetHeight < maxY) {
            overlay.style.top = y + 'px'
          }

          if (x > minX && x + overlay.offsetWidth < maxX) {
            overlay.style.left = x + 'px'
          }
        }

        /**
         * Handle document.mouseup event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentMouseup(e) {
          var annotationId = overlay.getAttribute('data-target-id')
          var target = document.querySelectorAll(
            '[data-pdf-annotate-id="' + annotationId + '"]'
          )
          var type = target[0].getAttribute('data-pdf-annotate-type')
          var svg = overlay.parentNode.querySelector('svg.annotationLayer')

          var _getMetadata2 = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata2.documentId

          overlay.querySelector('a').style.display = ''

          function getDelta(propX, propY) {
            return calcDelta(
              parseInt(target[0].getAttribute(propX), 10),
              parseInt(target[0].getAttribute(propY), 10)
            )
          }

          function calcDelta(x, y) {
            return {
              deltaX:
                OVERLAY_BORDER_SIZE +
                (0, _utils.scaleDown)(svg, { x: overlay.offsetLeft }).x -
                x,
              deltaY:
                OVERLAY_BORDER_SIZE +
                (0, _utils.scaleDown)(svg, { y: overlay.offsetTop }).y -
                y,
            }
          }

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .getAnnotation(documentId, annotationId)
            .then(function (annotation) {
              if (
                [
                  'area',
                  'highlight',
                  'point',
                  'textbox',
                  'video',
                  'image',
                  'mask',
                ].indexOf(type) > -1
              ) {
                ;(function () {
                  var _getDelta = getDelta('x', 'y')

                  var deltaX = _getDelta.deltaX
                  var deltaY = _getDelta.deltaY

                  ;[]
                    .concat(_toConsumableArray(target))
                    .forEach(function (t, i) {
                      if (deltaY !== 0) {
                        var modelY = parseInt(t.getAttribute('y'), 10) + deltaY
                        var viewY = modelY

                        if (type === 'textbox') {
                          viewY += annotation.size
                        }

                        if (
                          type === 'point' ||
                          type === 'video' ||
                          type === 'image'
                        ) {
                          viewY = (0, _utils.scaleUp)(svg, { viewY: viewY })
                            .viewY
                        }

                        t.setAttribute('y', viewY)
                        if (annotation.rectangles) {
                          annotation.rectangles[i].y = modelY
                        } else if (annotation.y) {
                          annotation.y = modelY
                        }
                      }
                      if (deltaX !== 0) {
                        var modelX = parseInt(t.getAttribute('x'), 10) + deltaX
                        var viewX = modelX

                        if (
                          type === 'point' ||
                          type === 'video' ||
                          type === 'image'
                        ) {
                          viewX = (0, _utils.scaleUp)(svg, { viewX: viewX })
                            .viewX
                        }

                        t.setAttribute('x', viewX)
                        if (annotation.rectangles) {
                          annotation.rectangles[i].x = modelX
                        } else if (annotation.x) {
                          annotation.x = modelX
                        }
                      }
                    })
                  // } else if (type === 'strikeout') {
                  //   var { deltaX, deltaY } = getDelta('x1', 'y1');
                  //   [...target].forEach(target, (t, i) => {
                  //     if (deltaY !== 0) {
                  //       t.setAttribute('y1', parseInt(t.getAttribute('y1'), 10) + deltaY);
                  //       t.setAttribute('y2', parseInt(t.getAttribute('y2'), 10) + deltaY);
                  //       annotation.rectangles[i].y = parseInt(t.getAttribute('y1'), 10);
                  //     }
                  //     if (deltaX !== 0) {
                  //       t.setAttribute('x1', parseInt(t.getAttribute('x1'), 10) + deltaX);
                  //       t.setAttribute('x2', parseInt(t.getAttribute('x2'), 10) + deltaX);
                  //       annotation.rectangles[i].x = parseInt(t.getAttribute('x1'), 10);
                  //     }
                  //   });
                })()
              } else if (type === 'drawing') {
                ;(function () {
                  var rect = (0, _utils.scaleDown)(
                    svg,
                    (0, _utils.getAnnotationRect)(target[0])
                  )

                  var _annotation$lines$ = _slicedToArray(
                    annotation.lines[0],
                    2
                  )

                  var originX = _annotation$lines$[0]
                  var originY = _annotation$lines$[1]

                  var _calcDelta = calcDelta(originX, originY)

                  var deltaX = _calcDelta.deltaX
                  var deltaY = _calcDelta.deltaY

                  // origin isn't necessarily at 0/0 in relation to overlay x/y
                  // adjust the difference between overlay and drawing coords

                  deltaY += originY - rect.top
                  deltaX += originX - rect.left

                  annotation.lines.forEach(function (line, i) {
                    var _annotation$lines$i = _slicedToArray(
                      annotation.lines[i],
                      2
                    )

                    var x = _annotation$lines$i[0]
                    var y = _annotation$lines$i[1]

                    annotation.lines[i][0] = x + deltaX
                    annotation.lines[i][1] = y + deltaY
                  })

                  target[0].parentNode.removeChild(target[0])
                  ;(0, _appendChild2.default)(svg, annotation)
                })()
              }

              _PDFJSAnnotate2.default
                .getStoreAdapter()
                .editAnnotation(documentId, annotationId, annotation)
            })

          setTimeout(function () {
            isDragging = false
          }, 0)

          overlay.style.background = ''
          overlay.style.cursor = ''

          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.enableUserSelect)()
        }

        /**
         * Handle annotation.click event
         *
         * @param {Element} e The annotation element that was clicked
         */
        function handleAnnotationClick(target) {
          createEditOverlay(target)
        }

        /**
         * Enable edit mode behavior.
         */
        function enableEdit() {
          if (_enabled) {
            return
          }

          _enabled = true
          ;(0, _event.addEventListener)(
            'annotation:click',
            handleAnnotationClick
          )
        }

        /**
         * Disable edit mode behavior.
         */
        function disableEdit() {
          destroyEditOverlay()

          if (!_enabled) {
            return
          }

          _enabled = false
          ;(0, _event.removeEventListener)(
            'annotation:click',
            handleAnnotationClick
          )
        }

        /***/
      },
      /* 30 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.setPen = setPen
        exports.enablePen = enablePen
        exports.disablePen = disablePen

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _appendChild = __webpack_require__(11)

        var _appendChild2 = _interopRequireDefault(_appendChild)

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var _enabled = false
        var _penSize = void 0
        var _penColor = void 0
        var path = void 0
        var lines = void 0

        /**
         * Handle document.mousedown event
         */
        function handleDocumentMousedown() {
          path = null
          lines = []

          document.addEventListener('mousemove', handleDocumentMousemove)
          document.addEventListener('mouseup', handleDocumentMouseup)
        }

        /**
         * Handle document.mouseup event
         *
         * @param {Event} e The DOM event to be handled
         */
        function handleDocumentMouseup(e) {
          var svg = void 0
          if (
            lines.length > 1 &&
            (svg = (0, _utils.findSVGAtPoint)(e.clientX, e.clientY))
          ) {
            var _getMetadata = (0, _utils.getMetadata)(svg)

            var documentId = _getMetadata.documentId
            var pageNumber = _getMetadata.pageNumber

            _PDFJSAnnotate2.default
              .getStoreAdapter()
              .addAnnotation(documentId, pageNumber, {
                type: 'drawing',
                width: _penSize,
                color: _penColor,
                lines: lines,
              })
              .then(function (annotation) {
                if (path) {
                  svg.removeChild(path)
                }

                ;(0, _appendChild2.default)(svg, annotation)
              })
          }

          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
        }

        /**
         * Handle document.mousemove event
         *
         * @param {Event} e The DOM event to be handled
         */
        function handleDocumentMousemove(e) {
          savePoint(e.clientX, e.clientY)
        }

        /**
         * Handle document.keyup event
         *
         * @param {Event} e The DOM event to be handled
         */
        function handleDocumentKeyup(e) {
          // Cancel rect if Esc is pressed
          if (e.keyCode === 27) {
            lines = null
            path.parentNode.removeChild(path)
            document.removeEventListener('mousemove', handleDocumentMousemove)
            document.removeEventListener('mouseup', handleDocumentMouseup)
          }
        }

        /**
         * Save a point to the line being drawn.
         *
         * @param {Number} x The x coordinate of the point
         * @param {Number} y The y coordinate of the point
         */
        function savePoint(x, y) {
          var svg = (0, _utils.findSVGAtPoint)(x, y)
          if (!svg) {
            return
          }

          var rect = svg.getBoundingClientRect()
          var point = (0, _utils.scaleDown)(svg, {
            x: x - rect.left,
            y: y - rect.top,
          })

          lines.push([point.x, point.y])

          if (lines.length <= 1) {
            return
          }

          if (path) {
            svg.removeChild(path)
          }

          path = (0, _appendChild2.default)(svg, {
            type: 'drawing',
            color: _penColor,
            width: _penSize,
            lines: lines,
          })
        }

        /**
         * Set the attributes of the pen.
         *
         * @param {Number} penSize The size of the lines drawn by the pen
         * @param {String} penColor The color of the lines drawn by the pen
         */
        function setPen() {
          var penSize =
            arguments.length <= 0 || arguments[0] === undefined
              ? 1
              : arguments[0]
          var penColor =
            arguments.length <= 1 || arguments[1] === undefined
              ? '000000'
              : arguments[1]

          _penSize = parseInt(penSize, 10)
          _penColor = penColor
        }

        /**
         * Enable the pen behavior
         */
        function enablePen() {
          if (_enabled) {
            return
          }

          _enabled = true
          document.addEventListener('mousedown', handleDocumentMousedown)
          document.addEventListener('keyup', handleDocumentKeyup)
          ;(0, _utils.disableUserSelect)()
        }

        /**
         * Disable the pen behavior
         */
        function disablePen() {
          if (!_enabled) {
            return
          }

          _enabled = false
          document.removeEventListener('mousedown', handleDocumentMousedown)
          document.removeEventListener('keyup', handleDocumentKeyup)
          ;(0, _utils.enableUserSelect)()
        }

        /***/
      },
      /* 31 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function (obj) {
                return typeof obj
              }
            : function (obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol
                  ? 'symbol'
                  : typeof obj
              }

        exports.enablePoint = enablePoint
        exports.disablePoint = disablePoint

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _appendChild = __webpack_require__(11)

        var _appendChild2 = _interopRequireDefault(_appendChild)

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var _enabled = false
        var input = void 0
        var container = void 0

        /**
         * Handle document.mouseup event
         *
         * @param {Event} The DOM event to be handled
         */
        function handleDocumentMouseup(e) {
          if (input || !(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
            return
          }

          container = document.createElement('DIV')
          container.innerHTML = `
            <div class="ant-popover ant-popconfirm ant-popover-placement-topRight ">
              <div class="ant-popover-content">
              <div class="ant-popover-arrow">
              <span class="ant-popover-arrow-content"></span>
            </div>

             
            <div class="ant-popover-inner" role="tooltip">
              <div class="ant-popover-inner-content">
            <div class="ant-popover-message">
            

              <textarea id="pdf-annotate-point-input" rows="5" class="ant-input" ></textarea>
            </div>
            
            
            <div class="ant-popover-buttons">
              <button id="edu-annotate-cancel" type="button" class="ant-btn ant-btn-sm"><span>Cancel</span></button>
              <button id="edu-annotate-submit" type="button" class="ant-btn ant-btn-primary ant-btn-sm"><span>Submit</span></button>
            </div>
            
            </div></div></div></div>
      `

          container.style.position = 'absolute'
          container.style.width = '100%'
          container.style.top = `${e.clientY}px`
          container.style.left = `${e.clientX}px`
          container.addEventListener('blur', handleInputBlur)
          container.addEventListener('keyup', handleInputKeyup)
          document.body.appendChild(container)

          var cancel = document.getElementById('edu-annotate-cancel')
          cancel.addEventListener('click', closeInput)

          var submit = document.getElementById('edu-annotate-submit')
          submit.addEventListener('click', savePoint)

          input = document.getElementById('pdf-annotate-point-input')
          input.focus()
        }

        /**
         * Handle input.blur event
         */
        function handleInputBlur() {
          savePoint()
        }

        /**
         * Handle input.keyup event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleInputKeyup(e) {
          if (e.keyCode === 27) {
            closeInput()
          } else if (e.keyCode === 13) {
            savePoint()
          }
        }

        /**
         * Save a new point annotation from input
         */
        function savePoint() {
          if (input.value.trim().length > 0) {
            var _ret = (function () {
              var clientX = parseInt(container.style.left, 10)
              var clientY = parseInt(container.style.top, 10)
              var content = input.value.trim()
              var svg = (0, _utils.findSVGAtPoint)(clientX, clientY)
              if (!svg) {
                return {
                  v: void 0,
                }
              }

              var rect = svg.getBoundingClientRect()

              var _getMetadata = (0, _utils.getMetadata)(svg)

              var documentId = _getMetadata.documentId
              var pageNumber = _getMetadata.pageNumber

              var annotation = Object.assign(
                {
                  type: 'point',
                },
                (0, _utils.scaleDown)(svg, {
                  x: clientX - rect.left,
                  y: clientY - rect.top,
                })
              )

              _PDFJSAnnotate2.default
                .getStoreAdapter()
                .addAnnotation(documentId, pageNumber, annotation)
                .then(function (annotation) {
                  _PDFJSAnnotate2.default
                    .getStoreAdapter()
                    .addComment(documentId, annotation.uuid, content)
                  ;(0, _appendChild2.default)(svg, annotation)
                })
            })()

            if (
              (typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) ===
              'object'
            )
              return _ret.v
          }

          closeInput()
        }

        /**
         * Close the input element
         */
        function closeInput() {
          if (container) {
            container.removeEventListener('blur', handleInputBlur)
            container.removeEventListener('keyup', handleInputKeyup)
            document.body.removeChild(container)
            container = null
            input = null
          }
        }

        /**
         * Enable point annotation behavior
         */
        function enablePoint() {
          if (_enabled) {
            return
          }

          _enabled = true
          document.addEventListener('mouseup', handleDocumentMouseup)
        }

        /**
         * Disable point annotation behavior
         */
        function disablePoint() {
          if (!_enabled) {
            return
          }

          _enabled = false
          document.removeEventListener('mouseup', handleDocumentMouseup)
        }

        /***/
      },
      /* 32 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.setColor = setColor
        exports.enableRect = enableRect
        exports.disableRect = disableRect

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _appendChild = __webpack_require__(11)

        var _appendChild2 = _interopRequireDefault(_appendChild)

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        function _toConsumableArray(arr) {
          if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
              arr2[i] = arr[i]
            }
            return arr2
          } else {
            return Array.from(arr)
          }
        }

        var _enabled = false
        var _type = void 0
        var _color = '#f00'
        var overlay = void 0
        var originY = void 0
        var originX = void 0

        /**
         * Get the current window selection as rects
         *
         * @return {Array} An Array of rects
         */
        function getSelectionRects() {
          try {
            var selection = window.getSelection()
            var range = selection.getRangeAt(0)
            var rects = range.getClientRects()

            if (rects.length > 0 && rects[0].width > 0 && rects[0].height > 0) {
              return rects
            }
          } catch (e) {}

          return null
        }

        /**
         * Handle document.mousedown event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleDocumentMousedown(e) {
          var svg = void 0
          if (
            (_type !== 'area' && _type !== 'mask') ||
            !(svg = (0, _utils.findSVGAtPoint)(e.clientX, e.clientY))
          ) {
            return
          }

          var rect = svg.getBoundingClientRect()
          originY = e.clientY
          originX = e.clientX

          overlay = document.createElement('div')
          overlay.style.position = 'absolute'
          overlay.style.top = originY - rect.top + 'px'
          overlay.style.left = originX - rect.left + 'px'
          overlay.style.border = '3px solid ' + _utils.BORDER_COLOR
          overlay.style.borderRadius = '3px'
          svg.parentNode.appendChild(overlay)

          document.addEventListener('mousemove', handleDocumentMousemove)
          ;(0, _utils.disableUserSelect)()
        }

        /**
         * Handle document.mousemove event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleDocumentMousemove(e) {
          var svg = overlay.parentNode.querySelector('svg.annotationLayer')
          var rect = svg.getBoundingClientRect()

          if (originX + (e.clientX - originX) < rect.right) {
            overlay.style.width = e.clientX - originX + 'px'
          }

          if (originY + (e.clientY - originY) < rect.bottom) {
            overlay.style.height = e.clientY - originY + 'px'
          }
        }

        /**
         * Handle document.mouseup event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleDocumentMouseup(e) {
          var rects = void 0
          if (
            _type !== 'area' &&
            _type !== 'area' &&
            (rects = getSelectionRects())
          ) {
            var svg = (0, _utils.findSVGAtPoint)(rects[0].left, rects[0].top)
            saveRect(
              _type,
              [].concat(_toConsumableArray(rects)).map(function (r) {
                return {
                  top: r.top,
                  left: r.left,
                  width: r.width,
                  height: r.height,
                }
              }),
              _color
            )
          } else if ((_type === 'area' || _type === 'mask') && overlay) {
            var _svg = overlay.parentNode.querySelector('svg.annotationLayer')
            var rect = _svg.getBoundingClientRect()
            saveRect(
              _type,
              [
                {
                  top: parseInt(overlay.style.top, 10) + rect.top,
                  left: parseInt(overlay.style.left, 10) + rect.left,
                  width: parseInt(overlay.style.width, 10),
                  height: parseInt(overlay.style.height, 10),
                },
              ],
              _color
            )

            overlay.parentNode.removeChild(overlay)
            overlay = null

            document.removeEventListener('mousemove', handleDocumentMousemove)
            ;(0, _utils.enableUserSelect)()
          }
        }

        /**
         * Handle document.keyup event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleDocumentKeyup(e) {
          // Cancel rect if Esc is pressed
          if (e.keyCode === 27) {
            var selection = window.getSelection()
            selection.removeAllRanges()
            if (overlay && overlay.parentNode) {
              overlay.parentNode.removeChild(overlay)
              overlay = null
              document.removeEventListener('mousemove', handleDocumentMousemove)
            }
          }
        }

        /**
         * Save a rect annotation
         *
         * @param {String} type The type of rect (area, highlight, strikeout)
         * @param {Array} rects The rects to use for annotation
         * @param {String} color The color of the rects
         */
        function saveRect(type, rects, color) {
          var svg = (0, _utils.findSVGAtPoint)(rects[0].left, rects[0].top)
          var node = void 0
          var annotation = void 0

          if (!svg) {
            return
          }

          var boundingRect = svg.getBoundingClientRect()

          if (!color) {
            if (type === 'highlight') {
              color = 'FFFF00'
            } else if (type === 'strikeout') {
              color = 'FF0000'
            }
          }

          // Initialize the annotation
          annotation = {
            type: type,
            color: color,
            rectangles: []
              .concat(_toConsumableArray(rects))
              .map(function (r) {
                var offset = 0

                if (type === 'strikeout') {
                  offset = r.height / 2
                }

                return (0, _utils.scaleDown)(svg, {
                  y: r.top + offset - boundingRect.top,
                  x: r.left - boundingRect.left,
                  width: r.width,
                  height: r.height,
                })
              })
              .filter(function (r) {
                return r.width > 0 && r.height > 0 && r.x > -1 && r.y > -1
              }),
          }

          // Short circuit if no rectangles exist
          if (annotation.rectangles.length === 0) {
            return
          }

          // Special treatment for area as it only supports a single rect
          if (type === 'area' || type === 'mask') {
            var rect = annotation.rectangles[0]
            delete annotation.rectangles
            annotation.x = rect.x
            annotation.y = rect.y
            annotation.width = rect.width
            annotation.height = rect.height
          }

          var _getMetadata = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata.documentId
          var pageNumber = _getMetadata.pageNumber

          // Add the annotation

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .addAnnotation(documentId, pageNumber, annotation)
            .then(function (annotation) {
              ;(0, _appendChild2.default)(svg, annotation)
            })
        }

        function setColor(color) {
          _color = color
        }

        /**
         * Enable rect behavior
         */
        function enableRect(type, color) {
          _type = type
          _color = color

          if (_enabled) {
            return
          }

          _enabled = true
          document.addEventListener('mouseup', handleDocumentMouseup)
          document.addEventListener('mousedown', handleDocumentMousedown)
          document.addEventListener('keyup', handleDocumentKeyup)
        }

        /**
         * Disable rect behavior
         */
        function disableRect() {
          if (!_enabled) {
            return
          }

          _enabled = false
          document.removeEventListener('mouseup', handleDocumentMouseup)
          document.removeEventListener('mousedown', handleDocumentMousedown)
          document.removeEventListener('keyup', handleDocumentKeyup)
        }

        /***/
      },
      /* 33 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function (obj) {
                return typeof obj
              }
            : function (obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol
                  ? 'symbol'
                  : typeof obj
              }

        exports.setText = setText
        exports.enableText = enableText
        exports.disableText = disableText
        exports.removeTextInput = removeTextInput

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _appendChild = __webpack_require__(11)

        var _appendChild2 = _interopRequireDefault(_appendChild)

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var _enabled = false
        var input = void 0
        var _textSize = void 0
        var _textColor = void 0

        /**
         * Handle document.mouseup event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleDocumentMouseup(e) {
          if (input || !(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
            return
          }

          input = document.createElement('input')
          input.setAttribute('id', 'pdf-annotate-text-input')
          input.setAttribute('placeholder', 'Enter text')
          input.style.border = '3px solid ' + _utils.BORDER_COLOR
          input.style.borderRadius = '3px'
          input.style.position = 'absolute'
          input.style.top = e.clientY + 'px'
          input.style.left = e.clientX + 'px'
          input.style.fontSize = _textSize + 'px'
          input.style.zIndex = 9999

          input.addEventListener('blur', handleInputBlur)
          input.addEventListener('keyup', handleInputKeyup)

          document.body.appendChild(input)
          input.focus()
        }

        /**
         * Handle input.blur event
         */
        function handleInputBlur() {
          saveText()
        }

        /**
         * Handle input.keyup event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleInputKeyup(e) {
          if (e.keyCode === 27) {
            closeInput()
          } else if (e.keyCode === 13) {
            saveText()
          }
        }

        /**
         * Save a text annotation from input
         */
        function saveText() {
          if (input.value.trim().length > 0) {
            var _ret = (function () {
              var clientX = parseInt(input.style.left, 10)
              var clientY = parseInt(input.style.top, 10)
              var svg = (0, _utils.findSVGAtPoint)(clientX, clientY)
              if (!svg) {
                return {
                  v: void 0,
                }
              }

              var _getMetadata = (0, _utils.getMetadata)(svg)

              var documentId = _getMetadata.documentId
              var pageNumber = _getMetadata.pageNumber

              var rect = svg.getBoundingClientRect()
              var annotation = Object.assign(
                {
                  type: 'textbox',
                  size: _textSize,
                  color: _textColor,
                  content: input.value.trim(),
                },
                (0, _utils.scaleDown)(svg, {
                  x: clientX - rect.left,
                  y: clientY - rect.top,
                  width: input.offsetWidth,
                  height: input.offsetHeight,
                })
              )

              _PDFJSAnnotate2.default
                .getStoreAdapter()
                .addAnnotation(documentId, pageNumber, annotation)
                .then(function (annotation) {
                  ;(0, _appendChild2.default)(svg, annotation)
                })
            })()

            if (
              (typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) ===
              'object'
            )
              return _ret.v
          }

          closeInput()
        }

        /**
         * Close the input
         */
        function closeInput() {
          if (input) {
            input.removeEventListener('blur', handleInputBlur)
            input.removeEventListener('keyup', handleInputKeyup)
            document.body.removeChild(input)
            input = null
          }
        }

        /**
         * Set the text attributes
         *
         * @param {Number} textSize The size of the text
         * @param {String} textColor The color of the text
         */
        function setText() {
          var textSize =
            arguments.length <= 0 || arguments[0] === undefined
              ? 12
              : arguments[0]
          var textColor =
            arguments.length <= 1 || arguments[1] === undefined
              ? '000000'
              : arguments[1]

          _textSize = parseInt(textSize, 10)
          _textColor = textColor
        }

        /**
         * Enable text behavior
         */
        function enableText() {
          if (_enabled) {
            return
          }

          _enabled = true
          document.addEventListener('mouseup', handleDocumentMouseup)
        }

        /**
         * Disable text behavior
         */
        function disableText() {
          if (!_enabled) {
            return
          }

          _enabled = false
          document.removeEventListener('mouseup', handleDocumentMouseup)
        }

        /**
         * Remove text input
         */
        function removeTextInput() {
          closeInput()
        }

        /***/
      },
      /* 34 */
      /***/ function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _slicedToArray = (function () {
          function sliceIterator(arr, i) {
            var _arr = []
            var _n = true
            var _d = false
            var _e = undefined
            try {
              for (
                var _i = arr[Symbol.iterator](), _s;
                !(_n = (_s = _i.next()).done);
                _n = true
              ) {
                _arr.push(_s.value)
                if (i && _arr.length === i) break
              }
            } catch (err) {
              _d = true
              _e = err
            } finally {
              try {
                if (!_n && _i['return']) _i['return']()
              } finally {
                if (_d) throw _e
              }
            }
            return _arr
          }
          return function (arr, i) {
            if (Array.isArray(arr)) {
              return arr
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i)
            } else {
              throw new TypeError(
                'Invalid attempt to destructure non-iterable instance'
              )
            }
          }
        })()

        exports.createPage = createPage
        exports.renderPage = renderPage

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _renderScreenReaderHints = __webpack_require__(20)

        var _renderScreenReaderHints2 = _interopRequireDefault(
          _renderScreenReaderHints
        )

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        // Template for creating a new page
        var PAGE_TEMPLATE =
          '\n  <div style="visibility: hidden;" class="page" data-loaded="false">\n    <div class="canvasWrapper">\n      <canvas></canvas>\n    </div>\n    <svg class="annotationLayer"></svg>\n    <div class="textLayer"></div>\n  </div>\n'

        /**
         * Create a new page to be appended to the DOM.
         *
         * @param {Number} pageNumber The page number that is being created
         * @return {HTMLElement}
         */
        function createPage(pageNumber) {
          var temp = document.createElement('div')
          temp.innerHTML = PAGE_TEMPLATE

          var page = temp.children[0]
          var canvas = page.querySelector('canvas')

          page.setAttribute('id', 'pageContainer' + pageNumber)
          page.setAttribute('data-page-number', pageNumber)

          canvas.mozOpaque = true
          canvas.setAttribute('id', 'page' + pageNumber)

          return page
        }

        /**
         * Render a page that has already been created.
         *
         * @param {Number} pageNumber The page number to be rendered
         * @param {Object} renderOptions The options for rendering
         * @return {Promise} Settled once rendering has completed
         *  A settled Promise will be either:
         *    - fulfilled: [pdfPage, annotations]
         *    - rejected: Error
         */
        function renderPage(pageNumber, renderOptions, annotateRenderOptions) {
          var documentId = renderOptions.documentId
          var pdfDocument = renderOptions.pdfDocument
          var scale = renderOptions.scale
          var rotate = renderOptions.rotate
          var authoringMode = renderOptions.authoringMode
          var annotateScale = annotateRenderOptions.scale
          var annotateRotate = annotateRenderOptions.rotate

          // Load the page and annotations

          return Promise.all([
            pdfDocument.getPage(pageNumber),
            _PDFJSAnnotate2.default.getAnnotations(documentId, pageNumber),
          ]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2)

            var pdfPage = _ref2[0]
            var annotations = _ref2[1]

            var page = document.getElementById('pageContainer' + pageNumber)
            var svg = page.querySelector('.annotationLayer')
            var canvas = page.querySelector('.canvasWrapper canvas')
            var canvasContext = canvas.getContext('2d', { alpha: false })
            var viewport = pdfPage.getViewport(scale, rotate)
            var transform = scalePage(pageNumber, viewport, canvasContext)
            var annotateViewport = pdfPage.getViewport(
              annotateScale,
              annotateRotate
            )

            // Render the page
            return Promise.all([
              pdfPage.render({
                canvasContext: canvasContext,
                viewport: viewport,
                transform: transform,
              }),
              _PDFJSAnnotate2.default.render(
                svg,
                annotateViewport,
                annotations,
                authoringMode
              ),
            ])
              .then(function () {
                // Text content is needed for a11y, but is also necessary for creating
                // highlight and strikeout annotations which require selecting text.
                return pdfPage
                  .getTextContent({ normalizeWhitespace: true })
                  .then(function (textContent) {
                    return new Promise(function (resolve, reject) {
                      // Render text layer for a11y of text content
                      var textLayer = page.querySelector('.textLayer')
                      var textLayerFactory = new pdfjsViewer.DefaultTextLayerFactory()
                      var textLayerBuilder = textLayerFactory.createTextLayerBuilder(
                        textLayer,
                        pageNumber - 1,
                        viewport
                      )
                      textLayerBuilder.setTextContent(textContent)
                      textLayerBuilder.render()

                      // Enable a11y for annotations
                      // Timeout is needed to wait for `textLayerBuilder.render`
                      setTimeout(function () {
                        try {
                          ;(0,
                          _renderScreenReaderHints2.default)(annotations.annotations)
                          resolve()
                        } catch (e) {
                          reject(e)
                        }
                      })
                    })
                  })
              })
              .then(function () {
                // Indicate that the page was loaded
                page.setAttribute('data-loaded', 'true')

                return [pdfPage, annotations]
              })
          })
        }

        /**
         * Scale the elements of a page.
         *
         * @param {Number} pageNumber The page number to be scaled
         * @param {Object} viewport The viewport of the PDF page (see pdfPage.getViewport(scale, rotate))
         * @param {Object} context The canvas context that the PDF page is rendered to
         * @return {Array} The transform data for rendering the PDF page
         */
        function scalePage(pageNumber, viewport, context) {
          var page = document.getElementById('pageContainer' + pageNumber)
          var canvas = page.querySelector('.canvasWrapper canvas')
          var svg = page.querySelector('.annotationLayer')
          var wrapper = page.querySelector('.canvasWrapper')
          var textLayer = page.querySelector('.textLayer')
          var outputScale = getOutputScale(context)
          var transform = !outputScale.scaled
            ? null
            : [outputScale.sx, 0, 0, outputScale.sy, 0, 0]
          var sfx = approximateFraction(outputScale.sx)
          var sfy = approximateFraction(outputScale.sy)

          // Adjust width/height for scale
          page.style.visibility = ''
          canvas.width = roundToDivide(viewport.width * outputScale.sx, sfx[0])
          canvas.height = roundToDivide(
            viewport.height * outputScale.sy,
            sfy[0]
          )
          canvas.style.width = roundToDivide(viewport.width, sfx[1]) + 'px'
          canvas.style.height = roundToDivide(viewport.height, sfx[1]) + 'px'
          svg.setAttribute('width', viewport.width)
          svg.setAttribute('height', viewport.height)
          svg.style.width = viewport.width + 'px'
          svg.style.height = viewport.height + 'px'
          page.style.width = viewport.width + 'px'
          page.style.height = viewport.height + 'px'
          wrapper.style.width = viewport.width + 'px'
          wrapper.style.height = viewport.height + 'px'
          textLayer.style.width = viewport.width + 'px'
          textLayer.style.height = viewport.height + 'px'

          return transform
        }

        /**
         * Approximates a float number as a fraction using Farey sequence (max order of 8).
         *
         * @param {Number} x Positive float number
         * @return {Array} Estimated fraction: the first array item is a numerator,
         *                 the second one is a denominator.
         */
        function approximateFraction(x) {
          // Fast path for int numbers or their inversions.
          if (Math.floor(x) === x) {
            return [x, 1]
          }

          var xinv = 1 / x
          var limit = 8
          if (xinv > limit) {
            return [1, limit]
          } else if (Math.floor(xinv) === xinv) {
            return [1, xinv]
          }

          var x_ = x > 1 ? xinv : x

          // a/b and c/d are neighbours in Farey sequence.
          var a = 0,
            b = 1,
            c = 1,
            d = 1

          // Limit search to order 8.
          while (true) {
            // Generating next term in sequence (order of q).
            var p = a + c,
              q = b + d
            if (q > limit) {
              break
            }
            if (x_ <= p / q) {
              c = p
              d = q
            } else {
              a = p
              b = q
            }
          }

          // Select closest of neighbours to x.
          if (x_ - a / b < c / d - x_) {
            return x_ === x ? [a, b] : [b, a]
          } else {
            return x_ === x ? [c, d] : [d, c]
          }
        }

        function getOutputScale(ctx) {
          var devicePixelRatio = window.devicePixelRatio || 1
          var backingStoreRatio =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1
          var pixelRatio = devicePixelRatio / backingStoreRatio
          return {
            sx: pixelRatio,
            sy: pixelRatio,
            scaled: pixelRatio !== 1,
          }
        }

        function roundToDivide(x, div) {
          var r = x % div
          return r === 0 ? x : Math.round(x - r + div)
        }

        /***/
      },
      /* 35  SVG for video tool */
      /** */ function (module, exports, __webpack_require__) {
        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderPoint
        var _setAttributes = __webpack_require__(14)
        var _setAttributes2 = _interopRequireDefault(_setAttributes)
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }
        var SIZE = 25
        var videoSvg = `<svg class="svg-icon" data-annotate-type="video" width="25" height="25">
          <rect id="svg_7" height="25.34268" width="25.18643" y="-0.21763" x="-0.10918" stroke-opacity="0" stroke-width="null" stroke="#1AB395" fill="#1AB395"/>          
          <g stroke="null" id="svg_6">
            <g stroke="null" id="svg_1">
            <path stroke="#ffffff" d="m5.50557,7.04802l10.04806,0a1.00547,1.00547 0 0 1 0.9133,1.08089l0,8.64959a1.00547,1.00547 0 0 1 -0.9133,1.08089l-10.04806,0a1.00547,1.00547 0 0 1 -0.9133,-1.08089l0,-8.64959a1.00547,1.00547 0 0 1 0.9133,-1.08089z" fill="#ffffff" id="svg_2"/>
            </g>
            <g stroke="null" id="svg_3">
            <path stroke="#ffffff" d="m15.38739,9.69493l4.20289,-2.43409a0.47342,0.47342 0 0 1 0.53039,0.03351a0.68708,0.68708 0 0 1 0.25807,0.55301l0,9.21685a0.68708,0.68708 0 0 1 -0.26058,0.55553a0.48515,0.48515 0 0 1 -0.2874,0.09636a0.4776,0.4776 0 0 1 -0.24718,-0.06954l-4.20289,-2.52375l0.0067,-5.42789z" fill="#ffffff" id="svg_4"/>
            </g>
          </g>          
      </svg>`

        function renderPoint(a) {
          var div = document.createElement('div')
          div.innerHTML = videoSvg.trim()

          div.firstChild.setAttribute('x', a.x)
          div.firstChild.setAttribute('y', a.y)
          div.firstChild.setAttribute('stroke-width', 1)
          div.firstChild.setAttribute('stroke', 'green')

          return div.firstChild
        }
        module.exports = exports.default
        /** */
      },
      /* 36  Video Tool */
      /** */
      function (module, exports, __webpack_require__) {
        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function (obj) {
                return typeof obj
              }
            : function (obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol
                  ? 'symbol'
                  : typeof obj
              }
        exports.enableVideoPoint = enableVideoPoint
        exports.disableVideoPoint = disableVideoPoint
        var _PDFJSAnnotate = __webpack_require__(1)
        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)
        var _appendChild = __webpack_require__(11)
        var _appendChild2 = _interopRequireDefault(_appendChild)
        var _utils = __webpack_require__(6)
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }
        var _enabledVideo = false
        var input = void 0
        var container = void 0
        /**
         * Handle document.mouseup event
         *
         * @param {Event} The DOM event to be handled
         */
        function handleDocumentMouseup(e) {
          if (input || !(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
            return
          }

          container = document.createElement('DIV')
          container.innerHTML = `
            <div class="ant-popover ant-popconfirm ant-popover-placement-topRight ">
              <div class="ant-popover-content">
              <div class="ant-popover-arrow">
              <span class="ant-popover-arrow-content"></span>
            </div>
            
            <div class="ant-popover-inner" role="tooltip">
              <div class="ant-popover-inner-content">
            <div class="ant-popover-message">

            <div id="edu-annoate-video-view"></div>

            <span>Copy and paste the video embed code
            <a href="https://support.google.com/youtube/answer/171780?hl=en" target="_blank">Help</a>:
            </span><br/><br/>
              <input id="video-edit-input" type="url" placeholder="Paste video embed code here" class="ant-input" value="">
            </div>
            
            <div class="ant-popover-buttons">
              <button id="edu-annotate-cancel" type="button" class="ant-btn ant-btn-sm"><span>Cancel</span></button>
              <button id="edu-annotate-submit" type="button" class="ant-btn ant-btn-primary ant-btn-sm"><span>Submit</span></button>
            </div>
            
            </div></div></div></div>
            `

          container.style.position = 'absolute'
          container.style.width = '100%'
          container.style.top = `${e.clientY}px`
          container.style.left = `${e.clientX}px`
          container.addEventListener('blur', handleInputBlur)
          container.addEventListener('keyup', handleInputKeyup)
          document.body.appendChild(container)

          var cancel = document.getElementById('edu-annotate-cancel')
          cancel.addEventListener('click', closeInput)

          var submit = document.getElementById('edu-annotate-submit')
          submit.addEventListener('click', saveVideo)

          input = document.getElementById('video-edit-input')
          input.addEventListener('keyup', handleChangeInput)

          input.focus()
        }
        /**
         * Handle input.keyup event
         */
        function handleChangeInput() {
          var videoInput = document.getElementById('video-edit-input')
          var videoView = document.getElementById('edu-annoate-video-view')
          var value = videoInput.value

          if (value) {
            var youtubeId = getYoutubeId(value)
            if (youtubeId) {
              var videoContent =
                '<iframe width="560" height="315" src="//www.youtube.com/embed/' +
                youtubeId +
                '?rel=0" frameborder="0" allowfullscreen></iframe>'
              videoView.innerHTML = videoContent
            } else {
              videoView.innerHTML = ''
            }
          } else {
            videoView.innerHTML = ''
          }
        }

        /**
         * Handle input.blur event
         */
        function handleInputBlur() {
          saveVideo()
        }
        /**
         * Handle input.keyup event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleInputKeyup(e) {
          if (e.keyCode === 27) {
            closeInput()
          } else if (e.keyCode === 13) {
            saveVideo()
          }
        }
        /**
         * Save a new video annotation from input
         */
        function saveVideo() {
          if (input.value.trim().length > 0) {
            var _ret = (function () {
              var content = input.value.trim()
              if (!content) {
                return {
                  v: void 0,
                }
              }
              var youtubeId = getYoutubeId(content)

              if (!youtubeId) {
                return {
                  v: void 0,
                }
              }

              var videoContent =
                '<iframe width="560" height="315" src="//www.youtube.com/embed/' +
                youtubeId +
                '?rel=0" frameborder="0" allowfullscreen></iframe>'

              var clientX = parseInt(container.style.left, 10)
              var clientY = parseInt(container.style.top, 10)
              var svg = (0, _utils.findSVGAtPoint)(clientX, clientY)
              if (!svg) {
                return {
                  v: void 0,
                }
              }
              var rect = svg.getBoundingClientRect()
              var _getMetadata = (0, _utils.getMetadata)(svg)
              var documentId = _getMetadata.documentId
              var pageNumber = _getMetadata.pageNumber
              var annotation = Object.assign(
                {
                  type: 'video',
                },
                (0, _utils.scaleDown)(svg, {
                  x: clientX - rect.left,
                  y: clientY - rect.top,
                })
              )
              _PDFJSAnnotate2.default
                .getStoreAdapter()
                .addAnnotation(documentId, pageNumber, annotation)
                .then((annotation) => {
                  _PDFJSAnnotate2.default
                    .getStoreAdapter()
                    .addVideo(documentId, annotation.uuid, videoContent)
                  ;(0, _appendChild2.default)(svg, annotation)
                })
            })()
            if (
              (typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) ===
              'object'
            )
              return _ret.v
          }
          closeInput()
        }
        /**
         * Close the input element
         */
        function closeInput() {
          if (container) {
            container.removeEventListener('blur', handleInputBlur)
            container.removeEventListener('keyup', handleInputKeyup)
            document.body.removeChild(container)
            container = null
            input = null
          }
        }
        /**
         * Enable video annotation behavior
         */
        function enableVideoPoint() {
          if (_enabledVideo) {
            return
          }
          _enabledVideo = true
          document.addEventListener('mouseup', handleDocumentMouseup)
        }
        /**
         * Disable video annotation behavior
         */
        function disableVideoPoint() {
          if (!_enabledVideo) {
            return
          }
          _enabledVideo = false
          document.removeEventListener('mouseup', handleDocumentMouseup)
        }
        /** */
      },
      /* 37  SVG for image tool */
      /** */ function (module, exports, __webpack_require__) {
        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.default = renderPoint
        var _setAttributes = __webpack_require__(14)
        var _setAttributes2 = _interopRequireDefault(_setAttributes)
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }
        var SIZE = 25
        var imageSvg = `<svg class="svg-icon" data-annotate-type="image" width="25" height="25">
          <rect id="svg_6" height="25.20663" width="25.24921" y="-0.05995" x="-0.12507" stroke-opacity="0" stroke-width="null" stroke="#E53F61" fill="#E53F61"/>
          <g stroke="null" id="svg_7">
          <g stroke="null" id="svg_2">
            <path stroke="#ffffff" stroke-width="0.5" id="svg_3" fill="#ffffff" d="m18.80868,6.76499l-12.61736,0a1.72059,1.72059 0 0 0 -1.72059,1.72059l0,8.02884a1.72059,1.72059 0 0 0 1.72059,1.72059l12.61736,0a1.72059,1.72059 0 0 0 1.72059,-1.72059l0,-8.02884a1.72059,1.72059 0 0 0 -1.72059,-1.72059zm0.57324,6.645l-3.60912,-3.60912a0.57324,0.57324 0 0 0 -0.8106,0l-4.75647,4.75561l-1.88511,-1.88511a0.57324,0.57324 0 0 0 -0.8106,0l-1.88511,1.88511l0,-6.0709a0.57324,0.57324 0 0 1 0.57324,-0.57324l12.61051,0a0.57324,0.57324 0 0 1 0.57324,0.57324l0,4.92441z"/>
          </g>
          <g stroke="null" id="svg_4">
            <circle stroke="#ffffff" stroke-width="0.5" id="svg_5" fill="#ffffff" r="1.72059" cy="10.77941" cx="9.6325"/>
          </g>
          </g>
        </svg>`

        function renderPoint(a) {
          var div = document.createElement('div')
          div.innerHTML = imageSvg.trim()

          div.firstChild.setAttribute('x', a.x)
          div.firstChild.setAttribute('y', a.y)
          div.firstChild.setAttribute('stroke-width', 1)
          div.firstChild.setAttribute('stroke', 'red')

          return div.firstChild
        }
        module.exports = exports.default
        /** */
      },
      /* 38  Image Tool */
      /** */
      function (module, exports, __webpack_require__) {
        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function (obj) {
                return typeof obj
              }
            : function (obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol
                  ? 'symbol'
                  : typeof obj
              }
        exports.enableImagePoint = enableImagePoint
        exports.disableImagePoint = disableImagePoint
        var _PDFJSAnnotate = __webpack_require__(1)
        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)
        var _appendChild = __webpack_require__(11)
        var _appendChild2 = _interopRequireDefault(_appendChild)
        var _utils = __webpack_require__(6)
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }
        var _enabledImage = false
        var input = void 0
        var container = void 0

        /**
         * Handle document.mouseup event
         *
         * @param {Event} The DOM event to be handled
         */
        function handleDocumentMouseup(e) {
          if (input || !(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
            return
          }

          container = document.createElement('DIV')
          container.innerHTML = `
            <div class="ant-popover ant-popconfirm ant-popover-placement-topRight ">
              <div class="ant-popover-content">
              <div class="ant-popover-arrow">
              <span class="ant-popover-arrow-content"></span>
            </div>
            
            <div class="ant-popover-inner" role="tooltip">
              <div class="ant-popover-inner-content">
            <div class="ant-popover-message">
            <input id="pdf-annotate-point-input" type="file" name="input-name" style="display: none;" />
              <h6 id="edu-annotate-upload-label"></h6>
            </div>
            
            <div class="ant-popover-buttons">
              <button id="edu-annotate-cancel" type="button" class="ant-btn ant-btn-sm"><span>Cancel</span></button>
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif"  id="BtnBrowseHidden" name="files" style="display: none;" />
                <label class="ant-btn ant-btn-primary ant-btn-sm" for="BtnBrowseHidden" id="EduBrowse">
                Upload
              </label>
            </div>
            
            </div></div></div></div>
      `

          container.style.position = 'absolute'
          container.style.width = '100%'
          container.style.top = `${e.clientY}px`
          container.style.left = `${e.clientX}px`
          container.addEventListener('blur', handleInputBlur)
          container.addEventListener('keyup', handleInputKeyup)
          document.body.appendChild(container)

          var cancel = document.getElementById('edu-annotate-cancel')
          cancel.addEventListener('click', closeInput)

          var upload = document.getElementById('BtnBrowseHidden')
          upload.addEventListener('change', handleFileChange)

          input = document.getElementById('pdf-annotate-point-input')
          input.focus()
        }

        function handleFileChange() {
          var upload = document.getElementById('BtnBrowseHidden')
          var header = document.getElementById('edu-annotate-upload-label')
          var file = upload?.files?.[0]
          if (file) {
            if (!allowedImageFileTypes.includes(file.type)) {
              notification({ messageKey: 'imageTypeError' })
              return false
            }
            header.innerText = file.name
            uploadToS3(file, aws.s3Folders.DEFAULT)
              .then((fileUri) => savePoint(fileUri))
              .catch(() => {
                console.log('Some Error Occured while uploading the file ')
              })
          }
        }

        /**
         * Handle input.blur event
         */
        function handleInputBlur() {
          savePoint()
        }
        /**
         * Handle input.keyup event
         *
         * @param {Event} e The DOM event to handle
         */
        function handleInputKeyup(e) {
          if (e.keyCode === 27) {
            closeInput()
          } else if (e.keyCode === 13) {
            savePoint()
          }
        }
        /**
         * Save a new point annotation from input
         */
        function savePoint(url) {
          if (url) {
            var _ret = (function () {
              var clientX = parseInt(container.style.left, 10)
              var clientY = parseInt(container.style.top, 10)
              var content = url
              var svg = (0, _utils.findSVGAtPoint)(clientX, clientY)
              if (!svg) {
                return {
                  v: void 0,
                }
              }
              var rect = svg.getBoundingClientRect()
              var _getMetadata = (0, _utils.getMetadata)(svg)
              var documentId = _getMetadata.documentId
              var pageNumber = _getMetadata.pageNumber
              var annotation = Object.assign(
                {
                  type: 'image',
                },
                (0, _utils.scaleDown)(svg, {
                  x: clientX - rect.left,
                  y: clientY - rect.top,
                })
              )
              _PDFJSAnnotate2.default
                .getStoreAdapter()
                .addAnnotation(documentId, pageNumber, annotation)
                .then((annotation) => {
                  _PDFJSAnnotate2.default
                    .getStoreAdapter()
                    .addImage(documentId, annotation.uuid, content)
                  ;(0, _appendChild2.default)(svg, annotation)
                })
            })()
            if (
              (typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) ===
              'object'
            )
              return _ret.v
          }
          closeInput()
        }
        /**
         * Close the input element
         */
        function closeInput() {
          if (container) {
            container.removeEventListener('blur', handleInputBlur)
            container.removeEventListener('keyup', handleInputKeyup)
            document.body.removeChild(container)
            container = null
            input = null
          }
        }
        /**
         * Enable point annotation behavior
         */
        function enableImagePoint() {
          if (_enabledImage) {
            return
          }
          _enabledImage = true
          document.addEventListener('mouseup', handleDocumentMouseup)
        }
        /**
         * Disable point annotation behavior
         */
        function disableImagePoint() {
          if (!_enabledImage) {
            return
          }
          _enabledImage = false
          document.removeEventListener('mouseup', handleDocumentMouseup)
        }
        /** */
      },
      /* 39 Here is the update  */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        var _slicedToArray = (function () {
          function sliceIterator(arr, i) {
            var _arr = []
            var _n = true
            var _d = false
            var _e = undefined
            try {
              for (
                var _i = arr[Symbol.iterator](), _s;
                !(_n = (_s = _i.next()).done);
                _n = true
              ) {
                _arr.push(_s.value)
                if (i && _arr.length === i) break
              }
            } catch (err) {
              _d = true
              _e = err
            } finally {
              try {
                if (!_n && _i['return']) _i['return']()
              } finally {
                if (_d) throw _e
              }
            }
            return _arr
          }
          return function (arr, i) {
            if (Array.isArray(arr)) {
              return arr
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i)
            } else {
              throw new TypeError(
                'Invalid attempt to destructure non-iterable instance'
              )
            }
          }
        })()

        exports.enableUpdate = enableUpdate
        exports.disableUpdate = disableUpdate

        var _PDFJSAnnotate = __webpack_require__(1)

        var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate)

        var _appendChild = __webpack_require__(11)

        var _appendChild2 = _interopRequireDefault(_appendChild)

        var _event = __webpack_require__(4)

        var _utils = __webpack_require__(6)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        function _toConsumableArray(arr) {
          if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
              arr2[i] = arr[i]
            }
            return arr2
          } else {
            return Array.from(arr)
          }
        }

        var _enabledUpdate = false
        var isDragging = false,
          overlay = void 0
        var dragOffsetX = void 0,
          dragOffsetY = void 0,
          dragStartX = void 0,
          dragStartY = void 0
        var OVERLAY_BORDER_SIZE = 3
        var editMode = false

        /**
         * Create an overlay for editing an annotation.
         *
         * @param {Element} target The annotation element to apply overlay for
         */

        // ------------------------ Video edit start ------------------------------------------ //
        function createVideoUpdateOverlay(target) {
          destroyVideoUpdateOverlay()

          var svg = target.parentElement
          var annotationId = target.getAttribute('data-target-id')

          var _getMetadata2 = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata2.documentId
          var annotationId = target.getAttribute('data-pdf-annotate-id')
          var isEditable = target.getAttribute('data-view-mode') === 'edit'

          var videoContent = void 0

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .getVideos(documentId, annotationId)
            .then(function (annotation) {
              videoContent = annotation.filter(function (x) {
                return x.annotation === annotationId
              })[0]?.content

              overlay = document.createElement('div')
              var parentNode = (0, _utils.findSVGContainer)(target).parentNode
              var rect = (0, _utils.getAnnotationRect)(target)
              var styleLeft = rect.left - OVERLAY_BORDER_SIZE
              var styleTop = rect.top + OVERLAY_BORDER_SIZE + 24

              overlay.setAttribute('id', 'pdf-annotate-update-overlay')
              overlay.setAttribute('data-target-id', annotationId)
              overlay.style.boxSizing = 'content-box'
              overlay.style.position = 'absolute'
              overlay.style.top = styleTop + 'px'
              overlay.style.left = styleLeft + 'px'
              overlay.style.width = '100%'
              overlay.style.minWidth = '200px'
              overlay.style.maxWidth = '480px'

              overlay.style.background = '#fff'

              var editVideoInput = `
              <div id="edu-edit-annotate-video" style="padding-top: 12px;">
                <span>Copy and paste the video embed code<a href="https://support.google.com/youtube/answer/171780?hl=en" target="_blank">Help</a>:</span>
                <br/>
                <input id="video-edit-input" type="url" placeholder="Paste video embed code here" type="text" class="ant-input" value='${videoContent}' style="width: calc(100% - 70px);margin-top: 12px;">
                <button id="edu-annotate-edit-video" class="ant-btn ant-btn-primary">Save</button>
                <br/>
              </div>`

              overlay.innerHTML = `
              <div class="ant-modal-content" style="border-radius: 10px; overflow: hidden">
              <button id="edu-annotate-close" type="button" aria-label="Close" class="ant-modal-close">
                <span class="ant-modal-close-x">
                  <span role="img" aria-label="close" class="anticon anticon-close ant-modal-close-icon">
                    <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" fill="#434B5D">
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                    </svg>
                  </span>
                </span>
              </button>
              
              <div class="ant-modal-header" style="height: 30px; border: none;">
                <br/>
              </div>
              <div class="ant-modal-body">
                <div id="edu-annoate-video-view">${videoContent}</div>
                ${isEditable ? editVideoInput : ''}
              </div>
              </div>
              `

              parentNode.appendChild(overlay)

              var closeBtn = document.getElementById('edu-annotate-close')
              closeBtn.addEventListener('click', destroyVideoUpdateOverlay)

              if (isEditable) {
                var videoInput = document.getElementById('video-edit-input')
                var saveBtn = document.getElementById('edu-annotate-edit-video')
                videoInput.addEventListener('keyup', handleChangeVideoInput)
                videoInput.addEventListener('change', handleChangeVideoInput)
                saveBtn.addEventListener('click', () =>
                  handleUpdateVideo(annotation[0], documentId)
                )
              }

              document.addEventListener('click', handleDocumentClick)
              document.addEventListener('keyup', handleDocumentKeyup)
              document.addEventListener('mousedown', handleDocumentMousedown)
            })
        }

        function handleChangeVideoInput() {
          var videoInput = document.getElementById('video-edit-input')
          var videoView = document.getElementById('edu-annoate-video-view')

          var value = videoInput.value
          if (value) {
            var youtubeId = getYoutubeId(value)
            if (youtubeId) {
              var updatedContent =
                '<iframe width="560" height="315" src="//www.youtube.com/embed/' +
                youtubeId +
                '?rel=0" frameborder="0" allowfullscreen></iframe>'
              videoView.innerHTML = updatedContent
            } else {
              videoView.innerHTML = ''
            }
          } else {
            videoView.innerHTML = ''
          }
        }

        function handleUpdateVideo(annotation, documentId) {
          var videoInput = document.getElementById('video-edit-input')
          var updatedValue = videoInput.value
          if (updatedValue && annotation) {
            var youtubeId = getYoutubeId(updatedValue)
            if (youtubeId) {
              var updatedContent =
                '<iframe width="560" height="315" src="//www.youtube.com/embed/' +
                youtubeId +
                '?rel=0" frameborder="0" allowfullscreen></iframe>'

              var updatedAnnotation = {
                ...annotation,
                content: updatedContent,
              }

              _PDFJSAnnotate2.default
                .getStoreAdapter()
                .editAnnotation(documentId, annotation.uuid, updatedAnnotation)
            }
          }
        }

        function destroyVideoUpdateOverlay() {
          if (overlay) {
            overlay.parentNode.removeChild(overlay)
            overlay = null
          }

          document.removeEventListener('click', handleDocumentClick)
          document.removeEventListener('keyup', handleDocumentKeyup)
          document.removeEventListener('mousedown', handleDocumentMousedown)
          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.enableUserSelect)()
        }

        // ------------------------ Image edit start ------------------------------------------ //
        function createImageUpdateOverlay(target) {
          destroyImageUpdateOverlay()

          var svg = target.parentElement
          var annotationId = target.getAttribute('data-target-id')

          var _getMetadata2 = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata2.documentId
          var annotationId = target.getAttribute('data-pdf-annotate-id')
          var isEditable = target.getAttribute('data-view-mode') === 'edit'

          var imageContent = void 0

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .getImages(documentId, annotationId)
            .then(function (annotation) {
              imageContent = annotation.filter(function (x) {
                return x.annotation === annotationId
              })[0].content

              overlay = document.createElement('div')
              var parentNode = (0, _utils.findSVGContainer)(target).parentNode
              var rect = (0, _utils.getAnnotationRect)(target)
              var styleLeft = rect.left - OVERLAY_BORDER_SIZE
              var styleTop = rect.top + OVERLAY_BORDER_SIZE + 24

              overlay.setAttribute('id', 'pdf-annotate-update-overlay')
              overlay.setAttribute('data-target-id', annotationId)
              overlay.style.boxSizing = 'content-box'
              overlay.style.position = 'absolute'
              overlay.style.top = styleTop + 'px'
              overlay.style.left = styleLeft + 'px'
              overlay.style.minWidth = '200px'

              overlay.style.background = '#fff'

              var footerControls = `
              <div class="ant-modal-footer" style="border: none; padding: 0 10px 10px 0">
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif"  id="BtnReplaceImageHidden" name="files" style="display: none;" />
                <label class="ant-btn ant-btn-primary ant-btn-sm" for="BtnReplaceImageHidden" id="edu-replace-image">
                  Replace Image
                </label>
              </div>
            `

              overlay.innerHTML = `
              <div class="ant-modal-content" style="border-radius: 10px; overflow: hidden">
              <button id="edu-annotate-close" type="button" aria-label="Close" class="ant-modal-close">
                <span class="ant-modal-close-x" style="height: 30px;", width: 30x; line-height: 30px;>
                  <span role="img" aria-label="close" class="anticon anticon-close ant-modal-close-icon">
                    <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                    </svg>
                  </span>
                </span>
              </button>
              <div class="ant-modal-header" style="height: 30px; border: none;">
                <br/>
              </div>
                <div class="ant-modal-body">
                  <img id="edu-pdf-image-view" style="max-width: 400px; max-height: 300px; width: 100%;" src="${imageContent}"/>
                </div>
                ${isEditable ? footerControls : ''}
              </div>
              `

              parentNode.appendChild(overlay)

              var closeBtn = document.getElementById('edu-annotate-close')
              closeBtn.addEventListener('click', destroyImageUpdateOverlay)

              if (isEditable) {
                var upload = document.getElementById('BtnReplaceImageHidden')
                upload.addEventListener('change', () =>
                  handleImageChange(annotation[0], documentId)
                )
              }

              document.addEventListener('click', handleDocumentClick)
              document.addEventListener('keyup', handleDocumentKeyup)
              document.addEventListener('mousedown', handleDocumentMousedown)
            })
        }

        function handleImageChange(annotation, documentId) {
          var upload = document.getElementById('BtnReplaceImageHidden')
          var image = document.getElementById('edu-pdf-image-view')
          var file = upload?.files?.[0]
          if (file) {
            if (!allowedImageFileTypes.includes(file.type)) {
              notification({ messageKey: 'imageTypeError' })
              return false
            }
            uploadToS3(file, aws.s3Folders.DEFAULT)
              .then((fileUri) => {
                if (image) {
                  image.setAttribute('src', fileUri)
                  if (annotation) {
                    var updatedAnnotation = {
                      ...annotation,
                      content: fileUri,
                    }
                    _PDFJSAnnotate2.default
                      .getStoreAdapter()
                      .editAnnotation(
                        documentId,
                        annotation.uuid,
                        updatedAnnotation
                      )
                  }
                }
              })
              .catch(() => {
                console.log('Some Error Occured while uploading the file ')
              })
          }
        }

        function destroyImageUpdateOverlay() {
          if (overlay) {
            overlay.parentNode.removeChild(overlay)
            overlay = null
          }

          document.removeEventListener('click', handleDocumentClick)
          document.removeEventListener('keyup', handleDocumentKeyup)
          document.removeEventListener('mousedown', handleDocumentMousedown)
          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.enableUserSelect)()
        }
        // ------------------------ Image EDIT END ------------------------------------------ //

        // ------------------------ Comment edit start ------------------------------------------ //
        function createCommentUpdateOverlay(target) {
          destroyCommentUpdateOverlay()

          var svg = target.parentElement
          var _getMetadata2 = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata2.documentId
          var annotationId = target.getAttribute('data-pdf-annotate-id')

          var isEditable = target.getAttribute('data-view-mode') === 'edit'

          var commentContent = void 0

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .getComments(documentId, annotationId)
            .then(function (annotation) {
              commentContent = annotation.filter(function (x) {
                return x.annotation === annotationId
              })[0].content

              overlay = document.createElement('div')
              var parentNode = (0, _utils.findSVGContainer)(target).parentNode
              var rect = (0, _utils.getAnnotationRect)(target)
              var styleLeft = rect.left - OVERLAY_BORDER_SIZE
              var styleTop = rect.top + OVERLAY_BORDER_SIZE + 24

              overlay.setAttribute('id', 'pdf-annotate-update-overlay')
              overlay.setAttribute('data-target-id', annotationId)
              overlay.style.boxSizing = 'content-box'
              overlay.style.position = 'absolute'
              overlay.style.top = styleTop + 'px'
              overlay.style.left = styleLeft + 'px'
              overlay.style.width = '300px'

              overlay.style.background = '#fff'

              overlay.innerHTML = `
              <div class="ant-modal-content" style="border-radius: 10px; overflow: hidden">
              <button id="edu-annotate-close" type="button" aria-label="Close" class="ant-modal-close">
                <span class="ant-modal-close-x" style="height: 30px;", width: 30x; line-height: 30px;>
                  <span role="img" aria-label="close" class="anticon anticon-close ant-modal-close-icon">
                    <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                    </svg>
                  </span>
                </span>
              </button>
              
              <div class="ant-modal-header" style="height: 30px; border: none;">
                <br/>
              </div>
                <div class="ant-modal-body">
                ${
                  isEditable
                    ? `<textarea id="edu-annotate-commen-edit-box" style="color: #000;" rows="5" class="ant-input">${commentContent}</textarea>`
                    : `<textarea style="color: #000;" rows="5" class="ant-input" disabled>${commentContent}</textarea>`
                }
                </div>
                <div class="ant-modal-footer" style="border: none; padding: 0 10px 10px 0">
                  <span>
                  ${
                    isEditable
                      ? `<button id="edu-annotate-edit" class="ant-btn ant-btn-primary">Save</button>`
                      : ''
                  }
                  </span>
                </div>
              </div>
              `

              parentNode.appendChild(overlay)

              var closeBtn = document.getElementById('edu-annotate-close')
              closeBtn.addEventListener('click', destroyCommentUpdateOverlay)

              if (isEditable) {
                var editBtn = document.getElementById('edu-annotate-edit')
                editBtn.addEventListener('click', () =>
                  updateComment(annotation, documentId)
                )
              }

              document.addEventListener('click', handleDocumentClick)
              document.addEventListener('keyup', handleDocumentKeyup)
              document.addEventListener('mousedown', handleDocumentMousedown)
            })
        }

        function updateComment(annotations = [], documentId) {
          var commentBox = document.getElementById(
            'edu-annotate-commen-edit-box'
          )
          var comment = commentBox.value
          var annotation = annotations[0]
          if (annotation) {
            var updatedAnnotation = {
              ...annotation,
              content: comment,
            }
            _PDFJSAnnotate2.default
              .getStoreAdapter()
              .editAnnotation(documentId, annotation.uuid, updatedAnnotation)
          }
          destroyCommentUpdateOverlay()
        }

        function destroyCommentUpdateOverlay() {
          disableEdit()
          if (overlay) {
            overlay.parentNode.removeChild(overlay)
            overlay = null
          }

          document.removeEventListener('click', handleDocumentClick)
          document.removeEventListener('keyup', handleDocumentKeyup)
          document.removeEventListener('mousedown', handleDocumentMousedown)
          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.enableUserSelect)()
        }
        // ------------------------ Comment edit end ------------------------------------------ //

        // ------------------------ textBox edit start ------------------------------------------ //
        function createTextBoxUpdateOverlay(target) {
          destroyTextBoxUpdateOverlay()

          var isEditable = target.getAttribute('data-view-mode') === 'edit'
          // show edit modal only authoring mode
          if (!isEditable) {
            return
          }

          var svg = target.parentElement
          var _getMetadata2 = (0, _utils.getMetadata)(svg)
          var documentId = _getMetadata2.documentId
          var annotationId = target.getAttribute('data-pdf-annotate-id')

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .getAnnotation(documentId, annotationId)
            .then(function (annotation) {
              overlay = document.createElement('div')
              var parentNode = (0, _utils.findSVGContainer)(target).parentNode
              var rect = (0, _utils.getAnnotationRect)(target)
              var styleLeft = rect.left - OVERLAY_BORDER_SIZE
              var styleTop = rect.top + OVERLAY_BORDER_SIZE + 24
              var conent = annotation.content

              overlay.setAttribute('id', 'pdf-annotate-update-overlay')
              overlay.setAttribute('data-target-id', annotationId)
              overlay.style.boxSizing = 'content-box'
              overlay.style.position = 'absolute'
              overlay.style.top = styleTop + 'px'
              overlay.style.left = styleLeft + 'px'
              overlay.style.width = '300px'
              overlay.style.background = '#fff'

              overlay.innerHTML = `
              <div class="ant-modal-content" style="border-radius: 10px; overflow: hidden">
              <button id="edu-annotate-close" type="button" aria-label="Close" class="ant-modal-close">
                <span class="ant-modal-close-x" style="height: 30px;", width: 30x; line-height: 30px;>
                  <span role="img" aria-label="close" class="anticon anticon-close ant-modal-close-icon">
                    <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                    </svg>
                  </span>
                </span>
              </button>
              <div class="ant-modal-header" style="height: 30px; border: none;"><br/></div>
                <div class="ant-modal-body">
                ${`<textarea id="edu-annotate-text-edit-box" style="color: #000;" rows="5" class="ant-input">${conent}</textarea>`}
                </div>
                <div class="ant-modal-footer" style="border: none; padding: 0 10px 10px 0">
                  <button id="edu-annotate-edit" class="ant-btn ant-btn-primary">Save</button>
                </div>
              </div>
              `
              parentNode.appendChild(overlay)

              var closeBtn = document.getElementById('edu-annotate-close')
              closeBtn.addEventListener('click', destroyTextBoxUpdateOverlay)
              var editBtn = document.getElementById('edu-annotate-edit')
              editBtn.addEventListener('click', () =>
                updatedTextBox(annotation, documentId)
              )
              document.addEventListener('click', handleDocumentClick)
              document.addEventListener('keyup', handleDocumentKeyup)
              document.addEventListener('mousedown', handleDocumentMousedown)
            })
        }

        function destroyTextBoxUpdateOverlay() {
          disableEdit()
          if (overlay) {
            overlay.parentNode.removeChild(overlay)
            overlay = null
          }

          document.removeEventListener('click', handleDocumentClick)
          document.removeEventListener('keyup', handleDocumentKeyup)
          document.removeEventListener('mousedown', handleDocumentMousedown)
          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.enableUserSelect)()
        }

        function updatedTextBox(annotation, documentId) {
          var textBox = document.getElementById('edu-annotate-text-edit-box')
          var updatedCconent = textBox.value

          if (annotation) {
            var updatedAnnotation = {
              ...annotation,
              content: updatedCconent,
            }
            _PDFJSAnnotate2.default
              .getStoreAdapter()
              .editAnnotation(documentId, annotation.uuid, updatedAnnotation)
          }
          destroyTextBoxUpdateOverlay()
        }
        // ------------------------ textBox edit end ------------------------------------------ //

        function enableEdit() {
          editMode = true
        }

        function disableEdit() {
          editMode = false
        }

        /**
         * Delete currently selected annotation
         */
        function deleteAnnotation() {
          if (!overlay) {
            return
          }

          var annotationId = overlay.getAttribute('data-target-id')
          var nodes = document.querySelectorAll(
            '[data-pdf-annotate-id="' + annotationId + '"]'
          )
          var svg = overlay.parentNode.querySelector('svg.annotationLayer')

          var _getMetadata = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata.documentId

          ;[].concat(_toConsumableArray(nodes)).forEach(function (n) {
            n.parentNode.removeChild(n)
          })

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .deleteAnnotation(documentId, annotationId)

          destroyVideoUpdateOverlay()
        }

        /**
         * Handle document.click event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentClick(e) {
          if (!(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
            return
          }

          // Remove current overlay
          var overlay = document.getElementById('pdf-annotate-edit-overlay')
          if (overlay) {
            if (isDragging || e.target === overlay) {
              return
            }

            destroyVideoUpdateOverlay()
          }
        }

        /**
         * Handle document.keyup event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentKeyup(e) {
          if (
            overlay &&
            e.keyCode === 46 &&
            e.target.nodeName.toLowerCase() !== 'textarea' &&
            e.target.nodeName.toLowerCase() !== 'input'
          ) {
            deleteAnnotation()
          }
        }

        /**
         * Handle document.mousedown event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentMousedown(e) {
          if (e.target !== overlay) {
            return
          }

          // Highlight and strikeout annotations are bound to text within the document.
          // It doesn't make sense to allow repositioning these types of annotations.
          var annotationId = overlay.getAttribute('data-target-id')
          var target = document.querySelector(
            '[data-pdf-annotate-id="' + annotationId + '"]'
          )
          var type = target.getAttribute('data-pdf-annotate-type')

          if (type === 'highlight' || type === 'strikeout') {
            return
          }

          isDragging = true
          dragOffsetX = e.clientX
          dragOffsetY = e.clientY
          dragStartX = overlay.offsetLeft
          dragStartY = overlay.offsetTop

          overlay.style.background = 'rgba(255, 255, 255, 0.7)'
          overlay.style.cursor = 'move'
          overlay.querySelector('a').style.display = 'none'

          document.addEventListener('mousemove', handleDocumentMousemove)
          document.addEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.disableUserSelect)()
        }

        /**
         * Handle document.mousemove event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentMousemove(e) {
          var annotationId = overlay.getAttribute('data-target-id')
          var parentNode = overlay.parentNode
          var rect = parentNode.getBoundingClientRect()
          var y = dragStartY + (e.clientY - dragOffsetY)
          var x = dragStartX + (e.clientX - dragOffsetX)
          var minY = 0
          var maxY = rect.height
          var minX = 0
          var maxX = rect.width

          if (y > minY && y + overlay.offsetHeight < maxY) {
            overlay.style.top = y + 'px'
          }

          if (x > minX && x + overlay.offsetWidth < maxX) {
            overlay.style.left = x + 'px'
          }
        }

        /**
         * Handle document.mouseup event
         *
         * @param {Event} e The DOM event that needs to be handled
         */
        function handleDocumentMouseup(e) {
          var annotationId = overlay.getAttribute('data-target-id')
          var target = document.querySelectorAll(
            '[data-pdf-annotate-id="' + annotationId + '"]'
          )
          var type = target[0].getAttribute('data-pdf-annotate-type')
          var svg = overlay.parentNode.querySelector('svg.annotationLayer')

          var _getMetadata2 = (0, _utils.getMetadata)(svg)

          var documentId = _getMetadata2.documentId

          overlay.querySelector('a').style.display = ''

          function getDelta(propX, propY) {
            return calcDelta(
              parseInt(target[0].getAttribute(propX), 10),
              parseInt(target[0].getAttribute(propY), 10)
            )
          }

          function calcDelta(x, y) {
            return {
              deltaX:
                OVERLAY_BORDER_SIZE +
                (0, _utils.scaleDown)(svg, { x: overlay.offsetLeft }).x -
                x,
              deltaY:
                OVERLAY_BORDER_SIZE +
                (0, _utils.scaleDown)(svg, { y: overlay.offsetTop }).y -
                y,
            }
          }

          _PDFJSAnnotate2.default
            .getStoreAdapter()
            .getAnnotation(documentId, annotationId)
            .then(function (annotation) {
              if (
                [
                  'area',
                  'highlight',
                  'point',
                  'textbox',
                  'video',
                  'image',
                  'mask',
                ].indexOf(type) > -1
              ) {
                ;(function () {
                  var _getDelta = getDelta('x', 'y')

                  var deltaX = _getDelta.deltaX
                  var deltaY = _getDelta.deltaY

                  ;[]
                    .concat(_toConsumableArray(target))
                    .forEach(function (t, i) {
                      if (deltaY !== 0) {
                        var modelY = parseInt(t.getAttribute('y'), 10) + deltaY
                        var viewY = modelY

                        if (type === 'textbox') {
                          viewY += annotation.size
                        }

                        if (type === 'point') {
                          viewY = (0, _utils.scaleUp)(svg, { viewY: viewY })
                            .viewY
                        }

                        t.setAttribute('y', viewY)
                        if (annotation.rectangles) {
                          annotation.rectangles[i].y = modelY
                        } else if (annotation.y) {
                          annotation.y = modelY
                        }
                      }
                      if (deltaX !== 0) {
                        var modelX = parseInt(t.getAttribute('x'), 10) + deltaX
                        var viewX = modelX

                        if (type === 'point') {
                          viewX = (0, _utils.scaleUp)(svg, { viewX: viewX })
                            .viewX
                        }

                        t.setAttribute('x', viewX)
                        if (annotation.rectangles) {
                          annotation.rectangles[i].x = modelX
                        } else if (annotation.x) {
                          annotation.x = modelX
                        }
                      }
                    })
                })()
              } else if (type === 'drawing') {
                ;(function () {
                  var rect = (0, _utils.scaleDown)(
                    svg,
                    (0, _utils.getAnnotationRect)(target[0])
                  )

                  var _annotation$lines$ = _slicedToArray(
                    annotation.lines[0],
                    2
                  )

                  var originX = _annotation$lines$[0]
                  var originY = _annotation$lines$[1]

                  var _calcDelta = calcDelta(originX, originY)

                  var deltaX = _calcDelta.deltaX
                  var deltaY = _calcDelta.deltaY

                  // origin isn't necessarily at 0/0 in relation to overlay x/y
                  // adjust the difference between overlay and drawing coords

                  deltaY += originY - rect.top
                  deltaX += originX - rect.left

                  annotation.lines.forEach(function (line, i) {
                    var _annotation$lines$i = _slicedToArray(
                      annotation.lines[i],
                      2
                    )

                    var x = _annotation$lines$i[0]
                    var y = _annotation$lines$i[1]

                    annotation.lines[i][0] = x + deltaX
                    annotation.lines[i][1] = y + deltaY
                  })

                  target[0].parentNode.removeChild(target[0])
                  ;(0, _appendChild2.default)(svg, annotation)
                })()
              }

              _PDFJSAnnotate2.default
                .getStoreAdapter()
                .editAnnotation(documentId, annotationId, annotation)
            })

          setTimeout(function () {
            isDragging = false
          }, 0)

          overlay.style.background = ''
          overlay.style.cursor = ''

          document.removeEventListener('mousemove', handleDocumentMousemove)
          document.removeEventListener('mouseup', handleDocumentMouseup)
          ;(0, _utils.enableUserSelect)()
        }

        function destroyAllOverlay() {
          destroyVideoUpdateOverlay()
          destroyImageUpdateOverlay()
          destroyCommentUpdateOverlay()
          destroyTextBoxUpdateOverlay()
        }

        function handleAnnotationUpdateClick(target) {
          switch (target.getAttribute('data-annotate-type')) {
            case 'comment':
              createCommentUpdateOverlay(target)
              break
            case 'image':
              createImageUpdateOverlay(target)
              break
            case 'video':
              createVideoUpdateOverlay(target)
              break
            case 'textBox':
              createTextBoxUpdateOverlay(target)
              break
            default:
              destroyAllOverlay()
              break
          }
        }

        function enableUpdate() {
          if (_enabledUpdate) {
            return
          }

          _enabledUpdate = true
          ;(0, _event.addEventListener)(
            'annotation:click',
            handleAnnotationUpdateClick
          )
        }

        /**
         * Disable edit mode behavior.
         */
        function disableUpdate() {
          destroyVideoUpdateOverlay()

          if (!_enabledUpdate) {
            return
          }

          _enabledUpdate = false
          ;(0, _event.removeEventListener)(
            'annotation:click',
            handleAnnotationUpdateClick
          )
        }

        /***/
      },
      /******/
    ]
  )
})
//# sourceMappingURL=pdf-annotate.js.map
/**
 * 1 - pdfAnnotate
2 - StoreAdapter
3 - _abstractFunction
4 - _event
5 - _events
6 - _utils
7 - _createStylesheet
8 - LocalStoreAdapter
10 - render

11 - appendChild
12 - _objectAssign
13 - _renderLine
14 - _setAttributes
15 - _normalizeColor
16 - _renderPath
17 - _renderPoint - SVG for comment tool
18 - _renderRect
19 - _renderText
20 - _renderScreenReaderHints

21 - insertScreenReaderHint
22 - _createScreenReaderOnly
23 - _insertElementWithinChildren
24 - _insertElementWithinElement
25 - _renderScreenReaderComments
26 - _insertScreenReaderComment
27 - initEventHandlers
28 - UI
29 - _edit
30 - _pen

31 - _point
32 - _rect
33 - _text
34 - _page
35 - _renderVideo
36 - _video
37 - _renderImage
38 - _image

 */
