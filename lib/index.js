(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('axios')) :
    typeof define === 'function' && define.amd ? define(['exports', 'three', 'axios'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.index = {}, global.THREE, global.axios));
})(this, (function (exports, THREE, axios) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var THREE__namespace = /*#__PURE__*/_interopNamespaceDefault(THREE);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /*
     *@description: 初始化参数
     *@author: yangj
     *@date: 2023-03-04 09:08:01
     *@return:
     */
    var Params = /** @class */ (function () {
        function Params(options) {
            this.options = options;
            this.clock = new THREE.Clock();
            this.animate = null;
            this.gAmGroup = [];
            this.gRayGroup = [];
            this.gScenes = [];
            this.gStatus = [];
            this.scene = null;
            this.model = null;
            this.controls = null;
            this.sceneidx = 1;
            this.activeCamera = null;
            this.cameraClass = null;
            this.renderer = null;
            this.ambient = null;
            this.hemisphereLight = null;
            this.directional = null;
            this.rectAreaLight = null;
            this.pointGroup = [];
            this.spotLight = null;
            this.environment = null;
            this.event = null;
            this.souce = null;
            this.parade = null;
            this.water = null;
            this.sky = null;
            this.fog = null;
            this.spriteGroup = [];
        }
        return Params;
    }());

    var Camera = /** @class */ (function () {
        function Camera(el) {
            this.camera = null;
            this.el = el;
            this.init();
        }
        Camera.prototype.init = function () {
            this.camera = new THREE.PerspectiveCamera(60, this.el.clientWidth / this.el.clientHeight, 1, 2000000);
        };
        Camera.prototype.flyTo = function (TWEEN, controls, option) {
            var _this = this;
            var _a;
            option.position = option.position || []; // 相机新的位置
            option.controls = option.controls || []; // 控制器新的中心点位置(围绕此点旋转等)
            option.duration = option.duration || 1000; // 飞行时间
            option.easing = option.easing || TWEEN.Easing.Linear.None;
            TWEEN.removeAll();
            var curPosition = (_a = this.camera) === null || _a === void 0 ? void 0 : _a.position;
            var controlsTar = controls.orbitControls.target;
            var tween = new TWEEN.Tween({
                x1: curPosition.x,
                y1: curPosition.y,
                z1: curPosition.z,
                x2: controlsTar.x,
                y2: controlsTar.y,
                z2: controlsTar.z
            })
                .to({
                x1: option.position[0],
                y1: option.position[1],
                z1: option.position[2],
                x2: option.controls[0],
                y2: option.controls[1],
                z2: option.controls[2]
            }, option.duration)
                .easing(TWEEN.Easing.Linear.None); // TWEEN.Easing.Cubic.InOut //匀速
            tween.onUpdate(function () {
                var _a;
                controls.orbitControls.enabled = false;
                (_a = _this.camera) === null || _a === void 0 ? void 0 : _a.position.set(tween._object.x1, tween._object.y1, tween._object.z1);
                controls.orbitControls.target.set(tween._object.x2, tween._object.y2, tween._object.z2);
                controls.orbitControls.update();
                if (option.update instanceof Function) {
                    option.update(tween);
                }
            });
            tween.onStart(function () {
                controls.orbitControls.enabled = false;
                if (option.start instanceof Function) {
                    option.start();
                }
            });
            tween.onComplete(function () {
                controls.orbitControls.enabled = true;
                if (option.done instanceof Function) {
                    option.done();
                }
            });
            tween.onStop(function () { return (option.stop instanceof Function ? option.stop() : ""); });
            tween.start();
            TWEEN.add(tween);
            return tween;
        };
        return Camera;
    }());

    var Renderer = /** @class */ (function () {
        function Renderer(el) {
            this.renderer = null;
            this.el = el;
            this.init();
        }
        Renderer.prototype.init = function () {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.physicallyCorrectLights = false;
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.setClearColor(0x000000);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
            this.renderer.toneMapping = THREE.ReinhardToneMapping;
            //按序渲染
            this.renderer.sortObjects = true;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //提高阴影的柔和度
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true; //inear转gamma
            this.renderer.gammaFactor = 2.2;
        };
        return Renderer;
    }());

    // OrbitControls performs orbiting, dollying (zooming), and panning.
    // Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
    //
    //    Orbit - left mouse / touch: one-finger move
    //    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
    //    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

    const _changeEvent$1 = {
      type: 'change'
    };
    const _startEvent = {
      type: 'start'
    };
    const _endEvent = {
      type: 'end'
    };
    class OrbitControls extends THREE.EventDispatcher {
      constructor(object, domElement) {
        super();
        this.object = object;
        this.domElement = domElement;
        this.domElement.style.touchAction = 'none'; // disable touch scroll

        // Set to false to disable this control
        this.enabled = true;

        // "target" sets the location of focus, where the object orbits around
        this.target = new THREE.Vector3();

        // How far you can dolly in and out ( PerspectiveCamera only )
        this.minDistance = 0;
        this.maxDistance = Infinity;

        // How far you can zoom in and out ( OrthographicCamera only )
        this.minZoom = 0;
        this.maxZoom = Infinity;

        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians

        // How far you can orbit horizontally, upper and lower limits.
        // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        this.minAzimuthAngle = -Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians

        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.enableDamping = false;
        this.dampingFactor = 0.05;

        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        this.enableZoom = true;
        this.zoomSpeed = 1.0;

        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 1.0;

        // Set to false to disable panning
        this.enablePan = true;
        this.panSpeed = 1.0;
        this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
        this.keyPanSpeed = 7.0; // pixels moved per arrow key push

        // Set to true to automatically rotate around the target
        // If auto-rotate is enabled, you must call controls.update() in your animation loop
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

        // The four arrow keys
        this.keys = {
          LEFT: 'ArrowLeft',
          UP: 'ArrowUp',
          RIGHT: 'ArrowRight',
          BOTTOM: 'ArrowDown'
        };

        // Mouse buttons
        this.mouseButtons = {
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        };

        // Touch fingers
        this.touches = {
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        };

        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;

        // the target DOM element for key events
        this._domElementKeyEvents = null;

        //
        // public methods
        //

        this.getPolarAngle = function () {
          return spherical.phi;
        };
        this.getAzimuthalAngle = function () {
          return spherical.theta;
        };
        this.getDistance = function () {
          return this.object.position.distanceTo(this.target);
        };
        this.listenToKeyEvents = function (domElement) {
          domElement.addEventListener('keydown', onKeyDown);
          this._domElementKeyEvents = domElement;
        };
        this.stopListenToKeyEvents = function () {
          this._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
          this._domElementKeyEvents = null;
        };
        this.saveState = function () {
          scope.target0.copy(scope.target);
          scope.position0.copy(scope.object.position);
          scope.zoom0 = scope.object.zoom;
        };
        this.reset = function () {
          scope.target.copy(scope.target0);
          scope.object.position.copy(scope.position0);
          scope.object.zoom = scope.zoom0;
          scope.object.updateProjectionMatrix();
          scope.dispatchEvent(_changeEvent$1);
          scope.update();
          state = STATE.NONE;
        };

        // this method is exposed, but perhaps it would be better if we can make it private...
        this.update = function () {
          const offset = new THREE.Vector3();

          // so camera.up is the orbit axis
          const quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
          const quatInverse = quat.clone().invert();
          const lastPosition = new THREE.Vector3();
          const lastQuaternion = new THREE.Quaternion();
          const twoPI = 2 * Math.PI;
          return function update() {
            const position = scope.object.position;
            offset.copy(position).sub(scope.target);

            // rotate offset to "y-axis-is-up" space
            offset.applyQuaternion(quat);

            // angle from z-axis around y-axis
            spherical.setFromVector3(offset);
            if (scope.autoRotate && state === STATE.NONE) {
              rotateLeft(getAutoRotationAngle());
            }
            if (scope.enableDamping) {
              spherical.theta += sphericalDelta.theta * scope.dampingFactor;
              spherical.phi += sphericalDelta.phi * scope.dampingFactor;
            } else {
              spherical.theta += sphericalDelta.theta;
              spherical.phi += sphericalDelta.phi;
            }

            // restrict theta to be between desired limits

            let min = scope.minAzimuthAngle;
            let max = scope.maxAzimuthAngle;
            if (isFinite(min) && isFinite(max)) {
              if (min < -Math.PI) min += twoPI;else if (min > Math.PI) min -= twoPI;
              if (max < -Math.PI) max += twoPI;else if (max > Math.PI) max -= twoPI;
              if (min <= max) {
                spherical.theta = Math.max(min, Math.min(max, spherical.theta));
              } else {
                spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
              }
            }

            // restrict phi to be between desired limits
            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
            spherical.makeSafe();
            spherical.radius *= scale;

            // restrict radius to be between desired limits
            spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

            // move target to panned location

            if (scope.enableDamping === true) {
              scope.target.addScaledVector(panOffset, scope.dampingFactor);
            } else {
              scope.target.add(panOffset);
            }
            offset.setFromSpherical(spherical);

            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion(quatInverse);
            position.copy(scope.target).add(offset);
            scope.object.lookAt(scope.target);
            if (scope.enableDamping === true) {
              sphericalDelta.theta *= 1 - scope.dampingFactor;
              sphericalDelta.phi *= 1 - scope.dampingFactor;
              panOffset.multiplyScalar(1 - scope.dampingFactor);
            } else {
              sphericalDelta.set(0, 0, 0);
              panOffset.set(0, 0, 0);
            }
            scale = 1;

            // update condition is:
            // min(camera displacement, camera rotation in radians)^2 > EPS
            // using small-angle approximation cos(x/2) = 1 - x^2 / 8

            if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
              scope.dispatchEvent(_changeEvent$1);
              lastPosition.copy(scope.object.position);
              lastQuaternion.copy(scope.object.quaternion);
              zoomChanged = false;
              return true;
            }
            return false;
          };
        }();
        this.dispose = function () {
          scope.domElement.removeEventListener('contextmenu', onContextMenu);
          scope.domElement.removeEventListener('pointerdown', onPointerDown);
          scope.domElement.removeEventListener('pointercancel', onPointerUp);
          scope.domElement.removeEventListener('wheel', onMouseWheel);
          scope.domElement.removeEventListener('pointermove', onPointerMove);
          scope.domElement.removeEventListener('pointerup', onPointerUp);
          if (scope._domElementKeyEvents !== null) {
            scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
            scope._domElementKeyEvents = null;
          }

          //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
        };

        //
        // internals
        //

        const scope = this;
        const STATE = {
          NONE: -1,
          ROTATE: 0,
          DOLLY: 1,
          PAN: 2,
          TOUCH_ROTATE: 3,
          TOUCH_PAN: 4,
          TOUCH_DOLLY_PAN: 5,
          TOUCH_DOLLY_ROTATE: 6
        };
        let state = STATE.NONE;
        const EPS = 0.000001;

        // current position in spherical coordinates
        const spherical = new THREE.Spherical();
        const sphericalDelta = new THREE.Spherical();
        let scale = 1;
        const panOffset = new THREE.Vector3();
        let zoomChanged = false;
        const rotateStart = new THREE.Vector2();
        const rotateEnd = new THREE.Vector2();
        const rotateDelta = new THREE.Vector2();
        const panStart = new THREE.Vector2();
        const panEnd = new THREE.Vector2();
        const panDelta = new THREE.Vector2();
        const dollyStart = new THREE.Vector2();
        const dollyEnd = new THREE.Vector2();
        const dollyDelta = new THREE.Vector2();
        const pointers = [];
        const pointerPositions = {};
        function getAutoRotationAngle() {
          return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
        }
        function getZoomScale() {
          return Math.pow(0.95, scope.zoomSpeed);
        }
        function rotateLeft(angle) {
          sphericalDelta.theta -= angle;
        }
        function rotateUp(angle) {
          sphericalDelta.phi -= angle;
        }
        const panLeft = function () {
          const v = new THREE.Vector3();
          return function panLeft(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
            v.multiplyScalar(-distance);
            panOffset.add(v);
          };
        }();
        const panUp = function () {
          const v = new THREE.Vector3();
          return function panUp(distance, objectMatrix) {
            if (scope.screenSpacePanning === true) {
              v.setFromMatrixColumn(objectMatrix, 1);
            } else {
              v.setFromMatrixColumn(objectMatrix, 0);
              v.crossVectors(scope.object.up, v);
            }
            v.multiplyScalar(distance);
            panOffset.add(v);
          };
        }();

        // deltaX and deltaY are in pixels; right and down are positive
        const pan = function () {
          const offset = new THREE.Vector3();
          return function pan(deltaX, deltaY) {
            const element = scope.domElement;
            if (scope.object.isPerspectiveCamera) {
              // perspective
              const position = scope.object.position;
              offset.copy(position).sub(scope.target);
              let targetDistance = offset.length();

              // half of the fov is center to top of screen
              targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0);

              // we use only clientHeight here so aspect ratio does not distort speed
              panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
              panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
            } else if (scope.object.isOrthographicCamera) {
              // orthographic
              panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
              panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
            } else {
              // camera neither orthographic nor perspective
              console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
              scope.enablePan = false;
            }
          };
        }();
        function dollyOut(dollyScale) {
          if (scope.object.isPerspectiveCamera) {
            scale /= dollyScale;
          } else if (scope.object.isOrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
          } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
          }
        }
        function dollyIn(dollyScale) {
          if (scope.object.isPerspectiveCamera) {
            scale *= dollyScale;
          } else if (scope.object.isOrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
          } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
          }
        }

        //
        // event callbacks - update the object state
        //

        function handleMouseDownRotate(event) {
          rotateStart.set(event.clientX, event.clientY);
        }
        function handleMouseDownDolly(event) {
          dollyStart.set(event.clientX, event.clientY);
        }
        function handleMouseDownPan(event) {
          panStart.set(event.clientX, event.clientY);
        }
        function handleMouseMoveRotate(event) {
          rotateEnd.set(event.clientX, event.clientY);
          rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
          const element = scope.domElement;
          rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

          rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
          rotateStart.copy(rotateEnd);
          scope.update();
        }
        function handleMouseMoveDolly(event) {
          dollyEnd.set(event.clientX, event.clientY);
          dollyDelta.subVectors(dollyEnd, dollyStart);
          if (dollyDelta.y > 0) {
            dollyOut(getZoomScale());
          } else if (dollyDelta.y < 0) {
            dollyIn(getZoomScale());
          }
          dollyStart.copy(dollyEnd);
          scope.update();
        }
        function handleMouseMovePan(event) {
          panEnd.set(event.clientX, event.clientY);
          panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
          pan(panDelta.x, panDelta.y);
          panStart.copy(panEnd);
          scope.update();
        }
        function handleMouseWheel(event) {
          if (event.deltaY < 0) {
            dollyIn(getZoomScale());
          } else if (event.deltaY > 0) {
            dollyOut(getZoomScale());
          }
          scope.update();
        }
        function handleKeyDown(event) {
          let needsUpdate = false;
          switch (event.code) {
            case scope.keys.UP:
              if (event.ctrlKey || event.metaKey || event.shiftKey) {
                rotateUp(2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
              } else {
                pan(0, scope.keyPanSpeed);
              }
              needsUpdate = true;
              break;
            case scope.keys.BOTTOM:
              if (event.ctrlKey || event.metaKey || event.shiftKey) {
                rotateUp(-2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
              } else {
                pan(0, -scope.keyPanSpeed);
              }
              needsUpdate = true;
              break;
            case scope.keys.LEFT:
              if (event.ctrlKey || event.metaKey || event.shiftKey) {
                rotateLeft(2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
              } else {
                pan(scope.keyPanSpeed, 0);
              }
              needsUpdate = true;
              break;
            case scope.keys.RIGHT:
              if (event.ctrlKey || event.metaKey || event.shiftKey) {
                rotateLeft(-2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
              } else {
                pan(-scope.keyPanSpeed, 0);
              }
              needsUpdate = true;
              break;
          }
          if (needsUpdate) {
            // prevent the browser from scrolling on cursor keys
            event.preventDefault();
            scope.update();
          }
        }
        function handleTouchStartRotate() {
          if (pointers.length === 1) {
            rotateStart.set(pointers[0].pageX, pointers[0].pageY);
          } else {
            const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
            const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
            rotateStart.set(x, y);
          }
        }
        function handleTouchStartPan() {
          if (pointers.length === 1) {
            panStart.set(pointers[0].pageX, pointers[0].pageY);
          } else {
            const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
            const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
            panStart.set(x, y);
          }
        }
        function handleTouchStartDolly() {
          const dx = pointers[0].pageX - pointers[1].pageX;
          const dy = pointers[0].pageY - pointers[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          dollyStart.set(0, distance);
        }
        function handleTouchStartDollyPan() {
          if (scope.enableZoom) handleTouchStartDolly();
          if (scope.enablePan) handleTouchStartPan();
        }
        function handleTouchStartDollyRotate() {
          if (scope.enableZoom) handleTouchStartDolly();
          if (scope.enableRotate) handleTouchStartRotate();
        }
        function handleTouchMoveRotate(event) {
          if (pointers.length == 1) {
            rotateEnd.set(event.pageX, event.pageY);
          } else {
            const position = getSecondPointerPosition(event);
            const x = 0.5 * (event.pageX + position.x);
            const y = 0.5 * (event.pageY + position.y);
            rotateEnd.set(x, y);
          }
          rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
          const element = scope.domElement;
          rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

          rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
          rotateStart.copy(rotateEnd);
        }
        function handleTouchMovePan(event) {
          if (pointers.length === 1) {
            panEnd.set(event.pageX, event.pageY);
          } else {
            const position = getSecondPointerPosition(event);
            const x = 0.5 * (event.pageX + position.x);
            const y = 0.5 * (event.pageY + position.y);
            panEnd.set(x, y);
          }
          panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
          pan(panDelta.x, panDelta.y);
          panStart.copy(panEnd);
        }
        function handleTouchMoveDolly(event) {
          const position = getSecondPointerPosition(event);
          const dx = event.pageX - position.x;
          const dy = event.pageY - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          dollyEnd.set(0, distance);
          dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
          dollyOut(dollyDelta.y);
          dollyStart.copy(dollyEnd);
        }
        function handleTouchMoveDollyPan(event) {
          if (scope.enableZoom) handleTouchMoveDolly(event);
          if (scope.enablePan) handleTouchMovePan(event);
        }
        function handleTouchMoveDollyRotate(event) {
          if (scope.enableZoom) handleTouchMoveDolly(event);
          if (scope.enableRotate) handleTouchMoveRotate(event);
        }

        //
        // event handlers - FSM: listen for events and reset state
        //

        function onPointerDown(event) {
          if (scope.enabled === false) return;
          if (pointers.length === 0) {
            scope.domElement.setPointerCapture(event.pointerId);
            scope.domElement.addEventListener('pointermove', onPointerMove);
            scope.domElement.addEventListener('pointerup', onPointerUp);
          }

          //

          addPointer(event);
          if (event.pointerType === 'touch') {
            onTouchStart(event);
          } else {
            onMouseDown(event);
          }
        }
        function onPointerMove(event) {
          if (scope.enabled === false) return;
          if (event.pointerType === 'touch') {
            onTouchMove(event);
          } else {
            onMouseMove(event);
          }
        }
        function onPointerUp(event) {
          removePointer(event);
          if (pointers.length === 0) {
            scope.domElement.releasePointerCapture(event.pointerId);
            scope.domElement.removeEventListener('pointermove', onPointerMove);
            scope.domElement.removeEventListener('pointerup', onPointerUp);
          }
          scope.dispatchEvent(_endEvent);
          state = STATE.NONE;
        }
        function onMouseDown(event) {
          let mouseAction;
          switch (event.button) {
            case 0:
              mouseAction = scope.mouseButtons.LEFT;
              break;
            case 1:
              mouseAction = scope.mouseButtons.MIDDLE;
              break;
            case 2:
              mouseAction = scope.mouseButtons.RIGHT;
              break;
            default:
              mouseAction = -1;
          }
          switch (mouseAction) {
            case THREE.MOUSE.DOLLY:
              if (scope.enableZoom === false) return;
              handleMouseDownDolly(event);
              state = STATE.DOLLY;
              break;
            case THREE.MOUSE.ROTATE:
              if (event.ctrlKey || event.metaKey || event.shiftKey) {
                if (scope.enablePan === false) return;
                handleMouseDownPan(event);
                state = STATE.PAN;
              } else {
                if (scope.enableRotate === false) return;
                handleMouseDownRotate(event);
                state = STATE.ROTATE;
              }
              break;
            case THREE.MOUSE.PAN:
              if (event.ctrlKey || event.metaKey || event.shiftKey) {
                if (scope.enableRotate === false) return;
                handleMouseDownRotate(event);
                state = STATE.ROTATE;
              } else {
                if (scope.enablePan === false) return;
                handleMouseDownPan(event);
                state = STATE.PAN;
              }
              break;
            default:
              state = STATE.NONE;
          }
          if (state !== STATE.NONE) {
            scope.dispatchEvent(_startEvent);
          }
        }
        function onMouseMove(event) {
          switch (state) {
            case STATE.ROTATE:
              if (scope.enableRotate === false) return;
              handleMouseMoveRotate(event);
              break;
            case STATE.DOLLY:
              if (scope.enableZoom === false) return;
              handleMouseMoveDolly(event);
              break;
            case STATE.PAN:
              if (scope.enablePan === false) return;
              handleMouseMovePan(event);
              break;
          }
        }
        function onMouseWheel(event) {
          if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE) return;
          event.preventDefault();
          scope.dispatchEvent(_startEvent);
          handleMouseWheel(event);
          scope.dispatchEvent(_endEvent);
        }
        function onKeyDown(event) {
          if (scope.enabled === false || scope.enablePan === false) return;
          handleKeyDown(event);
        }
        function onTouchStart(event) {
          trackPointer(event);
          switch (pointers.length) {
            case 1:
              switch (scope.touches.ONE) {
                case THREE.TOUCH.ROTATE:
                  if (scope.enableRotate === false) return;
                  handleTouchStartRotate();
                  state = STATE.TOUCH_ROTATE;
                  break;
                case THREE.TOUCH.PAN:
                  if (scope.enablePan === false) return;
                  handleTouchStartPan();
                  state = STATE.TOUCH_PAN;
                  break;
                default:
                  state = STATE.NONE;
              }
              break;
            case 2:
              switch (scope.touches.TWO) {
                case THREE.TOUCH.DOLLY_PAN:
                  if (scope.enableZoom === false && scope.enablePan === false) return;
                  handleTouchStartDollyPan();
                  state = STATE.TOUCH_DOLLY_PAN;
                  break;
                case THREE.TOUCH.DOLLY_ROTATE:
                  if (scope.enableZoom === false && scope.enableRotate === false) return;
                  handleTouchStartDollyRotate();
                  state = STATE.TOUCH_DOLLY_ROTATE;
                  break;
                default:
                  state = STATE.NONE;
              }
              break;
            default:
              state = STATE.NONE;
          }
          if (state !== STATE.NONE) {
            scope.dispatchEvent(_startEvent);
          }
        }
        function onTouchMove(event) {
          trackPointer(event);
          switch (state) {
            case STATE.TOUCH_ROTATE:
              if (scope.enableRotate === false) return;
              handleTouchMoveRotate(event);
              scope.update();
              break;
            case STATE.TOUCH_PAN:
              if (scope.enablePan === false) return;
              handleTouchMovePan(event);
              scope.update();
              break;
            case STATE.TOUCH_DOLLY_PAN:
              if (scope.enableZoom === false && scope.enablePan === false) return;
              handleTouchMoveDollyPan(event);
              scope.update();
              break;
            case STATE.TOUCH_DOLLY_ROTATE:
              if (scope.enableZoom === false && scope.enableRotate === false) return;
              handleTouchMoveDollyRotate(event);
              scope.update();
              break;
            default:
              state = STATE.NONE;
          }
        }
        function onContextMenu(event) {
          if (scope.enabled === false) return;
          event.preventDefault();
        }
        function addPointer(event) {
          pointers.push(event);
        }
        function removePointer(event) {
          delete pointerPositions[event.pointerId];
          for (let i = 0; i < pointers.length; i++) {
            if (pointers[i].pointerId == event.pointerId) {
              pointers.splice(i, 1);
              return;
            }
          }
        }
        function trackPointer(event) {
          let position = pointerPositions[event.pointerId];
          if (position === undefined) {
            position = new THREE.Vector2();
            pointerPositions[event.pointerId] = position;
          }
          position.set(event.pageX, event.pageY);
        }
        function getSecondPointerPosition(event) {
          const pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
          return pointerPositions[pointer.pointerId];
        }

        //

        scope.domElement.addEventListener('contextmenu', onContextMenu);
        scope.domElement.addEventListener('pointerdown', onPointerDown);
        scope.domElement.addEventListener('pointercancel', onPointerUp);
        scope.domElement.addEventListener('wheel', onMouseWheel, {
          passive: false
        });

        // force an update at start

        this.update();
      }
    }

    const _raycaster$1 = new THREE.Raycaster();
    const _tempVector = new THREE.Vector3();
    const _tempVector2 = new THREE.Vector3();
    const _tempQuaternion = new THREE.Quaternion();
    const _unit = {
      X: new THREE.Vector3(1, 0, 0),
      Y: new THREE.Vector3(0, 1, 0),
      Z: new THREE.Vector3(0, 0, 1)
    };
    const _changeEvent = {
      type: 'change'
    };
    const _mouseDownEvent = {
      type: 'mouseDown'
    };
    const _mouseUpEvent = {
      type: 'mouseUp',
      mode: null
    };
    const _objectChangeEvent = {
      type: 'objectChange'
    };
    class TransformControls extends THREE.Object3D {
      constructor(camera, domElement) {
        super();
        if (domElement === undefined) {
          console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.');
          domElement = document;
        }
        this.isTransformControls = true;
        this.visible = false;
        this.domElement = domElement;
        this.domElement.style.touchAction = 'none'; // disable touch scroll

        const _gizmo = new TransformControlsGizmo();
        this._gizmo = _gizmo;
        this.add(_gizmo);
        const _plane = new TransformControlsPlane();
        this._plane = _plane;
        this.add(_plane);
        const scope = this;

        // Defined getter, setter and store for a property
        function defineProperty(propName, defaultValue) {
          let propValue = defaultValue;
          Object.defineProperty(scope, propName, {
            get: function () {
              return propValue !== undefined ? propValue : defaultValue;
            },
            set: function (value) {
              if (propValue !== value) {
                propValue = value;
                _plane[propName] = value;
                _gizmo[propName] = value;
                scope.dispatchEvent({
                  type: propName + '-changed',
                  value: value
                });
                scope.dispatchEvent(_changeEvent);
              }
            }
          });
          scope[propName] = defaultValue;
          _plane[propName] = defaultValue;
          _gizmo[propName] = defaultValue;
        }

        // Define properties with getters/setter
        // Setting the defined property will automatically trigger change event
        // Defined properties are passed down to gizmo and plane

        defineProperty('camera', camera);
        defineProperty('object', undefined);
        defineProperty('enabled', true);
        defineProperty('axis', null);
        defineProperty('mode', 'translate');
        defineProperty('translationSnap', null);
        defineProperty('rotationSnap', null);
        defineProperty('scaleSnap', null);
        defineProperty('space', 'world');
        defineProperty('size', 1);
        defineProperty('dragging', false);
        defineProperty('showX', true);
        defineProperty('showY', true);
        defineProperty('showZ', true);

        // Reusable utility variables

        const worldPosition = new THREE.Vector3();
        const worldPositionStart = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        const worldQuaternionStart = new THREE.Quaternion();
        const cameraPosition = new THREE.Vector3();
        const cameraQuaternion = new THREE.Quaternion();
        const pointStart = new THREE.Vector3();
        const pointEnd = new THREE.Vector3();
        const rotationAxis = new THREE.Vector3();
        const rotationAngle = 0;
        const eye = new THREE.Vector3();

        // TODO: remove properties unused in plane and gizmo

        defineProperty('worldPosition', worldPosition);
        defineProperty('worldPositionStart', worldPositionStart);
        defineProperty('worldQuaternion', worldQuaternion);
        defineProperty('worldQuaternionStart', worldQuaternionStart);
        defineProperty('cameraPosition', cameraPosition);
        defineProperty('cameraQuaternion', cameraQuaternion);
        defineProperty('pointStart', pointStart);
        defineProperty('pointEnd', pointEnd);
        defineProperty('rotationAxis', rotationAxis);
        defineProperty('rotationAngle', rotationAngle);
        defineProperty('eye', eye);
        this._offset = new THREE.Vector3();
        this._startNorm = new THREE.Vector3();
        this._endNorm = new THREE.Vector3();
        this._cameraScale = new THREE.Vector3();
        this._parentPosition = new THREE.Vector3();
        this._parentQuaternion = new THREE.Quaternion();
        this._parentQuaternionInv = new THREE.Quaternion();
        this._parentScale = new THREE.Vector3();
        this._worldScaleStart = new THREE.Vector3();
        this._worldQuaternionInv = new THREE.Quaternion();
        this._worldScale = new THREE.Vector3();
        this._positionStart = new THREE.Vector3();
        this._quaternionStart = new THREE.Quaternion();
        this._scaleStart = new THREE.Vector3();
        this._getPointer = getPointer.bind(this);
        this._onPointerDown = onPointerDown.bind(this);
        this._onPointerHover = onPointerHover.bind(this);
        this._onPointerMove = onPointerMove.bind(this);
        this._onPointerUp = onPointerUp.bind(this);
        this.domElement.addEventListener('pointerdown', this._onPointerDown);
        this.domElement.addEventListener('pointermove', this._onPointerHover);
        this.domElement.addEventListener('pointerup', this._onPointerUp);
      }

      // updateMatrixWorld  updates key transformation variables
      updateMatrixWorld() {
        if (this.object !== undefined) {
          this.object.updateMatrixWorld();
          if (this.object.parent === null) {
            console.error('TransformControls: The attached 3D object must be a part of the scene graph.');
          } else {
            this.object.parent.matrixWorld.decompose(this._parentPosition, this._parentQuaternion, this._parentScale);
          }
          this.object.matrixWorld.decompose(this.worldPosition, this.worldQuaternion, this._worldScale);
          this._parentQuaternionInv.copy(this._parentQuaternion).invert();
          this._worldQuaternionInv.copy(this.worldQuaternion).invert();
        }
        this.camera.updateMatrixWorld();
        this.camera.matrixWorld.decompose(this.cameraPosition, this.cameraQuaternion, this._cameraScale);
        if (this.camera.isOrthographicCamera) {
          this.camera.getWorldDirection(this.eye).negate();
        } else {
          this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize();
        }
        super.updateMatrixWorld(this);
      }
      pointerHover(pointer) {
        if (this.object === undefined || this.dragging === true) return;
        _raycaster$1.setFromCamera(pointer, this.camera);
        const intersect = intersectObjectWithRay(this._gizmo.picker[this.mode], _raycaster$1);
        if (intersect) {
          this.axis = intersect.object.name;
        } else {
          this.axis = null;
        }
      }
      pointerDown(pointer) {
        if (this.object === undefined || this.dragging === true || pointer.button !== 0) return;
        if (this.axis !== null) {
          _raycaster$1.setFromCamera(pointer, this.camera);
          const planeIntersect = intersectObjectWithRay(this._plane, _raycaster$1, true);
          if (planeIntersect) {
            this.object.updateMatrixWorld();
            this.object.parent.updateMatrixWorld();
            this._positionStart.copy(this.object.position);
            this._quaternionStart.copy(this.object.quaternion);
            this._scaleStart.copy(this.object.scale);
            this.object.matrixWorld.decompose(this.worldPositionStart, this.worldQuaternionStart, this._worldScaleStart);
            this.pointStart.copy(planeIntersect.point).sub(this.worldPositionStart);
          }
          this.dragging = true;
          _mouseDownEvent.mode = this.mode;
          this.dispatchEvent(_mouseDownEvent);
        }
      }
      pointerMove(pointer) {
        const axis = this.axis;
        const mode = this.mode;
        const object = this.object;
        let space = this.space;
        if (mode === 'scale') {
          space = 'local';
        } else if (axis === 'E' || axis === 'XYZE' || axis === 'XYZ') {
          space = 'world';
        }
        if (object === undefined || axis === null || this.dragging === false || pointer.button !== -1) return;
        _raycaster$1.setFromCamera(pointer, this.camera);
        const planeIntersect = intersectObjectWithRay(this._plane, _raycaster$1, true);
        if (!planeIntersect) return;
        this.pointEnd.copy(planeIntersect.point).sub(this.worldPositionStart);
        if (mode === 'translate') {
          // Apply translate

          this._offset.copy(this.pointEnd).sub(this.pointStart);
          if (space === 'local' && axis !== 'XYZ') {
            this._offset.applyQuaternion(this._worldQuaternionInv);
          }
          if (axis.indexOf('X') === -1) this._offset.x = 0;
          if (axis.indexOf('Y') === -1) this._offset.y = 0;
          if (axis.indexOf('Z') === -1) this._offset.z = 0;
          if (space === 'local' && axis !== 'XYZ') {
            this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale);
          } else {
            this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale);
          }
          object.position.copy(this._offset).add(this._positionStart);

          // Apply translation snap

          if (this.translationSnap) {
            if (space === 'local') {
              object.position.applyQuaternion(_tempQuaternion.copy(this._quaternionStart).invert());
              if (axis.search('X') !== -1) {
                object.position.x = Math.round(object.position.x / this.translationSnap) * this.translationSnap;
              }
              if (axis.search('Y') !== -1) {
                object.position.y = Math.round(object.position.y / this.translationSnap) * this.translationSnap;
              }
              if (axis.search('Z') !== -1) {
                object.position.z = Math.round(object.position.z / this.translationSnap) * this.translationSnap;
              }
              object.position.applyQuaternion(this._quaternionStart);
            }
            if (space === 'world') {
              if (object.parent) {
                object.position.add(_tempVector.setFromMatrixPosition(object.parent.matrixWorld));
              }
              if (axis.search('X') !== -1) {
                object.position.x = Math.round(object.position.x / this.translationSnap) * this.translationSnap;
              }
              if (axis.search('Y') !== -1) {
                object.position.y = Math.round(object.position.y / this.translationSnap) * this.translationSnap;
              }
              if (axis.search('Z') !== -1) {
                object.position.z = Math.round(object.position.z / this.translationSnap) * this.translationSnap;
              }
              if (object.parent) {
                object.position.sub(_tempVector.setFromMatrixPosition(object.parent.matrixWorld));
              }
            }
          }
        } else if (mode === 'scale') {
          if (axis.search('XYZ') !== -1) {
            let d = this.pointEnd.length() / this.pointStart.length();
            if (this.pointEnd.dot(this.pointStart) < 0) d *= -1;
            _tempVector2.set(d, d, d);
          } else {
            _tempVector.copy(this.pointStart);
            _tempVector2.copy(this.pointEnd);
            _tempVector.applyQuaternion(this._worldQuaternionInv);
            _tempVector2.applyQuaternion(this._worldQuaternionInv);
            _tempVector2.divide(_tempVector);
            if (axis.search('X') === -1) {
              _tempVector2.x = 1;
            }
            if (axis.search('Y') === -1) {
              _tempVector2.y = 1;
            }
            if (axis.search('Z') === -1) {
              _tempVector2.z = 1;
            }
          }

          // Apply scale

          object.scale.copy(this._scaleStart).multiply(_tempVector2);
          if (this.scaleSnap) {
            if (axis.search('X') !== -1) {
              object.scale.x = Math.round(object.scale.x / this.scaleSnap) * this.scaleSnap || this.scaleSnap;
            }
            if (axis.search('Y') !== -1) {
              object.scale.y = Math.round(object.scale.y / this.scaleSnap) * this.scaleSnap || this.scaleSnap;
            }
            if (axis.search('Z') !== -1) {
              object.scale.z = Math.round(object.scale.z / this.scaleSnap) * this.scaleSnap || this.scaleSnap;
            }
          }
        } else if (mode === 'rotate') {
          this._offset.copy(this.pointEnd).sub(this.pointStart);
          const ROTATION_SPEED = 20 / this.worldPosition.distanceTo(_tempVector.setFromMatrixPosition(this.camera.matrixWorld));
          if (axis === 'E') {
            this.rotationAxis.copy(this.eye);
            this.rotationAngle = this.pointEnd.angleTo(this.pointStart);
            this._startNorm.copy(this.pointStart).normalize();
            this._endNorm.copy(this.pointEnd).normalize();
            this.rotationAngle *= this._endNorm.cross(this._startNorm).dot(this.eye) < 0 ? 1 : -1;
          } else if (axis === 'XYZE') {
            this.rotationAxis.copy(this._offset).cross(this.eye).normalize();
            this.rotationAngle = this._offset.dot(_tempVector.copy(this.rotationAxis).cross(this.eye)) * ROTATION_SPEED;
          } else if (axis === 'X' || axis === 'Y' || axis === 'Z') {
            this.rotationAxis.copy(_unit[axis]);
            _tempVector.copy(_unit[axis]);
            if (space === 'local') {
              _tempVector.applyQuaternion(this.worldQuaternion);
            }
            this.rotationAngle = this._offset.dot(_tempVector.cross(this.eye).normalize()) * ROTATION_SPEED;
          }

          // Apply rotation snap

          if (this.rotationSnap) this.rotationAngle = Math.round(this.rotationAngle / this.rotationSnap) * this.rotationSnap;

          // Apply rotate
          if (space === 'local' && axis !== 'E' && axis !== 'XYZE') {
            object.quaternion.copy(this._quaternionStart);
            object.quaternion.multiply(_tempQuaternion.setFromAxisAngle(this.rotationAxis, this.rotationAngle)).normalize();
          } else {
            this.rotationAxis.applyQuaternion(this._parentQuaternionInv);
            object.quaternion.copy(_tempQuaternion.setFromAxisAngle(this.rotationAxis, this.rotationAngle));
            object.quaternion.multiply(this._quaternionStart).normalize();
          }
        }
        this.dispatchEvent(_changeEvent);
        this.dispatchEvent(_objectChangeEvent);
      }
      pointerUp(pointer) {
        if (pointer.button !== 0) return;
        if (this.dragging && this.axis !== null) {
          _mouseUpEvent.mode = this.mode;
          this.dispatchEvent(_mouseUpEvent);
        }
        this.dragging = false;
        this.axis = null;
      }
      dispose() {
        this.domElement.removeEventListener('pointerdown', this._onPointerDown);
        this.domElement.removeEventListener('pointermove', this._onPointerHover);
        this.domElement.removeEventListener('pointermove', this._onPointerMove);
        this.domElement.removeEventListener('pointerup', this._onPointerUp);
        this.traverse(function (child) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }

      // Set current object
      attach(object) {
        this.object = object;
        this.visible = true;
        return this;
      }

      // Detach from object
      detach() {
        this.object = undefined;
        this.visible = false;
        this.axis = null;
        return this;
      }
      reset() {
        if (!this.enabled) return;
        if (this.dragging) {
          this.object.position.copy(this._positionStart);
          this.object.quaternion.copy(this._quaternionStart);
          this.object.scale.copy(this._scaleStart);
          this.dispatchEvent(_changeEvent);
          this.dispatchEvent(_objectChangeEvent);
          this.pointStart.copy(this.pointEnd);
        }
      }
      getRaycaster() {
        return _raycaster$1;
      }

      // TODO: deprecate

      getMode() {
        return this.mode;
      }
      setMode(mode) {
        this.mode = mode;
      }
      setTranslationSnap(translationSnap) {
        this.translationSnap = translationSnap;
      }
      setRotationSnap(rotationSnap) {
        this.rotationSnap = rotationSnap;
      }
      setScaleSnap(scaleSnap) {
        this.scaleSnap = scaleSnap;
      }
      setSize(size) {
        this.size = size;
      }
      setSpace(space) {
        this.space = space;
      }
    }

    // mouse / touch event handlers

    function getPointer(event) {
      if (this.domElement.ownerDocument.pointerLockElement) {
        return {
          x: 0,
          y: 0,
          button: event.button
        };
      } else {
        const rect = this.domElement.getBoundingClientRect();
        return {
          x: (event.clientX - rect.left) / rect.width * 2 - 1,
          y: -(event.clientY - rect.top) / rect.height * 2 + 1,
          button: event.button
        };
      }
    }
    function onPointerHover(event) {
      if (!this.enabled) return;
      switch (event.pointerType) {
        case 'mouse':
        case 'pen':
          this.pointerHover(this._getPointer(event));
          break;
      }
    }
    function onPointerDown(event) {
      if (!this.enabled) return;
      if (!document.pointerLockElement) {
        this.domElement.setPointerCapture(event.pointerId);
      }
      this.domElement.addEventListener('pointermove', this._onPointerMove);
      this.pointerHover(this._getPointer(event));
      this.pointerDown(this._getPointer(event));
    }
    function onPointerMove(event) {
      if (!this.enabled) return;
      this.pointerMove(this._getPointer(event));
    }
    function onPointerUp(event) {
      if (!this.enabled) return;
      this.domElement.releasePointerCapture(event.pointerId);
      this.domElement.removeEventListener('pointermove', this._onPointerMove);
      this.pointerUp(this._getPointer(event));
    }
    function intersectObjectWithRay(object, raycaster, includeInvisible) {
      const allIntersections = raycaster.intersectObject(object, true);
      for (let i = 0; i < allIntersections.length; i++) {
        if (allIntersections[i].object.visible || includeInvisible) {
          return allIntersections[i];
        }
      }
      return false;
    }

    //

    // Reusable utility variables

    const _tempEuler = new THREE.Euler();
    const _alignVector = new THREE.Vector3(0, 1, 0);
    const _zeroVector = new THREE.Vector3(0, 0, 0);
    const _lookAtMatrix = new THREE.Matrix4();
    const _tempQuaternion2 = new THREE.Quaternion();
    const _identityQuaternion = new THREE.Quaternion();
    const _dirVector = new THREE.Vector3();
    const _tempMatrix = new THREE.Matrix4();
    const _unitX = new THREE.Vector3(1, 0, 0);
    const _unitY = new THREE.Vector3(0, 1, 0);
    const _unitZ = new THREE.Vector3(0, 0, 1);
    const _v1 = new THREE.Vector3();
    const _v2 = new THREE.Vector3();
    const _v3 = new THREE.Vector3();
    class TransformControlsGizmo extends THREE.Object3D {
      constructor() {
        super();
        this.isTransformControlsGizmo = true;
        this.type = 'TransformControlsGizmo';

        // shared materials

        const gizmoMaterial = new THREE.MeshBasicMaterial({
          depthTest: false,
          depthWrite: false,
          fog: false,
          toneMapped: false,
          transparent: true
        });
        const gizmoLineMaterial = new THREE.LineBasicMaterial({
          depthTest: false,
          depthWrite: false,
          fog: false,
          toneMapped: false,
          transparent: true
        });

        // Make unique material for each axis/color

        const matInvisible = gizmoMaterial.clone();
        matInvisible.opacity = 0.15;
        const matHelper = gizmoLineMaterial.clone();
        matHelper.opacity = 0.5;
        const matRed = gizmoMaterial.clone();
        matRed.color.setHex(0xff0000);
        const matGreen = gizmoMaterial.clone();
        matGreen.color.setHex(0x00ff00);
        const matBlue = gizmoMaterial.clone();
        matBlue.color.setHex(0x0000ff);
        const matRedTransparent = gizmoMaterial.clone();
        matRedTransparent.color.setHex(0xff0000);
        matRedTransparent.opacity = 0.5;
        const matGreenTransparent = gizmoMaterial.clone();
        matGreenTransparent.color.setHex(0x00ff00);
        matGreenTransparent.opacity = 0.5;
        const matBlueTransparent = gizmoMaterial.clone();
        matBlueTransparent.color.setHex(0x0000ff);
        matBlueTransparent.opacity = 0.5;
        const matWhiteTransparent = gizmoMaterial.clone();
        matWhiteTransparent.opacity = 0.25;
        const matYellowTransparent = gizmoMaterial.clone();
        matYellowTransparent.color.setHex(0xffff00);
        matYellowTransparent.opacity = 0.25;
        const matYellow = gizmoMaterial.clone();
        matYellow.color.setHex(0xffff00);
        const matGray = gizmoMaterial.clone();
        matGray.color.setHex(0x787878);

        // reusable geometry

        const arrowGeometry = new THREE.CylinderGeometry(0, 0.04, 0.1, 12);
        arrowGeometry.translate(0, 0.05, 0);
        const scaleHandleGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
        scaleHandleGeometry.translate(0, 0.04, 0);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));
        const lineGeometry2 = new THREE.CylinderGeometry(0.0075, 0.0075, 0.5, 3);
        lineGeometry2.translate(0, 0.25, 0);
        function CircleGeometry(radius, arc) {
          const geometry = new THREE.TorusGeometry(radius, 0.0075, 3, 64, arc * Math.PI * 2);
          geometry.rotateY(Math.PI / 2);
          geometry.rotateX(Math.PI / 2);
          return geometry;
        }

        // Special geometry for transform helper. If scaled with position vector it spans from [0,0,0] to position

        function TranslateHelperGeometry() {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 1], 3));
          return geometry;
        }

        // Gizmo definitions - custom hierarchy definitions for setupGizmo() function

        const gizmoTranslate = {
          X: [[new THREE.Mesh(arrowGeometry, matRed), [0.5, 0, 0], [0, 0, -Math.PI / 2]], [new THREE.Mesh(arrowGeometry, matRed), [-0.5, 0, 0], [0, 0, Math.PI / 2]], [new THREE.Mesh(lineGeometry2, matRed), [0, 0, 0], [0, 0, -Math.PI / 2]]],
          Y: [[new THREE.Mesh(arrowGeometry, matGreen), [0, 0.5, 0]], [new THREE.Mesh(arrowGeometry, matGreen), [0, -0.5, 0], [Math.PI, 0, 0]], [new THREE.Mesh(lineGeometry2, matGreen)]],
          Z: [[new THREE.Mesh(arrowGeometry, matBlue), [0, 0, 0.5], [Math.PI / 2, 0, 0]], [new THREE.Mesh(arrowGeometry, matBlue), [0, 0, -0.5], [-Math.PI / 2, 0, 0]], [new THREE.Mesh(lineGeometry2, matBlue), null, [Math.PI / 2, 0, 0]]],
          XYZ: [[new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), matWhiteTransparent.clone()), [0, 0, 0]]],
          XY: [[new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.01), matBlueTransparent.clone()), [0.15, 0.15, 0]]],
          YZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.01), matRedTransparent.clone()), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]],
          XZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.01), matGreenTransparent.clone()), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]]
        };
        const pickerTranslate = {
          X: [[new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0.3, 0, 0], [0, 0, -Math.PI / 2]], [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [-0.3, 0, 0], [0, 0, Math.PI / 2]]],
          Y: [[new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0.3, 0]], [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, -0.3, 0], [0, 0, Math.PI]]],
          Z: [[new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, 0.3], [Math.PI / 2, 0, 0]], [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]],
          XYZ: [[new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), matInvisible)]],
          XY: [[new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0.15, 0]]],
          YZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]],
          XZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]]
        };
        const helperTranslate = {
          START: [[new THREE.Mesh(new THREE.OctahedronGeometry(0.01, 2), matHelper), null, null, null, 'helper']],
          END: [[new THREE.Mesh(new THREE.OctahedronGeometry(0.01, 2), matHelper), null, null, null, 'helper']],
          DELTA: [[new THREE.Line(TranslateHelperGeometry(), matHelper), null, null, null, 'helper']],
          X: [[new THREE.Line(lineGeometry, matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']],
          Y: [[new THREE.Line(lineGeometry, matHelper.clone()), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], 'helper']],
          Z: [[new THREE.Line(lineGeometry, matHelper.clone()), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], 'helper']]
        };
        const gizmoRotate = {
          XYZE: [[new THREE.Mesh(CircleGeometry(0.5, 1), matGray), null, [0, Math.PI / 2, 0]]],
          X: [[new THREE.Mesh(CircleGeometry(0.5, 0.5), matRed)]],
          Y: [[new THREE.Mesh(CircleGeometry(0.5, 0.5), matGreen), null, [0, 0, -Math.PI / 2]]],
          Z: [[new THREE.Mesh(CircleGeometry(0.5, 0.5), matBlue), null, [0, Math.PI / 2, 0]]],
          E: [[new THREE.Mesh(CircleGeometry(0.75, 1), matYellowTransparent), null, [0, Math.PI / 2, 0]]]
        };
        const helperRotate = {
          AXIS: [[new THREE.Line(lineGeometry, matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']]
        };
        const pickerRotate = {
          XYZE: [[new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), matInvisible)]],
          X: [[new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 4, 24), matInvisible), [0, 0, 0], [0, -Math.PI / 2, -Math.PI / 2]]],
          Y: [[new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 4, 24), matInvisible), [0, 0, 0], [Math.PI / 2, 0, 0]]],
          Z: [[new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 4, 24), matInvisible), [0, 0, 0], [0, 0, -Math.PI / 2]]],
          E: [[new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.1, 2, 24), matInvisible)]]
        };
        const gizmoScale = {
          X: [[new THREE.Mesh(scaleHandleGeometry, matRed), [0.5, 0, 0], [0, 0, -Math.PI / 2]], [new THREE.Mesh(lineGeometry2, matRed), [0, 0, 0], [0, 0, -Math.PI / 2]], [new THREE.Mesh(scaleHandleGeometry, matRed), [-0.5, 0, 0], [0, 0, Math.PI / 2]]],
          Y: [[new THREE.Mesh(scaleHandleGeometry, matGreen), [0, 0.5, 0]], [new THREE.Mesh(lineGeometry2, matGreen)], [new THREE.Mesh(scaleHandleGeometry, matGreen), [0, -0.5, 0], [0, 0, Math.PI]]],
          Z: [[new THREE.Mesh(scaleHandleGeometry, matBlue), [0, 0, 0.5], [Math.PI / 2, 0, 0]], [new THREE.Mesh(lineGeometry2, matBlue), [0, 0, 0], [Math.PI / 2, 0, 0]], [new THREE.Mesh(scaleHandleGeometry, matBlue), [0, 0, -0.5], [-Math.PI / 2, 0, 0]]],
          XY: [[new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.01), matBlueTransparent), [0.15, 0.15, 0]]],
          YZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.01), matRedTransparent), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]],
          XZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.01), matGreenTransparent), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]],
          XYZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), matWhiteTransparent.clone())]]
        };
        const pickerScale = {
          X: [[new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0.3, 0, 0], [0, 0, -Math.PI / 2]], [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [-0.3, 0, 0], [0, 0, Math.PI / 2]]],
          Y: [[new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0.3, 0]], [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, -0.3, 0], [0, 0, Math.PI]]],
          Z: [[new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, 0.3], [Math.PI / 2, 0, 0]], [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]],
          XY: [[new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0.15, 0]]],
          YZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]],
          XZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]],
          XYZ: [[new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), matInvisible), [0, 0, 0]]]
        };
        const helperScale = {
          X: [[new THREE.Line(lineGeometry, matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']],
          Y: [[new THREE.Line(lineGeometry, matHelper.clone()), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], 'helper']],
          Z: [[new THREE.Line(lineGeometry, matHelper.clone()), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], 'helper']]
        };

        // Creates an Object3D with gizmos described in custom hierarchy definition.

        function setupGizmo(gizmoMap) {
          const gizmo = new THREE.Object3D();
          for (const name in gizmoMap) {
            for (let i = gizmoMap[name].length; i--;) {
              const object = gizmoMap[name][i][0].clone();
              const position = gizmoMap[name][i][1];
              const rotation = gizmoMap[name][i][2];
              const scale = gizmoMap[name][i][3];
              const tag = gizmoMap[name][i][4];

              // name and tag properties are essential for picking and updating logic.
              object.name = name;
              object.tag = tag;
              if (position) {
                object.position.set(position[0], position[1], position[2]);
              }
              if (rotation) {
                object.rotation.set(rotation[0], rotation[1], rotation[2]);
              }
              if (scale) {
                object.scale.set(scale[0], scale[1], scale[2]);
              }
              object.updateMatrix();
              const tempGeometry = object.geometry.clone();
              tempGeometry.applyMatrix4(object.matrix);
              object.geometry = tempGeometry;
              object.renderOrder = Infinity;
              object.position.set(0, 0, 0);
              object.rotation.set(0, 0, 0);
              object.scale.set(1, 1, 1);
              gizmo.add(object);
            }
          }
          return gizmo;
        }

        // Gizmo creation

        this.gizmo = {};
        this.picker = {};
        this.helper = {};
        this.add(this.gizmo['translate'] = setupGizmo(gizmoTranslate));
        this.add(this.gizmo['rotate'] = setupGizmo(gizmoRotate));
        this.add(this.gizmo['scale'] = setupGizmo(gizmoScale));
        this.add(this.picker['translate'] = setupGizmo(pickerTranslate));
        this.add(this.picker['rotate'] = setupGizmo(pickerRotate));
        this.add(this.picker['scale'] = setupGizmo(pickerScale));
        this.add(this.helper['translate'] = setupGizmo(helperTranslate));
        this.add(this.helper['rotate'] = setupGizmo(helperRotate));
        this.add(this.helper['scale'] = setupGizmo(helperScale));

        // Pickers should be hidden always

        this.picker['translate'].visible = false;
        this.picker['rotate'].visible = false;
        this.picker['scale'].visible = false;
      }

      // updateMatrixWorld will update transformations and appearance of individual handles

      updateMatrixWorld(force) {
        const space = this.mode === 'scale' ? 'local' : this.space; // scale always oriented to local rotation

        const quaternion = space === 'local' ? this.worldQuaternion : _identityQuaternion;

        // Show only gizmos for current transform mode

        this.gizmo['translate'].visible = this.mode === 'translate';
        this.gizmo['rotate'].visible = this.mode === 'rotate';
        this.gizmo['scale'].visible = this.mode === 'scale';
        this.helper['translate'].visible = this.mode === 'translate';
        this.helper['rotate'].visible = this.mode === 'rotate';
        this.helper['scale'].visible = this.mode === 'scale';
        let handles = [];
        handles = handles.concat(this.picker[this.mode].children);
        handles = handles.concat(this.gizmo[this.mode].children);
        handles = handles.concat(this.helper[this.mode].children);
        for (let i = 0; i < handles.length; i++) {
          const handle = handles[i];

          // hide aligned to camera

          handle.visible = true;
          handle.rotation.set(0, 0, 0);
          handle.position.copy(this.worldPosition);
          let factor;
          if (this.camera.isOrthographicCamera) {
            factor = (this.camera.top - this.camera.bottom) / this.camera.zoom;
          } else {
            factor = this.worldPosition.distanceTo(this.cameraPosition) * Math.min(1.9 * Math.tan(Math.PI * this.camera.fov / 360) / this.camera.zoom, 7);
          }
          handle.scale.set(1, 1, 1).multiplyScalar(factor * this.size / 4);

          // TODO: simplify helpers and consider decoupling from gizmo

          if (handle.tag === 'helper') {
            handle.visible = false;
            if (handle.name === 'AXIS') {
              handle.visible = !!this.axis;
              if (this.axis === 'X') {
                _tempQuaternion.setFromEuler(_tempEuler.set(0, 0, 0));
                handle.quaternion.copy(quaternion).multiply(_tempQuaternion);
                if (Math.abs(_alignVector.copy(_unitX).applyQuaternion(quaternion).dot(this.eye)) > 0.9) {
                  handle.visible = false;
                }
              }
              if (this.axis === 'Y') {
                _tempQuaternion.setFromEuler(_tempEuler.set(0, 0, Math.PI / 2));
                handle.quaternion.copy(quaternion).multiply(_tempQuaternion);
                if (Math.abs(_alignVector.copy(_unitY).applyQuaternion(quaternion).dot(this.eye)) > 0.9) {
                  handle.visible = false;
                }
              }
              if (this.axis === 'Z') {
                _tempQuaternion.setFromEuler(_tempEuler.set(0, Math.PI / 2, 0));
                handle.quaternion.copy(quaternion).multiply(_tempQuaternion);
                if (Math.abs(_alignVector.copy(_unitZ).applyQuaternion(quaternion).dot(this.eye)) > 0.9) {
                  handle.visible = false;
                }
              }
              if (this.axis === 'XYZE') {
                _tempQuaternion.setFromEuler(_tempEuler.set(0, Math.PI / 2, 0));
                _alignVector.copy(this.rotationAxis);
                handle.quaternion.setFromRotationMatrix(_lookAtMatrix.lookAt(_zeroVector, _alignVector, _unitY));
                handle.quaternion.multiply(_tempQuaternion);
                handle.visible = this.dragging;
              }
              if (this.axis === 'E') {
                handle.visible = false;
              }
            } else if (handle.name === 'START') {
              handle.position.copy(this.worldPositionStart);
              handle.visible = this.dragging;
            } else if (handle.name === 'END') {
              handle.position.copy(this.worldPosition);
              handle.visible = this.dragging;
            } else if (handle.name === 'DELTA') {
              handle.position.copy(this.worldPositionStart);
              handle.quaternion.copy(this.worldQuaternionStart);
              _tempVector.set(1e-10, 1e-10, 1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1);
              _tempVector.applyQuaternion(this.worldQuaternionStart.clone().invert());
              handle.scale.copy(_tempVector);
              handle.visible = this.dragging;
            } else {
              handle.quaternion.copy(quaternion);
              if (this.dragging) {
                handle.position.copy(this.worldPositionStart);
              } else {
                handle.position.copy(this.worldPosition);
              }
              if (this.axis) {
                handle.visible = this.axis.search(handle.name) !== -1;
              }
            }

            // If updating helper, skip rest of the loop
            continue;
          }

          // Align handles to current local or world rotation

          handle.quaternion.copy(quaternion);
          if (this.mode === 'translate' || this.mode === 'scale') {
            // Hide translate and scale axis facing the camera

            const AXIS_HIDE_THRESHOLD = 0.99;
            const PLANE_HIDE_THRESHOLD = 0.2;
            if (handle.name === 'X') {
              if (Math.abs(_alignVector.copy(_unitX).applyQuaternion(quaternion).dot(this.eye)) > AXIS_HIDE_THRESHOLD) {
                handle.scale.set(1e-10, 1e-10, 1e-10);
                handle.visible = false;
              }
            }
            if (handle.name === 'Y') {
              if (Math.abs(_alignVector.copy(_unitY).applyQuaternion(quaternion).dot(this.eye)) > AXIS_HIDE_THRESHOLD) {
                handle.scale.set(1e-10, 1e-10, 1e-10);
                handle.visible = false;
              }
            }
            if (handle.name === 'Z') {
              if (Math.abs(_alignVector.copy(_unitZ).applyQuaternion(quaternion).dot(this.eye)) > AXIS_HIDE_THRESHOLD) {
                handle.scale.set(1e-10, 1e-10, 1e-10);
                handle.visible = false;
              }
            }
            if (handle.name === 'XY') {
              if (Math.abs(_alignVector.copy(_unitZ).applyQuaternion(quaternion).dot(this.eye)) < PLANE_HIDE_THRESHOLD) {
                handle.scale.set(1e-10, 1e-10, 1e-10);
                handle.visible = false;
              }
            }
            if (handle.name === 'YZ') {
              if (Math.abs(_alignVector.copy(_unitX).applyQuaternion(quaternion).dot(this.eye)) < PLANE_HIDE_THRESHOLD) {
                handle.scale.set(1e-10, 1e-10, 1e-10);
                handle.visible = false;
              }
            }
            if (handle.name === 'XZ') {
              if (Math.abs(_alignVector.copy(_unitY).applyQuaternion(quaternion).dot(this.eye)) < PLANE_HIDE_THRESHOLD) {
                handle.scale.set(1e-10, 1e-10, 1e-10);
                handle.visible = false;
              }
            }
          } else if (this.mode === 'rotate') {
            // Align handles to current local or world rotation

            _tempQuaternion2.copy(quaternion);
            _alignVector.copy(this.eye).applyQuaternion(_tempQuaternion.copy(quaternion).invert());
            if (handle.name.search('E') !== -1) {
              handle.quaternion.setFromRotationMatrix(_lookAtMatrix.lookAt(this.eye, _zeroVector, _unitY));
            }
            if (handle.name === 'X') {
              _tempQuaternion.setFromAxisAngle(_unitX, Math.atan2(-_alignVector.y, _alignVector.z));
              _tempQuaternion.multiplyQuaternions(_tempQuaternion2, _tempQuaternion);
              handle.quaternion.copy(_tempQuaternion);
            }
            if (handle.name === 'Y') {
              _tempQuaternion.setFromAxisAngle(_unitY, Math.atan2(_alignVector.x, _alignVector.z));
              _tempQuaternion.multiplyQuaternions(_tempQuaternion2, _tempQuaternion);
              handle.quaternion.copy(_tempQuaternion);
            }
            if (handle.name === 'Z') {
              _tempQuaternion.setFromAxisAngle(_unitZ, Math.atan2(_alignVector.y, _alignVector.x));
              _tempQuaternion.multiplyQuaternions(_tempQuaternion2, _tempQuaternion);
              handle.quaternion.copy(_tempQuaternion);
            }
          }

          // Hide disabled axes
          handle.visible = handle.visible && (handle.name.indexOf('X') === -1 || this.showX);
          handle.visible = handle.visible && (handle.name.indexOf('Y') === -1 || this.showY);
          handle.visible = handle.visible && (handle.name.indexOf('Z') === -1 || this.showZ);
          handle.visible = handle.visible && (handle.name.indexOf('E') === -1 || this.showX && this.showY && this.showZ);

          // highlight selected axis

          handle.material._color = handle.material._color || handle.material.color.clone();
          handle.material._opacity = handle.material._opacity || handle.material.opacity;
          handle.material.color.copy(handle.material._color);
          handle.material.opacity = handle.material._opacity;
          if (this.enabled && this.axis) {
            if (handle.name === this.axis) {
              handle.material.color.setHex(0xffff00);
              handle.material.opacity = 1.0;
            } else if (this.axis.split('').some(function (a) {
              return handle.name === a;
            })) {
              handle.material.color.setHex(0xffff00);
              handle.material.opacity = 1.0;
            }
          }
        }
        super.updateMatrixWorld(force);
      }
    }

    //

    class TransformControlsPlane extends THREE.Mesh {
      constructor() {
        super(new THREE.PlaneGeometry(100000, 100000, 2, 2), new THREE.MeshBasicMaterial({
          visible: false,
          wireframe: true,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.1,
          toneMapped: false
        }));
        this.isTransformControlsPlane = true;
        this.type = 'TransformControlsPlane';
      }
      updateMatrixWorld(force) {
        let space = this.space;
        this.position.copy(this.worldPosition);
        if (this.mode === 'scale') space = 'local'; // scale always oriented to local rotation

        _v1.copy(_unitX).applyQuaternion(space === 'local' ? this.worldQuaternion : _identityQuaternion);
        _v2.copy(_unitY).applyQuaternion(space === 'local' ? this.worldQuaternion : _identityQuaternion);
        _v3.copy(_unitZ).applyQuaternion(space === 'local' ? this.worldQuaternion : _identityQuaternion);

        // Align the plane for current transform mode, axis and space.

        _alignVector.copy(_v2);
        switch (this.mode) {
          case 'translate':
          case 'scale':
            switch (this.axis) {
              case 'X':
                _alignVector.copy(this.eye).cross(_v1);
                _dirVector.copy(_v1).cross(_alignVector);
                break;
              case 'Y':
                _alignVector.copy(this.eye).cross(_v2);
                _dirVector.copy(_v2).cross(_alignVector);
                break;
              case 'Z':
                _alignVector.copy(this.eye).cross(_v3);
                _dirVector.copy(_v3).cross(_alignVector);
                break;
              case 'XY':
                _dirVector.copy(_v3);
                break;
              case 'YZ':
                _dirVector.copy(_v1);
                break;
              case 'XZ':
                _alignVector.copy(_v3);
                _dirVector.copy(_v2);
                break;
              case 'XYZ':
              case 'E':
                _dirVector.set(0, 0, 0);
                break;
            }
            break;
          case 'rotate':
          default:
            // special case for rotate
            _dirVector.set(0, 0, 0);
        }
        if (_dirVector.length() === 0) {
          // If in rotate mode, make the plane parallel to camera
          this.quaternion.copy(this.cameraQuaternion);
        } else {
          _tempMatrix.lookAt(_tempVector.set(0, 0, 0), _dirVector, _alignVector);
          this.quaternion.setFromRotationMatrix(_tempMatrix);
        }
        super.updateMatrixWorld(force);
      }
    }

    const _plane = new THREE.Plane();
    const _raycaster = new THREE.Raycaster();
    const _pointer = new THREE.Vector2();
    const _offset = new THREE.Vector3();
    const _intersection = new THREE.Vector3();
    const _worldPosition = new THREE.Vector3();
    const _inverseMatrix = new THREE.Matrix4();
    class DragControls extends THREE.EventDispatcher {
      constructor(_objects, _camera, _domElement) {
        super();
        _domElement.style.touchAction = 'none'; // disable touch scroll

        let _selected = null,
          _hovered = null;
        const _intersections = [];

        //

        const scope = this;
        function activate() {
          _domElement.addEventListener('pointermove', onPointerMove);
          _domElement.addEventListener('pointerdown', onPointerDown);
          _domElement.addEventListener('pointerup', onPointerCancel);
          _domElement.addEventListener('pointerleave', onPointerCancel);
        }
        function deactivate() {
          _domElement.removeEventListener('pointermove', onPointerMove);
          _domElement.removeEventListener('pointerdown', onPointerDown);
          _domElement.removeEventListener('pointerup', onPointerCancel);
          _domElement.removeEventListener('pointerleave', onPointerCancel);
          _domElement.style.cursor = '';
        }
        function dispose() {
          deactivate();
        }
        function getObjects() {
          return _objects;
        }
        function getRaycaster() {
          return _raycaster;
        }
        function onPointerMove(event) {
          if (scope.enabled === false) return;
          updatePointer(event);
          _raycaster.setFromCamera(_pointer, _camera);
          if (_selected) {
            if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
              _selected.position.copy(_intersection.sub(_offset).applyMatrix4(_inverseMatrix));
            }
            scope.dispatchEvent({
              type: 'drag',
              object: _selected
            });
            return;
          }

          // hover support

          if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
            _intersections.length = 0;
            _raycaster.setFromCamera(_pointer, _camera);
            _raycaster.intersectObjects(_objects, true, _intersections);
            if (_intersections.length > 0) {
              const object = _intersections[0].object;
              _plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), _worldPosition.setFromMatrixPosition(object.matrixWorld));
              if (_hovered !== object && _hovered !== null) {
                scope.dispatchEvent({
                  type: 'hoveroff',
                  object: _hovered
                });
                _domElement.style.cursor = 'auto';
                _hovered = null;
              }
              if (_hovered !== object) {
                scope.dispatchEvent({
                  type: 'hoveron',
                  object: object
                });
                _domElement.style.cursor = 'pointer';
                _hovered = object;
              }
            } else {
              if (_hovered !== null) {
                scope.dispatchEvent({
                  type: 'hoveroff',
                  object: _hovered
                });
                _domElement.style.cursor = 'auto';
                _hovered = null;
              }
            }
          }
        }
        function onPointerDown(event) {
          if (scope.enabled === false) return;
          updatePointer(event);
          _intersections.length = 0;
          _raycaster.setFromCamera(_pointer, _camera);
          _raycaster.intersectObjects(_objects, true, _intersections);
          if (_intersections.length > 0) {
            _selected = scope.transformGroup === true ? _objects[0] : _intersections[0].object;
            _plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), _worldPosition.setFromMatrixPosition(_selected.matrixWorld));
            if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
              _inverseMatrix.copy(_selected.parent.matrixWorld).invert();
              _offset.copy(_intersection).sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld));
            }
            _domElement.style.cursor = 'move';
            scope.dispatchEvent({
              type: 'dragstart',
              object: _selected
            });
          }
        }
        function onPointerCancel() {
          if (scope.enabled === false) return;
          if (_selected) {
            scope.dispatchEvent({
              type: 'dragend',
              object: _selected
            });
            _selected = null;
          }
          _domElement.style.cursor = _hovered ? 'pointer' : 'auto';
        }
        function updatePointer(event) {
          const rect = _domElement.getBoundingClientRect();
          _pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
          _pointer.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
        }
        activate();

        // API

        this.enabled = true;
        this.transformGroup = false;
        this.activate = activate;
        this.deactivate = deactivate;
        this.dispose = dispose;
        this.getObjects = getObjects;
        this.getRaycaster = getRaycaster;
      }
    }

    var Control = /** @class */ (function () {
        function Control(options) {
            this.orbitControls = null;
            this.transformControls = null;
            this.camera = options.camera;
            this.renderer = options.renderer;
            this.scene = options.scene;
            this.init();
        }
        Control.prototype.init = function () {
            this.initOrbit();
        };
        Control.prototype.initOrbit = function () {
            this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
            // 使动画循环使用时阻尼或自转 意思是否有惯性
            this.orbitControls.enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            this.orbitControls.dampingFactor = 0.25;
            // 控制半球翻转
            this.orbitControls.maxPolarAngle = Math.PI / 2;
            this.orbitControls.autoRotate = false;
            this.orbitControls.autoRotateSpeed = -10;
            this.orbitControls.screenSpacePanning = false;
        };
        Control.prototype.initTransform = function (index) {
            var _this = this;
            //变换控制器
            this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
            this.transformControls.setSize(1);
            this.scene[index].attach(this.transformControls);
            this.transformControls.addEventListener("dragging-changed", function (e) {
                _this.orbitControls.enabled = !e.value;
            });
        };
        Control.prototype.initDrag = function (objects) {
            var controls = new DragControls(objects, this.camera, this.renderer.domElement);
            controls.addEventListener("dragstart", function (event) {
                console.log("event", event);
            });
            controls.addEventListener("dragend", function (event) {
                console.log("event", event);
            });
        };
        return Control;
    }());

    var Animate = /** @class */ (function () {
        function Animate(options) {
            this.clock = options.clock;
            this.animateFuntion = [];
            this.init();
        }
        Animate.prototype.init = function () {
            this.frameId = requestAnimationFrame(this.init.bind(this));
            var delta = this.clock.getDelta();
            this.animateFuntion.forEach(function (fn) { return fn(delta); });
        };
        return Animate;
    }());

    /**
     * @param {BufferGeometry} geometry
     * @param {number} drawMode
     * @return {BufferGeometry}
     */
    function toTrianglesDrawMode(geometry, drawMode) {
      if (drawMode === THREE.TrianglesDrawMode) {
        console.warn('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.');
        return geometry;
      }
      if (drawMode === THREE.TriangleFanDrawMode || drawMode === THREE.TriangleStripDrawMode) {
        let index = geometry.getIndex();

        // generate index if not present

        if (index === null) {
          const indices = [];
          const position = geometry.getAttribute('position');
          if (position !== undefined) {
            for (let i = 0; i < position.count; i++) {
              indices.push(i);
            }
            geometry.setIndex(indices);
            index = geometry.getIndex();
          } else {
            console.error('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.');
            return geometry;
          }
        }

        //

        const numberOfTriangles = index.count - 2;
        const newIndices = [];
        if (drawMode === THREE.TriangleFanDrawMode) {
          // gl.TRIANGLE_FAN

          for (let i = 1; i <= numberOfTriangles; i++) {
            newIndices.push(index.getX(0));
            newIndices.push(index.getX(i));
            newIndices.push(index.getX(i + 1));
          }
        } else {
          // gl.TRIANGLE_STRIP

          for (let i = 0; i < numberOfTriangles; i++) {
            if (i % 2 === 0) {
              newIndices.push(index.getX(i));
              newIndices.push(index.getX(i + 1));
              newIndices.push(index.getX(i + 2));
            } else {
              newIndices.push(index.getX(i + 2));
              newIndices.push(index.getX(i + 1));
              newIndices.push(index.getX(i));
            }
          }
        }
        if (newIndices.length / 3 !== numberOfTriangles) {
          console.error('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.');
        }

        // build final geometry

        const newGeometry = geometry.clone();
        newGeometry.setIndex(newIndices);
        newGeometry.clearGroups();
        return newGeometry;
      } else {
        console.error('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode);
        return geometry;
      }
    }

    class GLTFLoader extends THREE.Loader {
      constructor(manager) {
        super(manager);
        this.dracoLoader = null;
        this.ktx2Loader = null;
        this.meshoptDecoder = null;
        this.pluginCallbacks = [];
        this.register(function (parser) {
          return new GLTFMaterialsClearcoatExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFTextureBasisUExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFTextureWebPExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFTextureAVIFExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMaterialsSheenExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMaterialsTransmissionExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMaterialsVolumeExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMaterialsIorExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMaterialsEmissiveStrengthExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMaterialsSpecularExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMaterialsIridescenceExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFLightsExtension(parser);
        });
        this.register(function (parser) {
          return new GLTFMeshoptCompression(parser);
        });
        this.register(function (parser) {
          return new GLTFMeshGpuInstancing(parser);
        });
      }
      load(url, onLoad, onProgress, onError) {
        const scope = this;
        let resourcePath;
        if (this.resourcePath !== '') {
          resourcePath = this.resourcePath;
        } else if (this.path !== '') {
          resourcePath = this.path;
        } else {
          resourcePath = THREE.LoaderUtils.extractUrlBase(url);
        }

        // Tells the LoadingManager to track an extra item, which resolves after
        // the model is fully loaded. This means the count of items loaded will
        // be incorrect, but ensures manager.onLoad() does not fire early.
        this.manager.itemStart(url);
        const _onError = function (e) {
          if (onError) {
            onError(e);
          } else {
            console.error(e);
          }
          scope.manager.itemError(url);
          scope.manager.itemEnd(url);
        };
        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(url, function (data) {
          try {
            scope.parse(data, resourcePath, function (gltf) {
              onLoad(gltf);
              scope.manager.itemEnd(url);
            }, _onError);
          } catch (e) {
            _onError(e);
          }
        }, onProgress, _onError);
      }
      setDRACOLoader(dracoLoader) {
        this.dracoLoader = dracoLoader;
        return this;
      }
      setDDSLoader() {
        throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".');
      }
      setKTX2Loader(ktx2Loader) {
        this.ktx2Loader = ktx2Loader;
        return this;
      }
      setMeshoptDecoder(meshoptDecoder) {
        this.meshoptDecoder = meshoptDecoder;
        return this;
      }
      register(callback) {
        if (this.pluginCallbacks.indexOf(callback) === -1) {
          this.pluginCallbacks.push(callback);
        }
        return this;
      }
      unregister(callback) {
        if (this.pluginCallbacks.indexOf(callback) !== -1) {
          this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
        }
        return this;
      }
      parse(data, path, onLoad, onError) {
        let json;
        const extensions = {};
        const plugins = {};
        const textDecoder = new TextDecoder();
        if (typeof data === 'string') {
          json = JSON.parse(data);
        } else if (data instanceof ArrayBuffer) {
          const magic = textDecoder.decode(new Uint8Array(data, 0, 4));
          if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
            try {
              extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
            } catch (error) {
              if (onError) onError(error);
              return;
            }
            json = JSON.parse(extensions[EXTENSIONS.KHR_BINARY_GLTF].content);
          } else {
            json = JSON.parse(textDecoder.decode(data));
          }
        } else {
          json = data;
        }
        if (json.asset === undefined || json.asset.version[0] < 2) {
          if (onError) onError(new Error('THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.'));
          return;
        }
        const parser = new GLTFParser(json, {
          path: path || this.resourcePath || '',
          crossOrigin: this.crossOrigin,
          requestHeader: this.requestHeader,
          manager: this.manager,
          ktx2Loader: this.ktx2Loader,
          meshoptDecoder: this.meshoptDecoder
        });
        parser.fileLoader.setRequestHeader(this.requestHeader);
        for (let i = 0; i < this.pluginCallbacks.length; i++) {
          const plugin = this.pluginCallbacks[i](parser);
          plugins[plugin.name] = plugin;

          // Workaround to avoid determining as unknown extension
          // in addUnknownExtensionsToUserData().
          // Remove this workaround if we move all the existing
          // extension handlers to plugin system
          extensions[plugin.name] = true;
        }
        if (json.extensionsUsed) {
          for (let i = 0; i < json.extensionsUsed.length; ++i) {
            const extensionName = json.extensionsUsed[i];
            const extensionsRequired = json.extensionsRequired || [];
            switch (extensionName) {
              case EXTENSIONS.KHR_MATERIALS_UNLIT:
                extensions[extensionName] = new GLTFMaterialsUnlitExtension();
                break;
              case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
                extensions[extensionName] = new GLTFDracoMeshCompressionExtension(json, this.dracoLoader);
                break;
              case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
                extensions[extensionName] = new GLTFTextureTransformExtension();
                break;
              case EXTENSIONS.KHR_MESH_QUANTIZATION:
                extensions[extensionName] = new GLTFMeshQuantizationExtension();
                break;
              default:
                if (extensionsRequired.indexOf(extensionName) >= 0 && plugins[extensionName] === undefined) {
                  console.warn('THREE.GLTFLoader: Unknown extension "' + extensionName + '".');
                }
            }
          }
        }
        parser.setExtensions(extensions);
        parser.setPlugins(plugins);
        parser.parse(onLoad, onError);
      }
      parseAsync(data, path) {
        const scope = this;
        return new Promise(function (resolve, reject) {
          scope.parse(data, path, resolve, reject);
        });
      }
    }

    /* GLTFREGISTRY */

    function GLTFRegistry() {
      let objects = {};
      return {
        get: function (key) {
          return objects[key];
        },
        add: function (key, object) {
          objects[key] = object;
        },
        remove: function (key) {
          delete objects[key];
        },
        removeAll: function () {
          objects = {};
        }
      };
    }

    /*********************************/
    /********** EXTENSIONS ***********/
    /*********************************/

    const EXTENSIONS = {
      KHR_BINARY_GLTF: 'KHR_binary_glTF',
      KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
      KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
      KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
      KHR_MATERIALS_IOR: 'KHR_materials_ior',
      KHR_MATERIALS_SHEEN: 'KHR_materials_sheen',
      KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
      KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
      KHR_MATERIALS_IRIDESCENCE: 'KHR_materials_iridescence',
      KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
      KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
      KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
      KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
      KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
      KHR_MATERIALS_EMISSIVE_STRENGTH: 'KHR_materials_emissive_strength',
      EXT_TEXTURE_WEBP: 'EXT_texture_webp',
      EXT_TEXTURE_AVIF: 'EXT_texture_avif',
      EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
      EXT_MESH_GPU_INSTANCING: 'EXT_mesh_gpu_instancing'
    };

    /**
     * Punctual Lights Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
     */
    class GLTFLightsExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

        // Object3D instance caches
        this.cache = {
          refs: {},
          uses: {}
        };
      }
      _markDefs() {
        const parser = this.parser;
        const nodeDefs = this.parser.json.nodes || [];
        for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
          const nodeDef = nodeDefs[nodeIndex];
          if (nodeDef.extensions && nodeDef.extensions[this.name] && nodeDef.extensions[this.name].light !== undefined) {
            parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);
          }
        }
      }
      _loadLight(lightIndex) {
        const parser = this.parser;
        const cacheKey = 'light:' + lightIndex;
        let dependency = parser.cache.get(cacheKey);
        if (dependency) return dependency;
        const json = parser.json;
        const extensions = json.extensions && json.extensions[this.name] || {};
        const lightDefs = extensions.lights || [];
        const lightDef = lightDefs[lightIndex];
        let lightNode;
        const color = new THREE.Color(0xffffff);
        if (lightDef.color !== undefined) color.fromArray(lightDef.color);
        const range = lightDef.range !== undefined ? lightDef.range : 0;
        switch (lightDef.type) {
          case 'directional':
            lightNode = new THREE.DirectionalLight(color);
            lightNode.target.position.set(0, 0, -1);
            lightNode.add(lightNode.target);
            break;
          case 'point':
            lightNode = new THREE.PointLight(color);
            lightNode.distance = range;
            break;
          case 'spot':
            lightNode = new THREE.SpotLight(color);
            lightNode.distance = range;
            // Handle spotlight properties.
            lightDef.spot = lightDef.spot || {};
            lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
            lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
            lightNode.angle = lightDef.spot.outerConeAngle;
            lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
            lightNode.target.position.set(0, 0, -1);
            lightNode.add(lightNode.target);
            break;
          default:
            throw new Error('THREE.GLTFLoader: Unexpected light type: ' + lightDef.type);
        }

        // Some lights (e.g. spot) default to a position other than the origin. Reset the position
        // here, because node-level parsing will only override position if explicitly specified.
        lightNode.position.set(0, 0, 0);
        lightNode.decay = 2;
        assignExtrasToUserData(lightNode, lightDef);
        if (lightDef.intensity !== undefined) lightNode.intensity = lightDef.intensity;
        lightNode.name = parser.createUniqueName(lightDef.name || 'light_' + lightIndex);
        dependency = Promise.resolve(lightNode);
        parser.cache.add(cacheKey, dependency);
        return dependency;
      }
      getDependency(type, index) {
        if (type !== 'light') return;
        return this._loadLight(index);
      }
      createNodeAttachment(nodeIndex) {
        const self = this;
        const parser = this.parser;
        const json = parser.json;
        const nodeDef = json.nodes[nodeIndex];
        const lightDef = nodeDef.extensions && nodeDef.extensions[this.name] || {};
        const lightIndex = lightDef.light;
        if (lightIndex === undefined) return null;
        return this._loadLight(lightIndex).then(function (light) {
          return parser._getNodeRef(self.cache, lightIndex, light);
        });
      }
    }

    /**
     * Unlit Materials Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
     */
    class GLTFMaterialsUnlitExtension {
      constructor() {
        this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
      }
      getMaterialType() {
        return THREE.MeshBasicMaterial;
      }
      extendParams(materialParams, materialDef, parser) {
        const pending = [];
        materialParams.color = new THREE.Color(1.0, 1.0, 1.0);
        materialParams.opacity = 1.0;
        const metallicRoughness = materialDef.pbrMetallicRoughness;
        if (metallicRoughness) {
          if (Array.isArray(metallicRoughness.baseColorFactor)) {
            const array = metallicRoughness.baseColorFactor;
            materialParams.color.fromArray(array);
            materialParams.opacity = array[3];
          }
          if (metallicRoughness.baseColorTexture !== undefined) {
            pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture, THREE.sRGBEncoding));
          }
        }
        return Promise.all(pending);
      }
    }

    /**
     * Materials Emissive Strength Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
     */
    class GLTFMaterialsEmissiveStrengthExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const emissiveStrength = materialDef.extensions[this.name].emissiveStrength;
        if (emissiveStrength !== undefined) {
          materialParams.emissiveIntensity = emissiveStrength;
        }
        return Promise.resolve();
      }
    }

    /**
     * Clearcoat Materials Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
     */
    class GLTFMaterialsClearcoatExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;
      }
      getMaterialType(materialIndex) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
        return THREE.MeshPhysicalMaterial;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const pending = [];
        const extension = materialDef.extensions[this.name];
        if (extension.clearcoatFactor !== undefined) {
          materialParams.clearcoat = extension.clearcoatFactor;
        }
        if (extension.clearcoatTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'clearcoatMap', extension.clearcoatTexture));
        }
        if (extension.clearcoatRoughnessFactor !== undefined) {
          materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;
        }
        if (extension.clearcoatRoughnessTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture));
        }
        if (extension.clearcoatNormalTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture));
          if (extension.clearcoatNormalTexture.scale !== undefined) {
            const scale = extension.clearcoatNormalTexture.scale;
            materialParams.clearcoatNormalScale = new THREE.Vector2(scale, scale);
          }
        }
        return Promise.all(pending);
      }
    }

    /**
     * Iridescence Materials Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
     */
    class GLTFMaterialsIridescenceExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;
      }
      getMaterialType(materialIndex) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
        return THREE.MeshPhysicalMaterial;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const pending = [];
        const extension = materialDef.extensions[this.name];
        if (extension.iridescenceFactor !== undefined) {
          materialParams.iridescence = extension.iridescenceFactor;
        }
        if (extension.iridescenceTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'iridescenceMap', extension.iridescenceTexture));
        }
        if (extension.iridescenceIor !== undefined) {
          materialParams.iridescenceIOR = extension.iridescenceIor;
        }
        if (materialParams.iridescenceThicknessRange === undefined) {
          materialParams.iridescenceThicknessRange = [100, 400];
        }
        if (extension.iridescenceThicknessMinimum !== undefined) {
          materialParams.iridescenceThicknessRange[0] = extension.iridescenceThicknessMinimum;
        }
        if (extension.iridescenceThicknessMaximum !== undefined) {
          materialParams.iridescenceThicknessRange[1] = extension.iridescenceThicknessMaximum;
        }
        if (extension.iridescenceThicknessTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'iridescenceThicknessMap', extension.iridescenceThicknessTexture));
        }
        return Promise.all(pending);
      }
    }

    /**
     * Sheen Materials Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
     */
    class GLTFMaterialsSheenExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;
      }
      getMaterialType(materialIndex) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
        return THREE.MeshPhysicalMaterial;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const pending = [];
        materialParams.sheenColor = new THREE.Color(0, 0, 0);
        materialParams.sheenRoughness = 0;
        materialParams.sheen = 1;
        const extension = materialDef.extensions[this.name];
        if (extension.sheenColorFactor !== undefined) {
          materialParams.sheenColor.fromArray(extension.sheenColorFactor);
        }
        if (extension.sheenRoughnessFactor !== undefined) {
          materialParams.sheenRoughness = extension.sheenRoughnessFactor;
        }
        if (extension.sheenColorTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'sheenColorMap', extension.sheenColorTexture, THREE.sRGBEncoding));
        }
        if (extension.sheenRoughnessTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'sheenRoughnessMap', extension.sheenRoughnessTexture));
        }
        return Promise.all(pending);
      }
    }

    /**
     * Transmission Materials Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
     * Draft: https://github.com/KhronosGroup/glTF/pull/1698
     */
    class GLTFMaterialsTransmissionExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;
      }
      getMaterialType(materialIndex) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
        return THREE.MeshPhysicalMaterial;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const pending = [];
        const extension = materialDef.extensions[this.name];
        if (extension.transmissionFactor !== undefined) {
          materialParams.transmission = extension.transmissionFactor;
        }
        if (extension.transmissionTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'transmissionMap', extension.transmissionTexture));
        }
        return Promise.all(pending);
      }
    }

    /**
     * Materials Volume Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
     */
    class GLTFMaterialsVolumeExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;
      }
      getMaterialType(materialIndex) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
        return THREE.MeshPhysicalMaterial;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const pending = [];
        const extension = materialDef.extensions[this.name];
        materialParams.thickness = extension.thicknessFactor !== undefined ? extension.thicknessFactor : 0;
        if (extension.thicknessTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'thicknessMap', extension.thicknessTexture));
        }
        materialParams.attenuationDistance = extension.attenuationDistance || Infinity;
        const colorArray = extension.attenuationColor || [1, 1, 1];
        materialParams.attenuationColor = new THREE.Color(colorArray[0], colorArray[1], colorArray[2]);
        return Promise.all(pending);
      }
    }

    /**
     * Materials ior Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
     */
    class GLTFMaterialsIorExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_IOR;
      }
      getMaterialType(materialIndex) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
        return THREE.MeshPhysicalMaterial;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const extension = materialDef.extensions[this.name];
        materialParams.ior = extension.ior !== undefined ? extension.ior : 1.5;
        return Promise.resolve();
      }
    }

    /**
     * Materials specular Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
     */
    class GLTFMaterialsSpecularExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;
      }
      getMaterialType(materialIndex) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
        return THREE.MeshPhysicalMaterial;
      }
      extendMaterialParams(materialIndex, materialParams) {
        const parser = this.parser;
        const materialDef = parser.json.materials[materialIndex];
        if (!materialDef.extensions || !materialDef.extensions[this.name]) {
          return Promise.resolve();
        }
        const pending = [];
        const extension = materialDef.extensions[this.name];
        materialParams.specularIntensity = extension.specularFactor !== undefined ? extension.specularFactor : 1.0;
        if (extension.specularTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'specularIntensityMap', extension.specularTexture));
        }
        const colorArray = extension.specularColorFactor || [1, 1, 1];
        materialParams.specularColor = new THREE.Color(colorArray[0], colorArray[1], colorArray[2]);
        if (extension.specularColorTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'specularColorMap', extension.specularColorTexture, THREE.sRGBEncoding));
        }
        return Promise.all(pending);
      }
    }

    /**
     * BasisU Texture Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
     */
    class GLTFTextureBasisUExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.KHR_TEXTURE_BASISU;
      }
      loadTexture(textureIndex) {
        const parser = this.parser;
        const json = parser.json;
        const textureDef = json.textures[textureIndex];
        if (!textureDef.extensions || !textureDef.extensions[this.name]) {
          return null;
        }
        const extension = textureDef.extensions[this.name];
        const loader = parser.options.ktx2Loader;
        if (!loader) {
          if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
            throw new Error('THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures');
          } else {
            // Assumes that the extension is optional and that a fallback texture is present
            return null;
          }
        }
        return parser.loadTextureImage(textureIndex, extension.source, loader);
      }
    }

    /**
     * WebP Texture Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
     */
    class GLTFTextureWebPExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
        this.isSupported = null;
      }
      loadTexture(textureIndex) {
        const name = this.name;
        const parser = this.parser;
        const json = parser.json;
        const textureDef = json.textures[textureIndex];
        if (!textureDef.extensions || !textureDef.extensions[name]) {
          return null;
        }
        const extension = textureDef.extensions[name];
        const source = json.images[extension.source];
        let loader = parser.textureLoader;
        if (source.uri) {
          const handler = parser.options.manager.getHandler(source.uri);
          if (handler !== null) loader = handler;
        }
        return this.detectSupport().then(function (isSupported) {
          if (isSupported) return parser.loadTextureImage(textureIndex, extension.source, loader);
          if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {
            throw new Error('THREE.GLTFLoader: WebP required by asset but unsupported.');
          }

          // Fall back to PNG or JPEG.
          return parser.loadTexture(textureIndex);
        });
      }
      detectSupport() {
        if (!this.isSupported) {
          this.isSupported = new Promise(function (resolve) {
            const image = new Image();

            // Lossy test image. Support for lossy images doesn't guarantee support for all
            // WebP images, unfortunately.
            image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
            image.onload = image.onerror = function () {
              resolve(image.height === 1);
            };
          });
        }
        return this.isSupported;
      }
    }

    /**
     * AVIF Texture Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_avif
     */
    class GLTFTextureAVIFExtension {
      constructor(parser) {
        this.parser = parser;
        this.name = EXTENSIONS.EXT_TEXTURE_AVIF;
        this.isSupported = null;
      }
      loadTexture(textureIndex) {
        const name = this.name;
        const parser = this.parser;
        const json = parser.json;
        const textureDef = json.textures[textureIndex];
        if (!textureDef.extensions || !textureDef.extensions[name]) {
          return null;
        }
        const extension = textureDef.extensions[name];
        const source = json.images[extension.source];
        let loader = parser.textureLoader;
        if (source.uri) {
          const handler = parser.options.manager.getHandler(source.uri);
          if (handler !== null) loader = handler;
        }
        return this.detectSupport().then(function (isSupported) {
          if (isSupported) return parser.loadTextureImage(textureIndex, extension.source, loader);
          if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {
            throw new Error('THREE.GLTFLoader: AVIF required by asset but unsupported.');
          }

          // Fall back to PNG or JPEG.
          return parser.loadTexture(textureIndex);
        });
      }
      detectSupport() {
        if (!this.isSupported) {
          this.isSupported = new Promise(function (resolve) {
            const image = new Image();

            // Lossy test image.
            image.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
            image.onload = image.onerror = function () {
              resolve(image.height === 1);
            };
          });
        }
        return this.isSupported;
      }
    }

    /**
     * meshopt BufferView Compression Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
     */
    class GLTFMeshoptCompression {
      constructor(parser) {
        this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
        this.parser = parser;
      }
      loadBufferView(index) {
        const json = this.parser.json;
        const bufferView = json.bufferViews[index];
        if (bufferView.extensions && bufferView.extensions[this.name]) {
          const extensionDef = bufferView.extensions[this.name];
          const buffer = this.parser.getDependency('buffer', extensionDef.buffer);
          const decoder = this.parser.options.meshoptDecoder;
          if (!decoder || !decoder.supported) {
            if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
              throw new Error('THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files');
            } else {
              // Assumes that the extension is optional and that fallback buffer data is present
              return null;
            }
          }
          return buffer.then(function (res) {
            const byteOffset = extensionDef.byteOffset || 0;
            const byteLength = extensionDef.byteLength || 0;
            const count = extensionDef.count;
            const stride = extensionDef.byteStride;
            const source = new Uint8Array(res, byteOffset, byteLength);
            if (decoder.decodeGltfBufferAsync) {
              return decoder.decodeGltfBufferAsync(count, stride, source, extensionDef.mode, extensionDef.filter).then(function (res) {
                return res.buffer;
              });
            } else {
              // Support for MeshoptDecoder 0.18 or earlier, without decodeGltfBufferAsync
              return decoder.ready.then(function () {
                const result = new ArrayBuffer(count * stride);
                decoder.decodeGltfBuffer(new Uint8Array(result), count, stride, source, extensionDef.mode, extensionDef.filter);
                return result;
              });
            }
          });
        } else {
          return null;
        }
      }
    }

    /**
     * GPU Instancing Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing
     *
     */
    class GLTFMeshGpuInstancing {
      constructor(parser) {
        this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
        this.parser = parser;
      }
      createNodeMesh(nodeIndex) {
        const json = this.parser.json;
        const nodeDef = json.nodes[nodeIndex];
        if (!nodeDef.extensions || !nodeDef.extensions[this.name] || nodeDef.mesh === undefined) {
          return null;
        }
        const meshDef = json.meshes[nodeDef.mesh];

        // No Points or Lines + Instancing support yet

        for (const primitive of meshDef.primitives) {
          if (primitive.mode !== WEBGL_CONSTANTS.TRIANGLES && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN && primitive.mode !== undefined) {
            return null;
          }
        }
        const extensionDef = nodeDef.extensions[this.name];
        const attributesDef = extensionDef.attributes;

        // @TODO: Can we support InstancedMesh + SkinnedMesh?

        const pending = [];
        const attributes = {};
        for (const key in attributesDef) {
          pending.push(this.parser.getDependency('accessor', attributesDef[key]).then(accessor => {
            attributes[key] = accessor;
            return attributes[key];
          }));
        }
        if (pending.length < 1) {
          return null;
        }
        pending.push(this.parser.createNodeMesh(nodeIndex));
        return Promise.all(pending).then(results => {
          const nodeObject = results.pop();
          const meshes = nodeObject.isGroup ? nodeObject.children : [nodeObject];
          const count = results[0].count; // All attribute counts should be same
          const instancedMeshes = [];
          for (const mesh of meshes) {
            // Temporal variables
            const m = new THREE.Matrix4();
            const p = new THREE.Vector3();
            const q = new THREE.Quaternion();
            const s = new THREE.Vector3(1, 1, 1);
            const instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, count);
            for (let i = 0; i < count; i++) {
              if (attributes.TRANSLATION) {
                p.fromBufferAttribute(attributes.TRANSLATION, i);
              }
              if (attributes.ROTATION) {
                q.fromBufferAttribute(attributes.ROTATION, i);
              }
              if (attributes.SCALE) {
                s.fromBufferAttribute(attributes.SCALE, i);
              }
              instancedMesh.setMatrixAt(i, m.compose(p, q, s));
            }

            // Add instance attributes to the geometry, excluding TRS.
            for (const attributeName in attributes) {
              if (attributeName !== 'TRANSLATION' && attributeName !== 'ROTATION' && attributeName !== 'SCALE') {
                mesh.geometry.setAttribute(attributeName, attributes[attributeName]);
              }
            }

            // Just in case
            THREE.Object3D.prototype.copy.call(instancedMesh, mesh);
            this.parser.assignFinalMaterial(instancedMesh);
            instancedMeshes.push(instancedMesh);
          }
          if (nodeObject.isGroup) {
            nodeObject.clear();
            nodeObject.add(...instancedMeshes);
            return nodeObject;
          }
          return instancedMeshes[0];
        });
      }
    }

    /* BINARY EXTENSION */
    const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
    const BINARY_EXTENSION_HEADER_LENGTH = 12;
    const BINARY_EXTENSION_CHUNK_TYPES = {
      JSON: 0x4E4F534A,
      BIN: 0x004E4942
    };
    class GLTFBinaryExtension {
      constructor(data) {
        this.name = EXTENSIONS.KHR_BINARY_GLTF;
        this.content = null;
        this.body = null;
        const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
        const textDecoder = new TextDecoder();
        this.header = {
          magic: textDecoder.decode(new Uint8Array(data.slice(0, 4))),
          version: headerView.getUint32(4, true),
          length: headerView.getUint32(8, true)
        };
        if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
          throw new Error('THREE.GLTFLoader: Unsupported glTF-Binary header.');
        } else if (this.header.version < 2.0) {
          throw new Error('THREE.GLTFLoader: Legacy binary file detected.');
        }
        const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
        const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
        let chunkIndex = 0;
        while (chunkIndex < chunkContentsLength) {
          const chunkLength = chunkView.getUint32(chunkIndex, true);
          chunkIndex += 4;
          const chunkType = chunkView.getUint32(chunkIndex, true);
          chunkIndex += 4;
          if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
            const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
            this.content = textDecoder.decode(contentArray);
          } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
            const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
            this.body = data.slice(byteOffset, byteOffset + chunkLength);
          }

          // Clients must ignore chunks with unknown types.

          chunkIndex += chunkLength;
        }
        if (this.content === null) {
          throw new Error('THREE.GLTFLoader: JSON content not found.');
        }
      }
    }

    /**
     * DRACO Mesh Compression Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
     */
    class GLTFDracoMeshCompressionExtension {
      constructor(json, dracoLoader) {
        if (!dracoLoader) {
          throw new Error('THREE.GLTFLoader: No DRACOLoader instance provided.');
        }
        this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
        this.json = json;
        this.dracoLoader = dracoLoader;
        this.dracoLoader.preload();
      }
      decodePrimitive(primitive, parser) {
        const json = this.json;
        const dracoLoader = this.dracoLoader;
        const bufferViewIndex = primitive.extensions[this.name].bufferView;
        const gltfAttributeMap = primitive.extensions[this.name].attributes;
        const threeAttributeMap = {};
        const attributeNormalizedMap = {};
        const attributeTypeMap = {};
        for (const attributeName in gltfAttributeMap) {
          const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
          threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName];
        }
        for (const attributeName in primitive.attributes) {
          const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
          if (gltfAttributeMap[attributeName] !== undefined) {
            const accessorDef = json.accessors[primitive.attributes[attributeName]];
            const componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
            attributeTypeMap[threeAttributeName] = componentType.name;
            attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true;
          }
        }
        return parser.getDependency('bufferView', bufferViewIndex).then(function (bufferView) {
          return new Promise(function (resolve) {
            dracoLoader.decodeDracoFile(bufferView, function (geometry) {
              for (const attributeName in geometry.attributes) {
                const attribute = geometry.attributes[attributeName];
                const normalized = attributeNormalizedMap[attributeName];
                if (normalized !== undefined) attribute.normalized = normalized;
              }
              resolve(geometry);
            }, threeAttributeMap, attributeTypeMap);
          });
        });
      }
    }

    /**
     * Texture Transform Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
     */
    class GLTFTextureTransformExtension {
      constructor() {
        this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;
      }
      extendTexture(texture, transform) {
        if ((transform.texCoord === undefined || transform.texCoord === texture.channel) && transform.offset === undefined && transform.rotation === undefined && transform.scale === undefined) {
          // See https://github.com/mrdoob/three.js/issues/21819.
          return texture;
        }
        texture = texture.clone();
        if (transform.texCoord !== undefined) {
          texture.channel = transform.texCoord;
        }
        if (transform.offset !== undefined) {
          texture.offset.fromArray(transform.offset);
        }
        if (transform.rotation !== undefined) {
          texture.rotation = transform.rotation;
        }
        if (transform.scale !== undefined) {
          texture.repeat.fromArray(transform.scale);
        }
        texture.needsUpdate = true;
        return texture;
      }
    }

    /**
     * Mesh Quantization Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
     */
    class GLTFMeshQuantizationExtension {
      constructor() {
        this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;
      }
    }

    /*********************************/
    /********** INTERPOLATION ********/
    /*********************************/

    // Spline Interpolation
    // Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
    class GLTFCubicSplineInterpolant extends THREE.Interpolant {
      constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        super(parameterPositions, sampleValues, sampleSize, resultBuffer);
      }
      copySampleValue_(index) {
        // Copies a sample value to the result buffer. See description of glTF
        // CUBICSPLINE values layout in interpolate_() function below.

        const result = this.resultBuffer,
          values = this.sampleValues,
          valueSize = this.valueSize,
          offset = index * valueSize * 3 + valueSize;
        for (let i = 0; i !== valueSize; i++) {
          result[i] = values[offset + i];
        }
        return result;
      }
      interpolate_(i1, t0, t, t1) {
        const result = this.resultBuffer;
        const values = this.sampleValues;
        const stride = this.valueSize;
        const stride2 = stride * 2;
        const stride3 = stride * 3;
        const td = t1 - t0;
        const p = (t - t0) / td;
        const pp = p * p;
        const ppp = pp * p;
        const offset1 = i1 * stride3;
        const offset0 = offset1 - stride3;
        const s2 = -2 * ppp + 3 * pp;
        const s3 = ppp - pp;
        const s0 = 1 - s2;
        const s1 = s3 - pp + p;

        // Layout of keyframe output values for CUBICSPLINE animations:
        //   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
        for (let i = 0; i !== stride; i++) {
          const p0 = values[offset0 + i + stride]; // splineVertex_k
          const m0 = values[offset0 + i + stride2] * td; // outTangent_k * (t_k+1 - t_k)
          const p1 = values[offset1 + i + stride]; // splineVertex_k+1
          const m1 = values[offset1 + i] * td; // inTangent_k+1 * (t_k+1 - t_k)

          result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
        }
        return result;
      }
    }
    const _q = new THREE.Quaternion();
    class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {
      interpolate_(i1, t0, t, t1) {
        const result = super.interpolate_(i1, t0, t, t1);
        _q.fromArray(result).normalize().toArray(result);
        return result;
      }
    }

    /*********************************/
    /********** INTERNALS ************/
    /*********************************/

    /* CONSTANTS */

    const WEBGL_CONSTANTS = {
      FLOAT: 5126,
      //FLOAT_MAT2: 35674,
      FLOAT_MAT3: 35675,
      FLOAT_MAT4: 35676,
      FLOAT_VEC2: 35664,
      FLOAT_VEC3: 35665,
      FLOAT_VEC4: 35666,
      LINEAR: 9729,
      REPEAT: 10497,
      SAMPLER_2D: 35678,
      POINTS: 0,
      LINES: 1,
      LINE_LOOP: 2,
      LINE_STRIP: 3,
      TRIANGLES: 4,
      TRIANGLE_STRIP: 5,
      TRIANGLE_FAN: 6,
      UNSIGNED_BYTE: 5121,
      UNSIGNED_SHORT: 5123
    };
    const WEBGL_COMPONENT_TYPES = {
      5120: Int8Array,
      5121: Uint8Array,
      5122: Int16Array,
      5123: Uint16Array,
      5125: Uint32Array,
      5126: Float32Array
    };
    const WEBGL_FILTERS = {
      9728: THREE.NearestFilter,
      9729: THREE.LinearFilter,
      9984: THREE.NearestMipmapNearestFilter,
      9985: THREE.LinearMipmapNearestFilter,
      9986: THREE.NearestMipmapLinearFilter,
      9987: THREE.LinearMipmapLinearFilter
    };
    const WEBGL_WRAPPINGS = {
      33071: THREE.ClampToEdgeWrapping,
      33648: THREE.MirroredRepeatWrapping,
      10497: THREE.RepeatWrapping
    };
    const WEBGL_TYPE_SIZES = {
      'SCALAR': 1,
      'VEC2': 2,
      'VEC3': 3,
      'VEC4': 4,
      'MAT2': 4,
      'MAT3': 9,
      'MAT4': 16
    };
    const ATTRIBUTES = {
      POSITION: 'position',
      NORMAL: 'normal',
      TANGENT: 'tangent',
      TEXCOORD_0: 'uv',
      TEXCOORD_1: 'uv2',
      COLOR_0: 'color',
      WEIGHTS_0: 'skinWeight',
      JOINTS_0: 'skinIndex'
    };
    const PATH_PROPERTIES = {
      scale: 'scale',
      translation: 'position',
      rotation: 'quaternion',
      weights: 'morphTargetInfluences'
    };
    const INTERPOLATION = {
      CUBICSPLINE: undefined,
      // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
      // keyframe track will be initialized with a default interpolation type, then modified.
      LINEAR: THREE.InterpolateLinear,
      STEP: THREE.InterpolateDiscrete
    };
    const ALPHA_MODES = {
      OPAQUE: 'OPAQUE',
      MASK: 'MASK',
      BLEND: 'BLEND'
    };

    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
     */
    function createDefaultMaterial(cache) {
      if (cache['DefaultMaterial'] === undefined) {
        cache['DefaultMaterial'] = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          emissive: 0x000000,
          metalness: 1,
          roughness: 1,
          transparent: false,
          depthTest: true,
          side: THREE.FrontSide
        });
      }
      return cache['DefaultMaterial'];
    }
    function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
      // Add unknown glTF extensions to an object's userData.

      for (const name in objectDef.extensions) {
        if (knownExtensions[name] === undefined) {
          object.userData.gltfExtensions = object.userData.gltfExtensions || {};
          object.userData.gltfExtensions[name] = objectDef.extensions[name];
        }
      }
    }

    /**
     * @param {Object3D|Material|BufferGeometry} object
     * @param {GLTF.definition} gltfDef
     */
    function assignExtrasToUserData(object, gltfDef) {
      if (gltfDef.extras !== undefined) {
        if (typeof gltfDef.extras === 'object') {
          Object.assign(object.userData, gltfDef.extras);
        } else {
          console.warn('THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras);
        }
      }
    }

    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
     *
     * @param {BufferGeometry} geometry
     * @param {Array<GLTF.Target>} targets
     * @param {GLTFParser} parser
     * @return {Promise<BufferGeometry>}
     */
    function addMorphTargets(geometry, targets, parser) {
      let hasMorphPosition = false;
      let hasMorphNormal = false;
      let hasMorphColor = false;
      for (let i = 0, il = targets.length; i < il; i++) {
        const target = targets[i];
        if (target.POSITION !== undefined) hasMorphPosition = true;
        if (target.NORMAL !== undefined) hasMorphNormal = true;
        if (target.COLOR_0 !== undefined) hasMorphColor = true;
        if (hasMorphPosition && hasMorphNormal && hasMorphColor) break;
      }
      if (!hasMorphPosition && !hasMorphNormal && !hasMorphColor) return Promise.resolve(geometry);
      const pendingPositionAccessors = [];
      const pendingNormalAccessors = [];
      const pendingColorAccessors = [];
      for (let i = 0, il = targets.length; i < il; i++) {
        const target = targets[i];
        if (hasMorphPosition) {
          const pendingAccessor = target.POSITION !== undefined ? parser.getDependency('accessor', target.POSITION) : geometry.attributes.position;
          pendingPositionAccessors.push(pendingAccessor);
        }
        if (hasMorphNormal) {
          const pendingAccessor = target.NORMAL !== undefined ? parser.getDependency('accessor', target.NORMAL) : geometry.attributes.normal;
          pendingNormalAccessors.push(pendingAccessor);
        }
        if (hasMorphColor) {
          const pendingAccessor = target.COLOR_0 !== undefined ? parser.getDependency('accessor', target.COLOR_0) : geometry.attributes.color;
          pendingColorAccessors.push(pendingAccessor);
        }
      }
      return Promise.all([Promise.all(pendingPositionAccessors), Promise.all(pendingNormalAccessors), Promise.all(pendingColorAccessors)]).then(function (accessors) {
        const morphPositions = accessors[0];
        const morphNormals = accessors[1];
        const morphColors = accessors[2];
        if (hasMorphPosition) geometry.morphAttributes.position = morphPositions;
        if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals;
        if (hasMorphColor) geometry.morphAttributes.color = morphColors;
        geometry.morphTargetsRelative = true;
        return geometry;
      });
    }

    /**
     * @param {Mesh} mesh
     * @param {GLTF.Mesh} meshDef
     */
    function updateMorphTargets(mesh, meshDef) {
      mesh.updateMorphTargets();
      if (meshDef.weights !== undefined) {
        for (let i = 0, il = meshDef.weights.length; i < il; i++) {
          mesh.morphTargetInfluences[i] = meshDef.weights[i];
        }
      }

      // .extras has user-defined data, so check that .extras.targetNames is an array.
      if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
        const targetNames = meshDef.extras.targetNames;
        if (mesh.morphTargetInfluences.length === targetNames.length) {
          mesh.morphTargetDictionary = {};
          for (let i = 0, il = targetNames.length; i < il; i++) {
            mesh.morphTargetDictionary[targetNames[i]] = i;
          }
        } else {
          console.warn('THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.');
        }
      }
    }
    function createPrimitiveKey(primitiveDef) {
      const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
      let geometryKey;
      if (dracoExtension) {
        geometryKey = 'draco:' + dracoExtension.bufferView + ':' + dracoExtension.indices + ':' + createAttributesKey(dracoExtension.attributes);
      } else {
        geometryKey = primitiveDef.indices + ':' + createAttributesKey(primitiveDef.attributes) + ':' + primitiveDef.mode;
      }
      return geometryKey;
    }
    function createAttributesKey(attributes) {
      let attributesKey = '';
      const keys = Object.keys(attributes).sort();
      for (let i = 0, il = keys.length; i < il; i++) {
        attributesKey += keys[i] + ':' + attributes[keys[i]] + ';';
      }
      return attributesKey;
    }
    function getNormalizedComponentScale(constructor) {
      // Reference:
      // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data

      switch (constructor) {
        case Int8Array:
          return 1 / 127;
        case Uint8Array:
          return 1 / 255;
        case Int16Array:
          return 1 / 32767;
        case Uint16Array:
          return 1 / 65535;
        default:
          throw new Error('THREE.GLTFLoader: Unsupported normalized accessor component type.');
      }
    }
    function getImageURIMimeType(uri) {
      if (uri.search(/\.jpe?g($|\?)/i) > 0 || uri.search(/^data\:image\/jpeg/) === 0) return 'image/jpeg';
      if (uri.search(/\.webp($|\?)/i) > 0 || uri.search(/^data\:image\/webp/) === 0) return 'image/webp';
      return 'image/png';
    }
    const _identityMatrix = new THREE.Matrix4();

    /* GLTF PARSER */

    class GLTFParser {
      constructor(json = {}, options = {}) {
        this.json = json;
        this.extensions = {};
        this.plugins = {};
        this.options = options;

        // loader object cache
        this.cache = new GLTFRegistry();

        // associations between Three.js objects and glTF elements
        this.associations = new Map();

        // BufferGeometry caching
        this.primitiveCache = {};

        // Node cache
        this.nodeCache = {};

        // Object3D instance caches
        this.meshCache = {
          refs: {},
          uses: {}
        };
        this.cameraCache = {
          refs: {},
          uses: {}
        };
        this.lightCache = {
          refs: {},
          uses: {}
        };
        this.sourceCache = {};
        this.textureCache = {};

        // Track node names, to ensure no duplicates
        this.nodeNamesUsed = {};

        // Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
        // expensive work of uploading a texture to the GPU off the main thread.

        let isSafari = false;
        let isFirefox = false;
        let firefoxVersion = -1;
        if (typeof navigator !== 'undefined') {
          isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === true;
          isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
          firefoxVersion = isFirefox ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1;
        }
        if (typeof createImageBitmap === 'undefined' || isSafari || isFirefox && firefoxVersion < 98) {
          this.textureLoader = new THREE.TextureLoader(this.options.manager);
        } else {
          this.textureLoader = new THREE.ImageBitmapLoader(this.options.manager);
        }
        this.textureLoader.setCrossOrigin(this.options.crossOrigin);
        this.textureLoader.setRequestHeader(this.options.requestHeader);
        this.fileLoader = new THREE.FileLoader(this.options.manager);
        this.fileLoader.setResponseType('arraybuffer');
        if (this.options.crossOrigin === 'use-credentials') {
          this.fileLoader.setWithCredentials(true);
        }
      }
      setExtensions(extensions) {
        this.extensions = extensions;
      }
      setPlugins(plugins) {
        this.plugins = plugins;
      }
      parse(onLoad, onError) {
        const parser = this;
        const json = this.json;
        const extensions = this.extensions;

        // Clear the loader cache
        this.cache.removeAll();
        this.nodeCache = {};

        // Mark the special nodes/meshes in json for efficient parse
        this._invokeAll(function (ext) {
          return ext._markDefs && ext._markDefs();
        });
        Promise.all(this._invokeAll(function (ext) {
          return ext.beforeRoot && ext.beforeRoot();
        })).then(function () {
          return Promise.all([parser.getDependencies('scene'), parser.getDependencies('animation'), parser.getDependencies('camera')]);
        }).then(function (dependencies) {
          const result = {
            scene: dependencies[0][json.scene || 0],
            scenes: dependencies[0],
            animations: dependencies[1],
            cameras: dependencies[2],
            asset: json.asset,
            parser: parser,
            userData: {}
          };
          addUnknownExtensionsToUserData(extensions, result, json);
          assignExtrasToUserData(result, json);
          Promise.all(parser._invokeAll(function (ext) {
            return ext.afterRoot && ext.afterRoot(result);
          })).then(function () {
            onLoad(result);
          });
        }).catch(onError);
      }

      /**
       * Marks the special nodes/meshes in json for efficient parse.
       */
      _markDefs() {
        const nodeDefs = this.json.nodes || [];
        const skinDefs = this.json.skins || [];
        const meshDefs = this.json.meshes || [];

        // Nothing in the node definition indicates whether it is a Bone or an
        // Object3D. Use the skins' joint references to mark bones.
        for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
          const joints = skinDefs[skinIndex].joints;
          for (let i = 0, il = joints.length; i < il; i++) {
            nodeDefs[joints[i]].isBone = true;
          }
        }

        // Iterate over all nodes, marking references to shared resources,
        // as well as skeleton joints.
        for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
          const nodeDef = nodeDefs[nodeIndex];
          if (nodeDef.mesh !== undefined) {
            this._addNodeRef(this.meshCache, nodeDef.mesh);

            // Nothing in the mesh definition indicates whether it is
            // a SkinnedMesh or Mesh. Use the node's mesh reference
            // to mark SkinnedMesh if node has skin.
            if (nodeDef.skin !== undefined) {
              meshDefs[nodeDef.mesh].isSkinnedMesh = true;
            }
          }
          if (nodeDef.camera !== undefined) {
            this._addNodeRef(this.cameraCache, nodeDef.camera);
          }
        }
      }

      /**
       * Counts references to shared node / Object3D resources. These resources
       * can be reused, or "instantiated", at multiple nodes in the scene
       * hierarchy. Mesh, Camera, and Light instances are instantiated and must
       * be marked. Non-scenegraph resources (like Materials, Geometries, and
       * Textures) can be reused directly and are not marked here.
       *
       * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
       */
      _addNodeRef(cache, index) {
        if (index === undefined) return;
        if (cache.refs[index] === undefined) {
          cache.refs[index] = cache.uses[index] = 0;
        }
        cache.refs[index]++;
      }

      /** Returns a reference to a shared resource, cloning it if necessary. */
      _getNodeRef(cache, index, object) {
        if (cache.refs[index] <= 1) return object;
        const ref = object.clone();

        // Propagates mappings to the cloned object, prevents mappings on the
        // original object from being lost.
        const updateMappings = (original, clone) => {
          const mappings = this.associations.get(original);
          if (mappings != null) {
            this.associations.set(clone, mappings);
          }
          for (const [i, child] of original.children.entries()) {
            updateMappings(child, clone.children[i]);
          }
        };
        updateMappings(object, ref);
        ref.name += '_instance_' + cache.uses[index]++;
        return ref;
      }
      _invokeOne(func) {
        const extensions = Object.values(this.plugins);
        extensions.push(this);
        for (let i = 0; i < extensions.length; i++) {
          const result = func(extensions[i]);
          if (result) return result;
        }
        return null;
      }
      _invokeAll(func) {
        const extensions = Object.values(this.plugins);
        extensions.unshift(this);
        const pending = [];
        for (let i = 0; i < extensions.length; i++) {
          const result = func(extensions[i]);
          if (result) pending.push(result);
        }
        return pending;
      }

      /**
       * Requests the specified dependency asynchronously, with caching.
       * @param {string} type
       * @param {number} index
       * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
       */
      getDependency(type, index) {
        const cacheKey = type + ':' + index;
        let dependency = this.cache.get(cacheKey);
        if (!dependency) {
          switch (type) {
            case 'scene':
              dependency = this.loadScene(index);
              break;
            case 'node':
              dependency = this._invokeOne(function (ext) {
                return ext.loadNode && ext.loadNode(index);
              });
              break;
            case 'mesh':
              dependency = this._invokeOne(function (ext) {
                return ext.loadMesh && ext.loadMesh(index);
              });
              break;
            case 'accessor':
              dependency = this.loadAccessor(index);
              break;
            case 'bufferView':
              dependency = this._invokeOne(function (ext) {
                return ext.loadBufferView && ext.loadBufferView(index);
              });
              break;
            case 'buffer':
              dependency = this.loadBuffer(index);
              break;
            case 'material':
              dependency = this._invokeOne(function (ext) {
                return ext.loadMaterial && ext.loadMaterial(index);
              });
              break;
            case 'texture':
              dependency = this._invokeOne(function (ext) {
                return ext.loadTexture && ext.loadTexture(index);
              });
              break;
            case 'skin':
              dependency = this.loadSkin(index);
              break;
            case 'animation':
              dependency = this._invokeOne(function (ext) {
                return ext.loadAnimation && ext.loadAnimation(index);
              });
              break;
            case 'camera':
              dependency = this.loadCamera(index);
              break;
            default:
              dependency = this._invokeOne(function (ext) {
                return ext != this && ext.getDependency && ext.getDependency(type, index);
              });
              if (!dependency) {
                throw new Error('Unknown type: ' + type);
              }
              break;
          }
          this.cache.add(cacheKey, dependency);
        }
        return dependency;
      }

      /**
       * Requests all dependencies of the specified type asynchronously, with caching.
       * @param {string} type
       * @return {Promise<Array<Object>>}
       */
      getDependencies(type) {
        let dependencies = this.cache.get(type);
        if (!dependencies) {
          const parser = this;
          const defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || [];
          dependencies = Promise.all(defs.map(function (def, index) {
            return parser.getDependency(type, index);
          }));
          this.cache.add(type, dependencies);
        }
        return dependencies;
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
       * @param {number} bufferIndex
       * @return {Promise<ArrayBuffer>}
       */
      loadBuffer(bufferIndex) {
        const bufferDef = this.json.buffers[bufferIndex];
        const loader = this.fileLoader;
        if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
          throw new Error('THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.');
        }

        // If present, GLB container is required to be the first buffer.
        if (bufferDef.uri === undefined && bufferIndex === 0) {
          return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
        }
        const options = this.options;
        return new Promise(function (resolve, reject) {
          loader.load(THREE.LoaderUtils.resolveURL(bufferDef.uri, options.path), resolve, undefined, function () {
            reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
          });
        });
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
       * @param {number} bufferViewIndex
       * @return {Promise<ArrayBuffer>}
       */
      loadBufferView(bufferViewIndex) {
        const bufferViewDef = this.json.bufferViews[bufferViewIndex];
        return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {
          const byteLength = bufferViewDef.byteLength || 0;
          const byteOffset = bufferViewDef.byteOffset || 0;
          return buffer.slice(byteOffset, byteOffset + byteLength);
        });
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
       * @param {number} accessorIndex
       * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
       */
      loadAccessor(accessorIndex) {
        const parser = this;
        const json = this.json;
        const accessorDef = this.json.accessors[accessorIndex];
        if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
          const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
          const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
          const normalized = accessorDef.normalized === true;
          const array = new TypedArray(accessorDef.count * itemSize);
          return Promise.resolve(new THREE.BufferAttribute(array, itemSize, normalized));
        }
        const pendingBufferViews = [];
        if (accessorDef.bufferView !== undefined) {
          pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView));
        } else {
          pendingBufferViews.push(null);
        }
        if (accessorDef.sparse !== undefined) {
          pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.indices.bufferView));
          pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.values.bufferView));
        }
        return Promise.all(pendingBufferViews).then(function (bufferViews) {
          const bufferView = bufferViews[0];
          const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
          const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];

          // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
          const elementBytes = TypedArray.BYTES_PER_ELEMENT;
          const itemBytes = elementBytes * itemSize;
          const byteOffset = accessorDef.byteOffset || 0;
          const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[accessorDef.bufferView].byteStride : undefined;
          const normalized = accessorDef.normalized === true;
          let array, bufferAttribute;

          // The buffer is not interleaved if the stride is the item size in bytes.
          if (byteStride && byteStride !== itemBytes) {
            // Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
            // This makes sure that IBA.count reflects accessor.count properly
            const ibSlice = Math.floor(byteOffset / byteStride);
            const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
            let ib = parser.cache.get(ibCacheKey);
            if (!ib) {
              array = new TypedArray(bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes);

              // Integer parameters to IB/IBA are in array elements, not bytes.
              ib = new THREE.InterleavedBuffer(array, byteStride / elementBytes);
              parser.cache.add(ibCacheKey, ib);
            }
            bufferAttribute = new THREE.InterleavedBufferAttribute(ib, itemSize, byteOffset % byteStride / elementBytes, normalized);
          } else {
            if (bufferView === null) {
              array = new TypedArray(accessorDef.count * itemSize);
            } else {
              array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
            }
            bufferAttribute = new THREE.BufferAttribute(array, itemSize, normalized);
          }

          // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
          if (accessorDef.sparse !== undefined) {
            const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
            const TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
            const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
            const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
            const sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
            const sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
            if (bufferView !== null) {
              // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
              bufferAttribute = new THREE.BufferAttribute(bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized);
            }
            for (let i = 0, il = sparseIndices.length; i < il; i++) {
              const index = sparseIndices[i];
              bufferAttribute.setX(index, sparseValues[i * itemSize]);
              if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
              if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
              if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
              if (itemSize >= 5) throw new Error('THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.');
            }
          }
          return bufferAttribute;
        });
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
       * @param {number} textureIndex
       * @return {Promise<THREE.Texture|null>}
       */
      loadTexture(textureIndex) {
        const json = this.json;
        const options = this.options;
        const textureDef = json.textures[textureIndex];
        const sourceIndex = textureDef.source;
        const sourceDef = json.images[sourceIndex];
        let loader = this.textureLoader;
        if (sourceDef.uri) {
          const handler = options.manager.getHandler(sourceDef.uri);
          if (handler !== null) loader = handler;
        }
        return this.loadTextureImage(textureIndex, sourceIndex, loader);
      }
      loadTextureImage(textureIndex, sourceIndex, loader) {
        const parser = this;
        const json = this.json;
        const textureDef = json.textures[textureIndex];
        const sourceDef = json.images[sourceIndex];
        const cacheKey = (sourceDef.uri || sourceDef.bufferView) + ':' + textureDef.sampler;
        if (this.textureCache[cacheKey]) {
          // See https://github.com/mrdoob/three.js/issues/21559.
          return this.textureCache[cacheKey];
        }
        const promise = this.loadImageSource(sourceIndex, loader).then(function (texture) {
          texture.flipY = false;
          texture.name = textureDef.name || sourceDef.name || '';
          if (texture.name === '' && typeof sourceDef.uri === 'string' && sourceDef.uri.startsWith('data:image/') === false) {
            texture.name = sourceDef.uri;
          }
          const samplers = json.samplers || {};
          const sampler = samplers[textureDef.sampler] || {};
          texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || THREE.LinearFilter;
          texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || THREE.LinearMipmapLinearFilter;
          texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || THREE.RepeatWrapping;
          texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || THREE.RepeatWrapping;
          parser.associations.set(texture, {
            textures: textureIndex
          });
          return texture;
        }).catch(function () {
          return null;
        });
        this.textureCache[cacheKey] = promise;
        return promise;
      }
      loadImageSource(sourceIndex, loader) {
        const parser = this;
        const json = this.json;
        const options = this.options;
        if (this.sourceCache[sourceIndex] !== undefined) {
          return this.sourceCache[sourceIndex].then(texture => texture.clone());
        }
        const sourceDef = json.images[sourceIndex];
        const URL = self.URL || self.webkitURL;
        let sourceURI = sourceDef.uri || '';
        let isObjectURL = false;
        if (sourceDef.bufferView !== undefined) {
          // Load binary image data from bufferView, if provided.

          sourceURI = parser.getDependency('bufferView', sourceDef.bufferView).then(function (bufferView) {
            isObjectURL = true;
            const blob = new Blob([bufferView], {
              type: sourceDef.mimeType
            });
            sourceURI = URL.createObjectURL(blob);
            return sourceURI;
          });
        } else if (sourceDef.uri === undefined) {
          throw new Error('THREE.GLTFLoader: Image ' + sourceIndex + ' is missing URI and bufferView');
        }
        const promise = Promise.resolve(sourceURI).then(function (sourceURI) {
          return new Promise(function (resolve, reject) {
            let onLoad = resolve;
            if (loader.isImageBitmapLoader === true) {
              onLoad = function (imageBitmap) {
                const texture = new THREE.Texture(imageBitmap);
                texture.needsUpdate = true;
                resolve(texture);
              };
            }
            loader.load(THREE.LoaderUtils.resolveURL(sourceURI, options.path), onLoad, undefined, reject);
          });
        }).then(function (texture) {
          // Clean up resources and configure Texture.

          if (isObjectURL === true) {
            URL.revokeObjectURL(sourceURI);
          }
          texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType(sourceDef.uri);
          return texture;
        }).catch(function (error) {
          console.error('THREE.GLTFLoader: Couldn\'t load texture', sourceURI);
          throw error;
        });
        this.sourceCache[sourceIndex] = promise;
        return promise;
      }

      /**
       * Asynchronously assigns a texture to the given material parameters.
       * @param {Object} materialParams
       * @param {string} mapName
       * @param {Object} mapDef
       * @return {Promise<Texture>}
       */
      assignTexture(materialParams, mapName, mapDef, encoding) {
        const parser = this;
        return this.getDependency('texture', mapDef.index).then(function (texture) {
          if (!texture) return null;
          if (mapDef.texCoord !== undefined && mapDef.texCoord > 0) {
            texture = texture.clone();
            texture.channel = mapDef.texCoord;
          }
          if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
            const transform = mapDef.extensions !== undefined ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : undefined;
            if (transform) {
              const gltfReference = parser.associations.get(texture);
              texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform);
              parser.associations.set(texture, gltfReference);
            }
          }
          if (encoding !== undefined) {
            texture.encoding = encoding;
          }
          materialParams[mapName] = texture;
          return texture;
        });
      }

      /**
       * Assigns final material to a Mesh, Line, or Points instance. The instance
       * already has a material (generated from the glTF material options alone)
       * but reuse of the same glTF material may require multiple threejs materials
       * to accommodate different primitive types, defines, etc. New materials will
       * be created if necessary, and reused from a cache.
       * @param  {Object3D} mesh Mesh, Line, or Points instance.
       */
      assignFinalMaterial(mesh) {
        const geometry = mesh.geometry;
        let material = mesh.material;
        const useDerivativeTangents = geometry.attributes.tangent === undefined;
        const useVertexColors = geometry.attributes.color !== undefined;
        const useFlatShading = geometry.attributes.normal === undefined;
        if (mesh.isPoints) {
          const cacheKey = 'PointsMaterial:' + material.uuid;
          let pointsMaterial = this.cache.get(cacheKey);
          if (!pointsMaterial) {
            pointsMaterial = new THREE.PointsMaterial();
            THREE.Material.prototype.copy.call(pointsMaterial, material);
            pointsMaterial.color.copy(material.color);
            pointsMaterial.map = material.map;
            pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

            this.cache.add(cacheKey, pointsMaterial);
          }
          material = pointsMaterial;
        } else if (mesh.isLine) {
          const cacheKey = 'LineBasicMaterial:' + material.uuid;
          let lineMaterial = this.cache.get(cacheKey);
          if (!lineMaterial) {
            lineMaterial = new THREE.LineBasicMaterial();
            THREE.Material.prototype.copy.call(lineMaterial, material);
            lineMaterial.color.copy(material.color);
            lineMaterial.map = material.map;
            this.cache.add(cacheKey, lineMaterial);
          }
          material = lineMaterial;
        }

        // Clone the material if it will be modified
        if (useDerivativeTangents || useVertexColors || useFlatShading) {
          let cacheKey = 'ClonedMaterial:' + material.uuid + ':';
          if (useDerivativeTangents) cacheKey += 'derivative-tangents:';
          if (useVertexColors) cacheKey += 'vertex-colors:';
          if (useFlatShading) cacheKey += 'flat-shading:';
          let cachedMaterial = this.cache.get(cacheKey);
          if (!cachedMaterial) {
            cachedMaterial = material.clone();
            if (useVertexColors) cachedMaterial.vertexColors = true;
            if (useFlatShading) cachedMaterial.flatShading = true;
            if (useDerivativeTangents) {
              // https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
              if (cachedMaterial.normalScale) cachedMaterial.normalScale.y *= -1;
              if (cachedMaterial.clearcoatNormalScale) cachedMaterial.clearcoatNormalScale.y *= -1;
            }
            this.cache.add(cacheKey, cachedMaterial);
            this.associations.set(cachedMaterial, this.associations.get(material));
          }
          material = cachedMaterial;
        }
        mesh.material = material;
      }
      getMaterialType( /* materialIndex */
      ) {
        return THREE.MeshStandardMaterial;
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
       * @param {number} materialIndex
       * @return {Promise<Material>}
       */
      loadMaterial(materialIndex) {
        const parser = this;
        const json = this.json;
        const extensions = this.extensions;
        const materialDef = json.materials[materialIndex];
        let materialType;
        const materialParams = {};
        const materialExtensions = materialDef.extensions || {};
        const pending = [];
        if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
          const kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
          materialType = kmuExtension.getMaterialType();
          pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
        } else {
          // Specification:
          // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

          const metallicRoughness = materialDef.pbrMetallicRoughness || {};
          materialParams.color = new THREE.Color(1.0, 1.0, 1.0);
          materialParams.opacity = 1.0;
          if (Array.isArray(metallicRoughness.baseColorFactor)) {
            const array = metallicRoughness.baseColorFactor;
            materialParams.color.fromArray(array);
            materialParams.opacity = array[3];
          }
          if (metallicRoughness.baseColorTexture !== undefined) {
            pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture, THREE.sRGBEncoding));
          }
          materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
          materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;
          if (metallicRoughness.metallicRoughnessTexture !== undefined) {
            pending.push(parser.assignTexture(materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture));
            pending.push(parser.assignTexture(materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture));
          }
          materialType = this._invokeOne(function (ext) {
            return ext.getMaterialType && ext.getMaterialType(materialIndex);
          });
          pending.push(Promise.all(this._invokeAll(function (ext) {
            return ext.extendMaterialParams && ext.extendMaterialParams(materialIndex, materialParams);
          })));
        }
        if (materialDef.doubleSided === true) {
          materialParams.side = THREE.DoubleSide;
        }
        const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
        if (alphaMode === ALPHA_MODES.BLEND) {
          materialParams.transparent = true;

          // See: https://github.com/mrdoob/three.js/issues/17706
          materialParams.depthWrite = false;
        } else {
          materialParams.transparent = false;
          if (alphaMode === ALPHA_MODES.MASK) {
            materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;
          }
        }
        if (materialDef.normalTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
          pending.push(parser.assignTexture(materialParams, 'normalMap', materialDef.normalTexture));
          materialParams.normalScale = new THREE.Vector2(1, 1);
          if (materialDef.normalTexture.scale !== undefined) {
            const scale = materialDef.normalTexture.scale;
            materialParams.normalScale.set(scale, scale);
          }
        }
        if (materialDef.occlusionTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
          pending.push(parser.assignTexture(materialParams, 'aoMap', materialDef.occlusionTexture));
          if (materialDef.occlusionTexture.strength !== undefined) {
            materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
          }
        }
        if (materialDef.emissiveFactor !== undefined && materialType !== THREE.MeshBasicMaterial) {
          materialParams.emissive = new THREE.Color().fromArray(materialDef.emissiveFactor);
        }
        if (materialDef.emissiveTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
          pending.push(parser.assignTexture(materialParams, 'emissiveMap', materialDef.emissiveTexture, THREE.sRGBEncoding));
        }
        return Promise.all(pending).then(function () {
          const material = new materialType(materialParams);
          if (materialDef.name) material.name = materialDef.name;
          assignExtrasToUserData(material, materialDef);
          parser.associations.set(material, {
            materials: materialIndex
          });
          if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef);
          return material;
        });
      }

      /** When Object3D instances are targeted by animation, they need unique names. */
      createUniqueName(originalName) {
        const sanitizedName = THREE.PropertyBinding.sanitizeNodeName(originalName || '');
        let name = sanitizedName;
        for (let i = 1; this.nodeNamesUsed[name]; ++i) {
          name = sanitizedName + '_' + i;
        }
        this.nodeNamesUsed[name] = true;
        return name;
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
       *
       * Creates BufferGeometries from primitives.
       *
       * @param {Array<GLTF.Primitive>} primitives
       * @return {Promise<Array<BufferGeometry>>}
       */
      loadGeometries(primitives) {
        const parser = this;
        const extensions = this.extensions;
        const cache = this.primitiveCache;
        function createDracoPrimitive(primitive) {
          return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(primitive, parser).then(function (geometry) {
            return addPrimitiveAttributes(geometry, primitive, parser);
          });
        }
        const pending = [];
        for (let i = 0, il = primitives.length; i < il; i++) {
          const primitive = primitives[i];
          const cacheKey = createPrimitiveKey(primitive);

          // See if we've already created this geometry
          const cached = cache[cacheKey];
          if (cached) {
            // Use the cached geometry if it exists
            pending.push(cached.promise);
          } else {
            let geometryPromise;
            if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
              // Use DRACO geometry if available
              geometryPromise = createDracoPrimitive(primitive);
            } else {
              // Otherwise create a new geometry
              geometryPromise = addPrimitiveAttributes(new THREE.BufferGeometry(), primitive, parser);
            }

            // Cache this geometry
            cache[cacheKey] = {
              primitive: primitive,
              promise: geometryPromise
            };
            pending.push(geometryPromise);
          }
        }
        return Promise.all(pending);
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
       * @param {number} meshIndex
       * @return {Promise<Group|Mesh|SkinnedMesh>}
       */
      loadMesh(meshIndex) {
        const parser = this;
        const json = this.json;
        const extensions = this.extensions;
        const meshDef = json.meshes[meshIndex];
        const primitives = meshDef.primitives;
        const pending = [];
        for (let i = 0, il = primitives.length; i < il; i++) {
          const material = primitives[i].material === undefined ? createDefaultMaterial(this.cache) : this.getDependency('material', primitives[i].material);
          pending.push(material);
        }
        pending.push(parser.loadGeometries(primitives));
        return Promise.all(pending).then(function (results) {
          const materials = results.slice(0, results.length - 1);
          const geometries = results[results.length - 1];
          const meshes = [];
          for (let i = 0, il = geometries.length; i < il; i++) {
            const geometry = geometries[i];
            const primitive = primitives[i];

            // 1. create Mesh

            let mesh;
            const material = materials[i];
            if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN || primitive.mode === undefined) {
              // .isSkinnedMesh isn't in glTF spec. See ._markDefs()
              mesh = meshDef.isSkinnedMesh === true ? new THREE.SkinnedMesh(geometry, material) : new THREE.Mesh(geometry, material);
              if (mesh.isSkinnedMesh === true) {
                // normalize skin weights to fix malformed assets (see #15319)
                mesh.normalizeSkinWeights();
              }
              if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                mesh.geometry = toTrianglesDrawMode(mesh.geometry, THREE.TriangleStripDrawMode);
              } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                mesh.geometry = toTrianglesDrawMode(mesh.geometry, THREE.TriangleFanDrawMode);
              }
            } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
              mesh = new THREE.LineSegments(geometry, material);
            } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
              mesh = new THREE.Line(geometry, material);
            } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
              mesh = new THREE.LineLoop(geometry, material);
            } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
              mesh = new THREE.Points(geometry, material);
            } else {
              throw new Error('THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode);
            }
            if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
              updateMorphTargets(mesh, meshDef);
            }
            mesh.name = parser.createUniqueName(meshDef.name || 'mesh_' + meshIndex);
            assignExtrasToUserData(mesh, meshDef);
            if (primitive.extensions) addUnknownExtensionsToUserData(extensions, mesh, primitive);
            parser.assignFinalMaterial(mesh);
            meshes.push(mesh);
          }
          for (let i = 0, il = meshes.length; i < il; i++) {
            parser.associations.set(meshes[i], {
              meshes: meshIndex,
              primitives: i
            });
          }
          if (meshes.length === 1) {
            return meshes[0];
          }
          const group = new THREE.Group();
          parser.associations.set(group, {
            meshes: meshIndex
          });
          for (let i = 0, il = meshes.length; i < il; i++) {
            group.add(meshes[i]);
          }
          return group;
        });
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
       * @param {number} cameraIndex
       * @return {Promise<THREE.Camera>}
       */
      loadCamera(cameraIndex) {
        let camera;
        const cameraDef = this.json.cameras[cameraIndex];
        const params = cameraDef[cameraDef.type];
        if (!params) {
          console.warn('THREE.GLTFLoader: Missing camera parameters.');
          return;
        }
        if (cameraDef.type === 'perspective') {
          camera = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(params.yfov), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6);
        } else if (cameraDef.type === 'orthographic') {
          camera = new THREE.OrthographicCamera(-params.xmag, params.xmag, params.ymag, -params.ymag, params.znear, params.zfar);
        }
        if (cameraDef.name) camera.name = this.createUniqueName(cameraDef.name);
        assignExtrasToUserData(camera, cameraDef);
        return Promise.resolve(camera);
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
       * @param {number} skinIndex
       * @return {Promise<Skeleton>}
       */
      loadSkin(skinIndex) {
        const skinDef = this.json.skins[skinIndex];
        const pending = [];
        for (let i = 0, il = skinDef.joints.length; i < il; i++) {
          pending.push(this._loadNodeShallow(skinDef.joints[i]));
        }
        if (skinDef.inverseBindMatrices !== undefined) {
          pending.push(this.getDependency('accessor', skinDef.inverseBindMatrices));
        } else {
          pending.push(null);
        }
        return Promise.all(pending).then(function (results) {
          const inverseBindMatrices = results.pop();
          const jointNodes = results;

          // Note that bones (joint nodes) may or may not be in the
          // scene graph at this time.

          const bones = [];
          const boneInverses = [];
          for (let i = 0, il = jointNodes.length; i < il; i++) {
            const jointNode = jointNodes[i];
            if (jointNode) {
              bones.push(jointNode);
              const mat = new THREE.Matrix4();
              if (inverseBindMatrices !== null) {
                mat.fromArray(inverseBindMatrices.array, i * 16);
              }
              boneInverses.push(mat);
            } else {
              console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', skinDef.joints[i]);
            }
          }
          return new THREE.Skeleton(bones, boneInverses);
        });
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
       * @param {number} animationIndex
       * @return {Promise<AnimationClip>}
       */
      loadAnimation(animationIndex) {
        const json = this.json;
        const animationDef = json.animations[animationIndex];
        const animationName = animationDef.name ? animationDef.name : 'animation_' + animationIndex;
        const pendingNodes = [];
        const pendingInputAccessors = [];
        const pendingOutputAccessors = [];
        const pendingSamplers = [];
        const pendingTargets = [];
        for (let i = 0, il = animationDef.channels.length; i < il; i++) {
          const channel = animationDef.channels[i];
          const sampler = animationDef.samplers[channel.sampler];
          const target = channel.target;
          const name = target.node;
          const input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input;
          const output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output;
          if (target.node === undefined) continue;
          pendingNodes.push(this.getDependency('node', name));
          pendingInputAccessors.push(this.getDependency('accessor', input));
          pendingOutputAccessors.push(this.getDependency('accessor', output));
          pendingSamplers.push(sampler);
          pendingTargets.push(target);
        }
        return Promise.all([Promise.all(pendingNodes), Promise.all(pendingInputAccessors), Promise.all(pendingOutputAccessors), Promise.all(pendingSamplers), Promise.all(pendingTargets)]).then(function (dependencies) {
          const nodes = dependencies[0];
          const inputAccessors = dependencies[1];
          const outputAccessors = dependencies[2];
          const samplers = dependencies[3];
          const targets = dependencies[4];
          const tracks = [];
          for (let i = 0, il = nodes.length; i < il; i++) {
            const node = nodes[i];
            const inputAccessor = inputAccessors[i];
            const outputAccessor = outputAccessors[i];
            const sampler = samplers[i];
            const target = targets[i];
            if (node === undefined) continue;
            node.updateMatrix();
            let TypedKeyframeTrack;
            switch (PATH_PROPERTIES[target.path]) {
              case PATH_PROPERTIES.weights:
                TypedKeyframeTrack = THREE.NumberKeyframeTrack;
                break;
              case PATH_PROPERTIES.rotation:
                TypedKeyframeTrack = THREE.QuaternionKeyframeTrack;
                break;
              case PATH_PROPERTIES.position:
              case PATH_PROPERTIES.scale:
              default:
                TypedKeyframeTrack = THREE.VectorKeyframeTrack;
                break;
            }
            const targetName = node.name ? node.name : node.uuid;
            const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[sampler.interpolation] : THREE.InterpolateLinear;
            const targetNames = [];
            if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
              node.traverse(function (object) {
                if (object.morphTargetInfluences) {
                  targetNames.push(object.name ? object.name : object.uuid);
                }
              });
            } else {
              targetNames.push(targetName);
            }
            let outputArray = outputAccessor.array;
            if (outputAccessor.normalized) {
              const scale = getNormalizedComponentScale(outputArray.constructor);
              const scaled = new Float32Array(outputArray.length);
              for (let j = 0, jl = outputArray.length; j < jl; j++) {
                scaled[j] = outputArray[j] * scale;
              }
              outputArray = scaled;
            }
            for (let j = 0, jl = targetNames.length; j < jl; j++) {
              const track = new TypedKeyframeTrack(targetNames[j] + '.' + PATH_PROPERTIES[target.path], inputAccessor.array, outputArray, interpolation);

              // Override interpolation with custom factory method.
              if (sampler.interpolation === 'CUBICSPLINE') {
                track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
                  // A CUBICSPLINE keyframe in glTF has three output values for each input value,
                  // representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
                  // must be divided by three to get the interpolant's sampleSize argument.

                  const interpolantType = this instanceof THREE.QuaternionKeyframeTrack ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;
                  return new interpolantType(this.times, this.values, this.getValueSize() / 3, result);
                };

                // Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
                track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
              }
              tracks.push(track);
            }
          }
          return new THREE.AnimationClip(animationName, undefined, tracks);
        });
      }
      createNodeMesh(nodeIndex) {
        const json = this.json;
        const parser = this;
        const nodeDef = json.nodes[nodeIndex];
        if (nodeDef.mesh === undefined) return null;
        return parser.getDependency('mesh', nodeDef.mesh).then(function (mesh) {
          const node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh);

          // if weights are provided on the node, override weights on the mesh.
          if (nodeDef.weights !== undefined) {
            node.traverse(function (o) {
              if (!o.isMesh) return;
              for (let i = 0, il = nodeDef.weights.length; i < il; i++) {
                o.morphTargetInfluences[i] = nodeDef.weights[i];
              }
            });
          }
          return node;
        });
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
       * @param {number} nodeIndex
       * @return {Promise<Object3D>}
       */
      loadNode(nodeIndex) {
        const json = this.json;
        const parser = this;
        const nodeDef = json.nodes[nodeIndex];
        const nodePending = parser._loadNodeShallow(nodeIndex);
        const childPending = [];
        const childrenDef = nodeDef.children || [];
        for (let i = 0, il = childrenDef.length; i < il; i++) {
          childPending.push(parser.getDependency('node', childrenDef[i]));
        }
        const skeletonPending = nodeDef.skin === undefined ? Promise.resolve(null) : parser.getDependency('skin', nodeDef.skin);
        return Promise.all([nodePending, Promise.all(childPending), skeletonPending]).then(function (results) {
          const node = results[0];
          const children = results[1];
          const skeleton = results[2];
          if (skeleton !== null) {
            // This full traverse should be fine because
            // child glTF nodes have not been added to this node yet.
            node.traverse(function (mesh) {
              if (!mesh.isSkinnedMesh) return;
              mesh.bind(skeleton, _identityMatrix);
            });
          }
          for (let i = 0, il = children.length; i < il; i++) {
            node.add(children[i]);
          }
          return node;
        });
      }

      // ._loadNodeShallow() parses a single node.
      // skin and child nodes are created and added in .loadNode() (no '_' prefix).
      _loadNodeShallow(nodeIndex) {
        const json = this.json;
        const extensions = this.extensions;
        const parser = this;

        // This method is called from .loadNode() and .loadSkin().
        // Cache a node to avoid duplication.

        if (this.nodeCache[nodeIndex] !== undefined) {
          return this.nodeCache[nodeIndex];
        }
        const nodeDef = json.nodes[nodeIndex];

        // reserve node's name before its dependencies, so the root has the intended name.
        const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : '';
        const pending = [];
        const meshPromise = parser._invokeOne(function (ext) {
          return ext.createNodeMesh && ext.createNodeMesh(nodeIndex);
        });
        if (meshPromise) {
          pending.push(meshPromise);
        }
        if (nodeDef.camera !== undefined) {
          pending.push(parser.getDependency('camera', nodeDef.camera).then(function (camera) {
            return parser._getNodeRef(parser.cameraCache, nodeDef.camera, camera);
          }));
        }
        parser._invokeAll(function (ext) {
          return ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex);
        }).forEach(function (promise) {
          pending.push(promise);
        });
        this.nodeCache[nodeIndex] = Promise.all(pending).then(function (objects) {
          let node;

          // .isBone isn't in glTF spec. See ._markDefs
          if (nodeDef.isBone === true) {
            node = new THREE.Bone();
          } else if (objects.length > 1) {
            node = new THREE.Group();
          } else if (objects.length === 1) {
            node = objects[0];
          } else {
            node = new THREE.Object3D();
          }
          if (node !== objects[0]) {
            for (let i = 0, il = objects.length; i < il; i++) {
              node.add(objects[i]);
            }
          }
          if (nodeDef.name) {
            node.userData.name = nodeDef.name;
            node.name = nodeName;
          }
          assignExtrasToUserData(node, nodeDef);
          if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef);
          if (nodeDef.matrix !== undefined) {
            const matrix = new THREE.Matrix4();
            matrix.fromArray(nodeDef.matrix);
            node.applyMatrix4(matrix);
          } else {
            if (nodeDef.translation !== undefined) {
              node.position.fromArray(nodeDef.translation);
            }
            if (nodeDef.rotation !== undefined) {
              node.quaternion.fromArray(nodeDef.rotation);
            }
            if (nodeDef.scale !== undefined) {
              node.scale.fromArray(nodeDef.scale);
            }
          }
          if (!parser.associations.has(node)) {
            parser.associations.set(node, {});
          }
          parser.associations.get(node).nodes = nodeIndex;
          return node;
        });
        return this.nodeCache[nodeIndex];
      }

      /**
       * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
       * @param {number} sceneIndex
       * @return {Promise<Group>}
       */
      loadScene(sceneIndex) {
        const extensions = this.extensions;
        const sceneDef = this.json.scenes[sceneIndex];
        const parser = this;

        // Loader returns Group, not Scene.
        // See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
        const scene = new THREE.Group();
        if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);
        assignExtrasToUserData(scene, sceneDef);
        if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef);
        const nodeIds = sceneDef.nodes || [];
        const pending = [];
        for (let i = 0, il = nodeIds.length; i < il; i++) {
          pending.push(parser.getDependency('node', nodeIds[i]));
        }
        return Promise.all(pending).then(function (nodes) {
          for (let i = 0, il = nodes.length; i < il; i++) {
            scene.add(nodes[i]);
          }

          // Removes dangling associations, associations that reference a node that
          // didn't make it into the scene.
          const reduceAssociations = node => {
            const reducedAssociations = new Map();
            for (const [key, value] of parser.associations) {
              if (key instanceof THREE.Material || key instanceof THREE.Texture) {
                reducedAssociations.set(key, value);
              }
            }
            node.traverse(node => {
              const mappings = parser.associations.get(node);
              if (mappings != null) {
                reducedAssociations.set(node, mappings);
              }
            });
            return reducedAssociations;
          };
          parser.associations = reduceAssociations(scene);
          return scene;
        });
      }
    }

    /**
     * @param {BufferGeometry} geometry
     * @param {GLTF.Primitive} primitiveDef
     * @param {GLTFParser} parser
     */
    function computeBounds(geometry, primitiveDef, parser) {
      const attributes = primitiveDef.attributes;
      const box = new THREE.Box3();
      if (attributes.POSITION !== undefined) {
        const accessor = parser.json.accessors[attributes.POSITION];
        const min = accessor.min;
        const max = accessor.max;

        // glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

        if (min !== undefined && max !== undefined) {
          box.set(new THREE.Vector3(min[0], min[1], min[2]), new THREE.Vector3(max[0], max[1], max[2]));
          if (accessor.normalized) {
            const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
            box.min.multiplyScalar(boxScale);
            box.max.multiplyScalar(boxScale);
          }
        } else {
          console.warn('THREE.GLTFLoader: Missing min/max properties for accessor POSITION.');
          return;
        }
      } else {
        return;
      }
      const targets = primitiveDef.targets;
      if (targets !== undefined) {
        const maxDisplacement = new THREE.Vector3();
        const vector = new THREE.Vector3();
        for (let i = 0, il = targets.length; i < il; i++) {
          const target = targets[i];
          if (target.POSITION !== undefined) {
            const accessor = parser.json.accessors[target.POSITION];
            const min = accessor.min;
            const max = accessor.max;

            // glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

            if (min !== undefined && max !== undefined) {
              // we need to get max of absolute components because target weight is [-1,1]
              vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
              vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
              vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));
              if (accessor.normalized) {
                const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
                vector.multiplyScalar(boxScale);
              }

              // Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
              // to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
              // are used to implement key-frame animations and as such only two are active at a time - this results in very large
              // boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
              maxDisplacement.max(vector);
            } else {
              console.warn('THREE.GLTFLoader: Missing min/max properties for accessor POSITION.');
            }
          }
        }

        // As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
        box.expandByVector(maxDisplacement);
      }
      geometry.boundingBox = box;
      const sphere = new THREE.Sphere();
      box.getCenter(sphere.center);
      sphere.radius = box.min.distanceTo(box.max) / 2;
      geometry.boundingSphere = sphere;
    }

    /**
     * @param {BufferGeometry} geometry
     * @param {GLTF.Primitive} primitiveDef
     * @param {GLTFParser} parser
     * @return {Promise<BufferGeometry>}
     */
    function addPrimitiveAttributes(geometry, primitiveDef, parser) {
      const attributes = primitiveDef.attributes;
      const pending = [];
      function assignAttributeAccessor(accessorIndex, attributeName) {
        return parser.getDependency('accessor', accessorIndex).then(function (accessor) {
          geometry.setAttribute(attributeName, accessor);
        });
      }
      for (const gltfAttributeName in attributes) {
        const threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase();

        // Skip attributes already provided by e.g. Draco extension.
        if (threeAttributeName in geometry.attributes) continue;
        pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName));
      }
      if (primitiveDef.indices !== undefined && !geometry.index) {
        const accessor = parser.getDependency('accessor', primitiveDef.indices).then(function (accessor) {
          geometry.setIndex(accessor);
        });
        pending.push(accessor);
      }
      assignExtrasToUserData(geometry, primitiveDef);
      computeBounds(geometry, primitiveDef, parser);
      return Promise.all(pending).then(function () {
        return primitiveDef.targets !== undefined ? addMorphTargets(geometry, primitiveDef.targets, parser) : geometry;
      });
    }

    class LoaderBase {
      constructor() {
        this.fetchOptions = {};
        this.workingPath = '';
      }
      load(url) {
        return fetch(url, this.fetchOptions).then(res => {
          if (!res.ok) {
            throw new Error(`Failed to load file "${url}" with status ${res.status} : ${res.statusText}`);
          }
          return res.arrayBuffer();
        }).then(buffer => {
          if (this.workingPath === '') {
            this.workingPath = this.workingPathForURL(url);
          }
          try {
            return this.parse(buffer);
          } catch (error) {
            console.log('buffer', error, url);
          }
        });
      }
      resolveExternalURL(url) {
        if (/^[^\\/]/.test(url)) {
          return this.workingPath + '/' + url;
        } else {
          return url;
        }
      }
      workingPathForURL(url) {
        const splits = url.split(/[\\/]/g);
        splits.pop();
        const workingPath = splits.join('/');
        return workingPath + '/';
      }
      parse(buffer) {
        throw new Error('LoaderBase: Parse not implemented.');
      }
    }

    class GLTFExtensionLoader extends LoaderBase {
      constructor(manager = THREE.DefaultLoadingManager) {
        super();
        this.manager = manager;
      }
      parse(buffer) {
        return new Promise((resolve, reject) => {
          const manager = this.manager;
          const fetchOptions = this.fetchOptions;
          let loader = manager.getHandler("path.gltf") || manager.getHandler("path.glb");
          if (!loader) {
            loader = new GLTFLoader(manager);
            if (fetchOptions.credentials === "include" && fetchOptions.mode === "cors") {
              loader.setCrossOrigin("use-credentials");
            }
            if ("credentials" in fetchOptions) {
              loader.setWithCredentials(fetchOptions.credentials === "include");
            }
            if (fetchOptions.headers) {
              loader.setRequestHeader(fetchOptions.headers);
            }
          }

          // assume any pre-registered loader has paths configured as the user desires, but if we're making
          // a new loader, use the working path during parse to support relative uris on other hosts
          const resourcePath = loader.resourcePath || loader.path || this.workingPath;
          loader.parse(buffer, resourcePath, model => {
            resolve(model);
          }, reject);
        });
      }
    }

    /*!
    fflate - fast JavaScript compression/decompression
    <https://101arrowz.github.io/fflate>
    Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
    version 0.6.9
    */
    var durl = function (c) {
      return URL.createObjectURL(new Blob([c], {
        type: 'text/javascript'
      }));
    };
    try {
      URL.revokeObjectURL(durl(''));
    } catch (e) {
      // We're in Deno or a very old browser
      durl = function (c) {
        return 'data:application/javascript;charset=UTF-8,' + encodeURI(c);
      };
    }

    // aliases for shorter compressed code (most minifers don't do this)
    var u8 = Uint8Array,
      u16 = Uint16Array,
      u32 = Uint32Array;
    // fixed length extra bits
    var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */0, 0, /* impossible */0]);
    // fixed distance extra bits
    // see fleb note
    var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */0, 0]);
    // code length index map
    var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    // get base, reverse index map from extra bits
    var freb = function (eb, start) {
      var b = new u16(31);
      for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
      }
      // numbers here are at max 18 bits
      var r = new u32(b[30]);
      for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
          r[j] = j - b[i] << 5 | i;
        }
      }
      return [b, r];
    };
    var _a = freb(fleb, 2),
      fl = _a[0],
      revfl = _a[1];
    // we can ignore the fact that the other numbers are wrong; they never happen anyway
    fl[28] = 258, revfl[258] = 28;
    var _b = freb(fdeb, 0),
      fd = _b[0];
    // map of value to reverse (assuming 16 bits)
    var rev = new u16(32768);
    for (var i = 0; i < 32768; ++i) {
      // reverse table algorithm from SO
      var x = (i & 0xAAAA) >>> 1 | (i & 0x5555) << 1;
      x = (x & 0xCCCC) >>> 2 | (x & 0x3333) << 2;
      x = (x & 0xF0F0) >>> 4 | (x & 0x0F0F) << 4;
      rev[i] = ((x & 0xFF00) >>> 8 | (x & 0x00FF) << 8) >>> 1;
    }
    // create huffman tree from u8 "map": index -> code length for code index
    // mb (max bits) must be at most 15
    // TODO: optimize/split up?
    var hMap = function (cd, mb, r) {
      var s = cd.length;
      // index
      var i = 0;
      // u16 "map": index -> # of codes with bit length = index
      var l = new u16(mb);
      // length of cd must be 288 (total # of codes)
      for (; i < s; ++i) ++l[cd[i] - 1];
      // u16 "map": index -> minimum code for bit length = index
      var le = new u16(mb);
      for (i = 0; i < mb; ++i) {
        le[i] = le[i - 1] + l[i - 1] << 1;
      }
      var co;
      if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
          // ignore 0 lengths
          if (cd[i]) {
            // num encoding both symbol and bits read
            var sv = i << 4 | cd[i];
            // free bits
            var r_1 = mb - cd[i];
            // start value
            var v = le[cd[i] - 1]++ << r_1;
            // m is end value
            for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
              // every 16 bit value starting with the code yields the same result
              co[rev[v] >>> rvb] = sv;
            }
          }
        }
      } else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
          if (cd[i]) {
            co[i] = rev[le[cd[i] - 1]++] >>> 15 - cd[i];
          }
        }
      }
      return co;
    };
    // fixed length tree
    var flt = new u8(288);
    for (var i = 0; i < 144; ++i) flt[i] = 8;
    for (var i = 144; i < 256; ++i) flt[i] = 9;
    for (var i = 256; i < 280; ++i) flt[i] = 7;
    for (var i = 280; i < 288; ++i) flt[i] = 8;
    // fixed distance tree
    var fdt = new u8(32);
    for (var i = 0; i < 32; ++i) fdt[i] = 5;
    // fixed length map
    var flrm = /*#__PURE__*/hMap(flt, 9, 1);
    // fixed distance map
    var fdrm = /*#__PURE__*/hMap(fdt, 5, 1);
    // find max of array
    var max = function (a) {
      var m = a[0];
      for (var i = 1; i < a.length; ++i) {
        if (a[i] > m) m = a[i];
      }
      return m;
    };
    // read d, starting at bit p and mask with m
    var bits = function (d, p, m) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
    };
    // read d, starting at bit p continuing for at least 16 bits
    var bits16 = function (d, p) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
    };
    // get end of byte
    var shft = function (p) {
      return (p / 8 | 0) + (p & 7 && 1);
    };
    // typed array slice - allows garbage collector to free original reference,
    // while being more compatible than .slice
    var slc = function (v, s, e) {
      if (s == null || s < 0) s = 0;
      if (e == null || e > v.length) e = v.length;
      // can't use .constructor in case user-supplied
      var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
      n.set(v.subarray(s, e));
      return n;
    };
    // expands raw DEFLATE data
    var inflt = function (dat, buf, st) {
      // source length
      var sl = dat.length;
      if (!sl || st && !st.l && sl < 5) return buf || new u8(0);
      // have to estimate size
      var noBuf = !buf || st;
      // no state
      var noSt = !st || st.i;
      if (!st) st = {};
      // Assumes roughly 33% compression ratio average
      if (!buf) buf = new u8(sl * 3);
      // ensure buffer can fit at least l elements
      var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
          // Double or set to necessary, whichever is greater
          var nbuf = new u8(Math.max(bl * 2, l));
          nbuf.set(buf);
          buf = nbuf;
        }
      };
      //  last chunk         bitpos           bytes
      var final = st.f || 0,
        pos = st.p || 0,
        bt = st.b || 0,
        lm = st.l,
        dm = st.d,
        lbt = st.m,
        dbt = st.n;
      // total bits
      var tbts = sl * 8;
      do {
        if (!lm) {
          // BFINAL - this is only 1 when last chunk is next
          st.f = final = bits(dat, pos, 1);
          // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
          var type = bits(dat, pos + 1, 3);
          pos += 3;
          if (!type) {
            // go to end of byte boundary
            var s = shft(pos) + 4,
              l = dat[s - 4] | dat[s - 3] << 8,
              t = s + l;
            if (t > sl) {
              if (noSt) throw 'unexpected EOF';
              break;
            }
            // ensure size
            if (noBuf) cbuf(bt + l);
            // Copy over uncompressed data
            buf.set(dat.subarray(s, t), bt);
            // Get new bitpos, update byte count
            st.b = bt += l, st.p = pos = t * 8;
            continue;
          } else if (type == 1) lm = flrm, dm = fdrm, lbt = 9, dbt = 5;else if (type == 2) {
            //  literal                            lengths
            var hLit = bits(dat, pos, 31) + 257,
              hcLen = bits(dat, pos + 10, 15) + 4;
            var tl = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            // length+distance tree
            var ldt = new u8(tl);
            // code length tree
            var clt = new u8(19);
            for (var i = 0; i < hcLen; ++i) {
              // use index map to get real code
              clt[clim[i]] = bits(dat, pos + i * 3, 7);
            }
            pos += hcLen * 3;
            // code lengths bits
            var clb = max(clt),
              clbmsk = (1 << clb) - 1;
            // code lengths map
            var clm = hMap(clt, clb, 1);
            for (var i = 0; i < tl;) {
              var r = clm[bits(dat, pos, clbmsk)];
              // bits read
              pos += r & 15;
              // symbol
              var s = r >>> 4;
              // code length to copy
              if (s < 16) {
                ldt[i++] = s;
              } else {
                //  copy   count
                var c = 0,
                  n = 0;
                if (s == 16) n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];else if (s == 17) n = 3 + bits(dat, pos, 7), pos += 3;else if (s == 18) n = 11 + bits(dat, pos, 127), pos += 7;
                while (n--) ldt[i++] = c;
              }
            }
            //    length tree                 distance tree
            var lt = ldt.subarray(0, hLit),
              dt = ldt.subarray(hLit);
            // max length bits
            lbt = max(lt);
            // max dist bits
            dbt = max(dt);
            lm = hMap(lt, lbt, 1);
            dm = hMap(dt, dbt, 1);
          } else throw 'invalid block type';
          if (pos > tbts) {
            if (noSt) throw 'unexpected EOF';
            break;
          }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17;
        if (noBuf) cbuf(bt + 131072);
        var lms = (1 << lbt) - 1,
          dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
          // bits read, code
          var c = lm[bits16(dat, pos) & lms],
            sym = c >>> 4;
          pos += c & 15;
          if (pos > tbts) {
            if (noSt) throw 'unexpected EOF';
            break;
          }
          if (!c) throw 'invalid length/literal';
          if (sym < 256) buf[bt++] = sym;else if (sym == 256) {
            lpos = pos, lm = null;
            break;
          } else {
            var add = sym - 254;
            // no extra bits needed if less
            if (sym > 264) {
              // index
              var i = sym - 257,
                b = fleb[i];
              add = bits(dat, pos, (1 << b) - 1) + fl[i];
              pos += b;
            }
            // dist
            var d = dm[bits16(dat, pos) & dms],
              dsym = d >>> 4;
            if (!d) throw 'invalid distance';
            pos += d & 15;
            var dt = fd[dsym];
            if (dsym > 3) {
              var b = fdeb[dsym];
              dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
            }
            if (pos > tbts) {
              if (noSt) throw 'unexpected EOF';
              break;
            }
            if (noBuf) cbuf(bt + 131072);
            var end = bt + add;
            for (; bt < end; bt += 4) {
              buf[bt] = buf[bt - dt];
              buf[bt + 1] = buf[bt + 1 - dt];
              buf[bt + 2] = buf[bt + 2 - dt];
              buf[bt + 3] = buf[bt + 3 - dt];
            }
            bt = end;
          }
        }
        st.l = lm, st.p = lpos, st.b = bt;
        if (lm) final = 1, st.m = lbt, st.d = dm, st.n = dbt;
      } while (!final);
      return bt == buf.length ? buf : slc(buf, 0, bt);
    };
    // empty
    var et = /*#__PURE__*/new u8(0);
    // zlib valid
    var zlv = function (d) {
      if ((d[0] & 15) != 8 || d[0] >>> 4 > 7 || (d[0] << 8 | d[1]) % 31) throw 'invalid zlib data';
      if (d[1] & 32) throw 'invalid zlib data: preset dictionaries not supported';
    };
    /**
     * Expands Zlib data
     * @param data The data to decompress
     * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
     * @returns The decompressed version of the data
     */
    function unzlibSync(data, out) {
      return inflt((zlv(data), data.subarray(2, -4)), out);
    }
    // text decoder
    var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/new TextDecoder();
    // text decoder stream
    var tds = 0;
    try {
      td.decode(et, {
        stream: true
      });
      tds = 1;
    } catch (e) {}

    /**
     * NURBS utils
     *
     * See NURBSCurve and NURBSSurface.
     **/

    /**************************************************************
     *	NURBS Utils
     **************************************************************/

    /*
    Finds knot vector span.

    p : degree
    u : parametric value
    U : knot vector

    returns the span
    */
    function findSpan(p, u, U) {
      const n = U.length - p - 1;
      if (u >= U[n]) {
        return n - 1;
      }
      if (u <= U[p]) {
        return p;
      }
      let low = p;
      let high = n;
      let mid = Math.floor((low + high) / 2);
      while (u < U[mid] || u >= U[mid + 1]) {
        if (u < U[mid]) {
          high = mid;
        } else {
          low = mid;
        }
        mid = Math.floor((low + high) / 2);
      }
      return mid;
    }

    /*
    Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2

    span : span in which u lies
    u    : parametric point
    p    : degree
    U    : knot vector

    returns array[p+1] with basis functions values.
    */
    function calcBasisFunctions(span, u, p, U) {
      const N = [];
      const left = [];
      const right = [];
      N[0] = 1.0;
      for (let j = 1; j <= p; ++j) {
        left[j] = u - U[span + 1 - j];
        right[j] = U[span + j] - u;
        let saved = 0.0;
        for (let r = 0; r < j; ++r) {
          const rv = right[r + 1];
          const lv = left[j - r];
          const temp = N[r] / (rv + lv);
          N[r] = saved + rv * temp;
          saved = lv * temp;
        }
        N[j] = saved;
      }
      return N;
    }

    /*
    Calculate B-Spline curve points. See The NURBS Book, page 82, algorithm A3.1.

    p : degree of B-Spline
    U : knot vector
    P : control points (x, y, z, w)
    u : parametric point

    returns point for given u
    */
    function calcBSplinePoint(p, U, P, u) {
      const span = findSpan(p, u, U);
      const N = calcBasisFunctions(span, u, p, U);
      const C = new THREE.Vector4(0, 0, 0, 0);
      for (let j = 0; j <= p; ++j) {
        const point = P[span - p + j];
        const Nj = N[j];
        const wNj = point.w * Nj;
        C.x += point.x * wNj;
        C.y += point.y * wNj;
        C.z += point.z * wNj;
        C.w += point.w * Nj;
      }
      return C;
    }

    /*
    Calculate basis functions derivatives. See The NURBS Book, page 72, algorithm A2.3.

    span : span in which u lies
    u    : parametric point
    p    : degree
    n    : number of derivatives to calculate
    U    : knot vector

    returns array[n+1][p+1] with basis functions derivatives
    */
    function calcBasisFunctionDerivatives(span, u, p, n, U) {
      const zeroArr = [];
      for (let i = 0; i <= p; ++i) zeroArr[i] = 0.0;
      const ders = [];
      for (let i = 0; i <= n; ++i) ders[i] = zeroArr.slice(0);
      const ndu = [];
      for (let i = 0; i <= p; ++i) ndu[i] = zeroArr.slice(0);
      ndu[0][0] = 1.0;
      const left = zeroArr.slice(0);
      const right = zeroArr.slice(0);
      for (let j = 1; j <= p; ++j) {
        left[j] = u - U[span + 1 - j];
        right[j] = U[span + j] - u;
        let saved = 0.0;
        for (let r = 0; r < j; ++r) {
          const rv = right[r + 1];
          const lv = left[j - r];
          ndu[j][r] = rv + lv;
          const temp = ndu[r][j - 1] / ndu[j][r];
          ndu[r][j] = saved + rv * temp;
          saved = lv * temp;
        }
        ndu[j][j] = saved;
      }
      for (let j = 0; j <= p; ++j) {
        ders[0][j] = ndu[j][p];
      }
      for (let r = 0; r <= p; ++r) {
        let s1 = 0;
        let s2 = 1;
        const a = [];
        for (let i = 0; i <= p; ++i) {
          a[i] = zeroArr.slice(0);
        }
        a[0][0] = 1.0;
        for (let k = 1; k <= n; ++k) {
          let d = 0.0;
          const rk = r - k;
          const pk = p - k;
          if (r >= k) {
            a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
            d = a[s2][0] * ndu[rk][pk];
          }
          const j1 = rk >= -1 ? 1 : -rk;
          const j2 = r - 1 <= pk ? k - 1 : p - r;
          for (let j = j1; j <= j2; ++j) {
            a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
            d += a[s2][j] * ndu[rk + j][pk];
          }
          if (r <= pk) {
            a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
            d += a[s2][k] * ndu[r][pk];
          }
          ders[k][r] = d;
          const j = s1;
          s1 = s2;
          s2 = j;
        }
      }
      let r = p;
      for (let k = 1; k <= n; ++k) {
        for (let j = 0; j <= p; ++j) {
          ders[k][j] *= r;
        }
        r *= p - k;
      }
      return ders;
    }

    /*
    	Calculate derivatives of a B-Spline. See The NURBS Book, page 93, algorithm A3.2.

    	p  : degree
    	U  : knot vector
    	P  : control points
    	u  : Parametric points
    	nd : number of derivatives

    	returns array[d+1] with derivatives
    	*/
    function calcBSplineDerivatives(p, U, P, u, nd) {
      const du = nd < p ? nd : p;
      const CK = [];
      const span = findSpan(p, u, U);
      const nders = calcBasisFunctionDerivatives(span, u, p, du, U);
      const Pw = [];
      for (let i = 0; i < P.length; ++i) {
        const point = P[i].clone();
        const w = point.w;
        point.x *= w;
        point.y *= w;
        point.z *= w;
        Pw[i] = point;
      }
      for (let k = 0; k <= du; ++k) {
        const point = Pw[span - p].clone().multiplyScalar(nders[k][0]);
        for (let j = 1; j <= p; ++j) {
          point.add(Pw[span - p + j].clone().multiplyScalar(nders[k][j]));
        }
        CK[k] = point;
      }
      for (let k = du + 1; k <= nd + 1; ++k) {
        CK[k] = new THREE.Vector4(0, 0, 0);
      }
      return CK;
    }

    /*
    Calculate "K over I"

    returns k!/(i!(k-i)!)
    */
    function calcKoverI(k, i) {
      let nom = 1;
      for (let j = 2; j <= k; ++j) {
        nom *= j;
      }
      let denom = 1;
      for (let j = 2; j <= i; ++j) {
        denom *= j;
      }
      for (let j = 2; j <= k - i; ++j) {
        denom *= j;
      }
      return nom / denom;
    }

    /*
    Calculate derivatives (0-nd) of rational curve. See The NURBS Book, page 127, algorithm A4.2.

    Pders : result of function calcBSplineDerivatives

    returns array with derivatives for rational curve.
    */
    function calcRationalCurveDerivatives(Pders) {
      const nd = Pders.length;
      const Aders = [];
      const wders = [];
      for (let i = 0; i < nd; ++i) {
        const point = Pders[i];
        Aders[i] = new THREE.Vector3(point.x, point.y, point.z);
        wders[i] = point.w;
      }
      const CK = [];
      for (let k = 0; k < nd; ++k) {
        const v = Aders[k].clone();
        for (let i = 1; i <= k; ++i) {
          v.sub(CK[k - i].clone().multiplyScalar(calcKoverI(k, i) * wders[i]));
        }
        CK[k] = v.divideScalar(wders[0]);
      }
      return CK;
    }

    /*
    Calculate NURBS curve derivatives. See The NURBS Book, page 127, algorithm A4.2.

    p  : degree
    U  : knot vector
    P  : control points in homogeneous space
    u  : parametric points
    nd : number of derivatives

    returns array with derivatives.
    */
    function calcNURBSDerivatives(p, U, P, u, nd) {
      const Pders = calcBSplineDerivatives(p, U, P, u, nd);
      return calcRationalCurveDerivatives(Pders);
    }

    /**
     * NURBS curve object
     *
     * Derives from Curve, overriding getPoint and getTangent.
     *
     * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
     *
     **/

    class NURBSCurve extends THREE.Curve {
      constructor(degree, knots /* array of reals */, controlPoints /* array of Vector(2|3|4) */, startKnot /* index in knots */, endKnot /* index in knots */) {
        super();
        this.degree = degree;
        this.knots = knots;
        this.controlPoints = [];
        // Used by periodic NURBS to remove hidden spans
        this.startKnot = startKnot || 0;
        this.endKnot = endKnot || this.knots.length - 1;
        for (let i = 0; i < controlPoints.length; ++i) {
          // ensure Vector4 for control points
          const point = controlPoints[i];
          this.controlPoints[i] = new THREE.Vector4(point.x, point.y, point.z, point.w);
        }
      }
      getPoint(t, optionalTarget = new THREE.Vector3()) {
        const point = optionalTarget;
        const u = this.knots[this.startKnot] + t * (this.knots[this.endKnot] - this.knots[this.startKnot]); // linear mapping t->u

        // following results in (wx, wy, wz, w) homogeneous point
        const hpoint = calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);
        if (hpoint.w !== 1.0) {
          // project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
          hpoint.divideScalar(hpoint.w);
        }
        return point.set(hpoint.x, hpoint.y, hpoint.z);
      }
      getTangent(t, optionalTarget = new THREE.Vector3()) {
        const tangent = optionalTarget;
        const u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
        const ders = calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
        tangent.copy(ders[1]).normalize();
        return tangent;
      }
    }

    /**
     * Loader loads FBX file and generates Group representing FBX scene.
     * Requires FBX file to be >= 7.0 and in ASCII or >= 6400 in Binary format
     * Versions lower than this may load but will probably have errors
     *
     * Needs Support:
     *  Morph normals / blend shape normals
     *
     * FBX format references:
     * 	https://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_index_html (C++ SDK reference)
     *
     * Binary format specification:
     *	https://code.blender.org/2013/08/fbx-binary-file-format-specification/
     */

    let fbxTree;
    let connections;
    let sceneGraph;
    class FBXLoader extends THREE.Loader {
      constructor(manager) {
        super(manager);
      }
      load(url, onLoad, onProgress, onError) {
        const scope = this;
        const path = scope.path === '' ? THREE.LoaderUtils.extractUrlBase(url) : scope.path;
        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(scope.path);
        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(url, function (buffer) {
          try {
            onLoad(scope.parse(buffer, path));
          } catch (e) {
            if (onError) {
              onError(e);
            } else {
              console.error(e);
            }
            scope.manager.itemError(url);
          }
        }, onProgress, onError);
      }
      parse(FBXBuffer, path) {
        if (isFbxFormatBinary(FBXBuffer)) {
          fbxTree = new BinaryParser().parse(FBXBuffer);
        } else {
          const FBXText = convertArrayBufferToString(FBXBuffer);
          if (!isFbxFormatASCII(FBXText)) {
            throw new Error('THREE.FBXLoader: Unknown format.');
          }
          if (getFbxVersion(FBXText) < 7000) {
            throw new Error('THREE.FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion(FBXText));
          }
          fbxTree = new TextParser().parse(FBXText);
        }

        // console.log( fbxTree );

        const textureLoader = new THREE.TextureLoader(this.manager).setPath(this.resourcePath || path).setCrossOrigin(this.crossOrigin);
        return new FBXTreeParser(textureLoader, this.manager).parse(fbxTree);
      }
    }

    // Parse the FBXTree object returned by the BinaryParser or TextParser and return a Group
    class FBXTreeParser {
      constructor(textureLoader, manager) {
        this.textureLoader = textureLoader;
        this.manager = manager;
      }
      parse() {
        connections = this.parseConnections();
        const images = this.parseImages();
        const textures = this.parseTextures(images);
        const materials = this.parseMaterials(textures);
        const deformers = this.parseDeformers();
        const geometryMap = new GeometryParser().parse(deformers);
        this.parseScene(deformers, geometryMap, materials);
        return sceneGraph;
      }

      // Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
      // and details the connection type
      parseConnections() {
        const connectionMap = new Map();
        if ('Connections' in fbxTree) {
          const rawConnections = fbxTree.Connections.connections;
          rawConnections.forEach(function (rawConnection) {
            const fromID = rawConnection[0];
            const toID = rawConnection[1];
            const relationship = rawConnection[2];
            if (!connectionMap.has(fromID)) {
              connectionMap.set(fromID, {
                parents: [],
                children: []
              });
            }
            const parentRelationship = {
              ID: toID,
              relationship: relationship
            };
            connectionMap.get(fromID).parents.push(parentRelationship);
            if (!connectionMap.has(toID)) {
              connectionMap.set(toID, {
                parents: [],
                children: []
              });
            }
            const childRelationship = {
              ID: fromID,
              relationship: relationship
            };
            connectionMap.get(toID).children.push(childRelationship);
          });
        }
        return connectionMap;
      }

      // Parse FBXTree.Objects.Video for embedded image data
      // These images are connected to textures in FBXTree.Objects.Textures
      // via FBXTree.Connections.
      parseImages() {
        const images = {};
        const blobs = {};
        if ('Video' in fbxTree.Objects) {
          const videoNodes = fbxTree.Objects.Video;
          for (const nodeID in videoNodes) {
            const videoNode = videoNodes[nodeID];
            const id = parseInt(nodeID);
            images[id] = videoNode.RelativeFilename || videoNode.Filename;

            // raw image data is in videoNode.Content
            if ('Content' in videoNode) {
              const arrayBufferContent = videoNode.Content instanceof ArrayBuffer && videoNode.Content.byteLength > 0;
              const base64Content = typeof videoNode.Content === 'string' && videoNode.Content !== '';
              if (arrayBufferContent || base64Content) {
                const image = this.parseImage(videoNodes[nodeID]);
                blobs[videoNode.RelativeFilename || videoNode.Filename] = image;
              }
            }
          }
        }
        for (const id in images) {
          const filename = images[id];
          if (blobs[filename] !== undefined) images[id] = blobs[filename];else images[id] = images[id].split('\\').pop();
        }
        return images;
      }

      // Parse embedded image data in FBXTree.Video.Content
      parseImage(videoNode) {
        const content = videoNode.Content;
        const fileName = videoNode.RelativeFilename || videoNode.Filename;
        const extension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
        let type;
        switch (extension) {
          case 'bmp':
            type = 'image/bmp';
            break;
          case 'jpg':
          case 'jpeg':
            type = 'image/jpeg';
            break;
          case 'png':
            type = 'image/png';
            break;
          case 'tif':
            type = 'image/tiff';
            break;
          case 'tga':
            if (this.manager.getHandler('.tga') === null) {
              console.warn('FBXLoader: TGA loader not found, skipping ', fileName);
            }
            type = 'image/tga';
            break;
          default:
            console.warn('FBXLoader: Image type "' + extension + '" is not supported.');
            return;
        }
        if (typeof content === 'string') {
          // ASCII format

          return 'data:' + type + ';base64,' + content;
        } else {
          // Binary Format

          const array = new Uint8Array(content);
          return window.URL.createObjectURL(new Blob([array], {
            type: type
          }));
        }
      }

      // Parse nodes in FBXTree.Objects.Texture
      // These contain details such as UV scaling, cropping, rotation etc and are connected
      // to images in FBXTree.Objects.Video
      parseTextures(images) {
        const textureMap = new Map();
        if ('Texture' in fbxTree.Objects) {
          const textureNodes = fbxTree.Objects.Texture;
          for (const nodeID in textureNodes) {
            const texture = this.parseTexture(textureNodes[nodeID], images);
            textureMap.set(parseInt(nodeID), texture);
          }
        }
        return textureMap;
      }

      // Parse individual node in FBXTree.Objects.Texture
      parseTexture(textureNode, images) {
        const texture = this.loadTexture(textureNode, images);
        texture.ID = textureNode.id;
        texture.name = textureNode.attrName;
        const wrapModeU = textureNode.WrapModeU;
        const wrapModeV = textureNode.WrapModeV;
        const valueU = wrapModeU !== undefined ? wrapModeU.value : 0;
        const valueV = wrapModeV !== undefined ? wrapModeV.value : 0;

        // http://download.autodesk.com/us/fbx/SDKdocs/FBX_SDK_Help/files/fbxsdkref/class_k_fbx_texture.html#889640e63e2e681259ea81061b85143a
        // 0: repeat(default), 1: clamp

        texture.wrapS = valueU === 0 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
        texture.wrapT = valueV === 0 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
        if ('Scaling' in textureNode) {
          const values = textureNode.Scaling.value;
          texture.repeat.x = values[0];
          texture.repeat.y = values[1];
        }
        if ('Translation' in textureNode) {
          const values = textureNode.Translation.value;
          texture.offset.x = values[0];
          texture.offset.y = values[1];
        }
        return texture;
      }

      // load a texture specified as a blob or data URI, or via an external URL using TextureLoader
      loadTexture(textureNode, images) {
        let fileName;
        const currentPath = this.textureLoader.path;
        const children = connections.get(textureNode.id).children;
        if (children !== undefined && children.length > 0 && images[children[0].ID] !== undefined) {
          fileName = images[children[0].ID];
          if (fileName.indexOf('blob:') === 0 || fileName.indexOf('data:') === 0) {
            this.textureLoader.setPath(undefined);
          }
        }
        let texture;
        const extension = textureNode.FileName.slice(-3).toLowerCase();
        if (extension === 'tga') {
          const loader = this.manager.getHandler('.tga');
          if (loader === null) {
            console.warn('FBXLoader: TGA loader not found, creating placeholder texture for', textureNode.RelativeFilename);
            texture = new THREE.Texture();
          } else {
            loader.setPath(this.textureLoader.path);
            texture = loader.load(fileName);
          }
        } else if (extension === 'psd') {
          console.warn('FBXLoader: PSD textures are not supported, creating placeholder texture for', textureNode.RelativeFilename);
          texture = new THREE.Texture();
        } else {
          let loader = this.manager.getHandler(fileName);
          if (loader === null) {
            loader = this.textureLoader;
          }
          loader.setPath(currentPath);
          loader.setCrossOrigin(this.crossOrigin);
          texture = loader.load(fileName);
        }
        this.textureLoader.setPath(currentPath);
        return texture;
      }

      // Parse nodes in FBXTree.Objects.Material
      parseMaterials(textureMap) {
        const materialMap = new Map();
        if ('Material' in fbxTree.Objects) {
          const materialNodes = fbxTree.Objects.Material;
          for (const nodeID in materialNodes) {
            const material = this.parseMaterial(materialNodes[nodeID], textureMap);
            if (material !== null) materialMap.set(parseInt(nodeID), material);
          }
        }
        return materialMap;
      }

      // Parse single node in FBXTree.Objects.Material
      // Materials are connected to texture maps in FBXTree.Objects.Textures
      // FBX format currently only supports Lambert and Phong shading models
      parseMaterial(materialNode, textureMap) {
        const ID = materialNode.id;
        const name = materialNode.attrName;
        let type = materialNode.ShadingModel;

        // Case where FBX wraps shading model in property object.
        if (typeof type === 'object') {
          type = type.value;
        }

        // Ignore unused materials which don't have any connections.
        if (!connections.has(ID)) return null;
        const parameters = this.parseParameters(materialNode, textureMap, ID);
        let material;
        switch (type.toLowerCase()) {
          case 'phong':
            material = new THREE.MeshPhongMaterial();
            break;
          case 'lambert':
            material = new THREE.MeshLambertMaterial();
            break;
          default:
            console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', type);
            material = new THREE.MeshPhongMaterial();
            break;
        }
        material.setValues(parameters);
        material.name = name;
        return material;
      }

      // Parse FBX material and return parameters suitable for a three.js material
      // Also parse the texture map and return any textures associated with the material
      parseParameters(materialNode, textureMap, ID) {
        const parameters = {};
        if (materialNode.BumpFactor) {
          parameters.bumpScale = materialNode.BumpFactor.value;
        }
        if (materialNode.Diffuse) {
          parameters.color = new THREE.Color().fromArray(materialNode.Diffuse.value).convertSRGBToLinear();
        } else if (materialNode.DiffuseColor && (materialNode.DiffuseColor.type === 'Color' || materialNode.DiffuseColor.type === 'ColorRGB')) {
          // The blender exporter exports diffuse here instead of in materialNode.Diffuse
          parameters.color = new THREE.Color().fromArray(materialNode.DiffuseColor.value).convertSRGBToLinear();
        }
        if (materialNode.DisplacementFactor) {
          parameters.displacementScale = materialNode.DisplacementFactor.value;
        }
        if (materialNode.Emissive) {
          parameters.emissive = new THREE.Color().fromArray(materialNode.Emissive.value).convertSRGBToLinear();
        } else if (materialNode.EmissiveColor && (materialNode.EmissiveColor.type === 'Color' || materialNode.EmissiveColor.type === 'ColorRGB')) {
          // The blender exporter exports emissive color here instead of in materialNode.Emissive
          parameters.emissive = new THREE.Color().fromArray(materialNode.EmissiveColor.value).convertSRGBToLinear();
        }
        if (materialNode.EmissiveFactor) {
          parameters.emissiveIntensity = parseFloat(materialNode.EmissiveFactor.value);
        }
        if (materialNode.Opacity) {
          parameters.opacity = parseFloat(materialNode.Opacity.value);
        }
        if (parameters.opacity < 1.0) {
          parameters.transparent = true;
        }
        if (materialNode.ReflectionFactor) {
          parameters.reflectivity = materialNode.ReflectionFactor.value;
        }
        if (materialNode.Shininess) {
          parameters.shininess = materialNode.Shininess.value;
        }
        if (materialNode.Specular) {
          parameters.specular = new THREE.Color().fromArray(materialNode.Specular.value).convertSRGBToLinear();
        } else if (materialNode.SpecularColor && materialNode.SpecularColor.type === 'Color') {
          // The blender exporter exports specular color here instead of in materialNode.Specular
          parameters.specular = new THREE.Color().fromArray(materialNode.SpecularColor.value).convertSRGBToLinear();
        }
        const scope = this;
        connections.get(ID).children.forEach(function (child) {
          const type = child.relationship;
          switch (type) {
            case 'Bump':
              parameters.bumpMap = scope.getTexture(textureMap, child.ID);
              break;
            case 'Maya|TEX_ao_map':
              parameters.aoMap = scope.getTexture(textureMap, child.ID);
              break;
            case 'DiffuseColor':
            case 'Maya|TEX_color_map':
              parameters.map = scope.getTexture(textureMap, child.ID);
              if (parameters.map !== undefined) {
                parameters.map.encoding = THREE.sRGBEncoding;
              }
              break;
            case 'DisplacementColor':
              parameters.displacementMap = scope.getTexture(textureMap, child.ID);
              break;
            case 'EmissiveColor':
              parameters.emissiveMap = scope.getTexture(textureMap, child.ID);
              if (parameters.emissiveMap !== undefined) {
                parameters.emissiveMap.encoding = THREE.sRGBEncoding;
              }
              break;
            case 'NormalMap':
            case 'Maya|TEX_normal_map':
              parameters.normalMap = scope.getTexture(textureMap, child.ID);
              break;
            case 'ReflectionColor':
              parameters.envMap = scope.getTexture(textureMap, child.ID);
              if (parameters.envMap !== undefined) {
                parameters.envMap.mapping = THREE.EquirectangularReflectionMapping;
                parameters.envMap.encoding = THREE.sRGBEncoding;
              }
              break;
            case 'SpecularColor':
              parameters.specularMap = scope.getTexture(textureMap, child.ID);
              if (parameters.specularMap !== undefined) {
                parameters.specularMap.encoding = THREE.sRGBEncoding;
              }
              break;
            case 'TransparentColor':
            case 'TransparencyFactor':
              parameters.alphaMap = scope.getTexture(textureMap, child.ID);
              parameters.transparent = true;
              break;
            case 'AmbientColor':
            case 'ShininessExponent': // AKA glossiness map
            case 'SpecularFactor': // AKA specularLevel
            case 'VectorDisplacementColor': // NOTE: Seems to be a copy of DisplacementColor
            default:
              console.warn('THREE.FBXLoader: %s map is not supported in three.js, skipping texture.', type);
              break;
          }
        });
        return parameters;
      }

      // get a texture from the textureMap for use by a material.
      getTexture(textureMap, id) {
        // if the texture is a layered texture, just use the first layer and issue a warning
        if ('LayeredTexture' in fbxTree.Objects && id in fbxTree.Objects.LayeredTexture) {
          console.warn('THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.');
          id = connections.get(id).children[0].ID;
        }
        return textureMap.get(id);
      }

      // Parse nodes in FBXTree.Objects.Deformer
      // Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
      // Generates map of Skeleton-like objects for use later when generating and binding skeletons.
      parseDeformers() {
        const skeletons = {};
        const morphTargets = {};
        if ('Deformer' in fbxTree.Objects) {
          const DeformerNodes = fbxTree.Objects.Deformer;
          for (const nodeID in DeformerNodes) {
            const deformerNode = DeformerNodes[nodeID];
            const relationships = connections.get(parseInt(nodeID));
            if (deformerNode.attrType === 'Skin') {
              const skeleton = this.parseSkeleton(relationships, DeformerNodes);
              skeleton.ID = nodeID;
              if (relationships.parents.length > 1) console.warn('THREE.FBXLoader: skeleton attached to more than one geometry is not supported.');
              skeleton.geometryID = relationships.parents[0].ID;
              skeletons[nodeID] = skeleton;
            } else if (deformerNode.attrType === 'BlendShape') {
              const morphTarget = {
                id: nodeID
              };
              morphTarget.rawTargets = this.parseMorphTargets(relationships, DeformerNodes);
              morphTarget.id = nodeID;
              if (relationships.parents.length > 1) console.warn('THREE.FBXLoader: morph target attached to more than one geometry is not supported.');
              morphTargets[nodeID] = morphTarget;
            }
          }
        }
        return {
          skeletons: skeletons,
          morphTargets: morphTargets
        };
      }

      // Parse single nodes in FBXTree.Objects.Deformer
      // The top level skeleton node has type 'Skin' and sub nodes have type 'Cluster'
      // Each skin node represents a skeleton and each cluster node represents a bone
      parseSkeleton(relationships, deformerNodes) {
        const rawBones = [];
        relationships.children.forEach(function (child) {
          const boneNode = deformerNodes[child.ID];
          if (boneNode.attrType !== 'Cluster') return;
          const rawBone = {
            ID: child.ID,
            indices: [],
            weights: [],
            transformLink: new THREE.Matrix4().fromArray(boneNode.TransformLink.a)
            // transform: new Matrix4().fromArray( boneNode.Transform.a ),
            // linkMode: boneNode.Mode,
          };

          if ('Indexes' in boneNode) {
            rawBone.indices = boneNode.Indexes.a;
            rawBone.weights = boneNode.Weights.a;
          }
          rawBones.push(rawBone);
        });
        return {
          rawBones: rawBones,
          bones: []
        };
      }

      // The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"
      parseMorphTargets(relationships, deformerNodes) {
        const rawMorphTargets = [];
        for (let i = 0; i < relationships.children.length; i++) {
          const child = relationships.children[i];
          const morphTargetNode = deformerNodes[child.ID];
          const rawMorphTarget = {
            name: morphTargetNode.attrName,
            initialWeight: morphTargetNode.DeformPercent,
            id: morphTargetNode.id,
            fullWeights: morphTargetNode.FullWeights.a
          };
          if (morphTargetNode.attrType !== 'BlendShapeChannel') return;
          rawMorphTarget.geoID = connections.get(parseInt(child.ID)).children.filter(function (child) {
            return child.relationship === undefined;
          })[0].ID;
          rawMorphTargets.push(rawMorphTarget);
        }
        return rawMorphTargets;
      }

      // create the main Group() to be returned by the loader
      parseScene(deformers, geometryMap, materialMap) {
        sceneGraph = new THREE.Group();
        const modelMap = this.parseModels(deformers.skeletons, geometryMap, materialMap);
        const modelNodes = fbxTree.Objects.Model;
        const scope = this;
        modelMap.forEach(function (model) {
          const modelNode = modelNodes[model.ID];
          scope.setLookAtProperties(model, modelNode);
          const parentConnections = connections.get(model.ID).parents;
          parentConnections.forEach(function (connection) {
            const parent = modelMap.get(connection.ID);
            if (parent !== undefined) parent.add(model);
          });
          if (model.parent === null) {
            sceneGraph.add(model);
          }
        });
        this.bindSkeleton(deformers.skeletons, geometryMap, modelMap);
        this.createAmbientLight();
        sceneGraph.traverse(function (node) {
          if (node.userData.transformData) {
            if (node.parent) {
              node.userData.transformData.parentMatrix = node.parent.matrix;
              node.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;
            }
            const transform = generateTransform(node.userData.transformData);
            node.applyMatrix4(transform);
            node.updateWorldMatrix();
          }
        });
        const animations = new AnimationParser().parse();

        // if all the models where already combined in a single group, just return that
        if (sceneGraph.children.length === 1 && sceneGraph.children[0].isGroup) {
          sceneGraph.children[0].animations = animations;
          sceneGraph = sceneGraph.children[0];
        }
        sceneGraph.animations = animations;
      }

      // parse nodes in FBXTree.Objects.Model
      parseModels(skeletons, geometryMap, materialMap) {
        const modelMap = new Map();
        const modelNodes = fbxTree.Objects.Model;
        for (const nodeID in modelNodes) {
          const id = parseInt(nodeID);
          const node = modelNodes[nodeID];
          const relationships = connections.get(id);
          let model = this.buildSkeleton(relationships, skeletons, id, node.attrName);
          if (!model) {
            switch (node.attrType) {
              case 'Camera':
                model = this.createCamera(relationships);
                break;
              case 'Light':
                model = this.createLight(relationships);
                break;
              case 'Mesh':
                model = this.createMesh(relationships, geometryMap, materialMap);
                break;
              case 'NurbsCurve':
                model = this.createCurve(relationships, geometryMap);
                break;
              case 'LimbNode':
              case 'Root':
                model = new THREE.Bone();
                break;
              case 'Null':
              default:
                model = new THREE.Group();
                break;
            }
            model.name = node.attrName ? THREE.PropertyBinding.sanitizeNodeName(node.attrName) : '';
            model.ID = id;
          }
          this.getTransformData(model, node);
          modelMap.set(id, model);
        }
        return modelMap;
      }
      buildSkeleton(relationships, skeletons, id, name) {
        let bone = null;
        relationships.parents.forEach(function (parent) {
          for (const ID in skeletons) {
            const skeleton = skeletons[ID];
            skeleton.rawBones.forEach(function (rawBone, i) {
              if (rawBone.ID === parent.ID) {
                const subBone = bone;
                bone = new THREE.Bone();
                bone.matrixWorld.copy(rawBone.transformLink);

                // set name and id here - otherwise in cases where "subBone" is created it will not have a name / id

                bone.name = name ? THREE.PropertyBinding.sanitizeNodeName(name) : '';
                bone.ID = id;
                skeleton.bones[i] = bone;

                // In cases where a bone is shared between multiple meshes
                // duplicate the bone here and and it as a child of the first bone
                if (subBone !== null) {
                  bone.add(subBone);
                }
              }
            });
          }
        });
        return bone;
      }

      // create a PerspectiveCamera or OrthographicCamera
      createCamera(relationships) {
        let model;
        let cameraAttribute;
        relationships.children.forEach(function (child) {
          const attr = fbxTree.Objects.NodeAttribute[child.ID];
          if (attr !== undefined) {
            cameraAttribute = attr;
          }
        });
        if (cameraAttribute === undefined) {
          model = new THREE.Object3D();
        } else {
          let type = 0;
          if (cameraAttribute.CameraProjectionType !== undefined && cameraAttribute.CameraProjectionType.value === 1) {
            type = 1;
          }
          let nearClippingPlane = 1;
          if (cameraAttribute.NearPlane !== undefined) {
            nearClippingPlane = cameraAttribute.NearPlane.value / 1000;
          }
          let farClippingPlane = 1000;
          if (cameraAttribute.FarPlane !== undefined) {
            farClippingPlane = cameraAttribute.FarPlane.value / 1000;
          }
          let width = window.innerWidth;
          let height = window.innerHeight;
          if (cameraAttribute.AspectWidth !== undefined && cameraAttribute.AspectHeight !== undefined) {
            width = cameraAttribute.AspectWidth.value;
            height = cameraAttribute.AspectHeight.value;
          }
          const aspect = width / height;
          let fov = 45;
          if (cameraAttribute.FieldOfView !== undefined) {
            fov = cameraAttribute.FieldOfView.value;
          }
          const focalLength = cameraAttribute.FocalLength ? cameraAttribute.FocalLength.value : null;
          switch (type) {
            case 0:
              // Perspective
              model = new THREE.PerspectiveCamera(fov, aspect, nearClippingPlane, farClippingPlane);
              if (focalLength !== null) model.setFocalLength(focalLength);
              break;
            case 1:
              // Orthographic
              model = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, nearClippingPlane, farClippingPlane);
              break;
            default:
              console.warn('THREE.FBXLoader: Unknown camera type ' + type + '.');
              model = new THREE.Object3D();
              break;
          }
        }
        return model;
      }

      // Create a DirectionalLight, PointLight or SpotLight
      createLight(relationships) {
        let model;
        let lightAttribute;
        relationships.children.forEach(function (child) {
          const attr = fbxTree.Objects.NodeAttribute[child.ID];
          if (attr !== undefined) {
            lightAttribute = attr;
          }
        });
        if (lightAttribute === undefined) {
          model = new THREE.Object3D();
        } else {
          let type;

          // LightType can be undefined for Point lights
          if (lightAttribute.LightType === undefined) {
            type = 0;
          } else {
            type = lightAttribute.LightType.value;
          }
          let color = 0xffffff;
          if (lightAttribute.Color !== undefined) {
            color = new THREE.Color().fromArray(lightAttribute.Color.value).convertSRGBToLinear();
          }
          let intensity = lightAttribute.Intensity === undefined ? 1 : lightAttribute.Intensity.value / 100;

          // light disabled
          if (lightAttribute.CastLightOnObject !== undefined && lightAttribute.CastLightOnObject.value === 0) {
            intensity = 0;
          }
          let distance = 0;
          if (lightAttribute.FarAttenuationEnd !== undefined) {
            if (lightAttribute.EnableFarAttenuation !== undefined && lightAttribute.EnableFarAttenuation.value === 0) {
              distance = 0;
            } else {
              distance = lightAttribute.FarAttenuationEnd.value;
            }
          }

          // TODO: could this be calculated linearly from FarAttenuationStart to FarAttenuationEnd?
          const decay = 1;
          switch (type) {
            case 0:
              // Point
              model = new THREE.PointLight(color, intensity, distance, decay);
              break;
            case 1:
              // Directional
              model = new THREE.DirectionalLight(color, intensity);
              break;
            case 2:
              // Spot
              let angle = Math.PI / 3;
              if (lightAttribute.InnerAngle !== undefined) {
                angle = THREE.MathUtils.degToRad(lightAttribute.InnerAngle.value);
              }
              let penumbra = 0;
              if (lightAttribute.OuterAngle !== undefined) {
                // TODO: this is not correct - FBX calculates outer and inner angle in degrees
                // with OuterAngle > InnerAngle && OuterAngle <= Math.PI
                // while three.js uses a penumbra between (0, 1) to attenuate the inner angle
                penumbra = THREE.MathUtils.degToRad(lightAttribute.OuterAngle.value);
                penumbra = Math.max(penumbra, 1);
              }
              model = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
              break;
            default:
              console.warn('THREE.FBXLoader: Unknown light type ' + lightAttribute.LightType.value + ', defaulting to a PointLight.');
              model = new THREE.PointLight(color, intensity);
              break;
          }
          if (lightAttribute.CastShadows !== undefined && lightAttribute.CastShadows.value === 1) {
            model.castShadow = true;
          }
        }
        return model;
      }
      createMesh(relationships, geometryMap, materialMap) {
        let model;
        let geometry = null;
        let material = null;
        const materials = [];

        // get geometry and materials(s) from connections
        relationships.children.forEach(function (child) {
          if (geometryMap.has(child.ID)) {
            geometry = geometryMap.get(child.ID);
          }
          if (materialMap.has(child.ID)) {
            materials.push(materialMap.get(child.ID));
          }
        });
        if (materials.length > 1) {
          material = materials;
        } else if (materials.length > 0) {
          material = materials[0];
        } else {
          material = new THREE.MeshPhongMaterial({
            color: 0xcccccc
          });
          materials.push(material);
        }
        if ('color' in geometry.attributes) {
          materials.forEach(function (material) {
            material.vertexColors = true;
          });
        }
        if (geometry.FBX_Deformer) {
          model = new THREE.SkinnedMesh(geometry, material);
          model.normalizeSkinWeights();
        } else {
          model = new THREE.Mesh(geometry, material);
        }
        return model;
      }
      createCurve(relationships, geometryMap) {
        const geometry = relationships.children.reduce(function (geo, child) {
          if (geometryMap.has(child.ID)) geo = geometryMap.get(child.ID);
          return geo;
        }, null);

        // FBX does not list materials for Nurbs lines, so we'll just put our own in here.
        const material = new THREE.LineBasicMaterial({
          color: 0x3300ff,
          linewidth: 1
        });
        return new THREE.Line(geometry, material);
      }

      // parse the model node for transform data
      getTransformData(model, modelNode) {
        const transformData = {};
        if ('InheritType' in modelNode) transformData.inheritType = parseInt(modelNode.InheritType.value);
        if ('RotationOrder' in modelNode) transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);else transformData.eulerOrder = 'ZYX';
        if ('Lcl_Translation' in modelNode) transformData.translation = modelNode.Lcl_Translation.value;
        if ('PreRotation' in modelNode) transformData.preRotation = modelNode.PreRotation.value;
        if ('Lcl_Rotation' in modelNode) transformData.rotation = modelNode.Lcl_Rotation.value;
        if ('PostRotation' in modelNode) transformData.postRotation = modelNode.PostRotation.value;
        if ('Lcl_Scaling' in modelNode) transformData.scale = modelNode.Lcl_Scaling.value;
        if ('ScalingOffset' in modelNode) transformData.scalingOffset = modelNode.ScalingOffset.value;
        if ('ScalingPivot' in modelNode) transformData.scalingPivot = modelNode.ScalingPivot.value;
        if ('RotationOffset' in modelNode) transformData.rotationOffset = modelNode.RotationOffset.value;
        if ('RotationPivot' in modelNode) transformData.rotationPivot = modelNode.RotationPivot.value;
        model.userData.transformData = transformData;
      }
      setLookAtProperties(model, modelNode) {
        if ('LookAtProperty' in modelNode) {
          const children = connections.get(model.ID).children;
          children.forEach(function (child) {
            if (child.relationship === 'LookAtProperty') {
              const lookAtTarget = fbxTree.Objects.Model[child.ID];
              if ('Lcl_Translation' in lookAtTarget) {
                const pos = lookAtTarget.Lcl_Translation.value;

                // DirectionalLight, SpotLight
                if (model.target !== undefined) {
                  model.target.position.fromArray(pos);
                  sceneGraph.add(model.target);
                } else {
                  // Cameras and other Object3Ds

                  model.lookAt(new THREE.Vector3().fromArray(pos));
                }
              }
            }
          });
        }
      }
      bindSkeleton(skeletons, geometryMap, modelMap) {
        const bindMatrices = this.parsePoseNodes();
        for (const ID in skeletons) {
          const skeleton = skeletons[ID];
          const parents = connections.get(parseInt(skeleton.ID)).parents;
          parents.forEach(function (parent) {
            if (geometryMap.has(parent.ID)) {
              const geoID = parent.ID;
              const geoRelationships = connections.get(geoID);
              geoRelationships.parents.forEach(function (geoConnParent) {
                if (modelMap.has(geoConnParent.ID)) {
                  const model = modelMap.get(geoConnParent.ID);
                  model.bind(new THREE.Skeleton(skeleton.bones), bindMatrices[geoConnParent.ID]);
                }
              });
            }
          });
        }
      }
      parsePoseNodes() {
        const bindMatrices = {};
        if ('Pose' in fbxTree.Objects) {
          const BindPoseNode = fbxTree.Objects.Pose;
          for (const nodeID in BindPoseNode) {
            if (BindPoseNode[nodeID].attrType === 'BindPose' && BindPoseNode[nodeID].NbPoseNodes > 0) {
              const poseNodes = BindPoseNode[nodeID].PoseNode;
              if (Array.isArray(poseNodes)) {
                poseNodes.forEach(function (poseNode) {
                  bindMatrices[poseNode.Node] = new THREE.Matrix4().fromArray(poseNode.Matrix.a);
                });
              } else {
                bindMatrices[poseNodes.Node] = new THREE.Matrix4().fromArray(poseNodes.Matrix.a);
              }
            }
          }
        }
        return bindMatrices;
      }

      // Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light
      createAmbientLight() {
        if ('GlobalSettings' in fbxTree && 'AmbientColor' in fbxTree.GlobalSettings) {
          const ambientColor = fbxTree.GlobalSettings.AmbientColor.value;
          const r = ambientColor[0];
          const g = ambientColor[1];
          const b = ambientColor[2];
          if (r !== 0 || g !== 0 || b !== 0) {
            const color = new THREE.Color(r, g, b).convertSRGBToLinear();
            sceneGraph.add(new THREE.AmbientLight(color, 1));
          }
        }
      }
    }

    // parse Geometry data from FBXTree and return map of BufferGeometries
    class GeometryParser {
      constructor() {
        this.negativeMaterialIndices = false;
      }

      // Parse nodes in FBXTree.Objects.Geometry
      parse(deformers) {
        const geometryMap = new Map();
        if ('Geometry' in fbxTree.Objects) {
          const geoNodes = fbxTree.Objects.Geometry;
          for (const nodeID in geoNodes) {
            const relationships = connections.get(parseInt(nodeID));
            const geo = this.parseGeometry(relationships, geoNodes[nodeID], deformers);
            geometryMap.set(parseInt(nodeID), geo);
          }
        }

        // report warnings

        if (this.negativeMaterialIndices === true) {
          console.warn('THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected.');
        }
        return geometryMap;
      }

      // Parse single node in FBXTree.Objects.Geometry
      parseGeometry(relationships, geoNode, deformers) {
        switch (geoNode.attrType) {
          case 'Mesh':
            return this.parseMeshGeometry(relationships, geoNode, deformers);
          case 'NurbsCurve':
            return this.parseNurbsGeometry(geoNode);
        }
      }

      // Parse single node mesh geometry in FBXTree.Objects.Geometry
      parseMeshGeometry(relationships, geoNode, deformers) {
        const skeletons = deformers.skeletons;
        const morphTargets = [];
        const modelNodes = relationships.parents.map(function (parent) {
          return fbxTree.Objects.Model[parent.ID];
        });

        // don't create geometry if it is not associated with any models
        if (modelNodes.length === 0) return;
        const skeleton = relationships.children.reduce(function (skeleton, child) {
          if (skeletons[child.ID] !== undefined) skeleton = skeletons[child.ID];
          return skeleton;
        }, null);
        relationships.children.forEach(function (child) {
          if (deformers.morphTargets[child.ID] !== undefined) {
            morphTargets.push(deformers.morphTargets[child.ID]);
          }
        });

        // Assume one model and get the preRotation from that
        // if there is more than one model associated with the geometry this may cause problems
        const modelNode = modelNodes[0];
        const transformData = {};
        if ('RotationOrder' in modelNode) transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);
        if ('InheritType' in modelNode) transformData.inheritType = parseInt(modelNode.InheritType.value);
        if ('GeometricTranslation' in modelNode) transformData.translation = modelNode.GeometricTranslation.value;
        if ('GeometricRotation' in modelNode) transformData.rotation = modelNode.GeometricRotation.value;
        if ('GeometricScaling' in modelNode) transformData.scale = modelNode.GeometricScaling.value;
        const transform = generateTransform(transformData);
        return this.genGeometry(geoNode, skeleton, morphTargets, transform);
      }

      // Generate a BufferGeometry from a node in FBXTree.Objects.Geometry
      genGeometry(geoNode, skeleton, morphTargets, preTransform) {
        const geo = new THREE.BufferGeometry();
        if (geoNode.attrName) geo.name = geoNode.attrName;
        const geoInfo = this.parseGeoNode(geoNode, skeleton);
        const buffers = this.genBuffers(geoInfo);
        const positionAttribute = new THREE.Float32BufferAttribute(buffers.vertex, 3);
        positionAttribute.applyMatrix4(preTransform);
        geo.setAttribute('position', positionAttribute);
        if (buffers.colors.length > 0) {
          geo.setAttribute('color', new THREE.Float32BufferAttribute(buffers.colors, 3));
        }
        if (skeleton) {
          geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(buffers.weightsIndices, 4));
          geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(buffers.vertexWeights, 4));

          // used later to bind the skeleton to the model
          geo.FBX_Deformer = skeleton;
        }
        if (buffers.normal.length > 0) {
          const normalMatrix = new THREE.Matrix3().getNormalMatrix(preTransform);
          const normalAttribute = new THREE.Float32BufferAttribute(buffers.normal, 3);
          normalAttribute.applyNormalMatrix(normalMatrix);
          geo.setAttribute('normal', normalAttribute);
        }
        buffers.uvs.forEach(function (uvBuffer, i) {
          // subsequent uv buffers are called 'uv1', 'uv2', ...
          let name = 'uv' + (i + 1).toString();

          // the first uv buffer is just called 'uv'
          if (i === 0) {
            name = 'uv';
          }
          geo.setAttribute(name, new THREE.Float32BufferAttribute(buffers.uvs[i], 2));
        });
        if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {
          // Convert the material indices of each vertex into rendering groups on the geometry.
          let prevMaterialIndex = buffers.materialIndex[0];
          let startIndex = 0;
          buffers.materialIndex.forEach(function (currentIndex, i) {
            if (currentIndex !== prevMaterialIndex) {
              geo.addGroup(startIndex, i - startIndex, prevMaterialIndex);
              prevMaterialIndex = currentIndex;
              startIndex = i;
            }
          });

          // the loop above doesn't add the last group, do that here.
          if (geo.groups.length > 0) {
            const lastGroup = geo.groups[geo.groups.length - 1];
            const lastIndex = lastGroup.start + lastGroup.count;
            if (lastIndex !== buffers.materialIndex.length) {
              geo.addGroup(lastIndex, buffers.materialIndex.length - lastIndex, prevMaterialIndex);
            }
          }

          // case where there are multiple materials but the whole geometry is only
          // using one of them
          if (geo.groups.length === 0) {
            geo.addGroup(0, buffers.materialIndex.length, buffers.materialIndex[0]);
          }
        }
        this.addMorphTargets(geo, geoNode, morphTargets, preTransform);
        return geo;
      }
      parseGeoNode(geoNode, skeleton) {
        const geoInfo = {};
        geoInfo.vertexPositions = geoNode.Vertices !== undefined ? geoNode.Vertices.a : [];
        geoInfo.vertexIndices = geoNode.PolygonVertexIndex !== undefined ? geoNode.PolygonVertexIndex.a : [];
        if (geoNode.LayerElementColor) {
          geoInfo.color = this.parseVertexColors(geoNode.LayerElementColor[0]);
        }
        if (geoNode.LayerElementMaterial) {
          geoInfo.material = this.parseMaterialIndices(geoNode.LayerElementMaterial[0]);
        }
        if (geoNode.LayerElementNormal) {
          geoInfo.normal = this.parseNormals(geoNode.LayerElementNormal[0]);
        }
        if (geoNode.LayerElementUV) {
          geoInfo.uv = [];
          let i = 0;
          while (geoNode.LayerElementUV[i]) {
            if (geoNode.LayerElementUV[i].UV) {
              geoInfo.uv.push(this.parseUVs(geoNode.LayerElementUV[i]));
            }
            i++;
          }
        }
        geoInfo.weightTable = {};
        if (skeleton !== null) {
          geoInfo.skeleton = skeleton;
          skeleton.rawBones.forEach(function (rawBone, i) {
            // loop over the bone's vertex indices and weights
            rawBone.indices.forEach(function (index, j) {
              if (geoInfo.weightTable[index] === undefined) geoInfo.weightTable[index] = [];
              geoInfo.weightTable[index].push({
                id: i,
                weight: rawBone.weights[j]
              });
            });
          });
        }
        return geoInfo;
      }
      genBuffers(geoInfo) {
        const buffers = {
          vertex: [],
          normal: [],
          colors: [],
          uvs: [],
          materialIndex: [],
          vertexWeights: [],
          weightsIndices: []
        };
        let polygonIndex = 0;
        let faceLength = 0;
        let displayedWeightsWarning = false;

        // these will hold data for a single face
        let facePositionIndexes = [];
        let faceNormals = [];
        let faceColors = [];
        let faceUVs = [];
        let faceWeights = [];
        let faceWeightIndices = [];
        const scope = this;
        geoInfo.vertexIndices.forEach(function (vertexIndex, polygonVertexIndex) {
          let materialIndex;
          let endOfFace = false;

          // Face index and vertex index arrays are combined in a single array
          // A cube with quad faces looks like this:
          // PolygonVertexIndex: *24 {
          //  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
          //  }
          // Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
          // to find index of last vertex bit shift the index: ^ - 1
          if (vertexIndex < 0) {
            vertexIndex = vertexIndex ^ -1; // equivalent to ( x * -1 ) - 1
            endOfFace = true;
          }
          let weightIndices = [];
          let weights = [];
          facePositionIndexes.push(vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2);
          if (geoInfo.color) {
            const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color);
            faceColors.push(data[0], data[1], data[2]);
          }
          if (geoInfo.skeleton) {
            if (geoInfo.weightTable[vertexIndex] !== undefined) {
              geoInfo.weightTable[vertexIndex].forEach(function (wt) {
                weights.push(wt.weight);
                weightIndices.push(wt.id);
              });
            }
            if (weights.length > 4) {
              if (!displayedWeightsWarning) {
                console.warn('THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.');
                displayedWeightsWarning = true;
              }
              const wIndex = [0, 0, 0, 0];
              const Weight = [0, 0, 0, 0];
              weights.forEach(function (weight, weightIndex) {
                let currentWeight = weight;
                let currentIndex = weightIndices[weightIndex];
                Weight.forEach(function (comparedWeight, comparedWeightIndex, comparedWeightArray) {
                  if (currentWeight > comparedWeight) {
                    comparedWeightArray[comparedWeightIndex] = currentWeight;
                    currentWeight = comparedWeight;
                    const tmp = wIndex[comparedWeightIndex];
                    wIndex[comparedWeightIndex] = currentIndex;
                    currentIndex = tmp;
                  }
                });
              });
              weightIndices = wIndex;
              weights = Weight;
            }

            // if the weight array is shorter than 4 pad with 0s
            while (weights.length < 4) {
              weights.push(0);
              weightIndices.push(0);
            }
            for (let i = 0; i < 4; ++i) {
              faceWeights.push(weights[i]);
              faceWeightIndices.push(weightIndices[i]);
            }
          }
          if (geoInfo.normal) {
            const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal);
            faceNormals.push(data[0], data[1], data[2]);
          }
          if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {
            materialIndex = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material)[0];
            if (materialIndex < 0) {
              scope.negativeMaterialIndices = true;
              materialIndex = 0; // fallback
            }
          }

          if (geoInfo.uv) {
            geoInfo.uv.forEach(function (uv, i) {
              const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, uv);
              if (faceUVs[i] === undefined) {
                faceUVs[i] = [];
              }
              faceUVs[i].push(data[0]);
              faceUVs[i].push(data[1]);
            });
          }
          faceLength++;
          if (endOfFace) {
            if (faceLength > 4) console.warn('THREE.FBXLoader: Polygons with more than four sides are not supported. Make sure to triangulate the geometry during export.');
            scope.genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength);
            polygonIndex++;
            faceLength = 0;

            // reset arrays for the next face
            facePositionIndexes = [];
            faceNormals = [];
            faceColors = [];
            faceUVs = [];
            faceWeights = [];
            faceWeightIndices = [];
          }
        });
        return buffers;
      }

      // Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
      genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength) {
        for (let i = 2; i < faceLength; i++) {
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[0]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[1]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[2]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3 + 1]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3 + 2]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3 + 1]]);
          buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3 + 2]]);
          if (geoInfo.skeleton) {
            buffers.vertexWeights.push(faceWeights[0]);
            buffers.vertexWeights.push(faceWeights[1]);
            buffers.vertexWeights.push(faceWeights[2]);
            buffers.vertexWeights.push(faceWeights[3]);
            buffers.vertexWeights.push(faceWeights[(i - 1) * 4]);
            buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 1]);
            buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 2]);
            buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 3]);
            buffers.vertexWeights.push(faceWeights[i * 4]);
            buffers.vertexWeights.push(faceWeights[i * 4 + 1]);
            buffers.vertexWeights.push(faceWeights[i * 4 + 2]);
            buffers.vertexWeights.push(faceWeights[i * 4 + 3]);
            buffers.weightsIndices.push(faceWeightIndices[0]);
            buffers.weightsIndices.push(faceWeightIndices[1]);
            buffers.weightsIndices.push(faceWeightIndices[2]);
            buffers.weightsIndices.push(faceWeightIndices[3]);
            buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4]);
            buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 1]);
            buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 2]);
            buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 3]);
            buffers.weightsIndices.push(faceWeightIndices[i * 4]);
            buffers.weightsIndices.push(faceWeightIndices[i * 4 + 1]);
            buffers.weightsIndices.push(faceWeightIndices[i * 4 + 2]);
            buffers.weightsIndices.push(faceWeightIndices[i * 4 + 3]);
          }
          if (geoInfo.color) {
            buffers.colors.push(faceColors[0]);
            buffers.colors.push(faceColors[1]);
            buffers.colors.push(faceColors[2]);
            buffers.colors.push(faceColors[(i - 1) * 3]);
            buffers.colors.push(faceColors[(i - 1) * 3 + 1]);
            buffers.colors.push(faceColors[(i - 1) * 3 + 2]);
            buffers.colors.push(faceColors[i * 3]);
            buffers.colors.push(faceColors[i * 3 + 1]);
            buffers.colors.push(faceColors[i * 3 + 2]);
          }
          if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {
            buffers.materialIndex.push(materialIndex);
            buffers.materialIndex.push(materialIndex);
            buffers.materialIndex.push(materialIndex);
          }
          if (geoInfo.normal) {
            buffers.normal.push(faceNormals[0]);
            buffers.normal.push(faceNormals[1]);
            buffers.normal.push(faceNormals[2]);
            buffers.normal.push(faceNormals[(i - 1) * 3]);
            buffers.normal.push(faceNormals[(i - 1) * 3 + 1]);
            buffers.normal.push(faceNormals[(i - 1) * 3 + 2]);
            buffers.normal.push(faceNormals[i * 3]);
            buffers.normal.push(faceNormals[i * 3 + 1]);
            buffers.normal.push(faceNormals[i * 3 + 2]);
          }
          if (geoInfo.uv) {
            geoInfo.uv.forEach(function (uv, j) {
              if (buffers.uvs[j] === undefined) buffers.uvs[j] = [];
              buffers.uvs[j].push(faceUVs[j][0]);
              buffers.uvs[j].push(faceUVs[j][1]);
              buffers.uvs[j].push(faceUVs[j][(i - 1) * 2]);
              buffers.uvs[j].push(faceUVs[j][(i - 1) * 2 + 1]);
              buffers.uvs[j].push(faceUVs[j][i * 2]);
              buffers.uvs[j].push(faceUVs[j][i * 2 + 1]);
            });
          }
        }
      }
      addMorphTargets(parentGeo, parentGeoNode, morphTargets, preTransform) {
        if (morphTargets.length === 0) return;
        parentGeo.morphTargetsRelative = true;
        parentGeo.morphAttributes.position = [];
        // parentGeo.morphAttributes.normal = []; // not implemented

        const scope = this;
        morphTargets.forEach(function (morphTarget) {
          morphTarget.rawTargets.forEach(function (rawTarget) {
            const morphGeoNode = fbxTree.Objects.Geometry[rawTarget.geoID];
            if (morphGeoNode !== undefined) {
              scope.genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, rawTarget.name);
            }
          });
        });
      }

      // a morph geometry node is similar to a standard  node, and the node is also contained
      // in FBXTree.Objects.Geometry, however it can only have attributes for position, normal
      // and a special attribute Index defining which vertices of the original geometry are affected
      // Normal and position attributes only have data for the vertices that are affected by the morph
      genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, name) {
        const vertexIndices = parentGeoNode.PolygonVertexIndex !== undefined ? parentGeoNode.PolygonVertexIndex.a : [];
        const morphPositionsSparse = morphGeoNode.Vertices !== undefined ? morphGeoNode.Vertices.a : [];
        const indices = morphGeoNode.Indexes !== undefined ? morphGeoNode.Indexes.a : [];
        const length = parentGeo.attributes.position.count * 3;
        const morphPositions = new Float32Array(length);
        for (let i = 0; i < indices.length; i++) {
          const morphIndex = indices[i] * 3;
          morphPositions[morphIndex] = morphPositionsSparse[i * 3];
          morphPositions[morphIndex + 1] = morphPositionsSparse[i * 3 + 1];
          morphPositions[morphIndex + 2] = morphPositionsSparse[i * 3 + 2];
        }

        // TODO: add morph normal support
        const morphGeoInfo = {
          vertexIndices: vertexIndices,
          vertexPositions: morphPositions
        };
        const morphBuffers = this.genBuffers(morphGeoInfo);
        const positionAttribute = new THREE.Float32BufferAttribute(morphBuffers.vertex, 3);
        positionAttribute.name = name || morphGeoNode.attrName;
        positionAttribute.applyMatrix4(preTransform);
        parentGeo.morphAttributes.position.push(positionAttribute);
      }

      // Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
      parseNormals(NormalNode) {
        const mappingType = NormalNode.MappingInformationType;
        const referenceType = NormalNode.ReferenceInformationType;
        const buffer = NormalNode.Normals.a;
        let indexBuffer = [];
        if (referenceType === 'IndexToDirect') {
          if ('NormalIndex' in NormalNode) {
            indexBuffer = NormalNode.NormalIndex.a;
          } else if ('NormalsIndex' in NormalNode) {
            indexBuffer = NormalNode.NormalsIndex.a;
          }
        }
        return {
          dataSize: 3,
          buffer: buffer,
          indices: indexBuffer,
          mappingType: mappingType,
          referenceType: referenceType
        };
      }

      // Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
      parseUVs(UVNode) {
        const mappingType = UVNode.MappingInformationType;
        const referenceType = UVNode.ReferenceInformationType;
        const buffer = UVNode.UV.a;
        let indexBuffer = [];
        if (referenceType === 'IndexToDirect') {
          indexBuffer = UVNode.UVIndex.a;
        }
        return {
          dataSize: 2,
          buffer: buffer,
          indices: indexBuffer,
          mappingType: mappingType,
          referenceType: referenceType
        };
      }

      // Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
      parseVertexColors(ColorNode) {
        const mappingType = ColorNode.MappingInformationType;
        const referenceType = ColorNode.ReferenceInformationType;
        const buffer = ColorNode.Colors.a;
        let indexBuffer = [];
        if (referenceType === 'IndexToDirect') {
          indexBuffer = ColorNode.ColorIndex.a;
        }
        for (let i = 0, c = new THREE.Color(); i < buffer.length; i += 4) {
          c.fromArray(buffer, i).convertSRGBToLinear().toArray(buffer, i);
        }
        return {
          dataSize: 4,
          buffer: buffer,
          indices: indexBuffer,
          mappingType: mappingType,
          referenceType: referenceType
        };
      }

      // Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
      parseMaterialIndices(MaterialNode) {
        const mappingType = MaterialNode.MappingInformationType;
        const referenceType = MaterialNode.ReferenceInformationType;
        if (mappingType === 'NoMappingInformation') {
          return {
            dataSize: 1,
            buffer: [0],
            indices: [0],
            mappingType: 'AllSame',
            referenceType: referenceType
          };
        }
        const materialIndexBuffer = MaterialNode.Materials.a;

        // Since materials are stored as indices, there's a bit of a mismatch between FBX and what
        // we expect.So we create an intermediate buffer that points to the index in the buffer,
        // for conforming with the other functions we've written for other data.
        const materialIndices = [];
        for (let i = 0; i < materialIndexBuffer.length; ++i) {
          materialIndices.push(i);
        }
        return {
          dataSize: 1,
          buffer: materialIndexBuffer,
          indices: materialIndices,
          mappingType: mappingType,
          referenceType: referenceType
        };
      }

      // Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
      parseNurbsGeometry(geoNode) {
        const order = parseInt(geoNode.Order);
        if (isNaN(order)) {
          console.error('THREE.FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id);
          return new THREE.BufferGeometry();
        }
        const degree = order - 1;
        const knots = geoNode.KnotVector.a;
        const controlPoints = [];
        const pointsValues = geoNode.Points.a;
        for (let i = 0, l = pointsValues.length; i < l; i += 4) {
          controlPoints.push(new THREE.Vector4().fromArray(pointsValues, i));
        }
        let startKnot, endKnot;
        if (geoNode.Form === 'Closed') {
          controlPoints.push(controlPoints[0]);
        } else if (geoNode.Form === 'Periodic') {
          startKnot = degree;
          endKnot = knots.length - 1 - startKnot;
          for (let i = 0; i < degree; ++i) {
            controlPoints.push(controlPoints[i]);
          }
        }
        const curve = new NURBSCurve(degree, knots, controlPoints, startKnot, endKnot);
        const points = curve.getPoints(controlPoints.length * 12);
        return new THREE.BufferGeometry().setFromPoints(points);
      }
    }

    // parse animation data from FBXTree
    class AnimationParser {
      // take raw animation clips and turn them into three.js animation clips
      parse() {
        const animationClips = [];
        const rawClips = this.parseClips();
        if (rawClips !== undefined) {
          for (const key in rawClips) {
            const rawClip = rawClips[key];
            const clip = this.addClip(rawClip);
            animationClips.push(clip);
          }
        }
        return animationClips;
      }
      parseClips() {
        // since the actual transformation data is stored in FBXTree.Objects.AnimationCurve,
        // if this is undefined we can safely assume there are no animations
        if (fbxTree.Objects.AnimationCurve === undefined) return undefined;
        const curveNodesMap = this.parseAnimationCurveNodes();
        this.parseAnimationCurves(curveNodesMap);
        const layersMap = this.parseAnimationLayers(curveNodesMap);
        const rawClips = this.parseAnimStacks(layersMap);
        return rawClips;
      }

      // parse nodes in FBXTree.Objects.AnimationCurveNode
      // each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
      // and is referenced by an AnimationLayer
      parseAnimationCurveNodes() {
        const rawCurveNodes = fbxTree.Objects.AnimationCurveNode;
        const curveNodesMap = new Map();
        for (const nodeID in rawCurveNodes) {
          const rawCurveNode = rawCurveNodes[nodeID];
          if (rawCurveNode.attrName.match(/S|R|T|DeformPercent/) !== null) {
            const curveNode = {
              id: rawCurveNode.id,
              attr: rawCurveNode.attrName,
              curves: {}
            };
            curveNodesMap.set(curveNode.id, curveNode);
          }
        }
        return curveNodesMap;
      }

      // parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
      // previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
      // axis ( e.g. times and values of x rotation)
      parseAnimationCurves(curveNodesMap) {
        const rawCurves = fbxTree.Objects.AnimationCurve;

        // TODO: Many values are identical up to roundoff error, but won't be optimised
        // e.g. position times: [0, 0.4, 0. 8]
        // position values: [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.235384487103147e-7, 93.67520904541016, -0.9982695579528809]
        // clearly, this should be optimised to
        // times: [0], positions [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809]
        // this shows up in nearly every FBX file, and generally time array is length > 100

        for (const nodeID in rawCurves) {
          const animationCurve = {
            id: rawCurves[nodeID].id,
            times: rawCurves[nodeID].KeyTime.a.map(convertFBXTimeToSeconds),
            values: rawCurves[nodeID].KeyValueFloat.a
          };
          const relationships = connections.get(animationCurve.id);
          if (relationships !== undefined) {
            const animationCurveID = relationships.parents[0].ID;
            const animationCurveRelationship = relationships.parents[0].relationship;
            if (animationCurveRelationship.match(/X/)) {
              curveNodesMap.get(animationCurveID).curves['x'] = animationCurve;
            } else if (animationCurveRelationship.match(/Y/)) {
              curveNodesMap.get(animationCurveID).curves['y'] = animationCurve;
            } else if (animationCurveRelationship.match(/Z/)) {
              curveNodesMap.get(animationCurveID).curves['z'] = animationCurve;
            } else if (animationCurveRelationship.match(/DeformPercent/) && curveNodesMap.has(animationCurveID)) {
              curveNodesMap.get(animationCurveID).curves['morph'] = animationCurve;
            }
          }
        }
      }

      // parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
      // to various AnimationCurveNodes and is referenced by an AnimationStack node
      // note: theoretically a stack can have multiple layers, however in practice there always seems to be one per stack
      parseAnimationLayers(curveNodesMap) {
        const rawLayers = fbxTree.Objects.AnimationLayer;
        const layersMap = new Map();
        for (const nodeID in rawLayers) {
          const layerCurveNodes = [];
          const connection = connections.get(parseInt(nodeID));
          if (connection !== undefined) {
            // all the animationCurveNodes used in the layer
            const children = connection.children;
            children.forEach(function (child, i) {
              if (curveNodesMap.has(child.ID)) {
                const curveNode = curveNodesMap.get(child.ID);

                // check that the curves are defined for at least one axis, otherwise ignore the curveNode
                if (curveNode.curves.x !== undefined || curveNode.curves.y !== undefined || curveNode.curves.z !== undefined) {
                  if (layerCurveNodes[i] === undefined) {
                    const modelID = connections.get(child.ID).parents.filter(function (parent) {
                      return parent.relationship !== undefined;
                    })[0].ID;
                    if (modelID !== undefined) {
                      const rawModel = fbxTree.Objects.Model[modelID.toString()];
                      if (rawModel === undefined) {
                        console.warn('THREE.FBXLoader: Encountered a unused curve.', child);
                        return;
                      }
                      const node = {
                        modelName: rawModel.attrName ? THREE.PropertyBinding.sanitizeNodeName(rawModel.attrName) : '',
                        ID: rawModel.id,
                        initialPosition: [0, 0, 0],
                        initialRotation: [0, 0, 0],
                        initialScale: [1, 1, 1]
                      };
                      sceneGraph.traverse(function (child) {
                        if (child.ID === rawModel.id) {
                          node.transform = child.matrix;
                          if (child.userData.transformData) node.eulerOrder = child.userData.transformData.eulerOrder;
                        }
                      });
                      if (!node.transform) node.transform = new THREE.Matrix4();

                      // if the animated model is pre rotated, we'll have to apply the pre rotations to every
                      // animation value as well
                      if ('PreRotation' in rawModel) node.preRotation = rawModel.PreRotation.value;
                      if ('PostRotation' in rawModel) node.postRotation = rawModel.PostRotation.value;
                      layerCurveNodes[i] = node;
                    }
                  }
                  if (layerCurveNodes[i]) layerCurveNodes[i][curveNode.attr] = curveNode;
                } else if (curveNode.curves.morph !== undefined) {
                  if (layerCurveNodes[i] === undefined) {
                    const deformerID = connections.get(child.ID).parents.filter(function (parent) {
                      return parent.relationship !== undefined;
                    })[0].ID;
                    const morpherID = connections.get(deformerID).parents[0].ID;
                    const geoID = connections.get(morpherID).parents[0].ID;

                    // assuming geometry is not used in more than one model
                    const modelID = connections.get(geoID).parents[0].ID;
                    const rawModel = fbxTree.Objects.Model[modelID];
                    const node = {
                      modelName: rawModel.attrName ? THREE.PropertyBinding.sanitizeNodeName(rawModel.attrName) : '',
                      morphName: fbxTree.Objects.Deformer[deformerID].attrName
                    };
                    layerCurveNodes[i] = node;
                  }
                  layerCurveNodes[i][curveNode.attr] = curveNode;
                }
              }
            });
            layersMap.set(parseInt(nodeID), layerCurveNodes);
          }
        }
        return layersMap;
      }

      // parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
      // hierarchy. Each Stack node will be used to create a AnimationClip
      parseAnimStacks(layersMap) {
        const rawStacks = fbxTree.Objects.AnimationStack;

        // connect the stacks (clips) up to the layers
        const rawClips = {};
        for (const nodeID in rawStacks) {
          const children = connections.get(parseInt(nodeID)).children;
          if (children.length > 1) {
            // it seems like stacks will always be associated with a single layer. But just in case there are files
            // where there are multiple layers per stack, we'll display a warning
            console.warn('THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.');
          }
          const layer = layersMap.get(children[0].ID);
          rawClips[nodeID] = {
            name: rawStacks[nodeID].attrName,
            layer: layer
          };
        }
        return rawClips;
      }
      addClip(rawClip) {
        let tracks = [];
        const scope = this;
        rawClip.layer.forEach(function (rawTracks) {
          tracks = tracks.concat(scope.generateTracks(rawTracks));
        });
        return new THREE.AnimationClip(rawClip.name, -1, tracks);
      }
      generateTracks(rawTracks) {
        const tracks = [];
        let initialPosition = new THREE.Vector3();
        let initialRotation = new THREE.Quaternion();
        let initialScale = new THREE.Vector3();
        if (rawTracks.transform) rawTracks.transform.decompose(initialPosition, initialRotation, initialScale);
        initialPosition = initialPosition.toArray();
        initialRotation = new THREE.Euler().setFromQuaternion(initialRotation, rawTracks.eulerOrder).toArray();
        initialScale = initialScale.toArray();
        if (rawTracks.T !== undefined && Object.keys(rawTracks.T.curves).length > 0) {
          const positionTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.T.curves, initialPosition, 'position');
          if (positionTrack !== undefined) tracks.push(positionTrack);
        }
        if (rawTracks.R !== undefined && Object.keys(rawTracks.R.curves).length > 0) {
          const rotationTrack = this.generateRotationTrack(rawTracks.modelName, rawTracks.R.curves, initialRotation, rawTracks.preRotation, rawTracks.postRotation, rawTracks.eulerOrder);
          if (rotationTrack !== undefined) tracks.push(rotationTrack);
        }
        if (rawTracks.S !== undefined && Object.keys(rawTracks.S.curves).length > 0) {
          const scaleTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.S.curves, initialScale, 'scale');
          if (scaleTrack !== undefined) tracks.push(scaleTrack);
        }
        if (rawTracks.DeformPercent !== undefined) {
          const morphTrack = this.generateMorphTrack(rawTracks);
          if (morphTrack !== undefined) tracks.push(morphTrack);
        }
        return tracks;
      }
      generateVectorTrack(modelName, curves, initialValue, type) {
        const times = this.getTimesForAllAxes(curves);
        const values = this.getKeyframeTrackValues(times, curves, initialValue);
        return new THREE.VectorKeyframeTrack(modelName + '.' + type, times, values);
      }
      generateRotationTrack(modelName, curves, initialValue, preRotation, postRotation, eulerOrder) {
        if (curves.x !== undefined) {
          this.interpolateRotations(curves.x);
          curves.x.values = curves.x.values.map(THREE.MathUtils.degToRad);
        }
        if (curves.y !== undefined) {
          this.interpolateRotations(curves.y);
          curves.y.values = curves.y.values.map(THREE.MathUtils.degToRad);
        }
        if (curves.z !== undefined) {
          this.interpolateRotations(curves.z);
          curves.z.values = curves.z.values.map(THREE.MathUtils.degToRad);
        }
        const times = this.getTimesForAllAxes(curves);
        const values = this.getKeyframeTrackValues(times, curves, initialValue);
        if (preRotation !== undefined) {
          preRotation = preRotation.map(THREE.MathUtils.degToRad);
          preRotation.push(eulerOrder);
          preRotation = new THREE.Euler().fromArray(preRotation);
          preRotation = new THREE.Quaternion().setFromEuler(preRotation);
        }
        if (postRotation !== undefined) {
          postRotation = postRotation.map(THREE.MathUtils.degToRad);
          postRotation.push(eulerOrder);
          postRotation = new THREE.Euler().fromArray(postRotation);
          postRotation = new THREE.Quaternion().setFromEuler(postRotation).invert();
        }
        const quaternion = new THREE.Quaternion();
        const euler = new THREE.Euler();
        const quaternionValues = [];
        for (let i = 0; i < values.length; i += 3) {
          euler.set(values[i], values[i + 1], values[i + 2], eulerOrder);
          quaternion.setFromEuler(euler);
          if (preRotation !== undefined) quaternion.premultiply(preRotation);
          if (postRotation !== undefined) quaternion.multiply(postRotation);
          quaternion.toArray(quaternionValues, i / 3 * 4);
        }
        return new THREE.QuaternionKeyframeTrack(modelName + '.quaternion', times, quaternionValues);
      }
      generateMorphTrack(rawTracks) {
        const curves = rawTracks.DeformPercent.curves.morph;
        const values = curves.values.map(function (val) {
          return val / 100;
        });
        const morphNum = sceneGraph.getObjectByName(rawTracks.modelName).morphTargetDictionary[rawTracks.morphName];
        return new THREE.NumberKeyframeTrack(rawTracks.modelName + '.morphTargetInfluences[' + morphNum + ']', curves.times, values);
      }

      // For all animated objects, times are defined separately for each axis
      // Here we'll combine the times into one sorted array without duplicates
      getTimesForAllAxes(curves) {
        let times = [];

        // first join together the times for each axis, if defined
        if (curves.x !== undefined) times = times.concat(curves.x.times);
        if (curves.y !== undefined) times = times.concat(curves.y.times);
        if (curves.z !== undefined) times = times.concat(curves.z.times);

        // then sort them
        times = times.sort(function (a, b) {
          return a - b;
        });

        // and remove duplicates
        if (times.length > 1) {
          let targetIndex = 1;
          let lastValue = times[0];
          for (let i = 1; i < times.length; i++) {
            const currentValue = times[i];
            if (currentValue !== lastValue) {
              times[targetIndex] = currentValue;
              lastValue = currentValue;
              targetIndex++;
            }
          }
          times = times.slice(0, targetIndex);
        }
        return times;
      }
      getKeyframeTrackValues(times, curves, initialValue) {
        const prevValue = initialValue;
        const values = [];
        let xIndex = -1;
        let yIndex = -1;
        let zIndex = -1;
        times.forEach(function (time) {
          if (curves.x) xIndex = curves.x.times.indexOf(time);
          if (curves.y) yIndex = curves.y.times.indexOf(time);
          if (curves.z) zIndex = curves.z.times.indexOf(time);

          // if there is an x value defined for this frame, use that
          if (xIndex !== -1) {
            const xValue = curves.x.values[xIndex];
            values.push(xValue);
            prevValue[0] = xValue;
          } else {
            // otherwise use the x value from the previous frame
            values.push(prevValue[0]);
          }
          if (yIndex !== -1) {
            const yValue = curves.y.values[yIndex];
            values.push(yValue);
            prevValue[1] = yValue;
          } else {
            values.push(prevValue[1]);
          }
          if (zIndex !== -1) {
            const zValue = curves.z.values[zIndex];
            values.push(zValue);
            prevValue[2] = zValue;
          } else {
            values.push(prevValue[2]);
          }
        });
        return values;
      }

      // Rotations are defined as Euler angles which can have values  of any size
      // These will be converted to quaternions which don't support values greater than
      // PI, so we'll interpolate large rotations
      interpolateRotations(curve) {
        for (let i = 1; i < curve.values.length; i++) {
          const initialValue = curve.values[i - 1];
          const valuesSpan = curve.values[i] - initialValue;
          const absoluteSpan = Math.abs(valuesSpan);
          if (absoluteSpan >= 180) {
            const numSubIntervals = absoluteSpan / 180;
            const step = valuesSpan / numSubIntervals;
            let nextValue = initialValue + step;
            const initialTime = curve.times[i - 1];
            const timeSpan = curve.times[i] - initialTime;
            const interval = timeSpan / numSubIntervals;
            let nextTime = initialTime + interval;
            const interpolatedTimes = [];
            const interpolatedValues = [];
            while (nextTime < curve.times[i]) {
              interpolatedTimes.push(nextTime);
              nextTime += interval;
              interpolatedValues.push(nextValue);
              nextValue += step;
            }
            curve.times = inject(curve.times, i, interpolatedTimes);
            curve.values = inject(curve.values, i, interpolatedValues);
          }
        }
      }
    }

    // parse an FBX file in ASCII format
    class TextParser {
      getPrevNode() {
        return this.nodeStack[this.currentIndent - 2];
      }
      getCurrentNode() {
        return this.nodeStack[this.currentIndent - 1];
      }
      getCurrentProp() {
        return this.currentProp;
      }
      pushStack(node) {
        this.nodeStack.push(node);
        this.currentIndent += 1;
      }
      popStack() {
        this.nodeStack.pop();
        this.currentIndent -= 1;
      }
      setCurrentProp(val, name) {
        this.currentProp = val;
        this.currentPropName = name;
      }
      parse(text) {
        this.currentIndent = 0;
        this.allNodes = new FBXTree();
        this.nodeStack = [];
        this.currentProp = [];
        this.currentPropName = '';
        const scope = this;
        const split = text.split(/[\r\n]+/);
        split.forEach(function (line, i) {
          const matchComment = line.match(/^[\s\t]*;/);
          const matchEmpty = line.match(/^[\s\t]*$/);
          if (matchComment || matchEmpty) return;
          const matchBeginning = line.match('^\\t{' + scope.currentIndent + '}(\\w+):(.*){', '');
          const matchProperty = line.match('^\\t{' + scope.currentIndent + '}(\\w+):[\\s\\t\\r\\n](.*)');
          const matchEnd = line.match('^\\t{' + (scope.currentIndent - 1) + '}}');
          if (matchBeginning) {
            scope.parseNodeBegin(line, matchBeginning);
          } else if (matchProperty) {
            scope.parseNodeProperty(line, matchProperty, split[++i]);
          } else if (matchEnd) {
            scope.popStack();
          } else if (line.match(/^[^\s\t}]/)) {
            // large arrays are split over multiple lines terminated with a ',' character
            // if this is encountered the line needs to be joined to the previous line
            scope.parseNodePropertyContinued(line);
          }
        });
        return this.allNodes;
      }
      parseNodeBegin(line, property) {
        const nodeName = property[1].trim().replace(/^"/, '').replace(/"$/, '');
        const nodeAttrs = property[2].split(',').map(function (attr) {
          return attr.trim().replace(/^"/, '').replace(/"$/, '');
        });
        const node = {
          name: nodeName
        };
        const attrs = this.parseNodeAttr(nodeAttrs);
        const currentNode = this.getCurrentNode();

        // a top node
        if (this.currentIndent === 0) {
          this.allNodes.add(nodeName, node);
        } else {
          // a subnode

          // if the subnode already exists, append it
          if (nodeName in currentNode) {
            // special case Pose needs PoseNodes as an array
            if (nodeName === 'PoseNode') {
              currentNode.PoseNode.push(node);
            } else if (currentNode[nodeName].id !== undefined) {
              currentNode[nodeName] = {};
              currentNode[nodeName][currentNode[nodeName].id] = currentNode[nodeName];
            }
            if (attrs.id !== '') currentNode[nodeName][attrs.id] = node;
          } else if (typeof attrs.id === 'number') {
            currentNode[nodeName] = {};
            currentNode[nodeName][attrs.id] = node;
          } else if (nodeName !== 'Properties70') {
            if (nodeName === 'PoseNode') currentNode[nodeName] = [node];else currentNode[nodeName] = node;
          }
        }
        if (typeof attrs.id === 'number') node.id = attrs.id;
        if (attrs.name !== '') node.attrName = attrs.name;
        if (attrs.type !== '') node.attrType = attrs.type;
        this.pushStack(node);
      }
      parseNodeAttr(attrs) {
        let id = attrs[0];
        if (attrs[0] !== '') {
          id = parseInt(attrs[0]);
          if (isNaN(id)) {
            id = attrs[0];
          }
        }
        let name = '',
          type = '';
        if (attrs.length > 1) {
          name = attrs[1].replace(/^(\w+)::/, '');
          type = attrs[2];
        }
        return {
          id: id,
          name: name,
          type: type
        };
      }
      parseNodeProperty(line, property, contentLine) {
        let propName = property[1].replace(/^"/, '').replace(/"$/, '').trim();
        let propValue = property[2].replace(/^"/, '').replace(/"$/, '').trim();

        // for special case: base64 image data follows "Content: ," line
        //	Content: ,
        //	 "/9j/4RDaRXhpZgAATU0A..."
        if (propName === 'Content' && propValue === ',') {
          propValue = contentLine.replace(/"/g, '').replace(/,$/, '').trim();
        }
        const currentNode = this.getCurrentNode();
        const parentName = currentNode.name;
        if (parentName === 'Properties70') {
          this.parseNodeSpecialProperty(line, propName, propValue);
          return;
        }

        // Connections
        if (propName === 'C') {
          const connProps = propValue.split(',').slice(1);
          const from = parseInt(connProps[0]);
          const to = parseInt(connProps[1]);
          let rest = propValue.split(',').slice(3);
          rest = rest.map(function (elem) {
            return elem.trim().replace(/^"/, '');
          });
          propName = 'connections';
          propValue = [from, to];
          append(propValue, rest);
          if (currentNode[propName] === undefined) {
            currentNode[propName] = [];
          }
        }

        // Node
        if (propName === 'Node') currentNode.id = propValue;

        // connections
        if (propName in currentNode && Array.isArray(currentNode[propName])) {
          currentNode[propName].push(propValue);
        } else {
          if (propName !== 'a') currentNode[propName] = propValue;else currentNode.a = propValue;
        }
        this.setCurrentProp(currentNode, propName);

        // convert string to array, unless it ends in ',' in which case more will be added to it
        if (propName === 'a' && propValue.slice(-1) !== ',') {
          currentNode.a = parseNumberArray(propValue);
        }
      }
      parseNodePropertyContinued(line) {
        const currentNode = this.getCurrentNode();
        currentNode.a += line;

        // if the line doesn't end in ',' we have reached the end of the property value
        // so convert the string to an array
        if (line.slice(-1) !== ',') {
          currentNode.a = parseNumberArray(currentNode.a);
        }
      }

      // parse "Property70"
      parseNodeSpecialProperty(line, propName, propValue) {
        // split this
        // P: "Lcl Scaling", "Lcl Scaling", "", "A",1,1,1
        // into array like below
        // ["Lcl Scaling", "Lcl Scaling", "", "A", "1,1,1" ]
        const props = propValue.split('",').map(function (prop) {
          return prop.trim().replace(/^\"/, '').replace(/\s/, '_');
        });
        const innerPropName = props[0];
        const innerPropType1 = props[1];
        const innerPropType2 = props[2];
        const innerPropFlag = props[3];
        let innerPropValue = props[4];

        // cast values where needed, otherwise leave as strings
        switch (innerPropType1) {
          case 'int':
          case 'enum':
          case 'bool':
          case 'ULongLong':
          case 'double':
          case 'Number':
          case 'FieldOfView':
            innerPropValue = parseFloat(innerPropValue);
            break;
          case 'Color':
          case 'ColorRGB':
          case 'Vector3D':
          case 'Lcl_Translation':
          case 'Lcl_Rotation':
          case 'Lcl_Scaling':
            innerPropValue = parseNumberArray(innerPropValue);
            break;
        }

        // CAUTION: these props must append to parent's parent
        this.getPrevNode()[innerPropName] = {
          'type': innerPropType1,
          'type2': innerPropType2,
          'flag': innerPropFlag,
          'value': innerPropValue
        };
        this.setCurrentProp(this.getPrevNode(), innerPropName);
      }
    }

    // Parse an FBX file in Binary format
    class BinaryParser {
      parse(buffer) {
        const reader = new BinaryReader(buffer);
        reader.skip(23); // skip magic 23 bytes

        const version = reader.getUint32();
        if (version < 6400) {
          throw new Error('THREE.FBXLoader: FBX version not supported, FileVersion: ' + version);
        }
        const allNodes = new FBXTree();
        while (!this.endOfContent(reader)) {
          const node = this.parseNode(reader, version);
          if (node !== null) allNodes.add(node.name, node);
        }
        return allNodes;
      }

      // Check if reader has reached the end of content.
      endOfContent(reader) {
        // footer size: 160bytes + 16-byte alignment padding
        // - 16bytes: magic
        // - padding til 16-byte alignment (at least 1byte?)
        //	(seems like some exporters embed fixed 15 or 16bytes?)
        // - 4bytes: magic
        // - 4bytes: version
        // - 120bytes: zero
        // - 16bytes: magic
        if (reader.size() % 16 === 0) {
          return (reader.getOffset() + 160 + 16 & ~0xf) >= reader.size();
        } else {
          return reader.getOffset() + 160 + 16 >= reader.size();
        }
      }

      // recursively parse nodes until the end of the file is reached
      parseNode(reader, version) {
        const node = {};

        // The first three data sizes depends on version.
        const endOffset = version >= 7500 ? reader.getUint64() : reader.getUint32();
        const numProperties = version >= 7500 ? reader.getUint64() : reader.getUint32();
        version >= 7500 ? reader.getUint64() : reader.getUint32(); // the returned propertyListLen is not used

        const nameLen = reader.getUint8();
        const name = reader.getString(nameLen);

        // Regards this node as NULL-record if endOffset is zero
        if (endOffset === 0) return null;
        const propertyList = [];
        for (let i = 0; i < numProperties; i++) {
          propertyList.push(this.parseProperty(reader));
        }

        // Regards the first three elements in propertyList as id, attrName, and attrType
        const id = propertyList.length > 0 ? propertyList[0] : '';
        const attrName = propertyList.length > 1 ? propertyList[1] : '';
        const attrType = propertyList.length > 2 ? propertyList[2] : '';

        // check if this node represents just a single property
        // like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}
        node.singleProperty = numProperties === 1 && reader.getOffset() === endOffset ? true : false;
        while (endOffset > reader.getOffset()) {
          const subNode = this.parseNode(reader, version);
          if (subNode !== null) this.parseSubNode(name, node, subNode);
        }
        node.propertyList = propertyList; // raw property list used by parent

        if (typeof id === 'number') node.id = id;
        if (attrName !== '') node.attrName = attrName;
        if (attrType !== '') node.attrType = attrType;
        if (name !== '') node.name = name;
        return node;
      }
      parseSubNode(name, node, subNode) {
        // special case: child node is single property
        if (subNode.singleProperty === true) {
          const value = subNode.propertyList[0];
          if (Array.isArray(value)) {
            node[subNode.name] = subNode;
            subNode.a = value;
          } else {
            node[subNode.name] = value;
          }
        } else if (name === 'Connections' && subNode.name === 'C') {
          const array = [];
          subNode.propertyList.forEach(function (property, i) {
            // first Connection is FBX type (OO, OP, etc.). We'll discard these
            if (i !== 0) array.push(property);
          });
          if (node.connections === undefined) {
            node.connections = [];
          }
          node.connections.push(array);
        } else if (subNode.name === 'Properties70') {
          const keys = Object.keys(subNode);
          keys.forEach(function (key) {
            node[key] = subNode[key];
          });
        } else if (name === 'Properties70' && subNode.name === 'P') {
          let innerPropName = subNode.propertyList[0];
          let innerPropType1 = subNode.propertyList[1];
          const innerPropType2 = subNode.propertyList[2];
          const innerPropFlag = subNode.propertyList[3];
          let innerPropValue;
          if (innerPropName.indexOf('Lcl ') === 0) innerPropName = innerPropName.replace('Lcl ', 'Lcl_');
          if (innerPropType1.indexOf('Lcl ') === 0) innerPropType1 = innerPropType1.replace('Lcl ', 'Lcl_');
          if (innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf('Lcl_') === 0) {
            innerPropValue = [subNode.propertyList[4], subNode.propertyList[5], subNode.propertyList[6]];
          } else {
            innerPropValue = subNode.propertyList[4];
          }

          // this will be copied to parent, see above
          node[innerPropName] = {
            'type': innerPropType1,
            'type2': innerPropType2,
            'flag': innerPropFlag,
            'value': innerPropValue
          };
        } else if (node[subNode.name] === undefined) {
          if (typeof subNode.id === 'number') {
            node[subNode.name] = {};
            node[subNode.name][subNode.id] = subNode;
          } else {
            node[subNode.name] = subNode;
          }
        } else {
          if (subNode.name === 'PoseNode') {
            if (!Array.isArray(node[subNode.name])) {
              node[subNode.name] = [node[subNode.name]];
            }
            node[subNode.name].push(subNode);
          } else if (node[subNode.name][subNode.id] === undefined) {
            node[subNode.name][subNode.id] = subNode;
          }
        }
      }
      parseProperty(reader) {
        const type = reader.getString(1);
        let length;
        switch (type) {
          case 'C':
            return reader.getBoolean();
          case 'D':
            return reader.getFloat64();
          case 'F':
            return reader.getFloat32();
          case 'I':
            return reader.getInt32();
          case 'L':
            return reader.getInt64();
          case 'R':
            length = reader.getUint32();
            return reader.getArrayBuffer(length);
          case 'S':
            length = reader.getUint32();
            return reader.getString(length);
          case 'Y':
            return reader.getInt16();
          case 'b':
          case 'c':
          case 'd':
          case 'f':
          case 'i':
          case 'l':
            const arrayLength = reader.getUint32();
            const encoding = reader.getUint32(); // 0: non-compressed, 1: compressed
            const compressedLength = reader.getUint32();
            if (encoding === 0) {
              switch (type) {
                case 'b':
                case 'c':
                  return reader.getBooleanArray(arrayLength);
                case 'd':
                  return reader.getFloat64Array(arrayLength);
                case 'f':
                  return reader.getFloat32Array(arrayLength);
                case 'i':
                  return reader.getInt32Array(arrayLength);
                case 'l':
                  return reader.getInt64Array(arrayLength);
              }
            }
            const data = unzlibSync(new Uint8Array(reader.getArrayBuffer(compressedLength)));
            const reader2 = new BinaryReader(data.buffer);
            switch (type) {
              case 'b':
              case 'c':
                return reader2.getBooleanArray(arrayLength);
              case 'd':
                return reader2.getFloat64Array(arrayLength);
              case 'f':
                return reader2.getFloat32Array(arrayLength);
              case 'i':
                return reader2.getInt32Array(arrayLength);
              case 'l':
                return reader2.getInt64Array(arrayLength);
            }
            break;
          // cannot happen but is required by the DeepScan

          default:
            throw new Error('THREE.FBXLoader: Unknown property type ' + type);
        }
      }
    }
    class BinaryReader {
      constructor(buffer, littleEndian) {
        this.dv = new DataView(buffer);
        this.offset = 0;
        this.littleEndian = littleEndian !== undefined ? littleEndian : true;
        this._textDecoder = new TextDecoder();
      }
      getOffset() {
        return this.offset;
      }
      size() {
        return this.dv.buffer.byteLength;
      }
      skip(length) {
        this.offset += length;
      }

      // seems like true/false representation depends on exporter.
      // true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
      // then sees LSB.
      getBoolean() {
        return (this.getUint8() & 1) === 1;
      }
      getBooleanArray(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
          a.push(this.getBoolean());
        }
        return a;
      }
      getUint8() {
        const value = this.dv.getUint8(this.offset);
        this.offset += 1;
        return value;
      }
      getInt16() {
        const value = this.dv.getInt16(this.offset, this.littleEndian);
        this.offset += 2;
        return value;
      }
      getInt32() {
        const value = this.dv.getInt32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
      }
      getInt32Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
          a.push(this.getInt32());
        }
        return a;
      }
      getUint32() {
        const value = this.dv.getUint32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
      }

      // JavaScript doesn't support 64-bit integer so calculate this here
      // 1 << 32 will return 1 so using multiply operation instead here.
      // There's a possibility that this method returns wrong value if the value
      // is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
      // TODO: safely handle 64-bit integer
      getInt64() {
        let low, high;
        if (this.littleEndian) {
          low = this.getUint32();
          high = this.getUint32();
        } else {
          high = this.getUint32();
          low = this.getUint32();
        }

        // calculate negative value
        if (high & 0x80000000) {
          high = ~high & 0xFFFFFFFF;
          low = ~low & 0xFFFFFFFF;
          if (low === 0xFFFFFFFF) high = high + 1 & 0xFFFFFFFF;
          low = low + 1 & 0xFFFFFFFF;
          return -(high * 0x100000000 + low);
        }
        return high * 0x100000000 + low;
      }
      getInt64Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
          a.push(this.getInt64());
        }
        return a;
      }

      // Note: see getInt64() comment
      getUint64() {
        let low, high;
        if (this.littleEndian) {
          low = this.getUint32();
          high = this.getUint32();
        } else {
          high = this.getUint32();
          low = this.getUint32();
        }
        return high * 0x100000000 + low;
      }
      getFloat32() {
        const value = this.dv.getFloat32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
      }
      getFloat32Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
          a.push(this.getFloat32());
        }
        return a;
      }
      getFloat64() {
        const value = this.dv.getFloat64(this.offset, this.littleEndian);
        this.offset += 8;
        return value;
      }
      getFloat64Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
          a.push(this.getFloat64());
        }
        return a;
      }
      getArrayBuffer(size) {
        const value = this.dv.buffer.slice(this.offset, this.offset + size);
        this.offset += size;
        return value;
      }
      getString(size) {
        const start = this.offset;
        let a = new Uint8Array(this.dv.buffer, start, size);
        this.skip(size);
        const nullByte = a.indexOf(0);
        if (nullByte >= 0) a = new Uint8Array(this.dv.buffer, start, nullByte);
        return this._textDecoder.decode(a);
      }
    }

    // FBXTree holds a representation of the FBX data, returned by the TextParser ( FBX ASCII format)
    // and BinaryParser( FBX Binary format)
    class FBXTree {
      add(key, val) {
        this[key] = val;
      }
    }

    // ************** UTILITY FUNCTIONS **************

    function isFbxFormatBinary(buffer) {
      const CORRECT = 'Kaydara\u0020FBX\u0020Binary\u0020\u0020\0';
      return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString(buffer, 0, CORRECT.length);
    }
    function isFbxFormatASCII(text) {
      const CORRECT = ['K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\'];
      let cursor = 0;
      function read(offset) {
        const result = text[offset - 1];
        text = text.slice(cursor + offset);
        cursor++;
        return result;
      }
      for (let i = 0; i < CORRECT.length; ++i) {
        const num = read(1);
        if (num === CORRECT[i]) {
          return false;
        }
      }
      return true;
    }
    function getFbxVersion(text) {
      const versionRegExp = /FBXVersion: (\d+)/;
      const match = text.match(versionRegExp);
      if (match) {
        const version = parseInt(match[1]);
        return version;
      }
      throw new Error('THREE.FBXLoader: Cannot find the version number for the file given.');
    }

    // Converts FBX ticks into real time seconds.
    function convertFBXTimeToSeconds(time) {
      return time / 46186158000;
    }
    const dataArray = [];

    // extracts the data from the correct position in the FBX array based on indexing type
    function getData(polygonVertexIndex, polygonIndex, vertexIndex, infoObject) {
      let index;
      switch (infoObject.mappingType) {
        case 'ByPolygonVertex':
          index = polygonVertexIndex;
          break;
        case 'ByPolygon':
          index = polygonIndex;
          break;
        case 'ByVertice':
          index = vertexIndex;
          break;
        case 'AllSame':
          index = infoObject.indices[0];
          break;
        default:
          console.warn('THREE.FBXLoader: unknown attribute mapping type ' + infoObject.mappingType);
      }
      if (infoObject.referenceType === 'IndexToDirect') index = infoObject.indices[index];
      const from = index * infoObject.dataSize;
      const to = from + infoObject.dataSize;
      return slice(dataArray, infoObject.buffer, from, to);
    }
    const tempEuler = new THREE.Euler();
    const tempVec = new THREE.Vector3();

    // generate transformation from FBX transform data
    // ref: https://help.autodesk.com/view/FBX/2017/ENU/?guid=__files_GUID_10CDD63C_79C1_4F2D_BB28_AD2BE65A02ED_htm
    // ref: http://docs.autodesk.com/FBX/2014/ENU/FBX-SDK-Documentation/index.html?url=cpp_ref/_transformations_2main_8cxx-example.html,topicNumber=cpp_ref__transformations_2main_8cxx_example_htmlfc10a1e1-b18d-4e72-9dc0-70d0f1959f5e
    function generateTransform(transformData) {
      const lTranslationM = new THREE.Matrix4();
      const lPreRotationM = new THREE.Matrix4();
      const lRotationM = new THREE.Matrix4();
      const lPostRotationM = new THREE.Matrix4();
      const lScalingM = new THREE.Matrix4();
      const lScalingPivotM = new THREE.Matrix4();
      const lScalingOffsetM = new THREE.Matrix4();
      const lRotationOffsetM = new THREE.Matrix4();
      const lRotationPivotM = new THREE.Matrix4();
      const lParentGX = new THREE.Matrix4();
      const lParentLX = new THREE.Matrix4();
      const lGlobalT = new THREE.Matrix4();
      const inheritType = transformData.inheritType ? transformData.inheritType : 0;
      if (transformData.translation) lTranslationM.setPosition(tempVec.fromArray(transformData.translation));
      if (transformData.preRotation) {
        const array = transformData.preRotation.map(THREE.MathUtils.degToRad);
        array.push(transformData.eulerOrder || THREE.Euler.DEFAULT_ORDER);
        lPreRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
      }
      if (transformData.rotation) {
        const array = transformData.rotation.map(THREE.MathUtils.degToRad);
        array.push(transformData.eulerOrder || THREE.Euler.DEFAULT_ORDER);
        lRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
      }
      if (transformData.postRotation) {
        const array = transformData.postRotation.map(THREE.MathUtils.degToRad);
        array.push(transformData.eulerOrder || THREE.Euler.DEFAULT_ORDER);
        lPostRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
        lPostRotationM.invert();
      }
      if (transformData.scale) lScalingM.scale(tempVec.fromArray(transformData.scale));

      // Pivots and offsets
      if (transformData.scalingOffset) lScalingOffsetM.setPosition(tempVec.fromArray(transformData.scalingOffset));
      if (transformData.scalingPivot) lScalingPivotM.setPosition(tempVec.fromArray(transformData.scalingPivot));
      if (transformData.rotationOffset) lRotationOffsetM.setPosition(tempVec.fromArray(transformData.rotationOffset));
      if (transformData.rotationPivot) lRotationPivotM.setPosition(tempVec.fromArray(transformData.rotationPivot));

      // parent transform
      if (transformData.parentMatrixWorld) {
        lParentLX.copy(transformData.parentMatrix);
        lParentGX.copy(transformData.parentMatrixWorld);
      }
      const lLRM = lPreRotationM.clone().multiply(lRotationM).multiply(lPostRotationM);
      // Global Rotation
      const lParentGRM = new THREE.Matrix4();
      lParentGRM.extractRotation(lParentGX);

      // Global Shear*Scaling
      const lParentTM = new THREE.Matrix4();
      lParentTM.copyPosition(lParentGX);
      const lParentGRSM = lParentTM.clone().invert().multiply(lParentGX);
      const lParentGSM = lParentGRM.clone().invert().multiply(lParentGRSM);
      const lLSM = lScalingM;
      const lGlobalRS = new THREE.Matrix4();
      if (inheritType === 0) {
        lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM).multiply(lLSM);
      } else if (inheritType === 1) {
        lGlobalRS.copy(lParentGRM).multiply(lParentGSM).multiply(lLRM).multiply(lLSM);
      } else {
        const lParentLSM = new THREE.Matrix4().scale(new THREE.Vector3().setFromMatrixScale(lParentLX));
        const lParentLSM_inv = lParentLSM.clone().invert();
        const lParentGSM_noLocal = lParentGSM.clone().multiply(lParentLSM_inv);
        lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM_noLocal).multiply(lLSM);
      }
      const lRotationPivotM_inv = lRotationPivotM.clone().invert();
      const lScalingPivotM_inv = lScalingPivotM.clone().invert();
      // Calculate the local transform matrix
      let lTransform = lTranslationM.clone().multiply(lRotationOffsetM).multiply(lRotationPivotM).multiply(lPreRotationM).multiply(lRotationM).multiply(lPostRotationM).multiply(lRotationPivotM_inv).multiply(lScalingOffsetM).multiply(lScalingPivotM).multiply(lScalingM).multiply(lScalingPivotM_inv);
      const lLocalTWithAllPivotAndOffsetInfo = new THREE.Matrix4().copyPosition(lTransform);
      const lGlobalTranslation = lParentGX.clone().multiply(lLocalTWithAllPivotAndOffsetInfo);
      lGlobalT.copyPosition(lGlobalTranslation);
      lTransform = lGlobalT.clone().multiply(lGlobalRS);

      // from global to local
      lTransform.premultiply(lParentGX.invert());
      return lTransform;
    }

    // Returns the three.js intrinsic Euler order corresponding to FBX extrinsic Euler order
    // ref: http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_euler_html
    function getEulerOrder(order) {
      order = order || 0;
      const enums = ['ZYX',
      // -> XYZ extrinsic
      'YZX',
      // -> XZY extrinsic
      'XZY',
      // -> YZX extrinsic
      'ZXY',
      // -> YXZ extrinsic
      'YXZ',
      // -> ZXY extrinsic
      'XYZ' // -> ZYX extrinsic
      //'SphericXYZ', // not possible to support
      ];

      if (order === 6) {
        console.warn('THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.');
        return enums[0];
      }
      return enums[order];
    }

    // Parses comma separated list of numbers and returns them an array.
    // Used internally by the TextParser
    function parseNumberArray(value) {
      const array = value.split(',').map(function (val) {
        return parseFloat(val);
      });
      return array;
    }
    function convertArrayBufferToString(buffer, from, to) {
      if (from === undefined) from = 0;
      if (to === undefined) to = buffer.byteLength;
      return new TextDecoder().decode(new Uint8Array(buffer, from, to));
    }
    function append(a, b) {
      for (let i = 0, j = a.length, l = b.length; i < l; i++, j++) {
        a[j] = b[i];
      }
    }
    function slice(a, b, from, to) {
      for (let i = from, j = 0; i < to; i++, j++) {
        a[j] = b[i];
      }
      return a;
    }

    // inject array a2 into array a1 at index
    function inject(a1, index, a2) {
      return a1.slice(0, index).concat(a2).concat(a1.slice(index));
    }

    var Model = /** @class */ (function () {
        function Model(options) {
            var _this = this;
            var _a;
            this.gScenes = options.gScenes;
            this.gStatus = options.gStatus;
            this.gRayGroup = options.gRayGroup;
            this.gAmGroup = options.gAmGroup;
            this.baseURL = options.baseURL;
            this.mixer = null;
            this.bus = options.bus;
            this.deepFunction = [];
            this.animate = true;
            (_a = options.animateFuntion) === null || _a === void 0 ? void 0 : _a.push(function (dt) {
                if (_this.animate) {
                    _this.mixer && _this.mixer.update(dt);
                }
            });
        }
        /*
         *@description: 加载配置文件
         *@author: yangj
         *@date: 2023-03-04 16:26:55
         *@return:
         */
        Model.prototype.getConfig = function () {
            return axios.get(this.baseURL + "config.json");
        };
        /*
         *@description: 加载glb
         *@author: yangj
         *@date: 2023-03-04 16:27:04
         *@return:
         */
        Model.prototype.load = function (sceneidx, callback) {
            var _this = this;
            var icount = 0;
            var dicount = 0;
            this.getConfig()
                .then(function (res) {
                res.data.forEach(function (configItem) {
                    if (sceneidx !== configItem["layeridx"]) {
                        return;
                    }
                    configItem["layers"].forEach(function (layers) {
                        icount++;
                        _this.loadConfigModel(_this.baseURL + layers["name"], configItem, function (scene) {
                            _this.decodeSence(scene, configItem, layers, function () {
                                dicount++;
                                _this.bus.emit("scene", {
                                    type: "loading",
                                    progressNum: (dicount / icount) * 100,
                                    value: true
                                });
                                if (dicount === icount) {
                                    _this.gStatus[sceneidx] = true;
                                    callback ? callback() : "";
                                }
                            });
                        });
                    });
                });
            })["catch"](function () { });
        };
        /*
         *@description: 加载配置文件glb
         *@author: yangj
         *@date: 2023-03-04 16:27:26
         *@return:
         */
        Model.prototype.loadConfigModel = function (url, configItem, callback) {
            var that = this;
            var loader = new GLTFExtensionLoader(new THREE.LoadingManager());
            loader.load(url).then(function (gltf) {
                var ascene = gltf.scene;
                ascene.scale.set(configItem.scale, configItem.scale, configItem.scale);
                ascene.animations = gltf.animations;
                if (configItem.target) {
                    that.gRayGroup[configItem.layeridx].add(ascene);
                }
                else {
                    that.gAmGroup[configItem.layeridx].add(ascene);
                }
                callback ? callback(ascene) : "";
            });
        };
        /*
         *@description: 加载glb
         *@author: yangj
         *@date: 2023-03-19 18:25:38
         *@return:
         */
        Model.prototype.loadModel = function (url, sceneidx, callback) {
            var _this = this;
            var loader = new GLTFExtensionLoader(new THREE.LoadingManager());
            loader.load(url).then(function (glb) {
                _this.addclips(glb.animations, sceneidx);
                callback(glb.scene, glb.animations);
            });
        };
        /*
         *@description: 加载fbx
         *@author: yangj
         *@date: 2023-03-28 14:42:51
         *@return:
         */
        Model.prototype.loadFbxModel = function (url, sceneidx, callback) {
            var _this = this;
            var loader = new FBXLoader();
            loader.load(url, function (object) {
                _this.addclips(object.animations, sceneidx);
                callback(object, object.animations);
            });
        };
        /*
         *@description: 处理模型
         *@author: yangj
         *@date: 2023-03-04 16:26:35
         *@return:
         */
        Model.prototype.decodeSence = function (scene, configItem, layers, callback) {
            var _this = this;
            var tage = layers["receiveShadow"];
            if (configItem["positionX"]) {
                scene.position.setX(configItem["positionX"]);
            }
            if (configItem["positionY"]) {
                scene.position.setY(configItem["positionY"]);
            }
            if (configItem["positionZ"]) {
                scene.position.setZ(configItem["positionZ"]);
            }
            scene.traverse(function (e) {
                if (e.isMesh) {
                    if (tage) {
                        e.castShadow = false;
                        e.receiveShadow = true;
                    }
                    else {
                        e.castShadow = true;
                        e.receiveShadow = true;
                    }
                    e.material.shadowSide = THREE.FrontSide;
                    e.material.needsUpdate = true;
                    _this.deepFunction.forEach(function (fn) {
                        return fn({
                            e: e,
                            item: configItem
                        });
                    });
                }
            });
            this.addclips(scene.animations, configItem["layeridx"]);
            callback ? callback() : "";
        };
        /*
         *@description: 添加动画组
         *@author: yangj
         *@date: 2023-03-04 16:26:24
         *@return:
         */
        Model.prototype.addclips = function (clips, sidx) {
            var _this = this;
            clips.forEach(function (item) {
                _this.gScenes[sidx].animations.push(item);
            });
        };
        /*
         *@description: 执行动画
         *@author: yangj
         *@date: 2023-03-04 14:01:12
         *@return:
         */
        Model.prototype.playAllClipes = function (sceneidx) {
            var _this = this;
            // 先全部停止
            if (this.mixer) {
                this.mixer.stopAllAction();
                this.mixer.uncacheRoot(this.mixer.getRoot());
                // this.mixer = null;
                this.mixer = new THREE.AnimationMixer(this.gScenes[sceneidx]);
            }
            else {
                this.mixer = new THREE.AnimationMixer(this.gScenes[sceneidx]);
            }
            this.gScenes[sceneidx].animations.forEach(function (clip) {
                _this.mixer.clipAction(clip).reset().play();
            });
        };
        /*
         *@description: 执行名称动画
         *@author: yangj
         *@date: 2023-03-19 18:48:08
         *@return:
         */
        Model.prototype.playNameClipes = function (sceneidx, clipName) {
            var _this = this;
            // 先全部停止
            if (this.mixer) {
                this.mixer.stopAllAction();
                this.mixer.uncacheRoot(this.mixer.getRoot());
                this.mixer = null;
                this.mixer = new THREE.AnimationMixer(this.gScenes[sceneidx]);
            }
            else {
                this.mixer = new THREE.AnimationMixer(this.gScenes[sceneidx]);
            }
            this.gScenes[sceneidx].animations.forEach(function (clip) {
                if (clip.name === clipName) {
                    _this.mixer.clipAction(clip).reset().play();
                }
            });
        };
        return Model;
    }());

    /**
     * Based on "A Practical Analytic Model for Daylight"
     * aka The Preetham Model, the de facto standard analytic skydome model
     * https://www.researchgate.net/publication/220720443_A_Practical_Analytic_Model_for_Daylight
     *
     * First implemented by Simon Wallner
     * http://simonwallner.at/project/atmospheric-scattering/
     *
     * Improved by Martin Upitis
     * http://blenderartists.org/forum/showthread.php?245954-preethams-sky-impementation-HDR
     *
     * Three.js integration by zz85 http://twitter.com/blurspline
     */
    var Sky$1 = /** @class */ (function (_super) {
        __extends(Sky, _super);
        function Sky() {
            var _this = this;
            var shader = Sky.SkyShader;
            var material = new THREE.ShaderMaterial({
                name: "SkyShader",
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: THREE.UniformsUtils.clone(shader.uniforms),
                side: THREE.BackSide,
                depthWrite: false
            });
            _this = _super.call(this, new THREE.BoxGeometry(1, 1, 1), material) || this;
            _this.isSky = true;
            return _this;
        }
        return Sky;
    }(THREE.Mesh));
    Sky$1.SkyShader = {
        uniforms: {
            turbidity: { value: 2 },
            rayleigh: { value: 1 },
            mieCoefficient: { value: 0.005 },
            mieDirectionalG: { value: 0.8 },
            sunPosition: { value: new THREE.Vector3() },
            up: { value: new THREE.Vector3(0, 1, 0) }
        },
        vertexShader: /* glsl */ "\n\t\tuniform vec3 sunPosition;\n\t\tuniform float rayleigh;\n\t\tuniform float turbidity;\n\t\tuniform float mieCoefficient;\n\t\tuniform vec3 up;\n\n\t\tvarying vec3 vWorldPosition;\n\t\tvarying vec3 vSunDirection;\n\t\tvarying float vSunfade;\n\t\tvarying vec3 vBetaR;\n\t\tvarying vec3 vBetaM;\n\t\tvarying float vSunE;\n\n\t\t// constants for atmospheric scattering\n\t\tconst float e = 2.71828182845904523536028747135266249775724709369995957;\n\t\tconst float pi = 3.141592653589793238462643383279502884197169;\n\n\t\t// wavelength of used primaries, according to preetham\n\t\tconst vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );\n\t\t// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:\n\t\t// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))\n\t\tconst vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );\n\n\t\t// mie stuff\n\t\t// K coefficient for the primaries\n\t\tconst float v = 4.0;\n\t\tconst vec3 K = vec3( 0.686, 0.678, 0.666 );\n\t\t// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K\n\t\tconst vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );\n\n\t\t// earth shadow hack\n\t\t// cutoffAngle = pi / 1.95;\n\t\tconst float cutoffAngle = 1.6110731556870734;\n\t\tconst float steepness = 1.5;\n\t\tconst float EE = 1000.0;\n\n\t\tfloat sunIntensity( float zenithAngleCos ) {\n\t\t\tzenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );\n\t\t\treturn EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );\n\t\t}\n\n\t\tvec3 totalMie( float T ) {\n\t\t\tfloat c = ( 0.2 * T ) * 10E-18;\n\t\t\treturn 0.434 * c * MieConst;\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\t\t\tvWorldPosition = worldPosition.xyz;\n\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\tgl_Position.z = gl_Position.w; // set z to camera.far\n\n\t\t\tvSunDirection = normalize( sunPosition );\n\n\t\t\tvSunE = sunIntensity( dot( vSunDirection, up ) );\n\n\t\t\tvSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );\n\n\t\t\tfloat rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );\n\n\t\t\t// extinction (absorbtion + out scattering)\n\t\t\t// rayleigh coefficients\n\t\t\tvBetaR = totalRayleigh * rayleighCoefficient;\n\n\t\t\t// mie coefficients\n\t\t\tvBetaM = totalMie( turbidity ) * mieCoefficient;\n\n\t\t}",
        fragmentShader: /* glsl */ "\n\t\tvarying vec3 vWorldPosition;\n\t\tvarying vec3 vSunDirection;\n\t\tvarying float vSunfade;\n\t\tvarying vec3 vBetaR;\n\t\tvarying vec3 vBetaM;\n\t\tvarying float vSunE;\n\n\t\tuniform float mieDirectionalG;\n\t\tuniform vec3 up;\n\n\t\tconst vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );\n\n\t\t// constants for atmospheric scattering\n\t\tconst float pi = 3.141592653589793238462643383279502884197169;\n\n\t\tconst float n = 1.0003; // refractive index of air\n\t\tconst float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)\n\n\t\t// optical length at zenith for molecules\n\t\tconst float rayleighZenithLength = 8.4E3;\n\t\tconst float mieZenithLength = 1.25E3;\n\t\t// 66 arc seconds -> degrees, and the cosine of that\n\t\tconst float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;\n\n\t\t// 3.0 / ( 16.0 * pi )\n\t\tconst float THREE_OVER_SIXTEENPI = 0.05968310365946075;\n\t\t// 1.0 / ( 4.0 * pi )\n\t\tconst float ONE_OVER_FOURPI = 0.07957747154594767;\n\n\t\tfloat rayleighPhase( float cosTheta ) {\n\t\t\treturn THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );\n\t\t}\n\n\t\tfloat hgPhase( float cosTheta, float g ) {\n\t\t\tfloat g2 = pow( g, 2.0 );\n\t\t\tfloat inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );\n\t\t\treturn ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvec3 direction = normalize( vWorldPosition - cameraPos );\n\n\t\t\t// optical length\n\t\t\t// cutoff angle at 90 to avoid singularity in next formula.\n\t\t\tfloat zenithAngle = acos( max( 0.0, dot( up, direction ) ) );\n\t\t\tfloat inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );\n\t\t\tfloat sR = rayleighZenithLength * inverse;\n\t\t\tfloat sM = mieZenithLength * inverse;\n\n\t\t\t// combined extinction factor\n\t\t\tvec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );\n\n\t\t\t// in scattering\n\t\t\tfloat cosTheta = dot( direction, vSunDirection );\n\n\t\t\tfloat rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );\n\t\t\tvec3 betaRTheta = vBetaR * rPhase;\n\n\t\t\tfloat mPhase = hgPhase( cosTheta, mieDirectionalG );\n\t\t\tvec3 betaMTheta = vBetaM * mPhase;\n\n\t\t\tvec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );\n\t\t\tLin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );\n\n\t\t\t// nightsky\n\t\t\tfloat theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]\n\t\t\tfloat phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]\n\t\t\tvec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );\n\t\t\tvec3 L0 = vec3( 0.1 ) * Fex;\n\n\t\t\t// composition + solar disc\n\t\t\tfloat sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );\n\t\t\tL0 += ( vSunE * 19000.0 * Fex ) * sundisk;\n\n\t\t\tvec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );\n\n\t\t\tvec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );\n\n\t\t\tgl_FragColor = vec4( retColor, 1.0 );\n\n\t\t\t#include <tonemapping_fragment>\n\t\t\t#include <encodings_fragment>\n\n\t\t}"
    };

    var Sky = /** @class */ (function () {
        function Sky(options) {
            this.path = options.path;
            this.gSkyBox = [null, null];
            this.sceneidx = options.sceneidx;
            this.gScenes = options.gScenes;
        }
        Sky.prototype.setSkyBox = function (skydir) {
            // 创建几何模型 BoxGeometry('x轴', '轴', 'z轴')
            var geometry = new THREE.BoxGeometry(20000, 20000, 20000);
            // 创建纹理贴图  前后  上下  左右
            var texture0 = new THREE.TextureLoader().load(this.path + "".concat(skydir, "/px.jpg"));
            var texture1 = new THREE.TextureLoader().load(this.path + "".concat(skydir, "/nx.jpg"));
            var texture2 = new THREE.TextureLoader().load(this.path + "".concat(skydir, "/py.jpg"));
            var texture3 = new THREE.TextureLoader().load(this.path + "".concat(skydir, "/ny.jpg"));
            var texture4 = new THREE.TextureLoader().load(this.path + "".concat(skydir, "/pz.jpg"));
            var texture5 = new THREE.TextureLoader().load(this.path + "".concat(skydir, "/nz.jpg"));
            // 添加材质
            var material = [
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture0,
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture1,
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture2,
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture3,
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture4,
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture5,
                    side: THREE.BackSide
                }),
            ];
            // 创建网格对象
            var cube = new THREE.Mesh(geometry, material);
            cube.name = "skybox";
            this.sky = cube;
            if (this.gSkyBox[this.sceneidx]) {
                this.gScenes[this.sceneidx].remove(this.gSkyBox[this.sceneidx]);
                this.gSkyBox[this.sceneidx].geometry.dispose();
            }
            this.gSkyBox[this.sceneidx] = cube;
            this.gScenes[this.sceneidx].add(cube);
        };
        Sky.prototype.initShaderSky = function (option) {
            if (this.gSkyBox[this.sceneidx]) {
                this.gScenes[this.sceneidx].remove(this.gSkyBox[this.sceneidx]);
            }
            var sky = new Sky$1();
            this.sky = sky;
            sky.scale.setScalar(option.scale);
            this.gScenes[this.sceneidx].add(sky);
            var skyUniforms = sky.material.uniforms;
            skyUniforms["turbidity"].value = option.turbidity; //浑浊度
            skyUniforms["rayleigh"].value = option.rayleigh; //散射
            skyUniforms["mieCoefficient"].value = 0.005;
            skyUniforms["mieDirectionalG"].value = 0.8;
            skyUniforms["sunPosition"].value = new THREE.Vector3(option.postion[0], option.postion[1], option.postion[2]);
        };
        return Sky;
    }());

    var Ambient = /** @class */ (function () {
        function Ambient(options) {
            this.scene = options.scene;
            this.renderer = options.renderer;
        }
        Ambient.prototype.setLight = function (exposure, intensity) {
            this.renderer.toneMappingExposure = exposure;
            var obj3d = this.scene.getObjectByName("ambient_light");
            if (obj3d === undefined) {
                console.log(obj3d);
                var light = new THREE.AmbientLight(0xffffff, exposure);
                light.name = "ambient_light";
                this.scene.add(light);
            }
            else {
                if (obj3d instanceof THREE.AmbientLight) {
                    obj3d.intensity = intensity;
                }
            }
        };
        return Ambient;
    }());

    var SkyLight = /** @class */ (function () {
        function SkyLight(scene) {
            this.scene = scene;
        }
        SkyLight.prototype.init = function (skyColor, earthColor, intensity) {
            this.light = new THREE.HemisphereLight(skyColor, earthColor, intensity);
            this.scene.add(this.light);
            return this.light;
        };
        SkyLight.prototype.initHelper = function (size) {
            this.helper = new THREE.HemisphereLightHelper(this.light, size);
            this.scene.add(this.helper);
        };
        SkyLight.prototype.destory = function () {
            this.scene.remove(this.helper);
            this.scene.remove(this.light);
        };
        return SkyLight;
    }());

    var Directional = /** @class */ (function () {
        function Directional(scene) {
            this.scene = scene;
            this.scope = 100;
            this.shadowMass = 2048;
        }
        Directional.prototype.init = function (color, intensity) {
            this.light = new THREE.DirectionalLight(color, intensity);
            this.light.castShadow = true; // 将此平行光源产生阴影的属性打开
            // 设置平行光的的阴影属性，即一个长方体的长宽高，在设定值的范围内的物体才会产生阴影
            var d = this.scope;
            this.light.shadow.camera.left = -d;
            this.light.shadow.camera.right = d;
            this.light.shadow.camera.top = d;
            this.light.shadow.camera.bottom = -d;
            this.light.shadow.camera.near = 10;
            this.light.shadow.camera.far = 8000;
            this.light.shadow.mapSize.x = this.shadowMass; // 定义阴影贴图的宽度和高度,必须为2的整数此幂
            this.light.shadow.mapSize.y = this.shadowMass; // 较高的值会以计算时间为代价提供更好的阴影质量
            // this.light.shadow.bias = -0.0005; //解决条纹阴影的出现
            this.scene.add(this.light);
            return this.light;
        };
        Directional.prototype.initHelper = function (size) {
            this.helper = new THREE.DirectionalLightHelper(this.light, size);
            this.scene.add(this.helper);
        };
        Directional.prototype.destory = function () {
            this.scene.remove(this.helper);
            this.scene.remove(this.light);
        };
        return Directional;
    }());

    var PointLight = /** @class */ (function () {
        function PointLight(scene) {
            this.scene = scene;
            this.shadowMass = 2048;
        }
        PointLight.prototype.init = function (color, intensity, distance, decay) {
            this.light = new THREE.PointLight(color, intensity, distance, decay);
            this.light.castShadow = true;
            this.light.shadow.camera.near = 10;
            this.light.shadow.camera.far = 8000;
            this.light.shadow.mapSize.x = this.shadowMass; // 定义阴影贴图的宽度和高度,必须为2的整数此幂
            this.light.shadow.mapSize.y = this.shadowMass; // 较高的值会以计算时间为代价提供更好的阴影质量
            // this.light.shadow.bias = -0.0005; //解决条纹阴影的出现
            this.scene.add(this.light);
            return this.light;
        };
        PointLight.prototype.initHelper = function (size) {
            this.helper = new THREE.PointLightHelper(this.light, size);
            this.scene.add(this.helper);
        };
        PointLight.prototype.destory = function () {
            this.scene.remove(this.helper);
            this.scene.remove(this.light);
        };
        return PointLight;
    }());

    var SpotLight = /** @class */ (function () {
        function SpotLight(scene) {
            this.scene = scene;
            this.shadowMass = 2048;
        }
        SpotLight.prototype.init = function (color, intensity, distance, target) {
            this.light = new THREE.SpotLight(color, intensity, distance);
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = 1024;
            this.light.shadow.mapSize.height = 1024;
            this.light.shadow.camera.near = 10;
            this.light.shadow.camera.fov = 10;
            this.light.shadow.camera.far = 8000;
            this.light.shadow.focus = 1;
            if (target) {
                var targetObject = new THREE.Object3D();
                targetObject.position.copy(target);
                this.scene.add(targetObject);
                this.light.target = targetObject;
            }
            this.scene.add(this.light);
            return this.light;
        };
        SpotLight.prototype.initHelper = function (size) {
            this.helper = new THREE.SpotLightHelper(this.light, size);
            this.scene.add(this.helper);
        };
        SpotLight.prototype.destory = function () {
            this.scene.remove(this.helper);
            this.scene.remove(this.light);
        };
        return SpotLight;
    }());

    /**
     *  This helper must be added as a child of the light
     */

    class RectAreaLightHelper extends THREE.Line {
      constructor(light, color) {
        const positions = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0];
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.computeBoundingSphere();
        const material = new THREE.LineBasicMaterial({
          fog: false
        });
        super(geometry, material);
        this.light = light;
        this.color = color; // optional hardwired color for the helper
        this.type = 'RectAreaLightHelper';

        //

        const positions2 = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
        const geometry2 = new THREE.BufferGeometry();
        geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3));
        geometry2.computeBoundingSphere();
        this.add(new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          fog: false
        })));
      }
      updateMatrixWorld() {
        this.scale.set(0.5 * this.light.width, 0.5 * this.light.height, 1);
        if (this.color !== undefined) {
          this.material.color.set(this.color);
          this.children[0].material.color.set(this.color);
        } else {
          this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);

          // prevent hue shift
          const c = this.material.color;
          const max = Math.max(c.r, c.g, c.b);
          if (max > 1) c.multiplyScalar(1 / max);
          this.children[0].material.color.copy(this.material.color);
        }

        // ignore world scale on light
        this.matrixWorld.extractRotation(this.light.matrixWorld).scale(this.scale).copyPosition(this.light.matrixWorld);
        this.children[0].matrixWorld.copy(this.matrixWorld);
      }
      dispose() {
        this.geometry.dispose();
        this.material.dispose();
        this.children[0].geometry.dispose();
        this.children[0].material.dispose();
      }
    }

    /**
     * Uniforms library for RectAreaLight shared webgl shaders
     *
     * NOTE: This is a temporary location for the BRDF approximation texture data
     *       based off of Eric Heitz's work (see citation below).  BRDF data for
     *       RectAreaLight is currently approximated using a precomputed texture
     *       of roughly 80kb in size.  The hope is to find a better way to include
     *       the large texture data before including the full RectAreaLight implementation
     *       in the main build files.
     *
     * TODO: figure out a way to compress the LTC BRDF data
     */

    // Real-Time Polygonal-Light Shading with Linearly Transformed Cosines
    // by Eric Heitz, Jonathan Dupuy, Stephen Hill and David Neubelt
    // code: https://github.com/selfshadow/ltc_code/

    class RectAreaLightUniformsLib {
      static init() {
        // source: https://github.com/selfshadow/ltc_code/tree/master/fit/results/ltc.js

        const LTC_MAT_1 = [1, 0, 0, 2e-5, 1, 0, 0, 0.000503905, 1, 0, 0, 0.00201562, 1, 0, 0, 0.00453516, 1, 0, 0, 0.00806253, 1, 0, 0, 0.0125978, 1, 0, 0, 0.018141, 1, 0, 0, 0.0246924, 1, 0, 0, 0.0322525, 1, 0, 0, 0.0408213, 1, 0, 0, 0.0503999, 1, 0, 0, 0.0609894, 1, 0, 0, 0.0725906, 1, 0, 0, 0.0852058, 1, 0, 0, 0.0988363, 1, 0, 0, 0.113484, 1, 0, 0, 0.129153, 1, 0, 0, 0.145839, 1, 0, 0, 0.163548, 1, 0, 0, 0.182266, 1, 0, 0, 0.201942, 1, 0, 0, 0.222314, 1, 0, 0, 0.241906, 1, 0, 0, 0.262314, 1, 0, 0, 0.285754, 1, 0, 0, 0.310159, 1, 0, 0, 0.335426, 1, 0, 0, 0.361341, 1, 0, 0, 0.387445, 1, 0, 0, 0.412784, 1, 0, 0, 0.438197, 1, 0, 0, 0.466966, 1, 0, 0, 0.49559, 1, 0, 0, 0.523448, 1, 0, 0, 0.549938, 1, 0, 0, 0.57979, 1, 0, 0, 0.608746, 1, 0, 0, 0.636185, 1, 0, 0, 0.664748, 1, 0, 0, 0.69313, 1, 0, 0, 0.71966, 1, 0, 0, 0.747662, 1, 0, 0, 0.774023, 1, 0, 0, 0.799775, 1, 0, 0, 0.825274, 1, 0, 0, 0.849156, 1, 0, 0, 0.873248, 1, 0, 0, 0.89532, 1, 0, 0, 0.917565, 1, 0, 0, 0.937863, 1, 0, 0, 0.958139, 1, 0, 0, 0.976563, 1, 0, 0, 0.994658, 1, 0, 0, 1.0112, 1, 0, 0, 1.02712, 1, 0, 0, 1.04189, 1, 0, 0, 1.05568, 1, 0, 0, 1.06877, 1, 0, 0, 1.08058, 1, 0, 0, 1.09194, 1, 0, 0, 1.10191, 1, 0, 0, 1.11161, 1, 0, 0, 1.1199, 1, 0, 0, 1.12813, 0.999547, -4.48815e-7, 0.0224417, 1.99902e-5, 0.999495, -1.13079e-5, 0.0224406, 0.000503651, 0.999496, -4.52317e-5, 0.0224406, 0.00201461, 0.999496, -0.000101772, 0.0224406, 0.00453287, 0.999495, -0.000180928, 0.0224406, 0.00805845, 0.999497, -0.000282702, 0.0224406, 0.0125914, 0.999496, -0.000407096, 0.0224406, 0.0181319, 0.999498, -0.000554114, 0.0224406, 0.02468, 0.999499, -0.000723768, 0.0224406, 0.0322363, 0.999495, -0.000916058, 0.0224405, 0.0408009, 0.999499, -0.00113101, 0.0224408, 0.050375, 0.999494, -0.00136863, 0.0224405, 0.0609586, 0.999489, -0.00162896, 0.0224401, 0.0725537, 0.999489, -0.00191201, 0.0224414, 0.0851619, 0.999498, -0.00221787, 0.0224413, 0.0987867, 0.999492, -0.00254642, 0.0224409, 0.113426, 0.999507, -0.00289779, 0.0224417, 0.129088, 0.999494, -0.0032716, 0.0224386, 0.145767, 0.999546, -0.0036673, 0.0224424, 0.163472, 0.999543, -0.00408166, 0.0224387, 0.182182, 0.999499, -0.00450056, 0.0224338, 0.201843, 0.999503, -0.00483661, 0.0224203, 0.222198, 0.999546, -0.00452928, 0.022315, 0.241714, 0.999508, -0.00587403, 0.0224329, 0.262184, 0.999509, -0.00638806, 0.0224271, 0.285609, 0.999501, -0.00691028, 0.0224166, 0.309998, 0.999539, -0.00741979, 0.0223989, 0.335262, 0.999454, -0.00786282, 0.0223675, 0.361154, 0.999529, -0.00811928, 0.0222828, 0.387224, 0.999503, -0.00799941, 0.0221063, 0.41252, 0.999561, -0.00952753, 0.0223057, 0.438006, 0.999557, -0.0099134, 0.0222065, 0.466735, 0.999541, -0.0100935, 0.0220402, 0.495332, 0.999562, -0.00996821, 0.0218067, 0.523197, 0.999556, -0.0105031, 0.0217096, 0.550223, 0.999561, -0.0114191, 0.0217215, 0.579498, 0.999588, -0.0111818, 0.0213357, 0.608416, 0.999633, -0.0107725, 0.0208689, 0.635965, 0.999527, -0.0121671, 0.0210149, 0.664476, 0.999508, -0.0116005, 0.020431, 0.692786, 0.999568, -0.0115604, 0.0199791, 0.719709, 0.999671, -0.0121117, 0.0197415, 0.74737, 0.999688, -0.0110769, 0.0188846, 0.773692, 0.99962, -0.0122368, 0.0188452, 0.799534, 0.999823, -0.0110325, 0.0178001, 0.825046, 0.999599, -0.0114923, 0.0174221, 0.849075, 0.999619, -0.0105923, 0.0164345, 0.872999, 0.999613, -0.0105988, 0.0158227, 0.895371, 0.99964, -0.00979861, 0.0148131, 0.917364, 0.99977, -0.00967238, 0.0140721, 0.938002, 0.999726, -0.00869175, 0.0129543, 0.957917, 0.99973, -0.00866872, 0.0122329, 0.976557, 0.999773, -0.00731956, 0.0108958, 0.994459, 0.999811, -0.00756027, 0.0102715, 1.01118, 0.999862, -0.00583732, 0.00878781, 1.02701, 0.999835, -0.00631438, 0.00827529, 1.04186, 0.999871, -0.00450785, 0.00674583, 1.05569, 0.999867, -0.00486079, 0.00621041, 1.06861, 0.999939, -0.00322072, 0.00478301, 1.08064, 0.999918, -0.00318199, 0.00406395, 1.09181, 1.00003, -0.00193348, 0.00280682, 1.10207, 0.999928, -0.00153729, 0.00198741, 1.11152, 0.999933, -0.000623666, 0.000917714, 1.12009, 1, -1.02387e-6, 9.07581e-7, 1.12813, 0.997866, -8.96716e-7, 0.0448334, 1.99584e-5, 0.997987, -2.25945e-5, 0.0448389, 0.000502891, 0.997987, -9.03781e-5, 0.0448388, 0.00201156, 0.997985, -0.000203351, 0.0448388, 0.00452602, 0.997986, -0.000361514, 0.0448388, 0.00804629, 0.997987, -0.00056487, 0.0448389, 0.0125724, 0.997988, -0.000813423, 0.0448389, 0.0181045, 0.997984, -0.00110718, 0.0448387, 0.0246427, 0.997985, -0.00144616, 0.0448388, 0.0321875, 0.997987, -0.00183038, 0.044839, 0.0407392, 0.997983, -0.00225987, 0.0448387, 0.0502986, 0.997991, -0.00273467, 0.0448389, 0.0608667, 0.997984, -0.00325481, 0.0448384, 0.0724444, 0.998002, -0.00382043, 0.044839, 0.0850348, 0.997997, -0.00443145, 0.0448396, 0.0986372, 0.998007, -0.00508796, 0.0448397, 0.113255, 0.998008, -0.00578985, 0.04484, 0.128891, 0.998003, -0.00653683, 0.0448384, 0.145548, 0.997983, -0.00732713, 0.0448358, 0.163221, 0.997985, -0.00815454, 0.0448358, 0.181899, 0.998005, -0.00898985, 0.0448286, 0.201533, 0.998026, -0.00964404, 0.0447934, 0.221821, 0.998055, -0.00922677, 0.044611, 0.241282, 0.99804, -0.0117361, 0.0448245, 0.261791, 0.998048, -0.0127628, 0.0448159, 0.285181, 0.998088, -0.0138055, 0.0447996, 0.30954, 0.998058, -0.0148206, 0.0447669, 0.334751, 0.998099, -0.0156998, 0.044697, 0.36061, 0.998116, -0.0161976, 0.0445122, 0.386603, 0.998195, -0.015945, 0.0441711, 0.411844, 0.998168, -0.0183947, 0.0444255, 0.43773, 0.998184, -0.0197913, 0.0443809, 0.466009, 0.998251, -0.0201426, 0.0440689, 0.494574, 0.998305, -0.0198847, 0.0435632, 0.522405, 0.998273, -0.0210577, 0.043414, 0.549967, 0.998254, -0.0227901, 0.0433943, 0.578655, 0.998349, -0.0223108, 0.0426529, 0.60758, 0.99843, -0.0223088, 0.042, 0.635524, 0.998373, -0.0241141, 0.0418987, 0.663621, 0.998425, -0.0231446, 0.0408118, 0.691906, 0.998504, -0.0233684, 0.0400565, 0.719339, 0.998443, -0.0241652, 0.0394634, 0.74643, 0.99848, -0.0228715, 0.0380002, 0.773086, 0.998569, -0.023519, 0.0372322, 0.798988, 0.998619, -0.0223108, 0.0356468, 0.824249, 0.998594, -0.0223105, 0.034523, 0.848808, 0.998622, -0.0213426, 0.0328887, 0.87227, 0.998669, -0.0207912, 0.0314374, 0.895157, 0.998705, -0.0198416, 0.0296925, 0.916769, 0.998786, -0.0189168, 0.0279634, 0.937773, 0.998888, -0.0178811, 0.0261597, 0.957431, 0.99906, -0.0166845, 0.0242159, 0.976495, 0.999038, -0.0155464, 0.0222638, 0.994169, 0.999237, -0.0141349, 0.0201967, 1.01112, 0.999378, -0.0129324, 0.0181744, 1.02692, 0.999433, -0.0113192, 0.0159898, 1.04174, 0.999439, -0.0101244, 0.0140385, 1.05559, 0.999614, -0.00837456, 0.0117826, 1.06852, 0.999722, -0.00721769, 0.00983745, 1.08069, 0.999817, -0.00554067, 0.00769002, 1.09176, 0.99983, -0.00426961, 0.005782, 1.10211, 0.999964, -0.00273904, 0.00374503, 1.11152, 1.00001, -0.00136739, 0.00187176, 1.12031, 0.999946, 3.93227e-5, -2.8919e-5, 1.12804, 0.995847, -1.3435e-6, 0.0671785, 1.9916e-5, 0.995464, -3.38387e-5, 0.0671527, 0.000501622, 0.99547, -0.000135355, 0.0671531, 0.00200649, 0.995471, -0.00030455, 0.0671532, 0.00451461, 0.99547, -0.000541423, 0.0671531, 0.008026, 0.995471, -0.00084598, 0.0671531, 0.0125407, 0.99547, -0.00121823, 0.0671531, 0.0180589, 0.99547, -0.00165817, 0.0671531, 0.0245806, 0.995463, -0.00216583, 0.0671526, 0.0321062, 0.995468, -0.00274127, 0.0671527, 0.0406366, 0.995474, -0.00338447, 0.0671534, 0.0501717, 0.995473, -0.00409554, 0.0671533, 0.0607131, 0.995478, -0.00487451, 0.0671531, 0.0722618, 0.995476, -0.00572148, 0.0671532, 0.0848191, 0.995477, -0.00663658, 0.0671539, 0.0983882, 0.995498, -0.00761986, 0.0671541, 0.112972, 0.995509, -0.00867094, 0.0671542, 0.128568, 0.995509, -0.00978951, 0.0671531, 0.145183, 0.995503, -0.0109725, 0.0671491, 0.162808, 0.995501, -0.012211, 0.0671465, 0.181441, 0.99553, -0.0134565, 0.0671371, 0.201015, 0.99555, -0.014391, 0.0670831, 0.221206, 0.99558, -0.014351, 0.0668883, 0.240813, 0.995577, -0.0173997, 0.0671055, 0.261257, 0.995602, -0.0191111, 0.0671178, 0.284467, 0.995623, -0.0206705, 0.0670946, 0.308765, 0.995658, -0.022184, 0.0670472, 0.333905, 0.995705, -0.0234832, 0.0669417, 0.359677, 0.995719, -0.0241933, 0.0666714, 0.385554, 0.995786, -0.0243539, 0.066266, 0.410951, 0.995887, -0.0271866, 0.0664367, 0.437163, 0.995944, -0.0296012, 0.0664931, 0.464842, 0.996004, -0.0301045, 0.0660105, 0.49332, 0.996128, -0.0298311, 0.0652694, 0.521131, 0.996253, -0.0316426, 0.0650739, 0.549167, 0.996244, -0.0339043, 0.0649433, 0.57737, 0.996309, -0.033329, 0.0638926, 0.606073, 0.996417, -0.0338935, 0.0630849, 0.634527, 0.996372, -0.0353104, 0.0625083, 0.66256, 0.996542, -0.0348942, 0.0611986, 0.690516, 0.996568, -0.0351614, 0.060069, 0.718317, 0.996711, -0.0354317, 0.0588522, 0.74528, 0.996671, -0.0349513, 0.0571902, 0.772061, 0.996865, -0.0345622, 0.0555321, 0.798089, 0.996802, -0.0342566, 0.0537816, 0.823178, 0.996992, -0.0330862, 0.0516095, 0.847949, 0.996944, -0.0324666, 0.0495537, 0.871431, 0.997146, -0.0309544, 0.0470302, 0.894357, 0.997189, -0.0299372, 0.0446043, 0.916142, 0.997471, -0.0281389, 0.0418812, 0.937193, 0.997515, -0.0268702, 0.0391823, 0.957, 0.997812, -0.0247166, 0.0361338, 0.975936, 0.998027, -0.0233525, 0.0333945, 0.99391, 0.998233, -0.0209839, 0.0301917, 1.01075, 0.998481, -0.0194309, 0.027271, 1.02669, 0.998859, -0.0169728, 0.0240162, 1.04173, 0.99894, -0.0152322, 0.0210517, 1.05551, 0.999132, -0.0127497, 0.0178632, 1.06856, 0.999369, -0.0108282, 0.014787, 1.08054, 0.999549, -0.00845886, 0.0116185, 1.09185, 0.999805, -0.0063937, 0.00867209, 1.10207, 0.99985, -0.00414582, 0.00566823, 1.1117, 0.999912, -0.00207443, 0.00277562, 1.12022, 1.00001, 8.70226e-5, -5.3766e-5, 1.12832, 0.991943, -1.78672e-6, 0.0893382, 1.98384e-5, 0.991952, -4.50183e-5, 0.089339, 0.000499849, 0.991956, -0.000180074, 0.0893394, 0.0019994, 0.991955, -0.000405167, 0.0893393, 0.00449867, 0.991953, -0.000720298, 0.0893391, 0.00799764, 0.991955, -0.00112548, 0.0893393, 0.0124964, 0.991957, -0.0016207, 0.0893395, 0.0179951, 0.991958, -0.00220601, 0.0893396, 0.0244939, 0.991947, -0.00288137, 0.0893385, 0.0319929, 0.991962, -0.00364693, 0.0893399, 0.0404933, 0.991965, -0.00450264, 0.0893399, 0.049995, 0.99198, -0.00544862, 0.0893411, 0.0604995, 0.99197, -0.00648491, 0.0893397, 0.0720074, 0.991976, -0.00761164, 0.089341, 0.0845207, 0.99198, -0.00882891, 0.0893405, 0.0980413, 0.991982, -0.0101367, 0.0893396, 0.112571, 0.992008, -0.011535, 0.0893415, 0.128115, 0.992026, -0.0130228, 0.0893414, 0.144672, 0.992064, -0.0145966, 0.0893418, 0.162241, 0.992041, -0.0162421, 0.0893359, 0.180801, 0.992086, -0.0178888, 0.0893214, 0.200302, 0.992157, -0.0190368, 0.0892401, 0.220332, 0.992181, -0.0195584, 0.0890525, 0.240144, 0.992175, -0.0227257, 0.0892153, 0.260728, 0.99221, -0.0254195, 0.089304, 0.283473, 0.99222, -0.0274883, 0.0892703, 0.307673, 0.992317, -0.0294905, 0.0892027, 0.332729, 0.992374, -0.0311861, 0.0890577, 0.358387, 0.992505, -0.0320656, 0.0886994, 0.384102, 0.992568, -0.0329715, 0.0883198, 0.409767, 0.992675, -0.036006, 0.0883602, 0.436145, 0.992746, -0.0392897, 0.0884591, 0.463217, 0.992873, -0.0399337, 0.0878287, 0.491557, 0.992934, -0.040231, 0.0870108, 0.519516, 0.993091, -0.0422013, 0.0865857, 0.547741, 0.993259, -0.0443503, 0.0861937, 0.575792, 0.993455, -0.0446368, 0.0851187, 0.604233, 0.993497, -0.0454299, 0.0840576, 0.632925, 0.993694, -0.0463296, 0.0829671, 0.660985, 0.993718, -0.0470619, 0.0817185, 0.688714, 0.993973, -0.0468838, 0.0800294, 0.716743, 0.994207, -0.046705, 0.0781286, 0.74377, 0.994168, -0.0469698, 0.0763337, 0.77042, 0.9945, -0.0456816, 0.0738184, 0.796659, 0.994356, -0.0455518, 0.0715545, 0.821868, 0.994747, -0.0439488, 0.0686085, 0.846572, 0.994937, -0.0430056, 0.065869, 0.870435, 0.995142, -0.0413414, 0.0626446, 0.893272, 0.995451, -0.0396521, 0.05929, 0.915376, 0.995445, -0.0378453, 0.0558503, 0.936196, 0.995967, -0.0355219, 0.0520949, 0.956376, 0.996094, -0.0335146, 0.048377, 0.975327, 0.996622, -0.030682, 0.0442575, 0.993471, 0.996938, -0.0285504, 0.0404693, 1.01052, 0.997383, -0.0253399, 0.0360903, 1.02637, 0.997714, -0.0231651, 0.0322176, 1.04139, 0.998249, -0.0198138, 0.0278433, 1.05542, 0.998596, -0.0174337, 0.0238759, 1.06846, 0.998946, -0.0141349, 0.0195944, 1.08056, 0.99928, -0.0115603, 0.0156279, 1.09181, 0.999507, -0.00839065, 0.0114607, 1.10213, 0.999697, -0.005666, 0.00763325, 1.11169, 0.999869, -0.00269902, 0.00364946, 1.12042, 1.00001, 6.23836e-5, -3.19288e-5, 1.12832, 0.987221, -2.22675e-6, 0.111332, 1.97456e-5, 0.98739, -5.61116e-5, 0.111351, 0.000497563, 0.987448, -0.000224453, 0.111357, 0.00199031, 0.987441, -0.000505019, 0.111357, 0.0044782, 0.987442, -0.000897816, 0.111357, 0.00796129, 0.987442, -0.00140284, 0.111357, 0.0124396, 0.987444, -0.00202012, 0.111357, 0.0179132, 0.987442, -0.00274964, 0.111357, 0.0243824, 0.987446, -0.00359147, 0.111357, 0.0318474, 0.987435, -0.00454562, 0.111356, 0.0403086, 0.987461, -0.00561225, 0.111358, 0.0497678, 0.987458, -0.00679125, 0.111358, 0.0602239, 0.987443, -0.0080828, 0.111356, 0.0716792, 0.987476, -0.0094872, 0.111358, 0.0841364, 0.98749, -0.0110044, 0.111361, 0.097597, 0.987508, -0.0126344, 0.111362, 0.112062, 0.987494, -0.0143767, 0.111357, 0.127533, 0.987526, -0.0162307, 0.111359, 0.144015, 0.987558, -0.0181912, 0.111361, 0.161502, 0.987602, -0.0202393, 0.111355, 0.179979, 0.987692, -0.022273, 0.111346, 0.199386, 0.987702, -0.0235306, 0.111215, 0.219183, 0.987789, -0.0247628, 0.111061, 0.239202, 0.987776, -0.0280668, 0.111171, 0.259957, 0.987856, -0.0316751, 0.111327, 0.282198, 0.987912, -0.0342468, 0.111282, 0.306294, 0.988, -0.0367205, 0.111198, 0.331219, 0.988055, -0.0387766, 0.110994, 0.356708, 0.988241, -0.0397722, 0.110547, 0.382234, 0.988399, -0.0416076, 0.110198, 0.408227, 0.988539, -0.0448192, 0.110137, 0.434662, 0.988661, -0.0483793, 0.110143, 0.461442, 0.988967, -0.0495895, 0.109453, 0.489318, 0.989073, -0.0506797, 0.108628, 0.517516, 0.989274, -0.0526953, 0.108003, 0.545844, 0.989528, -0.054578, 0.107255, 0.573823, 0.989709, -0.0561503, 0.106294, 0.601944, 0.989991, -0.056866, 0.104896, 0.630855, 0.990392, -0.0572914, 0.103336, 0.658925, 0.990374, -0.0586224, 0.10189, 0.686661, 0.990747, -0.0584764, 0.099783, 0.714548, 0.991041, -0.0582662, 0.0974309, 0.74186, 0.991236, -0.0584118, 0.0951678, 0.768422, 0.991585, -0.0573055, 0.0921581, 0.794817, 0.991984, -0.0564241, 0.0891167, 0.820336, 0.9921, -0.0553608, 0.085805, 0.84493, 0.992749, -0.0533816, 0.0820354, 0.868961, 0.99288, -0.0518661, 0.0782181, 0.891931, 0.993511, -0.0492492, 0.0738935, 0.914186, 0.993617, -0.0471956, 0.0696402, 0.93532, 0.99411, -0.044216, 0.0649659, 0.95543, 0.994595, -0.0416654, 0.0603177, 0.974685, 0.994976, -0.0384314, 0.0553493, 0.992807, 0.995579, -0.0353491, 0.0503942, 1.00996, 0.996069, -0.0319787, 0.0452123, 1.02606, 0.996718, -0.028472, 0.0400112, 1.04114, 0.997173, -0.0250789, 0.0349456, 1.05517, 0.997818, -0.0213326, 0.029653, 1.0683, 0.998318, -0.0178509, 0.024549, 1.0805, 0.998853, -0.0141118, 0.0194197, 1.09177, 0.999218, -0.0105914, 0.0143869, 1.1022, 0.999594, -0.00693474, 0.00943517, 1.11175, 0.99975, -0.00340478, 0.00464051, 1.12056, 1.00001, 0.000109172, -0.000112821, 1.12853, 0.983383, -2.66524e-6, 0.133358, 1.96534e-5, 0.981942, -6.71009e-5, 0.133162, 0.000494804, 0.981946, -0.000268405, 0.133163, 0.00197923, 0.981944, -0.000603912, 0.133163, 0.00445326, 0.981941, -0.00107362, 0.133162, 0.00791693, 0.981946, -0.00167755, 0.133163, 0.0123703, 0.981944, -0.00241569, 0.133162, 0.0178135, 0.981945, -0.00328807, 0.133163, 0.0242466, 0.981945, -0.00429472, 0.133162, 0.03167, 0.981955, -0.00543573, 0.133164, 0.0400846, 0.981951, -0.00671105, 0.133163, 0.0494901, 0.981968, -0.00812092, 0.133165, 0.0598886, 0.981979, -0.00966541, 0.133166, 0.0712811, 0.981996, -0.0113446, 0.133168, 0.083669, 0.982014, -0.0131585, 0.133169, 0.0970533, 0.982011, -0.0151073, 0.133167, 0.111438, 0.982062, -0.0171906, 0.133172, 0.126826, 0.9821, -0.0194067, 0.133175, 0.143215, 0.982149, -0.0217502, 0.133176, 0.160609, 0.982163, -0.0241945, 0.133173, 0.178981, 0.982247, -0.0265907, 0.133148, 0.198249, 0.982291, -0.027916, 0.132974, 0.217795, 0.982396, -0.0299663, 0.132868, 0.238042, 0.982456, -0.0334544, 0.132934, 0.258901, 0.982499, -0.0378636, 0.133137, 0.280639, 0.982617, -0.0409274, 0.133085, 0.304604, 0.98274, -0.0438523, 0.132985, 0.329376, 0.982944, -0.0462288, 0.132728, 0.354697, 0.98308, -0.0475995, 0.132228, 0.380102, 0.983391, -0.0501901, 0.131924, 0.406256, 0.983514, -0.0535899, 0.131737, 0.432735, 0.98373, -0.0571858, 0.131567, 0.459359, 0.984056, -0.0592353, 0.130932, 0.486637, 0.984234, -0.0610488, 0.130092, 0.51509, 0.984748, -0.0630758, 0.12923, 0.543461, 0.985073, -0.0647398, 0.128174, 0.571376, 0.985195, -0.0671941, 0.127133, 0.599414, 0.985734, -0.0681345, 0.125576, 0.628134, 0.986241, -0.0686089, 0.123639, 0.656399, 0.986356, -0.0698511, 0.121834, 0.684258, 0.986894, -0.0700931, 0.119454, 0.711818, 0.987382, -0.0698321, 0.116718, 0.739511, 0.988109, -0.0693975, 0.113699, 0.766267, 0.988363, -0.0689584, 0.110454, 0.792456, 0.989112, -0.0672353, 0.106602, 0.81813, 0.989241, -0.0662034, 0.10267, 0.842889, 0.990333, -0.0638938, 0.0981381, 0.867204, 0.990591, -0.0618534, 0.0935388, 0.89038, 0.991106, -0.0593117, 0.088553, 0.912576, 0.991919, -0.0562676, 0.0832187, 0.934118, 0.992111, -0.0534085, 0.0778302, 0.954254, 0.992997, -0.0495459, 0.0720453, 0.973722, 0.993317, -0.0463707, 0.0663458, 0.991949, 0.994133, -0.0421245, 0.0601883, 1.00936, 0.994705, -0.0384977, 0.0542501, 1.02559, 0.995495, -0.0340956, 0.0479862, 1.04083, 0.996206, -0.030105, 0.041887, 1.05497, 0.996971, -0.0256095, 0.0355355, 1.06824, 0.997796, -0.0213932, 0.0293655, 1.08056, 0.998272, -0.0169612, 0.0232926, 1.09182, 0.998857, -0.0126756, 0.0172786, 1.10219, 0.99939, -0.00832486, 0.0113156, 1.11192, 0.999752, -0.00410826, 0.00557892, 1.12075, 1, 0.000150957, -0.000119101, 1.12885, 0.975169, -3.09397e-6, 0.154669, 1.95073e-5, 0.975439, -7.79608e-5, 0.154712, 0.000491534, 0.975464, -0.000311847, 0.154716, 0.00196617, 0.975464, -0.000701656, 0.154716, 0.00442387, 0.975462, -0.0012474, 0.154715, 0.0078647, 0.975461, -0.00194906, 0.154715, 0.0122886, 0.975464, -0.00280667, 0.154715, 0.0176959, 0.975468, -0.00382025, 0.154716, 0.0240867, 0.975471, -0.00498985, 0.154716, 0.0314612, 0.975472, -0.00631541, 0.154717, 0.0398199, 0.975486, -0.00779719, 0.154718, 0.0491639, 0.975489, -0.00943505, 0.154718, 0.0594932, 0.975509, -0.0112295, 0.154721, 0.0708113, 0.97554, -0.0131802, 0.154724, 0.0831176, 0.975557, -0.0152876, 0.154726, 0.096415, 0.975585, -0.0175512, 0.154728, 0.110705, 0.975605, -0.0199713, 0.154729, 0.125992, 0.975645, -0.0225447, 0.154729, 0.142272, 0.975711, -0.0252649, 0.154735, 0.159549, 0.975788, -0.0280986, 0.154736, 0.177805, 0.975872, -0.0308232, 0.154704, 0.196911, 0.975968, -0.0324841, 0.154525, 0.216324, 0.976063, -0.0351281, 0.154432, 0.236628, 0.976157, -0.0388618, 0.15446, 0.257539, 0.976204, -0.0437704, 0.154665, 0.278975, 0.976358, -0.047514, 0.154652, 0.302606, 0.976571, -0.0508638, 0.154535, 0.327204, 0.976725, -0.0534995, 0.154221, 0.352276, 0.977013, -0.0555547, 0.153737, 0.377696, 0.977294, -0.0586728, 0.153403, 0.403855, 0.977602, -0.0622715, 0.15312, 0.430333, 0.977932, -0.0658166, 0.152755, 0.456855, 0.978241, -0.0689877, 0.152233, 0.483668, 0.978602, -0.0712805, 0.15132, 0.512097, 0.979234, -0.0732775, 0.150235, 0.540455, 0.97977, -0.075163, 0.148978, 0.568486, 0.979995, -0.0778026, 0.147755, 0.596524, 0.98078, -0.0791854, 0.146019, 0.624825, 0.981628, -0.0799666, 0.143906, 0.653403, 0.982067, -0.0808532, 0.141561, 0.681445, 0.98271, -0.0816024, 0.139025, 0.708918, 0.983734, -0.0812511, 0.135764, 0.736594, 0.98431, -0.0806201, 0.132152, 0.763576, 0.985071, -0.0801605, 0.12846, 0.789797, 0.98618, -0.0784208, 0.124084, 0.815804, 0.986886, -0.0766643, 0.1193, 0.840869, 0.987485, -0.0747744, 0.114236, 0.864952, 0.988431, -0.0716701, 0.108654, 0.888431, 0.988886, -0.0691609, 0.102994, 0.910963, 0.990024, -0.0654048, 0.0967278, 0.932629, 0.990401, -0.0619765, 0.090384, 0.95313, 0.991093, -0.0579296, 0.0837885, 0.972587, 0.992018, -0.0536576, 0.0770171, 0.991184, 0.992536, -0.0493719, 0.0701486, 1.00863, 0.993421, -0.0444813, 0.062953, 1.02494, 0.993928, -0.040008, 0.0560455, 1.04017, 0.994994, -0.0347982, 0.04856, 1.05463, 0.995866, -0.0301017, 0.0416152, 1.06807, 0.996916, -0.0248225, 0.0342597, 1.08039, 0.997766, -0.0199229, 0.0271668, 1.09177, 0.998479, -0.0147422, 0.0201387, 1.10235, 0.99921, -0.00980173, 0.0131944, 1.11206, 0.999652, -0.0047426, 0.00640712, 1.12104, 0.999998, 8.91673e-5, -0.00010379, 1.12906, 0.967868, -3.51885e-6, 0.175947, 1.93569e-5, 0.968001, -8.86733e-5, 0.175972, 0.000487782, 0.96801, -0.000354697, 0.175973, 0.00195115, 0.968012, -0.000798063, 0.175974, 0.00439006, 0.968011, -0.00141879, 0.175973, 0.00780461, 0.968011, -0.00221686, 0.175973, 0.0121948, 0.968016, -0.00319231, 0.175974, 0.0175607, 0.968019, -0.00434515, 0.175974, 0.0239027, 0.968018, -0.00567538, 0.175974, 0.0312208, 0.968033, -0.00718308, 0.175977, 0.0395158, 0.968049, -0.00886836, 0.175979, 0.0487885, 0.968047, -0.0107312, 0.175978, 0.0590394, 0.968072, -0.0127719, 0.175981, 0.0702705, 0.968108, -0.0149905, 0.175986, 0.0824836, 0.968112, -0.0173866, 0.175985, 0.0956783, 0.968173, -0.0199611, 0.175993, 0.109862, 0.96827, -0.0227128, 0.176008, 0.125033, 0.968292, -0.025639, 0.17601, 0.141193, 0.968339, -0.0287299, 0.176007, 0.158336, 0.968389, -0.0319399, 0.176001, 0.176441, 0.968501, -0.034941, 0.175962, 0.195359, 0.968646, -0.0370812, 0.175793, 0.214686, 0.968789, -0.0402329, 0.175708, 0.234973, 0.96886, -0.0442601, 0.1757, 0.255871, 0.969013, -0.049398, 0.175876, 0.277238, 0.969242, -0.0539932, 0.17594, 0.300326, 0.969419, -0.0577299, 0.175781, 0.324702, 0.969763, -0.0605643, 0.175432, 0.349527, 0.970093, -0.0634488, 0.174992, 0.374976, 0.970361, -0.0670589, 0.174611, 0.401097, 0.970825, -0.0708246, 0.174226, 0.427496, 0.971214, -0.0742871, 0.173684, 0.453858, 0.971622, -0.0782608, 0.173186, 0.480637, 0.972175, -0.0813151, 0.172288, 0.508655, 0.972944, -0.0832678, 0.170979, 0.536973, 0.973595, -0.0855964, 0.169573, 0.565138, 0.974345, -0.0882163, 0.168152, 0.593222, 0.975233, -0.0901671, 0.166314, 0.621201, 0.976239, -0.0912111, 0.163931, 0.649919, 0.977289, -0.0916959, 0.161106, 0.678011, 0.978076, -0.0927061, 0.158272, 0.705717, 0.979533, -0.0925562, 0.15475, 0.733228, 0.980335, -0.0918159, 0.150638, 0.760454, 0.981808, -0.0908508, 0.146201, 0.786918, 0.983061, -0.0896172, 0.141386, 0.812953, 0.984148, -0.0871588, 0.135837, 0.838281, 0.985047, -0.0850624, 0.130135, 0.862594, 0.986219, -0.0818541, 0.123882, 0.88633, 0.987043, -0.0784523, 0.117126, 0.908952, 0.988107, -0.0749601, 0.110341, 0.930744, 0.988955, -0.0703548, 0.102885, 0.951728, 0.989426, -0.0662798, 0.0954167, 0.971166, 0.990421, -0.0610834, 0.0876331, 0.989984, 0.991032, -0.0562936, 0.0797785, 1.00765, 0.992041, -0.0508154, 0.0718166, 1.02434, 0.992794, -0.0454045, 0.0637125, 1.03976, 0.993691, -0.0398194, 0.0555338, 1.05418, 0.994778, -0.0341482, 0.0473388, 1.06772, 0.995915, -0.028428, 0.0391016, 1.08028, 0.997109, -0.022642, 0.0309953, 1.09185, 0.998095, -0.0168738, 0.0230288, 1.10247, 0.998985, -0.0111274, 0.0150722, 1.11229, 0.999581, -0.00543881, 0.00740605, 1.12131, 1.00003, 0.000162239, -0.000105549, 1.12946, 0.959505, -3.93734e-6, 0.196876, 1.91893e-5, 0.959599, -9.92157e-5, 0.196895, 0.000483544, 0.959641, -0.000396868, 0.196903, 0.0019342, 0.959599, -0.000892948, 0.196895, 0.00435193, 0.959603, -0.00158747, 0.196896, 0.0077368, 0.959604, -0.00248042, 0.196896, 0.0120888, 0.959605, -0.00357184, 0.196896, 0.0174082, 0.959605, -0.00486169, 0.196896, 0.0236949, 0.959613, -0.00635008, 0.196897, 0.0309497, 0.959619, -0.00803696, 0.196898, 0.0391725, 0.959636, -0.00992255, 0.196901, 0.0483649, 0.959634, -0.0120067, 0.1969, 0.0585266, 0.959675, -0.0142898, 0.196906, 0.0696609, 0.959712, -0.0167717, 0.196911, 0.0817678, 0.959752, -0.0194524, 0.196918, 0.0948494, 0.959807, -0.0223321, 0.196925, 0.10891, 0.959828, -0.0254091, 0.196924, 0.123947, 0.959906, -0.0286815, 0.196934, 0.139968, 0.960005, -0.0321371, 0.196944, 0.156968, 0.960071, -0.0357114, 0.196936, 0.17491, 0.960237, -0.0389064, 0.196882, 0.193597, 0.960367, -0.041623, 0.196731, 0.21285, 0.960562, -0.0452655, 0.196654, 0.233075, 0.960735, -0.0496207, 0.196643, 0.253941, 0.960913, -0.0549379, 0.196774, 0.275278, 0.961121, -0.0603414, 0.196893, 0.297733, 0.96139, -0.0644244, 0.196717, 0.321877, 0.961818, -0.067556, 0.196314, 0.346476, 0.962175, -0.0712709, 0.195917, 0.371907, 0.96255, -0.0752848, 0.1955, 0.397916, 0.963164, -0.0792073, 0.195026, 0.424229, 0.963782, -0.0828225, 0.194424, 0.450637, 0.964306, -0.0873119, 0.193831, 0.477288, 0.964923, -0.0911051, 0.192973, 0.504716, 0.966048, -0.093251, 0.19151, 0.533053, 0.967024, -0.0958983, 0.190013, 0.561366, 0.968038, -0.09835, 0.188253, 0.589464, 0.969152, -0.100754, 0.186257, 0.617433, 0.970557, -0.102239, 0.183775, 0.645801, 0.972104, -0.102767, 0.180645, 0.674278, 0.973203, -0.103492, 0.177242, 0.702004, 0.975123, -0.103793, 0.17345, 0.729529, 0.97641, -0.102839, 0.168886, 0.756712, 0.978313, -0.101687, 0.163892, 0.783801, 0.980036, -0.100314, 0.158439, 0.809671, 0.981339, -0.097836, 0.152211, 0.835402, 0.982794, -0.0950006, 0.145679, 0.860081, 0.984123, -0.0920994, 0.138949, 0.883757, 0.984918, -0.0878641, 0.131283, 0.90685, 0.985999, -0.083939, 0.123464, 0.928786, 0.987151, -0.0791234, 0.115324, 0.94983, 0.987827, -0.0739332, 0.106854, 0.96962, 0.988806, -0.0688088, 0.0982691, 0.98861, 0.989588, -0.0628962, 0.0893456, 1.00667, 0.990438, -0.0573146, 0.0805392, 1.02344, 0.991506, -0.0509433, 0.0713725, 1.03933, 0.992492, -0.0448724, 0.0623732, 1.05378, 0.993663, -0.0383497, 0.0530838, 1.06747, 0.994956, -0.0319593, 0.0439512, 1.08007, 0.99634, -0.025401, 0.0347803, 1.09182, 0.99761, -0.0189687, 0.0257954, 1.1025, 0.99863, -0.0124441, 0.0169893, 1.11247, 0.99947, -0.00614003, 0.00829498, 1.12151, 1.00008, 0.000216624, -0.000146107, 1.12993, 0.950129, -4.34955e-6, 0.217413, 1.90081e-5, 0.950264, -0.00010957, 0.217444, 0.00047884, 0.9503, -0.000438299, 0.217451, 0.00191543, 0.950246, -0.000986124, 0.21744, 0.00430951, 0.950246, -0.00175311, 0.21744, 0.00766137, 0.950245, -0.00273923, 0.21744, 0.011971, 0.950253, -0.00394453, 0.217441, 0.0172385, 0.950258, -0.00536897, 0.217442, 0.0234641, 0.950267, -0.00701262, 0.217444, 0.030648, 0.950277, -0.00887551, 0.217446, 0.038791, 0.950284, -0.0109576, 0.217446, 0.0478931, 0.950312, -0.0132591, 0.217451, 0.0579568, 0.950334, -0.01578, 0.217454, 0.0689821, 0.950378, -0.0185204, 0.217462, 0.0809714, 0.950417, -0.0214803, 0.217467, 0.0939265, 0.950488, -0.0246594, 0.217479, 0.10785, 0.950534, -0.0280565, 0.217483, 0.122743, 0.950633, -0.0316685, 0.217498, 0.138611, 0.950698, -0.0354787, 0.217499, 0.155442, 0.950844, -0.0394003, 0.217507, 0.173208, 0.950999, -0.0426812, 0.217419, 0.191605, 0.951221, -0.0461302, 0.217317, 0.21084, 0.951412, -0.0502131, 0.217238, 0.230945, 0.951623, -0.0549183, 0.21722, 0.251745, 0.951867, -0.0604493, 0.217306, 0.273001, 0.952069, -0.0665189, 0.217466, 0.294874, 0.952459, -0.0709179, 0.217266, 0.318732, 0.952996, -0.0746112, 0.216891, 0.34318, 0.953425, -0.0789252, 0.216503, 0.36849, 0.953885, -0.0833293, 0.216042, 0.394373, 0.954617, -0.087371, 0.215469, 0.420505, 0.955429, -0.0914054, 0.214802, 0.446907, 0.956068, -0.0961671, 0.214146, 0.473522, 0.957094, -0.10048, 0.213286, 0.50052, 0.958372, -0.103248, 0.211796, 0.528715, 0.959654, -0.106033, 0.21016, 0.557065, 0.961305, -0.108384, 0.208149, 0.585286, 0.962785, -0.111122, 0.206024, 0.613334, 0.964848, -0.112981, 0.203442, 0.641334, 0.966498, -0.113717, 0.19996, 0.669955, 0.968678, -0.114121, 0.196105, 0.698094, 0.970489, -0.114524, 0.191906, 0.725643, 0.972903, -0.113792, 0.186963, 0.752856, 0.974701, -0.112406, 0.181343, 0.780013, 0.976718, -0.110685, 0.175185, 0.806268, 0.978905, -0.108468, 0.168535, 0.832073, 0.980267, -0.105061, 0.161106, 0.857149, 0.981967, -0.101675, 0.153387, 0.881145, 0.983063, -0.0974492, 0.145199, 0.904255, 0.984432, -0.0925815, 0.136527, 0.926686, 0.985734, -0.0877983, 0.127584, 0.947901, 0.986228, -0.081884, 0.118125, 0.968111, 0.98719, -0.0761208, 0.108594, 0.98719, 0.988228, -0.0698196, 0.0989996, 1.00559, 0.989046, -0.0632739, 0.0890074, 1.02246, 0.990242, -0.056522, 0.0790832, 1.03841, 0.991252, -0.0495272, 0.0689182, 1.05347, 0.992542, -0.0425373, 0.0588592, 1.06724, 0.994096, -0.0353198, 0.0486833, 1.08009, 0.995593, -0.028235, 0.0385977, 1.09177, 0.99711, -0.0209511, 0.0286457, 1.10274, 0.998263, -0.0139289, 0.0188497, 1.11262, 0.999254, -0.0067359, 0.009208, 1.12191, 0.999967, 0.000141846, -6.57764e-5, 1.13024, 0.935608, -4.74692e-6, 0.236466, 1.87817e-5, 0.93996, -0.00011971, 0.237568, 0.000473646, 0.939959, -0.000478845, 0.237567, 0.0018946, 0.939954, -0.0010774, 0.237566, 0.00426284, 0.939956, -0.00191538, 0.237566, 0.00757842, 0.939954, -0.00299277, 0.237566, 0.0118413, 0.93996, -0.00430961, 0.237567, 0.0170518, 0.939969, -0.00586589, 0.237569, 0.02321, 0.939982, -0.00766166, 0.237572, 0.0303164, 0.939987, -0.00969686, 0.237572, 0.0383711, 0.939997, -0.0119715, 0.237574, 0.0473751, 0.940031, -0.0144858, 0.237581, 0.0573298, 0.940073, -0.0172399, 0.237589, 0.0682366, 0.94012, -0.0202335, 0.237598, 0.080097, 0.940162, -0.0234663, 0.237604, 0.0929116, 0.940237, -0.0269387, 0.237615, 0.106686, 0.940328, -0.0306489, 0.237632, 0.121421, 0.940419, -0.0345917, 0.237645, 0.137115, 0.940522, -0.0387481, 0.237654, 0.153766, 0.940702, -0.0429906, 0.237661, 0.17133, 0.940871, -0.0465089, 0.237561, 0.189502, 0.941103, -0.050531, 0.23748, 0.208616, 0.941369, -0.0550657, 0.237423, 0.228595, 0.941641, -0.0601337, 0.237399, 0.249287, 0.941903, -0.0658804, 0.237443, 0.270467, 0.942224, -0.0722674, 0.237597, 0.292024, 0.942633, -0.0771788, 0.237419, 0.315272, 0.943172, -0.0815623, 0.237068, 0.339579, 0.943691, -0.0863973, 0.236682, 0.364717, 0.944382, -0.0911536, 0.236213, 0.390435, 0.945392, -0.0952967, 0.235562, 0.416425, 0.946185, -0.0998948, 0.234832, 0.442772, 0.947212, -0.104796, 0.234114, 0.469347, 0.948778, -0.10928, 0.233222, 0.496162, 0.950149, -0.113081, 0.231845, 0.523978, 0.951989, -0.115893, 0.230005, 0.552295, 0.953921, -0.11846, 0.227862, 0.580569, 0.955624, -0.12115, 0.225439, 0.608698, 0.958234, -0.123373, 0.222635, 0.636696, 0.960593, -0.124519, 0.219093, 0.665208, 0.963201, -0.124736, 0.214749, 0.693557, 0.965642, -0.125012, 0.210059, 0.721334, 0.968765, -0.124661, 0.204935, 0.748613, 0.971753, -0.122996, 0.198661, 0.776224, 0.973751, -0.120998, 0.191823, 0.802461, 0.976709, -0.118583, 0.184359, 0.828399, 0.977956, -0.115102, 0.176437, 0.853693, 0.979672, -0.111077, 0.167681, 0.877962, 0.981816, -0.10688, 0.158872, 0.901564, 0.98238, -0.101469, 0.149398, 0.924057, 0.983964, -0.0960013, 0.139436, 0.945751, 0.984933, -0.0899626, 0.12943, 0.966272, 0.985694, -0.0832973, 0.11894, 0.985741, 0.986822, -0.0767082, 0.108349, 1.00407, 0.987725, -0.0693614, 0.0976026, 1.02154, 0.98877, -0.06211, 0.086652, 1.03757, 0.990129, -0.0544143, 0.0756182, 1.05296, 0.991337, -0.046744, 0.0645753, 1.06683, 0.992978, -0.0387931, 0.0534683, 1.0798, 0.994676, -0.030973, 0.0424137, 1.09181, 0.99645, -0.0230311, 0.0314035, 1.10286, 0.997967, -0.0152065, 0.0206869, 1.11291, 0.99922, -0.00744837, 0.010155, 1.12237, 1.00002, 0.000240209, -7.52767e-5, 1.13089, 0.922948, -5.15351e-6, 0.255626, 1.86069e-5, 0.928785, -0.000129623, 0.257244, 0.000468009, 0.928761, -0.00051849, 0.257237, 0.00187202, 0.928751, -0.0011666, 0.257235, 0.00421204, 0.928751, -0.00207395, 0.257234, 0.0074881, 0.928754, -0.00324055, 0.257235, 0.0117002, 0.92876, -0.00466639, 0.257236, 0.0168486, 0.928763, -0.00635149, 0.257237, 0.0229334, 0.928774, -0.00829584, 0.257239, 0.029955, 0.928791, -0.0104995, 0.257243, 0.0379139, 0.928804, -0.0129623, 0.257245, 0.0468108, 0.928847, -0.0156846, 0.257255, 0.0566473, 0.92889, -0.0186661, 0.257263, 0.0674246, 0.928924, -0.0219067, 0.257268, 0.0791433, 0.928989, -0.0254066, 0.257282, 0.0918076, 0.92909, -0.0291651, 0.257301, 0.105419, 0.92918, -0.0331801, 0.257316, 0.119978, 0.92929, -0.0374469, 0.257332, 0.135491, 0.929453, -0.041939, 0.257357, 0.151948, 0.929586, -0.0464612, 0.257347, 0.169275, 0.929858, -0.0503426, 0.257269, 0.187257, 0.930125, -0.0548409, 0.257199, 0.206204, 0.930403, -0.0598063, 0.257149, 0.22601, 0.930726, -0.0652437, 0.257122, 0.246561, 0.931098, -0.0712376, 0.257153, 0.267618, 0.931396, -0.0777506, 0.257237, 0.288993, 0.931947, -0.0832374, 0.257124, 0.311527, 0.932579, -0.0883955, 0.25683, 0.335697, 0.933194, -0.0937037, 0.256444, 0.360634, 0.934013, -0.0987292, 0.255939, 0.386126, 0.935307, -0.103215, 0.255282, 0.412018, 0.936374, -0.108234, 0.254538, 0.438292, 0.93776, -0.113234, 0.253728, 0.464805, 0.939599, -0.118013, 0.25275, 0.491464, 0.941036, -0.122661, 0.251404, 0.518751, 0.94337, -0.125477, 0.249435, 0.547133, 0.945318, -0.128374, 0.247113, 0.575456, 0.947995, -0.130996, 0.244441, 0.60372, 0.950818, -0.133438, 0.241352, 0.63174, 0.954378, -0.135004, 0.237849, 0.659971, 0.957151, -0.135313, 0.233188, 0.688478, 0.960743, -0.13521, 0.228001, 0.716767, 0.964352, -0.135007, 0.222249, 0.744349, 0.967273, -0.133523, 0.21542, 0.771786, 0.969767, -0.131155, 0.208039, 0.798639, 0.973195, -0.128492, 0.200076, 0.824774, 0.975557, -0.125094, 0.191451, 0.850222, 0.977692, -0.120578, 0.18184, 0.874761, 0.98026, -0.115882, 0.172102, 0.898497, 0.981394, -0.110372, 0.161859, 0.921636, 0.982386, -0.10415, 0.15108, 0.943467, 0.983783, -0.0978128, 0.140407, 0.964045, 0.98422, -0.0906171, 0.129058, 0.98398, 0.985447, -0.0832921, 0.117614, 1.00276, 0.986682, -0.0754412, 0.10585, 1.02047, 0.987326, -0.0673885, 0.0940943, 1.03678, 0.988707, -0.0592565, 0.0822093, 1.05218, 0.990185, -0.050717, 0.070192, 1.06652, 0.991866, -0.0423486, 0.0582081, 1.07965, 0.993897, -0.0336118, 0.0460985, 1.09188, 0.995841, -0.0252178, 0.0342737, 1.10307, 0.997605, -0.0164893, 0.0224829, 1.11324, 0.999037, -0.00817112, 0.0110647, 1.12262, 1.00003, 0.000291686, -0.000168673, 1.13139, 0.915304, -5.52675e-6, 0.275999, 1.83285e-5, 0.91668, -0.000139285, 0.276414, 0.000461914, 0.916664, -0.00055713, 0.276409, 0.00184763, 0.916653, -0.00125354, 0.276406, 0.00415715, 0.916651, -0.00222851, 0.276405, 0.00739053, 0.916655, -0.00348205, 0.276406, 0.0115478, 0.916653, -0.00501414, 0.276405, 0.0166291, 0.916667, -0.00682478, 0.276409, 0.0226346, 0.91668, -0.00891398, 0.276412, 0.0295648, 0.91669, -0.0112817, 0.276413, 0.0374199, 0.916727, -0.013928, 0.276422, 0.0462016, 0.916759, -0.0168528, 0.276429, 0.0559101, 0.916793, -0.0200558, 0.276436, 0.0665466, 0.916849, -0.0235373, 0.276448, 0.0781139, 0.916964, -0.0272973, 0.276474, 0.0906156, 0.917047, -0.0313344, 0.276491, 0.104051, 0.917152, -0.0356465, 0.276511, 0.118424, 0.917286, -0.0402271, 0.276533, 0.133736, 0.917469, -0.0450408, 0.276564, 0.149978, 0.917686, -0.0497872, 0.276563, 0.167057, 0.917953, -0.0540937, 0.276493, 0.184846, 0.918228, -0.0590709, 0.276437, 0.203614, 0.918572, -0.0644277, 0.276398, 0.223212, 0.918918, -0.0702326, 0.276362, 0.243584, 0.919356, -0.076484, 0.276383, 0.264465, 0.919842, -0.0830808, 0.276434, 0.285701, 0.920451, -0.0892972, 0.276407, 0.307559, 0.921113, -0.095016, 0.276128, 0.331501, 0.921881, -0.100771, 0.275754, 0.356207, 0.923027, -0.106029, 0.275254, 0.381477, 0.924364, -0.111029, 0.274595, 0.40722, 0.925818, -0.116345, 0.273841, 0.433385, 0.92746, -0.121424, 0.272913, 0.459848, 0.929167, -0.12657, 0.271837, 0.486493, 0.931426, -0.131581, 0.270575, 0.513432, 0.934001, -0.135038, 0.268512, 0.541502, 0.936296, -0.138039, 0.266135, 0.569658, 0.939985, -0.140687, 0.263271, 0.598375, 0.943516, -0.143247, 0.260058, 0.626563, 0.94782, -0.145135, 0.256138, 0.654711, 0.951023, -0.145733, 0.251154, 0.683285, 0.955338, -0.145554, 0.245562, 0.711831, 0.959629, -0.145008, 0.239265, 0.739573, 0.963123, -0.144003, 0.232064, 0.767027, 0.966742, -0.141289, 0.224036, 0.794359, 0.969991, -0.138247, 0.215305, 0.820361, 0.973403, -0.134786, 0.206051, 0.846548, 0.975317, -0.129966, 0.195914, 0.871541, 0.977647, -0.12471, 0.185184, 0.895313, 0.980137, -0.119086, 0.174161, 0.918398, 0.981031, -0.112297, 0.162792, 0.940679, 0.982037, -0.105372, 0.150952, 0.961991, 0.983164, -0.097821, 0.138921, 0.981913, 0.983757, -0.0897245, 0.126611, 1.00109, 0.985036, -0.0815974, 0.114228, 1.01902, 0.986289, -0.0727725, 0.101389, 1.03604, 0.987329, -0.0639323, 0.0886476, 1.05149, 0.989193, -0.0548109, 0.0756837, 1.06619, 0.990716, -0.045687, 0.0627581, 1.07948, 0.992769, -0.0364315, 0.0498337, 1.09172, 0.99524, -0.0271761, 0.0370305, 1.1033, 0.997154, -0.0179609, 0.0243959, 1.11353, 0.998845, -0.00878063, 0.0119567, 1.12319, 1.00002, 0.000259038, -0.000108146, 1.13177, 0.903945, -5.91681e-6, 0.295126, 1.81226e-5, 0.903668, -0.000148672, 0.295037, 0.000455367, 0.903677, -0.000594683, 0.29504, 0.00182145, 0.903673, -0.00133805, 0.295039, 0.00409831, 0.903666, -0.00237872, 0.295036, 0.00728584, 0.903668, -0.00371676, 0.295037, 0.0113842, 0.903679, -0.00535212, 0.29504, 0.0163936, 0.903684, -0.00728479, 0.295041, 0.0223141, 0.903698, -0.00951473, 0.295044, 0.0291462, 0.903718, -0.0120419, 0.295049, 0.0368904, 0.903754, -0.0148664, 0.295058, 0.0455477, 0.903801, -0.017988, 0.29507, 0.0551194, 0.903851, -0.0214064, 0.295082, 0.0656058, 0.903921, -0.0251219, 0.295097, 0.0770109, 0.904002, -0.0291337, 0.295116, 0.0893354, 0.904111, -0.033441, 0.29514, 0.102583, 0.904246, -0.0380415, 0.295169, 0.116755, 0.904408, -0.0429258, 0.295202, 0.131853, 0.904637, -0.0480468, 0.295245, 0.147869, 0.904821, -0.0529208, 0.295214, 0.164658, 0.905163, -0.0577748, 0.295185, 0.182274, 0.905469, -0.0631763, 0.295143, 0.200828, 0.905851, -0.068917, 0.295112, 0.2202, 0.906322, -0.0750861, 0.295104, 0.240372, 0.906761, -0.0815855, 0.295086, 0.261082, 0.90735, -0.0882138, 0.295095, 0.282123, 0.908087, -0.095082, 0.295139, 0.303563, 0.908826, -0.101488, 0.29492, 0.327028, 0.909832, -0.107577, 0.294577, 0.351464, 0.911393, -0.113033, 0.294115, 0.376497, 0.912804, -0.118629, 0.293446, 0.402115, 0.914081, -0.124232, 0.292581, 0.428111, 0.91637, -0.129399, 0.29166, 0.454442, 0.91814, -0.134892, 0.290422, 0.481024, 0.921179, -0.140069, 0.289194, 0.507924, 0.924544, -0.144431, 0.287421, 0.535557, 0.927995, -0.147498, 0.284867, 0.563984, 0.931556, -0.150197, 0.281722, 0.5923, 0.935777, -0.152711, 0.278207, 0.620832, 0.940869, -0.154836, 0.274148, 0.649069, 0.945994, -0.155912, 0.269057, 0.677746, 0.949634, -0.155641, 0.262799, 0.706293, 0.955032, -0.154809, 0.256097, 0.734278, 0.95917, -0.153678, 0.248618, 0.761751, 0.962931, -0.151253, 0.239794, 0.789032, 0.966045, -0.147625, 0.230281, 0.815422, 0.96971, -0.143964, 0.220382, 0.841787, 0.972747, -0.139464, 0.209846, 0.867446, 0.975545, -0.133459, 0.198189, 0.892004, 0.978381, -0.127424, 0.186362, 0.915458, 0.979935, -0.120506, 0.173964, 0.937948, 0.980948, -0.11282, 0.161429, 0.959732, 0.982234, -0.104941, 0.148557, 0.980118, 0.982767, -0.0962905, 0.135508, 0.999463, 0.983544, -0.0873625, 0.122338, 1.01756, 0.984965, -0.0783447, 0.108669, 1.03492, 0.986233, -0.0684798, 0.0949911, 1.05087, 0.987796, -0.0590867, 0.0811386, 1.0656, 0.989885, -0.0489145, 0.0673099, 1.0794, 0.991821, -0.0391, 0.0535665, 1.09174, 0.99448, -0.029087, 0.0397529, 1.10341, 0.996769, -0.019114, 0.0261463, 1.11383, 0.998641, -0.00947007, 0.0128731, 1.1237, 0.999978, 0.000446316, -0.000169093, 1.13253, 0.888362, -6.27064e-6, 0.312578, 1.78215e-5, 0.889988, -0.000157791, 0.313148, 0.000448451, 0.889825, -0.000631076, 0.313092, 0.00179356, 0.88984, -0.00141994, 0.313097, 0.00403554, 0.889828, -0.0025243, 0.313092, 0.00717429, 0.889831, -0.00394421, 0.313093, 0.0112099, 0.889831, -0.00567962, 0.313093, 0.0161425, 0.889844, -0.00773051, 0.313096, 0.0219724, 0.889858, -0.0100968, 0.3131, 0.0286999, 0.889882, -0.0127786, 0.313106, 0.0363256, 0.889918, -0.0157757, 0.313116, 0.0448509, 0.889967, -0.0190878, 0.313129, 0.0542758, 0.89003, -0.022715, 0.313145, 0.0646032, 0.890108, -0.0266566, 0.313165, 0.0758339, 0.890218, -0.0309131, 0.313193, 0.0879729, 0.890351, -0.0354819, 0.313226, 0.101019, 0.89051, -0.0403613, 0.313263, 0.114979, 0.890672, -0.0455385, 0.313294, 0.129848, 0.890882, -0.0509444, 0.313333, 0.145616, 0.891189, -0.0559657, 0.313324, 0.162122, 0.891457, -0.0613123, 0.313281, 0.179524, 0.891856, -0.0671488, 0.313281, 0.197855, 0.892312, -0.0732732, 0.313268, 0.216991, 0.892819, -0.0797865, 0.313263, 0.236924, 0.893369, -0.0865269, 0.313247, 0.257433, 0.894045, -0.0931592, 0.313205, 0.278215, 0.894884, -0.100532, 0.313276, 0.299467, 0.895832, -0.107716, 0.313205, 0.322276, 0.897043, -0.114099, 0.312873, 0.34642, 0.898515, -0.119941, 0.312331, 0.371187, 0.900191, -0.126044, 0.311731, 0.396656, 0.90188, -0.131808, 0.310859, 0.422488, 0.904359, -0.137289, 0.309857, 0.448744, 0.906923, -0.142991, 0.308714, 0.475239, 0.910634, -0.148253, 0.307465, 0.501983, 0.914502, -0.153332, 0.305774, 0.529254, 0.919046, -0.156646, 0.303156, 0.557709, 0.923194, -0.159612, 0.299928, 0.586267, 0.928858, -0.162027, 0.296245, 0.614925, 0.934464, -0.164203, 0.291832, 0.643187, 0.939824, -0.165602, 0.286565, 0.671601, 0.944582, -0.165383, 0.280073, 0.700213, 0.949257, -0.164439, 0.272891, 0.728432, 0.954389, -0.162953, 0.264771, 0.756082, 0.958595, -0.161007, 0.255927, 0.78369, 0.962138, -0.157243, 0.245769, 0.810769, 0.966979, -0.152872, 0.235127, 0.836999, 0.969566, -0.148209, 0.22347, 0.862684, 0.972372, -0.142211, 0.211147, 0.887847, 0.975916, -0.135458, 0.198606, 0.911843, 0.978026, -0.128398, 0.185498, 0.934795, 0.979686, -0.120313, 0.17171, 0.956787, 0.980748, -0.11166, 0.158159, 0.978046, 0.981622, -0.103035, 0.144399, 0.997693, 0.982356, -0.0930328, 0.13001, 1.01642, 0.983308, -0.0834627, 0.115778, 1.03366, 0.985037, -0.0732249, 0.101327, 1.05014, 0.986493, -0.0628145, 0.086554, 1.06507, 0.988484, -0.0526556, 0.0720413, 1.07907, 0.991051, -0.0415744, 0.0571151, 1.09189, 0.993523, -0.0314275, 0.0426643, 1.10369, 0.99628, -0.0203603, 0.0279325, 1.11423, 0.998344, -0.0102446, 0.0138182, 1.12421, 0.999997, 0.00042612, -0.000193628, 1.1333, 0.871555, -6.60007e-6, 0.329176, 1.74749e-5, 0.875255, -0.000166579, 0.330571, 0.000441051, 0.875644, -0.000666394, 0.330718, 0.00176441, 0.875159, -0.00149903, 0.330536, 0.00396899, 0.87516, -0.00266493, 0.330536, 0.007056, 0.875158, -0.00416393, 0.330535, 0.0110251, 0.87516, -0.00599598, 0.330535, 0.0158764, 0.875163, -0.00816108, 0.330536, 0.0216101, 0.875174, -0.0106591, 0.330538, 0.0282266, 0.875199, -0.0134899, 0.330545, 0.0357266, 0.875257, -0.0166538, 0.330563, 0.0441117, 0.875304, -0.0201501, 0.330575, 0.0533821, 0.875373, -0.0239785, 0.330595, 0.0635395, 0.875464, -0.0281389, 0.330619, 0.0745872, 0.875565, -0.0326301, 0.330645, 0.0865255, 0.875691, -0.0374516, 0.330676, 0.0993599, 0.875897, -0.0425993, 0.330733, 0.113093, 0.876091, -0.0480576, 0.330776, 0.127722, 0.876353, -0.0537216, 0.330826, 0.143227, 0.876649, -0.0589807, 0.330809, 0.159462, 0.877034, -0.0647865, 0.330819, 0.176642, 0.877443, -0.0709789, 0.330817, 0.194702, 0.877956, -0.0774782, 0.330832, 0.213577, 0.878499, -0.0843175, 0.330822, 0.233246, 0.879144, -0.0912714, 0.330804, 0.253512, 0.879982, -0.0980824, 0.330766, 0.274137, 0.88097, -0.105823, 0.330864, 0.295209, 0.882051, -0.113671, 0.330896, 0.317226, 0.883397, -0.120303, 0.330545, 0.341068, 0.884987, -0.12667, 0.330068, 0.365613, 0.886789, -0.133118, 0.329418, 0.390807, 0.889311, -0.139024, 0.328683, 0.416494, 0.891995, -0.144971, 0.327729, 0.442618, 0.895106, -0.150747, 0.326521, 0.469131, 0.899527, -0.156283, 0.325229, 0.495921, 0.90504, -0.161707, 0.32378, 0.523162, 0.909875, -0.165661, 0.32122, 0.55092, 0.91561, -0.168755, 0.317942, 0.579928, 0.921225, -0.171193, 0.313983, 0.608539, 0.927308, -0.17319, 0.309636, 0.636854, 0.933077, -0.174819, 0.304262, 0.66523, 0.938766, -0.175002, 0.297563, 0.693609, 0.943667, -0.173946, 0.289613, 0.722157, 0.949033, -0.172221, 0.281227, 0.750021, 0.953765, -0.169869, 0.271545, 0.777466, 0.95804, -0.166578, 0.261034, 0.804853, 0.962302, -0.161761, 0.249434, 0.831569, 0.966544, -0.156636, 0.237484, 0.857779, 0.969372, -0.150784, 0.224395, 0.883051, 0.972486, -0.143672, 0.210786, 0.907864, 0.975853, -0.135772, 0.196556, 0.931223, 0.977975, -0.127942, 0.182307, 0.954061, 0.979122, -0.118347, 0.167607, 0.97531, 0.980719, -0.109112, 0.152739, 0.995666, 0.981223, -0.0991789, 0.137932, 1.01475, 0.98216, -0.0883553, 0.122692, 1.03253, 0.983379, -0.0780825, 0.107493, 1.04917, 0.985434, -0.0665646, 0.0917791, 1.06464, 0.987332, -0.0557714, 0.0764949, 1.07896, 0.990004, -0.0442805, 0.060721, 1.09199, 0.992975, -0.0331676, 0.0452284, 1.10393, 0.995811, -0.0219547, 0.0297934, 1.11476, 0.9982, -0.0107613, 0.0146415, 1.12484, 1.00002, 0.000248678, -0.00014555, 1.13413, 0.859519, -6.93595e-6, 0.347264, 1.71673e-5, 0.859843, -0.00017503, 0.347394, 0.000433219, 0.859656, -0.000700076, 0.347319, 0.00173277, 0.859671, -0.00157517, 0.347325, 0.00389875, 0.859669, -0.00280028, 0.347324, 0.00693112, 0.85967, -0.0043754, 0.347324, 0.01083, 0.859665, -0.00630049, 0.347321, 0.0155954, 0.859685, -0.0085755, 0.347328, 0.0212278, 0.859694, -0.0112003, 0.347329, 0.0277273, 0.859718, -0.0141747, 0.347336, 0.0350946, 0.85976, -0.0174988, 0.347348, 0.0433314, 0.85982, -0.0211722, 0.347366, 0.0524384, 0.859892, -0.0251941, 0.347387, 0.0624168, 0.860006, -0.0295649, 0.347422, 0.0732708, 0.860122, -0.0342825, 0.347453, 0.0849999, 0.860282, -0.0393462, 0.347499, 0.0976102, 0.860482, -0.0447513, 0.347554, 0.111104, 0.860719, -0.0504775, 0.347614, 0.125479, 0.860998, -0.0563577, 0.347666, 0.140703, 0.861322, -0.0619473, 0.347662, 0.156681, 0.861724, -0.0681277, 0.347684, 0.173597, 0.862198, -0.0746567, 0.347709, 0.191371, 0.862733, -0.0815234, 0.347727, 0.209976, 0.863371, -0.0886643, 0.347744, 0.229351, 0.86414, -0.0957908, 0.347734, 0.24934, 0.865138, -0.102912, 0.34772, 0.269797, 0.866182, -0.110924, 0.3478, 0.290654, 0.867436, -0.119223, 0.347911, 0.312074, 0.869087, -0.126197, 0.347649, 0.335438, 0.870859, -0.133145, 0.347222, 0.359732, 0.872997, -0.139869, 0.346645, 0.38467, 0.875939, -0.146089, 0.345935, 0.41019, 0.879012, -0.152334, 0.345012, 0.436218, 0.883353, -0.15821, 0.343924, 0.462641, 0.888362, -0.164097, 0.342636, 0.489449, 0.895026, -0.169528, 0.341351, 0.516629, 0.900753, -0.174408, 0.339115, 0.544109, 0.906814, -0.17751, 0.335809, 0.572857, 0.912855, -0.180101, 0.331597, 0.601554, 0.919438, -0.182116, 0.32698, 0.630198, 0.925962, -0.183494, 0.321449, 0.658404, 0.931734, -0.184159, 0.314595, 0.686625, 0.93762, -0.18304, 0.306462, 0.71531, 0.943858, -0.181323, 0.297514, 0.744272, 0.948662, -0.178683, 0.287447, 0.771462, 0.953299, -0.175379, 0.276166, 0.798593, 0.957346, -0.170395, 0.263758, 0.8256, 0.962565, -0.165042, 0.251019, 0.852575, 0.966075, -0.158655, 0.237011, 0.878316, 0.969048, -0.151707, 0.222518, 0.90329, 0.972423, -0.143271, 0.207848, 0.927745, 0.975833, -0.134824, 0.192463, 0.950859, 0.977629, -0.125444, 0.1768, 0.972947, 0.978995, -0.114949, 0.161033, 0.993263, 0.980533, -0.104936, 0.145523, 1.01337, 0.980745, -0.0935577, 0.129799, 1.03128, 0.981814, -0.0822956, 0.113486, 1.04825, 0.983943, -0.0710082, 0.0972925, 1.06405, 0.986141, -0.0587931, 0.0808138, 1.0785, 0.988878, -0.0472755, 0.0644915, 1.09204, 0.992132, -0.0349128, 0.0478128, 1.10413, 0.9953, -0.0232407, 0.031621, 1.11527, 0.998117, -0.0112713, 0.0154935, 1.12551, 1.00003, 0.000339743, -0.000195763, 1.13504, 0.845441, -7.29126e-6, 0.364305, 1.69208e-5, 0.843588, -0.000183164, 0.363506, 0.000425067, 0.843412, -0.00073253, 0.36343, 0.00169999, 0.843401, -0.00164818, 0.363426, 0.00382495, 0.843399, -0.00293008, 0.363425, 0.00679993, 0.843401, -0.00457822, 0.363425, 0.010625, 0.843394, -0.00659249, 0.363421, 0.0153002, 0.843398, -0.00897282, 0.363421, 0.0208258, 0.843415, -0.0117191, 0.363426, 0.0272024, 0.843438, -0.0148312, 0.363432, 0.0344305, 0.843483, -0.018309, 0.363447, 0.0425116, 0.84356, -0.0221521, 0.363472, 0.0514471, 0.843646, -0.0263597, 0.363499, 0.061238, 0.843743, -0.0309315, 0.363527, 0.0718873, 0.84388, -0.0358658, 0.363569, 0.0833969, 0.844079, -0.0411624, 0.363631, 0.0957742, 0.844279, -0.0468128, 0.363688, 0.109015, 0.844549, -0.0527923, 0.363761, 0.123124, 0.844858, -0.0588204, 0.363817, 0.138044, 0.84522, -0.0647573, 0.36383, 0.153755, 0.845669, -0.0713181, 0.363879, 0.170394, 0.846155, -0.0781697, 0.363908, 0.187861, 0.846789, -0.0853913, 0.363969, 0.206176, 0.847502, -0.0928086, 0.363999, 0.225244, 0.8484, -0.10005, 0.363997, 0.244926, 0.849461, -0.107615, 0.364008, 0.265188, 0.850562, -0.115814, 0.364055, 0.28587, 0.851962, -0.124334, 0.364179, 0.306926, 0.854326, -0.131995, 0.364233, 0.329605, 0.856295, -0.139338, 0.363856, 0.35359, 0.858857, -0.146346, 0.363347, 0.37831, 0.862428, -0.152994, 0.362807, 0.403722, 0.866203, -0.159463, 0.361963, 0.429537, 0.871629, -0.165623, 0.36112, 0.456, 0.877365, -0.171649, 0.359917, 0.482773, 0.883744, -0.177151, 0.35848, 0.509705, 0.890693, -0.182381, 0.356523, 0.537215, 0.897278, -0.186076, 0.3533, 0.565493, 0.903958, -0.188602, 0.349095, 0.594293, 0.910908, -0.190755, 0.344215, 0.623165, 0.918117, -0.192063, 0.338606, 0.651573, 0.924644, -0.192758, 0.331544, 0.679869, 0.931054, -0.192238, 0.323163, 0.708668, 0.937303, -0.190035, 0.313529, 0.737201, 0.943387, -0.187162, 0.303152, 0.764977, 0.948494, -0.183876, 0.29146, 0.792683, 0.952546, -0.178901, 0.277917, 0.819228, 0.958077, -0.173173, 0.264753, 0.846559, 0.962462, -0.16645, 0.25002, 0.872962, 0.966569, -0.159452, 0.234873, 0.898729, 0.969108, -0.15074, 0.218752, 0.923126, 0.973072, -0.141523, 0.202673, 0.947278, 0.975452, -0.132075, 0.186326, 0.969938, 0.977784, -0.121257, 0.169396, 0.991325, 0.97899, -0.110182, 0.153044, 1.01123, 0.979777, -0.0989634, 0.136485, 1.0299, 0.980865, -0.0865894, 0.119343, 1.04727, 0.982432, -0.0746115, 0.102452, 1.06341, 0.984935, -0.0621822, 0.0852423, 1.07834, 0.987776, -0.0495694, 0.0678546, 1.092, 0.99103, -0.0372386, 0.0506917, 1.1043, 0.99474, -0.0244353, 0.0333316, 1.11576, 0.997768, -0.0121448, 0.0164348, 1.12617, 1.00003, 0.00031774, -0.000169504, 1.13598, 0.825551, -7.56799e-6, 0.378425, 1.65099e-5, 0.82664, -0.000190922, 0.378923, 0.000416504, 0.826323, -0.000763495, 0.378779, 0.0016656, 0.826359, -0.00171789, 0.378795, 0.00374768, 0.82636, -0.00305402, 0.378795, 0.00666259, 0.826368, -0.00477185, 0.378798, 0.0104104, 0.826364, -0.00687131, 0.378795, 0.0149912, 0.826368, -0.00935232, 0.378795, 0.0204054, 0.826376, -0.0122146, 0.378797, 0.0266532, 0.826399, -0.0154581, 0.378803, 0.0337355, 0.82646, -0.0190825, 0.378824, 0.0416537, 0.826525, -0.0230873, 0.378846, 0.0504091, 0.826614, -0.0274719, 0.378876, 0.0600032, 0.82674, -0.0322355, 0.378917, 0.0704393, 0.826888, -0.0373766, 0.378964, 0.0817195, 0.827078, -0.0428936, 0.379024, 0.0938492, 0.827318, -0.0487778, 0.379099, 0.106828, 0.82764, -0.0549935, 0.379199, 0.120659, 0.827926, -0.0611058, 0.379227, 0.13526, 0.828325, -0.0675054, 0.379275, 0.150713, 0.828801, -0.0743455, 0.379332, 0.167034, 0.8294, -0.0815523, 0.379415, 0.184209, 0.830094, -0.0890779, 0.379495, 0.202203, 0.8309, -0.096736, 0.379555, 0.220945, 0.831943, -0.104135, 0.379577, 0.240306, 0.833037, -0.112106, 0.379604, 0.260317, 0.834278, -0.120554, 0.379668, 0.2808, 0.836192, -0.129128, 0.3799, 0.301654, 0.838671, -0.137541, 0.380109, 0.323502, 0.840939, -0.14523, 0.379809, 0.347176, 0.844575, -0.15248, 0.379593, 0.371706, 0.848379, -0.159607, 0.37909, 0.39688, 0.853616, -0.166267, 0.378617, 0.422702, 0.858921, -0.172698, 0.377746, 0.448919, 0.865324, -0.178823, 0.376749, 0.475661, 0.872207, -0.184542, 0.375363, 0.502599, 0.880018, -0.189836, 0.373657, 0.529914, 0.88694, -0.194294, 0.370673, 0.557683, 0.894779, -0.197022, 0.36662, 0.586848, 0.902242, -0.199108, 0.36138, 0.615831, 0.909914, -0.200398, 0.355434, 0.644478, 0.917088, -0.20094, 0.348173, 0.672905, 0.923888, -0.200671, 0.339482, 0.701327, 0.930495, -0.198773, 0.32956, 0.730101, 0.937247, -0.195394, 0.318363, 0.758383, 0.943108, -0.191956, 0.306323, 0.786539, 0.948296, -0.187227, 0.292576, 0.813637, 0.953472, -0.181165, 0.278234, 0.840793, 0.958485, -0.174119, 0.263054, 0.867712, 0.962714, -0.166564, 0.246756, 0.893635, 0.966185, -0.158181, 0.229945, 0.919028, 0.970146, -0.148275, 0.212633, 0.943413, 0.973491, -0.138157, 0.195229, 0.966627, 0.975741, -0.127574, 0.178048, 0.988817, 0.977238, -0.11554, 0.160312, 1.00924, 0.978411, -0.10364, 0.142857, 1.02845, 0.979811, -0.0913122, 0.125317, 1.04648, 0.98116, -0.0782558, 0.107627, 1.06284, 0.983543, -0.0655957, 0.0895862, 1.07798, 0.986789, -0.0520411, 0.0713756, 1.092, 0.990292, -0.0389727, 0.053228, 1.10484, 0.994187, -0.025808, 0.0351945, 1.11642, 0.997499, -0.0126071, 0.0173198, 1.12703, 0.999999, 0.000275604, -0.000148602, 1.13674, 0.81075, -7.8735e-6, 0.394456, 1.61829e-5, 0.808692, -0.000198293, 0.393453, 0.000407564, 0.80846, -0.000792877, 0.39334, 0.00162965, 0.808595, -0.00178416, 0.393407, 0.00366711, 0.808597, -0.00317182, 0.393408, 0.00651934, 0.808598, -0.00495589, 0.393408, 0.0101866, 0.808591, -0.00713627, 0.393403, 0.0146689, 0.808592, -0.00971285, 0.393402, 0.0199667, 0.80861, -0.0126855, 0.393407, 0.0260803, 0.808633, -0.0160538, 0.393413, 0.0330107, 0.80868, -0.0198175, 0.393429, 0.0407589, 0.808748, -0.0239758, 0.393453, 0.0493264, 0.808854, -0.0285286, 0.39349, 0.0587161, 0.808992, -0.0334748, 0.39354, 0.0689304, 0.809141, -0.0388116, 0.393588, 0.0799707, 0.809352, -0.0445375, 0.39366, 0.0918432, 0.809608, -0.0506427, 0.393742, 0.104549, 0.809915, -0.0570708, 0.393834, 0.118085, 0.810253, -0.0633526, 0.393885, 0.132377, 0.810687, -0.0700966, 0.393953, 0.147537, 0.811233, -0.0772274, 0.394047, 0.163543, 0.811865, -0.0847629, 0.394148, 0.180394, 0.812648, -0.0925663, 0.394265, 0.198051, 0.813583, -0.100416, 0.394363, 0.216443, 0.814683, -0.108119, 0.394402, 0.235502, 0.815948, -0.11644, 0.394489, 0.255242, 0.817278, -0.125036, 0.394542, 0.275441, 0.819605, -0.133655, 0.39486, 0.296094, 0.822256, -0.142682, 0.395248, 0.317309, 0.825349, -0.150756, 0.395241, 0.340516, 0.829605, -0.158392, 0.395285, 0.364819, 0.83391, -0.165801, 0.394922, 0.389736, 0.839808, -0.172677, 0.394691, 0.415409, 0.845708, -0.179448, 0.394006, 0.441546, 0.853025, -0.185746, 0.393279, 0.46832, 0.859666, -0.191684, 0.391655, 0.495302, 0.86789, -0.197146, 0.390068, 0.52262, 0.875845, -0.201904, 0.38727, 0.550336, 0.882634, -0.205023, 0.382688, 0.578825, 0.891076, -0.207098, 0.377543, 0.608103, 0.900589, -0.208474, 0.371752, 0.63723, 0.90791, -0.209068, 0.364016, 0.665769, 0.915971, -0.208655, 0.355593, 0.694428, 0.923455, -0.20729, 0.345439, 0.723224, 0.931514, -0.203821, 0.334099, 0.751925, 0.937885, -0.19986, 0.321069, 0.780249, 0.943136, -0.194993, 0.306571, 0.8077, 0.948818, -0.189132, 0.291556, 0.83497, 0.954433, -0.181617, 0.275745, 0.86188, 0.959078, -0.173595, 0.258695, 0.888562, 0.962705, -0.164855, 0.240825, 0.914008, 0.966753, -0.155129, 0.22268, 0.939145, 0.970704, -0.144241, 0.204542, 0.963393, 0.973367, -0.133188, 0.185927, 0.985983, 0.975984, -0.121146, 0.167743, 1.00704, 0.976994, -0.108366, 0.149218, 1.02715, 0.978485, -0.0956746, 0.13131, 1.0455, 0.980074, -0.0820733, 0.112513, 1.06221, 0.98225, -0.0684061, 0.0938323, 1.07782, 0.98553, -0.0549503, 0.0749508, 1.09199, 0.989529, -0.0407857, 0.055848, 1.10508, 0.993536, -0.0271978, 0.0368581, 1.11684, 0.997247, -0.0132716, 0.0181845, 1.12789, 1, 0.000431817, -0.000198809, 1.13792, 0.785886, -8.12608e-6, 0.405036, 1.57669e-5, 0.790388, -0.000205278, 0.407355, 0.000398297, 0.790145, -0.000820824, 0.407231, 0.00159263, 0.790135, -0.00184681, 0.407226, 0.00358336, 0.790119, -0.00328316, 0.407218, 0.00637039, 0.790126, -0.00512988, 0.40722, 0.0099539, 0.79013, -0.00738684, 0.407221, 0.0143339, 0.790135, -0.0100538, 0.407221, 0.0195107, 0.790134, -0.0131306, 0.407217, 0.0254848, 0.79016, -0.0166169, 0.407224, 0.0322572, 0.790197, -0.020512, 0.407236, 0.0398284, 0.790273, -0.0248157, 0.407263, 0.0482014, 0.790381, -0.029527, 0.407304, 0.0573777, 0.790521, -0.0346446, 0.407355, 0.0673602, 0.790704, -0.0401665, 0.40742, 0.0781522, 0.790925, -0.0460896, 0.407499, 0.0897582, 0.791195, -0.0524017, 0.407589, 0.10218, 0.791522, -0.0590121, 0.407691, 0.11541, 0.791878, -0.0654876, 0.407748, 0.12939, 0.792361, -0.0725207, 0.407849, 0.144237, 0.792942, -0.0799844, 0.407963, 0.159924, 0.79362, -0.0877896, 0.408087, 0.176425, 0.794529, -0.0958451, 0.408259, 0.193733, 0.795521, -0.103827, 0.408362, 0.211756, 0.796778, -0.111937, 0.408482, 0.230524, 0.798027, -0.120521, 0.408547, 0.249967, 0.799813, -0.129242, 0.408721, 0.269926, 0.802387, -0.138048, 0.409148, 0.290338, 0.805279, -0.147301, 0.409641, 0.311193, 0.809251, -0.155895, 0.410154, 0.333611, 0.813733, -0.163942, 0.410297, 0.357615, 0.819081, -0.171666, 0.410373, 0.382339, 0.825427, -0.178905, 0.410348, 0.407828, 0.83172, -0.185812, 0.409486, 0.434034, 0.83877, -0.192318, 0.408776, 0.460493, 0.845817, -0.198249, 0.407176, 0.487346, 0.854664, -0.204034, 0.405719, 0.514832, 0.863495, -0.208908, 0.403282, 0.542401, 0.871883, -0.212765, 0.399293, 0.570683, 0.88065, -0.214911, 0.393803, 0.599947, 0.89004, -0.216214, 0.387536, 0.62932, 0.898476, -0.216745, 0.379846, 0.658319, 0.906738, -0.216387, 0.370625, 0.687138, 0.914844, -0.215053, 0.360139, 0.71601, 0.923877, -0.212007, 0.348849, 0.745124, 0.931925, -0.207481, 0.335639, 0.773366, 0.938054, -0.202418, 0.320798, 0.801636, 0.943895, -0.196507, 0.304772, 0.829055, 0.949468, -0.189009, 0.288033, 0.856097, 0.955152, -0.180539, 0.270532, 0.88301, 0.959403, -0.171437, 0.251639, 0.909296, 0.963309, -0.161661, 0.232563, 0.934868, 0.967399, -0.150425, 0.213231, 0.959662, 0.972009, -0.138659, 0.194247, 0.98302, 0.97433, -0.126595, 0.174718, 1.00517, 0.975823, -0.113205, 0.155518, 1.02566, 0.976371, -0.0996096, 0.136709, 1.04418, 0.978705, -0.0860754, 0.117571, 1.06146, 0.981477, -0.0714438, 0.0980046, 1.07777, 0.984263, -0.0572304, 0.0782181, 1.09214, 0.988423, -0.0428875, 0.0584052, 1.10553, 0.993, -0.0282442, 0.038522, 1.11758, 0.99704, -0.0140183, 0.0190148, 1.12864, 0.999913, 0.000369494, -0.000145203, 1.13901, 0.777662, -8.4153e-6, 0.423844, 1.54403e-5, 0.770458, -0.000211714, 0.419915, 0.00038845, 0.770716, -0.000846888, 0.420055, 0.00155386, 0.770982, -0.00190567, 0.420202, 0.00349653, 0.770981, -0.00338782, 0.420201, 0.00621606, 0.77098, -0.00529338, 0.4202, 0.00971274, 0.770983, -0.00762223, 0.4202, 0.0139867, 0.770985, -0.0103741, 0.420198, 0.0190381, 0.770996, -0.0135489, 0.4202, 0.0248677, 0.771029, -0.0171461, 0.420212, 0.0314764, 0.771052, -0.0211647, 0.420215, 0.0388648, 0.771131, -0.0256048, 0.420245, 0.047036, 0.771235, -0.0304647, 0.420284, 0.0559911, 0.771383, -0.0357436, 0.420341, 0.0657346, 0.771591, -0.0414392, 0.420423, 0.0762694, 0.771819, -0.0475462, 0.420506, 0.0875984, 0.772123, -0.0540506, 0.420617, 0.099727, 0.772464, -0.060797, 0.42072, 0.112637, 0.772855, -0.0675393, 0.420799, 0.126313, 0.773317, -0.0748323, 0.420893, 0.140824, 0.773981, -0.0825681, 0.421058, 0.15617, 0.774746, -0.0906307, 0.421226, 0.172322, 0.77566, -0.0988982, 0.421397, 0.189253, 0.776837, -0.106994, 0.421569, 0.206912, 0.778097, -0.115528, 0.421704, 0.225359, 0.779588, -0.124317, 0.421849, 0.24447, 0.781574, -0.133139, 0.422097, 0.264156, 0.784451, -0.142179, 0.422615, 0.284318, 0.787682, -0.15165, 0.423269, 0.304902, 0.792433, -0.160771, 0.424396, 0.3265, 0.797359, -0.169166, 0.424772, 0.35014, 0.803986, -0.177149, 0.425475, 0.374768, 0.809504, -0.184745, 0.424996, 0.399928, 0.815885, -0.19173, 0.424247, 0.425796, 0.823513, -0.198525, 0.423515, 0.452287, 0.832549, -0.204709, 0.422787, 0.479321, 0.841653, -0.210447, 0.421187, 0.506718, 0.850401, -0.215501, 0.418519, 0.53432, 0.859854, -0.219752, 0.414715, 0.56242, 0.869364, -0.222305, 0.409462, 0.591558, 0.878837, -0.223744, 0.402926, 0.621074, 0.888636, -0.224065, 0.395043, 0.650538, 0.898132, -0.223742, 0.38564, 0.679538, 0.907181, -0.222308, 0.375378, 0.708674, 0.915621, -0.219837, 0.363212, 0.737714, 0.9239, -0.215233, 0.349313, 0.767014, 0.931644, -0.209592, 0.334162, 0.795133, 0.938887, -0.203644, 0.317943, 0.823228, 0.945282, -0.196349, 0.300581, 0.850822, 0.950758, -0.18742, 0.282195, 0.877594, 0.956146, -0.177879, 0.262481, 0.904564, 0.960355, -0.167643, 0.242487, 0.930741, 0.965256, -0.156671, 0.222668, 0.955868, 0.968029, -0.144123, 0.201907, 0.979869, 0.97251, -0.131305, 0.18202, 1.00291, 0.974925, -0.118335, 0.161909, 1.02392, 0.975402, -0.103714, 0.142129, 1.0433, 0.976987, -0.089415, 0.122447, 1.06089, 0.979677, -0.0748858, 0.102248, 1.07713, 0.983184, -0.0596086, 0.0814851, 1.09218, 0.987466, -0.0447671, 0.0609484, 1.10585, 0.992348, -0.0295217, 0.0401835, 1.11829, 0.996674, -0.0143917, 0.0198163, 1.12966, 1.00003, 0.000321364, -0.000149983, 1.1402, 0.757901, -8.69074e-6, 0.436176, 1.51011e-5, 0.751195, -0.000217848, 0.432317, 0.000378533, 0.751178, -0.000871373, 0.432307, 0.0015141, 0.751195, -0.00196061, 0.432317, 0.0034068, 0.751198, -0.00348552, 0.432318, 0.00605659, 0.751195, -0.00544599, 0.432315, 0.00946353, 0.751207, -0.00784203, 0.43232, 0.013628, 0.751213, -0.0106732, 0.43232, 0.0185499, 0.751221, -0.0139393, 0.432319, 0.0242302, 0.751244, -0.0176398, 0.432325, 0.0306694, 0.7513, -0.0217743, 0.432348, 0.0378698, 0.751358, -0.0263412, 0.432367, 0.0458321, 0.751458, -0.0313396, 0.432404, 0.0545587, 0.751608, -0.0367682, 0.432464, 0.0640543, 0.7518, -0.0426246, 0.43254, 0.0743222, 0.752065, -0.0489031, 0.432645, 0.0853668, 0.752376, -0.0555828, 0.432762, 0.0971911, 0.752715, -0.0623861, 0.432859, 0.109768, 0.753137, -0.069415, 0.432958, 0.123126, 0.753676, -0.0770039, 0.433099, 0.137308, 0.754345, -0.084971, 0.433272, 0.15229, 0.755235, -0.0932681, 0.433504, 0.168075, 0.756186, -0.10171, 0.433693, 0.184625, 0.757363, -0.110019, 0.433857, 0.201897, 0.75884, -0.11887, 0.434102, 0.220014, 0.760467, -0.127881, 0.434306, 0.238778, 0.762969, -0.136766, 0.434751, 0.258172, 0.765823, -0.14612, 0.43529, 0.278062, 0.769676, -0.15566, 0.436236, 0.298437, 0.774909, -0.165177, 0.437754, 0.319532, 0.77994, -0.17402, 0.438343, 0.342505, 0.785757, -0.182201, 0.438609, 0.366693, 0.792487, -0.190104, 0.438762, 0.391668, 0.80038, -0.197438, 0.438795, 0.417494, 0.808494, -0.204365, 0.438226, 0.443933, 0.817695, -0.210714, 0.437283, 0.470929, 0.828111, -0.216651, 0.436087, 0.498569, 0.837901, -0.221804, 0.433717, 0.526165, 0.847813, -0.226318, 0.430133, 0.554155, 0.858314, -0.229297, 0.425213, 0.582822, 0.868891, -0.230999, 0.418576, 0.612847, 0.878941, -0.231155, 0.410405, 0.642445, 0.888809, -0.230935, 0.400544, 0.672024, 0.898089, -0.229343, 0.389613, 0.701366, 0.908081, -0.226886, 0.377197, 0.730763, 0.916819, -0.222676, 0.363397, 0.759642, 0.924968, -0.216835, 0.347437, 0.788775, 0.932906, -0.210245, 0.32995, 0.817135, 0.940025, -0.202992, 0.312262, 0.844912, 0.946101, -0.19436, 0.293313, 0.872164, 0.952835, -0.184125, 0.273638, 0.899443, 0.957347, -0.173657, 0.252385, 0.926389, 0.961434, -0.162204, 0.231038, 0.951947, 0.965522, -0.14979, 0.209834, 0.976751, 0.969412, -0.136307, 0.188821, 1.00022, 0.973902, -0.122527, 0.168013, 1.02229, 0.974045, -0.108213, 0.147634, 1.04199, 0.975775, -0.0927397, 0.12705, 1.06019, 0.978383, -0.0778212, 0.106309, 1.07711, 0.98211, -0.0621216, 0.0849279, 1.09245, 0.986517, -0.0463847, 0.0633519, 1.10651, 0.991696, -0.0309353, 0.0419698, 1.11903, 0.996349, -0.0150914, 0.0206272, 1.13073, 1.00003, 0.000442449, -0.000231396, 1.14146, 0.727498, -8.85074e-6, 0.441528, 1.45832e-5, 0.730897, -0.000223525, 0.443589, 0.000368298, 0.730796, -0.000893996, 0.443528, 0.00147303, 0.730805, -0.00201149, 0.443533, 0.00331433, 0.730814, -0.00357596, 0.443538, 0.00589222, 0.730815, -0.00558734, 0.443538, 0.00920678, 0.730822, -0.00804544, 0.44354, 0.0132582, 0.730836, -0.0109501, 0.443545, 0.0180468, 0.730848, -0.0143008, 0.443546, 0.0235732, 0.730871, -0.0180969, 0.443552, 0.0298382, 0.730915, -0.022338, 0.443567, 0.0368438, 0.730982, -0.0270225, 0.443591, 0.044591, 0.731076, -0.0321491, 0.443627, 0.0530831, 0.731245, -0.0377166, 0.443699, 0.0623243, 0.73144, -0.0437216, 0.443777, 0.0723181, 0.7317, -0.0501576, 0.443881, 0.0830691, 0.732034, -0.0569942, 0.444014, 0.0945809, 0.732388, -0.0638756, 0.444113, 0.106825, 0.732853, -0.071203, 0.444247, 0.119859, 0.733473, -0.0790076, 0.444442, 0.13369, 0.734195, -0.0871937, 0.444645, 0.148304, 0.735069, -0.095696, 0.444877, 0.163702, 0.736169, -0.10426, 0.445133, 0.179861, 0.73747, -0.112853, 0.44537, 0.196778, 0.738991, -0.12199, 0.445651, 0.214496, 0.740865, -0.131153, 0.445958, 0.232913, 0.743637, -0.140245, 0.446548, 0.251977, 0.746797, -0.149722, 0.447246, 0.271551, 0.751517, -0.159341, 0.448656, 0.291774, 0.756156, -0.169106, 0.449866, 0.312455, 0.761519, -0.178436, 0.450919, 0.334552, 0.768295, -0.186904, 0.451776, 0.358491, 0.776613, -0.195117, 0.452832, 0.383446, 0.783966, -0.202695, 0.45249, 0.408945, 0.793542, -0.20985, 0.452587, 0.435364, 0.803192, -0.216403, 0.451852, 0.462336, 0.813892, -0.22251, 0.450708, 0.48987, 0.824968, -0.227676, 0.4486, 0.517697, 0.835859, -0.232443, 0.445156, 0.545975, 0.846825, -0.235775, 0.440351, 0.574483, 0.858085, -0.237897, 0.433641, 0.604246, 0.868825, -0.238074, 0.425354, 0.634101, 0.879638, -0.237661, 0.415383, 0.664201, 0.889966, -0.236186, 0.404136, 0.693918, 0.899479, -0.233599, 0.390917, 0.723481, 0.908769, -0.229737, 0.376352, 0.75258, 0.917966, -0.223836, 0.360372, 0.781764, 0.926304, -0.217067, 0.342551, 0.811139, 0.934626, -0.209309, 0.324238, 0.839585, 0.941841, -0.20071, 0.304484, 0.867044, 0.94789, -0.190602, 0.283607, 0.894579, 0.954196, -0.179253, 0.262205, 0.921743, 0.958383, -0.167646, 0.239847, 0.948026, 0.963119, -0.155073, 0.218078, 0.973296, 0.966941, -0.141426, 0.195899, 0.998135, 0.970836, -0.126849, 0.174121, 1.02021, 0.973301, -0.112296, 0.153052, 1.04085, 0.97448, -0.0964965, 0.131733, 1.05946, 0.977045, -0.080489, 0.10997, 1.07693, 0.980751, -0.064844, 0.0881657, 1.09254, 0.985475, -0.0481938, 0.0657987, 1.10697, 0.991089, -0.0319185, 0.0435215, 1.12004, 0.996122, -0.0158088, 0.0214779, 1.13173, 1.00001, 0.000372455, -0.000200295, 1.14291, 0.708622, -9.07597e-6, 0.45304, 1.41962e-5, 0.711162, -0.000228911, 0.454662, 0.000358052, 0.709812, -0.000914446, 0.453797, 0.00143034, 0.709865, -0.00205819, 0.453834, 0.00321935, 0.709864, -0.00365894, 0.453833, 0.00572331, 0.709855, -0.00571692, 0.453826, 0.00894278, 0.709862, -0.00823201, 0.453828, 0.012878, 0.709875, -0.011204, 0.453832, 0.0175295, 0.709896, -0.0146323, 0.453839, 0.0228978, 0.709925, -0.0185163, 0.453847, 0.0289839, 0.709974, -0.0228551, 0.453866, 0.0357894, 0.710045, -0.0276473, 0.453892, 0.0433161, 0.710133, -0.032891, 0.453924, 0.0515665, 0.710292, -0.0385851, 0.453992, 0.0605458, 0.710485, -0.0447254, 0.45407, 0.0702574, 0.710769, -0.0513051, 0.454192, 0.0807077, 0.711106, -0.0582733, 0.454329, 0.091896, 0.711516, -0.0652866, 0.45446, 0.103814, 0.712071, -0.0728426, 0.454653, 0.116508, 0.712676, -0.0808307, 0.45484, 0.129968, 0.713476, -0.0892216, 0.455096, 0.144206, 0.714377, -0.0979047, 0.455346, 0.159212, 0.715579, -0.106531, 0.455647, 0.174973, 0.716977, -0.115492, 0.455961, 0.191504, 0.71862, -0.124821, 0.456315, 0.208835, 0.72084, -0.134079, 0.4568, 0.226869, 0.723786, -0.143427, 0.457521, 0.245582, 0.727464, -0.153061, 0.458475, 0.264957, 0.732771, -0.162768, 0.460239, 0.284948, 0.736515, -0.172627, 0.460899, 0.30522, 0.743519, -0.182487, 0.463225, 0.326717, 0.750041, -0.191295, 0.464027, 0.350113, 0.758589, -0.199746, 0.465227, 0.374782, 0.767703, -0.207584, 0.465877, 0.400226, 0.777484, -0.214973, 0.465996, 0.426442, 0.788792, -0.221796, 0.466019, 0.453688, 0.800194, -0.228038, 0.465083, 0.481246, 0.811234, -0.233346, 0.462506, 0.509086, 0.822859, -0.238073, 0.459257, 0.537338, 0.835082, -0.241764, 0.454863, 0.566108, 0.846332, -0.244241, 0.448163, 0.595126, 0.858355, -0.244736, 0.439709, 0.625574, 0.87034, -0.244278, 0.429837, 0.65617, 0.881027, -0.24255, 0.418002, 0.686029, 0.891007, -0.239912, 0.404325, 0.716039, 0.900874, -0.236133, 0.389222, 0.745518, 0.911072, -0.230672, 0.373269, 0.775026, 0.920359, -0.22356, 0.355083, 0.804521, 0.928604, -0.215591, 0.335533, 0.834045, 0.937175, -0.206503, 0.315278, 0.861612, 0.942825, -0.196684, 0.293653, 0.889131, 0.949805, -0.185116, 0.271503, 0.916853, 0.955535, -0.172703, 0.248821, 0.943541, 0.959843, -0.159978, 0.225591, 0.970132, 0.964393, -0.146375, 0.202719, 0.994709, 0.968008, -0.131269, 0.179928, 1.0186, 0.971013, -0.11569, 0.158007, 1.03928, 0.973334, -0.1003, 0.13624, 1.05887, 0.975775, -0.0833352, 0.1138, 1.07652, 0.979579, -0.0668981, 0.0913141, 1.09297, 0.984323, -0.0500902, 0.0683051, 1.10734, 0.990351, -0.0332377, 0.0451771, 1.12084, 0.995823, -0.0161491, 0.0221705, 1.13296, 1.0001, 0.000234083, -0.000108712, 1.14441, 0.683895, -9.24677e-6, 0.46015, 1.37429e-5, 0.68833, -0.000233383, 0.463134, 0.000346865, 0.688368, -0.000933547, 0.463159, 0.00138748, 0.688367, -0.00210049, 0.463159, 0.00312187, 0.688369, -0.00373415, 0.463159, 0.00555004, 0.688377, -0.00583449, 0.463163, 0.00867216, 0.688386, -0.00840128, 0.463166, 0.0124884, 0.688398, -0.0114343, 0.463169, 0.0169993, 0.688418, -0.0149329, 0.463175, 0.0222054, 0.688453, -0.0188964, 0.463188, 0.028108, 0.688515, -0.0233239, 0.463214, 0.0347085, 0.68857, -0.0282136, 0.463231, 0.0420091, 0.688679, -0.033564, 0.463276, 0.0500132, 0.688854, -0.0393733, 0.463356, 0.0587255, 0.689038, -0.0456354, 0.46343, 0.0681476, 0.689321, -0.0523433, 0.463553, 0.0782897, 0.689662, -0.059412, 0.463693, 0.0891501, 0.690188, -0.0665736, 0.4639, 0.100735, 0.690755, -0.0743106, 0.464107, 0.113074, 0.691405, -0.0824722, 0.464329, 0.126161, 0.692198, -0.0910484, 0.464585, 0.140007, 0.693196, -0.0998778, 0.464893, 0.154612, 0.69454, -0.108651, 0.465285, 0.169984, 0.695921, -0.117855, 0.465596, 0.186106, 0.697749, -0.12734, 0.466056, 0.203034, 0.700375, -0.136714, 0.466771, 0.220703, 0.703395, -0.146386, 0.467579, 0.239062, 0.707904, -0.156096, 0.469067, 0.258188, 0.711673, -0.165904, 0.469851, 0.277759, 0.717489, -0.175812, 0.471815, 0.297935, 0.724051, -0.185931, 0.47389, 0.318916, 0.731965, -0.195238, 0.47587, 0.341591, 0.741151, -0.204021, 0.477523, 0.366062, 0.751416, -0.212113, 0.478881, 0.391396, 0.761848, -0.21979, 0.479226, 0.417599, 0.771886, -0.2267, 0.478495, 0.444401, 0.783998, -0.232991, 0.477622, 0.472084, 0.796523, -0.238645, 0.475833, 0.500193, 0.808851, -0.243396, 0.472568, 0.52865, 0.821191, -0.247226, 0.467857, 0.557362, 0.834261, -0.250102, 0.461871, 0.586768, 0.846762, -0.251056, 0.453543, 0.617085, 0.859867, -0.250604, 0.443494, 0.647659, 0.871948, -0.248783, 0.431711, 0.678119, 0.882967, -0.245855, 0.417911, 0.708399, 0.892826, -0.242168, 0.401993, 0.738256, 0.90332, -0.237062, 0.385371, 0.767999, 0.913633, -0.22997, 0.366837, 0.798191, 0.922774, -0.221687, 0.346372, 0.827756, 0.931371, -0.212345, 0.325682, 0.856425, 0.938929, -0.20206, 0.303665, 0.884299, 0.944821, -0.190981, 0.280786, 0.912023, 0.951792, -0.178065, 0.2573, 0.939669, 0.957712, -0.164634, 0.233448, 0.96655, 0.961912, -0.150863, 0.209504, 0.992366, 0.966382, -0.13577, 0.18597, 1.01633, 0.969588, -0.119593, 0.162905, 1.03843, 0.971777, -0.103203, 0.14053, 1.05841, 0.97433, -0.0865888, 0.117909, 1.07632, 0.978686, -0.0690829, 0.0944101, 1.09326, 0.983281, -0.0516568, 0.0705671, 1.10796, 0.989562, -0.034558, 0.0468592, 1.12182, 0.995465, -0.0167808, 0.0229846, 1.1342, 0.999991, 0.000373016, -0.000235606, 1.1459, 0.662251, -9.39016e-6, 0.468575, 1.32714e-5, 0.666634, -0.000237624, 0.471675, 0.000335842, 0.666411, -0.000950385, 0.471516, 0.00134321, 0.666399, -0.00213833, 0.471509, 0.00302221, 0.666386, -0.0038014, 0.471499, 0.00537283, 0.666405, -0.00593958, 0.471511, 0.00839533, 0.666406, -0.00855253, 0.471508, 0.0120898, 0.666428, -0.0116401, 0.471519, 0.0164569, 0.666444, -0.0152015, 0.471522, 0.0214971, 0.66649, -0.0192362, 0.471543, 0.027212, 0.666537, -0.0237428, 0.471558, 0.033603, 0.666617, -0.0287198, 0.471591, 0.0406728, 0.666718, -0.0341647, 0.471631, 0.0484238, 0.666889, -0.0400759, 0.47171, 0.0568621, 0.667104, -0.0464479, 0.471805, 0.0659915, 0.667374, -0.0532677, 0.471923, 0.0758178, 0.667772, -0.0603805, 0.472098, 0.0863425, 0.668371, -0.0677392, 0.472363, 0.0975917, 0.668971, -0.0756028, 0.472596, 0.109567, 0.669696, -0.0839293, 0.472869, 0.122272, 0.670481, -0.0926683, 0.473126, 0.135718, 0.6715, -0.1016, 0.473442, 0.149914, 0.672911, -0.110566, 0.47389, 0.164882, 0.674512, -0.119984, 0.474354, 0.180602, 0.67651, -0.129574, 0.474922, 0.19711, 0.679292, -0.139106, 0.475764, 0.214371, 0.682798, -0.148993, 0.476886, 0.232405, 0.686955, -0.158737, 0.478179, 0.251153, 0.691406, -0.168754, 0.479432, 0.270436, 0.697438, -0.178703, 0.481481, 0.290374, 0.704761, -0.188955, 0.484143, 0.311044, 0.713599, -0.198814, 0.487007, 0.333003, 0.723194, -0.207869, 0.488962, 0.357144, 0.732601, -0.216189, 0.489815, 0.382169, 0.744193, -0.22398, 0.490888, 0.408227, 0.754907, -0.231156, 0.490355, 0.434928, 0.767403, -0.23747, 0.489548, 0.462599, 0.78107, -0.243503, 0.488274, 0.490908, 0.793893, -0.248114, 0.484843, 0.519421, 0.807296, -0.25222, 0.4803, 0.548561, 0.820529, -0.255265, 0.474097, 0.577772, 0.833716, -0.256741, 0.466041, 0.607782, 0.848403, -0.25637, 0.456547, 0.638807, 0.860755, -0.254804, 0.443946, 0.670058, 0.874012, -0.251834, 0.430852, 0.700749, 0.885619, -0.247867, 0.414903, 0.731446, 0.896069, -0.242634, 0.397276, 0.761191, 0.906266, -0.236093, 0.378535, 0.791053, 0.916759, -0.227543, 0.358038, 0.821298, 0.92523, -0.21783, 0.335705, 0.850747, 0.93436, -0.207534, 0.313797, 0.879258, 0.941631, -0.195983, 0.289671, 0.907734, 0.947564, -0.183567, 0.265319, 0.935206, 0.953681, -0.169345, 0.240815, 0.962739, 0.960008, -0.154909, 0.216119, 0.989227, 0.964145, -0.140161, 0.192096, 1.01465, 0.968171, -0.123411, 0.167855, 1.03737, 0.969859, -0.106525, 0.144817, 1.05767, 0.972666, -0.0891023, 0.12149, 1.0761, 0.977055, -0.0718094, 0.0975306, 1.09336, 0.982527, -0.0534213, 0.0730217, 1.10878, 0.989001, -0.0355579, 0.0483366, 1.12285, 0.99512, -0.0176383, 0.023938, 1.13548, 1.00007, 0.000368831, -0.000211581, 1.14744, 0.651047, -9.60845e-6, 0.484101, 1.2922e-5, 0.644145, -0.000241347, 0.478968, 0.000324578, 0.64396, -0.000965142, 0.478831, 0.00129798, 0.64396, -0.00217154, 0.47883, 0.00292046, 0.643968, -0.00386049, 0.478835, 0.00519202, 0.643974, -0.00603186, 0.478838, 0.0081128, 0.643977, -0.0086854, 0.478836, 0.011683, 0.643982, -0.0118207, 0.478834, 0.0159031, 0.644024, -0.0154374, 0.478856, 0.0207743, 0.644059, -0.0195343, 0.478868, 0.0262975, 0.644122, -0.0241103, 0.478896, 0.0324747, 0.644207, -0.0291638, 0.478933, 0.039309, 0.64432, -0.0346919, 0.478981, 0.0468029, 0.644481, -0.0406919, 0.479053, 0.0549614, 0.644722, -0.047159, 0.479169, 0.0637909, 0.645013, -0.0540748, 0.479302, 0.0732974, 0.645503, -0.0612001, 0.479541, 0.0834898, 0.646117, -0.0687303, 0.479829, 0.0943873, 0.646707, -0.0767846, 0.480061, 0.105991, 0.647431, -0.0852465, 0.480343, 0.11831, 0.64831, -0.0940719, 0.48066, 0.131348, 0.649486, -0.103056, 0.481083, 0.14514, 0.650864, -0.112261, 0.481528, 0.159676, 0.652604, -0.121852, 0.482102, 0.174979, 0.654825, -0.131505, 0.482813, 0.191079, 0.657876, -0.141189, 0.483876, 0.207927, 0.661339, -0.151239, 0.48499, 0.225586, 0.665463, -0.161091, 0.486279, 0.243947, 0.670542, -0.171235, 0.487968, 0.262957, 0.677361, -0.181347, 0.49053, 0.282781, 0.685672, -0.191679, 0.493862, 0.303311, 0.694551, -0.201781, 0.49699, 0.324607, 0.703753, -0.211164, 0.498884, 0.347916, 0.713703, -0.219675, 0.500086, 0.372628, 0.725911, -0.227836, 0.501554, 0.398694, 0.73862, -0.23533, 0.502193, 0.425529, 0.752118, -0.241786, 0.501811, 0.453209, 0.76579, -0.247865, 0.500185, 0.481381, 0.779568, -0.252696, 0.497159, 0.51011, 0.793991, -0.256802, 0.492765, 0.539322, 0.808182, -0.259942, 0.486827, 0.569078, 0.821698, -0.261703, 0.478386, 0.598818, 0.836009, -0.262006, 0.468772, 0.629762, 0.849824, -0.260333, 0.456352, 0.661366, 0.863888, -0.257398, 0.442533, 0.69295, 0.876585, -0.253264, 0.426573, 0.723608, 0.888665, -0.248026, 0.408964, 0.754378, 0.899537, -0.241487, 0.389677, 0.784761, 0.9094, -0.233463, 0.368516, 0.814688, 0.920166, -0.223397, 0.346624, 0.845009, 0.928899, -0.21255, 0.322717, 0.874431, 0.937156, -0.200869, 0.298698, 0.902922, 0.943861, -0.188387, 0.273491, 0.931356, 0.949557, -0.174341, 0.247866, 0.958854, 0.955862, -0.158994, 0.222496, 0.986098, 0.961721, -0.143664, 0.197522, 1.01229, 0.965976, -0.127412, 0.17302, 1.03571, 0.968652, -0.109798, 0.148954, 1.05699, 0.971084, -0.0916787, 0.125044, 1.07587, 0.975584, -0.0739634, 0.100577, 1.09372, 0.98122, -0.055322, 0.0753666, 1.10948, 0.988253, -0.0366825, 0.0498899, 1.12394, 0.99482, -0.0180389, 0.024611, 1.13694, 1.00001, 0.000229839, -0.000188283, 1.14919, 0.613867, -9.64198e-6, 0.479449, 1.23452e-5, 0.621485, -0.000244534, 0.485399, 0.000313091, 0.621429, -0.000978202, 0.485353, 0.00125245, 0.62112, -0.00220004, 0.485114, 0.00281687, 0.621119, -0.0039111, 0.485112, 0.00500783, 0.621122, -0.00611091, 0.485112, 0.00782498, 0.621133, -0.00879922, 0.485117, 0.0112687, 0.621152, -0.0119756, 0.485125, 0.0153394, 0.621183, -0.0156396, 0.485139, 0.0200382, 0.621227, -0.0197898, 0.485158, 0.0253663, 0.621298, -0.0244253, 0.485192, 0.0313261, 0.621388, -0.0295441, 0.485233, 0.0379204, 0.621507, -0.0351432, 0.485286, 0.0451523, 0.621693, -0.0412198, 0.485378, 0.0530277, 0.621933, -0.0477673, 0.485495, 0.0615522, 0.622232, -0.0547574, 0.485635, 0.0707316, 0.622809, -0.0619417, 0.485943, 0.0805883, 0.623407, -0.069625, 0.486232, 0.0911267, 0.62406, -0.077796, 0.486516, 0.102354, 0.624835, -0.0863731, 0.486838, 0.114279, 0.625758, -0.095251, 0.487188, 0.126902, 0.627043, -0.104299, 0.487695, 0.140285, 0.628438, -0.113724, 0.488163, 0.154397, 0.630325, -0.123417, 0.488858, 0.169267, 0.632801, -0.133137, 0.489754, 0.184941, 0.635784, -0.143052, 0.490815, 0.20136, 0.639406, -0.153132, 0.492048, 0.218643, 0.643872, -0.163143, 0.49363, 0.236615, 0.6499, -0.17333, 0.496009, 0.255449, 0.657201, -0.183622, 0.498994, 0.275006, 0.666221, -0.194019, 0.502888, 0.295354, 0.674419, -0.204192, 0.505459, 0.316244, 0.683729, -0.21406, 0.507771, 0.33849, 0.695584, -0.222854, 0.510245, 0.363166, 0.708583, -0.231315, 0.512293, 0.389071, 0.721233, -0.238911, 0.512747, 0.415737, 0.735134, -0.245657, 0.512482, 0.443331, 0.750179, -0.251879, 0.511526, 0.471891, 0.765073, -0.256911, 0.508935, 0.500892, 0.779794, -0.261144, 0.504341, 0.530294, 0.794801, -0.264316, 0.498515, 0.560144, 0.810339, -0.266276, 0.491015, 0.590213, 0.824818, -0.266981, 0.481126, 0.620865, 0.839375, -0.265778, 0.468685, 0.652687, 0.853043, -0.262748, 0.453925, 0.684759, 0.867335, -0.258474, 0.437912, 0.716209, 0.88037, -0.253187, 0.419648, 0.747508, 0.891711, -0.246476, 0.39982, 0.77797, 0.902896, -0.238735, 0.37879, 0.808586, 0.913601, -0.22885, 0.355891, 0.838843, 0.923019, -0.217656, 0.331773, 0.869014, 0.933432, -0.205539, 0.307356, 0.898512, 0.939691, -0.192595, 0.281321, 0.9269, 0.946938, -0.178945, 0.255441, 0.955297, 0.952372, -0.163587, 0.229013, 0.983231, 0.95909, -0.147214, 0.203179, 1.00971, 0.963675, -0.13064, 0.17792, 1.03438, 0.968247, -0.113121, 0.152898, 1.05625, 0.97001, -0.0945824, 0.128712, 1.07598, 0.974458, -0.0755648, 0.103349, 1.094, 0.980168, -0.0571998, 0.0776731, 1.1104, 0.987295, -0.0377994, 0.0514445, 1.12491, 0.994432, -0.0186417, 0.025429, 1.13851, 0.999975, 0.000542714, -0.000282356, 1.15108, 0.592656, -9.80249e-6, 0.486018, 1.19532e-5, 0.598467, -0.000247275, 0.490781, 0.000301531, 0.597934, -0.000988317, 0.490343, 0.00120517, 0.597903, -0.00222366, 0.490319, 0.0027116, 0.597913, -0.00395315, 0.490327, 0.00482077, 0.597919, -0.00617653, 0.490329, 0.00753264, 0.597936, -0.00889375, 0.490339, 0.0108478, 0.597956, -0.0121043, 0.490347, 0.0147668, 0.597992, -0.0158073, 0.490365, 0.0192905, 0.598032, -0.0200017, 0.490382, 0.0244204, 0.598109, -0.0246865, 0.49042, 0.0301593, 0.598215, -0.0298594, 0.490474, 0.03651, 0.59833, -0.0355167, 0.490524, 0.0434757, 0.598525, -0.0416559, 0.490624, 0.0510629, 0.598778, -0.0482692, 0.490753, 0.0592781, 0.599135, -0.0553114, 0.49094, 0.0681304, 0.599802, -0.062542, 0.491328, 0.0776467, 0.600361, -0.0703638, 0.491598, 0.0878184, 0.60101, -0.0786256, 0.491882, 0.0986573, 0.601811, -0.0872962, 0.492232, 0.11018, 0.602861, -0.0962284, 0.492684, 0.1224, 0.604167, -0.10538, 0.493213, 0.135354, 0.605693, -0.114896, 0.493799, 0.149034, 0.607682, -0.124654, 0.494576, 0.163469, 0.610672, -0.13456, 0.4959, 0.178747, 0.613313, -0.144581, 0.496713, 0.194723, 0.617603, -0.154703, 0.498499, 0.211617, 0.622174, -0.16489, 0.500188, 0.229183, 0.628855, -0.175164, 0.503072, 0.247786, 0.636963, -0.185565, 0.506798, 0.267116, 0.644866, -0.195911, 0.509719, 0.28702, 0.653741, -0.206104, 0.512776, 0.307763, 0.664942, -0.216447, 0.516812, 0.329631, 0.67633, -0.22552, 0.519181, 0.353515, 0.690012, -0.234316, 0.521681, 0.379226, 0.704243, -0.242032, 0.523129, 0.405901, 0.719396, -0.249172, 0.523768, 0.433585, 0.734471, -0.255543, 0.522541, 0.462085, 0.750539, -0.260697, 0.520217, 0.491233, 0.766365, -0.26501, 0.516293, 0.521094, 0.781677, -0.268409, 0.509708, 0.551014, 0.797132, -0.270399, 0.501944, 0.581463, 0.812655, -0.271247, 0.492025, 0.612402, 0.828592, -0.270708, 0.480424, 0.643798, 0.844044, -0.268085, 0.465955, 0.67682, 0.857305, -0.263459, 0.448425, 0.708496, 0.87114, -0.258151, 0.430243, 0.74046, 0.884936, -0.251171, 0.410578, 0.771583, 0.895772, -0.243305, 0.38862, 0.802234, 0.906961, -0.234037, 0.365214, 0.833179, 0.917775, -0.222714, 0.34116, 0.86353, 0.927883, -0.210175, 0.31572, 0.893557, 0.936617, -0.196925, 0.289159, 0.922976, 0.943384, -0.182788, 0.261996, 0.951606, 0.949713, -0.167965, 0.235324, 0.979958, 0.955818, -0.151109, 0.208408, 1.00765, 0.961344, -0.133834, 0.182591, 1.03329, 0.965469, -0.115987, 0.156958, 1.0557, 0.968693, -0.09746, 0.132239, 1.07583, 0.973165, -0.0778514, 0.106195, 1.09451, 0.979387, -0.0585067, 0.0797669, 1.11137, 0.98671, -0.0390409, 0.0530263, 1.12643, 0.994093, -0.019408, 0.0263163, 1.14016, 1.00002, 0.000540029, -0.000194487, 1.15299, 0.574483, -9.89066e-6, 0.494533, 1.14896e-5, 0.574478, -0.000249127, 0.494528, 0.000289403, 0.574607, -0.000996811, 0.494637, 0.00115797, 0.574396, -0.00224241, 0.494458, 0.00260498, 0.574377, -0.00398632, 0.49444, 0.00463102, 0.574386, -0.00622836, 0.494445, 0.00723623, 0.574401, -0.0089683, 0.494453, 0.010421, 0.574419, -0.0122056, 0.49446, 0.0141859, 0.574459, -0.0159396, 0.494481, 0.0185322, 0.574525, -0.0201692, 0.49452, 0.0234617, 0.574587, -0.0248924, 0.494547, 0.0289762, 0.574697, -0.0301074, 0.494604, 0.0350797, 0.574853, -0.0358114, 0.494688, 0.0417767, 0.575027, -0.041999, 0.494772, 0.0490718, 0.575294, -0.0486618, 0.494915, 0.0569728, 0.575733, -0.0557148, 0.495173, 0.0654955, 0.576356, -0.0630489, 0.495537, 0.0746612, 0.576944, -0.0709285, 0.495836, 0.0844615, 0.57765, -0.0792723, 0.496177, 0.0949142, 0.578491, -0.0880167, 0.496563, 0.10603, 0.579639, -0.0969462, 0.497096, 0.117841, 0.580989, -0.10622, 0.497684, 0.130367, 0.582587, -0.115861, 0.498337, 0.143609, 0.584951, -0.125605, 0.499414, 0.157625, 0.587602, -0.135608, 0.500518, 0.172413, 0.59076, -0.145742, 0.501767, 0.187999, 0.594992, -0.155934, 0.503542, 0.20445, 0.600656, -0.166303, 0.506135, 0.221764, 0.607816, -0.176681, 0.509542, 0.24002, 0.61522, -0.187071, 0.51263, 0.258992, 0.623702, -0.197465, 0.516021, 0.278773, 0.634192, -0.207816, 0.520422, 0.299377, 0.644936, -0.218183, 0.524073, 0.320802, 0.657888, -0.2278, 0.528049, 0.34384, 0.670666, -0.236747, 0.52986, 0.36916, 0.685626, -0.24484, 0.531892, 0.395867, 0.701304, -0.252071, 0.532727, 0.423488, 0.717727, -0.258714, 0.532146, 0.452201, 0.733914, -0.264211, 0.529883, 0.481579, 0.750529, -0.26859, 0.5259, 0.511558, 0.76747, -0.272046, 0.51999, 0.542042, 0.785189, -0.274225, 0.513083, 0.572799, 0.800954, -0.275189, 0.502936, 0.603816, 0.816962, -0.274946, 0.490921, 0.635461, 0.83336, -0.272695, 0.47684, 0.6676, 0.848143, -0.268223, 0.459405, 0.70051, 0.861818, -0.262768, 0.440319, 0.732902, 0.876828, -0.255872, 0.420123, 0.765084, 0.889312, -0.247703, 0.398379, 0.796391, 0.900412, -0.238381, 0.374496, 0.827333, 0.912251, -0.227783, 0.349874, 0.858385, 0.921792, -0.214832, 0.323181, 0.888652, 0.931273, -0.200949, 0.296624, 0.917763, 0.940295, -0.186537, 0.269211, 0.947878, 0.946812, -0.171538, 0.241447, 0.977016, 0.953588, -0.155254, 0.213829, 1.00501, 0.958841, -0.137156, 0.186807, 1.03179, 0.963746, -0.118699, 0.160706, 1.05502, 0.966468, -0.0998358, 0.135504, 1.07568, 0.971178, -0.0805186, 0.109131, 1.09479, 0.97831, -0.0599348, 0.0818293, 1.1123, 0.985886, -0.0399661, 0.0545872, 1.12771, 0.994021, -0.0198682, 0.0269405, 1.14186, 1.00009, 0.000271022, -0.00012989, 1.15514, 0.538716, -9.90918e-6, 0.486732, 1.09675e-5, 0.550656, -0.000250642, 0.497518, 0.000277412, 0.55057, -0.00100265, 0.497441, 0.00110974, 0.550903, -0.00225672, 0.497733, 0.00249779, 0.550568, -0.00401046, 0.497438, 0.00443906, 0.550574, -0.00626613, 0.49744, 0.00693637, 0.550591, -0.0090226, 0.497449, 0.00998921, 0.550623, -0.0122795, 0.497469, 0.0135984, 0.550667, -0.0160361, 0.497495, 0.0177654, 0.550724, -0.0202908, 0.497526, 0.0224915, 0.550792, -0.0250421, 0.497557, 0.0277795, 0.550918, -0.0302878, 0.49763, 0.0336334, 0.551058, -0.0360241, 0.497701, 0.0400573, 0.551276, -0.0422473, 0.497824, 0.0470585, 0.551551, -0.0489441, 0.497977, 0.0546433, 0.552074, -0.0559596, 0.498312, 0.0628367, 0.552681, -0.0633978, 0.498679, 0.071646, 0.553324, -0.0713176, 0.499031, 0.0810746, 0.554011, -0.0797268, 0.499365, 0.091129, 0.55488, -0.0885238, 0.499779, 0.101837, 0.556171, -0.0974417, 0.500444, 0.113239, 0.557498, -0.106841, 0.501025, 0.125316, 0.559299, -0.116533, 0.501864, 0.138128, 0.561647, -0.126298, 0.502967, 0.151695, 0.564347, -0.136388, 0.504129, 0.16604, 0.567863, -0.146576, 0.505713, 0.181207, 0.572569, -0.156832, 0.507953, 0.197259, 0.578919, -0.167323, 0.511186, 0.214258, 0.585387, -0.177712, 0.514042, 0.232038, 0.593134, -0.188184, 0.517484, 0.250733, 0.603295, -0.198717, 0.522345, 0.270454, 0.613854, -0.209177, 0.526751, 0.290807, 0.626092, -0.219644, 0.531595, 0.312202, 0.637868, -0.229494, 0.534721, 0.334435, 0.652458, -0.238718, 0.538304, 0.359184, 0.666985, -0.247061, 0.539875, 0.385637, 0.683301, -0.254652, 0.541042, 0.41328, 0.69998, -0.261376, 0.540735, 0.441903, 0.717824, -0.267085, 0.539139, 0.471609, 0.734617, -0.271465, 0.534958, 0.501446, 0.753663, -0.27528, 0.53032, 0.532571, 0.770512, -0.277617, 0.522134, 0.563641, 0.787356, -0.278525, 0.51206, 0.595067, 0.806252, -0.278512, 0.50119, 0.627226, 0.822061, -0.277023, 0.486791, 0.659402, 0.838959, -0.273175, 0.470467, 0.692874, 0.85379, -0.267238, 0.450688, 0.725702, 0.868268, -0.260327, 0.429741, 0.75832, 0.881994, -0.251946, 0.407223, 0.790189, 0.893885, -0.242432, 0.383214, 0.821625, 0.905118, -0.231904, 0.357297, 0.853011, 0.916045, -0.219545, 0.330733, 0.883773, 0.927614, -0.205378, 0.303916, 0.914435, 0.936005, -0.190388, 0.275941, 0.944502, 0.944533, -0.1749, 0.247493, 0.974439, 0.950758, -0.158588, 0.218996, 1.00286, 0.957078, -0.141027, 0.191559, 1.0304, 0.962448, -0.121507, 0.164457, 1.05466, 0.964993, -0.102068, 0.138636, 1.0761, 0.970017, -0.0822598, 0.111861, 1.09541, 0.97661, -0.062033, 0.0843438, 1.11317, 0.985073, -0.0409832, 0.0558496, 1.12911, 0.993515, -0.020146, 0.0275331, 1.1438, 1.00006, 0.00027329, -0.000107883, 1.15736, 0.525324, -9.99341e-6, 0.498153, 1.05385e-5, 0.526513, -0.000251605, 0.499277, 0.000265329, 0.526517, -0.00100641, 0.499282, 0.0010613, 0.526588, -0.00226466, 0.499337, 0.00238823, 0.526539, -0.0040255, 0.499302, 0.00424535, 0.526547, -0.00628954, 0.499306, 0.00663364, 0.526561, -0.00905628, 0.499313, 0.00955337, 0.526593, -0.0123253, 0.499334, 0.0130054, 0.526642, -0.0160957, 0.499365, 0.0169911, 0.5267, -0.0203661, 0.499396, 0.0215122, 0.526792, -0.0251347, 0.499451, 0.0265718, 0.526904, -0.0303985, 0.499511, 0.0321732, 0.527079, -0.0361554, 0.499617, 0.0383231, 0.527285, -0.0423982, 0.499731, 0.045026, 0.527602, -0.0491121, 0.499924, 0.0522936, 0.528166, -0.0561127, 0.500306, 0.0601528, 0.52879, -0.0635988, 0.5007, 0.0686059, 0.529421, -0.071581, 0.501048, 0.0776518, 0.530144, -0.0799854, 0.501421, 0.0873148, 0.531062, -0.0888032, 0.501884, 0.0976084, 0.532374, -0.0977643, 0.50259, 0.108588, 0.533828, -0.107197, 0.50329, 0.120234, 0.53581, -0.116887, 0.504312, 0.132602, 0.538063, -0.126755, 0.505365, 0.145721, 0.5409, -0.136819, 0.506668, 0.159617, 0.544882, -0.147117, 0.508731, 0.174369, 0.550238, -0.157446, 0.511601, 0.190028, 0.556038, -0.167988, 0.514431, 0.206587, 0.563031, -0.178364, 0.517808, 0.224046, 0.571543, -0.189007, 0.521937, 0.242503, 0.582255, -0.199546, 0.527415, 0.261977, 0.59272, -0.210084, 0.531682, 0.282162, 0.605648, -0.220448, 0.537123, 0.303426, 0.61785, -0.230593, 0.540664, 0.325323, 0.632223, -0.240238, 0.544467, 0.348993, 0.648819, -0.24887, 0.547594, 0.375462, 0.665825, -0.256657, 0.54912, 0.403024, 0.683389, -0.263711, 0.549294, 0.431773, 0.701495, -0.269666, 0.547649, 0.461494, 0.719197, -0.274169, 0.543786, 0.491623, 0.737906, -0.278124, 0.538644, 0.522994, 0.756652, -0.280632, 0.531057, 0.554775, 0.775279, -0.281741, 0.521972, 0.586441, 0.792688, -0.281652, 0.509613, 0.618596, 0.811894, -0.280345, 0.496497, 0.651462, 0.827938, -0.277128, 0.47968, 0.684023, 0.844837, -0.271646, 0.460688, 0.718024, 0.859239, -0.264397, 0.438872, 0.751207, 0.874088, -0.256144, 0.41577, 0.784232, 0.887693, -0.246311, 0.391369, 0.816191, 0.899402, -0.235497, 0.365872, 0.847828, 0.910973, -0.223631, 0.338618, 0.87934, 0.92204, -0.209874, 0.310803, 0.910325, 0.930987, -0.194265, 0.281802, 0.940695, 0.94, -0.178125, 0.252836, 0.970958, 0.948018, -0.161479, 0.224239, 1.00078, 0.955141, -0.144038, 0.195857, 1.0288, 0.960513, -0.124915, 0.168487, 1.05371, 0.963964, -0.104284, 0.141495, 1.07596, 0.968713, -0.0838732, 0.114437, 1.09628, 0.975524, -0.0635579, 0.0863105, 1.11448, 0.98431, -0.042291, 0.0574774, 1.13069, 0.992916, -0.0209131, 0.0284343, 1.14568, 0.999926, 0.000743097, -0.000379265, 1.15955, 0.501042, -9.98428e-6, 0.498726, 1.00306e-5, 0.502992, -0.000252112, 0.500665, 0.000253283, 0.502417, -0.00100791, 0.500092, 0.00101259, 0.502965, -0.00226919, 0.500621, 0.00227978, 0.502318, -0.00403109, 0.499994, 0.00405011, 0.502333, -0.00629832, 0.500005, 0.00632868, 0.502362, -0.00906907, 0.500027, 0.00911446, 0.502369, -0.0123423, 0.500023, 0.0124078, 0.50243, -0.0161178, 0.500066, 0.016211, 0.502493, -0.0203937, 0.500103, 0.0205256, 0.502592, -0.0251684, 0.500166, 0.0253548, 0.502707, -0.0304389, 0.50023, 0.0307029, 0.502881, -0.0362015, 0.500335, 0.0365753, 0.503124, -0.0424507, 0.500488, 0.0429798, 0.503443, -0.0491582, 0.500686, 0.0499268, 0.504083, -0.0561476, 0.501155, 0.0574541, 0.504668, -0.0636846, 0.501524, 0.0655408, 0.505319, -0.0716834, 0.501904, 0.0742072, 0.50609, -0.0800925, 0.502321, 0.0834699, 0.507122, -0.0888425, 0.502896, 0.0933603, 0.508414, -0.097855, 0.503603, 0.10391, 0.509955, -0.107304, 0.504416, 0.115113, 0.512061, -0.116921, 0.505565, 0.127054, 0.514419, -0.12689, 0.506732, 0.139709, 0.517529, -0.136934, 0.508338, 0.153173, 0.522085, -0.147327, 0.510987, 0.167528, 0.526986, -0.157612, 0.513527, 0.182708, 0.533122, -0.168213, 0.516717, 0.198881, 0.540807, -0.178688, 0.520832, 0.215986, 0.550687, -0.189511, 0.52632, 0.234335, 0.560567, -0.199998, 0.531009, 0.253375, 0.571698, -0.210652, 0.535839, 0.273499, 0.584364, -0.220917, 0.541091, 0.294355, 0.599066, -0.23137, 0.546875, 0.316525, 0.614148, -0.241206, 0.551306, 0.339671, 0.631157, -0.250379, 0.555187, 0.36531, 0.647919, -0.258397, 0.556595, 0.392767, 0.666112, -0.265528, 0.556949, 0.421397, 0.686158, -0.271827, 0.556617, 0.451433, 0.704838, -0.27674, 0.552975, 0.482131, 0.723957, -0.280733, 0.547814, 0.513458, 0.74262, -0.283359, 0.53997, 0.545446, 0.762009, -0.284541, 0.530422, 0.57775, 0.781314, -0.284507, 0.518546, 0.610434, 0.799116, -0.283309, 0.504178, 0.643178, 0.817604, -0.280378, 0.48843, 0.676248, 0.83459, -0.275619, 0.469457, 0.709698, 0.850974, -0.26856, 0.447698, 0.744245, 0.866747, -0.260094, 0.424791, 0.777695, 0.881412, -0.249929, 0.399913, 0.810392, 0.8936, -0.239137, 0.37308, 0.842872, 0.905943, -0.226818, 0.345705, 0.874677, 0.916408, -0.213699, 0.31706, 0.906257, 0.927215, -0.198428, 0.288444, 0.936881, 0.935625, -0.181643, 0.258329, 0.96795, 0.944076, -0.164386, 0.228488, 0.998216, 0.951229, -0.146339, 0.199763, 1.02689, 0.958793, -0.127709, 0.172153, 1.0535, 0.963219, -0.107244, 0.144989, 1.07646, 0.967562, -0.0857764, 0.11685, 1.09675, 0.974866, -0.0645377, 0.0880571, 1.11576, 0.983353, -0.0431732, 0.0587352, 1.13227, 0.992503, -0.0218356, 0.0294181, 1.1478, 1.00003, 0.000605203, -0.000231013, 1.16207, 0.482935, -1.01177e-5, 0.504695, 9.68142e-6, 0.477554, -0.000251521, 0.499071, 0.000240676, 0.477904, -0.00100683, 0.499436, 0.00096342, 0.478368, -0.00226636, 0.499899, 0.0021687, 0.477977, -0.00402719, 0.499513, 0.00385384, 0.477993, -0.00629226, 0.499525, 0.0060221, 0.478011, -0.00906011, 0.499536, 0.00867289, 0.478051, -0.0123305, 0.499566, 0.0118074, 0.478089, -0.016102, 0.499587, 0.0154269, 0.478171, -0.0203736, 0.499645, 0.0195341, 0.478254, -0.025143, 0.499692, 0.0241318, 0.47839, -0.0304071, 0.499779, 0.0292247, 0.478588, -0.0361631, 0.499911, 0.0348196, 0.478812, -0.0424023, 0.500046, 0.0409231, 0.479208, -0.0490724, 0.500326, 0.047552, 0.479841, -0.0560722, 0.500805, 0.0547377, 0.480392, -0.0636125, 0.501152, 0.0624607, 0.481068, -0.0716134, 0.501561, 0.0707473, 0.481898, -0.0800062, 0.502054, 0.0796118, 0.483022, -0.0886568, 0.502728, 0.0890974, 0.484332, -0.0977553, 0.503479, 0.0992099, 0.486126, -0.107173, 0.504546, 0.10999, 0.488066, -0.11677, 0.50557, 0.121476, 0.490521, -0.126725, 0.506849, 0.133672, 0.494232, -0.136793, 0.50911, 0.146731, 0.498302, -0.147116, 0.511345, 0.160577, 0.503565, -0.157446, 0.514344, 0.175335, 0.510902, -0.168121, 0.518824, 0.191207, 0.519263, -0.178799, 0.523666, 0.208058, 0.528204, -0.189407, 0.528296, 0.225875, 0.538854, -0.200145, 0.533724, 0.244782, 0.551278, -0.210701, 0.539833, 0.264753, 0.565222, -0.221303, 0.546131, 0.285745, 0.579403, -0.231688, 0.551496, 0.307592, 0.595469, -0.241718, 0.556809, 0.330582, 0.610929, -0.250992, 0.559641, 0.354995, 0.629433, -0.259602, 0.562379, 0.382471, 0.648504, -0.267038, 0.563676, 0.411126, 0.66756, -0.273388, 0.562092, 0.440924, 0.689143, -0.278788, 0.560807, 0.472118, 0.709056, -0.282783, 0.555701, 0.503774, 0.729855, -0.285836, 0.548698, 0.536364, 0.748954, -0.287078, 0.538544, 0.56895, 0.768373, -0.287133, 0.526711, 0.601991, 0.78827, -0.285839, 0.512511, 0.635403, 0.807465, -0.283238, 0.496323, 0.668797, 0.825194, -0.27906, 0.477638, 0.702584, 0.842203, -0.272286, 0.456253, 0.736393, 0.857749, -0.263854, 0.432412, 0.77096, 0.874799, -0.253943, 0.407806, 0.80489, 0.887497, -0.24237, 0.38033, 0.83771, 0.89966, -0.230278, 0.352446, 0.870376, 0.911753, -0.21646, 0.323268, 0.902256, 0.923011, -0.202071, 0.294314, 0.933306, 0.932375, -0.185519, 0.264104, 0.965177, 0.940537, -0.167604, 0.234035, 0.996303, 0.948904, -0.149068, 0.20412, 1.0261, 0.955263, -0.129539, 0.175431, 1.05304, 0.960303, -0.109932, 0.148116, 1.07617, 0.965512, -0.0880572, 0.119693, 1.09742, 0.973466, -0.0660548, 0.0901619, 1.11721, 0.98284, -0.0439228, 0.0599875, 1.13436, 0.992216, -0.0219588, 0.0298975, 1.15006, 0.999946, 0.000119402, -2.08547e-5, 1.16471, 0.447827, -1.00414e-5, 0.491543, 9.14833e-6, 0.454778, -0.000251257, 0.499172, 0.00022891, 0.453519, -0.00100342, 0.497787, 0.000914184, 0.45357, -0.00225776, 0.497847, 0.00205701, 0.453578, -0.00401371, 0.497855, 0.00365705, 0.45357, -0.00627107, 0.497841, 0.00571453, 0.453598, -0.00902968, 0.497864, 0.00823019, 0.453627, -0.0122888, 0.497882, 0.0112049, 0.453684, -0.0160475, 0.497923, 0.0146405, 0.453764, -0.0203044, 0.49798, 0.0185394, 0.453866, -0.0250576, 0.498049, 0.0229054, 0.453996, -0.0303028, 0.49813, 0.0277424, 0.454196, -0.0360379, 0.498267, 0.0330587, 0.454457, -0.0422521, 0.498445, 0.0388613, 0.454926, -0.0488393, 0.498812, 0.0451767, 0.455525, -0.0558653, 0.499272, 0.0520153, 0.456074, -0.0633772, 0.499625, 0.0593754, 0.456752, -0.0713606, 0.500049, 0.0672751, 0.457648, -0.07971, 0.500615, 0.0757447, 0.458849, -0.0883032, 0.501399, 0.0848231, 0.46029, -0.0974095, 0.502293, 0.0945135, 0.462, -0.106729, 0.503301, 0.104848, 0.464121, -0.116354, 0.504533, 0.115884, 0.466889, -0.126214, 0.506172, 0.127652, 0.470744, -0.136324, 0.508667, 0.14024, 0.47488, -0.146595, 0.510995, 0.153673, 0.480845, -0.157027, 0.514832, 0.168053, 0.488262, -0.167658, 0.519506, 0.183508, 0.496547, -0.178343, 0.524347, 0.199948, 0.506254, -0.188916, 0.52983, 0.217503, 0.517961, -0.199975, 0.536357, 0.236272, 0.531484, -0.210624, 0.543641, 0.256096, 0.545496, -0.221227, 0.550048, 0.277085, 0.559497, -0.231568, 0.555076, 0.298615, 0.575752, -0.241698, 0.560541, 0.321547, 0.591999, -0.251172, 0.564156, 0.345602, 0.610654, -0.260178, 0.567607, 0.371851, 0.630484, -0.268094, 0.56923, 0.40076, 0.651807, -0.274661, 0.569779, 0.430801, 0.67239, -0.280331, 0.566791, 0.461939, 0.693024, -0.284501, 0.562007, 0.493854, 0.715473, -0.287852, 0.555791, 0.526992, 0.736323, -0.28929, 0.546345, 0.560102, 0.755771, -0.289405, 0.534, 0.593543, 0.775424, -0.2881, 0.519114, 0.627256, 0.795447, -0.285562, 0.502543, 0.661464, 0.815319, -0.281416, 0.484773, 0.695206, 0.831769, -0.275523, 0.463445, 0.729044, 0.849464, -0.267516, 0.440269, 0.764069, 0.866775, -0.257584, 0.415049, 0.799089, 0.881252, -0.245817, 0.388049, 0.831948, 0.894209, -0.233127, 0.35889, 0.865526, 0.906922, -0.219579, 0.329915, 0.89818, 0.919686, -0.204491, 0.300441, 0.930013, 0.929044, -0.188962, 0.269445, 0.962061, 0.938393, -0.171079, 0.238402, 0.994214, 0.94661, -0.15199, 0.208204, 1.02533, 0.953095, -0.131953, 0.178653, 1.0529, 0.958644, -0.111233, 0.150684, 1.0771, 0.963925, -0.0903098, 0.122359, 1.09855, 0.971995, -0.0680505, 0.0923342, 1.11874, 0.981658, -0.0448512, 0.0614195, 1.13635, 0.991649, -0.0221931, 0.0303582, 1.15238, 0.999985, 0.000393403, -0.000111086, 1.16772, 0.396806, -9.71563e-6, 0.457671, 8.42355e-6, 0.429186, -0.000249421, 0.495017, 0.00021625, 0.429324, -0.000998052, 0.495173, 0.000865322, 0.429175, -0.00224487, 0.494999, 0.00194637, 0.429129, -0.00399041, 0.494952, 0.00346004, 0.429153, -0.00623476, 0.494974, 0.00540684, 0.429168, -0.0089773, 0.494983, 0.00778714, 0.429207, -0.0122175, 0.495012, 0.0106022, 0.429257, -0.0159542, 0.495047, 0.0138535, 0.429338, -0.0201864, 0.495106, 0.0175443, 0.429431, -0.0249104, 0.495165, 0.0216774, 0.429587, -0.0301252, 0.495279, 0.0262594, 0.429796, -0.0358249, 0.495432, 0.0312968, 0.430065, -0.0419972, 0.495621, 0.0367985, 0.430588, -0.0485144, 0.496061, 0.042798, 0.43113, -0.0555028, 0.496472, 0.0492914, 0.431743, -0.0629852, 0.496904, 0.0562907, 0.432448, -0.0709256, 0.497369, 0.0638056, 0.433414, -0.0791942, 0.498032, 0.071885, 0.434638, -0.0877346, 0.498854, 0.0805517, 0.43611, -0.0968056, 0.499812, 0.0898047, 0.437859, -0.106002, 0.500891, 0.0997142, 0.440017, -0.115648, 0.502198, 0.110289, 0.443236, -0.125427, 0.504389, 0.121644, 0.44697, -0.135492, 0.506809, 0.133769, 0.451689, -0.145746, 0.509858, 0.146787, 0.45811, -0.156219, 0.514247, 0.160793, 0.465305, -0.166834, 0.518816, 0.175791, 0.474085, -0.177546, 0.524331, 0.191906, 0.484808, -0.188262, 0.53104, 0.209199, 0.49732, -0.199346, 0.538511, 0.227825, 0.509693, -0.209951, 0.544554, 0.247269, 0.524367, -0.220533, 0.551616, 0.267978, 0.539228, -0.231082, 0.557368, 0.289672, 0.55644, -0.241342, 0.563782, 0.31268, 0.574204, -0.250964, 0.568851, 0.33651, 0.593388, -0.260306, 0.57312, 0.362219, 0.613358, -0.268667, 0.574916, 0.390322, 0.634512, -0.275591, 0.575053, 0.420478, 0.65563, -0.281328, 0.572404, 0.451614, 0.678265, -0.285948, 0.568893, 0.484112, 0.70011, -0.289408, 0.561878, 0.517348, 0.723005, -0.291328, 0.55359, 0.551355, 0.743744, -0.291418, 0.541099, 0.585109, 0.763949, -0.290252, 0.526489, 0.619487, 0.784186, -0.287648, 0.509496, 0.65404, 0.804304, -0.283782, 0.491484, 0.688649, 0.823629, -0.278067, 0.470517, 0.723133, 0.84094, -0.270588, 0.44705, 0.757163, 0.857852, -0.261188, 0.421252, 0.792816, 0.874934, -0.249313, 0.394191, 0.827248, 0.888709, -0.236492, 0.365359, 0.861074, 0.902589, -0.222185, 0.336016, 0.894417, 0.914201, -0.207314, 0.30527, 0.926825, 0.925978, -0.191146, 0.274532, 0.9595, 0.93512, -0.174135, 0.243393, 0.991583, 0.943656, -0.155231, 0.212414, 1.02356, 0.951719, -0.134403, 0.182005, 1.05239, 0.957164, -0.113023, 0.153043, 1.07754, 0.962656, -0.0914493, 0.124186, 1.09984, 0.970695, -0.0694179, 0.0941654, 1.12, 0.980749, -0.0466199, 0.0629671, 1.13849, 0.991205, -0.0227032, 0.0311146, 1.15494, 0.999884, 0.000632388, -0.000254483, 1.1706, 0.379821, -9.57289e-6, 0.460637, 7.89337e-6, 0.405188, -0.000247483, 0.491396, 0.000204064, 0.404796, -0.000989434, 0.490914, 0.000815853, 0.40483, -0.00222607, 0.490949, 0.00183559, 0.40473, -0.00395723, 0.49084, 0.00326332, 0.404731, -0.00618287, 0.490836, 0.00509945, 0.404768, -0.00890258, 0.490871, 0.00734463, 0.404791, -0.0121156, 0.490883, 0.00999992, 0.404857, -0.0158214, 0.490938, 0.0130676, 0.404943, -0.0200178, 0.491004, 0.0165503, 0.405059, -0.0247027, 0.491093, 0.0204521, 0.405213, -0.0298729, 0.491205, 0.0247788, 0.405399, -0.0355226, 0.491333, 0.0295373, 0.405731, -0.0416352, 0.491604, 0.034741, 0.406303, -0.0480807, 0.492116, 0.0404255, 0.406814, -0.0550458, 0.492506, 0.0465732, 0.407404, -0.0624652, 0.492926, 0.0532058, 0.408149, -0.0702958, 0.493442, 0.0603442, 0.409128, -0.0784623, 0.494136, 0.0680297, 0.410408, -0.087007, 0.495054, 0.0762786, 0.411813, -0.0959639, 0.495962, 0.0851046, 0.413735, -0.105075, 0.497257, 0.0945878, 0.416137, -0.114646, 0.498882, 0.104725, 0.41934, -0.124394, 0.501132, 0.11563, 0.423326, -0.134328, 0.503883, 0.127325, 0.428419, -0.14458, 0.50747, 0.139911, 0.43484, -0.154979, 0.511964, 0.153481, 0.442641, -0.165628, 0.517328, 0.168114, 0.452511, -0.176365, 0.524258, 0.183995, 0.463473, -0.187298, 0.531248, 0.200953, 0.475564, -0.198244, 0.538367, 0.219176, 0.488664, -0.208938, 0.545175, 0.238514, 0.504073, -0.219599, 0.553227, 0.259129, 0.520832, -0.230378, 0.560653, 0.280997, 0.538455, -0.240703, 0.567523, 0.303821, 0.55709, -0.250548, 0.573287, 0.327948, 0.576646, -0.259964, 0.577795, 0.353362, 0.596705, -0.268721, 0.580077, 0.380336, 0.618053, -0.276054, 0.58018, 0.4101, 0.640303, -0.282176, 0.578747, 0.44161, 0.662365, -0.286931, 0.574294, 0.474106, 0.684542, -0.290521, 0.567035, 0.507549, 0.707984, -0.292672, 0.558687, 0.541853, 0.730913, -0.293189, 0.547606, 0.576581, 0.752948, -0.292199, 0.533471, 0.61172, 0.773452, -0.289508, 0.516395, 0.646339, 0.794715, -0.285716, 0.497873, 0.682131, 0.814251, -0.280051, 0.476845, 0.716396, 0.833057, -0.272873, 0.453449, 0.751503, 0.84959, -0.263982, 0.427857, 0.786085, 0.867022, -0.252745, 0.400335, 0.821355, 0.882277, -0.239655, 0.371304, 0.85646, 0.895375, -0.225386, 0.340397, 0.890828, 0.909347, -0.209587, 0.310005, 0.923532, 0.921885, -0.193433, 0.2796, 0.956419, 0.932127, -0.176135, 0.247276, 0.989445, 0.941869, -0.157872, 0.216186, 1.02221, 0.949735, -0.137577, 0.185602, 1.05195, 0.956617, -0.115285, 0.155767, 1.07822, 0.961974, -0.0928418, 0.126103, 1.10149, 0.96972, -0.0700592, 0.0956758, 1.12207, 0.98012, -0.0474671, 0.0643269, 1.1408, 0.990825, -0.0238113, 0.0320863, 1.1577, 0.999876, 0.000381574, -8.12203e-5, 1.17403, 0.367636, -9.61342e-6, 0.469176, 7.53287e-6, 0.380377, -0.000244772, 0.485434, 0.000191797, 0.380416, -0.000978857, 0.485475, 0.000767015, 0.380376, -0.00220165, 0.485435, 0.00172522, 0.380419, -0.00391408, 0.485487, 0.00306734, 0.380438, -0.00611549, 0.485505, 0.00479332, 0.380462, -0.00880558, 0.485525, 0.00690391, 0.380496, -0.0119837, 0.485551, 0.00940039, 0.38056, -0.0156487, 0.485605, 0.0122848, 0.38064, -0.0197988, 0.485666, 0.0155601, 0.380767, -0.0244324, 0.48577, 0.0192313, 0.380909, -0.0295444, 0.485871, 0.0233032, 0.381142, -0.0351321, 0.48606, 0.0277861, 0.381472, -0.0411535, 0.486336, 0.0326939, 0.382015, -0.0475408, 0.486833, 0.0380565, 0.382523, -0.0544395, 0.487231, 0.0438615, 0.383129, -0.061784, 0.487683, 0.0501332, 0.383952, -0.0695085, 0.488313, 0.0568996, 0.38498, -0.0775819, 0.489077, 0.0641952, 0.386331, -0.0860443, 0.490113, 0.0720324, 0.387788, -0.0948406, 0.491099, 0.0804379, 0.389808, -0.103899, 0.492566, 0.0894899, 0.39252, -0.113313, 0.494601, 0.0992098, 0.395493, -0.123007, 0.496619, 0.109641, 0.399826, -0.132859, 0.499912, 0.120919, 0.405341, -0.143077, 0.504061, 0.133107, 0.411932, -0.153465, 0.508905, 0.146263, 0.420591, -0.164108, 0.515482, 0.160544, 0.43101, -0.174893, 0.523191, 0.176123, 0.441881, -0.185839, 0.53026, 0.192757, 0.453919, -0.196633, 0.537295, 0.210535, 0.468715, -0.207611, 0.546156, 0.229886, 0.485182, -0.218517, 0.555173, 0.250543, 0.501926, -0.229249, 0.562728, 0.27221, 0.51785, -0.239481, 0.567494, 0.294892, 0.536947, -0.249395, 0.573889, 0.318987, 0.557115, -0.259, 0.578831, 0.344348, 0.577966, -0.268075, 0.582055, 0.371223, 0.599489, -0.276115, 0.583307, 0.399834, 0.62479, -0.282523, 0.583902, 0.431415, 0.647504, -0.287663, 0.57953, 0.464301, 0.670601, -0.291538, 0.573103, 0.498123, 0.693539, -0.293842, 0.563731, 0.532662, 0.717385, -0.294681, 0.553169, 0.567925, 0.741533, -0.293717, 0.539908, 0.603502, 0.762142, -0.291156, 0.521902, 0.639074, 0.783014, -0.28719, 0.502815, 0.674439, 0.805158, -0.281773, 0.482598, 0.710497, 0.823646, -0.274682, 0.458949, 0.7456, 0.841879, -0.266184, 0.433129, 0.781085, 0.859515, -0.255682, 0.406064, 0.816, 0.875335, -0.242849, 0.376509, 0.851074, 0.890147, -0.228329, 0.345502, 0.886473, 0.903144, -0.212491, 0.31428, 0.920751, 0.916618, -0.195695, 0.282994, 0.954606, 0.927953, -0.178267, 0.251091, 0.988402, 0.937414, -0.159549, 0.219107, 1.02141, 0.946823, -0.140022, 0.18896, 1.05167, 0.954651, -0.118154, 0.158667, 1.07819, 0.959955, -0.0946636, 0.128808, 1.1025, 0.96858, -0.0711792, 0.0973787, 1.12391, 0.97938, -0.0475046, 0.0650965, 1.14322, 0.990498, -0.024059, 0.0326267, 1.16077, 0.999844, -5.12408e-5, 0.000112444, 1.17727, 0.316912, -9.34977e-6, 0.425996, 6.95559e-6, 0.356423, -0.000241372, 0.479108, 0.000179562, 0.356272, -0.000965292, 0.478897, 0.00071811, 0.356262, -0.00217182, 0.478894, 0.00161574, 0.356265, -0.00386092, 0.478895, 0.00287261, 0.356278, -0.0060324, 0.478905, 0.00448907, 0.356293, -0.00868565, 0.478914, 0.00646572, 0.356346, -0.0118207, 0.478965, 0.00880438, 0.356395, -0.0154355, 0.479001, 0.0115066, 0.356484, -0.019529, 0.479075, 0.0145762, 0.356609, -0.0240991, 0.47918, 0.018018, 0.356766, -0.0291413, 0.479305, 0.0218379, 0.357009, -0.0346498, 0.479512, 0.0260454, 0.357424, -0.0405462, 0.479909, 0.0306657, 0.357899, -0.0468825, 0.480337, 0.0357054, 0.358424, -0.0536887, 0.480771, 0.0411728, 0.359041, -0.0609416, 0.481242, 0.0470841, 0.359903, -0.0685239, 0.481943, 0.0534831, 0.360932, -0.0764883, 0.482741, 0.0603795, 0.362196, -0.0848364, 0.483688, 0.0678028, 0.363847, -0.0935002, 0.484947, 0.0758086, 0.365972, -0.102471, 0.486588, 0.0844173, 0.368741, -0.111751, 0.488787, 0.0937199, 0.372146, -0.121334, 0.491405, 0.103732, 0.377114, -0.131147, 0.495604, 0.114608, 0.38226, -0.141213, 0.499436, 0.126345, 0.389609, -0.151632, 0.505334, 0.139116, 0.397925, -0.162073, 0.51168, 0.152995, 0.407824, -0.172819, 0.518876, 0.168071, 0.420014, -0.183929, 0.527639, 0.184495, 0.434266, -0.195032, 0.537588, 0.20232, 0.447352, -0.205792, 0.544379, 0.221189, 0.463726, -0.216704, 0.553422, 0.241616, 0.481406, -0.227531, 0.562074, 0.263298, 0.498707, -0.238017, 0.568227, 0.286116, 0.518039, -0.247936, 0.574473, 0.3101, 0.538277, -0.257437, 0.579191, 0.335401, 0.561166, -0.266829, 0.584807, 0.362246, 0.583189, -0.275329, 0.586476, 0.390609, 0.606024, -0.28234, 0.585578, 0.420998, 0.632419, -0.287924, 0.584496, 0.454357, 0.656128, -0.291972, 0.577766, 0.488233, 0.679953, -0.29456, 0.56875, 0.523248, 0.704654, -0.295816, 0.558388, 0.559168, 0.729016, -0.295157, 0.544826, 0.595326, 0.752062, -0.292779, 0.528273, 0.631864, 0.773138, -0.288681, 0.508482, 0.667793, 0.794869, -0.283358, 0.487341, 0.704035, 0.815101, -0.27608, 0.46354, 0.739925, 0.834212, -0.26767, 0.438672, 0.775539, 0.852368, -0.257397, 0.411239, 0.810895, 0.870207, -0.245689, 0.3829, 0.846472, 0.884063, -0.231452, 0.351496, 0.881788, 0.898284, -0.215561, 0.31895, 0.917438, 0.912964, -0.198208, 0.287367, 0.952422, 0.924666, -0.180426, 0.254487, 0.987551, 0.934429, -0.161525, 0.222226, 1.02142, 0.943485, -0.141197, 0.191143, 1.05218, 0.9521, -0.120085, 0.161112, 1.07937, 0.957876, -0.0975881, 0.130982, 1.10403, 0.966943, -0.0726842, 0.0990553, 1.12616, 0.978313, -0.0483705, 0.0662818, 1.14619, 0.990048, -0.0239072, 0.0329243, 1.16413, 0.999984, 0.000461885, -7.72859e-5, 1.18099, 0.321287, -9.35049e-6, 0.455413, 6.59662e-6, 0.332595, -0.000237513, 0.471437, 0.000167562, 0.332729, -0.000949964, 0.471618, 0.000670192, 0.332305, -0.00213618, 0.471028, 0.00150712, 0.332326, -0.00379765, 0.471055, 0.00267959, 0.332344, -0.00593353, 0.471072, 0.00418751, 0.332356, -0.00854349, 0.471077, 0.00603172, 0.332403, -0.0116268, 0.471121, 0.00821362, 0.332461, -0.0151824, 0.47117, 0.0107357, 0.332552, -0.0192088, 0.471251, 0.0136014, 0.332657, -0.0237024, 0.47133, 0.0168152, 0.332835, -0.0286615, 0.471487, 0.0203853, 0.333083, -0.0340765, 0.471708, 0.0243212, 0.333547, -0.0398563, 0.47219, 0.0286518, 0.333989, -0.0460916, 0.472587, 0.0333763, 0.334532, -0.0527897, 0.473054, 0.0385084, 0.335167, -0.0599284, 0.473568, 0.0440638, 0.33608, -0.0673514, 0.474362, 0.0500962, 0.337146, -0.0752237, 0.475231, 0.0566022, 0.338462, -0.083418, 0.476282, 0.0636272, 0.34014, -0.0919382, 0.477615, 0.0712153, 0.342341, -0.100741, 0.479404, 0.079417, 0.345088, -0.109905, 0.481618, 0.0882631, 0.349049, -0.119369, 0.485081, 0.0978851, 0.353939, -0.129033, 0.489317, 0.108336, 0.359893, -0.139038, 0.494309, 0.119698, 0.366945, -0.149411, 0.499983, 0.132024, 0.375814, -0.159843, 0.507185, 0.145558, 0.387112, -0.170664, 0.516392, 0.160433, 0.40023, -0.181897, 0.526519, 0.176648, 0.412555, -0.192785, 0.53423, 0.193922, 0.427023, -0.203663, 0.542741, 0.212662, 0.443685, -0.214695, 0.552066, 0.232944, 0.461499, -0.225561, 0.560762, 0.254495, 0.480975, -0.236257, 0.569421, 0.277531, 0.501, -0.24639, 0.576101, 0.301724, 0.521691, -0.256101, 0.581493, 0.327112, 0.543478, -0.265289, 0.585221, 0.353917, 0.566094, -0.273938, 0.587614, 0.381941, 0.589578, -0.281679, 0.587991, 0.41172, 0.614583, -0.287655, 0.585928, 0.444148, 0.641813, -0.292228, 0.582092, 0.478617, 0.666189, -0.295172, 0.57398, 0.51397, 0.690475, -0.29648, 0.561676, 0.550118, 0.715543, -0.296203, 0.548758, 0.586933, 0.740405, -0.293999, 0.532792, 0.62384, 0.762183, -0.28998, 0.512735, 0.660723, 0.786069, -0.28478, 0.492402, 0.69807, 0.806812, -0.277568, 0.469058, 0.734422, 0.826987, -0.268951, 0.443017, 0.770946, 0.844588, -0.259049, 0.415501, 0.80699, 0.863725, -0.2471, 0.387328, 0.842107, 0.879137, -0.234157, 0.356108, 0.878078, 0.894634, -0.218719, 0.324315, 0.914058, 0.909162, -0.201293, 0.291813, 0.949922, 0.92072, -0.18267, 0.258474, 0.985337, 0.93158, -0.163212, 0.225593, 1.0205, 0.941238, -0.142771, 0.193986, 1.05273, 0.949293, -0.120956, 0.163392, 1.08075, 0.956226, -0.0985743, 0.132934, 1.10559, 0.96546, -0.075118, 0.101255, 1.12823, 0.977403, -0.0497921, 0.0675441, 1.149, 0.989648, -0.0241574, 0.0334681, 1.16765, 1.00001, 0.0005762, -0.000184807, 1.18519, 0.303474, -9.16603e-6, 0.4542, 6.1243e-6, 0.308894, -0.000232869, 0.462306, 0.000155592, 0.309426, -0.000931661, 0.463093, 0.000622499, 0.308643, -0.0020949, 0.461933, 0.00139979, 0.308651, -0.0037242, 0.461941, 0.00248874, 0.308662, -0.00581873, 0.46195, 0.00388933, 0.308687, -0.00837818, 0.461974, 0.00560247, 0.308728, -0.0114016, 0.462011, 0.00762948, 0.308789, -0.0148884, 0.462067, 0.00997326, 0.308882, -0.0188369, 0.462151, 0.0126375, 0.309007, -0.0232436, 0.462263, 0.0156271, 0.30918, -0.0281054, 0.462417, 0.0189498, 0.309442, -0.0334065, 0.462667, 0.0226167, 0.309901, -0.0390589, 0.463162, 0.0266614, 0.310331, -0.0452042, 0.463555, 0.0310715, 0.310858, -0.0517735, 0.464019, 0.0358698, 0.311576, -0.0587359, 0.464669, 0.0410848, 0.312436, -0.0660383, 0.465406, 0.0467453, 0.313526, -0.0737266, 0.466339, 0.0528718, 0.314903, -0.0817574, 0.467504, 0.0595039, 0.316814, -0.090167, 0.469226, 0.0666888, 0.318965, -0.0987555, 0.470981, 0.0744658, 0.322077, -0.107792, 0.473814, 0.082912, 0.325947, -0.117098, 0.477241, 0.0920846, 0.331008, -0.126602, 0.48184, 0.102137, 0.337893, -0.136619, 0.488334, 0.113135, 0.345106, -0.146838, 0.494415, 0.12511, 0.355111, -0.157357, 0.503275, 0.138356, 0.365095, -0.167955, 0.510966, 0.152686, 0.378344, -0.179157, 0.521508, 0.16856, 0.391599, -0.190143, 0.530455, 0.18561, 0.407786, -0.20123, 0.541275, 0.204308, 0.425294, -0.212456, 0.551784, 0.224623, 0.444021, -0.223568, 0.561493, 0.246172, 0.463418, -0.234154, 0.569886, 0.268979, 0.484077, -0.244546, 0.577116, 0.293411, 0.505513, -0.254301, 0.582914, 0.318936, 0.527672, -0.263564, 0.587208, 0.345856, 0.550565, -0.272332, 0.589277, 0.374054, 0.573656, -0.280011, 0.588426, 0.403276, 0.59827, -0.286924, 0.587504, 0.43474, 0.624731, -0.291994, 0.583401, 0.468767, 0.652396, -0.295159, 0.576997, 0.504411, 0.67732, -0.296954, 0.565863, 0.54114, 0.703147, -0.296877, 0.552316, 0.57816, 0.728715, -0.295147, 0.536773, 0.616124, 0.752448, -0.291275, 0.51771, 0.653885, 0.775169, -0.285905, 0.496087, 0.691537, 0.799307, -0.279064, 0.474232, 0.729251, 0.819482, -0.270294, 0.447676, 0.766267, 0.837659, -0.260032, 0.419656, 0.802616, 0.856903, -0.248497, 0.391328, 0.838583, 0.873325, -0.235252, 0.360285, 0.874711, 0.889788, -0.221126, 0.329215, 0.91077, 0.904486, -0.204304, 0.296392, 0.94653, 0.917711, -0.185562, 0.262159, 0.983828, 0.928969, -0.165635, 0.229142, 1.01955, 0.939707, -0.14442, 0.19673, 1.05317, 0.948167, -0.122147, 0.165095, 1.0823, 0.955222, -0.099098, 0.13451, 1.10791, 0.964401, -0.0755332, 0.102476, 1.1312, 0.976605, -0.0513817, 0.0689667, 1.15218, 0.989085, -0.0258499, 0.034506, 1.17129, 0.999908, 0.000617773, -0.000271268, 1.18961, 0.285803, -9.05752e-6, 0.452348, 5.72272e-6, 0.284689, -0.00022732, 0.450581, 0.000143626, 0.285263, -0.000910214, 0.451482, 0.000575099, 0.285302, -0.00204784, 0.451553, 0.00129395, 0.285318, -0.00364057, 0.451574, 0.0023006, 0.28533, -0.00568813, 0.451585, 0.00359547, 0.285361, -0.00819001, 0.451618, 0.00517934, 0.285397, -0.0111458, 0.45165, 0.007054, 0.285447, -0.0145536, 0.451688, 0.00922167, 0.285527, -0.0184127, 0.451758, 0.0116869, 0.285688, -0.0227207, 0.451929, 0.0144555, 0.28584, -0.0274712, 0.452055, 0.0175341, 0.286136, -0.0326278, 0.452369, 0.0209406, 0.286574, -0.0381792, 0.452853, 0.0246965, 0.287012, -0.0441879, 0.453272, 0.0287996, 0.287542, -0.0506096, 0.453752, 0.033268, 0.288299, -0.0573634, 0.454488, 0.0381504, 0.289186, -0.0645458, 0.455294, 0.0434447, 0.290302, -0.0720405, 0.456301, 0.0491973, 0.291776, -0.0799046, 0.457648, 0.0554453, 0.29372, -0.088117, 0.459483, 0.0622311, 0.296052, -0.0965328, 0.461571, 0.0695992, 0.299563, -0.105409, 0.465085, 0.077658, 0.30335, -0.114553, 0.468506, 0.0864176, 0.309167, -0.123917, 0.474423, 0.0961078, 0.31529, -0.13381, 0.47995, 0.106643, 0.324163, -0.144021, 0.488592, 0.118322, 0.333272, -0.154382, 0.496461, 0.131133, 0.344224, -0.165015, 0.50562, 0.145208, 0.357733, -0.176168, 0.516719, 0.16073, 0.373046, -0.187468, 0.528513, 0.177807, 0.38788, -0.198488, 0.537713, 0.196072, 0.405133, -0.209545, 0.547999, 0.21605, 0.423845, -0.220724, 0.55759, 0.237484, 0.443777, -0.231518, 0.566246, 0.26039, 0.464824, -0.242035, 0.574326, 0.284835, 0.486635, -0.251898, 0.58037, 0.310518, 0.51012, -0.261304, 0.58568, 0.337678, 0.535301, -0.270384, 0.590197, 0.366242, 0.559193, -0.27841, 0.590569, 0.395873, 0.583544, -0.285325, 0.588161, 0.426857, 0.608834, -0.291113, 0.584249, 0.459477, 0.635753, -0.294882, 0.57763, 0.494734, 0.664367, -0.297088, 0.569479, 0.532023, 0.689688, -0.297364, 0.555064, 0.569629, 0.715732, -0.295949, 0.539522, 0.608124, 0.741307, -0.292259, 0.521613, 0.646231, 0.764949, -0.287063, 0.49969, 0.684938, 0.788599, -0.28012, 0.476747, 0.723548, 0.81048, -0.27153, 0.45116, 0.761135, 0.831372, -0.261289, 0.424101, 0.798916, 0.850092, -0.249559, 0.39443, 0.835952, 0.867777, -0.236348, 0.363849, 0.871606, 0.884632, -0.221569, 0.332477, 0.907843, 0.90047, -0.20618, 0.300667, 0.944187, 0.914524, -0.188771, 0.266552, 0.981371, 0.926892, -0.168362, 0.232349, 1.01841, 0.937951, -0.146761, 0.199359, 1.05308, 0.947236, -0.123813, 0.1675, 1.0839, 0.954367, -0.099984, 0.136166, 1.11047, 0.963907, -0.0759278, 0.103808, 1.13414, 0.976218, -0.0511367, 0.0697061, 1.15575, 0.988772, -0.0267415, 0.0352529, 1.17531, 0.999888, -0.000520778, 0.000289926, 1.19389, 0.263546, -8.83274e-6, 0.441896, 5.26783e-6, 0.262352, -0.000221849, 0.439889, 0.000132311, 0.262325, -0.000886683, 0.439848, 0.000528824, 0.26228, -0.00199476, 0.439765, 0.00118975, 0.262372, -0.00354671, 0.439922, 0.00211568, 0.26239, -0.00554141, 0.439941, 0.00330652, 0.262412, -0.00797888, 0.439961, 0.00476346, 0.262453, -0.0108584, 0.440002, 0.00648818, 0.262528, -0.0141788, 0.440085, 0.0084835, 0.262615, -0.017938, 0.440166, 0.0107533, 0.262744, -0.0221346, 0.440291, 0.0133044, 0.262939, -0.026762, 0.440493, 0.0161445, 0.263277, -0.0317573, 0.440889, 0.0192974, 0.26368, -0.0371832, 0.441338, 0.0227699, 0.264106, -0.0430371, 0.441753, 0.0265698, 0.264624, -0.0493035, 0.442227, 0.0307178, 0.265378, -0.0558669, 0.442985, 0.0352616, 0.266253, -0.0628718, 0.443795, 0.0401968, 0.267478, -0.0701569, 0.445008, 0.04559, 0.269062, -0.077845, 0.446599, 0.0514539, 0.270926, -0.0857941, 0.448349, 0.0578382, 0.273693, -0.0940773, 0.451221, 0.0648363, 0.276746, -0.102704, 0.454097, 0.0724389, 0.281693, -0.111735, 0.459517, 0.0808744, 0.287335, -0.121004, 0.46531, 0.0901551, 0.29448, -0.130734, 0.472605, 0.100371, 0.30257, -0.140777, 0.480251, 0.111644, 0.312465, -0.15111, 0.489444, 0.124111, 0.324856, -0.16189, 0.500919, 0.137979, 0.33774, -0.172946, 0.511317, 0.153163, 0.35255, -0.184152, 0.522684, 0.169817, 0.367786, -0.19522, 0.53248, 0.187886, 0.385474, -0.20632, 0.543326, 0.207634, 0.404976, -0.217744, 0.554109, 0.229165, 0.425203, -0.228691, 0.563395, 0.252068, 0.446704, -0.239299, 0.571565, 0.276471, 0.468951, -0.249348, 0.577935, 0.302323, 0.493487, -0.258933, 0.584309, 0.329882, 0.517861, -0.268009, 0.58773, 0.358525, 0.543309, -0.276238, 0.589612, 0.388585, 0.569704, -0.28356, 0.589294, 0.419787, 0.594871, -0.289497, 0.585137, 0.452114, 0.622555, -0.294452, 0.580356, 0.486466, 0.651167, -0.296918, 0.57185, 0.523079, 0.677332, -0.297647, 0.558428, 0.5611, 0.703718, -0.296321, 0.542232, 0.599592, 0.730262, -0.293339, 0.524541, 0.639138, 0.754304, -0.288036, 0.502691, 0.677978, 0.778051, -0.281018, 0.479212, 0.716537, 0.801557, -0.272414, 0.454071, 0.75586, 0.822559, -0.262419, 0.425952, 0.794477, 0.843051, -0.250702, 0.397313, 0.832664, 0.86232, -0.237264, 0.366534, 0.869876, 0.879044, -0.222716, 0.334816, 0.906973, 0.896362, -0.206827, 0.303143, 0.943558, 0.910342, -0.189659, 0.269699, 0.979759, 0.924119, -0.171108, 0.236411, 1.01718, 0.935374, -0.149579, 0.202224, 1.05289, 0.944295, -0.126295, 0.16989, 1.08496, 0.952227, -0.101511, 0.138089, 1.11256, 0.962041, -0.0766392, 0.105053, 1.1375, 0.97528, -0.0511967, 0.070329, 1.15983, 0.988476, -0.025463, 0.0351268, 1.17987, 0.999962, 2.86808e-5, 1.45564e-5, 1.19901, 0.227089, -8.41413e-6, 0.404216, 4.72707e-6, 0.239725, -0.000215083, 0.426708, 0.000120833, 0.239904, -0.000860718, 0.427028, 0.000483555, 0.239911, -0.00193661, 0.427039, 0.00108806, 0.239914, -0.00344276, 0.42704, 0.00193457, 0.239933, -0.00537907, 0.427064, 0.00302363, 0.239944, -0.00774482, 0.427065, 0.00435604, 0.239993, -0.01054, 0.427122, 0.00593398, 0.240052, -0.0137626, 0.427179, 0.00775987, 0.240148, -0.0174115, 0.427279, 0.00983854, 0.240278, -0.021484, 0.42741, 0.0121763, 0.240472, -0.0259729, 0.427618, 0.0147827, 0.240839, -0.0308131, 0.428086, 0.0176837, 0.241201, -0.0360893, 0.428482, 0.0208775, 0.241626, -0.0417723, 0.428907, 0.0243821, 0.242207, -0.0478337, 0.42952, 0.0282228, 0.24298, -0.0542199, 0.430332, 0.0324333, 0.243881, -0.0610015, 0.431222, 0.0370252, 0.245123, -0.0680874, 0.432512, 0.0420535, 0.24667, -0.0755482, 0.434088, 0.0475414, 0.248779, -0.0832873, 0.436323, 0.0535542, 0.251665, -0.0913546, 0.439509, 0.0601716, 0.255305, -0.0998489, 0.443478, 0.0674282, 0.260049, -0.108576, 0.448713, 0.0754673, 0.266192, -0.117754, 0.455524, 0.084339, 0.273158, -0.127294, 0.4627, 0.0941683, 0.282131, -0.137311, 0.472068, 0.10515, 0.293332, -0.147736, 0.483565, 0.117402, 0.304667, -0.158357, 0.493702, 0.130824, 0.317785, -0.169274, 0.504708, 0.145724, 0.333245, -0.180595, 0.517107, 0.16215, 0.349843, -0.191892, 0.528849, 0.180149, 0.367944, -0.203168, 0.540301, 0.199746, 0.387579, -0.214443, 0.551514, 0.221047, 0.408247, -0.225624, 0.560906, 0.243981, 0.43014, -0.236422, 0.56959, 0.268513, 0.452669, -0.24654, 0.576098, 0.294409, 0.476196, -0.256157, 0.580925, 0.322002, 0.501157, -0.265289, 0.584839, 0.351052, 0.527632, -0.273671, 0.587614, 0.3812, 0.555754, -0.281254, 0.589119, 0.412994, 0.581682, -0.287448, 0.585204, 0.445498, 0.608196, -0.292614, 0.579006, 0.479505, 0.635661, -0.296068, 0.571297, 0.514643, 0.664999, -0.297395, 0.560855, 0.552213, 0.691039, -0.296645, 0.544525, 0.591365, 0.7179, -0.293785, 0.526535, 0.630883, 0.744059, -0.289089, 0.50545, 0.670932, 0.76863, -0.282239, 0.482514, 0.710904, 0.793273, -0.273688, 0.457246, 0.750259, 0.814731, -0.26328, 0.428872, 0.78948, 0.835603, -0.251526, 0.399384, 0.828597, 0.85489, -0.238339, 0.368811, 0.866892, 0.872828, -0.223607, 0.336617, 0.90563, 0.889462, -0.207538, 0.303997, 0.943538, 0.904929, -0.190297, 0.270812, 0.980591, 0.919101, -0.172034, 0.237453, 1.01935, 0.930536, -0.152058, 0.204431, 1.05498, 0.941223, -0.129515, 0.172495, 1.08717, 0.94982, -0.104263, 0.140175, 1.11551, 0.960592, -0.0781944, 0.106465, 1.14098, 0.974629, -0.051688, 0.0711592, 1.16418, 0.98811, -0.0253929, 0.0354432, 1.18465, 1.00004, 0.000804378, -0.000330876, 1.20462, 0.214668, -8.21282e-6, 0.406619, 4.33582e-6, 0.218053, -0.000208144, 0.413025, 0.000109887, 0.217987, -0.000832212, 0.412901, 0.000439362, 0.217971, -0.00187246, 0.412876, 0.000988623, 0.217968, -0.00332855, 0.41286, 0.00175772, 0.217985, -0.00520055, 0.412882, 0.00274729, 0.218014, -0.00748814, 0.412916, 0.00395842, 0.218054, -0.0101901, 0.412957, 0.00539274, 0.218106, -0.0133057, 0.413005, 0.00705348, 0.218217, -0.0168342, 0.413139, 0.00894581, 0.218338, -0.0207707, 0.413258, 0.0110754, 0.21855, -0.0251001, 0.413509, 0.0134551, 0.218913, -0.0297861, 0.413992, 0.0161081, 0.219265, -0.0348956, 0.414383, 0.0190307, 0.219696, -0.0403909, 0.414839, 0.0222458, 0.220329, -0.0462003, 0.415567, 0.025792, 0.220989, -0.0524208, 0.41621, 0.0296637, 0.222027, -0.058948, 0.417385, 0.0339323, 0.223301, -0.0658208, 0.418779, 0.0386055, 0.224988, -0.0730347, 0.420665, 0.0437355, 0.227211, -0.0805274, 0.423198, 0.0493844, 0.230131, -0.088395, 0.426566, 0.0556135, 0.233908, -0.0966208, 0.43091, 0.0624829, 0.239092, -0.105223, 0.437148, 0.0701636, 0.245315, -0.11424, 0.444302, 0.0786949, 0.253166, -0.12368, 0.453262, 0.0882382, 0.262374, -0.133569, 0.463211, 0.0988682, 0.273145, -0.143836, 0.474271, 0.110727, 0.285512, -0.154577, 0.4863, 0.123945, 0.299512, -0.165501, 0.498817, 0.138581, 0.314287, -0.176698, 0.510341, 0.154676, 0.331083, -0.188066, 0.522583, 0.172459, 0.349615, -0.199597, 0.534879, 0.191979, 0.369318, -0.210843, 0.546083, 0.21309, 0.390377, -0.222068, 0.5562, 0.235998, 0.412411, -0.233059, 0.564704, 0.260518, 0.435715, -0.24357, 0.572314, 0.286795, 0.461196, -0.253356, 0.579395, 0.314559, 0.485587, -0.262362, 0.581985, 0.343581, 0.511908, -0.270895, 0.584347, 0.374367, 0.539798, -0.278452, 0.58505, 0.406015, 0.567974, -0.284877, 0.583344, 0.439168, 0.594303, -0.290124, 0.577348, 0.473005, 0.622951, -0.294183, 0.570751, 0.508534, 0.652404, -0.296389, 0.561541, 0.544764, 0.679291, -0.296605, 0.546426, 0.582927, 0.706437, -0.294095, 0.528599, 0.622681, 0.734485, -0.28978, 0.508676, 0.663567, 0.758841, -0.283363, 0.484768, 0.704092, 0.78537, -0.275015, 0.460434, 0.745101, 0.807315, -0.264689, 0.432166, 0.784712, 0.8271, -0.252597, 0.401807, 0.824241, 0.849191, -0.239154, 0.371458, 0.863803, 0.867046, -0.224451, 0.338873, 0.903063, 0.8852, -0.208342, 0.306175, 0.942763, 0.901771, -0.190684, 0.272759, 0.981559, 0.915958, -0.172105, 0.239306, 1.02048, 0.928046, -0.152214, 0.206071, 1.05765, 0.939961, -0.130247, 0.17367, 1.08999, 0.948711, -0.10672, 0.142201, 1.11829, 0.959305, -0.0808688, 0.108454, 1.14467, 0.973009, -0.0539145, 0.0728109, 1.16839, 0.987631, -0.0262947, 0.0360625, 1.19004, 0.999978, 0.00132758, -0.000559424, 1.21058, 0.193925, -7.93421e-6, 0.391974, 3.92537e-6, 0.196746, -0.000200315, 0.397675, 9.91033e-5, 0.19667, -0.000801099, 0.397521, 0.000396342, 0.196633, -0.00180246, 0.397445, 0.000891829, 0.196654, -0.00320443, 0.397482, 0.00158582, 0.196659, -0.00500647, 0.39748, 0.00247867, 0.196683, -0.0072086, 0.397506, 0.00357167, 0.196728, -0.00981001, 0.397562, 0.00486675, 0.196792, -0.0128096, 0.397633, 0.00636707, 0.19689, -0.0162055, 0.397746, 0.00807752, 0.197017, -0.0199943, 0.397884, 0.0100052, 0.19729, -0.024139, 0.39827, 0.0121691, 0.197583, -0.0286671, 0.398639, 0.0145755, 0.197927, -0.0335858, 0.399034, 0.0172355, 0.198383, -0.0388806, 0.399554, 0.0201718, 0.199002, -0.0444736, 0.400289, 0.0234194, 0.199739, -0.0504583, 0.401111, 0.026984, 0.200784, -0.056729, 0.402349, 0.0309217, 0.202075, -0.0633643, 0.403841, 0.0352496, 0.203898, -0.0703247, 0.406076, 0.0400313, 0.206199, -0.0775565, 0.408841, 0.0453282, 0.209252, -0.085184, 0.41259, 0.0511794, 0.213638, -0.0931994, 0.418288, 0.0577459, 0.21881, -0.101617, 0.424681, 0.0650508, 0.225642, -0.11052, 0.433429, 0.0732759, 0.233717, -0.119772, 0.442897, 0.0824683, 0.242823, -0.129505, 0.452888, 0.0927484, 0.254772, -0.139906, 0.466407, 0.104417, 0.266603, -0.150402, 0.477413, 0.117211, 0.28073, -0.161395, 0.490519, 0.131598, 0.295399, -0.172465, 0.50201, 0.147407, 0.312705, -0.183982, 0.515311, 0.165031, 0.331335, -0.195532, 0.52786, 0.184336, 0.351037, -0.206971, 0.5392, 0.205361, 0.372175, -0.218117, 0.54941, 0.228043, 0.394548, -0.229327, 0.558642, 0.25267, 0.419598, -0.240052, 0.567861, 0.279071, 0.443922, -0.249937, 0.573332, 0.306882, 0.471495, -0.259407, 0.58013, 0.33661, 0.496769, -0.267749, 0.580564, 0.367328, 0.524951, -0.275524, 0.581696, 0.399753, 0.55318, -0.282148, 0.579885, 0.433134, 0.581577, -0.287533, 0.575471, 0.467534, 0.609231, -0.291612, 0.567445, 0.502943, 0.637478, -0.293911, 0.557657, 0.53871, 0.667795, -0.295096, 0.546535, 0.576568, 0.694272, -0.294073, 0.529561, 0.614929, 0.722937, -0.290386, 0.510561, 0.655909, 0.749682, -0.284481, 0.487846, 0.697663, 0.774754, -0.276188, 0.462487, 0.738515, 0.799301, -0.266215, 0.43481, 0.779802, 0.820762, -0.254116, 0.404879, 0.820045, 0.843231, -0.240393, 0.374559, 0.860294, 0.861857, -0.225503, 0.341582, 0.900965, 0.880815, -0.209382, 0.308778, 0.941727, 0.89766, -0.19155, 0.275232, 0.980916, 0.912926, -0.172346, 0.240938, 1.02162, 0.926391, -0.151799, 0.207223, 1.0597, 0.938429, -0.129968, 0.17484, 1.09291, 0.947834, -0.10651, 0.142984, 1.12248, 0.958432, -0.0824098, 0.109902, 1.149, 0.972402, -0.0565242, 0.0744454, 1.1733, 0.987191, -0.028427, 0.0373794, 1.19538, 0.999975, 3.85685e-5, -4.203e-5, 1.21676, 0.178114, -7.66075e-6, 0.385418, 3.54027e-6, 0.176074, -0.000191966, 0.381002, 8.87135e-5, 0.17601, -0.000767549, 0.380861, 0.000354715, 0.17598, -0.00172696, 0.380798, 0.000798168, 0.175994, -0.00307012, 0.380824, 0.00141928, 0.176017, -0.00479684, 0.380858, 0.00221859, 0.176019, -0.00690648, 0.380839, 0.00319714, 0.176072, -0.00939888, 0.380913, 0.0043572, 0.176131, -0.0122726, 0.380979, 0.005702, 0.176239, -0.0155264, 0.38112, 0.00723689, 0.176371, -0.0191551, 0.381272, 0.00896907, 0.176638, -0.023117, 0.381669, 0.0109194, 0.176912, -0.0274633, 0.382015, 0.0130903, 0.177279, -0.032173, 0.382476, 0.0154949, 0.17774, -0.0372219, 0.383041, 0.0181669, 0.178344, -0.0426132, 0.38378, 0.0211209, 0.179153, -0.0483309, 0.384773, 0.0243899, 0.180197, -0.0543447, 0.386076, 0.0280062, 0.181581, -0.0607122, 0.387809, 0.032004, 0.18344, -0.0673855, 0.390205, 0.036453, 0.186139, -0.0743989, 0.393944, 0.0414162, 0.189432, -0.0817731, 0.39832, 0.0469394, 0.193795, -0.0895464, 0.404188, 0.0531442, 0.199641, -0.0978264, 0.4121, 0.0601374, 0.206679, -0.106499, 0.421425, 0.0680078, 0.214865, -0.115654, 0.431504, 0.076919, 0.224406, -0.125268, 0.442526, 0.0868835, 0.235876, -0.135475, 0.455465, 0.0981875, 0.248335, -0.146023, 0.4681, 0.110759, 0.262868, -0.157016, 0.482069, 0.124885, 0.278962, -0.168245, 0.496182, 0.140645, 0.295082, -0.17958, 0.507401, 0.157838, 0.313738, -0.191227, 0.520252, 0.17695, 0.333573, -0.202718, 0.531708, 0.197817, 0.356433, -0.214424, 0.544509, 0.220785, 0.378853, -0.225492, 0.55373, 0.245306, 0.402717, -0.236236, 0.561348, 0.271593, 0.428375, -0.246568, 0.568538, 0.299776, 0.454724, -0.255941, 0.573462, 0.329433, 0.482291, -0.264511, 0.576356, 0.360598, 0.509706, -0.272129, 0.576446, 0.393204, 0.538805, -0.278979, 0.575298, 0.427227, 0.568919, -0.284528, 0.572154, 0.462157, 0.596804, -0.288801, 0.564691, 0.497997, 0.625987, -0.291334, 0.555134, 0.534467, 0.656414, -0.292722, 0.545051, 0.571736, 0.683916, -0.292185, 0.528813, 0.610158, 0.711809, -0.290043, 0.51106, 0.649061, 0.739547, -0.285246, 0.490103, 0.690081, 0.766914, -0.277647, 0.465523, 0.732554, 0.791375, -0.267603, 0.437718, 0.773982, 0.814772, -0.256109, 0.40882, 0.81609, 0.836691, -0.242281, 0.377823, 0.856849, 0.856984, -0.227155, 0.34496, 0.898363, 0.876332, -0.210395, 0.311335, 0.939471, 0.894988, -0.192612, 0.277703, 0.980799, 0.911113, -0.173236, 0.243019, 1.02215, 0.924092, -0.152258, 0.209037, 1.06139, 0.936828, -0.129575, 0.175909, 1.09635, 0.946869, -0.10594, 0.143852, 1.12707, 0.958284, -0.081318, 0.110289, 1.15419, 0.972325, -0.0556133, 0.0747232, 1.17909, 0.986878, -0.0297899, 0.0383149, 1.20163, 0.999936, -0.00197169, 0.000912402, 1.22338, 0.151174, -7.20365e-6, 0.351531, 3.09789e-6, 0.155594, -0.00018279, 0.361806, 7.8608e-5, 0.156099, -0.000731569, 0.362982, 0.000314615, 0.156053, -0.00164578, 0.362869, 0.000707845, 0.156093, -0.0029261, 0.362961, 0.00125884, 0.156099, -0.00457155, 0.362959, 0.00196783, 0.15612, -0.00658224, 0.362982, 0.00283622, 0.156168, -0.00895774, 0.363048, 0.00386625, 0.156221, -0.0116962, 0.363101, 0.00506109, 0.156324, -0.0147973, 0.363241, 0.00642675, 0.156476, -0.0182503, 0.363448, 0.00797175, 0.156731, -0.0220266, 0.36384, 0.00971484, 0.156994, -0.026176, 0.364179, 0.0116575, 0.157341, -0.0306701, 0.36462, 0.0138207, 0.157867, -0.0354591, 0.365364, 0.0162356, 0.15846, -0.0406141, 0.366111, 0.0189092, 0.159308, -0.0460519, 0.367248, 0.021885, 0.160426, -0.0518096, 0.368767, 0.0252004, 0.161877, -0.0578906, 0.370745, 0.0288825, 0.163995, -0.0642812, 0.373831, 0.0330139, 0.16655, -0.0710067, 0.377366, 0.0376283, 0.170237, -0.0781522, 0.382799, 0.0428493, 0.175096, -0.0857172, 0.389915, 0.0487324, 0.181069, -0.0938025, 0.398487, 0.0554214, 0.188487, -0.102363, 0.408799, 0.0630189, 0.197029, -0.111343, 0.419991, 0.071634, 0.206684, -0.120812, 0.431455, 0.0812797, 0.218698, -0.131033, 0.445746, 0.0923651, 0.230726, -0.141373, 0.457471, 0.104545, 0.245516, -0.152387, 0.472388, 0.118449, 0.261551, -0.163628, 0.486671, 0.133923, 0.277437, -0.174814, 0.49762, 0.150849, 0.296662, -0.186713, 0.51162, 0.169924, 0.31795, -0.198513, 0.525435, 0.190848, 0.339422, -0.210119, 0.536267, 0.213504, 0.362143, -0.221354, 0.545982, 0.237947, 0.387198, -0.23224, 0.555364, 0.264427, 0.412349, -0.24257, 0.561489, 0.292519, 0.439274, -0.252284, 0.566903, 0.322561, 0.466779, -0.261023, 0.569614, 0.353952, 0.496011, -0.26899, 0.571589, 0.387278, 0.524964, -0.275498, 0.570325, 0.421356, 0.556518, -0.281449, 0.568792, 0.457314, 0.584363, -0.285526, 0.560268, 0.493199, 0.614214, -0.28844, 0.55205, 0.530276, 0.645684, -0.289777, 0.541906, 0.56855, 0.673446, -0.289722, 0.526464, 0.606927, 0.701924, -0.287792, 0.509872, 0.645945, 0.73037, -0.284315, 0.490649, 0.685564, 0.757405, -0.278804, 0.467964, 0.726511, 0.784025, -0.269543, 0.441468, 0.768601, 0.808255, -0.258117, 0.41216, 0.811321, 0.830739, -0.244728, 0.380606, 0.853496, 0.851914, -0.229428, 0.348111, 0.895374, 0.872586, -0.212508, 0.314732, 0.937674, 0.891581, -0.194025, 0.280338, 0.979869, 0.907641, -0.174711, 0.245203, 1.02253, 0.922233, -0.153509, 0.21077, 1.06371, 0.935878, -0.130418, 0.177399, 1.09972, 0.946338, -0.105558, 0.144507, 1.13124, 0.957265, -0.080059, 0.110508, 1.15973, 0.971668, -0.0539766, 0.0742311, 1.18515, 0.9866, -0.0277101, 0.0375224, 1.20858, 1.00021, -0.000515531, 0.000135226, 1.23135, 0.137468, -6.86011e-6, 0.345041, 2.73315e-6, 0.13703, -0.000173378, 0.343936, 6.90761e-5, 0.136986, -0.000693048, 0.34383, 0.000276126, 0.136964, -0.00155931, 0.343761, 0.000621337, 0.137003, -0.00277211, 0.343863, 0.00110494, 0.137012, -0.00433103, 0.343868, 0.00172744, 0.137043, -0.00623606, 0.343916, 0.00249022, 0.13709, -0.0084868, 0.343986, 0.00339559, 0.137145, -0.0110814, 0.344045, 0.00444687, 0.137242, -0.0140187, 0.344177, 0.00565007, 0.137431, -0.0172713, 0.344491, 0.00701868, 0.137644, -0.0208605, 0.344805, 0.00856042, 0.13791, -0.024792, 0.345172, 0.0102863, 0.138295, -0.0290461, 0.345734, 0.0122185, 0.138764, -0.0335957, 0.346371, 0.0143771, 0.139415, -0.038467, 0.347298, 0.0167894, 0.140272, -0.0436176, 0.348527, 0.0194895, 0.141457, -0.0491016, 0.350276, 0.0225043, 0.14303, -0.0548764, 0.352646, 0.0258962, 0.145289, -0.0610096, 0.356206, 0.0297168, 0.148502, -0.0674777, 0.361488, 0.0340562, 0.152188, -0.074345, 0.367103, 0.0389534, 0.157359, -0.0817442, 0.375247, 0.0445541, 0.16379, -0.0896334, 0.385064, 0.0509535, 0.171376, -0.098005, 0.396082, 0.0582611, 0.179901, -0.106817, 0.407418, 0.06654, 0.189892, -0.116239, 0.420031, 0.075994, 0.201838, -0.12627, 0.434321, 0.0867239, 0.214311, -0.136701, 0.447631, 0.0987517, 0.228902, -0.147616, 0.462046, 0.112353, 0.245107, -0.158871, 0.476942, 0.127605, 0.262292, -0.170261, 0.490285, 0.144469, 0.281215, -0.182017, 0.503783, 0.163282, 0.301058, -0.193729, 0.515505, 0.183873, 0.322752, -0.205512, 0.52682, 0.206466, 0.347547, -0.217214, 0.539473, 0.231194, 0.370969, -0.227966, 0.546625, 0.257288, 0.397533, -0.238555, 0.55472, 0.285789, 0.42398, -0.248278, 0.559468, 0.315746, 0.452928, -0.257422, 0.564095, 0.347724, 0.482121, -0.265306, 0.565426, 0.380922, 0.510438, -0.272043, 0.563205, 0.415639, 0.541188, -0.277614, 0.561087, 0.451702, 0.571667, -0.281927, 0.554922, 0.48845, 0.602432, -0.285015, 0.546838, 0.526442, 0.634126, -0.286512, 0.537415, 0.564896, 0.662816, -0.286388, 0.522906, 0.604037, 0.692411, -0.284734, 0.507003, 0.643795, 0.720946, -0.281297, 0.488398, 0.68298, 0.748293, -0.276262, 0.466353, 0.723466, 0.776931, -0.269978, 0.443573, 0.764565, 0.801065, -0.260305, 0.415279, 0.805838, 0.825843, -0.247426, 0.384773, 0.849985, 0.84807, -0.232437, 0.352555, 0.893174, 0.869122, -0.215806, 0.318642, 0.936564, 0.888963, -0.197307, 0.28381, 0.980253, 0.905547, -0.177203, 0.247888, 1.02463, 0.918554, -0.155542, 0.212904, 1.06714, 0.931395, -0.131948, 0.1787, 1.10451, 0.941749, -0.106723, 0.145902, 1.13694, 0.954551, -0.0804939, 0.111193, 1.1666, 0.970279, -0.0534239, 0.0744697, 1.19249, 0.986117, -0.0257452, 0.0368788, 1.21665, 0.999938, 0.00190634, -0.0010291, 1.23981, 0.118493, -6.47439e-6, 0.32272, 2.3772e-6, 0.118765, -0.000163023, 0.323456, 5.98573e-5, 0.118772, -0.00065212, 0.323477, 0.000239447, 0.118843, -0.00146741, 0.323657, 0.000538881, 0.118804, -0.00260846, 0.323553, 0.00095826, 0.118826, -0.00407576, 0.323595, 0.00149845, 0.118846, -0.00586826, 0.323617, 0.00216047, 0.118886, -0.00798578, 0.32367, 0.00294679, 0.118947, -0.0104273, 0.323753, 0.00386124, 0.119055, -0.0131909, 0.323922, 0.00490999, 0.119241, -0.0162444, 0.324251, 0.00610804, 0.11944, -0.0196339, 0.324544, 0.00745805, 0.119739, -0.0233378, 0.325026, 0.00897805, 0.12011, -0.0273179, 0.325586, 0.0106895, 0.120571, -0.0316143, 0.326231, 0.0126073, 0.12124, -0.0361939, 0.327264, 0.0147654, 0.122162, -0.0410511, 0.328733, 0.0172001, 0.123378, -0.0462233, 0.330659, 0.0199375, 0.125183, -0.0517109, 0.333754, 0.0230498, 0.127832, -0.0575652, 0.338507, 0.026597, 0.130909, -0.0637441, 0.343666, 0.0306345, 0.135221, -0.0704302, 0.351063, 0.035273, 0.14082, -0.0776364, 0.360604, 0.0406137, 0.146781, -0.0852293, 0.369638, 0.0466788, 0.155121, -0.0935351, 0.3827, 0.0537628, 0.16398, -0.102234, 0.39522, 0.0617985, 0.173926, -0.111465, 0.40793, 0.07097, 0.185137, -0.121296, 0.42105, 0.0813426, 0.19826, -0.13169, 0.435735, 0.0931596, 0.212938, -0.142614, 0.450932, 0.106547, 0.229046, -0.153884, 0.465726, 0.121575, 0.246246, -0.165382, 0.479461, 0.138286, 0.264637, -0.176806, 0.492106, 0.15666, 0.284959, -0.188793, 0.504774, 0.17728, 0.308157, -0.200763, 0.518805, 0.19988, 0.330951, -0.21239, 0.528231, 0.224293, 0.3549, -0.223521, 0.536376, 0.250541, 0.381502, -0.234169, 0.544846, 0.278902, 0.409529, -0.244077, 0.551717, 0.309227, 0.437523, -0.253363, 0.55517, 0.341426, 0.467624, -0.261659, 0.557772, 0.37518, 0.497268, -0.268498, 0.556442, 0.41007, 0.528294, -0.274018, 0.553915, 0.446445, 0.559053, -0.278169, 0.549153, 0.483779, 0.589329, -0.281229, 0.539878, 0.522249, 0.622503, -0.282902, 0.53162, 0.561754, 0.652382, -0.282815, 0.518119, 0.601544, 0.681847, -0.281247, 0.502187, 0.641574, 0.712285, -0.277986, 0.484824, 0.682633, 0.740094, -0.273017, 0.463483, 0.723426, 0.768478, -0.266692, 0.441299, 0.763747, 0.794556, -0.258358, 0.415238, 0.805565, 0.819408, -0.248807, 0.386912, 0.847254, 0.843411, -0.236214, 0.356165, 0.891091, 0.862397, -0.219794, 0.320562, 0.936174, 0.883113, -0.201768, 0.285322, 0.982562, 0.90023, -0.181672, 0.249713, 1.02862, 0.915192, -0.159279, 0.214546, 1.07163, 0.928458, -0.134725, 0.180285, 1.10995, 0.94069, -0.10913, 0.147119, 1.14354, 0.953409, -0.0821315, 0.112492, 1.17372, 0.969537, -0.0542677, 0.0752014, 1.20043, 0.985612, -0.0259096, 0.0370361, 1.22528, 0.999835, 0.00298198, -0.00151801, 1.24959, 0.10097, -6.02574e-6, 0.300277, 2.02619e-6, 0.101577, -0.000152164, 0.302077, 5.11662e-5, 0.101572, -0.000608889, 0.302066, 0.000204751, 0.101566, -0.00136997, 0.302047, 0.000460753, 0.101592, -0.00243557, 0.302114, 0.000819497, 0.101608, -0.0038053, 0.30214, 0.00128154, 0.101627, -0.00547906, 0.30216, 0.0018483, 0.101669, -0.00745647, 0.302224, 0.00252223, 0.101732, -0.00973615, 0.302318, 0.00330716, 0.101844, -0.0123097, 0.302513, 0.00421061, 0.102025, -0.0151681, 0.30285, 0.00524481, 0.102224, -0.0183334, 0.303166, 0.0064154, 0.102515, -0.0217819, 0.303654, 0.00774063, 0.102886, -0.0255067, 0.304243, 0.0092398, 0.103395, -0.029514, 0.305089, 0.0109339, 0.104109, -0.0337912, 0.306301, 0.0128561, 0.105074, -0.0383565, 0.30798, 0.0150338, 0.10654, -0.0432132, 0.310726, 0.0175228, 0.108478, -0.0484244, 0.314351, 0.0203648, 0.111015, -0.0539339, 0.319032, 0.0236325, 0.114682, -0.0598885, 0.32605, 0.0274188, 0.11911, -0.0663375, 0.334109, 0.0317905, 0.124736, -0.0733011, 0.344013, 0.0368502, 0.131479, -0.0807744, 0.355358, 0.0427104, 0.139283, -0.0888204, 0.367614, 0.0494788, 0.148054, -0.0973394, 0.380072, 0.0572367, 0.159037, -0.10665, 0.395678, 0.0662704, 0.169794, -0.116221, 0.40795, 0.0763192, 0.18314, -0.126632, 0.423546, 0.087956, 0.197515, -0.137383, 0.438213, 0.101042, 0.213514, -0.148641, 0.453248, 0.115827, 0.23065, -0.160117, 0.46688, 0.132283, 0.249148, -0.171807, 0.479962, 0.150644, 0.270219, -0.183695, 0.494618, 0.171073, 0.292338, -0.195574, 0.506937, 0.193378, 0.314999, -0.207205, 0.516463, 0.217585, 0.340991, -0.218955, 0.528123, 0.24428, 0.367982, -0.229917, 0.537025, 0.272784, 0.39432, -0.239737, 0.541627, 0.302742, 0.423364, -0.249048, 0.546466, 0.335112, 0.453751, -0.257329, 0.549466, 0.369032, 0.48416, -0.264623, 0.549503, 0.404577, 0.515262, -0.270411, 0.547008, 0.441337, 0.547036, -0.274581, 0.542249, 0.479162, 0.576614, -0.277266, 0.533015, 0.517904, 0.611143, -0.279144, 0.525512, 0.558508, 0.640989, -0.279001, 0.51154, 0.598995, 0.671182, -0.277324, 0.495641, 0.639935, 0.700848, -0.273908, 0.477526, 0.681017, 0.729862, -0.269063, 0.457955, 0.722764, 0.758273, -0.262282, 0.434846, 0.764349, 0.784121, -0.254281, 0.409203, 0.806206, 0.809798, -0.24505, 0.382694, 0.848617, 0.834953, -0.233861, 0.354034, 0.892445, 0.856817, -0.221308, 0.321764, 0.936263, 0.877609, -0.205996, 0.288118, 0.982401, 0.897489, -0.186702, 0.253277, 1.02975, 0.913792, -0.164618, 0.217963, 1.07488, 0.92785, -0.140023, 0.183221, 1.11487, 0.940378, -0.11328, 0.149385, 1.14947, 0.95273, -0.0853958, 0.114152, 1.1807, 0.969059, -0.0568698, 0.0769845, 1.20912, 0.985574, -0.0276502, 0.0381186, 1.23498, 0.999943, 0.00239052, -0.00126861, 1.25987, 0.0852715, -5.60067e-6, 0.279021, 1.71162e-6, 0.0854143, -0.000140871, 0.279483, 4.30516e-5, 0.0854191, -0.000563385, 0.2795, 0.000172184, 0.0854188, -0.00126753, 0.279493, 0.000387464, 0.0854229, -0.00225337, 0.279501, 0.00068918, 0.0854443, -0.00352086, 0.279549, 0.00107803, 0.0854697, -0.00506962, 0.279591, 0.00155536, 0.0855093, -0.00689873, 0.279652, 0.00212354, 0.0855724, -0.00900821, 0.279752, 0.00278703, 0.0856991, -0.0113799, 0.280011, 0.0035551, 0.085855, -0.0140314, 0.280297, 0.00443449, 0.0860682, -0.016963, 0.280682, 0.00543636, 0.086344, -0.0201438, 0.281159, 0.0065788, 0.0867426, -0.0235999, 0.281886, 0.00787977, 0.087239, -0.0273069, 0.282745, 0.0093606, 0.0879815, -0.031269, 0.284139, 0.011056, 0.0891258, -0.035531, 0.28647, 0.0130065, 0.0906909, -0.0400947, 0.289708, 0.0152495, 0.0927624, -0.0449638, 0.293904, 0.0178454, 0.0958376, -0.0502427, 0.300471, 0.0208915, 0.0995827, -0.0559514, 0.30806, 0.0244247, 0.104526, -0.0622152, 0.317874, 0.0285721, 0.110532, -0.0690046, 0.329332, 0.0334227, 0.117385, -0.0763068, 0.341217, 0.0390466, 0.12522, -0.084184, 0.353968, 0.0455786, 0.134037, -0.0925248, 0.366797, 0.0530773, 0.144014, -0.101487, 0.380209, 0.0617424, 0.156013, -0.111273, 0.395956, 0.071777, 0.168872, -0.121431, 0.41053, 0.0830905, 0.183089, -0.132105, 0.425073, 0.0959341, 0.198763, -0.143286, 0.439833, 0.110448, 0.216159, -0.154841, 0.454507, 0.126769, 0.234859, -0.166588, 0.468368, 0.14495, 0.255879, -0.178626, 0.482846, 0.165233, 0.27677, -0.190218, 0.493489, 0.187217, 0.301184, -0.202227, 0.506549, 0.211659, 0.325852, -0.213764, 0.5158, 0.237922, 0.352824, -0.22487, 0.525442, 0.26632, 0.380882, -0.235246, 0.532487, 0.296691, 0.410137, -0.244847, 0.537703, 0.329179, 0.439787, -0.253122, 0.540361, 0.363135, 0.472291, -0.260517, 0.542734, 0.399222, 0.501856, -0.266519, 0.538826, 0.436352, 0.534816, -0.270905, 0.535152, 0.474505, 0.565069, -0.273826, 0.525979, 0.513988, 0.597154, -0.275333, 0.516394, 0.554852, 0.630473, -0.275314, 0.506206, 0.596592, 0.660574, -0.273323, 0.489769, 0.638117, 0.692015, -0.270008, 0.472578, 0.680457, 0.720647, -0.265001, 0.452134, 0.723008, 0.750528, -0.258311, 0.430344, 0.765954, 0.777568, -0.250046, 0.405624, 0.809012, 0.80387, -0.240114, 0.378339, 0.852425, 0.828439, -0.228737, 0.349877, 0.895346, 0.851472, -0.216632, 0.318968, 0.940695, 0.873906, -0.202782, 0.287489, 0.987235, 0.89467, -0.187059, 0.254394, 1.03348, 0.912281, -0.168818, 0.221294, 1.07812, 0.927358, -0.146494, 0.18675, 1.11928, 0.940385, -0.120009, 0.152322, 1.15609, 0.952672, -0.0917183, 0.117514, 1.18875, 0.968496, -0.0620321, 0.0797405, 1.21821, 0.985236, -0.0314945, 0.0402383, 1.24523, 0.99998, -0.000575153, 0.000110644, 1.27133, 0.0702429, -5.12222e-6, 0.255273, 1.40947e-6, 0.0702981, -0.000128826, 0.255469, 3.54488e-5, 0.0703691, -0.000515562, 0.255727, 0.000141874, 0.0703805, -0.00116, 0.255754, 0.00031929, 0.0703961, -0.00206224, 0.255813, 0.000567999, 0.0704102, -0.00322223, 0.255839, 0.00088871, 0.0704298, -0.00463928, 0.255863, 0.00128272, 0.0704759, -0.00631375, 0.255953, 0.00175283, 0.0705434, -0.00824317, 0.256079, 0.00230342, 0.0706693, -0.010412, 0.25636, 0.0029443, 0.0708189, -0.0128439, 0.256647, 0.00368031, 0.0710364, -0.0155177, 0.257084, 0.00452614, 0.0713223, -0.0184374, 0.257637, 0.00549706, 0.0717182, -0.0216002, 0.258416, 0.00661246, 0.072321, -0.0249966, 0.259699, 0.00790147, 0.0731446, -0.0286566, 0.261475, 0.0093884, 0.0743352, -0.0325888, 0.264132, 0.0111186, 0.0760676, -0.036843, 0.26815, 0.013145, 0.078454, -0.0414292, 0.273636, 0.0155251, 0.0818618, -0.0464634, 0.281653, 0.0183525, 0.0857382, -0.0519478, 0.289992, 0.0216642, 0.0908131, -0.0579836, 0.30066, 0.0255956, 0.0967512, -0.0645124, 0.312204, 0.0301954, 0.103717, -0.0716505, 0.325001, 0.0356017, 0.111596, -0.0793232, 0.338129, 0.041896, 0.120933, -0.087645, 0.352853, 0.0492447, 0.130787, -0.096492, 0.366192, 0.0576749, 0.142311, -0.105973, 0.380864, 0.0673969, 0.155344, -0.116182, 0.396575, 0.0785899, 0.169535, -0.126815, 0.411443, 0.0912377, 0.185173, -0.138015, 0.426256, 0.105607, 0.201755, -0.149325, 0.439607, 0.121551, 0.221334, -0.161207, 0.455467, 0.139608, 0.241461, -0.173162, 0.469096, 0.159591, 0.26294, -0.18504, 0.481014, 0.18156, 0.286776, -0.196881, 0.493291, 0.205781, 0.311596, -0.208311, 0.503556, 0.231819, 0.338667, -0.219671, 0.513268, 0.260274, 0.366021, -0.230451, 0.519414, 0.290862, 0.395875, -0.240131, 0.526766, 0.323196, 0.425564, -0.248566, 0.52905, 0.357071, 0.457094, -0.256195, 0.530796, 0.393262, 0.488286, -0.262331, 0.528703, 0.430797, 0.522291, -0.267141, 0.52727, 0.470231, 0.554172, -0.270411, 0.519848, 0.510477, 0.586427, -0.271986, 0.510307, 0.551594, 0.619638, -0.27192, 0.499158, 0.593849, 0.650656, -0.269817, 0.483852, 0.636314, 0.68284, -0.266267, 0.467515, 0.679679, 0.714356, -0.26113, 0.44931, 0.723884, 0.742717, -0.254067, 0.425789, 0.767245, 0.770894, -0.245652, 0.401144, 0.811819, 0.797358, -0.235554, 0.374224, 0.856315, 0.823377, -0.223896, 0.346167, 0.901077, 0.847456, -0.210865, 0.316056, 0.946502, 0.870697, -0.196574, 0.284503, 0.993711, 0.891068, -0.180814, 0.251628, 1.04134, 0.909267, -0.163314, 0.219065, 1.08609, 0.925653, -0.143304, 0.186446, 1.12702, 0.940017, -0.121322, 0.153416, 1.16371, 0.952398, -0.0973872, 0.120334, 1.19712, 0.967568, -0.0698785, 0.08352, 1.22791, 0.984772, -0.0390031, 0.0439209, 1.25672, 1.00026, -0.0070087, 0.00315668, 1.28428, 0.0556653, -4.59654e-6, 0.227325, 1.12556e-6, 0.0565238, -0.000116382, 0.230826, 2.84985e-5, 0.0565717, -0.000465666, 0.231026, 0.000114036, 0.0565859, -0.00104773, 0.231079, 0.000256656, 0.0565761, -0.00186255, 0.231025, 0.00045663, 0.0565913, -0.00291002, 0.231058, 0.000714664, 0.0566108, -0.00418998, 0.231085, 0.00103224, 0.0566532, -0.00570206, 0.231169, 0.00141202, 0.0567473, -0.00743666, 0.231417, 0.00186018, 0.0568567, -0.00940298, 0.231661, 0.00238264, 0.0569859, -0.0115991, 0.231895, 0.00298699, 0.0572221, -0.0140096, 0.232456, 0.00368957, 0.057519, -0.0166508, 0.233096, 0.00450303, 0.0579534, -0.01951, 0.234094, 0.00544945, 0.0585922, -0.0225991, 0.235629, 0.00655564, 0.0595647, -0.0259416, 0.238106, 0.00785724, 0.0609109, -0.0295661, 0.241557, 0.00939127, 0.0628751, -0.0335126, 0.246652, 0.0112198, 0.0656908, -0.0378604, 0.254091, 0.0134168, 0.0691347, -0.0426543, 0.262666, 0.0160374, 0.0732165, -0.0478967, 0.272029, 0.0191514, 0.0782863, -0.0536716, 0.283007, 0.0228597, 0.0843973, -0.0600683, 0.295732, 0.0272829, 0.0913598, -0.0670095, 0.308779, 0.032484, 0.0994407, -0.0745516, 0.322886, 0.0385886, 0.108189, -0.082712, 0.336408, 0.0457133, 0.118574, -0.0914927, 0.351692, 0.0539832, 0.129989, -0.100854, 0.366502, 0.0635162, 0.142722, -0.110837, 0.381675, 0.0744386, 0.156654, -0.121353, 0.3963, 0.0868483, 0.172151, -0.132414, 0.411477, 0.100963, 0.188712, -0.143809, 0.42508, 0.116795, 0.208093, -0.155765, 0.441328, 0.134715, 0.227936, -0.167608, 0.454328, 0.154396, 0.249495, -0.179579, 0.467235, 0.176179, 0.27362, -0.191488, 0.480248, 0.200193, 0.296371, -0.202618, 0.487886, 0.225775, 0.324234, -0.214133, 0.499632, 0.25441, 0.353049, -0.225212, 0.509532, 0.285077, 0.381785, -0.234875, 0.514265, 0.317047, 0.414038, -0.244205, 0.521282, 0.351874, 0.445251, -0.252145, 0.522931, 0.388279, 0.476819, -0.258433, 0.520947, 0.425825, 0.509209, -0.263411, 0.517669, 0.465104, 0.542759, -0.266732, 0.512841, 0.505741, 0.574822, -0.268263, 0.503317, 0.547611, 0.609324, -0.268489, 0.493035, 0.590953, 0.641772, -0.266941, 0.478816, 0.63488, 0.674049, -0.263297, 0.462863, 0.679072, 0.705071, -0.257618, 0.442931, 0.723487, 0.734709, -0.250625, 0.421299, 0.768708, 0.763704, -0.24179, 0.397085, 0.814375, 0.791818, -0.231115, 0.370577, 0.859907, 0.817439, -0.21922, 0.34232, 0.906715, 0.843202, -0.205658, 0.312627, 0.953943, 0.866639, -0.190563, 0.280933, 1.00185, 0.888129, -0.173978, 0.248393, 1.05105, 0.907239, -0.155485, 0.216007, 1.09704, 0.923893, -0.134782, 0.183233, 1.13857, 0.938882, -0.11249, 0.150376, 1.17539, 0.952464, -0.0890706, 0.117177, 1.20924, 0.968529, -0.0646523, 0.0813095, 1.24055, 0.984763, -0.038606, 0.0439378, 1.27018, 1.00053, -0.01238, 0.00598668, 1.29873, 0.0437928, -4.09594e-6, 0.204012, 8.79224e-7, 0.0440166, -0.000103395, 0.205049, 2.21946e-5, 0.0440529, -0.000413633, 0.205225, 8.87981e-5, 0.0440493, -0.000930594, 0.2052, 0.000199858, 0.0439884, -0.00165352, 0.204901, 0.000355495, 0.0440716, -0.0025849, 0.205255, 0.000556983, 0.0440968, -0.00372222, 0.205311, 0.000805326, 0.0441359, -0.00506478, 0.205391, 0.00110333, 0.0442231, -0.00660384, 0.205638, 0.00145768, 0.0443254, -0.00835246, 0.205877, 0.00187275, 0.0444832, -0.0102992, 0.20627, 0.00235938, 0.0447001, -0.0124449, 0.206796, 0.0029299, 0.0450168, -0.0147935, 0.207593, 0.0036005, 0.0454816, -0.017336, 0.208819, 0.00439246, 0.0462446, -0.0201156, 0.211036, 0.00533864, 0.0473694, -0.0231568, 0.214388, 0.00646984, 0.0490191, -0.0264941, 0.219357, 0.00783856, 0.0512776, -0.030184, 0.226061, 0.00950182, 0.0541279, -0.0342661, 0.234094, 0.0115156, 0.0578989, -0.0388539, 0.244297, 0.0139687, 0.0620835, -0.0438735, 0.254457, 0.0169015, 0.0673497, -0.04951, 0.266706, 0.0204554, 0.0731759, -0.0556263, 0.278753, 0.0246606, 0.0803937, -0.0624585, 0.29309, 0.0297126, 0.0879287, -0.0697556, 0.305856, 0.0355868, 0.0970669, -0.0778795, 0.321059, 0.0425768, 0.106508, -0.0863541, 0.333873, 0.05056, 0.11776, -0.0955935, 0.349008, 0.0598972, 0.130081, -0.105438, 0.363776, 0.0706314, 0.144454, -0.115899, 0.380112, 0.0828822, 0.1596, -0.126827, 0.394843, 0.0967611, 0.176097, -0.138161, 0.409033, 0.112381, 0.194726, -0.149904, 0.424257, 0.129952, 0.213944, -0.161675, 0.436945, 0.149333, 0.235516, -0.173659, 0.450176, 0.170892, 0.260564, -0.185963, 0.466305, 0.194984, 0.285183, -0.197582, 0.477328, 0.220805, 0.311095, -0.208697, 0.486566, 0.248694, 0.338924, -0.219519, 0.494811, 0.279015, 0.369757, -0.229766, 0.504065, 0.311725, 0.3996, -0.238879, 0.507909, 0.345844, 0.430484, -0.246802, 0.509805, 0.381749, 0.46413, -0.253924, 0.511436, 0.420251, 0.497077, -0.259319, 0.508787, 0.459957, 0.530434, -0.263297, 0.50394, 0.501356, 0.565725, -0.265619, 0.49804, 0.544252, 0.599254, -0.265842, 0.487346, 0.587856, 0.631251, -0.263978, 0.472975, 0.631969, 0.663972, -0.26043, 0.457135, 0.677471, 0.697724, -0.255358, 0.439844, 0.723744, 0.727725, -0.248308, 0.417872, 0.770653, 0.756417, -0.239181, 0.39273, 0.817357, 0.785419, -0.22814, 0.367839, 0.864221, 0.81266, -0.215681, 0.339449, 0.912701, 0.839391, -0.201623, 0.309279, 0.962419, 0.86366, -0.185624, 0.278029, 1.0122, 0.885028, -0.16797, 0.245294, 1.06186, 0.904639, -0.148336, 0.212689, 1.10934, 0.922048, -0.12637, 0.179616, 1.15063, 0.936952, -0.102928, 0.146749, 1.18885, 0.951895, -0.0785268, 0.112733, 1.22352, 0.967198, -0.0530153, 0.0760056, 1.25681, 0.984405, -0.02649, 0.0383183, 1.28762, 1.00021, 0.00070019, -0.00020039, 1.31656, 0.0325964, -3.55447e-6, 0.176706, 6.55682e-7, 0.0329333, -8.99174e-5, 0.178527, 1.65869e-5, 0.0329181, -0.000359637, 0.178453, 6.63498e-5, 0.0329085, -0.000808991, 0.178383, 0.000149332, 0.0329181, -0.00143826, 0.178394, 0.000265873, 0.0329425, -0.00224678, 0.178517, 0.000416597, 0.0329511, -0.00323575, 0.17849, 0.000603299, 0.033011, -0.00439875, 0.178695, 0.000829422, 0.0330733, -0.00574059, 0.178843, 0.00109908, 0.0331857, -0.00725896, 0.179176, 0.00141933, 0.0333445, -0.00895289, 0.179618, 0.0017999, 0.0335674, -0.0108219, 0.180238, 0.00225316, 0.033939, -0.0128687, 0.181417, 0.00279765, 0.0345239, -0.015114, 0.183395, 0.0034564, 0.0354458, -0.017596, 0.186616, 0.00425864, 0.0368313, -0.0203524, 0.191547, 0.00524936, 0.0386115, -0.0234105, 0.197508, 0.00647033, 0.0410303, -0.0268509, 0.205395, 0.00798121, 0.0442245, -0.0307481, 0.215365, 0.0098557, 0.0478659, -0.0350863, 0.225595, 0.0121417, 0.0522416, -0.0399506, 0.236946, 0.0149385, 0.0574513, -0.045357, 0.249442, 0.0183189, 0.0631208, -0.0512863, 0.261222, 0.0223644, 0.0701124, -0.0579273, 0.275418, 0.0272418, 0.0777331, -0.0650652, 0.288989, 0.0329458, 0.0862709, -0.0728813, 0.302546, 0.0396819, 0.096103, -0.081363, 0.317164, 0.04757, 0.106976, -0.0904463, 0.331733, 0.0567012, 0.119175, -0.100105, 0.34661, 0.067202, 0.132919, -0.110375, 0.362249, 0.0792588, 0.147727, -0.121115, 0.376978, 0.0928672, 0.163618, -0.132299, 0.390681, 0.108228, 0.182234, -0.143887, 0.406571, 0.125502, 0.201809, -0.155827, 0.42042, 0.144836, 0.225041, -0.168357, 0.438411, 0.166706, 0.247621, -0.18004, 0.450368, 0.189909, 0.27097, -0.191536, 0.460083, 0.215251, 0.296658, -0.203024, 0.469765, 0.243164, 0.325892, -0.214056, 0.481837, 0.273388, 0.35406, -0.224104, 0.487474, 0.305344, 0.384372, -0.233489, 0.492773, 0.339741, 0.41749, -0.241874, 0.498451, 0.376287, 0.45013, -0.248834, 0.499632, 0.414195, 0.481285, -0.254658, 0.495233, 0.454077, 0.519183, -0.259367, 0.496401, 0.496352, 0.551544, -0.261818, 0.487686, 0.538798, 0.587349, -0.262964, 0.479453, 0.583626, 0.621679, -0.262128, 0.467709, 0.629451, 0.654991, -0.258998, 0.452123, 0.67566, 0.686873, -0.254119, 0.433495, 0.723248, 0.719801, -0.246946, 0.413657, 0.771156, 0.750355, -0.237709, 0.390366, 0.81989, 0.780033, -0.226549, 0.364947, 0.868601, 0.809254, -0.214186, 0.337256, 0.920034, 0.836576, -0.199639, 0.307395, 0.971706, 0.861774, -0.183169, 0.275431, 1.02479, 0.885707, -0.165111, 0.243431, 1.07837, 0.904742, -0.144363, 0.210921, 1.12783, 0.915604, -0.121305, 0.17647, 1.17254, 0.930959, -0.0962119, 0.143106, 1.21012, 0.948404, -0.069969, 0.108112, 1.24474, 0.967012, -0.0427586, 0.0708478, 1.27718, 0.984183, -0.0147043, 0.032335, 1.3083, 0.999577, 0.0142165, -0.00726867, 1.3382, 0.0229227, -2.99799e-6, 0.148623, 4.62391e-7, 0.0232194, -7.58796e-5, 0.15054, 1.17033e-5, 0.0232315, -0.000303636, 0.15063, 4.68397e-5, 0.0232354, -0.000683189, 0.150624, 0.000105472, 0.0232092, -0.0012136, 0.150445, 0.000187744, 0.0232523, -0.00189765, 0.150679, 0.000294847, 0.0232828, -0.00273247, 0.150789, 0.000428013, 0.0233371, -0.00371287, 0.150995, 0.000591134, 0.0234015, -0.00484794, 0.15118, 0.000787642, 0.023514, -0.00612877, 0.151562, 0.00102547, 0.023679, -0.00756125, 0.152116, 0.00131351, 0.0239559, -0.00914651, 0.153162, 0.00166594, 0.0244334, -0.010904, 0.155133, 0.00210182, 0.025139, -0.0128615, 0.158035, 0.00264406, 0.0262598, -0.0150628, 0.162751, 0.00332923, 0.0277875, -0.0175532, 0.168944, 0.00419773, 0.0298472, -0.0203981, 0.176835, 0.00530034, 0.0325444, -0.023655, 0.186686, 0.00669777, 0.0355581, -0.0272982, 0.196248, 0.00842661, 0.0392841, -0.0314457, 0.207352, 0.0105854, 0.0436815, -0.0361157, 0.219279, 0.0132458, 0.0485272, -0.0412932, 0.230728, 0.0164736, 0.0541574, -0.0470337, 0.242994, 0.0203715, 0.0609479, -0.0535002, 0.257042, 0.0250953, 0.0685228, -0.0605409, 0.27102, 0.0306856, 0.0768042, -0.0680553, 0.28406, 0.037193, 0.0864844, -0.0765011, 0.299186, 0.0449795, 0.0969415, -0.0852674, 0.3132, 0.0538316, 0.108478, -0.0947333, 0.327138, 0.0641149, 0.121705, -0.10481, 0.342345, 0.0759185, 0.136743, -0.115474, 0.358472, 0.0894116, 0.152986, -0.126536, 0.374067, 0.104562, 0.170397, -0.138061, 0.388267, 0.121632, 0.191392, -0.150203, 0.406467, 0.140996, 0.211566, -0.161751, 0.418641, 0.161696, 0.233567, -0.173407, 0.430418, 0.184557, 0.257769, -0.185397, 0.44277, 0.210092, 0.28531, -0.197048, 0.457191, 0.237827, 0.311726, -0.20784, 0.464712, 0.267253, 0.340537, -0.218345, 0.472539, 0.299332, 0.372921, -0.228306, 0.482331, 0.333988, 0.402924, -0.236665, 0.484378, 0.369722, 0.434475, -0.244097, 0.484717, 0.407836, 0.469736, -0.250547, 0.487093, 0.448465, 0.505045, -0.25511, 0.485575, 0.490263, 0.540262, -0.258444, 0.481225, 0.534495, 0.576347, -0.259903, 0.473481, 0.579451, 0.608656, -0.259572, 0.4603, 0.625604, 0.646679, -0.257908, 0.450341, 0.674511, 0.679902, -0.253663, 0.431561, 0.723269, 0.714159, -0.247419, 0.412684, 0.773263, 0.745345, -0.239122, 0.389388, 0.824182, 0.778248, -0.228837, 0.365361, 0.876634, 0.807208, -0.216197, 0.337667, 0.92945, 0.835019, -0.201772, 0.307197, 0.985261, 0.860261, -0.185291, 0.274205, 1.04299, 0.877601, -0.165809, 0.240178, 1.09816, 0.898211, -0.143897, 0.207571, 1.14694, 0.915789, -0.119513, 0.174904, 1.19008, 0.931831, -0.0932919, 0.141423, 1.2297, 0.949244, -0.0656528, 0.105603, 1.26553, 0.967527, -0.0370262, 0.0679551, 1.29986, 0.984139, -0.00730117, 0.0283133, 1.33252, 0.999713, 0.0234648, -0.0121785, 1.36397, 0.0152135, -2.45447e-6, 0.122795, 3.04092e-7, 0.0151652, -6.15778e-5, 0.122399, 7.6292e-6, 0.0151181, -0.000245948, 0.122023, 3.04802e-5, 0.0151203, -0.000553394, 0.12203, 6.86634e-5, 0.015125, -0.000983841, 0.122037, 0.000122463, 0.0151427, -0.00153774, 0.12214, 0.000192706, 0.0151708, -0.0022103, 0.122237, 0.000281219, 0.0152115, -0.00300741, 0.12238, 0.000390804, 0.0152877, -0.00392494, 0.1227, 0.000526317, 0.015412, -0.00496597, 0.123244, 0.00069443, 0.0156201, -0.00613314, 0.124228, 0.00090547, 0.0159658, -0.00744113, 0.125945, 0.0011732, 0.0165674, -0.00892546, 0.129098, 0.00151888, 0.017487, -0.010627, 0.133865, 0.00197007, 0.018839, -0.0126043, 0.140682, 0.0025637, 0.020554, -0.0148814, 0.148534, 0.00333637, 0.0226727, -0.0175123, 0.157381, 0.00433738, 0.0251879, -0.0205266, 0.166685, 0.00561664, 0.0283635, -0.0240319, 0.177796, 0.00725563, 0.0318694, -0.0279432, 0.188251, 0.00928811, 0.0361044, -0.0324313, 0.200038, 0.011835, 0.0406656, -0.0373527, 0.210685, 0.0149146, 0.0463846, -0.0430132, 0.224182, 0.0187254, 0.0525696, -0.0491013, 0.23634, 0.0232283, 0.0598083, -0.0559175, 0.250013, 0.0286521, 0.0679437, -0.0633657, 0.263981, 0.0350634, 0.0771181, -0.0714602, 0.278072, 0.0425882, 0.0881273, -0.0803502, 0.29511, 0.0514487, 0.0996628, -0.0896903, 0.309976, 0.0615766, 0.112702, -0.099644, 0.325611, 0.0732139, 0.126488, -0.109829, 0.339321, 0.0862324, 0.142625, -0.120859, 0.35574, 0.101275, 0.15953, -0.131956, 0.369845, 0.117892, 0.176991, -0.143145, 0.38146, 0.136205, 0.199715, -0.155292, 0.40052, 0.157252, 0.220787, -0.167066, 0.412055, 0.179966, 0.243697, -0.178396, 0.423133, 0.204418, 0.272106, -0.190433, 0.439524, 0.232141, 0.297637, -0.201265, 0.447041, 0.261109, 0.325273, -0.211834, 0.454488, 0.292627, 0.357219, -0.221889, 0.465004, 0.326669, 0.387362, -0.230729, 0.468527, 0.362426, 0.423131, -0.23924, 0.475836, 0.401533, 0.45543, -0.246067, 0.475017, 0.441902, 0.493393, -0.251557, 0.478017, 0.484239, 0.526253, -0.255571, 0.4709, 0.528586, 0.560554, -0.257752, 0.463167, 0.574346, 0.599306, -0.258076, 0.456452, 0.621655, 0.634541, -0.256471, 0.443725, 0.670492, 0.668907, -0.253283, 0.428719, 0.721943, 0.705619, -0.247562, 0.411348, 0.772477, 0.739034, -0.240626, 0.388939, 0.8264, 0.771408, -0.231493, 0.36425, 0.881702, 0.803312, -0.220125, 0.337321, 0.9385, 0.828457, -0.206645, 0.305364, 0.997437, 0.854819, -0.190664, 0.273715, 1.05693, 0.878666, -0.171429, 0.242218, 1.11251, 0.898404, -0.149235, 0.209556, 1.16398, 0.917416, -0.12435, 0.176863, 1.21014, 0.933133, -0.0972703, 0.142775, 1.25178, 0.95066, -0.0683607, 0.106735, 1.29028, 0.968589, -0.0378724, 0.0681609, 1.32703, 0.984776, -0.00605712, 0.0273966, 1.36158, 0.99994, 0.0263276, -0.0138124, 1.3943, 0.00867437, -1.86005e-6, 0.0928979, 1.73682e-7, 0.00864003, -4.66389e-5, 0.0925237, 4.35505e-6, 0.00864593, -0.000186594, 0.0925806, 1.74322e-5, 0.00864095, -0.000419639, 0.0924903, 3.92862e-5, 0.00863851, -0.000746272, 0.0924589, 7.02598e-5, 0.00868531, -0.00116456, 0.0929, 0.000111188, 0.00869667, -0.00167711, 0.0928529, 0.000163867, 0.00874332, -0.00228051, 0.0930914, 0.00023104, 0.00882709, -0.00297864, 0.0935679, 0.00031741, 0.00898874, -0.00377557, 0.0946165, 0.000430186, 0.00929346, -0.00469247, 0.0967406, 0.000580383, 0.00978271, -0.00575491, 0.100084, 0.000783529, 0.0105746, -0.00701514, 0.105447, 0.00106304, 0.0116949, -0.00851797, 0.112494, 0.00144685, 0.0130419, -0.0102757, 0.119876, 0.00196439, 0.0148375, -0.012381, 0.129034, 0.00266433, 0.0168725, -0.01482, 0.137812, 0.00358364, 0.0193689, -0.0176563, 0.147696, 0.00478132, 0.0222691, -0.0209211, 0.157795, 0.00631721, 0.0256891, -0.0246655, 0.168431, 0.00826346, 0.0294686, -0.0288597, 0.178587, 0.0106714, 0.0340412, -0.0336441, 0.190251, 0.0136629, 0.0393918, -0.039033, 0.202999, 0.0173272, 0.0453947, -0.0450087, 0.215655, 0.0217448, 0.0521936, -0.0515461, 0.228686, 0.0269941, 0.0600279, -0.058817, 0.242838, 0.033272, 0.0692398, -0.0667228, 0.258145, 0.0406457, 0.0793832, -0.0752401, 0.273565, 0.0492239, 0.0902297, -0.0841851, 0.287735, 0.0590105, 0.102014, -0.0936479, 0.301161, 0.0702021, 0.116054, -0.103967, 0.317438, 0.0832001, 0.13191, -0.114622, 0.334166, 0.0977951, 0.148239, -0.125452, 0.348192, 0.113985, 0.165809, -0.136453, 0.361094, 0.131928, 0.184616, -0.147648, 0.373534, 0.151811, 0.207491, -0.159607, 0.39101, 0.174476, 0.230106, -0.171119, 0.402504, 0.198798, 0.257036, -0.182906, 0.418032, 0.225796, 0.281172, -0.193605, 0.425468, 0.254027, 0.312034, -0.204771, 0.440379, 0.285713, 0.340402, -0.214988, 0.445406, 0.319196, 0.370231, -0.224711, 0.44968, 0.35537, 0.407105, -0.233516, 0.460747, 0.393838, 0.439037, -0.240801, 0.460624, 0.433747, 0.47781, -0.24762, 0.465957, 0.477234, 0.510655, -0.251823, 0.460054, 0.52044, 0.550584, -0.255552, 0.459172, 0.567853, 0.585872, -0.257036, 0.450311, 0.615943, 0.620466, -0.257535, 0.437763, 0.667693, 0.660496, -0.255248, 0.426639, 0.718988, 0.695578, -0.251141, 0.409185, 0.772503, 0.732176, -0.244718, 0.39015, 0.827023, 0.760782, -0.236782, 0.362594, 0.885651, 0.79422, -0.225923, 0.33711, 0.943756, 0.824521, -0.213855, 0.308272, 1.00874, 0.854964, -0.197723, 0.278529, 1.06764, 0.878065, -0.179209, 0.246208, 1.12836, 0.899834, -0.157569, 0.21329, 1.18318, 0.918815, -0.133206, 0.181038, 1.23161, 0.934934, -0.106545, 0.146993, 1.27644, 0.952115, -0.0780574, 0.111175, 1.31842, 0.96906, -0.0478279, 0.0728553, 1.35839, 0.985178, -0.0160014, 0.032579, 1.39697, 1.00039, 0.0173126, -0.0095256, 1.43312, 0.00384146, -1.24311e-6, 0.0613583, 7.78271e-8, 0.00390023, -3.14043e-5, 0.0622919, 1.96626e-6, 0.00389971, -0.000125622, 0.0622632, 7.87379e-6, 0.00389491, -0.000282352, 0.0620659, 1.778e-5, 0.00391618, -0.000502512, 0.0624687, 3.20918e-5, 0.00392662, -0.000784458, 0.0625113, 5.15573e-5, 0.00396053, -0.00112907, 0.0628175, 7.78668e-5, 0.00401911, -0.00153821, 0.0633286, 0.000113811, 0.00414994, -0.0020208, 0.0646443, 0.00016445, 0.00441223, -0.00260007, 0.0673886, 0.000237734, 0.00484427, -0.0033097, 0.0716528, 0.000345929, 0.00549109, -0.00418966, 0.0774998, 0.000505987, 0.00636293, -0.00527331, 0.0844758, 0.000739208, 0.00746566, -0.00660428, 0.0921325, 0.00107347, 0.00876625, -0.00818826, 0.0997067, 0.00153691, 0.0103125, -0.0100811, 0.107433, 0.00217153, 0.0123309, -0.0123643, 0.117088, 0.00303427, 0.0146274, -0.0150007, 0.126438, 0.00416018, 0.0172295, -0.0180531, 0.135672, 0.00561513, 0.0204248, -0.0215962, 0.146244, 0.007478, 0.0241597, -0.0256234, 0.157481, 0.00981046, 0.0284693, -0.0302209, 0.169125, 0.0127148, 0.033445, -0.0353333, 0.181659, 0.0162453, 0.0391251, -0.0410845, 0.1944, 0.0205417, 0.0454721, -0.0473451, 0.207082, 0.0256333, 0.0530983, -0.0542858, 0.221656, 0.0317036, 0.0615356, -0.0618384, 0.236036, 0.0388319, 0.0703363, -0.0697631, 0.248398, 0.046974, 0.0810391, -0.0784757, 0.263611, 0.0565246, 0.0920144, -0.0873488, 0.275857, 0.0671724, 0.105584, -0.0973652, 0.292555, 0.0798105, 0.119506, -0.107271, 0.306333, 0.0935945, 0.134434, -0.117608, 0.318888, 0.109106, 0.153399, -0.128938, 0.337552, 0.127074, 0.171258, -0.139944, 0.349955, 0.14643, 0.191059, -0.151288, 0.361545, 0.168, 0.215069, -0.163018, 0.378421, 0.192082, 0.237838, -0.174226, 0.38879, 0.217838, 0.266965, -0.186063, 0.405857, 0.246931, 0.292827, -0.196909, 0.414146, 0.277505, 0.324352, -0.207473, 0.426955, 0.310711, 0.354427, -0.217713, 0.433429, 0.346794, 0.389854, -0.227183, 0.443966, 0.385237, 0.420749, -0.235131, 0.44471, 0.424955, 0.459597, -0.242786, 0.451729, 0.468446, 0.495316, -0.248767, 0.45072, 0.513422, 0.534903, -0.253351, 0.450924, 0.560618, 0.572369, -0.256277, 0.445266, 0.609677, 0.612383, -0.2576, 0.438798, 0.660995, 0.644037, -0.256931, 0.421693, 0.713807, 0.686749, -0.254036, 0.4109, 0.767616, 0.719814, -0.249785, 0.390151, 0.82533, 0.754719, -0.244283, 0.367847, 0.888311, 0.792022, -0.235076, 0.345013, 0.948177, 0.822404, -0.225061, 0.316193, 1.01661, 0.853084, -0.211113, 0.287013, 1.08075, 0.879871, -0.19449, 0.255424, 1.14501, 0.901655, -0.174023, 0.222879, 1.20203, 0.919957, -0.1509, 0.18989, 1.25698, 0.938412, -0.124923, 0.15606, 1.30588, 0.953471, -0.0968139, 0.120512, 1.3529, 0.970451, -0.066734, 0.0828515, 1.3986, 0.985522, -0.034734, 0.0424458, 1.44148, 1.00099, -0.00102222, 0.000678929, 1.48398, 0.000965494, -6.27338e-7, 0.0306409, 1.97672e-8, 0.00099168, -1.58573e-5, 0.0314638, 4.99803e-7, 0.000991068, -6.34012e-5, 0.031363, 2.00682e-6, 0.000974567, -0.00014144, 0.03036, 4.57312e-6, 0.000998079, -0.000252812, 0.031496, 8.60131e-6, 0.00102243, -0.000396506, 0.0319955, 1.48288e-5, 0.00107877, -0.000577593, 0.0331376, 2.49141e-5, 0.00121622, -0.000816816, 0.0359396, 4.23011e-5, 0.0014455, -0.00113761, 0.0399652, 7.24613e-5, 0.00178791, -0.00156959, 0.0450556, 0.000123929, 0.00225668, -0.00214064, 0.0508025, 0.000208531, 0.00285627, -0.00287655, 0.0568443, 0.000341969, 0.0035991, -0.00380271, 0.0630892, 0.000544158, 0.00455524, -0.00496264, 0.0702204, 0.000842423, 0.00569143, -0.0063793, 0.0773426, 0.00126704, 0.00716928, -0.00813531, 0.0860839, 0.00186642, 0.00885307, -0.0101946, 0.0944079, 0.00267014, 0.0109316, -0.0126386, 0.103951, 0.00374033, 0.0133704, -0.0154876, 0.113786, 0.0051304, 0.0161525, -0.0187317, 0.123477, 0.00688858, 0.0194267, -0.0224652, 0.133986, 0.00910557, 0.0230967, -0.0265976, 0.143979, 0.0118074, 0.0273627, -0.0312848, 0.154645, 0.0151266, 0.0323898, -0.0365949, 0.166765, 0.0191791, 0.0379225, -0.0422914, 0.177932, 0.0239236, 0.0447501, -0.0487469, 0.19167, 0.0296568, 0.0519391, -0.0556398, 0.203224, 0.0362924, 0.0599464, -0.0631646, 0.215652, 0.0440585, 0.0702427, -0.0714308, 0.232089, 0.0531619, 0.0806902, -0.0800605, 0.245258, 0.0634564, 0.0923194, -0.0892815, 0.258609, 0.0752481, 0.106938, -0.09931, 0.276654, 0.0888914, 0.121238, -0.109575, 0.289847, 0.104055, 0.138817, -0.120461, 0.307566, 0.121266, 0.15595, -0.131209, 0.320117, 0.139944, 0.178418, -0.143049, 0.339677, 0.161591, 0.197875, -0.154074, 0.349886, 0.184303, 0.224368, -0.166307, 0.369352, 0.210669, 0.252213, -0.178051, 0.386242, 0.238895, 0.277321, -0.189335, 0.395294, 0.269182, 0.310332, -0.200683, 0.412148, 0.302508, 0.338809, -0.210856, 0.418266, 0.337264, 0.372678, -0.220655, 0.428723, 0.374881, 0.405632, -0.230053, 0.433887, 0.415656, 0.442293, -0.237993, 0.439911, 0.457982, 0.477256, -0.244897, 0.440175, 0.502831, 0.515592, -0.250657, 0.441079, 0.550277, 0.550969, -0.255459, 0.435219, 0.601102, 0.592883, -0.257696, 0.432882, 0.651785, 0.629092, -0.259894, 0.421054, 0.708961, 0.672033, -0.258592, 0.41177, 0.763806, 0.709147, -0.256525, 0.395267, 0.824249, 0.745367, -0.254677, 0.375013, 0.8951, 0.784715, -0.247892, 0.353906, 0.959317, 0.818107, -0.240162, 0.327801, 1.03153, 0.847895, -0.229741, 0.298821, 1.10601, 0.879603, -0.213084, 0.269115, 1.164, 0.902605, -0.195242, 0.236606, 1.22854, 0.922788, -0.174505, 0.203442, 1.29017, 0.944831, -0.150169, 0.169594, 1.34157, 0.959656, -0.124099, 0.135909, 1.3956, 0.972399, -0.0960626, 0.0990563, 1.45128, 0.986549, -0.0657097, 0.0602348, 1.50312, 1.00013, -0.0333558, 0.0186694, 1.55364, 6.19747e-6, -1e-7, 0.00778326, 7.96756e-11, 2.37499e-8, -9.99999e-8, 2.82592e-5, 1.14596e-10, 1.00292e-6, -1.66369e-6, 0.000250354, 6.77492e-9, 3.50752e-6, -6.37769e-6, 0.000357289, 6.31655e-8, 8.26445e-6, -1.74689e-5, 0.000516179, 3.1851e-7, 2.42481e-5, -4.50868e-5, 0.0010223, 1.30577e-6, 4.55631e-5, -8.9044e-5, 0.00144302, 3.74587e-6, 9.71222e-5, -0.000178311, 0.00241912, 1.02584e-5, 0.000171403, -0.000313976, 0.00354938, 2.36481e-5, 0.000292747, -0.000520026, 0.00513765, 4.96014e-5, 0.000789827, -0.00118187, 0.0238621, 0.000139056, 0.00114093, -0.00171827, 0.0286691, 0.000244093, 0.00176119, -0.00249667, 0.0368565, 0.000420623, 0.0022233, -0.00333742, 0.0400469, 0.00065673, 0.00343382, -0.00481976, 0.0535751, 0.00109323, 0.00427602, -0.00600755, 0.057099, 0.00155268, 0.00461435, -0.00737637, 0.0551084, 0.00215031, 0.00695698, -0.00971401, 0.0715767, 0.00316529, 0.00867619, -0.0120943, 0.0793314, 0.00436995, 0.0106694, -0.0148202, 0.0869391, 0.0058959, 0.0140351, -0.0183501, 0.101572, 0.00798757, 0.0168939, -0.022006, 0.11018, 0.0104233, 0.020197, -0.0261568, 0.119041, 0.0134167, 0.0254702, -0.0312778, 0.135404, 0.0173009, 0.0298384, -0.0362469, 0.1437, 0.0215428, 0.035159, -0.042237, 0.15512, 0.0268882, 0.0427685, -0.0488711, 0.17128, 0.033235, 0.0494848, -0.0557997, 0.181813, 0.0404443, 0.0592394, -0.0635578, 0.198745, 0.0490043, 0.0681463, -0.071838, 0.210497, 0.0588239, 0.0804753, -0.0809297, 0.228864, 0.0702835, 0.0942205, -0.0906488, 0.247008, 0.0834012, 0.106777, -0.100216, 0.258812, 0.0975952, 0.124471, -0.110827, 0.278617, 0.114162, 0.138389, -0.121193, 0.287049, 0.131983, 0.159543, -0.13253, 0.307151, 0.152541, 0.176432, -0.143611, 0.31564, 0.174673, 0.201723, -0.15548, 0.33538, 0.199842, 0.229721, -0.167166, 0.355256, 0.227097, 0.250206, -0.178238, 0.360047, 0.256014, 0.282118, -0.189905, 0.378761, 0.28855, 0.312821, -0.201033, 0.39181, 0.323348, 0.341482, -0.211584, 0.397716, 0.360564, 0.377368, -0.221314, 0.410141, 0.400004, 0.418229, -0.230474, 0.423485, 0.442371, 0.444881, -0.239443, 0.418874, 0.488796, 0.488899, -0.245987, 0.427545, 0.535012, 0.520317, -0.253948, 0.422147, 0.589678, 0.568566, -0.256616, 0.42719, 0.637683, 0.599607, -0.26376, 0.415114, 0.703363, 0.64222, -0.268687, 0.408715, 0.771363, 0.685698, -0.2694, 0.399722, 0.83574, 0.732327, -0.266642, 0.388651, 0.897764, 0.769873, -0.267712, 0.369198, 0.983312, 0.806733, -0.263479, 0.346802, 1.06222, 0.843466, -0.254575, 0.321368, 1.13477, 0.873008, -0.242749, 0.29211, 1.20712, 0.908438, -0.22725, 0.262143, 1.27465, 0.936321, -0.207621, 0.228876, 1.33203, 0.950353, -0.187932, 0.19484, 1.40439, 0.96442, -0.165154, 0.163178, 1.4732, 0.979856, -0.139302, 0.127531, 1.53574, 0.982561, -0.11134, 0.0903457, 1.59982, 0.996389, -0.0808124, 0.0489007, 1.6577];
        const LTC_MAT_2 = [1, 0, 0, 0, 1, 7.91421e-31, 0, 0, 1, 1.04392e-24, 0, 0, 1, 3.49405e-21, 0, 0, 1, 1.09923e-18, 0, 0, 1, 9.47414e-17, 0, 0, 1, 3.59627e-15, 0, 0, 1, 7.72053e-14, 0, 0, 1, 1.08799e-12, 0, 0, 1, 1.10655e-11, 0, 0, 1, 8.65818e-11, 0, 0, 0.999998, 5.45037e-10, 0, 0, 0.999994, 2.85095e-9, 0, 0, 0.999989, 1.26931e-8, 0, 0, 0.999973, 4.89938e-8, 0, 0, 0.999947, 1.66347e-7, 0, 0, 0.999894, 5.02694e-7, 0, 0, 0.999798, 1.36532e-6, 0, 0, 0.999617, 3.35898e-6, 0, 0, 0.999234, 7.52126e-6, 0, 0, 0.998258, 1.52586e-5, 0, 0, 0.99504, 2.66207e-5, 0, 0, 0.980816, 2.36802e-5, 0, 0, 0.967553, 2.07684e-6, 0, 0, 0.966877, 4.03733e-6, 0, 0, 0.965752, 7.41174e-6, 0, 0, 0.96382, 1.27746e-5, 0, 0, 0.960306, 2.02792e-5, 0, 0, 0.953619, 2.80232e-5, 0, 0, 0.941103, 2.78816e-5, 0, 0, 0.926619, 1.60221e-5, 0, 0, 0.920983, 2.35164e-5, 0, 0, 0.912293, 3.11924e-5, 0, 0.0158731, 0.899277, 3.48118e-5, 0, 0.0476191, 0.880884, 2.6041e-5, 0, 0.0793651, 0.870399, 3.38726e-5, 0, 0.111111, 0.856138, 3.92906e-5, 0, 0.142857, 0.837436, 3.72874e-5, 0, 0.174603, 0.820973, 3.92558e-5, 0, 0.206349, 0.803583, 4.34658e-5, 0, 0.238095, 0.782168, 4.0256e-5, 0, 0.269841, 0.764107, 4.48159e-5, 0, 0.301587, 0.743092, 4.57627e-5, 0, 0.333333, 0.721626, 4.55314e-5, 0, 0.365079, 0.700375, 4.77335e-5, 0, 0.396825, 0.677334, 4.61072e-5, 0, 0.428571, 0.655702, 4.84393e-5, 0, 0.460317, 0.632059, 4.64583e-5, 0, 0.492064, 0.610125, 4.83923e-5, 0, 0.52381, 0.58653, 4.64342e-5, 0, 0.555556, 0.564508, 4.77033e-5, 0, 0.587302, 0.541405, 4.59263e-5, 0, 0.619048, 0.519556, 4.6412e-5, 0, 0.650794, 0.497292, 4.48913e-5, 0, 0.68254, 0.475898, 4.45789e-5, 0, 0.714286, 0.454722, 4.33496e-5, 0, 0.746032, 0.434042, 4.23054e-5, 0, 0.777778, 0.414126, 4.13737e-5, 0, 0.809524, 0.394387, 3.97265e-5, 0, 0.84127, 0.375841, 3.90709e-5, 0, 0.873016, 0.357219, 3.69938e-5, 0, 0.904762, 0.340084, 3.65618e-5, 0, 0.936508, 0.322714, 3.42533e-5, 0, 0.968254, 0.306974, 3.39596e-5, 0, 1, 1, 1.01524e-18, 0, 0, 1, 1.0292e-18, 0, 0, 1, 1.30908e-18, 0, 0, 1, 4.73331e-18, 0, 0, 1, 6.25319e-17, 0, 0, 1, 1.07932e-15, 0, 0, 1, 1.63779e-14, 0, 0, 1, 2.03198e-13, 0, 0, 1, 2.04717e-12, 0, 0, 0.999999, 1.68995e-11, 0, 0, 0.999998, 1.15855e-10, 0, 0, 0.999996, 6.6947e-10, 0, 0, 0.999991, 3.30863e-9, 0, 0, 0.999983, 1.41737e-8, 0, 0, 0.999968, 5.32626e-8, 0, 0, 0.99994, 1.77431e-7, 0, 0, 0.999891, 5.28835e-7, 0, 0, 0.999797, 1.42169e-6, 0, 0, 0.999617, 3.47057e-6, 0, 0, 0.999227, 7.7231e-6, 0, 0, 0.998239, 1.55753e-5, 0, 0, 0.994937, 2.68495e-5, 0, 0, 0.980225, 2.13742e-5, 0, 0, 0.967549, 2.1631e-6, 0, 0, 0.966865, 4.17989e-6, 0, 0, 0.965739, 7.63341e-6, 0, 0, 0.963794, 1.30892e-5, 0, 0, 0.960244, 2.06456e-5, 0, 0, 0.953495, 2.82016e-5, 0, 0.000148105, 0.940876, 2.71581e-5, 0, 0.002454, 0.926569, 1.64159e-5, 0, 0.00867491, 0.920905, 2.39521e-5, 0, 0.01956, 0.912169, 3.15127e-5, 0, 0.035433, 0.899095, 3.46626e-5, 0, 0.056294, 0.882209, 2.90223e-5, 0, 0.0818191, 0.870272, 3.42992e-5, 0, 0.111259, 0.855977, 3.94164e-5, 0, 0.142857, 0.837431, 3.72343e-5, 0, 0.174603, 0.820826, 3.96691e-5, 0, 0.206349, 0.803408, 4.35395e-5, 0, 0.238095, 0.782838, 4.19579e-5, 0, 0.269841, 0.763941, 4.50953e-5, 0, 0.301587, 0.742904, 4.55847e-5, 0, 0.333333, 0.721463, 4.58833e-5, 0, 0.365079, 0.700197, 4.77159e-5, 0, 0.396825, 0.677501, 4.70641e-5, 0, 0.428571, 0.655527, 4.84732e-5, 0, 0.460317, 0.6324, 4.76834e-5, 0, 0.492064, 0.609964, 4.84213e-5, 0, 0.52381, 0.586839, 4.75541e-5, 0, 0.555556, 0.564353, 4.76951e-5, 0, 0.587302, 0.541589, 4.67611e-5, 0, 0.619048, 0.519413, 4.63493e-5, 0, 0.650794, 0.497337, 4.53994e-5, 0, 0.68254, 0.475797, 4.45308e-5, 0, 0.714286, 0.454659, 4.35787e-5, 0, 0.746032, 0.434065, 4.24839e-5, 0, 0.777778, 0.414018, 4.1436e-5, 0, 0.809524, 0.39455, 4.01902e-5, 0, 0.84127, 0.375742, 3.90813e-5, 0, 0.873016, 0.357501, 3.77116e-5, 0, 0.904762, 0.339996, 3.6535e-5, 0, 0.936508, 0.323069, 3.51265e-5, 0, 0.968254, 0.306897, 3.39112e-5, 0, 1, 1, 1.0396e-15, 0, 0, 1, 1.04326e-15, 0, 0, 1, 1.10153e-15, 0, 0, 1, 1.44668e-15, 0, 0, 1, 3.4528e-15, 0, 0, 1, 1.75958e-14, 0, 0, 1, 1.2627e-13, 0, 0, 1, 9.36074e-13, 0, 0, 1, 6.45742e-12, 0, 0, 0.999998, 4.01228e-11, 0, 0, 0.999997, 2.22338e-10, 0, 0, 0.999995, 1.0967e-9, 0, 0, 0.999991, 4.82132e-9, 0, 0, 0.999981, 1.89434e-8, 0, 0, 0.999967, 6.67716e-8, 0, 0, 0.999938, 2.12066e-7, 0, 0, 0.999886, 6.0977e-7, 0, 0, 0.999792, 1.59504e-6, 0, 0, 0.999608, 3.81191e-6, 0, 0, 0.999209, 8.33727e-6, 0, 0, 0.998179, 1.65288e-5, 0, 0, 0.994605, 2.74387e-5, 0, 0, 0.979468, 1.67316e-5, 0, 0, 0.967529, 2.42877e-6, 0, 0, 0.966836, 4.61696e-6, 0, 0, 0.96569, 8.30977e-6, 0, 0, 0.963706, 1.40427e-5, 0, 2.44659e-6, 0.960063, 2.17353e-5, 0, 0.000760774, 0.953113, 2.86606e-5, 0, 0.00367261, 0.940192, 2.47691e-5, 0, 0.00940263, 0.927731, 1.95814e-5, 0, 0.018333, 0.920669, 2.52531e-5, 0, 0.0306825, 0.911799, 3.24277e-5, 0, 0.0465556, 0.89857, 3.40982e-5, 0, 0.0659521, 0.883283, 3.19622e-5, 0, 0.0887677, 0.86989, 3.5548e-5, 0, 0.114784, 0.855483, 3.97143e-5, 0, 0.143618, 0.837987, 3.91665e-5, 0, 0.174606, 0.820546, 4.11306e-5, 0, 0.206349, 0.802878, 4.36753e-5, 0, 0.238095, 0.783402, 4.44e-5, 0, 0.269841, 0.763439, 4.58726e-5, 0, 0.301587, 0.742925, 4.67097e-5, 0, 0.333333, 0.721633, 4.78887e-5, 0, 0.365079, 0.69985, 4.81251e-5, 0, 0.396825, 0.67783, 4.91811e-5, 0, 0.428571, 0.655126, 4.88199e-5, 0, 0.460318, 0.632697, 4.96025e-5, 0, 0.492064, 0.609613, 4.8829e-5, 0, 0.52381, 0.587098, 4.92754e-5, 0, 0.555556, 0.564119, 4.82625e-5, 0, 0.587302, 0.541813, 4.82807e-5, 0, 0.619048, 0.519342, 4.71552e-5, 0, 0.650794, 0.497514, 4.66765e-5, 0, 0.68254, 0.475879, 4.55582e-5, 0, 0.714286, 0.454789, 4.46007e-5, 0, 0.746032, 0.434217, 4.35382e-5, 0, 0.777778, 0.414086, 4.21753e-5, 0, 0.809524, 0.394744, 4.12093e-5, 0, 0.84127, 0.375782, 3.96634e-5, 0, 0.873016, 0.357707, 3.86419e-5, 0, 0.904762, 0.340038, 3.70345e-5, 0, 0.936508, 0.323284, 3.59725e-5, 0, 0.968254, 0.306954, 3.436e-5, 0, 1, 1, 5.99567e-14, 0, 0, 1, 6.00497e-14, 0, 0, 1, 6.14839e-14, 0, 0, 1, 6.86641e-14, 0, 0, 1, 9.72658e-14, 0, 0, 1, 2.21271e-13, 0, 0, 1, 8.33195e-13, 0, 0, 1, 4.03601e-12, 0, 0, 0.999999, 2.06001e-11, 0, 0, 0.999998, 1.01739e-10, 0, 0, 0.999997, 4.70132e-10, 0, 0, 0.999993, 2.00436e-9, 0, 0, 0.999988, 7.83682e-9, 0, 0, 0.999979, 2.80338e-8, 0, 0, 0.999962, 9.17033e-8, 0, 0, 0.999933, 2.74514e-7, 0, 0, 0.999881, 7.53201e-7, 0, 0, 0.999783, 1.89826e-6, 0, 0, 0.999594, 4.40279e-6, 0, 0, 0.999178, 9.3898e-6, 0, 0, 0.998073, 1.81265e-5, 0, 0, 0.993993, 2.80487e-5, 0, 0, 0.979982, 1.49422e-5, 0, 0, 0.968145, 3.78481e-6, 0, 0, 0.966786, 5.3771e-6, 0, 0, 0.965611, 9.47508e-6, 0, 3.88934e-5, 0.963557, 1.56616e-5, 0, 0.0009693, 0.959752, 2.35144e-5, 0, 0.00370329, 0.952461, 2.91568e-5, 0, 0.00868428, 0.940193, 2.40102e-5, 0, 0.0161889, 0.929042, 2.31235e-5, 0, 0.0263948, 0.920266, 2.73968e-5, 0, 0.0394088, 0.911178, 3.37915e-5, 0, 0.0552818, 0.897873, 3.33629e-5, 0, 0.0740138, 0.884053, 3.51405e-5, 0, 0.0955539, 0.869455, 3.78034e-5, 0, 0.119795, 0.854655, 3.99378e-5, 0, 0.14656, 0.838347, 4.19108e-5, 0, 0.175573, 0.820693, 4.40831e-5, 0, 0.206388, 0.802277, 4.45599e-5, 0, 0.238095, 0.783634, 4.72691e-5, 0, 0.269841, 0.763159, 4.76984e-5, 0, 0.301587, 0.742914, 4.91487e-5, 0, 0.333333, 0.721662, 5.02312e-5, 0, 0.365079, 0.699668, 5.02817e-5, 0, 0.396825, 0.677839, 5.1406e-5, 0, 0.428571, 0.655091, 5.11095e-5, 0, 0.460317, 0.632665, 5.16067e-5, 0, 0.492064, 0.609734, 5.12255e-5, 0, 0.52381, 0.587043, 5.10263e-5, 0, 0.555556, 0.564298, 5.0565e-5, 0, 0.587302, 0.541769, 4.97951e-5, 0, 0.619048, 0.519529, 4.92698e-5, 0, 0.650794, 0.497574, 4.82066e-5, 0, 0.68254, 0.476028, 4.73689e-5, 0, 0.714286, 0.454961, 4.61941e-5, 0, 0.746032, 0.434341, 4.50618e-5, 0, 0.777778, 0.414364, 4.38355e-5, 0, 0.809524, 0.394832, 4.24196e-5, 0, 0.84127, 0.376109, 4.12563e-5, 0, 0.873016, 0.35779, 3.96226e-5, 0, 0.904762, 0.340379, 3.84886e-5, 0, 0.936508, 0.323385, 3.68214e-5, 0, 0.968254, 0.307295, 3.56636e-5, 0, 1, 1, 1.06465e-12, 0, 0, 1, 1.06555e-12, 0, 0, 1, 1.07966e-12, 0, 0, 1, 1.14601e-12, 0, 0, 1, 1.37123e-12, 0, 0, 1, 2.1243e-12, 0, 0, 0.999999, 4.89653e-12, 0, 0, 0.999999, 1.60283e-11, 0, 0, 0.999998, 6.2269e-11, 0, 0, 0.999997, 2.51859e-10, 0, 0, 0.999996, 9.96192e-10, 0, 0, 0.999992, 3.74531e-9, 0, 0, 0.999986, 1.32022e-8, 0, 0, 0.999975, 4.33315e-8, 0, 0, 0.999959, 1.31956e-7, 0, 0, 0.999927, 3.72249e-7, 0, 0, 0.999871, 9.72461e-7, 0, 0, 0.999771, 2.35343e-6, 0, 0, 0.999572, 5.2768e-6, 0, 0, 0.999133, 1.09237e-5, 0, 0, 0.997912, 2.03675e-5, 0, 0, 0.993008, 2.79396e-5, 0, 0, 0.980645, 1.39604e-5, 0, 0, 0.970057, 6.46596e-6, 0, 0, 0.966717, 6.5089e-6, 0, 4.74145e-5, 0.965497, 1.11863e-5, 0, 0.00089544, 0.96334, 1.79857e-5, 0, 0.0032647, 0.959294, 2.59045e-5, 0, 0.0075144, 0.951519, 2.92327e-5, 0, 0.0138734, 0.940517, 2.49769e-5, 0, 0.0224952, 0.93014, 2.6803e-5, 0, 0.0334828, 0.91972, 3.03656e-5, 0, 0.0468973, 0.910294, 3.53323e-5, 0, 0.0627703, 0.897701, 3.51002e-5, 0, 0.0811019, 0.884522, 3.88104e-5, 0, 0.10186, 0.869489, 4.12932e-5, 0, 0.124985, 0.853983, 4.15781e-5, 0, 0.150372, 0.838425, 4.54066e-5, 0, 0.177868, 0.820656, 4.71624e-5, 0, 0.207245, 0.801875, 4.75243e-5, 0, 0.238143, 0.783521, 5.05621e-5, 0, 0.269841, 0.763131, 5.0721e-5, 0, 0.301587, 0.74261, 5.23293e-5, 0, 0.333333, 0.72148, 5.28699e-5, 0, 0.365079, 0.699696, 5.38677e-5, 0, 0.396825, 0.677592, 5.39255e-5, 0, 0.428571, 0.65525, 5.46367e-5, 0, 0.460317, 0.632452, 5.41348e-5, 0, 0.492064, 0.609903, 5.44976e-5, 0, 0.52381, 0.586928, 5.36201e-5, 0, 0.555556, 0.564464, 5.35185e-5, 0, 0.587302, 0.541801, 5.24949e-5, 0, 0.619048, 0.519681, 5.1812e-5, 0, 0.650794, 0.497685, 5.07687e-5, 0, 0.68254, 0.47622, 4.96243e-5, 0, 0.714286, 0.455135, 4.85714e-5, 0, 0.746032, 0.4346, 4.71847e-5, 0, 0.777778, 0.414564, 4.59294e-5, 0, 0.809524, 0.395165, 4.44705e-5, 0, 0.84127, 0.376333, 4.30772e-5, 0, 0.873016, 0.358197, 4.16229e-5, 0, 0.904762, 0.34064, 4.01019e-5, 0, 0.936508, 0.323816, 3.86623e-5, 0, 0.968254, 0.307581, 3.70933e-5, 0, 1, 1, 9.91541e-12, 0, 0, 1, 9.92077e-12, 0, 0, 1, 1.00041e-11, 0, 0, 1, 1.0385e-11, 0, 0, 1, 1.15777e-11, 0, 0, 1, 1.50215e-11, 0, 0, 0.999999, 2.54738e-11, 0, 0, 0.999999, 5.98822e-11, 0, 0, 0.999998, 1.79597e-10, 0, 0, 0.999997, 6.02367e-10, 0, 0, 0.999994, 2.06835e-9, 0, 0, 0.99999, 6.94952e-9, 0, 0, 0.999984, 2.23363e-8, 0, 0, 0.999972, 6.78578e-8, 0, 0, 0.999952, 1.93571e-7, 0, 0, 0.999919, 5.16594e-7, 0, 0, 0.99986, 1.28739e-6, 0, 0, 0.999753, 2.99298e-6, 0, 0, 0.999546, 6.48258e-6, 0, 0, 0.999074, 1.29985e-5, 0, 0, 0.997671, 2.32176e-5, 0, 0, 0.991504, 2.56701e-5, 0, 0, 0.981148, 1.31141e-5, 0, 0, 0.971965, 8.69048e-6, 0, 2.80182e-5, 0.966624, 8.08301e-6, 0, 0.000695475, 0.965344, 1.35235e-5, 0, 0.00265522, 0.963048, 2.10592e-5, 0, 0.00622975, 0.958673, 2.87473e-5, 0, 0.0116234, 0.950262, 2.81379e-5, 0, 0.018976, 0.940836, 2.71089e-5, 0, 0.0283844, 0.930996, 3.0926e-5, 0, 0.0399151, 0.919848, 3.48359e-5, 0, 0.0536063, 0.909136, 3.66092e-5, 0, 0.0694793, 0.897554, 3.84162e-5, 0, 0.0875342, 0.884691, 4.30971e-5, 0, 0.107749, 0.869414, 4.47803e-5, 0, 0.130087, 0.853462, 4.52858e-5, 0, 0.154481, 0.838187, 4.95769e-5, 0, 0.180833, 0.820381, 5.02709e-5, 0, 0.209005, 0.801844, 5.22713e-5, 0, 0.238791, 0.783061, 5.41505e-5, 0, 0.269869, 0.763205, 5.53712e-5, 0, 0.301587, 0.742362, 5.64909e-5, 0, 0.333333, 0.721393, 5.72646e-5, 0, 0.365079, 0.699676, 5.81012e-5, 0, 0.396825, 0.677395, 5.8096e-5, 0, 0.428571, 0.655208, 5.85766e-5, 0, 0.460317, 0.632451, 5.83602e-5, 0, 0.492064, 0.609839, 5.80234e-5, 0, 0.52381, 0.587093, 5.77161e-5, 0, 0.555556, 0.564467, 5.68447e-5, 0, 0.587302, 0.542043, 5.63166e-5, 0, 0.619048, 0.519826, 5.5156e-5, 0, 0.650794, 0.497952, 5.41682e-5, 0, 0.68254, 0.476477, 5.28971e-5, 0, 0.714286, 0.455412, 5.14952e-5, 0, 0.746032, 0.434926, 5.02222e-5, 0, 0.777778, 0.4149, 4.85779e-5, 0, 0.809524, 0.395552, 4.72242e-5, 0, 0.84127, 0.376712, 4.54891e-5, 0, 0.873016, 0.358622, 4.40924e-5, 0, 0.904762, 0.341048, 4.22984e-5, 0, 0.936508, 0.324262, 4.08582e-5, 0, 0.968254, 0.308013, 3.90839e-5, 0, 1, 1, 6.13913e-11, 0, 0, 1, 6.14145e-11, 0, 0, 1, 6.17708e-11, 0, 0, 1, 6.33717e-11, 0, 0, 1, 6.81648e-11, 0, 0, 1, 8.08291e-11, 0, 0, 1, 1.14608e-10, 0, 0, 0.999998, 2.10507e-10, 0, 0, 0.999997, 4.99595e-10, 0, 0, 0.999995, 1.39897e-9, 0, 0, 0.999994, 4.19818e-9, 0, 0, 0.999988, 1.27042e-8, 0, 0, 0.999979, 3.75153e-8, 0, 0, 0.999965, 1.06206e-7, 0, 0, 0.999945, 2.85381e-7, 0, 0, 0.999908, 7.23611e-7, 0, 0, 0.999846, 1.7255e-6, 0, 0, 0.999733, 3.86104e-6, 0, 0, 0.999511, 8.08493e-6, 0, 0, 0.998993, 1.56884e-5, 0, 0, 0.997326, 2.65538e-5, 0, 0, 0.989706, 2.06466e-5, 0, 0, 0.981713, 1.30756e-5, 0, 7.0005e-6, 0.973636, 1.06473e-5, 0, 0.000464797, 0.966509, 1.0194e-5, 0, 0.00201743, 0.965149, 1.65881e-5, 0, 0.00497549, 0.962669, 2.49147e-5, 0, 0.00953262, 0.95786, 3.17449e-5, 0, 0.0158211, 0.949334, 2.81045e-5, 0, 0.0239343, 0.941041, 3.03263e-5, 0, 0.0339372, 0.931575, 3.56754e-5, 0, 0.0458738, 0.920102, 3.97075e-5, 0, 0.059772, 0.908002, 3.84886e-5, 0, 0.075645, 0.897269, 4.3027e-5, 0, 0.0934929, 0.884559, 4.79925e-5, 0, 0.113302, 0.869161, 4.8246e-5, 0, 0.135045, 0.853342, 5.09505e-5, 0, 0.158678, 0.837633, 5.42846e-5, 0, 0.184136, 0.820252, 5.54139e-5, 0, 0.211325, 0.801872, 5.81412e-5, 0, 0.240113, 0.782418, 5.85535e-5, 0, 0.270306, 0.7631, 6.10923e-5, 0, 0.301594, 0.742183, 6.13678e-5, 0, 0.333333, 0.721098, 6.27275e-5, 0, 0.365079, 0.699512, 6.29413e-5, 0, 0.396825, 0.677372, 6.36351e-5, 0, 0.428571, 0.655059, 6.33555e-5, 0, 0.460317, 0.632567, 6.36513e-5, 0, 0.492064, 0.609784, 6.28965e-5, 0, 0.52381, 0.587237, 6.25546e-5, 0, 0.555556, 0.564525, 6.15825e-5, 0, 0.587302, 0.542181, 6.05048e-5, 0, 0.619048, 0.520017, 5.96329e-5, 0, 0.650794, 0.498204, 5.81516e-5, 0, 0.68254, 0.476742, 5.69186e-5, 0, 0.714286, 0.455803, 5.53833e-5, 0, 0.746032, 0.435251, 5.37807e-5, 0, 0.777778, 0.415374, 5.22025e-5, 0, 0.809524, 0.395921, 5.03421e-5, 0, 0.84127, 0.377253, 4.88211e-5, 0, 0.873016, 0.359021, 4.68234e-5, 0, 0.904762, 0.341637, 4.53269e-5, 0, 0.936508, 0.3247, 4.33014e-5, 0, 0.968254, 0.308625, 4.18007e-5, 0, 1, 1, 2.86798e-10, 0, 0, 1, 2.86877e-10, 0, 0, 1, 2.88094e-10, 0, 0, 1, 2.93506e-10, 0, 0, 1, 3.09262e-10, 0, 0, 0.999999, 3.48593e-10, 0, 0, 0.999999, 4.44582e-10, 0, 0, 0.999998, 6.88591e-10, 0, 0, 0.999996, 1.34391e-9, 0, 0, 0.999993, 3.17438e-9, 0, 0, 0.999989, 8.35609e-9, 0, 0, 0.999983, 2.28677e-8, 0, 0, 0.999974, 6.23361e-8, 0, 0, 0.999959, 1.65225e-7, 0, 0, 0.999936, 4.19983e-7, 0, 0, 0.999896, 1.01546e-6, 0, 0, 0.99983, 2.32376e-6, 0, 0, 0.999709, 5.0156e-6, 0, 0, 0.999469, 1.0167e-5, 0, 0, 0.998886, 1.90775e-5, 0, 0, 0.996819, 3.00511e-5, 0, 0, 0.988837, 1.85092e-5, 0, 1.68222e-7, 0.982178, 1.34622e-5, 0, 0.000259622, 0.975017, 1.25961e-5, 0, 0.00142595, 0.967101, 1.3507e-5, 0, 0.00382273, 0.964905, 2.05003e-5, 0, 0.00764164, 0.96218, 2.9546e-5, 0, 0.0130121, 0.956821, 3.43738e-5, 0, 0.0200253, 0.948829, 3.05063e-5, 0, 0.0287452, 0.941092, 3.46487e-5, 0, 0.039218, 0.931883, 4.12061e-5, 0, 0.0514748, 0.920211, 4.44651e-5, 0, 0.0655351, 0.907307, 4.31252e-5, 0, 0.0814082, 0.89684, 4.90382e-5, 0, 0.0990939, 0.884119, 5.3334e-5, 0, 0.118583, 0.869148, 5.4114e-5, 0, 0.139856, 0.853377, 5.78536e-5, 0, 0.162882, 0.836753, 5.92285e-5, 0, 0.187615, 0.820063, 6.22787e-5, 0, 0.213991, 0.801694, 6.45492e-5, 0, 0.241918, 0.782116, 6.5353e-5, 0, 0.271267, 0.762673, 6.74344e-5, 0, 0.301847, 0.742133, 6.82788e-5, 0, 0.333333, 0.720779, 6.91959e-5, 0, 0.365079, 0.699386, 6.96817e-5, 0, 0.396826, 0.67732, 6.99583e-5, 0, 0.428572, 0.654888, 6.98447e-5, 0, 0.460318, 0.632499, 6.94063e-5, 0, 0.492064, 0.609825, 6.91612e-5, 0, 0.52381, 0.587287, 6.81576e-5, 0, 0.555556, 0.564743, 6.74138e-5, 0, 0.587302, 0.542409, 6.61617e-5, 0, 0.619048, 0.520282, 6.47785e-5, 0, 0.650794, 0.498506, 6.33836e-5, 0, 0.68254, 0.477102, 6.15905e-5, 0, 0.714286, 0.456167, 6.01013e-5, 0, 0.746032, 0.435728, 5.81457e-5, 0, 0.777778, 0.415809, 5.64215e-5, 0, 0.809524, 0.396517, 5.44997e-5, 0, 0.84127, 0.377737, 5.25061e-5, 0, 0.873016, 0.359698, 5.06831e-5, 0, 0.904762, 0.342164, 4.8568e-5, 0, 0.936508, 0.325417, 4.67826e-5, 0, 0.968254, 0.309186, 4.46736e-5, 0, 1, 1, 1.09018e-9, 0, 0, 1, 1.0904e-9, 0, 0, 1, 1.09393e-9, 0, 0, 1, 1.1095e-9, 0, 0, 1, 1.154e-9, 0, 0, 1, 1.26089e-9, 0, 0, 0.999999, 1.5059e-9, 0, 0, 0.999997, 2.07899e-9, 0, 0, 0.999994, 3.48164e-9, 0, 0, 0.999993, 7.05728e-9, 0, 0, 0.999987, 1.63692e-8, 0, 0, 0.999981, 4.06033e-8, 0, 0, 0.999969, 1.0245e-7, 0, 0, 0.999953, 2.55023e-7, 0, 0, 0.999925, 6.1511e-7, 0, 0, 0.999881, 1.42218e-6, 0, 0, 0.99981, 3.13086e-6, 0, 0, 0.99968, 6.53119e-6, 0, 0, 0.999418, 1.2832e-5, 0, 0, 0.998748, 2.32497e-5, 0, 0, 0.996066, 3.29522e-5, 0, 0, 0.988379, 1.79613e-5, 0, 0.000108799, 0.982567, 1.43715e-5, 0, 0.000921302, 0.976097, 1.48096e-5, 0, 0.00280738, 0.968475, 1.78905e-5, 0, 0.00596622, 0.964606, 2.53921e-5, 0, 0.0105284, 0.961564, 3.48623e-5, 0, 0.0165848, 0.955517, 3.57612e-5, 0, 0.0242, 0.948381, 3.43493e-5, 0, 0.03342, 0.941095, 4.05849e-5, 0, 0.0442777, 0.931923, 4.75394e-5, 0, 0.0567958, 0.91996, 4.84328e-5, 0, 0.0709879, 0.907419, 5.02146e-5, 0, 0.086861, 0.89618, 5.61654e-5, 0, 0.104415, 0.88337, 5.87612e-5, 0, 0.123643, 0.869046, 6.18057e-5, 0, 0.144531, 0.853278, 6.57392e-5, 0, 0.167057, 0.836091, 6.6303e-5, 0, 0.191188, 0.819644, 7.04445e-5, 0, 0.216878, 0.801246, 7.14071e-5, 0, 0.244062, 0.782031, 7.40093e-5, 0, 0.272649, 0.762066, 7.4685e-5, 0, 0.302509, 0.741964, 7.66647e-5, 0, 0.333442, 0.720554, 7.66328e-5, 0, 0.365079, 0.699098, 7.77857e-5, 0, 0.396826, 0.677189, 7.74633e-5, 0, 0.428572, 0.65484, 7.76235e-5, 0, 0.460318, 0.632496, 7.70316e-5, 0, 0.492064, 0.609908, 7.62669e-5, 0, 0.52381, 0.587312, 7.53972e-5, 0, 0.555556, 0.564938, 7.39994e-5, 0, 0.587302, 0.542577, 7.28382e-5, 0, 0.619048, 0.52062, 7.1112e-5, 0, 0.650794, 0.498819, 6.94004e-5, 0, 0.68254, 0.477555, 6.75575e-5, 0, 0.714286, 0.456568, 6.53449e-5, 0, 0.746032, 0.436278, 6.36068e-5, 0, 0.777778, 0.41637, 6.13466e-5, 0, 0.809524, 0.397144, 5.94177e-5, 0, 0.84127, 0.378412, 5.70987e-5, 0, 0.873016, 0.360376, 5.50419e-5, 0, 0.904762, 0.342906, 5.27422e-5, 0, 0.936508, 0.326136, 5.06544e-5, 0, 0.968254, 0.30997, 4.84307e-5, 0, 1, 1, 3.54014e-9, 0, 0, 1, 3.54073e-9, 0, 0, 1, 3.54972e-9, 0, 0, 1, 3.58929e-9, 0, 0, 1, 3.70093e-9, 0, 0, 0.999999, 3.96194e-9, 0, 0, 0.999998, 4.53352e-9, 0, 0, 0.999997, 5.78828e-9, 0, 0, 0.999994, 8.63812e-9, 0, 0, 0.999991, 1.53622e-8, 0, 0, 0.999985, 3.16356e-8, 0, 0, 0.999977, 7.12781e-8, 0, 0, 0.999964, 1.66725e-7, 0, 0, 0.999945, 3.90501e-7, 0, 0, 0.999912, 8.95622e-7, 0, 0, 0.999866, 1.98428e-6, 0, 0, 0.999786, 4.21038e-6, 0, 0, 0.999647, 8.50239e-6, 0, 0, 0.999356, 1.62059e-5, 0, 0, 0.998563, 2.82652e-5, 0, 0, 0.994928, 3.36309e-5, 0, 2.44244e-5, 0.987999, 1.78458e-5, 0, 0.000523891, 0.982893, 1.59162e-5, 0, 0.00194729, 0.977044, 1.78056e-5, 0, 0.00451099, 0.969972, 2.30624e-5, 0, 0.00835132, 0.964237, 3.13922e-5, 0, 0.013561, 0.960791, 4.06145e-5, 0, 0.0202056, 0.954292, 3.72796e-5, 0, 0.0283321, 0.948052, 4.03199e-5, 0, 0.0379739, 0.940938, 4.79537e-5, 0, 0.0491551, 0.931689, 5.45292e-5, 0, 0.0618918, 0.91987, 5.4038e-5, 0, 0.0761941, 0.907665, 5.89909e-5, 0, 0.0920672, 0.895281, 6.42651e-5, 0, 0.109511, 0.882621, 6.59707e-5, 0, 0.12852, 0.86873, 7.09973e-5, 0, 0.149085, 0.853008, 7.42221e-5, 0, 0.171189, 0.835944, 7.61754e-5, 0, 0.194809, 0.818949, 7.97052e-5, 0, 0.21991, 0.800951, 8.12434e-5, 0, 0.246447, 0.781847, 8.38075e-5, 0, 0.274352, 0.761649, 8.4501e-5, 0, 0.303535, 0.74152, 8.60258e-5, 0, 0.333857, 0.720495, 8.66233e-5, 0, 0.365104, 0.698742, 8.68326e-5, 0, 0.396826, 0.677096, 8.7133e-5, 0, 0.428572, 0.654782, 8.63497e-5, 0, 0.460318, 0.632335, 8.60206e-5, 0, 0.492064, 0.610031, 8.49337e-5, 0, 0.52381, 0.587457, 8.38279e-5, 0, 0.555556, 0.56513, 8.2309e-5, 0, 0.587302, 0.542877, 8.03542e-5, 0, 0.619048, 0.5209, 7.86928e-5, 0, 0.650794, 0.499291, 7.65171e-5, 0, 0.68254, 0.477971, 7.44753e-5, 0, 0.714286, 0.457221, 7.2209e-5, 0, 0.746032, 0.436803, 6.97448e-5, 0, 0.777778, 0.417083, 6.75333e-5, 0, 0.809524, 0.397749, 6.48058e-5, 0, 0.84127, 0.379177, 6.25759e-5, 0, 0.873016, 0.361061, 5.98584e-5, 0, 0.904762, 0.343713, 5.75797e-5, 0, 0.936508, 0.326894, 5.49999e-5, 0, 0.968254, 0.310816, 5.27482e-5, 0, 1, 1, 1.0153e-8, 0, 0, 1, 1.01544e-8, 0, 0, 1, 1.01751e-8, 0, 0, 1, 1.02662e-8, 0, 0, 1, 1.0521e-8, 0, 0, 0.999999, 1.11049e-8, 0, 0, 0.999999, 1.23408e-8, 0, 0, 0.999996, 1.4924e-8, 0, 0, 0.999992, 2.04471e-8, 0, 0, 0.999989, 3.26539e-8, 0, 0, 0.99998, 6.03559e-8, 0, 0, 0.999971, 1.23936e-7, 0, 0, 0.999955, 2.69058e-7, 0, 0, 0.999933, 5.93604e-7, 0, 0, 0.999901, 1.29633e-6, 0, 0, 0.999847, 2.75621e-6, 0, 0, 0.999761, 5.64494e-6, 0, 0, 0.999607, 1.10485e-5, 0, 0, 0.999282, 2.04388e-5, 0, 0, 0.99831, 3.41084e-5, 0, 2.2038e-7, 0.993288, 2.94949e-5, 0, 0.000242388, 0.987855, 1.92736e-5, 0, 0.0012503, 0.983167, 1.82383e-5, 0, 0.0032745, 0.977908, 2.18633e-5, 0, 0.00646321, 0.971194, 2.90662e-5, 0, 0.0109133, 0.963867, 3.86401e-5, 0, 0.0166927, 0.95982, 4.62827e-5, 0, 0.0238494, 0.953497, 4.20705e-5, 0, 0.0324178, 0.947621, 4.77743e-5, 0, 0.0424225, 0.940611, 5.68258e-5, 0, 0.0538808, 0.931174, 6.18061e-5, 0, 0.0668047, 0.919919, 6.27098e-5, 0, 0.0812014, 0.907856, 6.94714e-5, 0, 0.0970745, 0.894509, 7.35008e-5, 0, 0.114424, 0.881954, 7.63369e-5, 0, 0.133246, 0.868309, 8.21896e-5, 0, 0.153534, 0.852511, 8.3769e-5, 0, 0.175275, 0.835821, 8.81615e-5, 0, 0.198453, 0.817981, 8.96368e-5, 0, 0.223042, 0.800504, 9.30906e-5, 0, 0.249009, 0.78141, 9.45056e-5, 0, 0.276304, 0.761427, 9.63605e-5, 0, 0.304862, 0.74094, 9.68088e-5, 0, 0.334584, 0.720233, 9.81481e-5, 0, 0.365322, 0.698592, 9.79122e-5, 0, 0.396826, 0.676763, 9.81057e-5, 0, 0.428571, 0.654808, 9.73956e-5, 0, 0.460318, 0.632326, 9.62619e-5, 0, 0.492064, 0.610049, 9.52996e-5, 0, 0.52381, 0.58763, 9.33334e-5, 0, 0.555556, 0.565261, 9.17573e-5, 0, 0.587302, 0.543244, 8.96636e-5, 0, 0.619048, 0.521273, 8.73304e-5, 0, 0.650794, 0.499818, 8.52648e-5, 0, 0.68254, 0.478536, 8.23961e-5, 0, 0.714286, 0.457826, 7.9939e-5, 0, 0.746032, 0.437549, 7.7126e-5, 0, 0.777778, 0.41776, 7.43043e-5, 0, 0.809524, 0.39863, 7.16426e-5, 0, 0.84127, 0.379954, 6.86456e-5, 0, 0.873016, 0.362025, 6.60514e-5, 0, 0.904762, 0.344581, 6.30755e-5, 0, 0.936508, 0.327909, 6.05439e-5, 0, 0.968254, 0.311736, 5.76345e-5, 0, 1, 1, 2.63344e-8, 0, 0, 1, 2.63373e-8, 0, 0, 1, 2.63815e-8, 0, 0, 1, 2.65753e-8, 0, 0, 1, 2.71132e-8, 0, 0, 0.999999, 2.83279e-8, 0, 0, 0.999997, 3.0833e-8, 0, 0, 0.999995, 3.58711e-8, 0, 0, 0.999992, 4.61266e-8, 0, 0, 0.999985, 6.7574e-8, 0, 0, 0.999977, 1.1358e-7, 0, 0, 0.999966, 2.13657e-7, 0, 0, 0.999948, 4.31151e-7, 0, 0, 0.999923, 8.96656e-7, 0, 0, 0.999884, 1.86603e-6, 0, 0, 0.999826, 3.81115e-6, 0, 0, 0.999732, 7.54184e-6, 0, 0, 0.999561, 1.43192e-5, 0, 0, 0.999191, 2.57061e-5, 0, 0, 0.997955, 4.05724e-5, 0, 7.44132e-5, 0.992228, 2.76537e-5, 0, 0.000716477, 0.987638, 2.08885e-5, 0, 0.0022524, 0.983395, 2.15226e-5, 0, 0.00484816, 0.978614, 2.70795e-5, 0, 0.00860962, 0.972389, 3.65282e-5, 0, 0.0136083, 0.964392, 4.74747e-5, 0, 0.0198941, 0.95861, 5.09141e-5, 0, 0.0275023, 0.952806, 4.8963e-5, 0, 0.0364584, 0.94712, 5.71119e-5, 0, 0.04678, 0.940104, 6.71704e-5, 0, 0.0584799, 0.930398, 6.87586e-5, 0, 0.0715665, 0.919866, 7.38161e-5, 0, 0.086045, 0.907853, 8.13235e-5, 0, 0.101918, 0.894078, 8.34582e-5, 0, 0.119186, 0.881177, 8.92093e-5, 0, 0.137845, 0.867575, 9.44548e-5, 0, 0.157891, 0.852107, 9.69607e-5, 0, 0.179316, 0.835502, 0.000101456, 0, 0.202106, 0.81756, 0.000103256, 0, 0.226243, 0.79984, 0.000106954, 0, 0.251704, 0.780998, 0.000108066, 0, 0.278451, 0.761132, 0.000110111, 0, 0.306436, 0.740429, 0.000110459, 0, 0.335586, 0.719836, 0.000111219, 0, 0.365796, 0.698467, 0.00011145, 0, 0.3969, 0.676446, 0.000110393, 0, 0.428571, 0.654635, 0.000110035, 0, 0.460318, 0.632411, 0.000108548, 0, 0.492064, 0.609986, 0.000106963, 0, 0.52381, 0.587872, 0.000105238, 0, 0.555556, 0.565528, 0.000102665, 0, 0.587302, 0.543563, 0.000100543, 0, 0.619048, 0.52176, 9.76182e-5, 0, 0.650794, 0.500188, 9.47099e-5, 0, 0.68254, 0.479204, 9.19929e-5, 0, 0.714286, 0.458413, 8.86139e-5, 0, 0.746032, 0.438314, 8.57839e-5, 0, 0.777778, 0.418573, 8.2411e-5, 0, 0.809524, 0.39947, 7.92211e-5, 0, 0.84127, 0.380892, 7.59546e-5, 0, 0.873016, 0.362953, 7.27571e-5, 0, 0.904762, 0.345601, 6.95738e-5, 0, 0.936508, 0.328895, 6.64907e-5, 0, 0.968254, 0.312808, 6.34277e-5, 0, 1, 1, 6.28647e-8, 0, 0, 1, 6.28705e-8, 0, 0, 1, 6.29587e-8, 0, 0, 1, 6.33441e-8, 0, 0, 0.999999, 6.44087e-8, 0, 0, 0.999998, 6.67856e-8, 0, 0, 0.999997, 7.15889e-8, 0, 0, 0.999995, 8.09577e-8, 0, 0, 0.999989, 9.92764e-8, 0, 0, 0.999983, 1.35834e-7, 0, 0, 0.999974, 2.10482e-7, 0, 0, 0.999959, 3.65215e-7, 0, 0, 0.999939, 6.86693e-7, 0, 0, 0.999911, 1.3472e-6, 0, 0, 0.999868, 2.6731e-6, 0, 0, 0.999804, 5.24756e-6, 0, 0, 0.9997, 1.00403e-5, 0, 0, 0.99951, 1.85019e-5, 0, 0, 0.999078, 3.22036e-5, 0, 6.20676e-6, 0.997428, 4.70002e-5, 0, 0.000341552, 0.99162, 2.87123e-5, 0, 0.00143727, 0.987479, 2.34706e-5, 0, 0.00349201, 0.983582, 2.60083e-5, 0, 0.0066242, 0.979186, 3.37927e-5, 0, 0.0109113, 0.97325, 4.54689e-5, 0, 0.0164064, 0.965221, 5.73759e-5, 0, 0.0231463, 0.957262, 5.44114e-5, 0, 0.0311571, 0.952211, 5.87006e-5, 0, 0.0404572, 0.946631, 6.92256e-5, 0, 0.0510592, 0.939391, 7.87819e-5, 0, 0.0629723, 0.929795, 7.92368e-5, 0, 0.0762025, 0.91965, 8.75075e-5, 0, 0.090753, 0.907737, 9.50903e-5, 0, 0.106626, 0.893899, 9.72963e-5, 0, 0.123822, 0.880239, 0.00010459, 0, 0.142337, 0.866562, 0.000107689, 0, 0.16217, 0.85164, 0.000113081, 0, 0.183314, 0.835021, 0.000116636, 0, 0.20576, 0.817311, 0.000120074, 0, 0.229496, 0.798845, 0.000121921, 0, 0.254502, 0.780479, 0.00012475, 0, 0.280753, 0.760694, 0.000125255, 0, 0.308212, 0.740142, 0.000126719, 0, 0.336825, 0.719248, 0.00012636, 0, 0.366517, 0.698209, 0.000126712, 0, 0.397167, 0.676398, 0.000125769, 0, 0.428578, 0.654378, 0.000124432, 0, 0.460318, 0.632484, 0.000123272, 0, 0.492064, 0.610113, 0.00012085, 0, 0.52381, 0.587931, 0.000118411, 0, 0.555556, 0.565872, 0.00011569, 0, 0.587302, 0.543814, 0.000112521, 0, 0.619048, 0.522265, 0.000109737, 0, 0.650794, 0.500835, 0.000106228, 0, 0.68254, 0.479818, 0.000102591, 0, 0.714286, 0.459258, 9.91288e-5, 0, 0.746032, 0.439061, 9.52325e-5, 0, 0.777778, 0.419552, 9.1895e-5, 0, 0.809524, 0.400399, 8.79051e-5, 0, 0.84127, 0.381976, 8.44775e-5, 0, 0.873016, 0.364009, 8.06316e-5, 0, 0.904762, 0.346761, 7.71848e-5, 0, 0.936508, 0.330049, 7.35429e-5, 0, 0.968254, 0.314018, 7.02103e-5, 0, 1, 1, 1.39968e-7, 0, 0, 1, 1.39979e-7, 0, 0, 1, 1.40145e-7, 0, 0, 1, 1.4087e-7, 0, 0, 0.999999, 1.42865e-7, 0, 0, 0.999998, 1.47279e-7, 0, 0, 0.999997, 1.56057e-7, 0, 0, 0.999992, 1.7276e-7, 0, 0, 0.999989, 2.04352e-7, 0, 0, 0.99998, 2.6494e-7, 0, 0, 0.999969, 3.83435e-7, 0, 0, 0.999953, 6.18641e-7, 0, 0, 0.999929, 1.08755e-6, 0, 0, 0.999898, 2.01497e-6, 0, 0, 0.999849, 3.81346e-6, 0, 0, 0.999778, 7.19815e-6, 0, 0, 0.999661, 1.33215e-5, 0, 0, 0.999451, 2.38313e-5, 0, 0, 0.998936, 4.01343e-5, 0, 0.000113724, 0.99662, 5.17346e-5, 0, 0.000820171, 0.991094, 3.04323e-5, 0, 0.00238143, 0.987487, 2.81757e-5, 0, 0.00493527, 0.983731, 3.20048e-5, 0, 0.00856859, 0.979647, 4.23905e-5, 0, 0.0133393, 0.973837, 5.62935e-5, 0, 0.0192863, 0.96584, 6.77442e-5, 0, 0.0264369, 0.956309, 6.23073e-5, 0, 0.03481, 0.951523, 7.04131e-5, 0, 0.0444184, 0.946003, 8.36594e-5, 0, 0.0552713, 0.938454, 9.11736e-5, 0, 0.0673749, 0.929279, 9.38264e-5, 0, 0.0807329, 0.919239, 0.000103754, 0, 0.0953479, 0.907293, 0.000109928, 0, 0.111221, 0.893936, 0.000115257, 0, 0.128352, 0.879674, 0.000122265, 0, 0.14674, 0.865668, 0.000125733, 0, 0.166382, 0.850998, 0.000132305, 0, 0.187276, 0.834498, 0.000134844, 0, 0.209413, 0.816903, 0.000139276, 0, 0.232786, 0.798235, 0.000140984, 0, 0.257382, 0.779724, 0.00014378, 0, 0.283181, 0.760251, 0.000144623, 0, 0.310156, 0.739808, 0.000145228, 0, 0.338269, 0.718762, 0.00014539, 0, 0.367461, 0.697815, 0.000144432, 0, 0.397646, 0.67631, 0.000143893, 0, 0.428685, 0.654278, 0.000141846, 0, 0.460318, 0.632347, 0.00013935, 0, 0.492064, 0.610296, 0.000137138, 0, 0.52381, 0.588039, 0.000133806, 0, 0.555556, 0.566218, 0.000130755, 0, 0.587302, 0.544346, 0.000127128, 0, 0.619048, 0.522701, 0.000123002, 0, 0.650794, 0.501542, 0.000119443, 0, 0.68254, 0.480508, 0.000115055, 0, 0.714286, 0.460092, 0.000111032, 0, 0.746032, 0.440021, 0.000106635, 0, 0.777778, 0.420446, 0.000102162, 0, 0.809524, 0.401512, 9.8184e-5, 0, 0.84127, 0.38299, 9.36497e-5, 0, 0.873016, 0.365232, 8.9813e-5, 0, 0.904762, 0.347865, 8.53073e-5, 0, 0.936508, 0.331342, 8.17068e-5, 0, 0.968254, 0.315202, 7.73818e-5, 0, 1, 1, 2.9368e-7, 0, 0, 1, 2.937e-7, 0, 0, 1, 2.93998e-7, 0, 0, 1, 2.95298e-7, 0, 0, 0.999999, 2.98865e-7, 0, 0, 0.999998, 3.067e-7, 0, 0, 0.999995, 3.22082e-7, 0, 0, 0.999992, 3.50767e-7, 0, 0, 0.999986, 4.03538e-7, 0, 0, 0.999976, 5.01372e-7, 0, 0, 0.999964, 6.8562e-7, 0, 0, 0.999945, 1.0374e-6, 0, 0, 0.999919, 1.71269e-6, 0, 0, 0.999882, 3.00175e-6, 0, 0, 0.999829, 5.42144e-6, 0, 0, 0.999749, 9.84182e-6, 0, 0, 0.99962, 1.76213e-5, 0, 0, 0.999382, 3.05995e-5, 0, 1.38418e-5, 0.998751, 4.96686e-5, 0, 0.000389844, 0.995344, 5.10733e-5, 0, 0.00150343, 0.990768, 3.45829e-5, 0, 0.00352451, 0.987464, 3.42841e-5, 0, 0.00655379, 0.983846, 3.99072e-5, 0, 0.0106554, 0.980007, 5.33219e-5, 0, 0.0158723, 0.974494, 6.96992e-5, 0, 0.0222333, 0.96622, 7.76754e-5, 0, 0.029758, 0.956273, 7.47718e-5, 0, 0.0384596, 0.950952, 8.64611e-5, 0, 0.0483473, 0.945215, 0.000100464, 0, 0.0594266, 0.937287, 0.000103729, 0, 0.0717019, 0.928649, 0.000111665, 0, 0.0851752, 0.918791, 0.00012353, 0, 0.0998479, 0.906685, 0.000127115, 0, 0.115721, 0.893706, 0.00013628, 0, 0.132794, 0.879248, 0.000142427, 0, 0.151067, 0.864685, 0.000148091, 0, 0.170538, 0.850032, 0.000153517, 0, 0.191204, 0.833853, 0.000157322, 0, 0.213063, 0.816353, 0.000161086, 0, 0.236107, 0.797834, 0.000164111, 0, 0.260329, 0.778831, 0.000165446, 0, 0.285714, 0.759756, 0.000167492, 0, 0.312243, 0.739419, 0.000166928, 0, 0.339887, 0.718491, 0.000167, 0, 0.368604, 0.697392, 0.000165674, 0, 0.398329, 0.676102, 0.000163815, 0, 0.428961, 0.654243, 0.000162003, 0, 0.460331, 0.632176, 0.000158831, 0, 0.492064, 0.610407, 0.000155463, 0, 0.52381, 0.588394, 0.000152062, 0, 0.555556, 0.56645, 0.000147665, 0, 0.587302, 0.5449, 0.00014375, 0, 0.619048, 0.523276, 0.000138905, 0, 0.650794, 0.502179, 0.000134189, 0, 0.68254, 0.481359, 0.000129392, 0, 0.714286, 0.46092, 0.000124556, 0, 0.746032, 0.441084, 0.00011957, 0, 0.777778, 0.421517, 0.000114652, 0, 0.809524, 0.402721, 0.000109688, 0, 0.84127, 0.384222, 0.000104667, 0, 0.873016, 0.366534, 9.99633e-5, 0, 0.904762, 0.349205, 9.50177e-5, 0, 0.936508, 0.332702, 9.07301e-5, 0, 0.968254, 0.316599, 8.59769e-5, 0, 1, 1, 5.85473e-7, 0, 0, 1, 5.85507e-7, 0, 0, 1, 5.8602e-7, 0, 0, 0.999999, 5.88259e-7, 0, 0, 0.999999, 5.94381e-7, 0, 0, 0.999998, 6.07754e-7, 0, 0, 0.999995, 6.33729e-7, 0, 0, 0.99999, 6.8137e-7, 0, 0, 0.999984, 7.67003e-7, 0, 0, 0.999973, 9.21212e-7, 0, 0, 0.999959, 1.20218e-6, 0, 0, 0.999936, 1.72024e-6, 0, 0, 0.999907, 2.68088e-6, 0, 0, 0.999866, 4.45512e-6, 0, 0, 0.999806, 7.68481e-6, 0, 0, 0.999716, 1.342e-5, 0, 0, 0.999576, 2.32473e-5, 0, 0, 0.9993, 3.91694e-5, 0, 0.000129917, 0.998498, 6.08429e-5, 0, 0.000845035, 0.994132, 4.89743e-5, 0, 0.00237616, 0.99031, 3.84644e-5, 0, 0.00484456, 0.987409, 4.21768e-5, 0, 0.00832472, 0.983981, 5.04854e-5, 0, 0.0128643, 0.980268, 6.71028e-5, 0, 0.0184947, 0.974875, 8.52749e-5, 0, 0.025237, 0.966063, 8.5531e-5, 0, 0.0331046, 0.956779, 9.00588e-5, 0, 0.0421067, 0.950259, 0.00010577, 0, 0.0522487, 0.944239, 0.000119458, 0, 0.0635343, 0.936341, 0.000122164, 0, 0.0759654, 0.928047, 0.000134929, 0, 0.0895434, 0.918065, 0.000145544, 0, 0.104269, 0.906267, 0.000150531, 0, 0.120142, 0.893419, 0.000161652, 0, 0.137163, 0.878758, 0.00016593, 0, 0.15533, 0.863699, 0.000174014, 0, 0.174645, 0.848876, 0.000177877, 0, 0.195106, 0.833032, 0.000184049, 0, 0.21671, 0.815557, 0.000186088, 0, 0.239454, 0.797323, 0.00019054, 0, 0.263332, 0.778124, 0.000191765, 0, 0.288336, 0.758929, 0.000192535, 0, 0.314451, 0.738979, 0.000192688, 0, 0.341658, 0.718213, 0.000191522, 0, 0.369924, 0.696947, 0.000190491, 0, 0.399202, 0.675807, 0.000187913, 0, 0.429416, 0.654147, 0.000184451, 0, 0.460447, 0.63229, 0.000181442, 0, 0.492064, 0.610499, 0.000177139, 0, 0.523809, 0.588747, 0.000172596, 0, 0.555555, 0.566783, 0.000167457, 0, 0.587301, 0.545359, 0.000162518, 0, 0.619048, 0.523984, 0.000156818, 0, 0.650794, 0.502917, 0.000151884, 0, 0.68254, 0.482294, 0.000145514, 0, 0.714286, 0.461945, 0.000140199, 0, 0.746032, 0.442133, 0.000134101, 0, 0.777778, 0.422705, 0.000128374, 0, 0.809524, 0.403916, 0.000122996, 0, 0.84127, 0.38554, 0.000116808, 0, 0.873016, 0.367909, 0.000111973, 0, 0.904762, 0.350651, 0.000105938, 0, 0.936508, 0.334208, 0.000101355, 0, 0.968254, 0.318123, 9.57629e-5, 0, 1, 1, 1.11633e-6, 0, 0, 1, 1.11639e-6, 0, 0, 1, 1.11725e-6, 0, 0, 1, 1.12096e-6, 0, 0, 0.999999, 1.1311e-6, 0, 0, 0.999997, 1.15315e-6, 0, 0, 0.999995, 1.1956e-6, 0, 0, 0.999989, 1.27239e-6, 0, 0, 0.999981, 1.40772e-6, 0, 0, 0.999969, 1.64541e-6, 0, 0, 0.999952, 2.06607e-6, 0, 0, 0.999928, 2.81783e-6, 0, 0, 0.999895, 4.16835e-6, 0, 0, 0.999848, 6.58728e-6, 0, 0, 0.999781, 1.08648e-5, 0, 0, 0.999682, 1.82579e-5, 0, 0, 0.999523, 3.06003e-5, 0, 1.59122e-5, 0.999205, 4.99862e-5, 0, 0.000391184, 0.998131, 7.3306e-5, 0, 0.00147534, 0.993334, 5.13229e-5, 0, 0.0034227, 0.99016, 4.67783e-5, 0, 0.00632232, 0.987321, 5.23413e-5, 0, 0.0102295, 0.984099, 6.4267e-5, 0, 0.0151794, 0.980432, 8.43042e-5, 0, 0.0211947, 0.974976, 0.000102819, 0, 0.0282899, 0.966429, 9.96234e-5, 0, 0.0364739, 0.957633, 0.000111074, 0, 0.0457522, 0.949422, 0.000128644, 0, 0.0561278, 0.943045, 0.000140076, 0, 0.0676023, 0.935448, 0.000146349, 0, 0.0801762, 0.927225, 0.000161854, 0, 0.0938499, 0.917033, 0.000169135, 0, 0.108623, 0.905762, 0.000179987, 0, 0.124496, 0.892879, 0.000189832, 0, 0.141469, 0.878435, 0.000195881, 0, 0.159541, 0.863114, 0.00020466, 0, 0.178713, 0.84776, 0.000209473, 0, 0.198985, 0.832084, 0.000214861, 0, 0.220355, 0.814915, 0.000217695, 0, 0.242823, 0.796711, 0.000220313, 0, 0.266385, 0.777603, 0.00022313, 0, 0.291036, 0.757991, 0.000222471, 0, 0.316767, 0.738371, 0.000222869, 0, 0.343563, 0.717872, 0.000221243, 0, 0.371402, 0.696619, 0.000218089, 0, 0.400248, 0.675379, 0.00021562, 0, 0.430047, 0.65411, 0.00021169, 0, 0.460709, 0.63241, 0.000206947, 0, 0.492079, 0.61046, 0.000201709, 0, 0.52381, 0.58903, 0.000196753, 0, 0.555556, 0.567267, 0.000189637, 0, 0.587302, 0.545886, 0.000184735, 0, 0.619048, 0.524714, 0.000177257, 0, 0.650794, 0.503789, 0.000171424, 0, 0.68254, 0.483204, 0.000164688, 0, 0.714286, 0.462976, 0.000157172, 0, 0.746032, 0.443294, 0.000151341, 0, 0.777778, 0.423988, 0.000143737, 0, 0.809524, 0.405325, 0.000138098, 0, 0.84127, 0.386981, 0.000130698, 0, 0.873016, 0.369436, 0.000125276, 0, 0.904762, 0.35219, 0.000118349, 0, 0.936508, 0.335804, 0.00011312, 0, 0.968254, 0.319749, 0.000106687, 0, 1, 1, 2.04685e-6, 0, 0, 1, 2.04694e-6, 0, 0, 1, 2.04831e-6, 0, 0, 0.999999, 2.05428e-6, 0, 0, 0.999999, 2.07056e-6, 0, 0, 0.999997, 2.10581e-6, 0, 0, 0.999993, 2.1732e-6, 0, 0, 0.999987, 2.29365e-6, 0, 0, 0.999979, 2.50243e-6, 0, 0, 0.999965, 2.86127e-6, 0, 0, 0.999947, 3.48028e-6, 0, 0, 0.999918, 4.55588e-6, 0, 0, 0.999881, 6.43303e-6, 0, 0, 0.999828, 9.70064e-6, 0, 0, 0.999753, 1.53233e-5, 0, 0, 0.999642, 2.4793e-5, 0, 0, 0.999464, 4.02032e-5, 0, 0.000122947, 0.999089, 6.35852e-5, 0, 0.000807414, 0.997567, 8.57026e-5, 0, 0.00227206, 0.992903, 5.94912e-5, 0, 0.00462812, 0.990011, 5.78515e-5, 0, 0.00794162, 0.987192, 6.5399e-5, 0, 0.0122534, 0.98418, 8.19675e-5, 0, 0.0175888, 0.980491, 0.000105514, 0, 0.0239635, 0.974779, 0.000121532, 0, 0.031387, 0.96675, 0.000119144, 0, 0.0398644, 0.958248, 0.000136125, 0, 0.0493982, 0.948884, 0.000155408, 0, 0.0599896, 0.941673, 0.000162281, 0, 0.0716382, 0.934521, 0.000176754, 0, 0.0843437, 0.926205, 0.000192873, 0, 0.0981056, 0.916089, 0.000200038, 0, 0.112923, 0.904963, 0.000213624, 0, 0.128796, 0.892089, 0.000221834, 0, 0.145725, 0.878028, 0.000232619, 0, 0.163709, 0.86249, 0.000238632, 0, 0.182749, 0.846587, 0.000247002, 0, 0.202847, 0.830988, 0.000250702, 0, 0.224001, 0.814165, 0.000255562, 0, 0.246214, 0.796135, 0.000257505, 0, 0.269482, 0.777052, 0.000258625, 0, 0.293805, 0.757201, 0.000258398, 0, 0.319176, 0.737655, 0.000256714, 0, 0.345587, 0.717477, 0.000255187, 0, 0.373021, 0.696433, 0.000251792, 0, 0.401454, 0.675084, 0.000247223, 0, 0.430844, 0.653907, 0.000242213, 0, 0.461125, 0.632561, 0.000237397, 0, 0.492187, 0.610658, 0.000229313, 0, 0.52381, 0.589322, 0.000224402, 0, 0.555556, 0.567857, 0.000216116, 0, 0.587302, 0.54652, 0.000209124, 0, 0.619048, 0.525433, 0.000201601, 0, 0.650794, 0.504679, 0.000192957, 0, 0.68254, 0.484203, 0.000186052, 0, 0.714286, 0.464203, 0.000177672, 0, 0.746032, 0.444549, 0.000170005, 0, 0.777778, 0.425346, 0.000162401, 0, 0.809524, 0.406706, 0.0001544, 0, 0.84127, 0.388576, 0.000147437, 0, 0.873016, 0.37094, 0.000139493, 0, 0.904762, 0.353996, 0.000133219, 0, 0.936508, 0.337391, 0.000125573, 0, 0.968254, 0.321648, 0.000119867, 0, 1, 1, 3.62511e-6, 0, 0, 1, 3.62525e-6, 0, 0, 1, 3.62739e-6, 0, 0, 0.999999, 3.63673e-6, 0, 0, 0.999998, 3.66214e-6, 0, 0, 0.999996, 3.71698e-6, 0, 0, 0.999992, 3.82116e-6, 0, 0, 0.999986, 4.00554e-6, 0, 0, 0.999976, 4.32058e-6, 0, 0, 0.999961, 4.85194e-6, 0, 0, 0.999938, 5.74808e-6, 0, 0, 0.999908, 7.26643e-6, 0, 0, 0.999865, 9.84707e-6, 0, 0, 0.999807, 1.42217e-5, 0, 0, 0.999723, 2.15581e-5, 0, 0, 0.999602, 3.36114e-5, 0, 1.19113e-5, 0.999398, 5.27353e-5, 0, 0.000355813, 0.998946, 8.05809e-5, 0, 0.00137768, 0.996647, 9.42908e-5, 0, 0.00322469, 0.992298, 6.68733e-5, 0, 0.00597897, 0.989802, 7.16564e-5, 0, 0.00968903, 0.987019, 8.21355e-5, 0, 0.0143845, 0.984219, 0.000104555, 0, 0.0200831, 0.980425, 0.000131245, 0, 0.0267948, 0.974241, 0.000139613, 0, 0.034525, 0.967006, 0.000145931, 0, 0.0432757, 0.95893, 0.000167153, 0, 0.0530471, 0.949157, 0.000188146, 0, 0.0638386, 0.94062, 0.000194625, 0, 0.0756487, 0.933509, 0.000213721, 0, 0.0884762, 0.925088, 0.000229616, 0, 0.10232, 0.915178, 0.000239638, 0, 0.117178, 0.904093, 0.000254814, 0, 0.133051, 0.891337, 0.000263685, 0, 0.149939, 0.877326, 0.000274789, 0, 0.167841, 0.861794, 0.000280534, 0, 0.18676, 0.845758, 0.000289534, 0, 0.206696, 0.829792, 0.000294446, 0, 0.22765, 0.813037, 0.000296877, 0, 0.249625, 0.795285, 0.000300217, 0, 0.27262, 0.776323, 0.000299826, 0, 0.296636, 0.756673, 0.000299787, 0, 0.321671, 0.736856, 0.000297867, 0, 0.347718, 0.716883, 0.000294052, 0, 0.374768, 0.696089, 0.000289462, 0, 0.402804, 0.67505, 0.000285212, 0, 0.431796, 0.653509, 0.00027653, 0, 0.461695, 0.63258, 0.000271759, 0, 0.49242, 0.61104, 0.000262811, 0, 0.523822, 0.589567, 0.000255151, 0, 0.555556, 0.568322, 0.000246434, 0, 0.587302, 0.547235, 0.000237061, 0, 0.619048, 0.52616, 0.000228343, 0, 0.650794, 0.505716, 0.000219236, 0, 0.68254, 0.485274, 0.000209595, 0, 0.714286, 0.465411, 0.000201011, 0, 0.746032, 0.445854, 0.00019109, 0, 0.777778, 0.426911, 0.000182897, 0, 0.809524, 0.408222, 0.000173569, 0, 0.84127, 0.390307, 0.000165496, 0, 0.873016, 0.372624, 0.000156799, 0, 0.904762, 0.355804, 0.00014917, 0, 0.936508, 0.33924, 0.000140907, 0, 0.968254, 0.323534, 0.000134062, 0, 1, 1, 6.22487e-6, 0, 0, 1, 6.2251e-6, 0, 0, 1, 6.22837e-6, 0, 0, 0.999999, 6.24259e-6, 0, 0, 0.999998, 6.28127e-6, 0, 0, 0.999996, 6.36451e-6, 0, 0, 0.999991, 6.5218e-6, 0, 0, 0.999984, 6.79782e-6, 0, 0, 0.999973, 7.26361e-6, 0, 0, 0.999955, 8.03644e-6, 0, 0, 0.999931, 9.31397e-6, 0, 0, 0.999896, 1.14299e-5, 0, 0, 0.999847, 1.49402e-5, 0, 0, 0.999784, 2.07461e-5, 0, 0, 0.999692, 3.02493e-5, 0, 0, 0.999554, 4.54957e-5, 0, 9.97275e-5, 0.999326, 6.90762e-5, 0, 0.000724813, 0.998757, 0.000101605, 0, 0.0020972, 0.995367, 9.58745e-5, 0, 0.00432324, 0.99209, 8.32808e-5, 0, 0.00746347, 0.989517, 8.87601e-5, 0, 0.0115534, 0.987008, 0.00010564, 0, 0.0166134, 0.98421, 0.000133179, 0, 0.0226552, 0.98021, 0.000161746, 0, 0.0296838, 0.973676, 0.000161821, 0, 0.0377016, 0.967052, 0.000178635, 0, 0.0467079, 0.959385, 0.000206765, 0, 0.0567013, 0.949461, 0.00022476, 0, 0.0676796, 0.939578, 0.00023574, 0, 0.0796403, 0.932416, 0.00025893, 0, 0.0925812, 0.923759, 0.000271228, 0, 0.106501, 0.914223, 0.000289165, 0, 0.121397, 0.902942, 0.000301156, 0, 0.13727, 0.890419, 0.000313852, 0, 0.15412, 0.876639, 0.000324408, 0, 0.171946, 0.861316, 0.00033249, 0, 0.190751, 0.84496, 0.000338497, 0, 0.210537, 0.828427, 0.000345861, 0, 0.231305, 0.811871, 0.000347863, 0, 0.253057, 0.794397, 0.000350225, 0, 0.275797, 0.775726, 0.000349915, 0, 0.299525, 0.75617, 0.000347297, 0, 0.324242, 0.736091, 0.000344232, 0, 0.349947, 0.716213, 0.000340835, 0, 0.376633, 0.695736, 0.000332369, 0, 0.404289, 0.674961, 0.000327943, 0, 0.432895, 0.653518, 0.000318533, 0, 0.462415, 0.632574, 0.000310391, 0, 0.492788, 0.61134, 0.000300755, 0, 0.523909, 0.590017, 0.000290506, 0, 0.555556, 0.568752, 0.000280446, 0, 0.587302, 0.548061, 0.000269902, 0, 0.619048, 0.52711, 0.000258815, 0, 0.650794, 0.506682, 0.000248481, 0, 0.68254, 0.486524, 0.000237141, 0, 0.714286, 0.466812, 0.000226872, 0, 0.746032, 0.44732, 0.000216037, 0, 0.777778, 0.428473, 0.000205629, 0, 0.809524, 0.409921, 0.000195691, 0, 0.84127, 0.392028, 0.000185457, 0, 0.873016, 0.374606, 0.000176436, 0, 0.904762, 0.357601, 0.000166508, 0, 0.936508, 0.341348, 0.000158385, 0, 0.968254, 0.32542, 0.000149203, 0, 1, 1, 1.03967e-5, 0, 0, 1, 1.0397e-5, 0, 0, 1, 1.04019e-5, 0, 0, 0.999999, 1.04231e-5, 0, 0, 0.999998, 1.04806e-5, 0, 0, 0.999995, 1.06042e-5, 0, 0, 0.999991, 1.08366e-5, 0, 0, 0.999982, 1.12415e-5, 0, 0, 0.999968, 1.19174e-5, 0, 0, 0.99995, 1.30227e-5, 0, 0, 0.999922, 1.48176e-5, 0, 0, 0.999884, 1.77303e-5, 0, 0, 0.99983, 2.24564e-5, 0, 0, 0.999758, 3.00966e-5, 0, 0, 0.999654, 4.23193e-5, 0, 5.49083e-6, 0.999503, 6.14848e-5, 0, 0.000296087, 0.999237, 9.03576e-5, 0, 0.00123144, 0.998491, 0.0001271, 0, 0.00295954, 0.994594, 0.000107754, 0, 0.00555829, 0.99178, 0.000103025, 0, 0.00907209, 0.989265, 0.00011154, 0, 0.0135257, 0.986998, 0.000136296, 0, 0.0189327, 0.984137, 0.000169154, 0, 0.0252993, 0.979798, 0.000196671, 0, 0.0326272, 0.97337, 0.000196678, 0, 0.0409157, 0.967239, 0.000223121, 0, 0.0501623, 0.959543, 0.000253809, 0, 0.0603638, 0.949466, 0.000265972, 0, 0.0715171, 0.939074, 0.000288372, 0, 0.0836187, 0.931118, 0.000310983, 0, 0.0966657, 0.922525, 0.000325561, 0, 0.110656, 0.912983, 0.000345725, 0, 0.125588, 0.901617, 0.0003556, 0, 0.141461, 0.889487, 0.000374012, 0, 0.158275, 0.875787, 0.000383445, 0, 0.176031, 0.860654, 0.000393972, 0, 0.19473, 0.844417, 0.000400311, 0, 0.214374, 0.82741, 0.000405004, 0, 0.234967, 0.810545, 0.000407378, 0, 0.256512, 0.793312, 0.000407351, 0, 0.279011, 0.774847, 0.000406563, 0, 0.302468, 0.755621, 0.000404903, 0, 0.326887, 0.735511, 0.000397486, 0, 0.352266, 0.715435, 0.00039357, 0, 0.378605, 0.695403, 0.000384739, 0, 0.405897, 0.674681, 0.000376108, 0, 0.43413, 0.65359, 0.000365997, 0, 0.463277, 0.632471, 0.000354957, 0, 0.493295, 0.61151, 0.000343593, 0, 0.524106, 0.59064, 0.000331841, 0, 0.555561, 0.569386, 0.000318891, 0, 0.587302, 0.548785, 0.0003072, 0, 0.619048, 0.528146, 0.00029361, 0, 0.650794, 0.507872, 0.000281709, 0, 0.68254, 0.487805, 0.000268627, 0, 0.714286, 0.468196, 0.000255887, 0, 0.746032, 0.448922, 0.000243997, 0, 0.777778, 0.430093, 0.000231662, 0, 0.809524, 0.411845, 0.000220339, 0, 0.84127, 0.393808, 0.000208694, 0, 0.873016, 0.376615, 0.000198045, 0, 0.904762, 0.359655, 0.000187375, 0, 0.936508, 0.343452, 0.000177371, 0, 0.968254, 0.32765, 0.000167525, 0, 1, 1, 1.69351e-5, 0, 0, 1, 1.69356e-5, 0, 0, 1, 1.69427e-5, 0, 0, 0.999999, 1.69736e-5, 0, 0, 0.999998, 1.70575e-5, 0, 0, 0.999995, 1.72372e-5, 0, 0, 0.99999, 1.75739e-5, 0, 0, 0.999979, 1.81568e-5, 0, 0, 0.999966, 1.91206e-5, 0, 0, 0.999944, 2.0677e-5, 0, 0, 0.999912, 2.31644e-5, 0, 0, 0.999869, 2.71268e-5, 0, 0, 0.999811, 3.34272e-5, 0, 0, 0.99973, 4.33979e-5, 0, 0, 0.999617, 5.90083e-5, 0, 6.80315e-5, 0.999445, 8.29497e-5, 0, 0.000612796, 0.999138, 0.000118019, 0, 0.00187408, 0.998095, 0.000156712, 0, 0.00395791, 0.993919, 0.000125054, 0, 0.00692144, 0.991333, 0.000126091, 0, 0.0107962, 0.989226, 0.000144912, 0, 0.0155986, 0.986954, 0.000175737, 0, 0.0213364, 0.983982, 0.000213883, 0, 0.0280114, 0.979128, 0.000234526, 0, 0.0356226, 0.973327, 0.000243725, 0, 0.0441668, 0.967416, 0.0002773, 0, 0.0536399, 0.959729, 0.000308799, 0, 0.0640376, 0.949758, 0.000322447, 0, 0.0753554, 0.939173, 0.000350021, 0, 0.0875893, 0.9296, 0.000370089, 0, 0.100736, 0.921181, 0.000391365, 0, 0.114793, 0.91164, 0.000413636, 0, 0.129759, 0.900435, 0.000427068, 0, 0.145632, 0.888183, 0.000441046, 0, 0.162412, 0.874772, 0.000454968, 0, 0.180101, 0.859566, 0.000461882, 0, 0.1987, 0.843579, 0.000471556, 0, 0.218213, 0.826453, 0.000474335, 0, 0.238641, 0.809164, 0.000477078, 0, 0.259989, 0.792179, 0.00047755, 0, 0.282262, 0.773866, 0.000472573, 0, 0.305464, 0.754944, 0.000469765, 0, 0.329599, 0.735133, 0.000462371, 0, 0.35467, 0.714858, 0.000453674, 0, 0.380678, 0.694829, 0.000443888, 0, 0.407622, 0.674453, 0.000432052, 0, 0.435493, 0.653685, 0.000420315, 0, 0.464275, 0.632666, 0.000406829, 0, 0.493938, 0.611676, 0.000392234, 0, 0.524422, 0.591193, 0.000379208, 0, 0.555624, 0.570145, 0.00036319, 0, 0.587302, 0.549566, 0.000349111, 0, 0.619048, 0.529278, 0.000334166, 0, 0.650794, 0.509026, 0.000318456, 0, 0.68254, 0.489186, 0.00030449, 0, 0.714286, 0.469662, 0.000289051, 0, 0.746032, 0.450691, 0.000275494, 0, 0.777778, 0.431841, 0.000261437, 0, 0.809524, 0.413752, 0.000247846, 0, 0.84127, 0.395951, 0.000235085, 0, 0.873016, 0.378633, 0.000222245, 0, 0.904762, 0.36194, 0.000210533, 0, 0.936508, 0.345599, 0.000198494, 0, 0.968254, 0.329999, 0.000188133, 0, 1, 1, 2.69663e-5, 0, 0, 1, 2.6967e-5, 0, 0, 1, 2.69772e-5, 0, 0, 0.999999, 2.70214e-5, 0, 0, 0.999998, 2.71415e-5, 0, 0, 0.999994, 2.7398e-5, 0, 0, 0.999988, 2.78771e-5, 0, 0, 0.999977, 2.87019e-5, 0, 0, 0.999961, 3.00544e-5, 0, 0, 0.999937, 3.22138e-5, 0, 0, 0.999904, 3.56163e-5, 0, 0, 0.999854, 4.09465e-5, 0, 0, 0.99979, 4.92651e-5, 0, 0, 0.999699, 6.21722e-5, 0, 8.8288e-7, 0.999572, 8.19715e-5, 0, 0.000223369, 0.999381, 0.000111689, 0, 0.00105414, 0.999016, 0.000153862, 0, 0.0026493, 0.997437, 0.000187667, 0, 0.00508608, 0.993545, 0.000155672, 0, 0.00840554, 0.991135, 0.000161455, 0, 0.012629, 0.989157, 0.000188241, 0, 0.0177661, 0.986874, 0.000226229, 0, 0.0238198, 0.983714, 0.000268668, 0, 0.0307887, 0.978301, 0.000277109, 0, 0.0386688, 0.973227, 0.000303446, 0, 0.0474554, 0.967317, 0.000341851, 0, 0.0571428, 0.959477, 0.000370885, 0, 0.0677256, 0.950012, 0.000392753, 0, 0.0791988, 0.939484, 0.00042781, 0, 0.0915576, 0.928135, 0.000443866, 0, 0.104798, 0.919819, 0.000472959, 0, 0.118918, 0.910049, 0.000491551, 0, 0.133915, 0.899181, 0.000512616, 0, 0.149788, 0.886881, 0.000523563, 0, 0.166537, 0.87359, 0.000540183, 0, 0.184164, 0.858613, 0.000547386, 0, 0.202669, 0.842809, 0.000554809, 0, 0.222056, 0.825727, 0.000558316, 0, 0.242329, 0.808086, 0.000557824, 0, 0.263492, 0.790728, 0.000556346, 0, 0.285551, 0.772987, 0.000552672, 0, 0.30851, 0.7541, 0.000543738, 0, 0.332376, 0.734669, 0.000536107, 0, 0.357153, 0.714411, 0.000523342, 0, 0.382845, 0.694196, 0.000512238, 0, 0.409454, 0.674252, 0.000497465, 0, 0.436977, 0.65357, 0.000481096, 0, 0.465404, 0.632999, 0.000467054, 0, 0.494713, 0.611994, 0.000448771, 0, 0.524864, 0.591604, 0.000431889, 0, 0.555779, 0.571134, 0.000415238, 0, 0.587302, 0.550528, 0.000396369, 0, 0.619048, 0.530292, 0.000379477, 0, 0.650794, 0.510364, 0.000361488, 0, 0.68254, 0.490749, 0.000343787, 0, 0.714286, 0.471266, 0.000327822, 0, 0.746032, 0.452462, 0.000310626, 0, 0.777778, 0.433907, 0.000295352, 0, 0.809524, 0.415659, 0.000279179, 0, 0.84127, 0.398138, 0.000264685, 0, 0.873016, 0.380833, 0.000249905, 0, 0.904762, 0.364247, 0.000236282, 0, 0.936508, 0.348041, 0.000222905, 0, 0.968254, 0.332389, 0.000210522, 0, 1, 1, 4.20604e-5, 0, 0, 1, 4.20614e-5, 0, 0, 1, 4.20757e-5, 0, 0, 0.999999, 4.2138e-5, 0, 0, 0.999997, 4.23067e-5, 0, 0, 0.999993, 4.26668e-5, 0, 0, 0.999986, 4.33372e-5, 0, 0, 0.999974, 4.44857e-5, 0, 0, 0.999956, 4.63554e-5, 0, 0, 0.99993, 4.93105e-5, 0, 0, 0.999892, 5.39077e-5, 0, 0, 0.999838, 6.10005e-5, 0, 0, 0.999767, 7.18822e-5, 0, 0, 0.999666, 8.84581e-5, 0, 3.65471e-5, 0.999525, 0.000113398, 0, 0.000485623, 0.999311, 0.000150043, 0, 0.00162096, 0.998865, 0.000200063, 0, 0.00355319, 0.996278, 0.000211014, 0, 0.00633818, 0.992956, 0.000189672, 0, 0.0100043, 0.991017, 0.000210262, 0, 0.0145648, 0.989055, 0.000244292, 0, 0.0200237, 0.986741, 0.000290481, 0, 0.0263798, 0.983288, 0.000334303, 0, 0.033629, 0.977784, 0.000340307, 0, 0.0417652, 0.973037, 0.000377864, 0, 0.0507821, 0.967181, 0.0004239, 0, 0.060673, 0.958971, 0.000443854, 0, 0.0714314, 0.950093, 0.000483039, 0, 0.0830518, 0.939552, 0.000517934, 0, 0.0955288, 0.927678, 0.000539449, 0, 0.108859, 0.918278, 0.000568604, 0, 0.123038, 0.908449, 0.000588505, 0, 0.138065, 0.897713, 0.000612473, 0, 0.153938, 0.885533, 0.000625575, 0, 0.170657, 0.872131, 0.00063854, 0, 0.188224, 0.857517, 0.000647034, 0, 0.20664, 0.841796, 0.00065209, 0, 0.225909, 0.824726, 0.0006544, 0, 0.246035, 0.807297, 0.000655744, 0, 0.267022, 0.789058, 0.000646716, 0, 0.288878, 0.77189, 0.000643898, 0, 0.311607, 0.753082, 0.000629973, 0, 0.335216, 0.7341, 0.000621564, 0, 0.359713, 0.714094, 0.000605171, 0, 0.385103, 0.693839, 0.000588752, 0, 0.41139, 0.673891, 0.000573294, 0, 0.438576, 0.653565, 0.000552682, 0, 0.466656, 0.633326, 0.000533446, 0, 0.495617, 0.612582, 0.000514635, 0, 0.525431, 0.59205, 0.00049303, 0, 0.556041, 0.571918, 0.000471842, 0, 0.587338, 0.551572, 0.000451713, 0, 0.619048, 0.531553, 0.000430049, 0, 0.650794, 0.51175, 0.000410445, 0, 0.68254, 0.49238, 0.000390098, 0, 0.714286, 0.473143, 0.000370033, 0, 0.746032, 0.45423, 0.000351205, 0, 0.777778, 0.435963, 0.000332049, 0, 0.809524, 0.41787, 0.000315021, 0, 0.84127, 0.400387, 0.000297315, 0, 0.873016, 0.383332, 0.000281385, 0, 0.904762, 0.366665, 0.000265397, 0, 0.936508, 0.350633, 0.000250601, 0, 0.968254, 0.334964, 0.00023589, 0, 1, 1, 6.43736e-5, 0, 0, 1, 6.4375e-5, 0, 0, 1, 6.43947e-5, 0, 0, 0.999999, 6.4481e-5, 0, 0, 0.999997, 6.47143e-5, 0, 0, 0.999994, 6.52119e-5, 0, 0, 0.999985, 6.61359e-5, 0, 0, 0.999972, 6.77116e-5, 0, 0, 0.999952, 7.02599e-5, 0, 0, 0.999922, 7.42517e-5, 0, 0, 0.99988, 8.03906e-5, 0, 0, 0.99982, 8.97315e-5, 0, 0, 0.999741, 0.000103838, 0, 0, 0.999629, 0.00012496, 0, 0.000149024, 0.999474, 0.000156161, 0, 0.000861027, 0.999229, 0.000201034, 0, 0.00231198, 0.998662, 0.000259069, 0, 0.00458147, 0.995299, 0.000245439, 0, 0.00770895, 0.992732, 0.00024498, 0, 0.0117126, 0.990847, 0.000273211, 0, 0.0165989, 0.988911, 0.000316492, 0, 0.0223674, 0.98654, 0.00037161, 0, 0.0290135, 0.982636, 0.000410352, 0, 0.0365309, 0.977346, 0.000421756, 0, 0.0449117, 0.972909, 0.000475578, 0, 0.0541481, 0.966821, 0.000522482, 0, 0.0642326, 0.958686, 0.000545008, 0, 0.075158, 0.949754, 0.000589286, 0, 0.0869181, 0.939184, 0.000619995, 0, 0.0995074, 0.927505, 0.000654266, 0, 0.112922, 0.916606, 0.000682362, 0, 0.127157, 0.906707, 0.000704286, 0, 0.142212, 0.895937, 0.000725909, 0, 0.158085, 0.883913, 0.000743939, 0, 0.174776, 0.870642, 0.000755157, 0, 0.192287, 0.856241, 0.000764387, 0, 0.210619, 0.84069, 0.000771032, 0, 0.229775, 0.823728, 0.000765906, 0, 0.249761, 0.806481, 0.000767604, 0, 0.270582, 0.787924, 0.000754385, 0, 0.292243, 0.770588, 0.000749668, 0, 0.314753, 0.751991, 0.000731613, 0, 0.338118, 0.733407, 0.000717655, 0, 0.362347, 0.713688, 0.000700604, 0, 0.387447, 0.693595, 0.000678765, 0, 0.413424, 0.673426, 0.000657042, 0, 0.440284, 0.65359, 0.000635892, 0, 0.468027, 0.633576, 0.000611569, 0, 0.496645, 0.613144, 0.000586011, 0, 0.526122, 0.592711, 0.000563111, 0, 0.556417, 0.572722, 0.000537699, 0, 0.587451, 0.552762, 0.000512556, 0, 0.619048, 0.532985, 0.000489757, 0, 0.650794, 0.513219, 0.000464139, 0, 0.68254, 0.493992, 0.000442193, 0, 0.714286, 0.47509, 0.000418629, 0, 0.746032, 0.456287, 0.000397045, 0, 0.777778, 0.438152, 0.000375504, 0, 0.809524, 0.420294, 0.00035492, 0, 0.84127, 0.402749, 0.000335327, 0, 0.873016, 0.385879, 0.000316422, 0, 0.904762, 0.369352, 0.000298333, 0, 0.936508, 0.353301, 0.000281417, 0, 0.968254, 0.337781, 0.000265203, 0, 1, 1, 9.68267e-5, 0, 0, 1, 9.68284e-5, 0, 0, 1, 9.68556e-5, 0, 0, 0.999999, 9.69733e-5, 0, 0, 0.999997, 9.72913e-5, 0, 0, 0.999993, 9.79688e-5, 0, 0, 0.999984, 9.92239e-5, 0, 0, 0.999969, 0.000101356, 0, 0, 0.999946, 0.000104784, 0, 0, 0.999913, 0.000110111, 0, 0, 0.999868, 0.000118217, 0, 0, 0.999801, 0.000130396, 0, 0, 0.999712, 0.000148523, 0, 1.24907e-5, 0.999589, 0.000175233, 0, 0.000355405, 0.999416, 0.000213999, 0, 0.0013528, 0.999136, 0.000268529, 0, 0.00312557, 0.998367, 0.000333088, 0, 0.00573045, 0.994701, 0.000304757, 0, 0.00919397, 0.992497, 0.000318031, 0, 0.0135261, 0.990608, 0.000353863, 0, 0.0187278, 0.988715, 0.000409044, 0, 0.0247947, 0.986241, 0.000472967, 0, 0.0317196, 0.981696, 0.000495104, 0, 0.039494, 0.977097, 0.000532873, 0, 0.0481087, 0.972583, 0.000594447, 0, 0.0575549, 0.966142, 0.000636867, 0, 0.0678242, 0.95823, 0.000669899, 0, 0.0789089, 0.949677, 0.000719499, 0, 0.0908023, 0.939226, 0.000750584, 0, 0.103499, 0.927501, 0.000793183, 0, 0.116993, 0.915199, 0.00081995, 0, 0.131282, 0.90498, 0.000847654, 0, 0.146364, 0.894243, 0.000868929, 0, 0.162237, 0.882154, 0.000884278, 0, 0.178902, 0.869161, 0.000898108, 0, 0.196358, 0.854751, 0.000901254, 0, 0.21461, 0.839368, 0.00090679, 0, 0.23366, 0.822874, 0.000901541, 0, 0.253512, 0.805514, 0.000897297, 0, 0.274174, 0.78716, 0.000881856, 0, 0.29565, 0.769061, 0.000870032, 0, 0.31795, 0.751, 0.000851719, 0, 0.341081, 0.732614, 0.000830671, 0, 0.365053, 0.713171, 0.000806569, 0, 0.389874, 0.693472, 0.00078338, 0, 0.415553, 0.673528, 0.000756404, 0, 0.442098, 0.653397, 0.000726872, 0, 0.469512, 0.633781, 0.000700494, 0, 0.497794, 0.613877, 0.00067105, 0, 0.526935, 0.593506, 0.000640361, 0, 0.556908, 0.573667, 0.000613502, 0, 0.587657, 0.553932, 0.000583177, 0, 0.61906, 0.534345, 0.000554375, 0, 0.650794, 0.515042, 0.000527811, 0, 0.68254, 0.495674, 0.000499367, 0, 0.714286, 0.477132, 0.00047429, 0, 0.746032, 0.458609, 0.000447726, 0, 0.777778, 0.440354, 0.000424205, 0, 0.809524, 0.422765, 0.000399549, 0, 0.84127, 0.405472, 0.000378315, 0, 0.873016, 0.388482, 0.000355327, 0, 0.904762, 0.372191, 0.000336122, 0, 0.936508, 0.356099, 0.000315247, 0, 0.968254, 0.340737, 0.00029794, 0, 1, 1, 0.000143327, 0, 0, 1, 0.00014333, 0, 0, 1, 0.000143366, 0, 0, 0.999999, 0.000143524, 0, 0, 0.999996, 0.000143952, 0, 0, 0.999991, 0.000144862, 0, 0, 0.999981, 0.000146544, 0, 0, 0.999966, 0.000149391, 0, 0, 0.999941, 0.000153946, 0, 0, 0.999905, 0.000160971, 0, 0, 0.999852, 0.000171562, 0, 0, 0.99978, 0.00018729, 0, 0, 0.999681, 0.000210386, 0, 8.26239e-5, 0.999546, 0.000243906, 0, 0.000664807, 0.999352, 0.000291739, 0, 0.00196192, 0.999027, 0.000357419, 0, 0.00405941, 0.997886, 0.000422349, 0, 0.00699664, 0.99419, 0.000385008, 0, 0.0107896, 0.99214, 0.000409775, 0, 0.0154415, 0.990274, 0.000456418, 0, 0.0209488, 0.988455, 0.000527008, 0, 0.0273037, 0.985804, 0.000597685, 0, 0.0344969, 0.98103, 0.000613124, 0, 0.0425183, 0.976674, 0.000668321, 0, 0.0513575, 0.972021, 0.000736985, 0, 0.0610046, 0.965274, 0.000773789, 0, 0.0714508, 0.958046, 0.000830852, 0, 0.0826877, 0.949333, 0.000875766, 0, 0.0947085, 0.939135, 0.000917088, 0, 0.107507, 0.927119, 0.000952244, 0, 0.121078, 0.91469, 0.000990626, 0, 0.135419, 0.903006, 0.00101304, 0, 0.150526, 0.892368, 0.00103834, 0, 0.166399, 0.880231, 0.00105002, 0, 0.183038, 0.867432, 0.00106331, 0, 0.200443, 0.853208, 0.00106783, 0, 0.218618, 0.837956, 0.00106458, 0, 0.237566, 0.821772, 0.00105945, 0, 0.257291, 0.804328, 0.00104685, 0, 0.2778, 0.786465, 0.00103178, 0, 0.2991, 0.768004, 0.00101077, 0, 0.321199, 0.74972, 0.000985504, 0, 0.344106, 0.731682, 0.000962893, 0, 0.36783, 0.712813, 0.000932146, 0, 0.392383, 0.693139, 0.00089871, 0, 0.417774, 0.673566, 0.000869678, 0, 0.444013, 0.653483, 0.000835525, 0, 0.471107, 0.633891, 0.000799853, 0, 0.49906, 0.614433, 0.000766838, 0, 0.527869, 0.594586, 0.000732227, 0, 0.557517, 0.574769, 0.000696442, 0, 0.587966, 0.555149, 0.000663935, 0, 0.61913, 0.535898, 0.000629826, 0, 0.650794, 0.516753, 0.000596486, 0, 0.68254, 0.497816, 0.000567078, 0, 0.714286, 0.479034, 0.000534399, 0, 0.746032, 0.460975, 0.000507013, 0, 0.777778, 0.442935, 0.000477421, 0, 0.809524, 0.425263, 0.000451101, 0, 0.84127, 0.408248, 0.000424964, 0, 0.873016, 0.391339, 0.00039993, 0, 0.904762, 0.37513, 0.000377619, 0, 0.936508, 0.359172, 0.000354418, 0, 0.968254, 0.343876, 0.000334823, 0, 1, 1, 0.000209042, 0, 0, 1, 0.000209045, 0, 0, 1, 0.000209093, 0, 0, 0.999999, 0.000209304, 0, 0, 0.999996, 0.000209871, 0, 0, 0.999991, 0.000211078, 0, 0, 0.999979, 0.000213304, 0, 0, 0.999963, 0.000217061, 0, 0, 0.999933, 0.000223042, 0, 0, 0.999894, 0.000232206, 0, 0, 0.999837, 0.000245901, 0, 0, 0.999756, 0.000266023, 0, 1.02927e-6, 0.999648, 0.000295204, 0, 0.000233468, 0.999499, 0.000336958, 0, 0.00108237, 0.999283, 0.000395563, 0, 0.00268832, 0.998896, 0.000473785, 0, 0.00511138, 0.997006, 0.000520008, 0, 0.00837705, 0.993819, 0.000497261, 0, 0.0124928, 0.991632, 0.000523722, 0, 0.0174561, 0.989875, 0.000587258, 0, 0.0232596, 0.988109, 0.000676329, 0, 0.0298932, 0.985155, 0.000747701, 0, 0.0373453, 0.980479, 0.000768803, 0, 0.0456045, 0.976271, 0.000841054, 0, 0.0546593, 0.971347, 0.000911469, 0, 0.0644994, 0.964528, 0.000953057, 0, 0.0751152, 0.957632, 0.00102221, 0, 0.0864981, 0.948681, 0.00106122, 0, 0.0986407, 0.938716, 0.00111857, 0, 0.111537, 0.926629, 0.00114762, 0, 0.125182, 0.914025, 0.00118995, 0, 0.139571, 0.901026, 0.00121228, 0, 0.154703, 0.890358, 0.00123946, 0, 0.170576, 0.878283, 0.0012527, 0, 0.18719, 0.865459, 0.00125536, 0, 0.204547, 0.851407, 0.00126134, 0, 0.222648, 0.836276, 0.00124759, 0, 0.241498, 0.820436, 0.00124443, 0, 0.261101, 0.803253, 0.00122071, 0, 0.281465, 0.785562, 0.00120107, 0, 0.302595, 0.76718, 0.00117762, 0, 0.324501, 0.748551, 0.00114289, 0, 0.347192, 0.730564, 0.00110872, 0, 0.370679, 0.712253, 0.00107636, 0, 0.394973, 0.692867, 0.00103646, 0, 0.420085, 0.673695, 0.000996793, 0, 0.446027, 0.653912, 0.00095675, 0, 0.47281, 0.634129, 0.000916739, 0, 0.500441, 0.615004, 0.000874401, 0, 0.528921, 0.595587, 0.000833411, 0, 0.558244, 0.575965, 0.000794556, 0, 0.588384, 0.5566, 0.00075196, 0, 0.619281, 0.537428, 0.000716381, 0, 0.650795, 0.518623, 0.000676558, 0, 0.68254, 0.499964, 0.00064074, 0, 0.714286, 0.481356, 0.000605984, 0, 0.746032, 0.463279, 0.000570256, 0, 0.777778, 0.445673, 0.000540138, 0, 0.809524, 0.428032, 0.000507299, 0, 0.84127, 0.411112, 0.000479553, 0, 0.873016, 0.394444, 0.000450737, 0, 0.904762, 0.378247, 0.000424269, 0, 0.936508, 0.362415, 0.000399111, 0, 0.968254, 0.347103, 0.000375274, 0, 1, 1, 0.000300729, 0, 0, 1, 0.000300733, 0, 0, 1, 0.000300797, 0, 0, 0.999998, 0.000301072, 0, 0, 0.999996, 0.000301817, 0, 0, 0.999989, 0.000303398, 0, 0, 0.999977, 0.000306309, 0, 0, 0.999958, 0.000311209, 0, 0, 0.999927, 0.000318975, 0, 0, 0.999884, 0.000330804, 0, 0, 0.99982, 0.00034834, 0, 0, 0.999733, 0.000373854, 0, 3.26995e-5, 0.999613, 0.000410424, 0, 0.000477174, 0.999447, 0.000462047, 0, 0.00161099, 0.999204, 0.000533322, 0, 0.00353153, 0.998725, 0.000624964, 0, 0.00627965, 0.995871, 0.000631786, 0, 0.0098693, 0.993194, 0.000632017, 0, 0.0143011, 0.991541, 0.00068923, 0, 0.019568, 0.989773, 0.000766892, 0, 0.0256593, 0.987647, 0.000863668, 0, 0.0325625, 0.984193, 0.000922089, 0, 0.0402647, 0.980016, 0.000970749, 0, 0.0487532, 0.975859, 0.00106027, 0, 0.058016, 0.970514, 0.00112239, 0, 0.0680419, 0.963625, 0.00117212, 0, 0.0788208, 0.956959, 0.00125211, 0, 0.0903439, 0.947956, 0.00129411, 0, 0.102604, 0.93809, 0.00135879, 0, 0.115594, 0.92659, 0.00139309, 0, 0.129309, 0.913829, 0.00143253, 0, 0.143745, 0.90005, 0.00145809, 0, 0.158901, 0.888129, 0.0014748, 0, 0.174774, 0.87607, 0.00148756, 0, 0.191365, 0.863461, 0.00148714, 0, 0.208674, 0.849594, 0.00148892, 0, 0.226705, 0.834531, 0.00146496, 0, 0.245461, 0.81903, 0.0014579, 0, 0.264947, 0.802122, 0.00143039, 0, 0.28517, 0.78445, 0.00139717, 0, 0.306137, 0.766434, 0.00136312, 0, 0.327857, 0.747816, 0.00132597, 0, 0.350341, 0.729519, 0.00128323, 0, 0.373598, 0.711454, 0.00123803, 0, 0.397642, 0.692699, 0.00119097, 0, 0.422485, 0.673723, 0.00114565, 0, 0.448139, 0.654386, 0.00109552, 0, 0.474619, 0.634673, 0.00104553, 0, 0.501933, 0.615554, 0.00099985, 0, 0.530089, 0.596462, 0.000948207, 0, 0.559087, 0.577385, 0.000902299, 0, 0.588913, 0.558257, 0.000856448, 0, 0.619525, 0.5392, 0.000810395, 0, 0.650826, 0.520543, 0.000768558, 0, 0.68254, 0.502206, 0.0007239, 0, 0.714286, 0.48402, 0.000685794, 0, 0.746032, 0.465779, 0.00064471, 0, 0.777778, 0.448455, 0.000609583, 0, 0.809524, 0.431091, 0.00057227, 0, 0.84127, 0.414147, 0.00054042, 0, 0.873016, 0.39765, 0.000506545, 0, 0.904762, 0.381576, 0.000477635, 0, 0.936508, 0.365881, 0.000448446, 0, 0.968254, 0.350582, 0.000421424, 0, 1, 1, 0.000427144, 0, 0, 1, 0.000427151, 0, 0, 1, 0.000427232, 0, 0, 0.999998, 0.00042759, 0, 0, 0.999995, 0.000428555, 0, 0, 0.999988, 0.000430603, 0, 0, 0.999976, 0.000434368, 0, 0, 0.999952, 0.000440688, 0, 0, 0.999919, 0.000450667, 0, 0, 0.999871, 0.00046578, 0, 0, 0.999801, 0.000488024, 0, 0, 0.999704, 0.000520092, 0, 0.000129791, 0.999572, 0.000565553, 0, 0.000821056, 0.999389, 0.000628906, 0, 0.00225241, 0.999114, 0.000714911, 0, 0.00449109, 0.998488, 0.000819218, 0, 0.00756249, 0.995234, 0.00080415, 0, 0.0114716, 0.993021, 0.000830181, 0, 0.0162131, 0.991407, 0.000902645, 0, 0.021776, 0.989625, 0.000996934, 0, 0.0281471, 0.987064, 0.00109707, 0, 0.0353118, 0.983265, 0.00114353, 0, 0.0432562, 0.979535, 0.0012272, 0, 0.0519665, 0.975224, 0.00132642, 0, 0.0614298, 0.969574, 0.00138092, 0, 0.0716348, 0.963021, 0.00145896, 0, 0.0825709, 0.956046, 0.00152834, 0, 0.094229, 0.947136, 0.00158217, 0, 0.106602, 0.937313, 0.0016347, 0, 0.119682, 0.926073, 0.00168383, 0, 0.133465, 0.913121, 0.00171627, 0, 0.147947, 0.899165, 0.00174229, 0, 0.163125, 0.885891, 0.00176137, 0, 0.178998, 0.873783, 0.00176406, 0, 0.195566, 0.861331, 0.00176156, 0, 0.21283, 0.847569, 0.00175346, 0, 0.230793, 0.832785, 0.00172753, 0, 0.249459, 0.817442, 0.00170204, 0, 0.268832, 0.800613, 0.00166576, 0, 0.28892, 0.783597, 0.00162909, 0, 0.30973, 0.76571, 0.0015826, 0, 0.331271, 0.747021, 0.00153106, 0, 0.353554, 0.728593, 0.00148036, 0, 0.37659, 0.710661, 0.00142808, 0, 0.400391, 0.692426, 0.00136906, 0, 0.424973, 0.673623, 0.00131066, 0, 0.450347, 0.65494, 0.00125569, 0, 0.476531, 0.635448, 0.00119517, 0, 0.503535, 0.616221, 0.00113828, 0, 0.531372, 0.597531, 0.0010816, 0, 0.560047, 0.578795, 0.00102673, 0, 0.589554, 0.559892, 0.000970985, 0, 0.619869, 0.541307, 0.000919773, 0, 0.650923, 0.522608, 0.000868479, 0, 0.68254, 0.504484, 0.00082137, 0, 0.714286, 0.486603, 0.000772916, 0, 0.746032, 0.468802, 0.000730353, 0, 0.777778, 0.451172, 0.000684955, 0, 0.809524, 0.434348, 0.000647565, 0, 0.84127, 0.417445, 0.000605863, 0, 0.873016, 0.401077, 0.000571885, 0, 0.904762, 0.385039, 0.000536034, 0, 0.936508, 0.369483, 0.000504227, 0, 0.968254, 0.354272, 0.000473165, 0, 1, 1, 0.000599525, 0, 0, 1, 0.000599533, 0, 0, 1, 0.000599639, 0, 0, 0.999998, 0.000600097, 0, 0, 0.999994, 0.000601336, 0, 0, 0.999987, 0.000603958, 0, 0, 0.999972, 0.000608775, 0, 0, 0.999949, 0.000616842, 0, 0, 0.999912, 0.000629534, 0, 0, 0.999857, 0.000648658, 0, 0, 0.999781, 0.000676615, 0, 5.38873e-6, 0.999674, 0.000716574, 0, 0.000308602, 0.999528, 0.000772641, 0, 0.00127003, 0.999326, 0.000849806, 0, 0.00300783, 0.999009, 0.000952682, 0, 0.00556637, 0.998112, 0.00106394, 0, 0.00895889, 0.994496, 0.00102228, 0, 0.0131827, 0.992806, 0.00108586, 0, 0.0182277, 0.991211, 0.0011759, 0, 0.0240795, 0.989415, 0.00128955, 0, 0.030723, 0.986499, 0.00139038, 0, 0.0381418, 0.982679, 0.00144539, 0, 0.046321, 0.978839, 0.00153954, 0, 0.0552459, 0.974295, 0.00164417, 0, 0.0649034, 0.968784, 0.00171517, 0, 0.0752814, 0.962324, 0.00180282, 0, 0.0863693, 0.954956, 0.00186387, 0, 0.0981578, 0.94624, 0.00193817, 0, 0.110639, 0.936517, 0.00198156, 0, 0.123806, 0.925186, 0.00203042, 0, 0.137655, 0.91252, 0.0020664, 0, 0.15218, 0.898441, 0.00207822, 0, 0.16738, 0.884394, 0.0020992, 0, 0.183253, 0.871273, 0.00208748, 0, 0.199799, 0.859057, 0.00208686, 0, 0.21702, 0.845243, 0.00205519, 0, 0.234918, 0.830723, 0.00202868, 0, 0.253496, 0.815801, 0.00199501, 0, 0.272761, 0.79914, 0.00194193, 0, 0.292719, 0.782372, 0.00188824, 0, 0.313377, 0.76482, 0.00183695, 0, 0.334745, 0.746586, 0.00177418, 0, 0.356833, 0.7281, 0.00170628, 0, 0.379654, 0.709842, 0.00164063, 0, 0.403221, 0.692019, 0.00157355, 0, 0.427548, 0.67364, 0.00150262, 0, 0.452651, 0.655277, 0.00143473, 0, 0.478545, 0.636438, 0.00136371, 0, 0.505246, 0.617364, 0.00129911, 0, 0.532768, 0.598603, 0.00123014, 0, 0.561122, 0.580195, 0.00116587, 0, 0.590309, 0.561786, 0.00110398, 0, 0.620318, 0.543377, 0.00104148, 0, 0.651102, 0.525093, 0.000983984, 0, 0.682545, 0.506791, 0.00092667, 0, 0.714286, 0.489291, 0.000874326, 0, 0.746032, 0.471811, 0.000821734, 0, 0.777778, 0.454435, 0.000774698, 0, 0.809524, 0.437493, 0.000727302, 0, 0.84127, 0.420977, 0.000684039, 0, 0.873016, 0.404729, 0.00064373, 0, 0.904762, 0.388756, 0.00060285, 0, 0.936508, 0.373344, 0.00056765, 0, 0.968254, 0.358191, 0.000531929, 0, 1, 1, 0.000832169, 0, 0, 1, 0.000832178, 0, 0, 1, 0.00083231, 0, 0, 0.999998, 0.000832893, 0, 0, 0.999995, 0.000834465, 0, 0, 0.999985, 0.000837791, 0, 0, 0.999969, 0.000843893, 0, 0, 0.999944, 0.000854086, 0, 0, 0.999903, 0.000870071, 0, 0, 0.999843, 0.000894042, 0, 0, 0.999759, 0.000928865, 0, 5.31805e-5, 0.999643, 0.000978242, 0, 0.000579365, 0.99948, 0.00104684, 0, 0.00182774, 0.999255, 0.00114012, 0, 0.00387804, 0.998885, 0.00126188, 0, 0.00675709, 0.997405, 0.00135888, 0, 0.010468, 0.99424, 0.00133626, 0, 0.0150018, 0.992458, 0.00140905, 0, 0.0203443, 0.990929, 0.00152305, 0, 0.0264786, 0.989116, 0.00165882, 0, 0.0333875, 0.985624, 0.00174128, 0, 0.0410536, 0.982003, 0.00182108, 0, 0.0494609, 0.978336, 0.00194498, 0, 0.0585941, 0.973184, 0.00202708, 0, 0.0684396, 0.9678, 0.00212166, 0, 0.0789851, 0.961348, 0.00221366, 0, 0.0902199, 0.953841, 0.00228219, 0, 0.102134, 0.94534, 0.00235662, 0, 0.114721, 0.935552, 0.00240572, 0, 0.127972, 0.924064, 0.00244405, 0, 0.141884, 0.911827, 0.00247557, 0, 0.156451, 0.897731, 0.00248374, 0, 0.171672, 0.883409, 0.00249863, 0, 0.187545, 0.868625, 0.00246688, 0, 0.20407, 0.856529, 0.00246523, 0, 0.221249, 0.842999, 0.00242368, 0, 0.239083, 0.828505, 0.00237354, 0, 0.257578, 0.813825, 0.00232588, 0, 0.276738, 0.797813, 0.00226731, 0, 0.296569, 0.781097, 0.00219704, 0, 0.31708, 0.764038, 0.00212394, 0, 0.338281, 0.746067, 0.00204786, 0, 0.360181, 0.727687, 0.00196728, 0, 0.382794, 0.709571, 0.00188779, 0, 0.406133, 0.691503, 0.00180532, 0, 0.430213, 0.673673, 0.00171849, 0, 0.45505, 0.655732, 0.00164147, 0, 0.480662, 0.637399, 0.00155858, 0, 0.507065, 0.618616, 0.00147641, 0, 0.534278, 0.60005, 0.00140125, 0, 0.562313, 0.581713, 0.00132441, 0, 0.59118, 0.563546, 0.00125014, 0, 0.620875, 0.545605, 0.00118249, 0, 0.651373, 0.527559, 0.0011116, 0, 0.682593, 0.509764, 0.00104979, 0, 0.714286, 0.49193, 0.000985977, 0, 0.746032, 0.475011, 0.000928592, 0, 0.777778, 0.457878, 0.000873466, 0, 0.809524, 0.440979, 0.000819585, 0, 0.84127, 0.424613, 0.000772365, 0, 0.873016, 0.408549, 0.000722195, 0, 0.904762, 0.392771, 0.000680014, 0, 0.936508, 0.377317, 0.000636797, 0, 0.968254, 0.362352, 0.000598318, 0, 1, 1, 0.00114313, 0, 0, 1, 0.00114314, 0, 0, 0.999999, 0.00114331, 0, 0, 0.999998, 0.00114404, 0, 0, 0.999994, 0.00114601, 0, 0, 0.999984, 0.00115019, 0, 0, 0.999967, 0.00115784, 0, 0, 0.999937, 0.0011706, 0, 0, 0.999894, 0.00119054, 0, 0, 0.999828, 0.00122031, 0, 0, 0.999735, 0.00126331, 0, 0.000169263, 0.999606, 0.00132382, 0, 0.000949167, 0.999426, 0.0014071, 0, 0.00249668, 0.999173, 0.00151895, 0, 0.00486392, 0.99873, 0.00166102, 0, 0.00806323, 0.996243, 0.0017023, 0, 0.0120895, 0.993779, 0.00172782, 0, 0.0169288, 0.9919, 0.0018108, 0, 0.0225633, 0.990524, 0.00196028, 0, 0.028974, 0.98868, 0.00212014, 0, 0.036142, 0.984663, 0.00217598, 0, 0.044049, 0.981457, 0.00230563, 0, 0.0526781, 0.977608, 0.00243966, 0, 0.0620137, 0.972215, 0.00251336, 0, 0.0720418, 0.966798, 0.0026285, 0, 0.0827499, 0.960241, 0.00271409, 0, 0.0941271, 0.952489, 0.00278381, 0, 0.106164, 0.944127, 0.00285399, 0, 0.118852, 0.934282, 0.00290994, 0, 0.132185, 0.923271, 0.00294558, 0, 0.146157, 0.910803, 0.00296269, 0, 0.160766, 0.896705, 0.00296803, 0, 0.176007, 0.88238, 0.00296637, 0, 0.19188, 0.867116, 0.00293163, 0, 0.208385, 0.853636, 0.00289418, 0, 0.225523, 0.840469, 0.00284663, 0, 0.243296, 0.82639, 0.00278594, 0, 0.261709, 0.811759, 0.00271618, 0, 0.280767, 0.796113, 0.00263187, 0, 0.300476, 0.779518, 0.00254589, 0, 0.320845, 0.763142, 0.00246003, 0, 0.341883, 0.745464, 0.00236529, 0, 0.363601, 0.727491, 0.00226536, 0, 0.386011, 0.709414, 0.00216375, 0, 0.409128, 0.691396, 0.00207127, 0, 0.432967, 0.67368, 0.00197106, 0, 0.457545, 0.656049, 0.00187022, 0, 0.482881, 0.638188, 0.00177605, 0, 0.508992, 0.620177, 0.00168482, 0, 0.535899, 0.601506, 0.00158909, 0, 0.563619, 0.58362, 0.00150583, 0, 0.592165, 0.565496, 0.00141791, 0, 0.621544, 0.54789, 0.00133693, 0, 0.651743, 0.530323, 0.00126038, 0, 0.682709, 0.512795, 0.00118556, 0, 0.714286, 0.495199, 0.00111527, 0, 0.746032, 0.478101, 0.0010489, 0, 0.777778, 0.461511, 0.000984264, 0, 0.809524, 0.444879, 0.00092591, 0, 0.84127, 0.428424, 0.000866582, 0, 0.873016, 0.412495, 0.000814463, 0, 0.904762, 0.396975, 0.000764498, 0, 0.936508, 0.381614, 0.000715967, 0, 0.968254, 0.366732, 0.000672483, 0, 1, 1, 0.00155501, 0, 0, 1, 0.00155503, 0, 0, 1, 0.00155524, 0, 0, 0.999998, 0.00155615, 0, 0, 0.999994, 0.0015586, 0, 0, 0.999983, 0.00156379, 0, 0, 0.999963, 0.0015733, 0, 0, 0.999932, 0.00158911, 0, 0, 0.999882, 0.00161376, 0, 0, 0.99981, 0.00165041, 0, 1.00875e-5, 0.999708, 0.00170304, 0, 0.000367658, 0.999565, 0.00177658, 0, 0.0014234, 0.999368, 0.00187688, 0, 0.00327939, 0.999081, 0.00200989, 0, 0.00596629, 0.99852, 0.00217177, 0, 0.0094852, 0.99549, 0.0021745, 0, 0.013824, 0.993252, 0.00222357, 0, 0.0189642, 0.991727, 0.00235022, 0, 0.0248856, 0.989951, 0.00250561, 0, 0.0315669, 0.988029, 0.00268829, 0, 0.0389882, 0.984029, 0.0027496, 0, 0.0471302, 0.980683, 0.00289793, 0, 0.0559754, 0.976554, 0.00303315, 0, 0.0655081, 0.97139, 0.00313257, 0, 0.0757138, 0.965544, 0.00323656, 0, 0.08658, 0.95912, 0.00333432, 0, 0.0980954, 0.951183, 0.0034039, 0, 0.110251, 0.942974, 0.00347515, 0, 0.123038, 0.932642, 0.00350381, 0, 0.13645, 0.922158, 0.00354519, 0, 0.150482, 0.909404, 0.00353851, 0, 0.165129, 0.896071, 0.0035435, 0, 0.18039, 0.881206, 0.00349936, 0, 0.196263, 0.866077, 0.00347256, 0, 0.212748, 0.85093, 0.003415, 0, 0.229847, 0.837703, 0.00333367, 0, 0.247561, 0.823878, 0.003249, 0, 0.265895, 0.809449, 0.00316347, 0, 0.284854, 0.794379, 0.00306351, 0, 0.304445, 0.778138, 0.0029499, 0, 0.324675, 0.761997, 0.00284099, 0, 0.345555, 0.744938, 0.00272104, 0, 0.367095, 0.727212, 0.00260715, 0, 0.389309, 0.709549, 0.00248855, 0, 0.41221, 0.691704, 0.00236783, 0, 0.435814, 0.673689, 0.00225178, 0, 0.460138, 0.656453, 0.00213765, 0, 0.485203, 0.639128, 0.00202178, 0, 0.511028, 0.621512, 0.00191443, 0, 0.537634, 0.603598, 0.00180977, 0, 0.565041, 0.58559, 0.00170456, 0, 0.593268, 0.567852, 0.00160927, 0, 0.622327, 0.5503, 0.00151395, 0, 0.652217, 0.533033, 0.00142499, 0, 0.682907, 0.515942, 0.00133955, 0, 0.714296, 0.498814, 0.0012602, 0, 0.746032, 0.481595, 0.00118188, 0, 0.777778, 0.465117, 0.00111171, 0, 0.809524, 0.448865, 0.00104091, 0, 0.84127, 0.432711, 0.000976618, 0, 0.873016, 0.416822, 0.00091859, 0, 0.904762, 0.401272, 0.000857704, 0, 0.936508, 0.386226, 0.000807172, 0, 0.968254, 0.371321, 0.00075464, 0, 1, 1, 0.00209596, 0, 0, 1, 0.00209598, 0, 0, 1, 0.00209624, 0, 0, 0.999997, 0.00209736, 0, 0, 0.999991, 0.00210039, 0, 0, 0.999979, 0.00210678, 0, 0, 0.999959, 0.00211847, 0, 0, 0.999925, 0.0021379, 0, 0, 0.99987, 0.00216809, 0, 0, 0.999791, 0.00221281, 0, 6.81487e-5, 0.999677, 0.00227669, 0, 0.000658161, 0.999521, 0.00236533, 0, 0.00200635, 0.999301, 0.00248514, 0, 0.0041779, 0.998977, 0.00264185, 0, 0.00718648, 0.998191, 0.00281695, 0, 0.0110239, 0.994801, 0.00278518, 0, 0.015672, 0.993091, 0.00288774, 0, 0.0211091, 0.991571, 0.00303931, 0, 0.0273123, 0.9897, 0.00321643, 0, 0.034259, 0.987023, 0.00337332, 0, 0.0419282, 0.983289, 0.00346146, 0, 0.0502998, 0.979892, 0.00363704, 0, 0.0593562, 0.975111, 0.00373601, 0, 0.069081, 0.970351, 0.0038842, 0, 0.0794598, 0.964131, 0.00397053, 0, 0.0904798, 0.957747, 0.00408078, 0, 0.10213, 0.949536, 0.00413533, 0, 0.1144, 0.941372, 0.00420305, 0, 0.127284, 0.931049, 0.00422815, 0, 0.140772, 0.920647, 0.00425048, 0, 0.154862, 0.908033, 0.0042281, 0, 0.169548, 0.895028, 0.00422026, 0, 0.184828, 0.879968, 0.00415042, 0, 0.200701, 0.864875, 0.00408821, 0, 0.217167, 0.84918, 0.00400909, 0, 0.234227, 0.834934, 0.00391178, 0, 0.251884, 0.821397, 0.00380066, 0, 0.270141, 0.807135, 0.00367974, 0, 0.289004, 0.792363, 0.00355172, 0, 0.308479, 0.776661, 0.003411, 0, 0.328575, 0.760705, 0.00328123, 0, 0.349301, 0.744408, 0.00314003, 0, 0.370668, 0.726994, 0.0029906, 0, 0.392689, 0.709598, 0.00285034, 0, 0.415379, 0.692112, 0.00271179, 0, 0.438754, 0.674435, 0.00257185, 0, 0.46283, 0.65676, 0.00243425, 0, 0.48763, 0.639982, 0.00230351, 0, 0.513173, 0.622983, 0.0021777, 0, 0.539482, 0.605471, 0.00204991, 0, 0.566579, 0.58796, 0.00193759, 0, 0.594488, 0.570463, 0.00181976, 0, 0.623226, 0.553058, 0.00171497, 0, 0.6528, 0.535894, 0.00161109, 0, 0.683198, 0.519089, 0.00151394, 0, 0.714354, 0.502454, 0.00142122, 0, 0.746032, 0.485681, 0.00133488, 0, 0.777778, 0.468935, 0.00124975, 0, 0.809524, 0.452951, 0.00117309, 0, 0.84127, 0.437139, 0.00110155, 0, 0.873016, 0.421446, 0.00103124, 0, 0.904762, 0.405951, 0.000966387, 0, 0.936508, 0.391003, 0.000908119, 0, 0.968254, 0.376198, 0.000848057, 0, 1, 1, 0.00280076, 0, 0, 1, 0.00280078, 0, 0, 0.999999, 0.00280109, 0, 0, 0.999997, 0.00280246, 0, 0, 0.999992, 0.00280616, 0, 0, 0.999979, 0.00281396, 0, 0, 0.999956, 0.00282822, 0, 0, 0.999916, 0.00285186, 0, 0, 0.999857, 0.0028885, 0, 0, 0.999768, 0.00294259, 0, 0.000196026, 0.999645, 0.00301946, 0, 0.00104842, 0.99947, 0.00312541, 0, 0.00270199, 0.999229, 0.00326733, 0, 0.00519449, 0.998852, 0.00344992, 0, 0.00852602, 0.997558, 0.00361052, 0, 0.0126804, 0.994417, 0.0035898, 0, 0.017635, 0.992824, 0.00372393, 0, 0.023365, 0.991344, 0.00390695, 0, 0.0298456, 0.989337, 0.00410392, 0, 0.0370529, 0.985811, 0.00420987, 0, 0.0449651, 0.982772, 0.00437488, 0, 0.0535615, 0.979001, 0.00455069, 0, 0.0628243, 0.974102, 0.00464462, 0, 0.0727368, 0.969197, 0.00480577, 0, 0.0832844, 0.962759, 0.00487818, 0, 0.0944545, 0.956207, 0.00498176, 0, 0.106236, 0.947909, 0.00503392, 0, 0.118619, 0.939596, 0.00507474, 0, 0.131595, 0.929642, 0.00509798, 0, 0.145159, 0.918807, 0.00508476, 0, 0.159305, 0.906921, 0.00505634, 0, 0.174028, 0.893312, 0.00498845, 0, 0.189327, 0.878933, 0.0049133, 0, 0.2052, 0.863986, 0.0048259, 0, 0.221647, 0.847936, 0.00470848, 0, 0.23867, 0.832253, 0.00456889, 0, 0.25627, 0.818619, 0.00442726, 0, 0.274453, 0.804788, 0.00427677, 0, 0.293222, 0.790241, 0.00411906, 0, 0.312585, 0.775162, 0.00394833, 0, 0.33255, 0.759463, 0.00377366, 0, 0.353126, 0.743598, 0.00361026, 0, 0.374324, 0.72697, 0.00343627, 0, 0.396158, 0.709646, 0.00326422, 0, 0.418641, 0.69277, 0.00309717, 0, 0.44179, 0.675371, 0.0029356, 0, 0.465624, 0.657863, 0.00277712, 0, 0.490163, 0.640772, 0.00261738, 0, 0.515429, 0.624441, 0.0024737, 0, 0.541445, 0.607497, 0.00233125, 0, 0.568236, 0.590438, 0.00218994, 0, 0.595828, 0.573224, 0.0020664, 0, 0.624242, 0.556168, 0.00193526, 0, 0.653496, 0.539232, 0.00182463, 0, 0.683588, 0.522352, 0.00170735, 0, 0.714482, 0.506172, 0.00160555, 0, 0.746032, 0.489842, 0.00150451, 0, 0.777778, 0.473463, 0.00140938, 0, 0.809524, 0.457266, 0.00132568, 0, 0.84127, 0.441609, 0.0012376, 0, 0.873016, 0.426348, 0.00116265, 0, 0.904762, 0.411002, 0.00108935, 0, 0.936508, 0.396045, 0.00101946, 0, 0.968254, 0.381448, 0.000955665, 0, 1, 1, 0.0037121, 0, 0, 1, 0.00371213, 0, 0, 1, 0.00371251, 0, 0, 0.999997, 0.00371417, 0, 0, 0.99999, 0.00371863, 0, 0, 0.999977, 0.00372807, 0, 0, 0.99995, 0.00374529, 0, 0, 0.999908, 0.0037738, 0, 0, 0.999843, 0.00381789, 0, 1.23596e-5, 0.999745, 0.00388273, 0, 0.000407442, 0.999608, 0.00397443, 0, 0.0015447, 0.999415, 0.00409998, 0, 0.00351385, 0.999143, 0.00426662, 0, 0.0063316, 0.9987, 0.00447625, 0, 0.00998679, 0.996363, 0.00455323, 0, 0.0144569, 0.994021, 0.00461052, 0, 0.0197151, 0.992372, 0.00476359, 0, 0.0257344, 0.991007, 0.00499101, 0, 0.0324882, 0.988767, 0.0051972, 0, 0.0399517, 0.984872, 0.00528407, 0, 0.0481022, 0.982004, 0.00548926, 0, 0.0569191, 0.977714, 0.00564385, 0, 0.0663839, 0.973076, 0.0057693, 0, 0.0764801, 0.967565, 0.0058924, 0, 0.0871928, 0.961384, 0.00599629, 0, 0.0985095, 0.954435, 0.00605998, 0, 0.110419, 0.946303, 0.0061133, 0, 0.122912, 0.937662, 0.00612028, 0, 0.13598, 0.927867, 0.00612209, 0, 0.149617, 0.916475, 0.00604813, 0, 0.163817, 0.90541, 0.00603088, 0, 0.178577, 0.891591, 0.00592218, 0, 0.193894, 0.877573, 0.00578854, 0, 0.209767, 0.862511, 0.00566648, 0, 0.226196, 0.846861, 0.00551481, 0, 0.243182, 0.83068, 0.00533754, 0, 0.260728, 0.815725, 0.00515487, 0, 0.278837, 0.802321, 0.0049655, 0, 0.297515, 0.787826, 0.00475421, 0, 0.316768, 0.773454, 0.00456002, 0, 0.336605, 0.758224, 0.00434727, 0, 0.357034, 0.74265, 0.00414444, 0, 0.378067, 0.726729, 0.00393738, 0, 0.399717, 0.710155, 0.00373575, 0, 0.421998, 0.693312, 0.00353736, 0, 0.444928, 0.67653, 0.00334368, 0, 0.468523, 0.659444, 0.00315981, 0, 0.492806, 0.642051, 0.00297809, 0, 0.517798, 0.625758, 0.00280592, 0, 0.543525, 0.609615, 0.00264254, 0, 0.570012, 0.592919, 0.00248459, 0, 0.597288, 0.576298, 0.00233327, 0, 0.625379, 0.559489, 0.00219519, 0, 0.654307, 0.542891, 0.00205441, 0, 0.684084, 0.526255, 0.00193385, 0, 0.714693, 0.509853, 0.00180745, 0, 0.746044, 0.494131, 0.00169817, 0, 0.777778, 0.478114, 0.0015913, 0, 0.809524, 0.462274, 0.00148981, 0, 0.84127, 0.446412, 0.00139537, 0, 0.873016, 0.431274, 0.00130984, 0, 0.904762, 0.41635, 0.00122403, 0, 0.936508, 0.401476, 0.00114809, 0, 0.968254, 0.386993, 0.00107563, 0, 1, 1, 0.00488216, 0, 0, 1, 0.0048822, 0, 0, 1, 0.00488265, 0, 0, 0.999997, 0.00488463, 0, 0, 0.999988, 0.00488999, 0, 0, 0.999974, 0.00490129, 0, 0, 0.999946, 0.00492191, 0, 0, 0.999897, 0.00495598, 0, 0, 0.999825, 0.00500855, 0, 7.44791e-5, 0.999718, 0.00508559, 0, 0.000712744, 0.999565, 0.005194, 0, 0.00215249, 0.999352, 0.00534147, 0, 0.00444576, 0.999046, 0.00553523, 0, 0.00759218, 0.998492, 0.00577016, 0, 0.0115714, 0.995564, 0.00578487, 0, 0.0163557, 0.993339, 0.00586414, 0, 0.021915, 0.991834, 0.00606002, 0, 0.0282201, 0.990496, 0.00633312, 0, 0.0352433, 0.987826, 0.00651941, 0, 0.042959, 0.98383, 0.00660842, 0, 0.0513439, 0.98109, 0.00685523, 0, 0.0603772, 0.976131, 0.00695778, 0, 0.0700402, 0.971922, 0.00714236, 0, 0.0803163, 0.965901, 0.00721437, 0, 0.0911908, 0.959606, 0.00732017, 0, 0.102651, 0.952504, 0.00735788, 0, 0.114686, 0.944365, 0.00738493, 0, 0.127286, 0.935652, 0.00737969, 0, 0.140443, 0.925813, 0.00733612, 0, 0.154151, 0.914397, 0.00723094, 0, 0.168405, 0.903257, 0.00714002, 0, 0.183201, 0.890015, 0.00700149, 0, 0.198536, 0.876014, 0.00682813, 0, 0.214409, 0.861436, 0.00665567, 0, 0.23082, 0.845752, 0.00644526, 0, 0.24777, 0.829169, 0.00621635, 0, 0.265263, 0.813435, 0.00597789, 0, 0.283301, 0.799701, 0.00575694, 0, 0.301889, 0.785726, 0.00549866, 0, 0.321035, 0.77152, 0.0052503, 0, 0.340746, 0.75683, 0.00499619, 0, 0.361032, 0.741951, 0.0047543, 0, 0.381904, 0.726367, 0.0045084, 0, 0.403374, 0.710537, 0.00426784, 0, 0.425457, 0.693965, 0.00403487, 0, 0.448169, 0.677724, 0.0038075, 0, 0.47153, 0.66117, 0.00359431, 0, 0.495561, 0.644274, 0.00338354, 0, 0.520284, 0.627449, 0.00318163, 0, 0.545725, 0.611645, 0.00299672, 0, 0.571911, 0.595614, 0.00281016, 0, 0.598873, 0.579426, 0.00264252, 0, 0.62664, 0.563016, 0.00247509, 0, 0.655239, 0.546728, 0.00232647, 0, 0.684692, 0.530539, 0.00217803, 0, 0.714999, 0.514164, 0.00204216, 0, 0.746106, 0.498344, 0.00191403, 0, 0.777778, 0.482957, 0.00179203, 0, 0.809524, 0.467336, 0.00167695, 0, 0.84127, 0.451994, 0.00157567, 0, 0.873016, 0.436514, 0.00147113, 0, 0.904762, 0.42178, 0.00138034, 0, 0.936508, 0.407271, 0.00129219, 0, 0.968254, 0.392822, 0.0012098, 0, 1, 1, 0.00637427, 0, 0, 1, 0.00637431, 0, 0, 0.999999, 0.00637485, 0, 0, 0.999996, 0.00637721, 0, 0, 0.999987, 0.00638357, 0, 0, 0.999971, 0.006397, 0, 0, 0.999939, 0.00642142, 0, 0, 0.999888, 0.00646177, 0, 0, 0.999807, 0.00652387, 0, 0.000207916, 0.999689, 0.00661454, 0, 0.00112051, 0.99952, 0.00674155, 0, 0.00287719, 0.999283, 0.00691313, 0, 0.00550145, 0.998936, 0.00713598, 0, 0.00897928, 0.998165, 0.00738501, 0, 0.0132829, 0.994847, 0.00734388, 0, 0.01838, 0.993182, 0.00749991, 0, 0.0242381, 0.991665, 0.0077246, 0, 0.030826, 0.989708, 0.00797579, 0, 0.0381152, 0.986663, 0.00813011, 0, 0.0460794, 0.983288, 0.00830365, 0, 0.0546951, 0.980104, 0.00853496, 0, 0.0639411, 0.974855, 0.00861045, 0, 0.0737988, 0.97045, 0.00879133, 0, 0.0842516, 0.964509, 0.00886377, 0, 0.0952848, 0.957594, 0.00890346, 0, 0.106886, 0.950546, 0.00893289, 0, 0.119044, 0.942225, 0.00890074, 0, 0.131749, 0.933365, 0.00886826, 0, 0.144994, 0.923202, 0.0087316, 0, 0.158772, 0.912605, 0.00863082, 0, 0.173078, 0.901099, 0.00847403, 0, 0.187908, 0.888177, 0.00825838, 0, 0.203261, 0.873955, 0.00801834, 0, 0.219134, 0.860091, 0.00779026, 0, 0.235527, 0.84434, 0.00752478, 0, 0.252443, 0.828517, 0.00724074, 0, 0.269883, 0.81239, 0.00693769, 0, 0.287851, 0.79721, 0.00664817, 0, 0.306352, 0.783489, 0.00634763, 0, 0.325393, 0.769514, 0.00604221, 0, 0.344981, 0.755419, 0.00573568, 0, 0.365126, 0.741083, 0.00544359, 0, 0.385839, 0.726059, 0.00515515, 0, 0.407132, 0.710809, 0.00487139, 0, 0.42902, 0.695052, 0.00459846, 0, 0.45152, 0.678886, 0.00433412, 0, 0.474651, 0.663042, 0.00407981, 0, 0.498433, 0.646634, 0.00384264, 0, 0.52289, 0.630117, 0.00360897, 0, 0.548048, 0.613804, 0.00338863, 0, 0.573936, 0.598338, 0.00318486, 0, 0.600584, 0.582687, 0.00298377, 0, 0.628027, 0.566809, 0.00280082, 0, 0.656295, 0.550817, 0.00262255, 0, 0.685417, 0.534937, 0.00245835, 0, 0.715406, 0.519151, 0.00230574, 0, 0.74624, 0.503118, 0.0021549, 0, 0.777778, 0.487723, 0.00202008, 0, 0.809524, 0.472725, 0.00189355, 0, 0.84127, 0.457599, 0.00177108, 0, 0.873016, 0.442558, 0.00165843, 0, 0.904762, 0.427624, 0.00155494, 0, 0.936508, 0.413171, 0.00145273, 0, 0.968254, 0.399122, 0.00136454, 0, 1, 1, 0.00826496, 0, 0, 1, 0.00826499, 0, 0, 1, 0.00826564, 0, 0, 0.999996, 0.00826842, 0, 0, 0.999987, 0.00827589, 0, 0, 0.999967, 0.00829167, 0, 0, 0.999933, 0.00832037, 0, 0, 0.999876, 0.00836768, 0, 1.09338e-5, 0.999786, 0.00844031, 0, 0.000427145, 0.999655, 0.00854603, 0, 0.0016384, 0.999468, 0.00869337, 0, 0.00372392, 0.999203, 0.008891, 0, 0.00668513, 0.998803, 0.00914387, 0, 0.0104968, 0.99748, 0.00935838, 0, 0.015125, 0.994446, 0.00933309, 0, 0.0205338, 0.99292, 0.00953084, 0, 0.0266884, 0.991414, 0.0097893, 0, 0.0335565, 0.989049, 0.0100228, 0, 0.0411086, 0.98582, 0.0101664, 0, 0.0493181, 0.982441, 0.0103582, 0, 0.0581613, 0.978595, 0.0105292, 0, 0.0676169, 0.973495, 0.0106274, 0, 0.0776661, 0.968405, 0.0107261, 0, 0.0882926, 0.962717, 0.0108234, 0, 0.0994817, 0.955478, 0.0108102, 0, 0.111221, 0.948275, 0.0107914, 0, 0.123499, 0.940006, 0.0107161, 0, 0.136308, 0.930831, 0.0106309, 0, 0.149639, 0.920648, 0.0104083, 0, 0.163485, 0.910205, 0.0102312, 0, 0.177843, 0.898445, 0.0100051, 0, 0.192707, 0.885986, 0.00971928, 0, 0.208077, 0.872204, 0.00940747, 0, 0.22395, 0.858436, 0.0091085, 0, 0.240326, 0.843454, 0.00876595, 0, 0.257208, 0.827437, 0.00839794, 0, 0.274596, 0.811488, 0.00803692, 0, 0.292496, 0.796039, 0.00767352, 0, 0.310911, 0.781083, 0.0073097, 0, 0.329849, 0.767642, 0.00694032, 0, 0.349316, 0.753901, 0.00657476, 0, 0.369323, 0.740131, 0.00622699, 0, 0.38988, 0.725845, 0.0058838, 0, 0.410999, 0.710991, 0.00555586, 0, 0.432696, 0.696002, 0.00523089, 0, 0.454987, 0.680461, 0.00492494, 0, 0.47789, 0.664875, 0.00463464, 0, 0.501426, 0.649273, 0.00435422, 0, 0.52562, 0.63302, 0.0040875, 0, 0.550498, 0.61705, 0.00384075, 0, 0.576089, 0.601154, 0.00359557, 0, 0.602427, 0.586008, 0.00337636, 0, 0.629544, 0.570699, 0.00316019, 0, 0.657479, 0.555166, 0.00296033, 0, 0.686264, 0.539645, 0.00277552, 0, 0.715924, 0.524159, 0.00259499, 0, 0.746459, 0.508682, 0.00243257, 0, 0.777789, 0.493163, 0.00227851, 0, 0.809524, 0.478004, 0.00213083, 0, 0.84127, 0.46347, 0.00199502, 0, 0.873016, 0.448778, 0.00186967, 0, 0.904762, 0.434105, 0.00174732, 0, 0.936508, 0.419576, 0.00163861, 0, 0.968254, 0.405541, 0.00153341, 0, 1, 1, 0.0106462, 0, 0, 1, 0.0106462, 0, 0, 0.999999, 0.010647, 0, 0, 0.999995, 0.0106502, 0, 0, 0.999985, 0.0106589, 0, 0, 0.999964, 0.0106773, 0, 0, 0.999925, 0.0107106, 0, 0, 0.999861, 0.0107655, 0, 7.12986e-5, 0.999763, 0.0108497, 0, 0.000743959, 0.999616, 0.0109716, 0, 0.00227361, 0.999408, 0.0111408, 0, 0.0046983, 0.999112, 0.0113659, 0, 0.00800158, 0.998637, 0.0116475, 0, 0.0121493, 0.996223, 0.0117231, 0, 0.0171023, 0.994006, 0.0118064, 0, 0.0228218, 0.992444, 0.0120254, 0, 0.0292711, 0.991028, 0.0123314, 0, 0.036417, 0.98803, 0.0124954, 0, 0.0442295, 0.984816, 0.0126538, 0, 0.0526815, 0.981399, 0.0128537, 0, 0.0617492, 0.977085, 0.0129694, 0, 0.0714114, 0.972154, 0.013091, 0, 0.0816495, 0.966617, 0.0131166, 0, 0.0924472, 0.960628, 0.0131583, 0, 0.10379, 0.953295, 0.0131094, 0, 0.115665, 0.94575, 0.0129966, 0, 0.128062, 0.937654, 0.0128796, 0, 0.140972, 0.927716, 0.0126477, 0, 0.154387, 0.917932, 0.0123889, 0, 0.168301, 0.907719, 0.012131, 0, 0.182709, 0.89584, 0.0118013, 0, 0.197608, 0.883526, 0.0114145, 0, 0.212994, 0.870301, 0.0110075, 0, 0.228867, 0.856272, 0.0106019, 0, 0.245227, 0.842251, 0.0101938, 0, 0.262074, 0.826466, 0.00973254, 0, 0.279412, 0.810859, 0.0092846, 0, 0.297244, 0.795051, 0.00883304, 0, 0.315575, 0.780053, 0.00840272, 0, 0.334412, 0.76575, 0.00796438, 0, 0.35376, 0.752298, 0.00752526, 0, 0.373631, 0.739153, 0.00711486, 0, 0.394034, 0.725514, 0.00670361, 0, 0.414983, 0.711473, 0.00632656, 0, 0.436491, 0.696936, 0.00595206, 0, 0.458575, 0.682126, 0.00559191, 0, 0.481253, 0.667027, 0.00525362, 0, 0.504547, 0.651875, 0.00493805, 0, 0.528481, 0.636463, 0.00462848, 0, 0.553081, 0.620641, 0.00433936, 0, 0.578377, 0.604931, 0.00407, 0, 0.604404, 0.589549, 0.00380864, 0, 0.631197, 0.574712, 0.00357049, 0, 0.658795, 0.559775, 0.00334466, 0, 0.687238, 0.544514, 0.00312505, 0, 0.716559, 0.529555, 0.00293199, 0, 0.746776, 0.514402, 0.00274204, 0, 0.777849, 0.499302, 0.00256647, 0, 0.809524, 0.484114, 0.00239901, 0, 0.84127, 0.469308, 0.00225148, 0, 0.873016, 0.455133, 0.00210178, 0, 0.904762, 0.440939, 0.0019727, 0, 0.936508, 0.426627, 0.00184382, 0, 0.968254, 0.412509, 0.00172548, 0, 1, 1, 0.013628, 0, 0, 1, 0.0136281, 0, 0, 0.999999, 0.0136289, 0, 0, 0.999995, 0.0136327, 0, 0, 0.999983, 0.0136427, 0, 0, 0.99996, 0.0136638, 0, 0, 0.999917, 0.0137022, 0, 0, 0.999846, 0.0137652, 0, 0.000204597, 0.999736, 0.0138615, 0, 0.00116837, 0.999573, 0.0140007, 0, 0.00303325, 0.99934, 0.0141927, 0, 0.00580613, 0.999004, 0.0144457, 0, 0.00945626, 0.998407, 0.0147489, 0, 0.0139421, 0.995464, 0.014731, 0, 0.0192202, 0.993328, 0.0148283, 0, 0.0252495, 0.991799, 0.0150797, 0, 0.0319921, 0.990397, 0.0154316, 0, 0.0394138, 0.986835, 0.0155005, 0, 0.0474843, 0.983938, 0.0157308, 0, 0.0561763, 0.980154, 0.0158753, 0, 0.0654661, 0.975659, 0.0159581, 0, 0.0753326, 0.970171, 0.0159832, 0, 0.0857571, 0.964803, 0.0160084, 0, 0.0967236, 0.958366, 0.0159484, 0, 0.108218, 0.950613, 0.0158001, 0, 0.120227, 0.942874, 0.0155845, 0, 0.132741, 0.935005, 0.0154292, 0, 0.145751, 0.924991, 0.0150742, 0, 0.159249, 0.914814, 0.0146757, 0, 0.17323, 0.904743, 0.0143097, 0, 0.187687, 0.893216, 0.0138695, 0, 0.202619, 0.880769, 0.0133706, 0, 0.218021, 0.868136, 0.0128606, 0, 0.233894, 0.85469, 0.0123403, 0, 0.250238, 0.840593, 0.0118091, 0, 0.267052, 0.825808, 0.011253, 0, 0.284341, 0.81009, 0.0107099, 0, 0.302106, 0.79504, 0.0101636, 0, 0.320354, 0.779757, 0.00964041, 0, 0.33909, 0.764697, 0.00911896, 0, 0.358322, 0.750913, 0.00859533, 0, 0.378059, 0.738175, 0.00811592, 0, 0.398311, 0.725242, 0.00764504, 0, 0.41909, 0.711864, 0.00718885, 0, 0.440412, 0.698009, 0.00675843, 0, 0.462292, 0.683841, 0.00634984, 0, 0.484748, 0.669391, 0.00595502, 0, 0.507802, 0.654731, 0.00558671, 0, 0.531477, 0.639805, 0.00523578, 0, 0.555802, 0.624789, 0.00490834, 0, 0.580805, 0.609325, 0.00459448, 0, 0.606522, 0.593975, 0.00430342, 0, 0.63299, 0.578983, 0.00403019, 0, 0.66025, 0.564442, 0.0037707, 0, 0.688346, 0.549835, 0.0035316, 0, 0.717319, 0.535039, 0.00330255, 0, 0.7472, 0.520403, 0.00308932, 0, 0.777982, 0.505687, 0.00289335, 0, 0.809524, 0.490939, 0.00270818, 0, 0.84127, 0.476233, 0.0025343, 0, 0.873016, 0.461624, 0.00237097, 0, 0.904762, 0.447833, 0.00222065, 0, 0.936508, 0.433992, 0.00207561, 0, 0.968254, 0.420147, 0.00194955, 0, 1, 1, 0.0173415, 0, 0, 1, 0.0173416, 0, 0, 0.999999, 0.0173426, 0, 0, 0.999995, 0.0173468, 0, 0, 0.999983, 0.0173582, 0, 0, 0.999954, 0.0173822, 0, 0, 0.999908, 0.0174258, 0, 6.69501e-6, 0.999828, 0.0174973, 0, 0.000427399, 0.999705, 0.0176063, 0, 0.00171019, 0.999524, 0.0177631, 0, 0.0039248, 0.999263, 0.0179781, 0, 0.00705382, 0.998878, 0.018258, 0, 0.0110552, 0.998012, 0.0185551, 0, 0.0158812, 0.994614, 0.0184264, 0, 0.0214852, 0.993132, 0.0186385, 0, 0.0278239, 0.991563, 0.0189067, 0, 0.0348585, 0.989298, 0.0191577, 0, 0.0425544, 0.986036, 0.0192522, 0, 0.050881, 0.982558, 0.0194063, 0, 0.059811, 0.978531, 0.019486, 0, 0.0693209, 0.974198, 0.0195847, 0, 0.0793895, 0.968148, 0.0194749, 0, 0.0899984, 0.962565, 0.0194277, 0, 0.101132, 0.956041, 0.0192991, 0, 0.112775, 0.947749, 0.0189893, 0, 0.124917, 0.94018, 0.018704, 0, 0.137547, 0.93165, 0.0183458, 0, 0.150655, 0.921798, 0.0178775, 0, 0.164236, 0.911573, 0.0173618, 0, 0.178281, 0.901569, 0.0168482, 0, 0.192788, 0.890341, 0.016265, 0, 0.207752, 0.877835, 0.0156199, 0, 0.223171, 0.865472, 0.0149516, 0, 0.239044, 0.852905, 0.0143274, 0, 0.255371, 0.838906, 0.0136643, 0, 0.272153, 0.824888, 0.0129903, 0, 0.289393, 0.809977, 0.0123218, 0, 0.307093, 0.794697, 0.0116572, 0, 0.325259, 0.780028, 0.0110307, 0, 0.343896, 0.765124, 0.0104236, 0, 0.363012, 0.750411, 0.0098219, 0, 0.382617, 0.737264, 0.00924397, 0, 0.402719, 0.724799, 0.00868719, 0, 0.423332, 0.712253, 0.00816476, 0, 0.444469, 0.699267, 0.00767262, 0, 0.466146, 0.685618, 0.00719746, 0, 0.488383, 0.671736, 0.00673916, 0, 0.511199, 0.657777, 0.00631937, 0, 0.534618, 0.643497, 0.00592411, 0, 0.558668, 0.62889, 0.00553928, 0, 0.58338, 0.614299, 0.0051934, 0, 0.608787, 0.599197, 0.00485985, 0, 0.634929, 0.584175, 0.00454357, 0, 0.661849, 0.569541, 0.00425787, 0, 0.689594, 0.555193, 0.00397905, 0, 0.718211, 0.540947, 0.00372364, 0, 0.747742, 0.526593, 0.00348599, 0, 0.778205, 0.512335, 0.00326103, 0, 0.80953, 0.498017, 0.00305137, 0, 0.84127, 0.483609, 0.00285485, 0, 0.873016, 0.469368, 0.00267472, 0, 0.904762, 0.455037, 0.00249945, 0, 0.936508, 0.441493, 0.00234792, 0, 0.968254, 0.428147, 0.00219936, 0, 1, 1, 0.0219422, 0, 0, 1, 0.0219423, 0, 0, 0.999998, 0.0219434, 0, 0, 0.999993, 0.0219481, 0, 0, 0.999981, 0.021961, 0, 0, 0.999949, 0.0219879, 0, 0, 0.999896, 0.0220367, 0, 5.93194e-5, 0.999808, 0.0221167, 0, 0.00075364, 0.99967, 0.0222383, 0, 0.00237884, 0.999466, 0.0224125, 0, 0.00495612, 0.999174, 0.0226495, 0, 0.00844887, 0.998725, 0.0229525, 0, 0.0128058, 0.996979, 0.0231123, 0, 0.0179742, 0.994317, 0.0230742, 0, 0.0239047, 0.992781, 0.0232895, 0, 0.0305526, 0.991191, 0.0235734, 0, 0.0378786, 0.987787, 0.0236152, 0, 0.0458475, 0.985092, 0.0237994, 0, 0.0544287, 0.981121, 0.0238553, 0, 0.0635952, 0.976924, 0.0238706, 0, 0.0733233, 0.97218, 0.0238704, 0, 0.0835922, 0.965956, 0.0236598, 0, 0.0943839, 0.959998, 0.0234735, 0, 0.105682, 0.953245, 0.0232277, 0, 0.117474, 0.944445, 0.0226973, 0, 0.129747, 0.937087, 0.0223527, 0, 0.142491, 0.928341, 0.0218144, 0, 0.155697, 0.9184, 0.0211516, 0, 0.169358, 0.907959, 0.0204553, 0, 0.183469, 0.89808, 0.0197673, 0, 0.198024, 0.887047, 0.0189915, 0, 0.21302, 0.875221, 0.0182082, 0, 0.228455, 0.86269, 0.0173584, 0, 0.244329, 0.850735, 0.0165718, 0, 0.260639, 0.837545, 0.0157524, 0, 0.277389, 0.823639, 0.0149482, 0, 0.29458, 0.809699, 0.0141431, 0, 0.312216, 0.794797, 0.0133527, 0, 0.3303, 0.780578, 0.0126193, 0, 0.34884, 0.766019, 0.0118914, 0, 0.367842, 0.751447, 0.0111839, 0, 0.387315, 0.737275, 0.010514, 0, 0.40727, 0.724545, 0.00987277, 0, 0.427717, 0.712644, 0.00926569, 0, 0.448671, 0.700432, 0.00869029, 0, 0.470149, 0.687664, 0.00814691, 0, 0.492167, 0.674288, 0.00763012, 0, 0.514746, 0.660966, 0.00714437, 0, 0.537911, 0.647264, 0.00668457, 0, 0.561688, 0.633431, 0.00626581, 0, 0.586108, 0.619133, 0.00585593, 0, 0.611206, 0.604935, 0.00548188, 0, 0.637022, 0.590236, 0.00513288, 0, 0.663599, 0.575473, 0.0047906, 0, 0.690989, 0.561228, 0.00448895, 0, 0.719242, 0.547054, 0.00420233, 0, 0.748411, 0.533175, 0.00392869, 0, 0.778531, 0.519163, 0.00367445, 0, 0.809583, 0.505328, 0.00344097, 0, 0.84127, 0.491446, 0.00322003, 0, 0.873016, 0.477356, 0.00301283, 0, 0.904762, 0.46356, 0.00282592, 0, 0.936508, 0.449623, 0.00264956, 0, 0.968254, 0.436068, 0.00246956, 0, 1, 1, 0.0276135, 0, 0, 1, 0.0276136, 0, 0, 0.999998, 0.0276148, 0, 0, 0.999993, 0.0276201, 0, 0, 0.999976, 0.0276342, 0, 0, 0.999945, 0.027664, 0, 0, 0.999884, 0.0277179, 0, 0.00018679, 0.999784, 0.027806, 0, 0.00119607, 0.99963, 0.0279394, 0, 0.00318407, 0.999401, 0.0281295, 0, 0.00613601, 0.999066, 0.0283858, 0, 0.00999963, 0.998524, 0.0287027, 0, 0.0147164, 0.995702, 0.0286256, 0, 0.0202295, 0.993593, 0.0286733, 0, 0.0264876, 0.992067, 0.0288989, 0, 0.0334452, 0.990548, 0.0292135, 0, 0.0410621, 0.986775, 0.0291296, 0, 0.0493032, 0.984054, 0.0293099, 0, 0.0581381, 0.979481, 0.0291881, 0, 0.0675397, 0.975297, 0.0291598, 0, 0.0774848, 0.96981, 0.028954, 0, 0.0879528, 0.963524, 0.028628, 0, 0.0989258, 0.957398, 0.0283135, 0, 0.110388, 0.950088, 0.0278469, 0, 0.122327, 0.941538, 0.0271798, 0, 0.134729, 0.933332, 0.0265388, 0, 0.147587, 0.924392, 0.0257776, 0, 0.160889, 0.914581, 0.024916, 0, 0.174631, 0.904347, 0.0240242, 0, 0.188806, 0.894324, 0.0231229, 0, 0.203409, 0.883724, 0.022153, 0, 0.218437, 0.872207, 0.0211355, 0, 0.233888, 0.859927, 0.0201048, 0, 0.249761, 0.848373, 0.0191263, 0, 0.266056, 0.836023, 0.0181306, 0, 0.282774, 0.82289, 0.0171718, 0, 0.299917, 0.809324, 0.0162196, 0, 0.317488, 0.795361, 0.0152622, 0, 0.335493, 0.781253, 0.01439, 0, 0.353936, 0.767338, 0.013533, 0, 0.372825, 0.753156, 0.0127244, 0, 0.392168, 0.739122, 0.0119454, 0, 0.411976, 0.725358, 0.0112054, 0, 0.432259, 0.712949, 0.010487, 0, 0.453032, 0.701621, 0.00984032, 0, 0.47431, 0.689703, 0.00921495, 0, 0.496111, 0.677216, 0.00862492, 0, 0.518456, 0.664217, 0.00806882, 0, 0.541367, 0.65137, 0.00755922, 0, 0.564872, 0.638, 0.00705705, 0, 0.589001, 0.62453, 0.00661266, 0, 0.613789, 0.610601, 0.00618432, 0, 0.639277, 0.59676, 0.00578033, 0, 0.66551, 0.582433, 0.00540927, 0, 0.692539, 0.568026, 0.00506104, 0, 0.720422, 0.55414, 0.0047353, 0, 0.749216, 0.540178, 0.00442889, 0, 0.778974, 0.526513, 0.00414363, 0, 0.809711, 0.512954, 0.00388237, 0, 0.84127, 0.499403, 0.00362875, 0, 0.873016, 0.486026, 0.00340827, 0, 0.904762, 0.472345, 0.00318598, 0, 0.936508, 0.458828, 0.00297635, 0, 0.968254, 0.445379, 0.00279447, 0, 1, 1, 0.0345716, 0, 0, 1, 0.0345717, 0, 0, 0.999999, 0.034573, 0, 0, 0.999991, 0.0345787, 0, 0, 0.999974, 0.0345941, 0, 0, 0.999937, 0.0346263, 0, 1.88589e-6, 0.999869, 0.0346847, 0, 0.000409238, 0.999757, 0.0347798, 0, 0.0017674, 0.999582, 0.0349233, 0, 0.00413658, 0.999322, 0.0351265, 0, 0.00747408, 0.998939, 0.0353967, 0, 0.0117157, 0.998219, 0.0357018, 0, 0.0167966, 0.994974, 0.0354726, 0, 0.0226572, 0.993201, 0.0355621, 0, 0.0292445, 0.991573, 0.0357641, 0, 0.0365123, 0.989301, 0.0359252, 0, 0.0444203, 0.985712, 0.0358017, 0, 0.0529334, 0.982411, 0.0358353, 0, 0.0620214, 0.977827, 0.035617, 0, 0.0716574, 0.973278, 0.0354398, 0, 0.0818186, 0.967397, 0.0350483, 0, 0.0924846, 0.960696, 0.0344795, 0, 0.103638, 0.954349, 0.0339861, 0, 0.115263, 0.946066, 0.0331323, 0, 0.127348, 0.938012, 0.032359, 0, 0.13988, 0.929413, 0.0314413, 0, 0.152849, 0.920355, 0.0304103, 0, 0.166248, 0.910586, 0.0292785, 0, 0.18007, 0.900609, 0.0281391, 0, 0.194308, 0.890093, 0.0269103, 0, 0.208958, 0.880013, 0.0257269, 0, 0.224018, 0.869001, 0.0244671, 0, 0.239485, 0.85751, 0.0232252, 0, 0.255359, 0.84582, 0.0220117, 0, 0.271638, 0.834383, 0.0208274, 0, 0.288324, 0.822158, 0.0196628, 0, 0.305419, 0.809056, 0.0185306, 0, 0.322927, 0.795832, 0.0174174, 0, 0.340851, 0.782547, 0.0163758, 0, 0.359199, 0.7689, 0.015391, 0, 0.377975, 0.755526, 0.0144488, 0, 0.397189, 0.741681, 0.0135372, 0, 0.416851, 0.728178, 0.0126957, 0, 0.436971, 0.714642, 0.0118812, 0, 0.457564, 0.702756, 0.0111165, 0, 0.478644, 0.69175, 0.0104145, 0, 0.500229, 0.680159, 0.00974439, 0, 0.522339, 0.668073, 0.00911926, 0, 0.544997, 0.655405, 0.00851393, 0, 0.56823, 0.642921, 0.00797637, 0, 0.592068, 0.629993, 0.00745119, 0, 0.616546, 0.616828, 0.00696972, 0, 0.641705, 0.603305, 0.00652425, 0, 0.66759, 0.589833, 0.00610188, 0, 0.694255, 0.575945, 0.00570834, 0, 0.72176, 0.561745, 0.00533384, 0, 0.750168, 0.548277, 0.00500001, 0, 0.779545, 0.534467, 0.00467582, 0, 0.809933, 0.521032, 0.00438092, 0, 0.841272, 0.507877, 0.00410348, 0, 0.873016, 0.494654, 0.00383618, 0, 0.904762, 0.481592, 0.00358699, 0, 0.936508, 0.468509, 0.00337281, 0, 0.968254, 0.455293, 0.00316196, 0, 1, 1, 0.0430698, 0, 0, 1, 0.0430699, 0, 0, 0.999998, 0.0430713, 0, 0, 0.999991, 0.0430773, 0, 0, 0.99997, 0.0430936, 0, 0, 0.999928, 0.0431277, 0, 4.06396e-5, 0.999852, 0.0431893, 0, 0.000744376, 0.999724, 0.0432895, 0, 0.0024806, 0.999527, 0.0434397, 0, 0.00524779, 0.99923, 0.0436507, 0, 0.00898164, 0.998783, 0.0439255, 0, 0.0136083, 0.997507, 0.0441104, 0, 0.0190582, 0.994418, 0.0438225, 0, 0.0252694, 0.992864, 0.0439396, 0, 0.0321879, 0.991127, 0.0440962, 0, 0.039767, 0.987331, 0.0438408, 0, 0.0479667, 0.984819, 0.0438991, 0, 0.056752, 0.980384, 0.0435906, 0, 0.0660929, 0.975846, 0.0432543, 0, 0.075963, 0.970748, 0.0428293, 0, 0.0863398, 0.964303, 0.042153, 0, 0.0972035, 0.95772, 0.0414111, 0, 0.108537, 0.950747, 0.0405893, 0, 0.120325, 0.942533, 0.0394887, 0, 0.132554, 0.934045, 0.0383544, 0, 0.145215, 0.924942, 0.037057, 0, 0.158296, 0.915811, 0.0356993, 0, 0.17179, 0.90612, 0.0342401, 0, 0.185691, 0.896434, 0.0328078, 0, 0.199993, 0.886021, 0.031288, 0, 0.214691, 0.876081, 0.0297776, 0, 0.229782, 0.865608, 0.0282334, 0, 0.245265, 0.854924, 0.026749, 0, 0.261138, 0.843607, 0.02526, 0, 0.277401, 0.832456, 0.0238214, 0, 0.294056, 0.821342, 0.0224682, 0, 0.311104, 0.809303, 0.0211297, 0, 0.328548, 0.796468, 0.0198387, 0, 0.346394, 0.784046, 0.0186227, 0, 0.364645, 0.771262, 0.0174561, 0, 0.38331, 0.758118, 0.0163806, 0, 0.402396, 0.745075, 0.0153287, 0, 0.421912, 0.731926, 0.0143647, 0, 0.44187, 0.71863, 0.0134363, 0, 0.462283, 0.705414, 0.0125603, 0, 0.483165, 0.693792, 0.0117508, 0, 0.504535, 0.683108, 0.0110016, 0, 0.52641, 0.67183, 0.0102757, 0, 0.548816, 0.66015, 0.00962044, 0, 0.571776, 0.647907, 0.00898031, 0, 0.595323, 0.635734, 0.00840811, 0, 0.619489, 0.623208, 0.00786211, 0, 0.644317, 0.610438, 0.00734953, 0, 0.669852, 0.597345, 0.00687688, 0, 0.696148, 0.584138, 0.00643469, 0, 0.723267, 0.5707, 0.00602236, 0, 0.75128, 0.556966, 0.0056324, 0, 0.780258, 0.543607, 0.00528277, 0, 0.810268, 0.530213, 0.00493999, 0, 0.841311, 0.516912, 0.00462265, 0, 0.873016, 0.503916, 0.0043307, 0, 0.904762, 0.491146, 0.00406858, 0, 0.936508, 0.478439, 0.00381436, 0, 0.968254, 0.465834, 0.00358003, 0, 1, 1, 0.0534039, 0, 0, 1, 0.053404, 0, 0, 0.999998, 0.0534055, 0, 0, 0.999989, 0.0534116, 0, 0, 0.999968, 0.0534283, 0, 0, 0.999918, 0.0534633, 0, 0.000155895, 0.99983, 0.0535262, 0, 0.00120914, 0.999685, 0.0536281, 0, 0.00334944, 0.999461, 0.0537799, 0, 0.00653077, 0.999119, 0.0539902, 0, 0.0106718, 0.998582, 0.0542524, 0, 0.0156907, 0.995919, 0.0540318, 0, 0.0215147, 0.993735, 0.0538914, 0, 0.0280801, 0.992126, 0.0539557, 0, 0.0353323, 0.990266, 0.0540401, 0, 0.0432247, 0.986317, 0.0536064, 0, 0.0517172, 0.983213, 0.0534425, 0, 0.0607754, 0.978303, 0.0528622, 0, 0.0703698, 0.973665, 0.0523363, 0, 0.0804742, 0.968091, 0.0516165, 0, 0.0910667, 0.961026, 0.0505434, 0, 0.102128, 0.954333, 0.049523, 0, 0.113641, 0.946372, 0.0481698, 0, 0.125591, 0.938254, 0.0467674, 0, 0.137965, 0.929516, 0.0452341, 0, 0.150754, 0.920106, 0.0435083, 0, 0.163947, 0.910899, 0.0417399, 0, 0.177537, 0.901532, 0.0399389, 0, 0.191516, 0.891919, 0.0380901, 0, 0.205881, 0.882006, 0.0362341, 0, 0.220626, 0.871965, 0.0343444, 0, 0.235749, 0.862145, 0.0324832, 0, 0.251248, 0.852058, 0.0306681, 0, 0.267121, 0.84161, 0.0289097, 0, 0.283368, 0.830806, 0.0272079, 0, 0.299992, 0.820476, 0.0256089, 0, 0.316992, 0.809514, 0.0240394, 0, 0.334374, 0.797865, 0.0225379, 0, 0.35214, 0.785621, 0.0211235, 0, 0.370296, 0.773765, 0.0197908, 0, 0.388849, 0.761629, 0.0185235, 0, 0.407807, 0.748891, 0.0173358, 0, 0.427178, 0.736437, 0.0162305, 0, 0.446974, 0.723707, 0.0151778, 0, 0.467207, 0.710606, 0.0141791, 0, 0.487892, 0.698019, 0.0132592, 0, 0.509046, 0.686203, 0.0123887, 0, 0.530687, 0.675692, 0.0115976, 0, 0.552839, 0.664826, 0.0108325, 0, 0.575527, 0.65349, 0.0101348, 0, 0.59878, 0.641774, 0.00947756, 0, 0.622634, 0.629794, 0.00886058, 0, 0.647128, 0.617647, 0.00828526, 0, 0.672308, 0.60534, 0.00775312, 0, 0.698231, 0.592718, 0.00726033, 0, 0.724958, 0.579746, 0.00679731, 0, 0.752563, 0.566763, 0.00636111, 0, 0.781127, 0.553515, 0.00595228, 0, 0.810733, 0.540118, 0.00556876, 0, 0.841426, 0.527325, 0.00523051, 0, 0.873016, 0.514265, 0.00490712, 0, 0.904762, 0.501406, 0.00460297, 0, 0.936508, 0.488922, 0.00431247, 0, 0.968254, 0.476541, 0.0040472, 0, 1, 1, 0.0659184, 0, 0, 1, 0.0659185, 0, 0, 0.999998, 0.06592, 0, 0, 0.999988, 0.0659259, 0, 0, 0.999963, 0.0659423, 0, 0, 0.999907, 0.0659764, 0, 0.000374198, 0.999806, 0.0660376, 0, 0.00182071, 0.999639, 0.0661361, 0, 0.0043894, 0.999378, 0.0662814, 0, 0.00800055, 0.998985, 0.0664779, 0, 0.0125594, 0.998285, 0.0666914, 0, 0.0179786, 0.995071, 0.0661989, 0, 0.0241822, 0.993172, 0.0660454, 0, 0.031106, 0.991438, 0.0660105, 0, 0.0386952, 0.988428, 0.0656875, 0, 0.0469032, 0.985218, 0.0652913, 0, 0.0556905, 0.981128, 0.0647107, 0, 0.065023, 0.976015, 0.0638491, 0, 0.0748717, 0.97097, 0.062993, 0, 0.0852112, 0.964582, 0.0617927, 0, 0.0960199, 0.957383, 0.0603626, 0, 0.107279, 0.949969, 0.0588128, 0, 0.118971, 0.941843, 0.0570274, 0, 0.131084, 0.933624, 0.0551885, 0, 0.143604, 0.924543, 0.053122, 0, 0.156521, 0.914919, 0.0508897, 0, 0.169825, 0.905773, 0.0486418, 0, 0.18351, 0.896434, 0.0463364, 0, 0.197569, 0.887195, 0.0440623, 0, 0.211997, 0.877706, 0.0417799, 0, 0.226789, 0.867719, 0.03945, 0, 0.241944, 0.858587, 0.037243, 0, 0.257458, 0.849317, 0.0350956, 0, 0.273331, 0.839585, 0.0329852, 0, 0.289563, 0.829856, 0.0310028, 0, 0.306154, 0.819589, 0.0290953, 0, 0.323108, 0.809714, 0.0272738, 0, 0.340426, 0.79934, 0.0255631, 0, 0.358113, 0.788224, 0.0239175, 0, 0.376175, 0.776619, 0.0223831, 0, 0.394616, 0.76521, 0.0209298, 0, 0.413445, 0.753716, 0.0195786, 0, 0.432671, 0.741564, 0.0183001, 0, 0.452305, 0.729413, 0.0171259, 0, 0.472358, 0.717146, 0.0159933, 0, 0.492845, 0.70436, 0.0149495, 0, 0.513783, 0.69219, 0.0139681, 0, 0.535189, 0.680289, 0.0130577, 0, 0.557087, 0.669611, 0.0122198, 0, 0.5795, 0.659113, 0.0114174, 0, 0.602459, 0.648148, 0.0106729, 0, 0.625997, 0.636905, 0.00998997, 0, 0.650154, 0.625154, 0.00934313, 0, 0.674976, 0.613481, 0.00874839, 0, 0.700518, 0.60154, 0.00818265, 0, 0.726845, 0.58943, 0.00766889, 0, 0.754032, 0.576828, 0.00717153, 0, 0.782167, 0.564194, 0.00672696, 0, 0.811344, 0.551501, 0.00630863, 0, 0.841644, 0.538635, 0.00592177, 0, 0.873016, 0.525724, 0.00554888, 0, 0.904762, 0.513209, 0.00520225, 0, 0.936508, 0.500457, 0.00488231, 0, 0.968254, 0.48799, 0.00457153, 0, 1, 1, 0.0810131, 0, 0, 1, 0.0810133, 0, 0, 0.999997, 0.0810145, 0, 0, 0.999985, 0.08102, 0, 0, 0.999956, 0.0810347, 0, 1.95026e-5, 0.999893, 0.0810656, 0, 0.000719316, 0.999777, 0.0811205, 0, 0.00259774, 0.999583, 0.081208, 0, 0.00561807, 0.999281, 0.0813343, 0, 0.00967472, 0.998813, 0.0814969, 0, 0.0146627, 0.997597, 0.0815217, 0, 0.0204902, 0.994379, 0.0808502, 0, 0.0270802, 0.992744, 0.0806792, 0, 0.0343674, 0.990745, 0.0804589, 0, 0.0422974, 0.986646, 0.0796107, 0, 0.0508242, 0.983611, 0.0790913, 0, 0.0599087, 0.978869, 0.0780746, 0, 0.0695175, 0.973475, 0.0768218, 0, 0.0796223, 0.967845, 0.0754926, 0, 0.0901983, 0.960778, 0.0737063, 0, 0.101224, 0.953333, 0.0718052, 0, 0.112682, 0.945274, 0.0695946, 0, 0.124555, 0.936955, 0.0672492, 0, 0.136831, 0.928319, 0.0647732, 0, 0.149496, 0.919075, 0.0620947, 0, 0.162542, 0.909114, 0.0591816, 0, 0.175958, 0.900137, 0.0563917, 0, 0.189739, 0.891069, 0.0535392, 0, 0.203877, 0.882262, 0.0507642, 0, 0.218368, 0.873232, 0.0479793, 0, 0.233208, 0.864042, 0.045226, 0, 0.248393, 0.855002, 0.0425413, 0, 0.263923, 0.846569, 0.0400126, 0, 0.279796, 0.837714, 0.0375269, 0, 0.296012, 0.828918, 0.0352027, 0, 0.312573, 0.819783, 0.0330011, 0, 0.329479, 0.810129, 0.0308908, 0, 0.346734, 0.800866, 0.0289112, 0, 0.364342, 0.79093, 0.0270255, 0, 0.382307, 0.780593, 0.0252758, 0, 0.400637, 0.769511, 0.0236178, 0, 0.419337, 0.758558, 0.0220652, 0, 0.438418, 0.747632, 0.0206289, 0, 0.457889, 0.736146, 0.0192873, 0, 0.477761, 0.724093, 0.0180333, 0, 0.49805, 0.71234, 0.0168264, 0, 0.51877, 0.700201, 0.015746, 0, 0.53994, 0.687949, 0.0147027, 0, 0.561581, 0.676163, 0.0137512, 0, 0.583718, 0.665001, 0.0128655, 0, 0.60638, 0.65472, 0.0120366, 0, 0.629599, 0.644213, 0.0112604, 0, 0.653415, 0.633382, 0.0105413, 0, 0.677874, 0.62212, 0.00986498, 0, 0.70303, 0.610631, 0.00923308, 0, 0.728948, 0.599078, 0.00864206, 0, 0.755706, 0.587519, 0.00811784, 0, 0.783396, 0.575505, 0.00761237, 0, 0.812121, 0.563148, 0.00713949, 0, 0.841989, 0.550828, 0.00668379, 0, 0.873035, 0.538458, 0.00627715, 0, 0.904762, 0.525905, 0.00588336, 0, 0.936508, 0.513517, 0.00552687, 0, 0.968254, 0.501395, 0.00519681, 0, 1, 1, 0.0991506, 0, 0, 1, 0.0991504, 0, 0, 0.999996, 0.0991515, 0, 0, 0.999984, 0.0991558, 0, 0, 0.999947, 0.0991672, 0, 0.000114389, 0.999874, 0.0991912, 0, 0.00121503, 0.999739, 0.0992331, 0, 0.00356108, 0.999514, 0.0992983, 0, 0.00705578, 0.999159, 0.0993877, 0, 0.011574, 0.998586, 0.0994837, 0, 0.017003, 0.995731, 0.0988425, 0, 0.0232484, 0.993384, 0.098276, 0, 0.0302318, 0.991615, 0.0979269, 0, 0.0378884, 0.989029, 0.0973432, 0, 0.0461641, 0.985373, 0.0963539, 0, 0.0550136, 0.981278, 0.0952306, 0, 0.0643988, 0.975777, 0.0936233, 0, 0.0742868, 0.970526, 0.0920219, 0, 0.0846501, 0.963755, 0.0898912, 0, 0.0954644, 0.956676, 0.0876064, 0, 0.106709, 0.948099, 0.0847751, 0, 0.118367, 0.939718, 0.0818638, 0, 0.130423, 0.931305, 0.078857, 0, 0.142862, 0.922342, 0.0756127, 0, 0.155674, 0.912842, 0.0721473, 0, 0.168849, 0.903304, 0.0686195, 0, 0.182378, 0.89411, 0.0650589, 0, 0.196255, 0.885512, 0.0616022, 0, 0.210473, 0.877193, 0.0582434, 0, 0.225027, 0.86877, 0.0548979, 0, 0.239915, 0.860267, 0.0516095, 0, 0.255132, 0.851915, 0.048468, 0, 0.270678, 0.843912, 0.0454447, 0, 0.286551, 0.83604, 0.0425612, 0, 0.302751, 0.828245, 0.0398752, 0, 0.31928, 0.820159, 0.0373198, 0, 0.336138, 0.81167, 0.034916, 0, 0.35333, 0.802659, 0.0326402, 0, 0.370858, 0.793921, 0.0304901, 0, 0.388728, 0.784713, 0.0284857, 0, 0.406944, 0.774946, 0.0266186, 0, 0.425515, 0.76448, 0.0248593, 0, 0.444449, 0.753793, 0.0232114, 0, 0.463756, 0.743506, 0.0217039, 0, 0.483447, 0.732555, 0.0202841, 0, 0.503535, 0.720965, 0.0189648, 0, 0.524036, 0.709422, 0.0177189, 0, 0.544968, 0.697756, 0.0165626, 0, 0.56635, 0.685565, 0.015483, 0, 0.588208, 0.673987, 0.0144892, 0, 0.610569, 0.66244, 0.0135607, 0, 0.633466, 0.651675, 0.0126956, 0, 0.656936, 0.641598, 0.0118788, 0, 0.681025, 0.63121, 0.0111261, 0, 0.705788, 0.620514, 0.010437, 0, 0.731289, 0.609366, 0.00978747, 0, 0.757606, 0.598137, 0.00917257, 0, 0.784834, 0.586966, 0.00859778, 0, 0.813085, 0.575549, 0.00806803, 0, 0.842485, 0.563797, 0.00757294, 0, 0.87313, 0.551758, 0.00710592, 0, 0.904762, 0.539894, 0.0066841, 0, 0.936508, 0.527901, 0.00627901, 0, 0.968254, 0.515819, 0.00590506, 0, 1, 1, 0.120864, 0, 0, 1, 0.120864, 0, 0, 0.999996, 0.120864, 0, 0, 0.99998, 0.120867, 0, 0, 0.99994, 0.120872, 0, 0.000323781, 0.999852, 0.120884, 0, 0.00188693, 0.999693, 0.120903, 0, 0.00473489, 0.999426, 0.120929, 0, 0.00872704, 0.999002, 0.120955, 0, 0.0137237, 0.998235, 0.120918, 0, 0.0196068, 0.994608, 0.119764, 0, 0.0262803, 0.992997, 0.119265, 0, 0.0336657, 0.990968, 0.11863, 0, 0.0416987, 0.987002, 0.117261, 0, 0.0503261, 0.983524, 0.116009, 0, 0.0595035, 0.97875, 0.114252, 0, 0.0691935, 0.972652, 0.11193, 0, 0.0793645, 0.966613, 0.109555, 0, 0.0899894, 0.959275, 0.106612, 0, 0.101045, 0.951272, 0.103375, 0, 0.112512, 0.942323, 0.0996594, 0, 0.124372, 0.933679, 0.0958841, 0, 0.136611, 0.924822, 0.0919265, 0, 0.149216, 0.915742, 0.0878061, 0, 0.162176, 0.906348, 0.0834894, 0, 0.175482, 0.896883, 0.079085, 0, 0.189125, 0.88774, 0.0746745, 0, 0.203098, 0.87986, 0.0705773, 0, 0.217396, 0.871998, 0.0665005, 0, 0.232015, 0.864325, 0.0625413, 0, 0.24695, 0.856685, 0.0586781, 0, 0.2622, 0.84925, 0.0550063, 0, 0.277761, 0.841719, 0.0514727, 0, 0.293634, 0.834755, 0.0481398, 0, 0.309819, 0.827853, 0.0450172, 0, 0.326315, 0.820888, 0.0420969, 0, 0.343126, 0.813616, 0.0393702, 0, 0.360254, 0.805767, 0.0367771, 0, 0.377701, 0.797338, 0.0343274, 0, 0.395474, 0.789122, 0.0320529, 0, 0.413577, 0.780601, 0.0299485, 0, 0.432018, 0.771424, 0.0279812, 0, 0.450804, 0.761502, 0.0261054, 0, 0.469944, 0.751166, 0.0243942, 0, 0.489451, 0.741276, 0.0228087, 0, 0.509337, 0.730898, 0.0213265, 0, 0.529617, 0.719878, 0.0199307, 0, 0.550307, 0.708379, 0.0186574, 0, 0.571428, 0.697165, 0.0174446, 0, 0.593003, 0.685554, 0.0163144, 0, 0.615059, 0.673631, 0.015276, 0, 0.637628, 0.662385, 0.0143003, 0, 0.660746, 0.651059, 0.0134112, 0, 0.68446, 0.640451, 0.0125794, 0, 0.70882, 0.630536, 0.011793, 0, 0.733893, 0.620316, 0.0110547, 0, 0.759756, 0.609722, 0.0103668, 0, 0.786505, 0.598804, 0.00973009, 0, 0.814259, 0.587871, 0.00912812, 0, 0.843157, 0.577121, 0.00858916, 0, 0.87334, 0.566019, 0.00807333, 0, 0.904762, 0.554664, 0.00759687, 0, 0.936508, 0.543101, 0.00714759, 0, 0.968254, 0.531558, 0.00673418, 0, 1, 1, 0.146767, 0, 0, 1, 0.146767, 0, 0, 0.999997, 0.146767, 0, 0, 0.999977, 0.146765, 0, 3.20658e-6, 0.999929, 0.146762, 0, 0.000682576, 0.999823, 0.146753, 0, 0.00276402, 0.999633, 0.146735, 0, 0.00614771, 0.999314, 0.146699, 0, 0.0106613, 0.998796, 0.14662, 0, 0.0161546, 0.997124, 0.146107, 0, 0.0225063, 0.994062, 0.144857, 0, 0.0296198, 0.992154, 0.144011, 0, 0.037417, 0.989186, 0.142712, 0, 0.0458348, 0.985279, 0.140926, 0, 0.0548211, 0.980826, 0.13885, 0, 0.0643326, 0.975056, 0.136168, 0, 0.074333, 0.969005, 0.133217, 0, 0.0847917, 0.961554, 0.12959, 0, 0.0956828, 0.954206, 0.125886, 0, 0.106984, 0.945046, 0.121335, 0, 0.118675, 0.935678, 0.116492, 0, 0.130741, 0.926748, 0.111635, 0, 0.143166, 0.917764, 0.106625, 0, 0.155939, 0.908358, 0.101325, 0, 0.169049, 0.899219, 0.0960249, 0, 0.182487, 0.890089, 0.0906527, 0, 0.196245, 0.881488, 0.0853905, 0, 0.210317, 0.874031, 0.0804177, 0, 0.224697, 0.866932, 0.0756005, 0, 0.23938, 0.859976, 0.0709019, 0, 0.254364, 0.853375, 0.0664391, 0, 0.269646, 0.846971, 0.0622012, 0, 0.285223, 0.840483, 0.058129, 0, 0.301096, 0.833969, 0.0542762, 0, 0.317265, 0.82806, 0.0507042, 0, 0.333729, 0.822128, 0.047368, 0, 0.350491, 0.815989, 0.044272, 0, 0.367554, 0.809336, 0.0413444, 0, 0.38492, 0.802177, 0.038601, 0, 0.402594, 0.79441, 0.0360227, 0, 0.420582, 0.786573, 0.0336383, 0, 0.438891, 0.778619, 0.0314321, 0, 0.457527, 0.77, 0.029362, 0, 0.476499, 0.760698, 0.0274102, 0, 0.49582, 0.750932, 0.0256146, 0, 0.5155, 0.740993, 0.023974, 0, 0.535555, 0.731159, 0.0224182, 0, 0.556, 0.720836, 0.0209889, 0, 0.576855, 0.709913, 0.0196411, 0, 0.598143, 0.698415, 0.0183824, 0, 0.619888, 0.68745, 0.0172222, 0, 0.642123, 0.676154, 0.0161509, 0, 0.664883, 0.664383, 0.0151397, 0, 0.688211, 0.6533, 0.0141873, 0, 0.71216, 0.642072, 0.0133105, 0, 0.736792, 0.631412, 0.0124932, 0, 0.762186, 0.621622, 0.0117408, 0, 0.788439, 0.611681, 0.0110358, 0, 0.815672, 0.60142, 0.0103775, 0, 0.844034, 0.59083, 0.00975623, 0, 0.873699, 0.580254, 0.00918084, 0, 0.904765, 0.569841, 0.00864721, 0, 0.936508, 0.559224, 0.00815731, 0, 0.968254, 0.548315, 0.00767924, 0, 1, 1, 0.177563, 0, 0, 1, 0.177563, 0, 0, 0.999994, 0.177562, 0, 0, 0.999972, 0.177555, 0, 6.64171e-5, 0.999914, 0.177536, 0, 0.0012276, 0.999787, 0.177496, 0, 0.00388025, 0.999556, 0.17742, 0, 0.00783463, 0.999165, 0.177285, 0, 0.0128953, 0.9985, 0.177037, 0, 0.0189053, 0.995388, 0.175634, 0, 0.025742, 0.993102, 0.174375, 0, 0.033309, 0.990992, 0.173121, 0, 0.0415298, 0.986932, 0.170896, 0, 0.0503425, 0.982786, 0.16847, 0, 0.0596964, 0.977592, 0.165455, 0, 0.0695498, 0.971075, 0.161676, 0, 0.0798676, 0.963967, 0.157458, 0, 0.0906201, 0.956397, 0.152836, 0, 0.101783, 0.947489, 0.147467, 0, 0.113333, 0.937564, 0.14145, 0, 0.125254, 0.928182, 0.135383, 0, 0.137529, 0.919027, 0.129212, 0, 0.150144, 0.909618, 0.12276, 0, 0.163088, 0.900492, 0.116273, 0, 0.176351, 0.891671, 0.1098, 0, 0.189924, 0.883146, 0.103362, 0, 0.203799, 0.875151, 0.0970799, 0, 0.21797, 0.868338, 0.0911732, 0, 0.232433, 0.862033, 0.0854966, 0, 0.247182, 0.856107, 0.0800691, 0, 0.262216, 0.850644, 0.0749618, 0, 0.27753, 0.845261, 0.070079, 0, 0.293124, 0.839885, 0.0654321, 0, 0.308997, 0.834609, 0.0610975, 0, 0.325149, 0.829083, 0.0569741, 0, 0.341581, 0.82404, 0.0531736, 0, 0.358294, 0.818968, 0.049665, 0, 0.37529, 0.813496, 0.0463856, 0, 0.392573, 0.807533, 0.0433217, 0, 0.410148, 0.80099, 0.0404402, 0, 0.428019, 0.793891, 0.0377578, 0, 0.446192, 0.786281, 0.0352616, 0, 0.464676, 0.778773, 0.0329577, 0, 0.483478, 0.770737, 0.030808, 0, 0.502608, 0.762094, 0.0287964, 0, 0.522079, 0.752898, 0.0269254, 0, 0.541905, 0.743306, 0.0251926, 0, 0.5621, 0.733416, 0.023595, 0, 0.582684, 0.723742, 0.0221155, 0, 0.603677, 0.713542, 0.0207435, 0, 0.625106, 0.702755, 0.019434, 0, 0.646998, 0.691484, 0.0182046, 0, 0.66939, 0.680531, 0.0170771, 0, 0.692324, 0.66953, 0.0160339, 0, 0.715849, 0.658126, 0.0150677, 0, 0.740028, 0.646933, 0.0141551, 0, 0.764937, 0.636107, 0.0133179, 0, 0.790673, 0.625271, 0.0125284, 0, 0.817358, 0.615225, 0.0117937, 0, 0.84515, 0.605678, 0.0111181, 0, 0.874244, 0.59583, 0.0104759, 0, 0.904828, 0.585704, 0.00986672, 0, 0.936508, 0.575413, 0.00929712, 0, 0.968254, 0.565373, 0.00876713, 0, 1, 1, 0.214058, 0, 0, 0.999999, 0.214058, 0, 0, 0.999994, 0.214055, 0, 0, 0.999966, 0.214039, 0, 0.000259642, 0.999893, 0.213998, 0, 0.00200075, 0.999737, 0.21391, 0, 0.00527775, 0.999449, 0.213745, 0, 0.00983959, 0.99896, 0.213458, 0, 0.0154755, 0.9979, 0.212855, 0, 0.0220249, 0.994278, 0.210779, 0, 0.0293654, 0.992254, 0.20926, 0, 0.0374021, 0.98881, 0.206908, 0, 0.0460604, 0.984715, 0.204009, 0, 0.0552802, 0.979738, 0.200471, 0, 0.0650127, 0.972884, 0.195813, 0, 0.0752175, 0.965996, 0.190856, 0, 0.0858612, 0.957974, 0.185077, 0, 0.0969155, 0.949155, 0.17868, 0, 0.108356, 0.939288, 0.171513, 0, 0.120163, 0.928996, 0.163838, 0, 0.132319, 0.919563, 0.156246, 0, 0.144808, 0.910004, 0.148359, 0, 0.157618, 0.900791, 0.140417, 0, 0.170737, 0.892135, 0.132569, 0, 0.184155, 0.883803, 0.124741, 0, 0.197866, 0.876034, 0.117091, 0, 0.211861, 0.869219, 0.109835, 0, 0.226134, 0.863062, 0.102859, 0, 0.240682, 0.857795, 0.0962928, 0, 0.255499, 0.853009, 0.0900725, 0, 0.270583, 0.848603, 0.0842101, 0, 0.285931, 0.844335, 0.0786527, 0, 0.301542, 0.840208, 0.0734397, 0, 0.317415, 0.836035, 0.0685334, 0, 0.33355, 0.83172, 0.0639275, 0, 0.349948, 0.827135, 0.0595909, 0, 0.36661, 0.822797, 0.0556204, 0, 0.383539, 0.818387, 0.0519394, 0, 0.400738, 0.813565, 0.0485317, 0, 0.41821, 0.808142, 0.0453138, 0, 0.435961, 0.802212, 0.0423354, 0, 0.453997, 0.79573, 0.0395553, 0, 0.472324, 0.788741, 0.036988, 0, 0.490951, 0.781093, 0.0345688, 0, 0.509887, 0.773597, 0.0323297, 0, 0.529144, 0.765622, 0.0302719, 0, 0.548735, 0.757083, 0.0283477, 0, 0.568674, 0.747992, 0.0265562, 0, 0.588979, 0.738591, 0.0248844, 0, 0.609671, 0.728719, 0.0233342, 0, 0.630773, 0.719146, 0.0219081, 0, 0.652314, 0.709165, 0.0205711, 0, 0.674328, 0.69875, 0.0193248, 0, 0.696854, 0.687884, 0.0181582, 0, 0.719942, 0.676818, 0.0170746, 0, 0.743651, 0.666247, 0.0160718, 0, 0.768057, 0.655284, 0.0151262, 0, 0.793253, 0.64401, 0.0142561, 0, 0.819363, 0.633353, 0.0134327, 0, 0.846547, 0.622674, 0.012653, 0, 0.875017, 0.612265, 0.0119354, 0, 0.905021, 0.602455, 0.0112533, 0, 0.936508, 0.593147, 0.0106234, 0, 0.968254, 0.583592, 0.0100213, 0, 1, 1, 0.25717, 0, 0, 1, 0.25717, 0, 0, 0.999992, 0.257164, 0, 0, 0.999958, 0.257135, 0, 0.000641715, 0.999864, 0.25706, 0, 0.00305314, 0.999666, 0.256897, 0, 0.00700975, 0.999302, 0.256596, 0, 0.0122194, 0.998663, 0.25607, 0, 0.0184622, 0.995607, 0.254123, 0, 0.0255773, 0.993094, 0.252081, 0, 0.0334439, 0.9907, 0.249867, 0, 0.0419696, 0.98594, 0.246118, 0, 0.0510823, 0.981214, 0.242049, 0, 0.0607242, 0.974966, 0.236869, 0, 0.0708486, 0.967589, 0.230724, 0, 0.081417, 0.95915, 0.223635, 0, 0.0923974, 0.950257, 0.21596, 0, 0.103763, 0.940165, 0.207296, 0, 0.115491, 0.929396, 0.197901, 0, 0.127562, 0.919288, 0.188437, 0, 0.13996, 0.909428, 0.178762, 0, 0.15267, 0.900105, 0.169072, 0, 0.165679, 0.891418, 0.159478, 0, 0.178979, 0.883347, 0.15002, 0, 0.192558, 0.875992, 0.140813, 0, 0.20641, 0.869466, 0.13196, 0, 0.220529, 0.863699, 0.123501, 0, 0.234907, 0.858553, 0.115436, 0, 0.249542, 0.854379, 0.107901, 0, 0.264428, 0.850894, 0.10088, 0, 0.279564, 0.847632, 0.0942296, 0, 0.294947, 0.844571, 0.0879861, 0, 0.310575, 0.84163, 0.0821534, 0, 0.326448, 0.838542, 0.0766409, 0, 0.342566, 0.835412, 0.0715322, 0, 0.358929, 0.831899, 0.0666883, 0, 0.37554, 0.828177, 0.0622175, 0, 0.392399, 0.82416, 0.0580452, 0, 0.409511, 0.820393, 0.054267, 0, 0.426878, 0.816068, 0.0507172, 0, 0.444506, 0.811201, 0.0474041, 0, 0.4624, 0.805785, 0.0443174, 0, 0.480566, 0.799878, 0.0414562, 0, 0.499013, 0.793469, 0.0388147, 0, 0.517749, 0.786473, 0.0363453, 0, 0.536785, 0.778874, 0.0340225, 0, 0.556134, 0.771277, 0.0318599, 0, 0.575809, 0.763426, 0.0298859, 0, 0.595827, 0.755044, 0.0280357, 0, 0.616207, 0.746161, 0.0262979, 0, 0.636973, 0.737124, 0.0247295, 0, 0.65815, 0.72761, 0.0232514, 0, 0.679772, 0.717822, 0.0218755, 0, 0.701876, 0.708279, 0.0205942, 0, 0.724509, 0.698333, 0.0193947, 0, 0.74773, 0.68802, 0.0182717, 0, 0.771609, 0.677321, 0.0172044, 0, 0.79624, 0.666504, 0.0162122, 0, 0.821743, 0.656184, 0.0152924, 0, 0.84828, 0.64556, 0.0144326, 0, 0.876069, 0.634636, 0.0136157, 0, 0.905404, 0.624124, 0.0128612, 0, 0.936508, 0.613914, 0.0121435, 0, 0.968254, 0.603589, 0.0114887, 0, 1, 1, 0.307946, 0, 0, 0.999999, 0.307945, 0, 0, 0.999988, 0.307934, 0, 2.04479e-5, 0.999944, 0.307886, 0, 0.00127833, 0.999824, 0.307756, 0, 0.00445047, 0.999565, 0.30748, 0, 0.00914673, 0.999085, 0.306966, 0, 0.0150498, 0.998103, 0.306004, 0, 0.0219367, 0.994249, 0.303028, 0, 0.0296485, 0.991807, 0.300435, 0, 0.038068, 0.987773, 0.296554, 0, 0.0471062, 0.982673, 0.2916, 0, 0.0566942, 0.976623, 0.285641, 0, 0.0667768, 0.968757, 0.27815, 0, 0.0773099, 0.959849, 0.269529, 0, 0.088257, 0.950663, 0.260248, 0, 0.0995879, 0.940129, 0.249704, 0, 0.111277, 0.92895, 0.238291, 0, 0.123304, 0.917996, 0.226501, 0, 0.13565, 0.907813, 0.214669, 0, 0.148299, 0.898305, 0.202835, 0, 0.161237, 0.889626, 0.191158, 0, 0.174455, 0.88175, 0.179695, 0, 0.187941, 0.874715, 0.168548, 0, 0.201687, 0.868746, 0.15792, 0, 0.215687, 0.863703, 0.147807, 0, 0.229933, 0.859315, 0.138149, 0, 0.24442, 0.855538, 0.128993, 0, 0.259145, 0.852428, 0.120414, 0, 0.274103, 0.850168, 0.112498, 0, 0.289293, 0.848132, 0.105054, 0, 0.304711, 0.846291, 0.0981087, 0, 0.320357, 0.844431, 0.0915942, 0, 0.33623, 0.842493, 0.0855056, 0, 0.35233, 0.840368, 0.0798204, 0, 0.368658, 0.83798, 0.0745097, 0, 0.385214, 0.83523, 0.0695424, 0, 0.402002, 0.832091, 0.0649092, 0, 0.419023, 0.828667, 0.0606291, 0, 0.436282, 0.824805, 0.0566523, 0, 0.453782, 0.820988, 0.0530229, 0, 0.471529, 0.816635, 0.0496364, 0, 0.489528, 0.811725, 0.0464658, 0, 0.507788, 0.806316, 0.0435082, 0, 0.526317, 0.800469, 0.0407873, 0, 0.545124, 0.794107, 0.038255, 0, 0.564221, 0.787218, 0.0358825, 0, 0.583621, 0.779872, 0.0336785, 0, 0.603341, 0.772097, 0.0316379, 0, 0.623397, 0.764484, 0.0297379, 0, 0.643812, 0.756428, 0.0279581, 0, 0.664611, 0.748022, 0.0263153, 0, 0.685824, 0.739268, 0.0247799, 0, 0.707488, 0.73024, 0.0233385, 0, 0.729646, 0.720893, 0.0220035, 0, 0.752354, 0.71119, 0.0207555, 0, 0.77568, 0.701791, 0.0195843, 0, 0.799715, 0.692184, 0.0184891, 0, 0.824574, 0.682258, 0.0174541, 0, 0.850417, 0.67206, 0.0164873, 0, 0.877466, 0.661717, 0.0155959, 0, 0.90604, 0.651462, 0.0147519, 0, 0.936528, 0.641467, 0.0139727, 0, 0.968254, 0.631229, 0.0132363, 0, 1, 1, 0.367573, 0, 0, 0.999999, 0.367571, 0, 0, 0.999984, 0.367553, 0, 0.000183382, 0.999925, 0.367473, 0, 0.00225254, 0.999759, 0.367259, 0, 0.00628165, 0.99941, 0.366801, 0, 0.0117858, 0.998739, 0.365946, 0, 0.0184359, 0.995529, 0.363191, 0, 0.0260114, 0.992875, 0.360171, 0, 0.0343581, 0.989135, 0.355981, 0, 0.0433637, 0.984166, 0.350401, 0, 0.0529438, 0.977871, 0.343348, 0, 0.0630334, 0.96951, 0.334341, 0, 0.0735805, 0.959964, 0.323862, 0, 0.0845437, 0.950162, 0.312521, 0, 0.095889, 0.938882, 0.299577, 0, 0.107588, 0.926992, 0.285573, 0, 0.119617, 0.915589, 0.271212, 0, 0.131957, 0.904791, 0.256611, 0, 0.144591, 0.895177, 0.242224, 0, 0.157503, 0.886403, 0.227952, 0, 0.170682, 0.878957, 0.214192, 0, 0.184117, 0.872418, 0.200795, 0, 0.197799, 0.867029, 0.188015, 0, 0.21172, 0.862835, 0.175975, 0, 0.225873, 0.859411, 0.164526, 0, 0.240253, 0.856655, 0.153693, 0, 0.254854, 0.854519, 0.14352, 0, 0.269673, 0.852828, 0.13397, 0, 0.284707, 0.851412, 0.124984, 0, 0.299953, 0.850609, 0.116748, 0, 0.315408, 0.849855, 0.10905, 0, 0.331073, 0.849017, 0.101839, 0, 0.346946, 0.848079, 0.0951359, 0, 0.363028, 0.846911, 0.0888774, 0, 0.379318, 0.845445, 0.0830375, 0, 0.395818, 0.84362, 0.0775844, 0, 0.41253, 0.841411, 0.0725054, 0, 0.429457, 0.838768, 0.0677691, 0, 0.446602, 0.835801, 0.0634016, 0, 0.463968, 0.832341, 0.0593095, 0, 0.481561, 0.828424, 0.0555121, 0, 0.499386, 0.824312, 0.052024, 0, 0.51745, 0.819918, 0.0487865, 0, 0.535761, 0.815072, 0.0457801, 0, 0.554328, 0.809863, 0.0430184, 0, 0.573162, 0.804164, 0.0404245, 0, 0.592275, 0.798034, 0.0380146, 0, 0.611681, 0.791436, 0.0357436, 0, 0.631398, 0.784498, 0.0336475, 0, 0.651445, 0.777125, 0.0316666, 0, 0.671845, 0.769365, 0.0298122, 0, 0.692628, 0.761579, 0.0281001, 0, 0.713827, 0.753746, 0.0265049, 0, 0.735484, 0.745573, 0.0250067, 0, 0.75765, 0.737083, 0.0236026, 0, 0.78039, 0.728545, 0.0223302, 0, 0.803789, 0.719691, 0.0211243, 0, 0.82796, 0.710569, 0.0199983, 0, 0.853056, 0.701216, 0.0189569, 0, 0.879298, 0.692094, 0.0179702, 0, 0.907014, 0.682909, 0.0170418, 0, 0.936691, 0.673509, 0.0161732, 0, 0.968254, 0.663863, 0.0153406, 0, 1, 1, 0.437395, 0, 0, 0.999998, 0.437394, 0, 0, 0.99998, 0.437363, 0, 0.000616704, 0.999891, 0.437232, 0, 0.00367925, 0.999656, 0.436877, 0, 0.00867446, 0.999148, 0.436121, 0, 0.0150679, 0.997959, 0.434564, 0, 0.022531, 0.993464, 0.430134, 0, 0.0308507, 0.990606, 0.426077, 0, 0.0398805, 0.985027, 0.419397, 0, 0.0495148, 0.978491, 0.41118, 0, 0.0596749, 0.969643, 0.40048, 0, 0.0703001, 0.959189, 0.38769, 0, 0.0813427, 0.948223, 0.373575, 0, 0.0927641, 0.935955, 0.357622, 0, 0.104533, 0.923237, 0.34043, 0, 0.116624, 0.911074, 0.322735, 0, 0.129015, 0.899724, 0.30479, 0, 0.141687, 0.890189, 0.287392, 0, 0.154626, 0.881796, 0.270248, 0, 0.167818, 0.874781, 0.253659, 0, 0.181252, 0.869166, 0.237786, 0, 0.194918, 0.864725, 0.222618, 0, 0.208807, 0.861565, 0.208356, 0, 0.222913, 0.859284, 0.194867, 0, 0.237229, 0.857677, 0.18212, 0, 0.25175, 0.856714, 0.17018, 0, 0.266473, 0.856155, 0.158969, 0, 0.281392, 0.8558, 0.148413, 0, 0.296505, 0.855672, 0.138578, 0, 0.311811, 0.855538, 0.129345, 0, 0.327306, 0.855689, 0.120861, 0, 0.342991, 0.855767, 0.112969, 0, 0.358864, 0.855618, 0.105593, 0, 0.374925, 0.85525, 0.0987451, 0, 0.391176, 0.854583, 0.0923727, 0, 0.407616, 0.853534, 0.0864143, 0, 0.424249, 0.852061, 0.0808338, 0, 0.441076, 0.850253, 0.0756771, 0, 0.4581, 0.848004, 0.0708612, 0, 0.475324, 0.845333, 0.0663784, 0, 0.492754, 0.842376, 0.0622631, 0, 0.510394, 0.838956, 0.0584112, 0, 0.528251, 0.835121, 0.0548328, 0, 0.546331, 0.830842, 0.0514838, 0, 0.564644, 0.826212, 0.048355, 0, 0.583198, 0.821522, 0.0454714, 0, 0.602005, 0.816551, 0.0428263, 0, 0.621078, 0.811211, 0.0403612, 0, 0.640434, 0.805479, 0.038039, 0, 0.660089, 0.799409, 0.0358739, 0, 0.680066, 0.79306, 0.0338727, 0, 0.70039, 0.786395, 0.0319985, 0, 0.721094, 0.779416, 0.030241, 0, 0.742215, 0.77214, 0.0285951, 0, 0.7638, 0.764636, 0.0270747, 0, 0.785912, 0.756836, 0.0256354, 0, 0.808628, 0.749315, 0.0243027, 0, 0.832055, 0.741561, 0.0230497, 0, 0.856338, 0.733589, 0.0218801, 0, 0.88169, 0.725479, 0.020784, 0, 0.908441, 0.717255, 0.0197702, 0, 0.937125, 0.708829, 0.0188168, 0, 0.968254, 0.700191, 0.0179113, 0, 1, 1, 0.518937, 0, 0, 0.999998, 0.518933, 0, 0, 0.999967, 0.518883, 0, 0.00147741, 0.999832, 0.51866, 0, 0.00573221, 0.999466, 0.518057, 0, 0.011826, 0.998644, 0.516752, 0, 0.0192116, 0.994458, 0.512347, 0, 0.027573, 0.991223, 0.507675, 0, 0.0367099, 0.985515, 0.500188, 0, 0.046487, 0.978308, 0.490408, 0, 0.0568071, 0.968359, 0.477357, 0, 0.0675984, 0.95682, 0.461752, 0, 0.0788059, 0.943929, 0.443796, 0, 0.090386, 0.930224, 0.423893, 0, 0.102304, 0.916514, 0.402682, 0, 0.114532, 0.903653, 0.380914, 0, 0.127047, 0.892315, 0.359212, 0, 0.139828, 0.882942, 0.338102, 0, 0.152861, 0.875438, 0.31773, 0, 0.16613, 0.869642, 0.298186, 0, 0.179624, 0.865304, 0.279491, 0, 0.193332, 0.862382, 0.261804, 0, 0.207247, 0.860666, 0.245146, 0, 0.22136, 0.859788, 0.229406, 0, 0.235666, 0.859608, 0.214605, 0, 0.250158, 0.859912, 0.200691, 0, 0.264832, 0.86053, 0.187623, 0, 0.279684, 0.861368, 0.17539, 0, 0.294711, 0.862237, 0.163901, 0, 0.309911, 0.863127, 0.153175, 0, 0.32528, 0.863923, 0.143147, 0, 0.340819, 0.864567, 0.133781, 0, 0.356524, 0.865013, 0.125042, 0, 0.372397, 0.86539, 0.116952, 0, 0.388438, 0.865591, 0.109476, 0, 0.404645, 0.865517, 0.102542, 0, 0.421022, 0.865084, 0.0960688, 0, 0.437569, 0.864309, 0.0900499, 0, 0.454287, 0.863151, 0.0844328, 0, 0.471181, 0.861649, 0.0792218, 0, 0.488253, 0.859742, 0.0743482, 0, 0.505507, 0.857446, 0.0697963, 0, 0.522947, 0.854757, 0.0655364, 0, 0.54058, 0.851783, 0.061608, 0, 0.558412, 0.848516, 0.0579701, 0, 0.576449, 0.844897, 0.0545742, 0, 0.594701, 0.840956, 0.0514167, 0, 0.613178, 0.836676, 0.0484598, 0, 0.631892, 0.832075, 0.0456934, 0, 0.650856, 0.827191, 0.0431178, 0, 0.670088, 0.822295, 0.0407718, 0, 0.689606, 0.817294, 0.0386032, 0, 0.709434, 0.812013, 0.0365675, 0, 0.7296, 0.806465, 0.0346547, 0, 0.750138, 0.800691, 0.0328717, 0, 0.771093, 0.794709, 0.031211, 0, 0.792519, 0.788493, 0.0296504, 0, 0.814488, 0.782049, 0.0281782, 0, 0.837097, 0.775403, 0.0267965, 0, 0.860481, 0.76857, 0.0255002, 0, 0.884842, 0.761536, 0.0242759, 0, 0.910494, 0.754303, 0.0231142, 0, 0.937985, 0.74692, 0.0220305, 0, 0.968254, 0.739745, 0.0210192, 0, 1, 1, 0.613914, 0, 0, 0.999996, 0.613907, 0, 9.63597e-5, 0.999942, 0.613814, 0, 0.00301247, 0.999704, 0.613407, 0, 0.00870385, 0.999046, 0.612302, 0, 0.0160714, 0.995516, 0.608266, 0, 0.0245899, 0.991726, 0.602863, 0, 0.0339681, 0.985157, 0.593956, 0, 0.0440254, 0.97642, 0.581748, 0, 0.0546409, 0.964404, 0.565183, 0, 0.0657284, 0.950601, 0.545273, 0, 0.0772246, 0.935158, 0.522129, 0, 0.0890812, 0.919364, 0.496782, 0, 0.10126, 0.904754, 0.470571, 0, 0.113731, 0.89176, 0.444037, 0, 0.126469, 0.881492, 0.418322, 0, 0.139454, 0.873656, 0.393522, 0, 0.15267, 0.868053, 0.369795, 0, 0.166101, 0.864336, 0.347171, 0, 0.179736, 0.862259, 0.325737, 0, 0.193565, 0.861556, 0.305532, 0, 0.207578, 0.861776, 0.286416, 0, 0.221769, 0.862661, 0.268355, 0, 0.23613, 0.864015, 0.251334, 0, 0.250656, 0.865711, 0.235352, 0, 0.265343, 0.867519, 0.220302, 0, 0.280187, 0.869351, 0.206161, 0, 0.295183, 0.871144, 0.192908, 0, 0.31033, 0.872839, 0.180505, 0, 0.325624, 0.874307, 0.168848, 0, 0.341065, 0.875667, 0.158021, 0, 0.35665, 0.876758, 0.147877, 0, 0.37238, 0.87764, 0.138441, 0, 0.388253, 0.878237, 0.129627, 0, 0.404269, 0.878563, 0.121415, 0, 0.42043, 0.878572, 0.113741, 0, 0.436735, 0.87842, 0.106652, 0, 0.453187, 0.878057, 0.100097, 0, 0.469786, 0.877413, 0.0940128, 0, 0.486536, 0.87646, 0.0883462, 0, 0.503439, 0.875233, 0.0830924, 0, 0.520498, 0.8737, 0.0781975, 0, 0.537717, 0.871873, 0.07364, 0, 0.555102, 0.86978, 0.0694103, 0, 0.572657, 0.867405, 0.0654696, 0, 0.59039, 0.864751, 0.0617914, 0, 0.608307, 0.861818, 0.0583491, 0, 0.626419, 0.858645, 0.0551443, 0, 0.644733, 0.855307, 0.0521894, 0, 0.663264, 0.851736, 0.0494334, 0, 0.682025, 0.847927, 0.0468504, 0, 0.701032, 0.843888, 0.0444261, 0, 0.720308, 0.839629, 0.0421497, 0, 0.739875, 0.835158, 0.0400082, 0, 0.759764, 0.830509, 0.0380076, 0, 0.780014, 0.825714, 0.0361488, 0, 0.800673, 0.820729, 0.0343956, 0, 0.821803, 0.815751, 0.0327781, 0, 0.843492, 0.810752, 0.031275, 0, 0.86586, 0.805587, 0.0298542, 0, 0.889087, 0.800317, 0.0285397, 0, 0.913466, 0.79489, 0.0272948, 0, 0.93952, 0.789314, 0.0261139, 0, 0.96835, 0.783593, 0.0249938, 0, 1, 1, 0.724258, 0, 0, 0.999992, 0.724243, 0, 0.000726889, 0.99987, 0.724044, 0, 0.00569574, 0.999336, 0.72317, 0, 0.0131702, 0.996271, 0.719432, 0, 0.0220738, 0.991159, 0.712576, 0, 0.0319405, 0.982465, 0.700927, 0, 0.0425202, 0.97049, 0.684297, 0, 0.0536599, 0.953973, 0.661244, 0, 0.065258, 0.935546, 0.633804, 0, 0.0772427, 0.916596, 0.603071, 0, 0.0895616, 0.899353, 0.57105, 0, 0.102175, 0.885216, 0.539206, 0, 0.11505, 0.875076, 0.508714, 0, 0.128164, 0.868334, 0.479571, 0, 0.141495, 0.864414, 0.451796, 0, 0.155026, 0.862678, 0.425328, 0, 0.168745, 0.862835, 0.400352, 0, 0.182639, 0.864067, 0.376532, 0, 0.196699, 0.866086, 0.35391, 0, 0.210915, 0.868557, 0.332424, 0, 0.225282, 0.871271, 0.312053, 0, 0.239792, 0.874058, 0.292764, 0, 0.25444, 0.8768, 0.27453, 0, 0.269223, 0.87939, 0.257297, 0, 0.284135, 0.8819, 0.24114, 0, 0.299174, 0.884187, 0.225934, 0, 0.314337, 0.886262, 0.211669, 0, 0.329622, 0.888119, 0.198311, 0, 0.345026, 0.889709, 0.185783, 0, 0.360549, 0.891054, 0.174063, 0, 0.376189, 0.892196, 0.163143, 0, 0.391946, 0.893101, 0.152952, 0, 0.407819, 0.893803, 0.143475, 0, 0.423808, 0.894277, 0.134647, 0, 0.439914, 0.894532, 0.126434, 0, 0.456137, 0.894576, 0.1188, 0, 0.472479, 0.894393, 0.111694, 0, 0.48894, 0.893976, 0.105069, 0, 0.505523, 0.893346, 0.0989077, 0, 0.52223, 0.892502, 0.0931724, 0, 0.539064, 0.891441, 0.0878276, 0, 0.556028, 0.890276, 0.082903, 0, 0.573125, 0.888972, 0.0783505, 0, 0.590361, 0.887469, 0.0741083, 0, 0.607741, 0.885785, 0.0701633, 0, 0.62527, 0.883914, 0.0664835, 0, 0.642957, 0.881872, 0.0630567, 0, 0.660809, 0.879651, 0.0598527, 0, 0.678836, 0.877267, 0.0568615, 0, 0.69705, 0.874717, 0.05406, 0, 0.715465, 0.872012, 0.0514378, 0, 0.734098, 0.869157, 0.0489805, 0, 0.752968, 0.866155, 0.0466727, 0, 0.772101, 0.863014, 0.0445056, 0, 0.791529, 0.859748, 0.0424733, 0, 0.81129, 0.856416, 0.0405957, 0, 0.831438, 0.852958, 0.0388273, 0, 0.852044, 0.849382, 0.0371619, 0, 0.87321, 0.845694, 0.0355959, 0, 0.89509, 0.841893, 0.0341155, 0, 0.917932, 0.837981, 0.0327141, 0, 0.942204, 0.833963, 0.0313856, 0, 0.968981, 0.829847, 0.0301275, 0, 1, 1, 0.85214, 0, 0, 0.999969, 0.852095, 0, 0.00279627, 0.999483, 0.851408, 0, 0.0107635, 0.994545, 0.84579, 0, 0.0206454, 0.986188, 0.835231, 0, 0.0315756, 0.969847, 0.814687, 0, 0.0432021, 0.945951, 0.783735, 0, 0.0553396, 0.91917, 0.746074, 0, 0.0678766, 0.895488, 0.706938, 0, 0.0807395, 0.878232, 0.669534, 0, 0.0938767, 0.868252, 0.635168, 0, 0.10725, 0.863873, 0.603069, 0, 0.120832, 0.863369, 0.572514, 0, 0.134598, 0.86545, 0.543169, 0, 0.148533, 0.868803, 0.514578, 0, 0.16262, 0.872794, 0.486762, 0, 0.176849, 0.87702, 0.459811, 0, 0.19121, 0.881054, 0.433654, 0, 0.205694, 0.884974, 0.408574, 0, 0.220294, 0.888587, 0.384525, 0, 0.235005, 0.891877, 0.36156, 0, 0.24982, 0.894793, 0.339661, 0, 0.264737, 0.89743, 0.318913, 0, 0.279751, 0.899796, 0.299302, 0, 0.294859, 0.901943, 0.280843, 0, 0.310058, 0.903858, 0.263481, 0, 0.325346, 0.905574, 0.247197, 0, 0.340721, 0.907069, 0.231915, 0, 0.356181, 0.908379, 0.217614, 0, 0.371725, 0.90952, 0.20425, 0, 0.387353, 0.910483, 0.191758, 0, 0.403063, 0.91128, 0.180092, 0, 0.418854, 0.911936, 0.169222, 0, 0.434727, 0.912454, 0.159098, 0, 0.450682, 0.912835, 0.149668, 0, 0.466718, 0.913078, 0.140884, 0, 0.482837, 0.913192, 0.132709, 0, 0.499038, 0.913175, 0.125095, 0, 0.515324, 0.91304, 0.118012, 0, 0.531695, 0.912781, 0.111417, 0, 0.548153, 0.91241, 0.105281, 0, 0.5647, 0.911924, 0.0995691, 0, 0.581338, 0.911331, 0.0942531, 0, 0.59807, 0.910637, 0.0893076, 0, 0.6149, 0.90984, 0.0846998, 0, 0.63183, 0.908941, 0.0804044, 0, 0.648865, 0.907944, 0.0763984, 0, 0.666011, 0.906857, 0.0726638, 0, 0.683273, 0.90568, 0.0691783, 0, 0.700659, 0.904416, 0.0659222, 0, 0.718176, 0.903067, 0.0628782, 0, 0.735834, 0.901637, 0.0600307, 0, 0.753646, 0.900128, 0.0573647, 0, 0.771625, 0.898544, 0.0548668, 0, 0.78979, 0.89689, 0.052527, 0, 0.808162, 0.895165, 0.0503306, 0, 0.826771, 0.893371, 0.0482668, 0, 0.845654, 0.891572, 0.0463605, 0, 0.864863, 0.889763, 0.0445998, 0, 0.884472, 0.887894, 0.0429451, 0, 0.904592, 0.885967, 0.0413884, 0, 0.925407, 0.883984, 0.0399225, 0, 0.947271, 0.881945, 0.0385405, 0, 0.97105, 0.879854, 0.0372362, 0, 1, 0.999804, 0.995833, 0, 0, 0.938155, 0.933611, 0, 0.0158731, 0.864755, 0.854311, 0, 0.0317461, 0.888594, 0.865264, 0, 0.0476191, 0.905575, 0.863922, 0, 0.0634921, 0.915125, 0.850558, 0, 0.0793651, 0.920665, 0.829254, 0, 0.0952381, 0.924073, 0.802578, 0, 0.111111, 0.926304, 0.772211, 0, 0.126984, 0.927829, 0.739366, 0, 0.142857, 0.928924, 0.705033, 0, 0.15873, 0.92973, 0.670019, 0, 0.174603, 0.930339, 0.634993, 0, 0.190476, 0.930811, 0.600485, 0, 0.206349, 0.931191, 0.566897, 0, 0.222222, 0.93149, 0.534485, 0, 0.238095, 0.931737, 0.503429, 0, 0.253968, 0.931939, 0.473811, 0, 0.269841, 0.932108, 0.445668, 0, 0.285714, 0.93225, 0.418993, 0, 0.301587, 0.932371, 0.393762, 0, 0.31746, 0.932474, 0.369939, 0, 0.333333, 0.932562, 0.347479, 0, 0.349206, 0.932638, 0.326336, 0, 0.365079, 0.932703, 0.306462, 0, 0.380952, 0.93276, 0.287805, 0, 0.396825, 0.932809, 0.270313, 0, 0.412698, 0.932851, 0.253933, 0, 0.428571, 0.932887, 0.23861, 0, 0.444444, 0.932917, 0.224289, 0, 0.460317, 0.932943, 0.210917, 0, 0.47619, 0.932965, 0.19844, 0, 0.492063, 0.932982, 0.186807, 0, 0.507937, 0.932995, 0.175966, 0, 0.52381, 0.933005, 0.165869, 0, 0.539683, 0.933011, 0.156468, 0, 0.555556, 0.933013, 0.147719, 0, 0.571429, 0.933013, 0.139579, 0, 0.587302, 0.93301, 0.132007, 0, 0.603175, 0.933004, 0.124965, 0, 0.619048, 0.932994, 0.118416, 0, 0.634921, 0.932982, 0.112326, 0, 0.650794, 0.932968, 0.106663, 0, 0.666667, 0.93295, 0.101397, 0, 0.68254, 0.932931, 0.0964993, 0, 0.698413, 0.932908, 0.0919438, 0, 0.714286, 0.932883, 0.0877057, 0, 0.730159, 0.932856, 0.0837623, 0, 0.746032, 0.932827, 0.0800921, 0, 0.761905, 0.932796, 0.0766754, 0, 0.777778, 0.932762, 0.0734936, 0, 0.793651, 0.932727, 0.0705296, 0, 0.809524, 0.932689, 0.0677676, 0, 0.825397, 0.93265, 0.0651929, 0, 0.84127, 0.932609, 0.0627917, 0, 0.857143, 0.932565, 0.0605515, 0, 0.873016, 0.932521, 0.0584606, 0, 0.888889, 0.932474, 0.0565082, 0, 0.904762, 0.932427, 0.0546841, 0, 0.920635, 0.932377, 0.0529793, 0, 0.936508, 0.932326, 0.0513851, 0, 0.952381, 0.932274, 0.0498936, 0, 0.968254, 0.93222, 0.0484975, 0, 0.984127, 0.932164, 0.0471899, 0, 1];

        // data textures

        const ltc_float_1 = new Float32Array(LTC_MAT_1);
        const ltc_float_2 = new Float32Array(LTC_MAT_2);
        THREE.UniformsLib.LTC_FLOAT_1 = new THREE.DataTexture(ltc_float_1, 64, 64, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.NearestFilter, 1);
        THREE.UniformsLib.LTC_FLOAT_2 = new THREE.DataTexture(ltc_float_2, 64, 64, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.NearestFilter, 1);
        THREE.UniformsLib.LTC_FLOAT_1.needsUpdate = true;
        THREE.UniformsLib.LTC_FLOAT_2.needsUpdate = true;
        const ltc_half_1 = new Uint16Array(LTC_MAT_1.length);
        LTC_MAT_1.forEach(function (x, index) {
          ltc_half_1[index] = THREE.DataUtils.toHalfFloat(x);
        });
        const ltc_half_2 = new Uint16Array(LTC_MAT_2.length);
        LTC_MAT_2.forEach(function (x, index) {
          ltc_half_2[index] = THREE.DataUtils.toHalfFloat(x);
        });
        THREE.UniformsLib.LTC_HALF_1 = new THREE.DataTexture(ltc_half_1, 64, 64, THREE.RGBAFormat, THREE.HalfFloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.NearestFilter, 1);
        THREE.UniformsLib.LTC_HALF_2 = new THREE.DataTexture(ltc_half_2, 64, 64, THREE.RGBAFormat, THREE.HalfFloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.NearestFilter, 1);
        THREE.UniformsLib.LTC_HALF_1.needsUpdate = true;
        THREE.UniformsLib.LTC_HALF_2.needsUpdate = true;
      }
    }

    var RectArea = /** @class */ (function () {
        function RectArea(scene) {
            this.scene = scene;
            this.areaLight = new THREE.Group();
            RectAreaLightUniformsLib.init();
        }
        RectArea.prototype.init = function (color, width, height, intensity) {
            this.light = new THREE.RectAreaLight(color, intensity, width, height);
            this.scene.add(this.light);
        };
        RectArea.prototype.initArea = function (color, width, intensity, position) {
            var rectLight = new THREE.RectAreaLight(color, intensity, width, width);
            rectLight.position.set(position[0], width + position[1], position[2]);
            rectLight.lookAt(position[0], width / 2, position[2]);
            var rectLight1 = new THREE.RectAreaLight(color, intensity, width, width);
            rectLight1.position.set(width / 2 + position[0], width / 2 + position[1], position[2]);
            rectLight1.lookAt(position[0], width / 2 + position[1], position[2]);
            var rectLight2 = new THREE.RectAreaLight(color, intensity, width, width);
            rectLight2.position.set(-width / 2 + position[0], width / 2 + position[1], position[2]);
            rectLight2.lookAt(position[0], width / 2 + position[1], position[2]);
            var rectLight3 = new THREE.RectAreaLight(color, intensity, width, width);
            rectLight3.position.set(position[0], position[1], position[2]);
            rectLight3.lookAt(position[0], width / 2 + position[1], position[2]);
            var rectLight4 = new THREE.RectAreaLight(color, intensity, width, width);
            rectLight4.position.set(position[0], width / 2 + position[1], width / 2 + position[2]);
            rectLight4.lookAt(position[0], width / 2 + position[1], position[2]);
            var rectLight5 = new THREE.RectAreaLight(color, intensity, width, width);
            rectLight5.position.set(position[0], width / 2 + position[1], -width / 2 + position[2]);
            rectLight5.lookAt(position[0], width / 2 + position[1], position[2]);
            this.areaLight.add(rectLight, rectLight1, rectLight2, rectLight3, rectLight4, rectLight5);
            this.scene.add(this.areaLight);
        };
        RectArea.prototype.initHelper = function () {
            this.helper = new RectAreaLightHelper(this.light, "#fff");
            this.scene.add(this.helper);
        };
        RectArea.prototype.initBoxHelper = function () {
            var _this = this;
            this.areaLight.traverse(function (light) {
                _this.areaLight.add(new RectAreaLightHelper(light, "#fff"));
            });
        };
        RectArea.prototype.destory = function () {
            this.scene.remove(this.helper);
            this.areaLight && this.scene.remove(this.areaLight);
            this.light && this.scene.remove(this.light);
        };
        return RectArea;
    }());

    /**
     * OpenEXR loader currently supports uncompressed, ZIP(S), RLE, PIZ and DWA/B compression.
     * Supports reading as UnsignedByte, HalfFloat and Float type data texture.
     *
     * Referred to the original Industrial Light & Magic OpenEXR implementation and the TinyEXR / Syoyo Fujita
     * implementation, so I have preserved their copyright notices.
     */

    // /*
    // Copyright (c) 2014 - 2017, Syoyo Fujita
    // All rights reserved.

    // Redistribution and use in source and binary forms, with or without
    // modification, are permitted provided that the following conditions are met:
    //     * Redistributions of source code must retain the above copyright
    //       notice, this list of conditions and the following disclaimer.
    //     * Redistributions in binary form must reproduce the above copyright
    //       notice, this list of conditions and the following disclaimer in the
    //       documentation and/or other materials provided with the distribution.
    //     * Neither the name of the Syoyo Fujita nor the
    //       names of its contributors may be used to endorse or promote products
    //       derived from this software without specific prior written permission.

    // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    // ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    // WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    // DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    // DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    // (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    // LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    // ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    // (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    // SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    // */

    // // TinyEXR contains some OpenEXR code, which is licensed under ------------

    // ///////////////////////////////////////////////////////////////////////////
    // //
    // // Copyright (c) 2002, Industrial Light & Magic, a division of Lucas
    // // Digital Ltd. LLC
    // //
    // // All rights reserved.
    // //
    // // Redistribution and use in source and binary forms, with or without
    // // modification, are permitted provided that the following conditions are
    // // met:
    // // *       Redistributions of source code must retain the above copyright
    // // notice, this list of conditions and the following disclaimer.
    // // *       Redistributions in binary form must reproduce the above
    // // copyright notice, this list of conditions and the following disclaimer
    // // in the documentation and/or other materials provided with the
    // // distribution.
    // // *       Neither the name of Industrial Light & Magic nor the names of
    // // its contributors may be used to endorse or promote products derived
    // // from this software without specific prior written permission.
    // //
    // // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    // // "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    // // LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
    // // A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
    // // OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    // // SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    // // LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    // // DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    // // THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    // // (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    // // OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    // //
    // ///////////////////////////////////////////////////////////////////////////

    // // End of OpenEXR license -------------------------------------------------

    class EXRLoader extends THREE.DataTextureLoader {
      constructor(manager) {
        super(manager);
        this.type = THREE.HalfFloatType;
      }
      parse(buffer) {
        const USHORT_RANGE = 1 << 16;
        const BITMAP_SIZE = USHORT_RANGE >> 3;
        const HUF_ENCBITS = 16; // literal (value) bit length
        const HUF_DECBITS = 14; // decoding bit size (>= 8)

        const HUF_ENCSIZE = (1 << HUF_ENCBITS) + 1; // encoding table size
        const HUF_DECSIZE = 1 << HUF_DECBITS; // decoding table size
        const HUF_DECMASK = HUF_DECSIZE - 1;
        const NBITS = 16;
        const A_OFFSET = 1 << NBITS - 1;
        const MOD_MASK = (1 << NBITS) - 1;
        const SHORT_ZEROCODE_RUN = 59;
        const LONG_ZEROCODE_RUN = 63;
        const SHORTEST_LONG_RUN = 2 + LONG_ZEROCODE_RUN - SHORT_ZEROCODE_RUN;
        const ULONG_SIZE = 8;
        const FLOAT32_SIZE = 4;
        const INT32_SIZE = 4;
        const INT16_SIZE = 2;
        const INT8_SIZE = 1;
        const STATIC_HUFFMAN = 0;
        const DEFLATE = 1;
        const UNKNOWN = 0;
        const LOSSY_DCT = 1;
        const RLE = 2;
        const logBase = Math.pow(2.7182818, 2.2);
        function reverseLutFromBitmap(bitmap, lut) {
          let k = 0;
          for (let i = 0; i < USHORT_RANGE; ++i) {
            if (i == 0 || bitmap[i >> 3] & 1 << (i & 7)) {
              lut[k++] = i;
            }
          }
          const n = k - 1;
          while (k < USHORT_RANGE) lut[k++] = 0;
          return n;
        }
        function hufClearDecTable(hdec) {
          for (let i = 0; i < HUF_DECSIZE; i++) {
            hdec[i] = {};
            hdec[i].len = 0;
            hdec[i].lit = 0;
            hdec[i].p = null;
          }
        }
        const getBitsReturn = {
          l: 0,
          c: 0,
          lc: 0
        };
        function getBits(nBits, c, lc, uInt8Array, inOffset) {
          while (lc < nBits) {
            c = c << 8 | parseUint8Array(uInt8Array, inOffset);
            lc += 8;
          }
          lc -= nBits;
          getBitsReturn.l = c >> lc & (1 << nBits) - 1;
          getBitsReturn.c = c;
          getBitsReturn.lc = lc;
        }
        const hufTableBuffer = new Array(59);
        function hufCanonicalCodeTable(hcode) {
          for (let i = 0; i <= 58; ++i) hufTableBuffer[i] = 0;
          for (let i = 0; i < HUF_ENCSIZE; ++i) hufTableBuffer[hcode[i]] += 1;
          let c = 0;
          for (let i = 58; i > 0; --i) {
            const nc = c + hufTableBuffer[i] >> 1;
            hufTableBuffer[i] = c;
            c = nc;
          }
          for (let i = 0; i < HUF_ENCSIZE; ++i) {
            const l = hcode[i];
            if (l > 0) hcode[i] = l | hufTableBuffer[l]++ << 6;
          }
        }
        function hufUnpackEncTable(uInt8Array, inOffset, ni, im, iM, hcode) {
          const p = inOffset;
          let c = 0;
          let lc = 0;
          for (; im <= iM; im++) {
            if (p.value - inOffset.value > ni) return false;
            getBits(6, c, lc, uInt8Array, p);
            const l = getBitsReturn.l;
            c = getBitsReturn.c;
            lc = getBitsReturn.lc;
            hcode[im] = l;
            if (l == LONG_ZEROCODE_RUN) {
              if (p.value - inOffset.value > ni) {
                throw new Error('Something wrong with hufUnpackEncTable');
              }
              getBits(8, c, lc, uInt8Array, p);
              let zerun = getBitsReturn.l + SHORTEST_LONG_RUN;
              c = getBitsReturn.c;
              lc = getBitsReturn.lc;
              if (im + zerun > iM + 1) {
                throw new Error('Something wrong with hufUnpackEncTable');
              }
              while (zerun--) hcode[im++] = 0;
              im--;
            } else if (l >= SHORT_ZEROCODE_RUN) {
              let zerun = l - SHORT_ZEROCODE_RUN + 2;
              if (im + zerun > iM + 1) {
                throw new Error('Something wrong with hufUnpackEncTable');
              }
              while (zerun--) hcode[im++] = 0;
              im--;
            }
          }
          hufCanonicalCodeTable(hcode);
        }
        function hufLength(code) {
          return code & 63;
        }
        function hufCode(code) {
          return code >> 6;
        }
        function hufBuildDecTable(hcode, im, iM, hdecod) {
          for (; im <= iM; im++) {
            const c = hufCode(hcode[im]);
            const l = hufLength(hcode[im]);
            if (c >> l) {
              throw new Error('Invalid table entry');
            }
            if (l > HUF_DECBITS) {
              const pl = hdecod[c >> l - HUF_DECBITS];
              if (pl.len) {
                throw new Error('Invalid table entry');
              }
              pl.lit++;
              if (pl.p) {
                const p = pl.p;
                pl.p = new Array(pl.lit);
                for (let i = 0; i < pl.lit - 1; ++i) {
                  pl.p[i] = p[i];
                }
              } else {
                pl.p = new Array(1);
              }
              pl.p[pl.lit - 1] = im;
            } else if (l) {
              let plOffset = 0;
              for (let i = 1 << HUF_DECBITS - l; i > 0; i--) {
                const pl = hdecod[(c << HUF_DECBITS - l) + plOffset];
                if (pl.len || pl.p) {
                  throw new Error('Invalid table entry');
                }
                pl.len = l;
                pl.lit = im;
                plOffset++;
              }
            }
          }
          return true;
        }
        const getCharReturn = {
          c: 0,
          lc: 0
        };
        function getChar(c, lc, uInt8Array, inOffset) {
          c = c << 8 | parseUint8Array(uInt8Array, inOffset);
          lc += 8;
          getCharReturn.c = c;
          getCharReturn.lc = lc;
        }
        const getCodeReturn = {
          c: 0,
          lc: 0
        };
        function getCode(po, rlc, c, lc, uInt8Array, inOffset, outBuffer, outBufferOffset, outBufferEndOffset) {
          if (po == rlc) {
            if (lc < 8) {
              getChar(c, lc, uInt8Array, inOffset);
              c = getCharReturn.c;
              lc = getCharReturn.lc;
            }
            lc -= 8;
            let cs = c >> lc;
            cs = new Uint8Array([cs])[0];
            if (outBufferOffset.value + cs > outBufferEndOffset) {
              return false;
            }
            const s = outBuffer[outBufferOffset.value - 1];
            while (cs-- > 0) {
              outBuffer[outBufferOffset.value++] = s;
            }
          } else if (outBufferOffset.value < outBufferEndOffset) {
            outBuffer[outBufferOffset.value++] = po;
          } else {
            return false;
          }
          getCodeReturn.c = c;
          getCodeReturn.lc = lc;
        }
        function UInt16(value) {
          return value & 0xFFFF;
        }
        function Int16(value) {
          const ref = UInt16(value);
          return ref > 0x7FFF ? ref - 0x10000 : ref;
        }
        const wdec14Return = {
          a: 0,
          b: 0
        };
        function wdec14(l, h) {
          const ls = Int16(l);
          const hs = Int16(h);
          const hi = hs;
          const ai = ls + (hi & 1) + (hi >> 1);
          const as = ai;
          const bs = ai - hi;
          wdec14Return.a = as;
          wdec14Return.b = bs;
        }
        function wdec16(l, h) {
          const m = UInt16(l);
          const d = UInt16(h);
          const bb = m - (d >> 1) & MOD_MASK;
          const aa = d + bb - A_OFFSET & MOD_MASK;
          wdec14Return.a = aa;
          wdec14Return.b = bb;
        }
        function wav2Decode(buffer, j, nx, ox, ny, oy, mx) {
          const w14 = mx < 1 << 14;
          const n = nx > ny ? ny : nx;
          let p = 1;
          let p2;
          let py;
          while (p <= n) p <<= 1;
          p >>= 1;
          p2 = p;
          p >>= 1;
          while (p >= 1) {
            py = 0;
            const ey = py + oy * (ny - p2);
            const oy1 = oy * p;
            const oy2 = oy * p2;
            const ox1 = ox * p;
            const ox2 = ox * p2;
            let i00, i01, i10, i11;
            for (; py <= ey; py += oy2) {
              let px = py;
              const ex = py + ox * (nx - p2);
              for (; px <= ex; px += ox2) {
                const p01 = px + ox1;
                const p10 = px + oy1;
                const p11 = p10 + ox1;
                if (w14) {
                  wdec14(buffer[px + j], buffer[p10 + j]);
                  i00 = wdec14Return.a;
                  i10 = wdec14Return.b;
                  wdec14(buffer[p01 + j], buffer[p11 + j]);
                  i01 = wdec14Return.a;
                  i11 = wdec14Return.b;
                  wdec14(i00, i01);
                  buffer[px + j] = wdec14Return.a;
                  buffer[p01 + j] = wdec14Return.b;
                  wdec14(i10, i11);
                  buffer[p10 + j] = wdec14Return.a;
                  buffer[p11 + j] = wdec14Return.b;
                } else {
                  wdec16(buffer[px + j], buffer[p10 + j]);
                  i00 = wdec14Return.a;
                  i10 = wdec14Return.b;
                  wdec16(buffer[p01 + j], buffer[p11 + j]);
                  i01 = wdec14Return.a;
                  i11 = wdec14Return.b;
                  wdec16(i00, i01);
                  buffer[px + j] = wdec14Return.a;
                  buffer[p01 + j] = wdec14Return.b;
                  wdec16(i10, i11);
                  buffer[p10 + j] = wdec14Return.a;
                  buffer[p11 + j] = wdec14Return.b;
                }
              }
              if (nx & p) {
                const p10 = px + oy1;
                if (w14) wdec14(buffer[px + j], buffer[p10 + j]);else wdec16(buffer[px + j], buffer[p10 + j]);
                i00 = wdec14Return.a;
                buffer[p10 + j] = wdec14Return.b;
                buffer[px + j] = i00;
              }
            }
            if (ny & p) {
              let px = py;
              const ex = py + ox * (nx - p2);
              for (; px <= ex; px += ox2) {
                const p01 = px + ox1;
                if (w14) wdec14(buffer[px + j], buffer[p01 + j]);else wdec16(buffer[px + j], buffer[p01 + j]);
                i00 = wdec14Return.a;
                buffer[p01 + j] = wdec14Return.b;
                buffer[px + j] = i00;
              }
            }
            p2 = p;
            p >>= 1;
          }
          return py;
        }
        function hufDecode(encodingTable, decodingTable, uInt8Array, inOffset, ni, rlc, no, outBuffer, outOffset) {
          let c = 0;
          let lc = 0;
          const outBufferEndOffset = no;
          const inOffsetEnd = Math.trunc(inOffset.value + (ni + 7) / 8);
          while (inOffset.value < inOffsetEnd) {
            getChar(c, lc, uInt8Array, inOffset);
            c = getCharReturn.c;
            lc = getCharReturn.lc;
            while (lc >= HUF_DECBITS) {
              const index = c >> lc - HUF_DECBITS & HUF_DECMASK;
              const pl = decodingTable[index];
              if (pl.len) {
                lc -= pl.len;
                getCode(pl.lit, rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset);
                c = getCodeReturn.c;
                lc = getCodeReturn.lc;
              } else {
                if (!pl.p) {
                  throw new Error('hufDecode issues');
                }
                let j;
                for (j = 0; j < pl.lit; j++) {
                  const l = hufLength(encodingTable[pl.p[j]]);
                  while (lc < l && inOffset.value < inOffsetEnd) {
                    getChar(c, lc, uInt8Array, inOffset);
                    c = getCharReturn.c;
                    lc = getCharReturn.lc;
                  }
                  if (lc >= l) {
                    if (hufCode(encodingTable[pl.p[j]]) == (c >> lc - l & (1 << l) - 1)) {
                      lc -= l;
                      getCode(pl.p[j], rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset);
                      c = getCodeReturn.c;
                      lc = getCodeReturn.lc;
                      break;
                    }
                  }
                }
                if (j == pl.lit) {
                  throw new Error('hufDecode issues');
                }
              }
            }
          }
          const i = 8 - ni & 7;
          c >>= i;
          lc -= i;
          while (lc > 0) {
            const pl = decodingTable[c << HUF_DECBITS - lc & HUF_DECMASK];
            if (pl.len) {
              lc -= pl.len;
              getCode(pl.lit, rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset);
              c = getCodeReturn.c;
              lc = getCodeReturn.lc;
            } else {
              throw new Error('hufDecode issues');
            }
          }
          return true;
        }
        function hufUncompress(uInt8Array, inDataView, inOffset, nCompressed, outBuffer, nRaw) {
          const outOffset = {
            value: 0
          };
          const initialInOffset = inOffset.value;
          const im = parseUint32(inDataView, inOffset);
          const iM = parseUint32(inDataView, inOffset);
          inOffset.value += 4;
          const nBits = parseUint32(inDataView, inOffset);
          inOffset.value += 4;
          if (im < 0 || im >= HUF_ENCSIZE || iM < 0 || iM >= HUF_ENCSIZE) {
            throw new Error('Something wrong with HUF_ENCSIZE');
          }
          const freq = new Array(HUF_ENCSIZE);
          const hdec = new Array(HUF_DECSIZE);
          hufClearDecTable(hdec);
          const ni = nCompressed - (inOffset.value - initialInOffset);
          hufUnpackEncTable(uInt8Array, inOffset, ni, im, iM, freq);
          if (nBits > 8 * (nCompressed - (inOffset.value - initialInOffset))) {
            throw new Error('Something wrong with hufUncompress');
          }
          hufBuildDecTable(freq, im, iM, hdec);
          hufDecode(freq, hdec, uInt8Array, inOffset, nBits, iM, nRaw, outBuffer, outOffset);
        }
        function applyLut(lut, data, nData) {
          for (let i = 0; i < nData; ++i) {
            data[i] = lut[data[i]];
          }
        }
        function predictor(source) {
          for (let t = 1; t < source.length; t++) {
            const d = source[t - 1] + source[t] - 128;
            source[t] = d;
          }
        }
        function interleaveScalar(source, out) {
          let t1 = 0;
          let t2 = Math.floor((source.length + 1) / 2);
          let s = 0;
          const stop = source.length - 1;
          while (true) {
            if (s > stop) break;
            out[s++] = source[t1++];
            if (s > stop) break;
            out[s++] = source[t2++];
          }
        }
        function decodeRunLength(source) {
          let size = source.byteLength;
          const out = new Array();
          let p = 0;
          const reader = new DataView(source);
          while (size > 0) {
            const l = reader.getInt8(p++);
            if (l < 0) {
              const count = -l;
              size -= count + 1;
              for (let i = 0; i < count; i++) {
                out.push(reader.getUint8(p++));
              }
            } else {
              const count = l;
              size -= 2;
              const value = reader.getUint8(p++);
              for (let i = 0; i < count + 1; i++) {
                out.push(value);
              }
            }
          }
          return out;
        }
        function lossyDctDecode(cscSet, rowPtrs, channelData, acBuffer, dcBuffer, outBuffer) {
          let dataView = new DataView(outBuffer.buffer);
          const width = channelData[cscSet.idx[0]].width;
          const height = channelData[cscSet.idx[0]].height;
          const numComp = 3;
          const numFullBlocksX = Math.floor(width / 8.0);
          const numBlocksX = Math.ceil(width / 8.0);
          const numBlocksY = Math.ceil(height / 8.0);
          const leftoverX = width - (numBlocksX - 1) * 8;
          const leftoverY = height - (numBlocksY - 1) * 8;
          const currAcComp = {
            value: 0
          };
          const currDcComp = new Array(numComp);
          const dctData = new Array(numComp);
          const halfZigBlock = new Array(numComp);
          const rowBlock = new Array(numComp);
          const rowOffsets = new Array(numComp);
          for (let comp = 0; comp < numComp; ++comp) {
            rowOffsets[comp] = rowPtrs[cscSet.idx[comp]];
            currDcComp[comp] = comp < 1 ? 0 : currDcComp[comp - 1] + numBlocksX * numBlocksY;
            dctData[comp] = new Float32Array(64);
            halfZigBlock[comp] = new Uint16Array(64);
            rowBlock[comp] = new Uint16Array(numBlocksX * 64);
          }
          for (let blocky = 0; blocky < numBlocksY; ++blocky) {
            let maxY = 8;
            if (blocky == numBlocksY - 1) maxY = leftoverY;
            let maxX = 8;
            for (let blockx = 0; blockx < numBlocksX; ++blockx) {
              if (blockx == numBlocksX - 1) maxX = leftoverX;
              for (let comp = 0; comp < numComp; ++comp) {
                halfZigBlock[comp].fill(0);

                // set block DC component
                halfZigBlock[comp][0] = dcBuffer[currDcComp[comp]++];
                // set block AC components
                unRleAC(currAcComp, acBuffer, halfZigBlock[comp]);

                // UnZigZag block to float
                unZigZag(halfZigBlock[comp], dctData[comp]);
                // decode float dct
                dctInverse(dctData[comp]);
              }
              {
                csc709Inverse(dctData);
              }
              for (let comp = 0; comp < numComp; ++comp) {
                convertToHalf(dctData[comp], rowBlock[comp], blockx * 64);
              }
            } // blockx

            let offset = 0;
            for (let comp = 0; comp < numComp; ++comp) {
              const type = channelData[cscSet.idx[comp]].type;
              for (let y = 8 * blocky; y < 8 * blocky + maxY; ++y) {
                offset = rowOffsets[comp][y];
                for (let blockx = 0; blockx < numFullBlocksX; ++blockx) {
                  const src = blockx * 64 + (y & 0x7) * 8;
                  dataView.setUint16(offset + 0 * INT16_SIZE * type, rowBlock[comp][src + 0], true);
                  dataView.setUint16(offset + 1 * INT16_SIZE * type, rowBlock[comp][src + 1], true);
                  dataView.setUint16(offset + 2 * INT16_SIZE * type, rowBlock[comp][src + 2], true);
                  dataView.setUint16(offset + 3 * INT16_SIZE * type, rowBlock[comp][src + 3], true);
                  dataView.setUint16(offset + 4 * INT16_SIZE * type, rowBlock[comp][src + 4], true);
                  dataView.setUint16(offset + 5 * INT16_SIZE * type, rowBlock[comp][src + 5], true);
                  dataView.setUint16(offset + 6 * INT16_SIZE * type, rowBlock[comp][src + 6], true);
                  dataView.setUint16(offset + 7 * INT16_SIZE * type, rowBlock[comp][src + 7], true);
                  offset += 8 * INT16_SIZE * type;
                }
              }

              // handle partial X blocks
              if (numFullBlocksX != numBlocksX) {
                for (let y = 8 * blocky; y < 8 * blocky + maxY; ++y) {
                  const offset = rowOffsets[comp][y] + 8 * numFullBlocksX * INT16_SIZE * type;
                  const src = numFullBlocksX * 64 + (y & 0x7) * 8;
                  for (let x = 0; x < maxX; ++x) {
                    dataView.setUint16(offset + x * INT16_SIZE * type, rowBlock[comp][src + x], true);
                  }
                }
              }
            } // comp
          } // blocky

          const halfRow = new Uint16Array(width);
          dataView = new DataView(outBuffer.buffer);

          // convert channels back to float, if needed
          for (let comp = 0; comp < numComp; ++comp) {
            channelData[cscSet.idx[comp]].decoded = true;
            const type = channelData[cscSet.idx[comp]].type;
            if (channelData[comp].type != 2) continue;
            for (let y = 0; y < height; ++y) {
              const offset = rowOffsets[comp][y];
              for (let x = 0; x < width; ++x) {
                halfRow[x] = dataView.getUint16(offset + x * INT16_SIZE * type, true);
              }
              for (let x = 0; x < width; ++x) {
                dataView.setFloat32(offset + x * INT16_SIZE * type, decodeFloat16(halfRow[x]), true);
              }
            }
          }
        }
        function unRleAC(currAcComp, acBuffer, halfZigBlock) {
          let acValue;
          let dctComp = 1;
          while (dctComp < 64) {
            acValue = acBuffer[currAcComp.value];
            if (acValue == 0xff00) {
              dctComp = 64;
            } else if (acValue >> 8 == 0xff) {
              dctComp += acValue & 0xff;
            } else {
              halfZigBlock[dctComp] = acValue;
              dctComp++;
            }
            currAcComp.value++;
          }
        }
        function unZigZag(src, dst) {
          dst[0] = decodeFloat16(src[0]);
          dst[1] = decodeFloat16(src[1]);
          dst[2] = decodeFloat16(src[5]);
          dst[3] = decodeFloat16(src[6]);
          dst[4] = decodeFloat16(src[14]);
          dst[5] = decodeFloat16(src[15]);
          dst[6] = decodeFloat16(src[27]);
          dst[7] = decodeFloat16(src[28]);
          dst[8] = decodeFloat16(src[2]);
          dst[9] = decodeFloat16(src[4]);
          dst[10] = decodeFloat16(src[7]);
          dst[11] = decodeFloat16(src[13]);
          dst[12] = decodeFloat16(src[16]);
          dst[13] = decodeFloat16(src[26]);
          dst[14] = decodeFloat16(src[29]);
          dst[15] = decodeFloat16(src[42]);
          dst[16] = decodeFloat16(src[3]);
          dst[17] = decodeFloat16(src[8]);
          dst[18] = decodeFloat16(src[12]);
          dst[19] = decodeFloat16(src[17]);
          dst[20] = decodeFloat16(src[25]);
          dst[21] = decodeFloat16(src[30]);
          dst[22] = decodeFloat16(src[41]);
          dst[23] = decodeFloat16(src[43]);
          dst[24] = decodeFloat16(src[9]);
          dst[25] = decodeFloat16(src[11]);
          dst[26] = decodeFloat16(src[18]);
          dst[27] = decodeFloat16(src[24]);
          dst[28] = decodeFloat16(src[31]);
          dst[29] = decodeFloat16(src[40]);
          dst[30] = decodeFloat16(src[44]);
          dst[31] = decodeFloat16(src[53]);
          dst[32] = decodeFloat16(src[10]);
          dst[33] = decodeFloat16(src[19]);
          dst[34] = decodeFloat16(src[23]);
          dst[35] = decodeFloat16(src[32]);
          dst[36] = decodeFloat16(src[39]);
          dst[37] = decodeFloat16(src[45]);
          dst[38] = decodeFloat16(src[52]);
          dst[39] = decodeFloat16(src[54]);
          dst[40] = decodeFloat16(src[20]);
          dst[41] = decodeFloat16(src[22]);
          dst[42] = decodeFloat16(src[33]);
          dst[43] = decodeFloat16(src[38]);
          dst[44] = decodeFloat16(src[46]);
          dst[45] = decodeFloat16(src[51]);
          dst[46] = decodeFloat16(src[55]);
          dst[47] = decodeFloat16(src[60]);
          dst[48] = decodeFloat16(src[21]);
          dst[49] = decodeFloat16(src[34]);
          dst[50] = decodeFloat16(src[37]);
          dst[51] = decodeFloat16(src[47]);
          dst[52] = decodeFloat16(src[50]);
          dst[53] = decodeFloat16(src[56]);
          dst[54] = decodeFloat16(src[59]);
          dst[55] = decodeFloat16(src[61]);
          dst[56] = decodeFloat16(src[35]);
          dst[57] = decodeFloat16(src[36]);
          dst[58] = decodeFloat16(src[48]);
          dst[59] = decodeFloat16(src[49]);
          dst[60] = decodeFloat16(src[57]);
          dst[61] = decodeFloat16(src[58]);
          dst[62] = decodeFloat16(src[62]);
          dst[63] = decodeFloat16(src[63]);
        }
        function dctInverse(data) {
          const a = 0.5 * Math.cos(3.14159 / 4.0);
          const b = 0.5 * Math.cos(3.14159 / 16.0);
          const c = 0.5 * Math.cos(3.14159 / 8.0);
          const d = 0.5 * Math.cos(3.0 * 3.14159 / 16.0);
          const e = 0.5 * Math.cos(5.0 * 3.14159 / 16.0);
          const f = 0.5 * Math.cos(3.0 * 3.14159 / 8.0);
          const g = 0.5 * Math.cos(7.0 * 3.14159 / 16.0);
          const alpha = new Array(4);
          const beta = new Array(4);
          const theta = new Array(4);
          const gamma = new Array(4);
          for (let row = 0; row < 8; ++row) {
            const rowPtr = row * 8;
            alpha[0] = c * data[rowPtr + 2];
            alpha[1] = f * data[rowPtr + 2];
            alpha[2] = c * data[rowPtr + 6];
            alpha[3] = f * data[rowPtr + 6];
            beta[0] = b * data[rowPtr + 1] + d * data[rowPtr + 3] + e * data[rowPtr + 5] + g * data[rowPtr + 7];
            beta[1] = d * data[rowPtr + 1] - g * data[rowPtr + 3] - b * data[rowPtr + 5] - e * data[rowPtr + 7];
            beta[2] = e * data[rowPtr + 1] - b * data[rowPtr + 3] + g * data[rowPtr + 5] + d * data[rowPtr + 7];
            beta[3] = g * data[rowPtr + 1] - e * data[rowPtr + 3] + d * data[rowPtr + 5] - b * data[rowPtr + 7];
            theta[0] = a * (data[rowPtr + 0] + data[rowPtr + 4]);
            theta[3] = a * (data[rowPtr + 0] - data[rowPtr + 4]);
            theta[1] = alpha[0] + alpha[3];
            theta[2] = alpha[1] - alpha[2];
            gamma[0] = theta[0] + theta[1];
            gamma[1] = theta[3] + theta[2];
            gamma[2] = theta[3] - theta[2];
            gamma[3] = theta[0] - theta[1];
            data[rowPtr + 0] = gamma[0] + beta[0];
            data[rowPtr + 1] = gamma[1] + beta[1];
            data[rowPtr + 2] = gamma[2] + beta[2];
            data[rowPtr + 3] = gamma[3] + beta[3];
            data[rowPtr + 4] = gamma[3] - beta[3];
            data[rowPtr + 5] = gamma[2] - beta[2];
            data[rowPtr + 6] = gamma[1] - beta[1];
            data[rowPtr + 7] = gamma[0] - beta[0];
          }
          for (let column = 0; column < 8; ++column) {
            alpha[0] = c * data[16 + column];
            alpha[1] = f * data[16 + column];
            alpha[2] = c * data[48 + column];
            alpha[3] = f * data[48 + column];
            beta[0] = b * data[8 + column] + d * data[24 + column] + e * data[40 + column] + g * data[56 + column];
            beta[1] = d * data[8 + column] - g * data[24 + column] - b * data[40 + column] - e * data[56 + column];
            beta[2] = e * data[8 + column] - b * data[24 + column] + g * data[40 + column] + d * data[56 + column];
            beta[3] = g * data[8 + column] - e * data[24 + column] + d * data[40 + column] - b * data[56 + column];
            theta[0] = a * (data[column] + data[32 + column]);
            theta[3] = a * (data[column] - data[32 + column]);
            theta[1] = alpha[0] + alpha[3];
            theta[2] = alpha[1] - alpha[2];
            gamma[0] = theta[0] + theta[1];
            gamma[1] = theta[3] + theta[2];
            gamma[2] = theta[3] - theta[2];
            gamma[3] = theta[0] - theta[1];
            data[0 + column] = gamma[0] + beta[0];
            data[8 + column] = gamma[1] + beta[1];
            data[16 + column] = gamma[2] + beta[2];
            data[24 + column] = gamma[3] + beta[3];
            data[32 + column] = gamma[3] - beta[3];
            data[40 + column] = gamma[2] - beta[2];
            data[48 + column] = gamma[1] - beta[1];
            data[56 + column] = gamma[0] - beta[0];
          }
        }
        function csc709Inverse(data) {
          for (let i = 0; i < 64; ++i) {
            const y = data[0][i];
            const cb = data[1][i];
            const cr = data[2][i];
            data[0][i] = y + 1.5747 * cr;
            data[1][i] = y - 0.1873 * cb - 0.4682 * cr;
            data[2][i] = y + 1.8556 * cb;
          }
        }
        function convertToHalf(src, dst, idx) {
          for (let i = 0; i < 64; ++i) {
            dst[idx + i] = THREE.DataUtils.toHalfFloat(toLinear(src[i]));
          }
        }
        function toLinear(float) {
          if (float <= 1) {
            return Math.sign(float) * Math.pow(Math.abs(float), 2.2);
          } else {
            return Math.sign(float) * Math.pow(logBase, Math.abs(float) - 1.0);
          }
        }
        function uncompressRAW(info) {
          return new DataView(info.array.buffer, info.offset.value, info.size);
        }
        function uncompressRLE(info) {
          const compressed = info.viewer.buffer.slice(info.offset.value, info.offset.value + info.size);
          const rawBuffer = new Uint8Array(decodeRunLength(compressed));
          const tmpBuffer = new Uint8Array(rawBuffer.length);
          predictor(rawBuffer); // revert predictor

          interleaveScalar(rawBuffer, tmpBuffer); // interleave pixels

          return new DataView(tmpBuffer.buffer);
        }
        function uncompressZIP(info) {
          const compressed = info.array.slice(info.offset.value, info.offset.value + info.size);
          const rawBuffer = unzlibSync(compressed);
          const tmpBuffer = new Uint8Array(rawBuffer.length);
          predictor(rawBuffer); // revert predictor

          interleaveScalar(rawBuffer, tmpBuffer); // interleave pixels

          return new DataView(tmpBuffer.buffer);
        }
        function uncompressPIZ(info) {
          const inDataView = info.viewer;
          const inOffset = {
            value: info.offset.value
          };
          const outBuffer = new Uint16Array(info.width * info.scanlineBlockSize * (info.channels * info.type));
          const bitmap = new Uint8Array(BITMAP_SIZE);

          // Setup channel info
          let outBufferEnd = 0;
          const pizChannelData = new Array(info.channels);
          for (let i = 0; i < info.channels; i++) {
            pizChannelData[i] = {};
            pizChannelData[i]['start'] = outBufferEnd;
            pizChannelData[i]['end'] = pizChannelData[i]['start'];
            pizChannelData[i]['nx'] = info.width;
            pizChannelData[i]['ny'] = info.lines;
            pizChannelData[i]['size'] = info.type;
            outBufferEnd += pizChannelData[i].nx * pizChannelData[i].ny * pizChannelData[i].size;
          }

          // Read range compression data

          const minNonZero = parseUint16(inDataView, inOffset);
          const maxNonZero = parseUint16(inDataView, inOffset);
          if (maxNonZero >= BITMAP_SIZE) {
            throw new Error('Something is wrong with PIZ_COMPRESSION BITMAP_SIZE');
          }
          if (minNonZero <= maxNonZero) {
            for (let i = 0; i < maxNonZero - minNonZero + 1; i++) {
              bitmap[i + minNonZero] = parseUint8(inDataView, inOffset);
            }
          }

          // Reverse LUT
          const lut = new Uint16Array(USHORT_RANGE);
          const maxValue = reverseLutFromBitmap(bitmap, lut);
          const length = parseUint32(inDataView, inOffset);

          // Huffman decoding
          hufUncompress(info.array, inDataView, inOffset, length, outBuffer, outBufferEnd);

          // Wavelet decoding
          for (let i = 0; i < info.channels; ++i) {
            const cd = pizChannelData[i];
            for (let j = 0; j < pizChannelData[i].size; ++j) {
              wav2Decode(outBuffer, cd.start + j, cd.nx, cd.size, cd.ny, cd.nx * cd.size, maxValue);
            }
          }

          // Expand the pixel data to their original range
          applyLut(lut, outBuffer, outBufferEnd);

          // Rearrange the pixel data into the format expected by the caller.
          let tmpOffset = 0;
          const tmpBuffer = new Uint8Array(outBuffer.buffer.byteLength);
          for (let y = 0; y < info.lines; y++) {
            for (let c = 0; c < info.channels; c++) {
              const cd = pizChannelData[c];
              const n = cd.nx * cd.size;
              const cp = new Uint8Array(outBuffer.buffer, cd.end * INT16_SIZE, n * INT16_SIZE);
              tmpBuffer.set(cp, tmpOffset);
              tmpOffset += n * INT16_SIZE;
              cd.end += n;
            }
          }
          return new DataView(tmpBuffer.buffer);
        }
        function uncompressPXR(info) {
          const compressed = info.array.slice(info.offset.value, info.offset.value + info.size);
          const rawBuffer = unzlibSync(compressed);
          const sz = info.lines * info.channels * info.width;
          const tmpBuffer = info.type == 1 ? new Uint16Array(sz) : new Uint32Array(sz);
          let tmpBufferEnd = 0;
          let writePtr = 0;
          const ptr = new Array(4);
          for (let y = 0; y < info.lines; y++) {
            for (let c = 0; c < info.channels; c++) {
              let pixel = 0;
              switch (info.type) {
                case 1:
                  ptr[0] = tmpBufferEnd;
                  ptr[1] = ptr[0] + info.width;
                  tmpBufferEnd = ptr[1] + info.width;
                  for (let j = 0; j < info.width; ++j) {
                    const diff = rawBuffer[ptr[0]++] << 8 | rawBuffer[ptr[1]++];
                    pixel += diff;
                    tmpBuffer[writePtr] = pixel;
                    writePtr++;
                  }
                  break;
                case 2:
                  ptr[0] = tmpBufferEnd;
                  ptr[1] = ptr[0] + info.width;
                  ptr[2] = ptr[1] + info.width;
                  tmpBufferEnd = ptr[2] + info.width;
                  for (let j = 0; j < info.width; ++j) {
                    const diff = rawBuffer[ptr[0]++] << 24 | rawBuffer[ptr[1]++] << 16 | rawBuffer[ptr[2]++] << 8;
                    pixel += diff;
                    tmpBuffer[writePtr] = pixel;
                    writePtr++;
                  }
                  break;
              }
            }
          }
          return new DataView(tmpBuffer.buffer);
        }
        function uncompressDWA(info) {
          const inDataView = info.viewer;
          const inOffset = {
            value: info.offset.value
          };
          const outBuffer = new Uint8Array(info.width * info.lines * (info.channels * info.type * INT16_SIZE));

          // Read compression header information
          const dwaHeader = {
            version: parseInt64(inDataView, inOffset),
            unknownUncompressedSize: parseInt64(inDataView, inOffset),
            unknownCompressedSize: parseInt64(inDataView, inOffset),
            acCompressedSize: parseInt64(inDataView, inOffset),
            dcCompressedSize: parseInt64(inDataView, inOffset),
            rleCompressedSize: parseInt64(inDataView, inOffset),
            rleUncompressedSize: parseInt64(inDataView, inOffset),
            rleRawSize: parseInt64(inDataView, inOffset),
            totalAcUncompressedCount: parseInt64(inDataView, inOffset),
            totalDcUncompressedCount: parseInt64(inDataView, inOffset),
            acCompression: parseInt64(inDataView, inOffset)
          };
          if (dwaHeader.version < 2) throw new Error('EXRLoader.parse: ' + EXRHeader.compression + ' version ' + dwaHeader.version + ' is unsupported');

          // Read channel ruleset information
          const channelRules = new Array();
          let ruleSize = parseUint16(inDataView, inOffset) - INT16_SIZE;
          while (ruleSize > 0) {
            const name = parseNullTerminatedString(inDataView.buffer, inOffset);
            const value = parseUint8(inDataView, inOffset);
            const compression = value >> 2 & 3;
            const csc = (value >> 4) - 1;
            const index = new Int8Array([csc])[0];
            const type = parseUint8(inDataView, inOffset);
            channelRules.push({
              name: name,
              index: index,
              type: type,
              compression: compression
            });
            ruleSize -= name.length + 3;
          }

          // Classify channels
          const channels = EXRHeader.channels;
          const channelData = new Array(info.channels);
          for (let i = 0; i < info.channels; ++i) {
            const cd = channelData[i] = {};
            const channel = channels[i];
            cd.name = channel.name;
            cd.compression = UNKNOWN;
            cd.decoded = false;
            cd.type = channel.pixelType;
            cd.pLinear = channel.pLinear;
            cd.width = info.width;
            cd.height = info.lines;
          }
          const cscSet = {
            idx: new Array(3)
          };
          for (let offset = 0; offset < info.channels; ++offset) {
            const cd = channelData[offset];
            for (let i = 0; i < channelRules.length; ++i) {
              const rule = channelRules[i];
              if (cd.name == rule.name) {
                cd.compression = rule.compression;
                if (rule.index >= 0) {
                  cscSet.idx[rule.index] = offset;
                }
                cd.offset = offset;
              }
            }
          }
          let acBuffer, dcBuffer, rleBuffer;

          // Read DCT - AC component data
          if (dwaHeader.acCompressedSize > 0) {
            switch (dwaHeader.acCompression) {
              case STATIC_HUFFMAN:
                acBuffer = new Uint16Array(dwaHeader.totalAcUncompressedCount);
                hufUncompress(info.array, inDataView, inOffset, dwaHeader.acCompressedSize, acBuffer, dwaHeader.totalAcUncompressedCount);
                break;
              case DEFLATE:
                const compressed = info.array.slice(inOffset.value, inOffset.value + dwaHeader.totalAcUncompressedCount);
                const data = unzlibSync(compressed);
                acBuffer = new Uint16Array(data.buffer);
                inOffset.value += dwaHeader.totalAcUncompressedCount;
                break;
            }
          }

          // Read DCT - DC component data
          if (dwaHeader.dcCompressedSize > 0) {
            const zlibInfo = {
              array: info.array,
              offset: inOffset,
              size: dwaHeader.dcCompressedSize
            };
            dcBuffer = new Uint16Array(uncompressZIP(zlibInfo).buffer);
            inOffset.value += dwaHeader.dcCompressedSize;
          }

          // Read RLE compressed data
          if (dwaHeader.rleRawSize > 0) {
            const compressed = info.array.slice(inOffset.value, inOffset.value + dwaHeader.rleCompressedSize);
            const data = unzlibSync(compressed);
            rleBuffer = decodeRunLength(data.buffer);
            inOffset.value += dwaHeader.rleCompressedSize;
          }

          // Prepare outbuffer data offset
          let outBufferEnd = 0;
          const rowOffsets = new Array(channelData.length);
          for (let i = 0; i < rowOffsets.length; ++i) {
            rowOffsets[i] = new Array();
          }
          for (let y = 0; y < info.lines; ++y) {
            for (let chan = 0; chan < channelData.length; ++chan) {
              rowOffsets[chan].push(outBufferEnd);
              outBufferEnd += channelData[chan].width * info.type * INT16_SIZE;
            }
          }

          // Lossy DCT decode RGB channels
          lossyDctDecode(cscSet, rowOffsets, channelData, acBuffer, dcBuffer, outBuffer);

          // Decode other channels
          for (let i = 0; i < channelData.length; ++i) {
            const cd = channelData[i];
            if (cd.decoded) continue;
            switch (cd.compression) {
              case RLE:
                let row = 0;
                let rleOffset = 0;
                for (let y = 0; y < info.lines; ++y) {
                  let rowOffsetBytes = rowOffsets[i][row];
                  for (let x = 0; x < cd.width; ++x) {
                    for (let byte = 0; byte < INT16_SIZE * cd.type; ++byte) {
                      outBuffer[rowOffsetBytes++] = rleBuffer[rleOffset + byte * cd.width * cd.height];
                    }
                    rleOffset++;
                  }
                  row++;
                }
                break;
              case LOSSY_DCT: // skip

              default:
                throw new Error('EXRLoader.parse: unsupported channel compression');
            }
          }
          return new DataView(outBuffer.buffer);
        }
        function parseNullTerminatedString(buffer, offset) {
          const uintBuffer = new Uint8Array(buffer);
          let endOffset = 0;
          while (uintBuffer[offset.value + endOffset] != 0) {
            endOffset += 1;
          }
          const stringValue = new TextDecoder().decode(uintBuffer.slice(offset.value, offset.value + endOffset));
          offset.value = offset.value + endOffset + 1;
          return stringValue;
        }
        function parseFixedLengthString(buffer, offset, size) {
          const stringValue = new TextDecoder().decode(new Uint8Array(buffer).slice(offset.value, offset.value + size));
          offset.value = offset.value + size;
          return stringValue;
        }
        function parseRational(dataView, offset) {
          const x = parseInt32(dataView, offset);
          const y = parseUint32(dataView, offset);
          return [x, y];
        }
        function parseTimecode(dataView, offset) {
          const x = parseUint32(dataView, offset);
          const y = parseUint32(dataView, offset);
          return [x, y];
        }
        function parseInt32(dataView, offset) {
          const Int32 = dataView.getInt32(offset.value, true);
          offset.value = offset.value + INT32_SIZE;
          return Int32;
        }
        function parseUint32(dataView, offset) {
          const Uint32 = dataView.getUint32(offset.value, true);
          offset.value = offset.value + INT32_SIZE;
          return Uint32;
        }
        function parseUint8Array(uInt8Array, offset) {
          const Uint8 = uInt8Array[offset.value];
          offset.value = offset.value + INT8_SIZE;
          return Uint8;
        }
        function parseUint8(dataView, offset) {
          const Uint8 = dataView.getUint8(offset.value);
          offset.value = offset.value + INT8_SIZE;
          return Uint8;
        }
        const parseInt64 = function (dataView, offset) {
          let int;
          if ('getBigInt64' in DataView.prototype) {
            int = Number(dataView.getBigInt64(offset.value, true));
          } else {
            int = dataView.getUint32(offset.value + 4, true) + Number(dataView.getUint32(offset.value, true) << 32);
          }
          offset.value += ULONG_SIZE;
          return int;
        };
        function parseFloat32(dataView, offset) {
          const float = dataView.getFloat32(offset.value, true);
          offset.value += FLOAT32_SIZE;
          return float;
        }
        function decodeFloat32(dataView, offset) {
          return THREE.DataUtils.toHalfFloat(parseFloat32(dataView, offset));
        }

        // https://stackoverflow.com/questions/5678432/decompressing-half-precision-floats-in-javascript
        function decodeFloat16(binary) {
          const exponent = (binary & 0x7C00) >> 10,
            fraction = binary & 0x03FF;
          return (binary >> 15 ? -1 : 1) * (exponent ? exponent === 0x1F ? fraction ? NaN : Infinity : Math.pow(2, exponent - 15) * (1 + fraction / 0x400) : 6.103515625e-5 * (fraction / 0x400));
        }
        function parseUint16(dataView, offset) {
          const Uint16 = dataView.getUint16(offset.value, true);
          offset.value += INT16_SIZE;
          return Uint16;
        }
        function parseFloat16(buffer, offset) {
          return decodeFloat16(parseUint16(buffer, offset));
        }
        function parseChlist(dataView, buffer, offset, size) {
          const startOffset = offset.value;
          const channels = [];
          while (offset.value < startOffset + size - 1) {
            const name = parseNullTerminatedString(buffer, offset);
            const pixelType = parseInt32(dataView, offset);
            const pLinear = parseUint8(dataView, offset);
            offset.value += 3; // reserved, three chars
            const xSampling = parseInt32(dataView, offset);
            const ySampling = parseInt32(dataView, offset);
            channels.push({
              name: name,
              pixelType: pixelType,
              pLinear: pLinear,
              xSampling: xSampling,
              ySampling: ySampling
            });
          }
          offset.value += 1;
          return channels;
        }
        function parseChromaticities(dataView, offset) {
          const redX = parseFloat32(dataView, offset);
          const redY = parseFloat32(dataView, offset);
          const greenX = parseFloat32(dataView, offset);
          const greenY = parseFloat32(dataView, offset);
          const blueX = parseFloat32(dataView, offset);
          const blueY = parseFloat32(dataView, offset);
          const whiteX = parseFloat32(dataView, offset);
          const whiteY = parseFloat32(dataView, offset);
          return {
            redX: redX,
            redY: redY,
            greenX: greenX,
            greenY: greenY,
            blueX: blueX,
            blueY: blueY,
            whiteX: whiteX,
            whiteY: whiteY
          };
        }
        function parseCompression(dataView, offset) {
          const compressionCodes = ['NO_COMPRESSION', 'RLE_COMPRESSION', 'ZIPS_COMPRESSION', 'ZIP_COMPRESSION', 'PIZ_COMPRESSION', 'PXR24_COMPRESSION', 'B44_COMPRESSION', 'B44A_COMPRESSION', 'DWAA_COMPRESSION', 'DWAB_COMPRESSION'];
          const compression = parseUint8(dataView, offset);
          return compressionCodes[compression];
        }
        function parseBox2i(dataView, offset) {
          const xMin = parseUint32(dataView, offset);
          const yMin = parseUint32(dataView, offset);
          const xMax = parseUint32(dataView, offset);
          const yMax = parseUint32(dataView, offset);
          return {
            xMin: xMin,
            yMin: yMin,
            xMax: xMax,
            yMax: yMax
          };
        }
        function parseLineOrder(dataView, offset) {
          const lineOrders = ['INCREASING_Y'];
          const lineOrder = parseUint8(dataView, offset);
          return lineOrders[lineOrder];
        }
        function parseV2f(dataView, offset) {
          const x = parseFloat32(dataView, offset);
          const y = parseFloat32(dataView, offset);
          return [x, y];
        }
        function parseV3f(dataView, offset) {
          const x = parseFloat32(dataView, offset);
          const y = parseFloat32(dataView, offset);
          const z = parseFloat32(dataView, offset);
          return [x, y, z];
        }
        function parseValue(dataView, buffer, offset, type, size) {
          if (type === 'string' || type === 'stringvector' || type === 'iccProfile') {
            return parseFixedLengthString(buffer, offset, size);
          } else if (type === 'chlist') {
            return parseChlist(dataView, buffer, offset, size);
          } else if (type === 'chromaticities') {
            return parseChromaticities(dataView, offset);
          } else if (type === 'compression') {
            return parseCompression(dataView, offset);
          } else if (type === 'box2i') {
            return parseBox2i(dataView, offset);
          } else if (type === 'lineOrder') {
            return parseLineOrder(dataView, offset);
          } else if (type === 'float') {
            return parseFloat32(dataView, offset);
          } else if (type === 'v2f') {
            return parseV2f(dataView, offset);
          } else if (type === 'v3f') {
            return parseV3f(dataView, offset);
          } else if (type === 'int') {
            return parseInt32(dataView, offset);
          } else if (type === 'rational') {
            return parseRational(dataView, offset);
          } else if (type === 'timecode') {
            return parseTimecode(dataView, offset);
          } else if (type === 'preview') {
            offset.value += size;
            return 'skipped';
          } else {
            offset.value += size;
            return undefined;
          }
        }
        function parseHeader(dataView, buffer, offset) {
          const EXRHeader = {};
          if (dataView.getUint32(0, true) != 20000630) {
            // magic

            throw new Error('THREE.EXRLoader: provided file doesn\'t appear to be in OpenEXR format.');
          }
          EXRHeader.version = dataView.getUint8(4);
          const spec = dataView.getUint8(5); // fullMask

          EXRHeader.spec = {
            singleTile: !!(spec & 2),
            longName: !!(spec & 4),
            deepFormat: !!(spec & 8),
            multiPart: !!(spec & 16)
          };

          // start of header

          offset.value = 8; // start at 8 - after pre-amble

          let keepReading = true;
          while (keepReading) {
            const attributeName = parseNullTerminatedString(buffer, offset);
            if (attributeName == 0) {
              keepReading = false;
            } else {
              const attributeType = parseNullTerminatedString(buffer, offset);
              const attributeSize = parseUint32(dataView, offset);
              const attributeValue = parseValue(dataView, buffer, offset, attributeType, attributeSize);
              if (attributeValue === undefined) {
                console.warn(`EXRLoader.parse: skipped unknown header attribute type \'${attributeType}\'.`);
              } else {
                EXRHeader[attributeName] = attributeValue;
              }
            }
          }
          if ((spec & ~0x04) != 0) {
            // unsupported tiled, deep-image, multi-part

            console.error('EXRHeader:', EXRHeader);
            throw new Error('THREE.EXRLoader: provided file is currently unsupported.');
          }
          return EXRHeader;
        }
        function setupDecoder(EXRHeader, dataView, uInt8Array, offset, outputType) {
          const EXRDecoder = {
            size: 0,
            viewer: dataView,
            array: uInt8Array,
            offset: offset,
            width: EXRHeader.dataWindow.xMax - EXRHeader.dataWindow.xMin + 1,
            height: EXRHeader.dataWindow.yMax - EXRHeader.dataWindow.yMin + 1,
            channels: EXRHeader.channels.length,
            bytesPerLine: null,
            lines: null,
            inputSize: null,
            type: EXRHeader.channels[0].pixelType,
            uncompress: null,
            getter: null,
            format: null,
            encoding: null
          };
          switch (EXRHeader.compression) {
            case 'NO_COMPRESSION':
              EXRDecoder.lines = 1;
              EXRDecoder.uncompress = uncompressRAW;
              break;
            case 'RLE_COMPRESSION':
              EXRDecoder.lines = 1;
              EXRDecoder.uncompress = uncompressRLE;
              break;
            case 'ZIPS_COMPRESSION':
              EXRDecoder.lines = 1;
              EXRDecoder.uncompress = uncompressZIP;
              break;
            case 'ZIP_COMPRESSION':
              EXRDecoder.lines = 16;
              EXRDecoder.uncompress = uncompressZIP;
              break;
            case 'PIZ_COMPRESSION':
              EXRDecoder.lines = 32;
              EXRDecoder.uncompress = uncompressPIZ;
              break;
            case 'PXR24_COMPRESSION':
              EXRDecoder.lines = 16;
              EXRDecoder.uncompress = uncompressPXR;
              break;
            case 'DWAA_COMPRESSION':
              EXRDecoder.lines = 32;
              EXRDecoder.uncompress = uncompressDWA;
              break;
            case 'DWAB_COMPRESSION':
              EXRDecoder.lines = 256;
              EXRDecoder.uncompress = uncompressDWA;
              break;
            default:
              throw new Error('EXRLoader.parse: ' + EXRHeader.compression + ' is unsupported');
          }
          EXRDecoder.scanlineBlockSize = EXRDecoder.lines;
          if (EXRDecoder.type == 1) {
            // half
            switch (outputType) {
              case THREE.FloatType:
                EXRDecoder.getter = parseFloat16;
                EXRDecoder.inputSize = INT16_SIZE;
                break;
              case THREE.HalfFloatType:
                EXRDecoder.getter = parseUint16;
                EXRDecoder.inputSize = INT16_SIZE;
                break;
            }
          } else if (EXRDecoder.type == 2) {
            // float
            switch (outputType) {
              case THREE.FloatType:
                EXRDecoder.getter = parseFloat32;
                EXRDecoder.inputSize = FLOAT32_SIZE;
                break;
              case THREE.HalfFloatType:
                EXRDecoder.getter = decodeFloat32;
                EXRDecoder.inputSize = FLOAT32_SIZE;
            }
          } else {
            throw new Error('EXRLoader.parse: unsupported pixelType ' + EXRDecoder.type + ' for ' + EXRHeader.compression + '.');
          }
          EXRDecoder.blockCount = (EXRHeader.dataWindow.yMax + 1) / EXRDecoder.scanlineBlockSize;
          for (let i = 0; i < EXRDecoder.blockCount; i++) parseInt64(dataView, offset); // scanlineOffset

          // we should be passed the scanline offset table, ready to start reading pixel data.

          // RGB images will be converted to RGBA format, preventing software emulation in select devices.
          EXRDecoder.outputChannels = EXRDecoder.channels == 3 ? 4 : EXRDecoder.channels;
          const size = EXRDecoder.width * EXRDecoder.height * EXRDecoder.outputChannels;
          switch (outputType) {
            case THREE.FloatType:
              EXRDecoder.byteArray = new Float32Array(size);

              // Fill initially with 1s for the alpha value if the texture is not RGBA, RGB values will be overwritten
              if (EXRDecoder.channels < EXRDecoder.outputChannels) EXRDecoder.byteArray.fill(1, 0, size);
              break;
            case THREE.HalfFloatType:
              EXRDecoder.byteArray = new Uint16Array(size);
              if (EXRDecoder.channels < EXRDecoder.outputChannels) EXRDecoder.byteArray.fill(0x3C00, 0, size); // Uint16Array holds half float data, 0x3C00 is 1

              break;
            default:
              console.error('THREE.EXRLoader: unsupported type: ', outputType);
              break;
          }
          EXRDecoder.bytesPerLine = EXRDecoder.width * EXRDecoder.inputSize * EXRDecoder.channels;
          if (EXRDecoder.outputChannels == 4) {
            EXRDecoder.format = THREE.RGBAFormat;
            EXRDecoder.encoding = THREE.LinearEncoding;
          } else {
            EXRDecoder.format = THREE.RedFormat;
            EXRDecoder.encoding = THREE.LinearEncoding;
          }
          return EXRDecoder;
        }

        // start parsing file [START]

        const bufferDataView = new DataView(buffer);
        const uInt8Array = new Uint8Array(buffer);
        const offset = {
          value: 0
        };

        // get header information and validate format.
        const EXRHeader = parseHeader(bufferDataView, buffer, offset);

        // get input compression information and prepare decoding.
        const EXRDecoder = setupDecoder(EXRHeader, bufferDataView, uInt8Array, offset, this.type);
        const tmpOffset = {
          value: 0
        };
        const channelOffsets = {
          R: 0,
          G: 1,
          B: 2,
          A: 3,
          Y: 0
        };
        for (let scanlineBlockIdx = 0; scanlineBlockIdx < EXRDecoder.height / EXRDecoder.scanlineBlockSize; scanlineBlockIdx++) {
          const line = parseUint32(bufferDataView, offset); // line_no
          EXRDecoder.size = parseUint32(bufferDataView, offset); // data_len
          EXRDecoder.lines = line + EXRDecoder.scanlineBlockSize > EXRDecoder.height ? EXRDecoder.height - line : EXRDecoder.scanlineBlockSize;
          const isCompressed = EXRDecoder.size < EXRDecoder.lines * EXRDecoder.bytesPerLine;
          const viewer = isCompressed ? EXRDecoder.uncompress(EXRDecoder) : uncompressRAW(EXRDecoder);
          offset.value += EXRDecoder.size;
          for (let line_y = 0; line_y < EXRDecoder.scanlineBlockSize; line_y++) {
            const true_y = line_y + scanlineBlockIdx * EXRDecoder.scanlineBlockSize;
            if (true_y >= EXRDecoder.height) break;
            for (let channelID = 0; channelID < EXRDecoder.channels; channelID++) {
              const cOff = channelOffsets[EXRHeader.channels[channelID].name];
              for (let x = 0; x < EXRDecoder.width; x++) {
                tmpOffset.value = (line_y * (EXRDecoder.channels * EXRDecoder.width) + channelID * EXRDecoder.width + x) * EXRDecoder.inputSize;
                const outIndex = (EXRDecoder.height - 1 - true_y) * (EXRDecoder.width * EXRDecoder.outputChannels) + x * EXRDecoder.outputChannels + cOff;
                EXRDecoder.byteArray[outIndex] = EXRDecoder.getter(viewer, tmpOffset);
              }
            }
          }
        }
        return {
          header: EXRHeader,
          width: EXRDecoder.width,
          height: EXRDecoder.height,
          data: EXRDecoder.byteArray,
          format: EXRDecoder.format,
          encoding: EXRDecoder.encoding,
          type: this.type
        };
      }
      setDataType(value) {
        this.type = value;
        return this;
      }
      load(url, onLoad, onProgress, onError) {
        function onLoadCallback(texture, texData) {
          texture.encoding = texData.encoding;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.flipY = false;
          if (onLoad) onLoad(texture, texData);
        }
        return super.load(url, onLoadCallback, onProgress, onError);
      }
    }

    // https://github.com/mrdoob/three.js/issues/5552
    // http://en.wikipedia.org/wiki/RGBE_image_format

    class RGBELoader extends THREE.DataTextureLoader {
      constructor(manager) {
        super(manager);
        this.type = THREE.HalfFloatType;
      }

      // adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html

      parse(buffer) {
        const /* return codes for rgbe routines */
          //RGBE_RETURN_SUCCESS = 0,
          RGBE_RETURN_FAILURE = -1,
          /* default error routine.  change this to change error handling */
          rgbe_read_error = 1,
          rgbe_write_error = 2,
          rgbe_format_error = 3,
          rgbe_memory_error = 4,
          rgbe_error = function (rgbe_error_code, msg) {
            switch (rgbe_error_code) {
              case rgbe_read_error:
                console.error('THREE.RGBELoader Read Error: ' + (msg || ''));
                break;
              case rgbe_write_error:
                console.error('THREE.RGBELoader Write Error: ' + (msg || ''));
                break;
              case rgbe_format_error:
                console.error('THREE.RGBELoader Bad File Format: ' + (msg || ''));
                break;
              default:
              case rgbe_memory_error:
                console.error('THREE.RGBELoader: Error: ' + (msg || ''));
            }
            return RGBE_RETURN_FAILURE;
          },
          /* offsets to red, green, and blue components in a data (float) pixel */
          //RGBE_DATA_RED = 0,
          //RGBE_DATA_GREEN = 1,
          //RGBE_DATA_BLUE = 2,

          /* number of floats per pixel, use 4 since stored in rgba image format */
          //RGBE_DATA_SIZE = 4,

          /* flags indicating which fields in an rgbe_header_info are valid */
          RGBE_VALID_PROGRAMTYPE = 1,
          RGBE_VALID_FORMAT = 2,
          RGBE_VALID_DIMENSIONS = 4,
          NEWLINE = '\n',
          fgets = function (buffer, lineLimit, consume) {
            const chunkSize = 128;
            lineLimit = !lineLimit ? 1024 : lineLimit;
            let p = buffer.pos,
              i = -1,
              len = 0,
              s = '',
              chunk = String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
            while (0 > (i = chunk.indexOf(NEWLINE)) && len < lineLimit && p < buffer.byteLength) {
              s += chunk;
              len += chunk.length;
              p += chunkSize;
              chunk += String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
            }
            if (-1 < i) {
              /*for (i=l-1; i>=0; i--) {
              	byteCode = m.charCodeAt(i);
              	if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
              	else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
              	if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
              }*/
              if (false !== consume) buffer.pos += len + i + 1;
              return s + chunk.slice(0, i);
            }
            return false;
          },
          /* minimal header reading.  modify if you want to parse more information */
          RGBE_ReadHeader = function (buffer) {
            // regexes to parse header info fields
            const magic_token_re = /^#\?(\S+)/,
              gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
              exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
              format_re = /^\s*FORMAT=(\S+)\s*$/,
              dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,
              // RGBE format header struct
              header = {
                valid: 0,
                /* indicate which fields are valid */

                string: '',
                /* the actual header string */

                comments: '',
                /* comments found in header */

                programtype: 'RGBE',
                /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */

                format: '',
                /* RGBE format, default 32-bit_rle_rgbe */

                gamma: 1.0,
                /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */

                exposure: 1.0,
                /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */

                width: 0,
                height: 0 /* image dimensions, width/height */
              };

            let line, match;
            if (buffer.pos >= buffer.byteLength || !(line = fgets(buffer))) {
              return rgbe_error(rgbe_read_error, 'no header found');
            }

            /* if you want to require the magic token then uncomment the next line */
            if (!(match = line.match(magic_token_re))) {
              return rgbe_error(rgbe_format_error, 'bad initial token');
            }
            header.valid |= RGBE_VALID_PROGRAMTYPE;
            header.programtype = match[1];
            header.string += line + '\n';
            while (true) {
              line = fgets(buffer);
              if (false === line) break;
              header.string += line + '\n';
              if ('#' === line.charAt(0)) {
                header.comments += line + '\n';
                continue; // comment line
              }

              if (match = line.match(gamma_re)) {
                header.gamma = parseFloat(match[1]);
              }
              if (match = line.match(exposure_re)) {
                header.exposure = parseFloat(match[1]);
              }
              if (match = line.match(format_re)) {
                header.valid |= RGBE_VALID_FORMAT;
                header.format = match[1]; //'32-bit_rle_rgbe';
              }

              if (match = line.match(dimensions_re)) {
                header.valid |= RGBE_VALID_DIMENSIONS;
                header.height = parseInt(match[1], 10);
                header.width = parseInt(match[2], 10);
              }
              if (header.valid & RGBE_VALID_FORMAT && header.valid & RGBE_VALID_DIMENSIONS) break;
            }
            if (!(header.valid & RGBE_VALID_FORMAT)) {
              return rgbe_error(rgbe_format_error, 'missing format specifier');
            }
            if (!(header.valid & RGBE_VALID_DIMENSIONS)) {
              return rgbe_error(rgbe_format_error, 'missing image size specifier');
            }
            return header;
          },
          RGBE_ReadPixels_RLE = function (buffer, w, h) {
            const scanline_width = w;
            if (
            // run length encoding is not allowed so read flat
            scanline_width < 8 || scanline_width > 0x7fff ||
            // this file is not run length encoded
            2 !== buffer[0] || 2 !== buffer[1] || buffer[2] & 0x80) {
              // return the flat buffer
              return new Uint8Array(buffer);
            }
            if (scanline_width !== (buffer[2] << 8 | buffer[3])) {
              return rgbe_error(rgbe_format_error, 'wrong scanline width');
            }
            const data_rgba = new Uint8Array(4 * w * h);
            if (!data_rgba.length) {
              return rgbe_error(rgbe_memory_error, 'unable to allocate buffer space');
            }
            let offset = 0,
              pos = 0;
            const ptr_end = 4 * scanline_width;
            const rgbeStart = new Uint8Array(4);
            const scanline_buffer = new Uint8Array(ptr_end);
            let num_scanlines = h;

            // read in each successive scanline
            while (num_scanlines > 0 && pos < buffer.byteLength) {
              if (pos + 4 > buffer.byteLength) {
                return rgbe_error(rgbe_read_error);
              }
              rgbeStart[0] = buffer[pos++];
              rgbeStart[1] = buffer[pos++];
              rgbeStart[2] = buffer[pos++];
              rgbeStart[3] = buffer[pos++];
              if (2 != rgbeStart[0] || 2 != rgbeStart[1] || (rgbeStart[2] << 8 | rgbeStart[3]) != scanline_width) {
                return rgbe_error(rgbe_format_error, 'bad rgbe scanline format');
              }

              // read each of the four channels for the scanline into the buffer
              // first red, then green, then blue, then exponent
              let ptr = 0,
                count;
              while (ptr < ptr_end && pos < buffer.byteLength) {
                count = buffer[pos++];
                const isEncodedRun = count > 128;
                if (isEncodedRun) count -= 128;
                if (0 === count || ptr + count > ptr_end) {
                  return rgbe_error(rgbe_format_error, 'bad scanline data');
                }
                if (isEncodedRun) {
                  // a (encoded) run of the same value
                  const byteValue = buffer[pos++];
                  for (let i = 0; i < count; i++) {
                    scanline_buffer[ptr++] = byteValue;
                  }
                  //ptr += count;
                } else {
                  // a literal-run
                  scanline_buffer.set(buffer.subarray(pos, pos + count), ptr);
                  ptr += count;
                  pos += count;
                }
              }

              // now convert data from buffer into rgba
              // first red, then green, then blue, then exponent (alpha)
              const l = scanline_width; //scanline_buffer.byteLength;
              for (let i = 0; i < l; i++) {
                let off = 0;
                data_rgba[offset] = scanline_buffer[i + off];
                off += scanline_width; //1;
                data_rgba[offset + 1] = scanline_buffer[i + off];
                off += scanline_width; //1;
                data_rgba[offset + 2] = scanline_buffer[i + off];
                off += scanline_width; //1;
                data_rgba[offset + 3] = scanline_buffer[i + off];
                offset += 4;
              }
              num_scanlines--;
            }
            return data_rgba;
          };
        const RGBEByteToRGBFloat = function (sourceArray, sourceOffset, destArray, destOffset) {
          const e = sourceArray[sourceOffset + 3];
          const scale = Math.pow(2.0, e - 128.0) / 255.0;
          destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
          destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
          destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
          destArray[destOffset + 3] = 1;
        };
        const RGBEByteToRGBHalf = function (sourceArray, sourceOffset, destArray, destOffset) {
          const e = sourceArray[sourceOffset + 3];
          const scale = Math.pow(2.0, e - 128.0) / 255.0;

          // clamping to 65504, the maximum representable value in float16
          destArray[destOffset + 0] = THREE.DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 0] * scale, 65504));
          destArray[destOffset + 1] = THREE.DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 1] * scale, 65504));
          destArray[destOffset + 2] = THREE.DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 2] * scale, 65504));
          destArray[destOffset + 3] = THREE.DataUtils.toHalfFloat(1);
        };
        const byteArray = new Uint8Array(buffer);
        byteArray.pos = 0;
        const rgbe_header_info = RGBE_ReadHeader(byteArray);
        if (RGBE_RETURN_FAILURE !== rgbe_header_info) {
          const w = rgbe_header_info.width,
            h = rgbe_header_info.height,
            image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);
          if (RGBE_RETURN_FAILURE !== image_rgba_data) {
            let data, type;
            let numElements;
            switch (this.type) {
              case THREE.FloatType:
                numElements = image_rgba_data.length / 4;
                const floatArray = new Float32Array(numElements * 4);
                for (let j = 0; j < numElements; j++) {
                  RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 4);
                }
                data = floatArray;
                type = THREE.FloatType;
                break;
              case THREE.HalfFloatType:
                numElements = image_rgba_data.length / 4;
                const halfArray = new Uint16Array(numElements * 4);
                for (let j = 0; j < numElements; j++) {
                  RGBEByteToRGBHalf(image_rgba_data, j * 4, halfArray, j * 4);
                }
                data = halfArray;
                type = THREE.HalfFloatType;
                break;
              default:
                console.error('THREE.RGBELoader: unsupported type: ', this.type);
                break;
            }
            return {
              width: w,
              height: h,
              data: data,
              header: rgbe_header_info.string,
              gamma: rgbe_header_info.gamma,
              exposure: rgbe_header_info.exposure,
              type: type
            };
          }
        }
        return null;
      }
      setDataType(value) {
        this.type = value;
        return this;
      }
      load(url, onLoad, onProgress, onError) {
        function onLoadCallback(texture, texData) {
          switch (texture.type) {
            case THREE.FloatType:
            case THREE.HalfFloatType:
              texture.encoding = THREE.LinearEncoding;
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.generateMipmaps = false;
              texture.flipY = true;
              break;
          }
          if (onLoad) onLoad(texture, texData);
        }
        return super.load(url, onLoadCallback, onProgress, onError);
      }
    }

    var Environment = /** @class */ (function () {
        function Environment(options) {
            var _a;
            this.pmremGenerator = new THREE.PMREMGenerator(options.renderer);
            this.pmremGenerator.compileEquirectangularShader();
            this.path = options.path;
            this.scene = options.scene;
            this.environment = (_a = options.environment) !== null && _a !== void 0 ? _a : {
                path: "",
                type: "exr"
            };
        }
        Environment.prototype.init = function () {
            var _this = this;
            this.getCubeMapTexture(this.environment).then(function (envMap) {
                _this.scene.environment = envMap;
            });
        };
        Environment.prototype.loadHdr = function (path) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                new RGBELoader().load(_this.path + path, function (texture) {
                    var envMap = _this.pmremGenerator.fromEquirectangular(texture).texture;
                    _this.pmremGenerator.dispose();
                    resolve(envMap);
                }, undefined, reject);
            });
        };
        Environment.prototype.loadExr = function (path) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                new EXRLoader().load(_this.path + path, function (texture) {
                    var envMap = _this.pmremGenerator.fromEquirectangular(texture).texture;
                    _this.pmremGenerator.dispose();
                    resolve(envMap);
                }, undefined, reject);
            });
        };
        //下载环境贴图
        Environment.prototype.getCubeMapTexture = function (environment) {
            if (environment === void 0) { environment = { path: "", type: "hdr" }; }
            var path = environment.path, type = environment.type;
            // no envmap
            if (!path)
                return Promise.resolve(null);
            switch (type) {
                case "hdr":
                    return this.loadHdr(path);
                case "exr":
                    return this.loadExr(path);
                default:
                    return Promise.resolve(null);
            }
        };
        return Environment;
    }());

    var Event = /** @class */ (function () {
        function Event(options) {
            var _a, _b;
            this.types = (_a = options.types) !== null && _a !== void 0 ? _a : [];
            this.el = options.el;
            this.mouse = new THREE.Vector2();
            this.raycaster = new THREE.Raycaster();
            this.camera = options.camera;
            this.scene = options.scene;
            this.typesFn = (_b = options.typesFn) !== null && _b !== void 0 ? _b : {
                click: [],
                dblclick: [],
                mousemove: []
            };
        }
        Event.prototype.init = function () {
            var _this = this;
            this.types.forEach(function (type) {
                _this.el.addEventListener(type, function (e) {
                    var _a;
                    var list = _this.getIntersectObject(e, true).objectList;
                    if (list.length > 0) {
                        ((_a = _this.typesFn[type]) !== null && _a !== void 0 ? _a : []).forEach(function (fn) {
                            return fn({
                                event: e,
                                list: list
                            });
                        });
                    }
                });
            });
        };
        Event.prototype.getIntersectObject = function (event, recursive) {
            var objectList = [];
            try {
                this.mouse.x = (event.offsetX / this.el.clientWidth) * 2 - 1;
                this.mouse.y = -(event.offsetY / this.el.clientHeight) * 2 + 1;
                this.raycaster.setFromCamera(this.mouse, this.camera);
                objectList = this.raycaster.intersectObjects(this.scene.children, recursive);
            }
            catch (e) {
                // 鼠标越界
            }
            return {
                raycaster: this.raycaster,
                objectList: objectList
            };
        };
        return Event;
    }());

    var Source = /** @class */ (function () {
        function Source() {
            this.textureLoader = new THREE.TextureLoader();
        }
        Source.prototype.loadTexture = function (_a) {
            var path = _a.path, onLoad = _a.onLoad, onProgress = _a.onProgress, onError = _a.onError;
            return this.textureLoader.load(path, onLoad, onProgress, onError);
        };
        return Source;
    }());

    var Object3D = /** @class */ (function (_super) {
        __extends(Object3D, _super);
        function Object3D() {
            return _super.call(this) || this;
        }
        return Object3D;
    }(THREE.Object3D));

    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            return _super.call(this) || this;
        }
        Sprite.prototype.init = function (options) {
            this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: options.texture,
                side: THREE.FrontSide,
                transparent: true,
                depthWrite: false,
                sizeAttenuation: false,
                toneMapped: false
            }));
            this.sprite.name = options.name;
            this.sprite.renderOrder = 10000;
            this.sprite.geometry.computeBoundingBox();
            this.sprite.geometry.center();
            this.attach(this.sprite);
        };
        return Sprite;
    }(Object3D));

    var Parade = /** @class */ (function () {
        function Parade(options) {
            var _a, _b;
            this.pipeParams = options.pipeParams;
            this.pipeTexture = options.pipeTexture;
            this.scene = options.scene;
            this.animate = options.animate;
            this.speed = (_a = options.speed / 1000) !== null && _a !== void 0 ? _a : 1 / 1000;
            this.loop = (_b = options.loop) !== null && _b !== void 0 ? _b : false;
            this.stop = true;
            this.object = options.object;
            this.run();
        }
        /*
         *@description: 绘制管道
         *@author: yangj
         *@date: 2023-03-10 14:36:45
         *@return:
         */
        Parade.prototype.drawPipeLine = function (pipeLineArr) {
            if (pipeLineArr.length < 2) {
                return;
            }
            this.initCurve(pipeLineArr);
            this.initPipe(this.pipeParams);
        };
        /*
         *@description: 三维平滑曲线
         *@author: yangj
         *@date: 2023-03-10 14:56:01
         *@return:
         */
        Parade.prototype.initCurve = function (pipeLineArr) {
            this.curve = new THREE.CatmullRomCurve3(pipeLineArr);
            this.curve.arcLengthDivisions = 1000;
        };
        /*
         *@description: 管道
         *@author: yangj
         *@date: 2023-03-10 14:57:06
         *@return:
         */
        Parade.prototype.initPipe = function (_a) {
            var tubularSegments = _a.tubularSegments, radius = _a.radius, radialSegments = _a.radialSegments, closed = _a.closed;
            var tubeGeometry = new THREE.TubeGeometry(this.curve, tubularSegments, radius, radialSegments, closed);
            this.pipeTexture.wrapS = THREE.RepeatWrapping; //每个都重复
            this.pipeTexture.wrapT = THREE.RepeatWrapping;
            this.pipeTexture.repeat.set(1, 1);
            this.pipeTexture.needsUpdate = true;
            var material = new THREE.MeshBasicMaterial({
                map: this.pipeTexture,
                side: THREE.DoubleSide,
                transparent: true
            });
            this.pipeLine = new THREE.Mesh(tubeGeometry, material);
            this.scene.add(this.pipeLine);
        };
        /*
         *@description: 清除
         *@author: yangj
         *@date: 2023-03-10 15:21:01
         *@return:
         */
        Parade.prototype.clear = function () {
            this.scene.remove(this.pipeLine);
            this.pipeLine = null;
        };
        /*
         *@description: 巡检
         *@author: yangj
         *@date: 2023-03-10 15:23:56
         *@return:
         */
        Parade.prototype.autoParade = function (callback) {
            this.progress = 0;
            this.stop = false;
            this.callback = callback;
        };
        Parade.prototype.run = function () {
            var _this = this;
            this.animate.push(function () {
                if (!_this.stop) {
                    if (_this.direction === "GO") {
                        if (_this.progress > 1.0) {
                            if (_this.loop) {
                                _this.direction = "BACK";
                            }
                            else {
                                _this.callback instanceof Function &&
                                    _this.callback("end", {
                                        point: _this.object.position,
                                        pointLook: _this.object.position
                                    });
                            }
                        }
                        else {
                            _this.progress += _this.speed;
                        }
                    }
                    else {
                        if (_this.progress <= 0) {
                            _this.direction = "GO";
                        }
                        else {
                            _this.progress -= _this.speed;
                        }
                    }
                    if (_this.curve && _this.object) {
                        var point = void 0, pointLook = void 0;
                        if (_this.direction === "GO") {
                            point = _this.curve.getPoint(_this.progress);
                            pointLook = _this.curve.getPoint(_this.progress + _this.speed * 20);
                        }
                        else {
                            point = _this.curve.getPoint(_this.progress);
                            pointLook = _this.curve.getPoint(_this.progress - _this.speed * 20);
                        }
                        _this.object.position.set(point.x, point.y, point.z);
                        _this.object.lookAt(pointLook);
                        _this.callback instanceof Function &&
                            _this.callback("start", {
                                point: point,
                                pointLook: pointLook
                            });
                    }
                }
            });
        };
        return Parade;
    }());

    var Particle = /** @class */ (function () {
        function Particle() {
            this.position = new THREE.Vector3(); //位置
            this.velocity = new THREE.Vector3(); //位移向量（移动方向和距离）
            this.acceleration = new THREE.Vector3(); //位移向量的增量（每次产生位移后改变位移向量）
            this.angle = 0; //角度
            this.angleVelocity = 0; //角度增量
            this.angleAcceleration = 0; //改变角度增量的增量
            this.size = 16.0; //大小
            this.color = new THREE.Color(); //颜色
            this.opacity = 1.0; //透明度
            this.age = 0; //时间
            this.alive = 0; //存活
        }
        Particle.prototype.update = function (dt) {
            this.position.add(this.velocity.clone().multiplyScalar(dt)); //位置在位移方向上的运动
            this.velocity.add(this.acceleration.clone().multiplyScalar(dt)); //位移向量的改变
            this.angle += this.angleVelocity * 0.01745329251 * dt; // 角度在角度偏移量上的改变
            this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt; // 角度偏移量自身的改变
            this.age += dt;
            if (this.sizeTween.times.length > 0) {
                this.size = this.sizeTween.lerp(this.age);
            }
            if (this.colorTween.times.length > 0) {
                var colorHSL = this.colorTween.lerp(this.age);
                this.color = new THREE.Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z);
            }
            if (this.opacityTween.times.length > 0) {
                this.opacity = this.opacityTween.lerp(this.age);
            }
        };
        return Particle;
    }());

    var particleVertexShader = [
        "attribute vec3  customColor;",
        "attribute float customOpacity;",
        "attribute float customSize;",
        "attribute float customAngle;",
        "attribute float customVisible;",
        "varying vec4  vColor;",
        "varying float vAngle;",
        "void main()",
        "{",
        "if ( customVisible > 0.5 )",
        "vColor = vec4( customColor, customOpacity );",
        "else",
        "vColor = vec4(0,0,0,0);",
        "vAngle = customAngle;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );",
        "gl_Position = projectionMatrix * mvPosition;",
        "}",
    ].join("\n");
    var particleFragmentShader = [
        "uniform sampler2D mytexture;",
        "varying vec4 vColor;",
        "varying float vAngle;",
        "void main()",
        "{",
        "gl_FragColor = vColor;",
        "float c = cos(vAngle);",
        "float s = sin(vAngle);",
        "vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,",
        "c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);",
        "vec4 rotatedTexture = texture2D( mytexture,  rotatedUV );",
        "gl_FragColor = gl_FragColor * rotatedTexture;",
        "}",
    ].join("\n");

    var Tween = /** @class */ (function () {
        function Tween(timeArray, valueArray) {
            if (timeArray === void 0) { timeArray = []; }
            if (valueArray === void 0) { valueArray = []; }
            this.times = timeArray || [];
            this.values = valueArray || [];
        }
        Tween.prototype.lerp = function (t) {
            var i = 0;
            var n = this.times.length;
            while (i < n && t > this.times[i]) {
                i++;
            }
            if (i == 0) {
                return this.values[0];
            }
            if (i == n) {
                return this.values[n - 1];
            }
            var p = (t - this.times[i - 1]) / (this.times[i] - this.times[i - 1]);
            if (this.values[0] instanceof THREE.Vector3) {
                return this.values[i - 1].clone().lerp(this.values[i], p);
            } // its a float
            else {
                return this.values[i - 1] + p * (this.values[i] - this.values[i - 1]);
            }
        };
        return Tween;
    }());

    var Type$1 = Object.freeze({ CUBE: 1, SPHERE: 2 });
    var ParticleEngine = /** @class */ (function () {
        function ParticleEngine(options) {
            this.positions = [];
            this.customVisibles = [];
            this.customColor = [];
            this.customOpacity = [];
            this.customSize = [];
            this.customAngle = [];
            this.positionStyle = Type$1.CUBE;
            this.positionBase = new THREE.Vector3();
            this.positionSpread = new THREE.Vector3();
            this.positionRadius = 0;
            this.velocityStyle = Type$1.CUBE;
            this.velocityBase = new THREE.Vector3();
            this.velocitySpread = new THREE.Vector3();
            this.speedBase = 0;
            this.speedSpread = 0;
            this.accelerationBase = new THREE.Vector3();
            this.accelerationSpread = new THREE.Vector3();
            this.angleBase = 0;
            this.angleSpread = 0;
            this.angleVelocityBase = 0;
            this.angleVelocitySpread = 0;
            this.angleAccelerationBase = 0;
            this.angleAccelerationSpread = 0;
            this.sizeBase = 0.0;
            this.sizeSpread = 0.0;
            this.sizeTween = new Tween();
            this.colorBase = new THREE.Vector3(0.0, 0, 0);
            this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);
            this.colorTween = new Tween();
            this.opacityBase = 1.0;
            this.opacitySpread = 0.0;
            this.opacityTween = new Tween();
            this.blendStyle = THREE.NormalBlending; // false;
            this.particleArray = [];
            this.particlesPerSecond = 100;
            this.particleDeathAge = 1.0;
            this.emitterAge = 0.0;
            this.emitterAlive = true;
            this.emitterDeathAge = 60;
            this.particleCount =
                this.particlesPerSecond *
                    Math.min(this.particleDeathAge, this.emitterDeathAge);
            this.particleGeometry = null;
            this.particleTexture = null;
            this.particleMaterial = null;
            this.particleMesh = null;
            this.mugen = options.mugen || false;
            this.scene = options.scene;
            this.start = false;
        }
        /*
         *@description: 创建粒子
         *@author: yangj
         *@date: 2023-03-15 15:42:15
         *@return:
         */
        ParticleEngine.prototype.createParticle = function () {
            var particle = new Particle();
            if (this.positionStyle == Type$1.CUBE) {
                particle.position = this.randomVector3(this.positionBase, this.positionSpread);
            }
            if (this.positionStyle == Type$1.SPHERE) {
                var z = 2 * Math.random() - 1;
                var t = 6.2832 * Math.random();
                var r = Math.sqrt(1 - z * z);
                var vec3 = new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z);
                particle.position = new THREE.Vector3().addVectors(this.positionBase, vec3.multiplyScalar(this.positionRadius));
            }
            if (this.velocityStyle == Type$1.CUBE) {
                particle.velocity = this.randomVector3(this.velocityBase, this.velocitySpread);
            }
            if (this.velocityStyle == Type$1.SPHERE) {
                var direction = new THREE.Vector3().subVectors(particle.position, this.positionBase);
                var speed = this.randomValue(this.speedBase, this.speedSpread);
                particle.velocity = direction.normalize().multiplyScalar(speed);
            }
            particle.acceleration = this.randomVector3(this.accelerationBase, this.accelerationSpread);
            particle.angle = this.randomValue(this.angleBase, this.angleSpread);
            particle.angleVelocity = this.randomValue(this.angleVelocityBase, this.angleVelocitySpread);
            particle.angleAcceleration = this.randomValue(this.angleAccelerationBase, this.angleAccelerationSpread);
            particle.size = this.randomValue(this.sizeBase, this.sizeSpread);
            var color = this.randomVector3(this.colorBase, this.colorSpread);
            particle.color = new THREE.Color().setHSL(color.x, color.y, color.z);
            particle.opacity = this.randomValue(this.opacityBase, this.opacitySpread);
            particle.age = 0;
            particle.alive = 0;
            return particle;
        };
        ParticleEngine.prototype.initialize = function () {
            var positions = [];
            var customVisibles = [];
            var customColor = [];
            var customOpacity = [];
            var customSize = [];
            var customAngle = [];
            for (var i = 0; i < this.particleCount; i++) {
                this.particleArray[i] = this.createParticle();
                positions.push(this.particleArray[i].position.x);
                positions.push(this.particleArray[i].position.y);
                positions.push(this.particleArray[i].position.z);
                customVisibles.push(this.particleArray[i].alive);
                customColor.push(this.particleArray[i].color.r);
                customColor.push(this.particleArray[i].color.g);
                customColor.push(this.particleArray[i].color.b);
                customOpacity.push(this.particleArray[i].opacity);
                customSize.push(this.particleArray[i].size);
                customAngle.push(this.particleArray[i].angle);
            }
            this.positions = positions;
            this.customVisibles = customVisibles;
            this.customColor = customColor;
            this.customOpacity = customOpacity;
            this.customSize = customSize;
            this.customAngle = customAngle;
            this.particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(this.positions, 3));
            this.particleGeometry.setAttribute("customVisible", new THREE.Float32BufferAttribute(this.customVisibles, 1));
            this.particleGeometry.setAttribute("customColor", new THREE.Float32BufferAttribute(this.customColor, 3));
            this.particleGeometry.setAttribute("customOpacity", new THREE.Float32BufferAttribute(this.customOpacity, 1));
            this.particleGeometry.setAttribute("customSize", new THREE.Float32BufferAttribute(this.customSize, 1));
            this.particleGeometry.setAttribute("customAngle", new THREE.Float32BufferAttribute(this.customAngle, 1));
            this.particleMaterial.blending = this.blendStyle;
            if (this.blendStyle !== THREE.NormalBlending) {
                this.particleMaterial.depthTest = false;
            }
            this.particleMesh = new THREE.Points(this.particleGeometry, this.particleMaterial);
            // this.particleMesh.dynamic = true;
            // this.particleMesh.sortParticles = true;
            this.scene.add(this.particleMesh);
            this.start = true;
        };
        ParticleEngine.prototype.setValues = function (parameters, params) {
            if (parameters === undefined) {
                return;
            }
            var obj = Object.assign(parameters, params);
            this.sizeTween = new Tween();
            this.colorTween = new Tween();
            this.opacityTween = new Tween();
            for (var key in obj) {
                this[key] = obj[key];
            }
            Particle.prototype.sizeTween = this.sizeTween;
            Particle.prototype.colorTween = this.colorTween;
            Particle.prototype.opacityTween = this.opacityTween;
            this.particleArray = [];
            this.emitterAge = 0.0;
            this.emitterAlive = true;
            this.particleCount =
                this.particlesPerSecond *
                    Math.min(this.particleDeathAge, this.emitterDeathAge);
            this.particleGeometry = new THREE.BufferGeometry();
            this.particleMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    mytexture: { value: this.particleTexture }
                },
                vertexShader: particleVertexShader,
                fragmentShader: particleFragmentShader,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                vertexColors: true
            });
            this.particleMesh = new THREE.Points();
        };
        ParticleEngine.prototype.reastValues = function (parameters) {
            this.sizeTween = new Tween();
            this.colorTween = new Tween();
            this.opacityTween = new Tween();
            for (var key in parameters) {
                this[key] = parameters[key];
            }
        };
        ParticleEngine.prototype.randomValue = function (base, spread) {
            return base + spread * (Math.random() - 0.5);
        };
        ParticleEngine.prototype.randomVector3 = function (base, spread) {
            var rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            return new THREE.Vector3().addVectors(base, new THREE.Vector3().multiplyVectors(spread, rand3));
        };
        ParticleEngine.prototype.destroy = function () {
            this.start = false;
            this.reastValues({
                positionBase: new THREE.Vector3(),
                positionStyle: Type$1.CUBE,
                positionSpread: new THREE.Vector3(),
                positionRadius: 0,
                velocityStyle: Type$1.CUBE,
                velocityBase: new THREE.Vector3(),
                velocitySpread: new THREE.Vector3(),
                speedBase: 0,
                speedSpread: 0,
                accelerationBase: new THREE.Vector3(),
                accelerationSpread: new THREE.Vector3(),
                particleTexture: null,
                angleBase: 0,
                angleSpread: 0,
                angleVelocityBase: 0,
                angleVelocitySpread: 0,
                angleAccelerationBase: 0,
                angleAccelerationSpread: 0,
                sizeBase: 0.0,
                sizeSpread: 0.0,
                sizeTween: null,
                colorBase: new THREE.Vector3(0.0, 0.0, 0.0),
                colorSpread: new THREE.Vector3(0, 0, 0),
                colorTween: null,
                opacityBase: 0,
                opacitySpread: 0,
                opacityTween: null,
                blendStyle: THREE.NormalBlending,
                particlesPerSecond: 0,
                particleDeathAge: 0,
                emitterDeathAge: 0
            });
            this.scene.remove(this.particleMesh);
        };
        ParticleEngine.prototype.update = function (dt) {
            var recycleIndices = [];
            for (var i = 0; i < this.particleCount; i++) {
                if (this.particleArray[i].alive) {
                    this.particleArray[i].update(dt);
                    if (this.particleArray[i].age > this.particleDeathAge) {
                        this.particleArray[i].alive = 0.0;
                        recycleIndices.push(i);
                    }
                    this.customVisibles[i] = this.particleArray[i].alive;
                    this.customColor[i * 3] = this.particleArray[i].color.r;
                    this.customColor[i * 3 + 1] = this.particleArray[i].color.g;
                    this.customColor[i * 3 + 2] = this.particleArray[i].color.b;
                    this.customOpacity[i] = this.particleArray[i].opacity;
                    this.customSize[i] = this.particleArray[i].size;
                    this.customAngle[i] = this.particleArray[i].angle;
                }
            }
            this.particleGeometry.setAttribute("customVisible", new THREE.Float32BufferAttribute(this.customVisibles, 1));
            this.particleGeometry.setAttribute("customColor", new THREE.Float32BufferAttribute(this.customColor, 3));
            this.particleGeometry.setAttribute("customOpacity", new THREE.Float32BufferAttribute(this.customOpacity, 1));
            this.particleGeometry.setAttribute("customSize", new THREE.Float32BufferAttribute(this.customSize, 1));
            this.particleGeometry.setAttribute("customAngle", new THREE.Float32BufferAttribute(this.customAngle, 1));
            this.particleGeometry.attributes.customVisible.needsUpdate = true;
            this.particleGeometry.attributes.customColor.needsUpdate = true;
            this.particleGeometry.attributes.customOpacity.needsUpdate = true;
            this.particleGeometry.attributes.customSize.needsUpdate = true;
            this.particleGeometry.attributes.customAngle.needsUpdate = true;
            if (!this.emitterAlive)
                return;
            if (this.emitterAge < this.particleDeathAge) {
                var startIndex = Math.round(this.particlesPerSecond * (this.emitterAge + 0));
                var endIndex = Math.round(this.particlesPerSecond * (this.emitterAge + dt));
                if (endIndex > this.particleCount) {
                    endIndex = this.particleCount;
                }
                for (var i = startIndex; i < endIndex; i++) {
                    this.particleArray[i].alive = 1.0;
                }
            }
            for (var j = 0; j < recycleIndices.length; j++ // 无限循环
            ) {
                var i = recycleIndices[j];
                this.particleArray[i] = this.createParticle();
                this.particleArray[i].alive = 1.0; // activate right away
                this.positions[i * 3] =
                    this.particleArray[i].position.x + 0.1 * Math.sin(0.1 * i + 0.1 * dt);
                this.positions[i * 3 + 1] =
                    this.particleArray[i].position.y + 0.1 * Math.sin(0.1 * i + 0.1 * dt);
                this.positions[i * 3 + 2] =
                    this.particleArray[i].position.z + 0.1 * Math.sin(0.1 * i + 0.1 * dt);
            }
            for (var j = 0; j < this.particleCount; j++) {
                this.positions[j * 3] = this.particleArray[j].position.x;
                this.positions[j * 3 + 1] = this.particleArray[j].position.y;
                this.positions[j * 3 + 2] = this.particleArray[j].position.z;
            }
            this.particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(this.positions, 3));
            this.emitterAge += dt;
            if (!this.mugen) {
                if (this.emitterAge > this.emitterDeathAge)
                    this.emitterAlive = false;
            }
        };
        return ParticleEngine;
    }());

    /**
     * @file: zhdParticleExamples.
     * @authors: yangj (yangjia@fjxhx.cc).
     * @createDate: 2022/3/4.
     * @version: 1.0.
     * @copyright © 2021 新和兴 All rights reserved.
     */
    var gAppPath = "../public/lizi/";
    var Type = Object.freeze({ CUBE: 1, SPHERE: 2 });
    var textureLoader = new THREE__namespace.TextureLoader();
    var Examples = {
        fountain: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 105, 0),
            positionSpread: new THREE__namespace.Vector3(10, 0, 10),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, 60, 0),
            velocitySpread: new THREE__namespace.Vector3(100, 20, 100),
            accelerationBase: new THREE__namespace.Vector3(0, -100, 0),
            particleTexture: textureLoader.load(gAppPath + "star.png"),
            angleBase: 0,
            angleSpread: 180,
            angleVelocityBase: 0,
            angleVelocitySpread: 360 * 4,
            sizeTween: new Tween([0, 1], [1, 10]),
            opacityTween: new Tween([2, 3], [1, 0]),
            colorTween: new Tween([0.5, 2], [new THREE__namespace.Vector3(0, 1, 0.5), new THREE__namespace.Vector3(0.8, 1, 0.5)]),
            particlesPerSecond: 200,
            particleDeathAge: 3.0,
            emitterDeathAge: 60
        },
        fireball: {
            positionStyle: Type.SPHERE,
            positionBase: new THREE__namespace.Vector3(0, 50, 0),
            positionRadius: 2,
            velocityStyle: Type.SPHERE,
            speedBase: 2,
            speedSpread: 10,
            particleTexture: textureLoader.load(gAppPath + "smokeparticle.png"),
            sizeTween: new Tween([0, 0.1], [1, 50]),
            opacityTween: new Tween([0.7, 1], [1, 0]),
            colorBase: new THREE__namespace.Vector3(0.02, 1, 0.4),
            blendStyle: THREE__namespace.AdditiveBlending,
            particlesPerSecond: 600,
            particleDeathAge: 0.5,
            emitterDeathAge: 60
        },
        smoke: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 0, 0),
            positionSpread: new THREE__namespace.Vector3(2, 0, 2),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, 30, 0),
            velocitySpread: new THREE__namespace.Vector3(20, 30, 20),
            accelerationBase: new THREE__namespace.Vector3(0, -10, 0),
            particleTexture: textureLoader.load(gAppPath + "smokeparticle.png"),
            speedBase: 10,
            speedSpread: 10,
            angleBase: 0,
            angleSpread: 120,
            angleVelocityBase: 0,
            angleVelocitySpread: 720,
            sizeTween: new Tween([0, 1], [32, 128]),
            opacityTween: new Tween([0.8, 2], [0.5, 0]),
            colorTween: new Tween([0.4, 1], [new THREE__namespace.Vector3(0, 0, 0.2), new THREE__namespace.Vector3(0, 0, 0.5)]),
            particlesPerSecond: 100,
            particleDeathAge: 1.0,
            emitterDeathAge: 5
        },
        clouds: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(-100, 100, 0),
            positionSpread: new THREE__namespace.Vector3(300, 20, 300),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(100, 0, 0),
            velocitySpread: new THREE__namespace.Vector3(100, 0, 0),
            particleTexture: textureLoader.load(gAppPath + "cloud_baseColor.png"),
            sizeBase: 200.0,
            sizeSpread: 100.0,
            colorBase: new THREE__namespace.Vector3(0.0, 0.0, 1),
            opacityTween: new Tween([0, 1, 4, 5], [0, 1, 1, 0]),
            particlesPerSecond: 200,
            particleDeathAge: 10.0,
            emitterDeathAge: 60
        },
        snow: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 200, 0),
            positionSpread: new THREE__namespace.Vector3(200, 0, 200),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(40, -100, 0),
            velocitySpread: new THREE__namespace.Vector3(-30, 200, 10),
            accelerationBase: new THREE__namespace.Vector3(0, -10, 0),
            angleBase: 0,
            angleSpread: 720,
            angleVelocityBase: 0,
            angleVelocitySpread: 60,
            particleTexture: textureLoader.load(gAppPath + "snowflake.png"),
            sizeTween: new Tween([0, 0.25], [4, 5]),
            colorBase: new THREE__namespace.Vector3(0.66, 1.0, 0.9),
            opacityTween: new Tween([2, 3], [0.8, 0]),
            particlesPerSecond: 500,
            particleDeathAge: 1.0,
            emitterDeathAge: 60
        },
        rain: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 200, 0),
            positionSpread: new THREE__namespace.Vector3(200, 0, 200),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, -200, 0),
            velocitySpread: new THREE__namespace.Vector3(50, 70, 50),
            accelerationBase: new THREE__namespace.Vector3(0, -10, 0),
            particleTexture: textureLoader.load(gAppPath + "rain.png"),
            sizeBase: 30,
            sizeSpread: 40.0,
            colorBase: new THREE__namespace.Vector3(0.66, 1.0, 0.9),
            colorSpread: new THREE__namespace.Vector3(0.0, 0, 0.1),
            opacityBase: 0.4,
            particlesPerSecond: 500,
            particleDeathAge: 1.0,
            emitterDeathAge: 60
        },
        starfield: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 200, 0),
            positionSpread: new THREE__namespace.Vector3(400, 50, 400),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, 0, 0),
            velocitySpread: new THREE__namespace.Vector3(0.5, 0.5, 0.5),
            angleBase: 0,
            angleSpread: 720,
            angleVelocityBase: 0,
            angleVelocitySpread: 4,
            particleTexture: textureLoader.load(gAppPath + "spikey.png"),
            sizeBase: 10.0,
            sizeSpread: 2.0,
            colorBase: new THREE__namespace.Vector3(0.15, 1.0, 0.9),
            colorSpread: new THREE__namespace.Vector3(0.0, 0.0, 0.2),
            opacityBase: 1,
            particlesPerSecond: 1000,
            particleDeathAge: 60.0,
            emitterDeathAge: 0.1
        },
        //雾霾
        haze: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 50, 0),
            positionSpread: new THREE__namespace.Vector3(400, 100, 400),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, 0, 0),
            velocitySpread: new THREE__namespace.Vector3(100.5, 0.5, 100.5),
            angleBase: 0,
            angleSpread: 0,
            angleVelocityBase: 0,
            angleVelocitySpread: 4,
            particleTexture: textureLoader.load(gAppPath + "smoke512.png"),
            sizeBase: 1000.0,
            sizeSpread: 2.0,
            colorBase: new THREE__namespace.Vector3(0.15, 1.0, 0),
            colorSpread: new THREE__namespace.Vector3(0.0, 0.0, 0.2),
            opacityBase: 0.15,
            particlesPerSecond: 1000,
            particleDeathAge: 60.0,
            emitterDeathAge: 0.1
        },
        fireflies: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 100, 0),
            positionSpread: new THREE__namespace.Vector3(400, 200, 400),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, 0, 0),
            velocitySpread: new THREE__namespace.Vector3(60, 20, 60),
            particleTexture: textureLoader.load(gAppPath + "spark.png"),
            sizeBase: 30.0,
            sizeSpread: 10.0,
            opacityTween: new Tween([0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1], [0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2]),
            colorBase: new THREE__namespace.Vector3(0.3, 1.0, 0.6),
            colorSpread: new THREE__namespace.Vector3(0.3, 0.0, 0.0),
            particlesPerSecond: 20,
            particleDeathAge: 6.1,
            emitterDeathAge: 600
        },
        startunnel: {
            positionStyle: Type.CUBE,
            positionBase: new THREE__namespace.Vector3(0, 0, 0),
            positionSpread: new THREE__namespace.Vector3(10, 10, 10),
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, 100, 200),
            velocitySpread: new THREE__namespace.Vector3(40, 40, 80),
            angleBase: 0,
            angleSpread: 720,
            angleVelocityBase: 10,
            angleVelocitySpread: 0,
            particleTexture: textureLoader.load(gAppPath + "spikey.png"),
            sizeBase: 4.0,
            sizeSpread: 2.0,
            colorBase: new THREE__namespace.Vector3(0.15, 1.0, 0.8),
            opacityBase: 1,
            blendStyle: THREE__namespace.AdditiveBlending,
            particlesPerSecond: 500,
            particleDeathAge: 4.0,
            emitterDeathAge: 60
        },
        firework: {
            positionStyle: Type.SPHERE,
            positionBase: new THREE__namespace.Vector3(0, 100, 0),
            positionRadius: 10,
            velocityStyle: Type.SPHERE,
            speedBase: 90,
            speedSpread: 10,
            accelerationBase: new THREE__namespace.Vector3(0, -80, 0),
            particleTexture: textureLoader.load(gAppPath + "spark.png"),
            sizeTween: new Tween([0.5, 0.7, 1.3], [5, 40, 1]),
            opacityTween: new Tween([0.2, 0.7, 2.5], [0.75, 1, 0]),
            colorTween: new Tween([0.4, 0.8, 1.0], [
                new THREE__namespace.Vector3(0, 1, 1),
                new THREE__namespace.Vector3(0, 1, 0.6),
                new THREE__namespace.Vector3(0.8, 1, 0.6),
            ]),
            blendStyle: THREE__namespace.AdditiveBlending,
            particlesPerSecond: 3000,
            particleDeathAge: 2.5,
            emitterDeathAge: 0.2
        },
        candle: {
            positionStyle: Type.SPHERE,
            positionBase: new THREE__namespace.Vector3(0, 50, 0),
            positionRadius: 2,
            velocityStyle: Type.CUBE,
            velocityBase: new THREE__namespace.Vector3(0, 30, 0),
            velocitySpread: new THREE__namespace.Vector3(15, 30, 15),
            speedBase: 10,
            speedSpread: 10,
            particleTexture: textureLoader.load(gAppPath + "smokeparticle.png"),
            sizeTween: new Tween([10, 10.3, 10.2], [30, 15, 10]),
            opacityTween: new Tween([0.9, 1.5], [1, 0]),
            colorTween: new Tween([0.5, 1.0], [new THREE__namespace.Vector3(0.02, 1, 0.5), new THREE__namespace.Vector3(0.05, 1, 0)]),
            blendStyle: THREE__namespace.AdditiveBlending,
            particlesPerSecond: 150,
            particleDeathAge: 1,
            emitterDeathAge: 10
        }
    };

    var Fog = /** @class */ (function () {
        function Fog(scene) {
            this.scene = scene;
        }
        Fog.prototype.initFog = function (color, near, far) {
            this.scene.fog = new THREE.Fog(color, near, far);
        };
        Fog.prototype.initFogExp = function (color, density) {
            this.scene.fog = new THREE.FogExp2(color, density);
        };
        return Fog;
    }());

    /**
     * Work based on :
     * https://github.com/Slayvin: Flat mirror for three.js
     * https://home.adelphi.edu/~stemkoski/ : An implementation of water shader based on the flat mirror
     * http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
     */
    var Water$1 = /** @class */ (function (_super) {
        __extends(Water, _super);
        function Water(geometry, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, geometry) || this;
            _this.isWater = true;
            var scope = _this;
            var textureWidth = options.textureWidth !== undefined ? options.textureWidth : 512;
            var textureHeight = options.textureHeight !== undefined ? options.textureHeight : 512;
            var clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;
            var alpha = options.alpha !== undefined ? options.alpha : 1;
            var time = options.time !== undefined ? options.time : 0.0;
            var normalSampler = options.waterNormals !== undefined ? options.waterNormals : null;
            var sunDirection = options.sunDirection !== undefined
                ? options.sunDirection
                : new THREE.Vector3(0.70707, 0.70707, 0.0);
            var sunColor = new THREE.Color(options.sunColor !== undefined ? options.sunColor : 0xffffff);
            var waterColor = new THREE.Color(options.waterColor !== undefined ? options.waterColor : 0x7f7f7f);
            var eye = options.eye !== undefined ? options.eye : new THREE.Vector3(0, 0, 0);
            var distortionScale = options.distortionScale !== undefined ? options.distortionScale : 20.0;
            var side = options.side !== undefined ? options.side : THREE.FrontSide;
            var fog = options.fog !== undefined ? options.fog : false;
            //
            var mirrorPlane = new THREE.Plane();
            var normal = new THREE.Vector3();
            var mirrorWorldPosition = new THREE.Vector3();
            var cameraWorldPosition = new THREE.Vector3();
            var rotationMatrix = new THREE.Matrix4();
            var lookAtPosition = new THREE.Vector3(0, 0, -1);
            var clipPlane = new THREE.Vector4();
            var view = new THREE.Vector3();
            var target = new THREE.Vector3();
            var q = new THREE.Vector4();
            var textureMatrix = new THREE.Matrix4();
            var mirrorCamera = new THREE.PerspectiveCamera();
            var renderTarget = new THREE.WebGLRenderTarget(textureWidth, textureHeight);
            var mirrorShader = {
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib["fog"],
                    THREE.UniformsLib["lights"],
                    {
                        normalSampler: { value: null },
                        mirrorSampler: { value: null },
                        alpha: { value: 1.0 },
                        time: { value: 0.0 },
                        size: { value: 2.0 },
                        distortionScale: { value: 20.0 },
                        textureMatrix: { value: new THREE.Matrix4() },
                        sunColor: { value: new THREE.Color(0xffffff) },
                        sunDirection: { value: new THREE.Vector3(0.70707, 0.70707, 0) },
                        eye: { value: new THREE.Vector3() },
                        waterColor: { value: new THREE.Color(0x555555) }
                    },
                ]),
                vertexShader: /* glsl */ "\n\t\t\t\tuniform mat4 textureMatrix;\n\t\t\t\tuniform float time;\n\n\t\t\t\tvarying vec4 mirrorCoord;\n\t\t\t\tvarying vec4 worldPosition;\n\n\t\t\t\t#include <common>\n\t\t\t\t#include <fog_pars_vertex>\n\t\t\t\t#include <shadowmap_pars_vertex>\n\t\t\t\t#include <logdepthbuf_pars_vertex>\n\n\t\t\t\tvoid main() {\n\t\t\t\t\tmirrorCoord = modelMatrix * vec4( position, 1.0 );\n\t\t\t\t\tworldPosition = mirrorCoord.xyzw;\n\t\t\t\t\tmirrorCoord = textureMatrix * mirrorCoord;\n\t\t\t\t\tvec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t\tgl_Position = projectionMatrix * mvPosition;\n\n\t\t\t\t#include <beginnormal_vertex>\n\t\t\t\t#include <defaultnormal_vertex>\n\t\t\t\t#include <logdepthbuf_vertex>\n\t\t\t\t#include <fog_vertex>\n\t\t\t\t#include <shadowmap_vertex>\n\t\t\t}",
                fragmentShader: /* glsl */ "\n\t\t\t\tuniform sampler2D mirrorSampler;\n\t\t\t\tuniform float alpha;\n\t\t\t\tuniform float time;\n\t\t\t\tuniform float size;\n\t\t\t\tuniform float distortionScale;\n\t\t\t\tuniform sampler2D normalSampler;\n\t\t\t\tuniform vec3 sunColor;\n\t\t\t\tuniform vec3 sunDirection;\n\t\t\t\tuniform vec3 eye;\n\t\t\t\tuniform vec3 waterColor;\n\n\t\t\t\tvarying vec4 mirrorCoord;\n\t\t\t\tvarying vec4 worldPosition;\n\n\t\t\t\tvec4 getNoise( vec2 uv ) {\n\t\t\t\t\tvec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);\n\t\t\t\t\tvec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );\n\t\t\t\t\tvec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );\n\t\t\t\t\tvec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );\n\t\t\t\t\tvec4 noise = texture2D( normalSampler, uv0 ) +\n\t\t\t\t\t\ttexture2D( normalSampler, uv1 ) +\n\t\t\t\t\t\ttexture2D( normalSampler, uv2 ) +\n\t\t\t\t\t\ttexture2D( normalSampler, uv3 );\n\t\t\t\t\treturn noise * 0.5 - 1.0;\n\t\t\t\t}\n\n\t\t\t\tvoid sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {\n\t\t\t\t\tvec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );\n\t\t\t\t\tfloat direction = max( 0.0, dot( eyeDirection, reflection ) );\n\t\t\t\t\tspecularColor += pow( direction, shiny ) * sunColor * spec;\n\t\t\t\t\tdiffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;\n\t\t\t\t}\n\n\t\t\t\t#include <common>\n\t\t\t\t#include <packing>\n\t\t\t\t#include <bsdfs>\n\t\t\t\t#include <fog_pars_fragment>\n\t\t\t\t#include <logdepthbuf_pars_fragment>\n\t\t\t\t#include <lights_pars_begin>\n\t\t\t\t#include <shadowmap_pars_fragment>\n\t\t\t\t#include <shadowmask_pars_fragment>\n\n\t\t\t\tvoid main() {\n\n\t\t\t\t\t#include <logdepthbuf_fragment>\n\t\t\t\t\tvec4 noise = getNoise( worldPosition.xz * size );\n\t\t\t\t\tvec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );\n\n\t\t\t\t\tvec3 diffuseLight = vec3(0.0);\n\t\t\t\t\tvec3 specularLight = vec3(0.0);\n\n\t\t\t\t\tvec3 worldToEye = eye-worldPosition.xyz;\n\t\t\t\t\tvec3 eyeDirection = normalize( worldToEye );\n\t\t\t\t\tsunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );\n\n\t\t\t\t\tfloat distance = length(worldToEye);\n\n\t\t\t\t\tvec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;\n\t\t\t\t\tvec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );\n\n\t\t\t\t\tfloat theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );\n\t\t\t\t\tfloat rf0 = 0.3;\n\t\t\t\t\tfloat reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );\n\t\t\t\t\tvec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;\n\t\t\t\t\tvec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);\n\t\t\t\t\tvec3 outgoingLight = albedo;\n\t\t\t\t\tgl_FragColor = vec4( outgoingLight, alpha );\n\n\t\t\t\t\t#include <tonemapping_fragment>\n\t\t\t\t\t#include <fog_fragment>\n\t\t\t\t}"
            };
            var material = new THREE.ShaderMaterial({
                fragmentShader: mirrorShader.fragmentShader,
                vertexShader: mirrorShader.vertexShader,
                uniforms: THREE.UniformsUtils.clone(mirrorShader.uniforms),
                lights: true,
                side: side,
                fog: fog
            });
            material.uniforms["mirrorSampler"].value = renderTarget.texture;
            material.uniforms["textureMatrix"].value = textureMatrix;
            material.uniforms["alpha"].value = alpha;
            material.uniforms["time"].value = time;
            material.uniforms["normalSampler"].value = normalSampler;
            material.uniforms["sunColor"].value = sunColor;
            material.uniforms["waterColor"].value = waterColor;
            material.uniforms["sunDirection"].value = sunDirection;
            material.uniforms["distortionScale"].value = distortionScale;
            material.uniforms["eye"].value = eye;
            _this.material = material;
            scope.material = material;
            scope.onBeforeRender = function (renderer, scene, camera) {
                mirrorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
                cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
                rotationMatrix.extractRotation(scope.matrixWorld);
                normal.set(0, 0, 1);
                normal.applyMatrix4(rotationMatrix);
                view.subVectors(mirrorWorldPosition, cameraWorldPosition);
                // Avoid rendering when mirror is facing away
                if (view.dot(normal) > 0)
                    return;
                view.reflect(normal).negate();
                view.add(mirrorWorldPosition);
                rotationMatrix.extractRotation(camera.matrixWorld);
                lookAtPosition.set(0, 0, -1);
                lookAtPosition.applyMatrix4(rotationMatrix);
                lookAtPosition.add(cameraWorldPosition);
                target.subVectors(mirrorWorldPosition, lookAtPosition);
                target.reflect(normal).negate();
                target.add(mirrorWorldPosition);
                mirrorCamera.position.copy(view);
                mirrorCamera.up.set(0, 1, 0);
                mirrorCamera.up.applyMatrix4(rotationMatrix);
                mirrorCamera.up.reflect(normal);
                mirrorCamera.lookAt(target);
                mirrorCamera.far = camera.far; // Used in WebGLBackground
                mirrorCamera.updateMatrixWorld();
                mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);
                // Update the texture matrix
                textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
                textureMatrix.multiply(mirrorCamera.projectionMatrix);
                textureMatrix.multiply(mirrorCamera.matrixWorldInverse);
                // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
                // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
                mirrorPlane.setFromNormalAndCoplanarPoint(normal, mirrorWorldPosition);
                mirrorPlane.applyMatrix4(mirrorCamera.matrixWorldInverse);
                clipPlane.set(mirrorPlane.normal.x, mirrorPlane.normal.y, mirrorPlane.normal.z, mirrorPlane.constant);
                var projectionMatrix = mirrorCamera.projectionMatrix;
                q.x =
                    (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
                        projectionMatrix.elements[0];
                q.y =
                    (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
                        projectionMatrix.elements[5];
                q.z = -1.0;
                q.w =
                    (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
                // Calculate the scaled plane vector
                clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
                // Replacing the third row of the projection matrix
                projectionMatrix.elements[2] = clipPlane.x;
                projectionMatrix.elements[6] = clipPlane.y;
                projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
                projectionMatrix.elements[14] = clipPlane.w;
                eye.setFromMatrixPosition(camera.matrixWorld);
                // Render
                var currentRenderTarget = renderer.getRenderTarget();
                var currentXrEnabled = renderer.xr.enabled;
                var currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
                scope.visible = false;
                renderer.xr.enabled = false; // Avoid camera modification and recursion
                renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
                renderer.setRenderTarget(renderTarget);
                renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897
                if (renderer.autoClear === false)
                    renderer.clear();
                renderer.render(scene, mirrorCamera);
                scope.visible = true;
                renderer.xr.enabled = currentXrEnabled;
                renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
                renderer.setRenderTarget(currentRenderTarget);
                // Restore viewport
                var viewport = camera.viewport;
                if (viewport !== undefined) {
                    renderer.state.viewport(viewport);
                }
            };
            return _this;
        }
        return Water;
    }(THREE.Mesh));
    ({
        uniforms: {
            iTime: {
                value: 0
            },
            iResolution: {
                value: new THREE.Vector3(1, 1, 1)
            }
        },
        vertexShader: "\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }\n\n  ",
        fragmentShader: "\n  varying vec2 vUv;\n  uniform vec3      iResolution;           // viewport iResolution (in pixels)\n  uniform float     iTime;    \n  float det=.001, br=0., tub=0., hit=0.;\n  vec3 pos, sphpos;\n  mat3 lookat(vec3 dir, vec3 up) {\n    vec3 rt=normalize(cross(dir,up));\n    return mat3(rt,cross(rt,dir),dir);\n  }\n  vec3 path(float t) {\n    return vec3(sin(t+cos(t)*.5)*.5,cos(t*.5),t);\n  }\n  mat2 rot(float a) {\n    float s=sin(a);\n    float c=cos(a);\n    return mat2(c,s,-s,c);\n  }\n  vec3 fractal(vec2 p) {\n    p=fract(p*.1);\n    float m=1000.;\n    for (int i=0; i<7; i++) {\n      p=abs(p)/clamp(abs(p.x*p.y),.25,2.)-1.2;\n      m=min(m,abs(p.y)+fract(p.x*.3+iTime*.5+float(i)*.25));\n    }\n    m=exp(-6.*m);\n    return m*vec3(abs(p.x),m,abs(p.y));\n  }\n  \n  float coso(vec3 pp) {\n    pp*=.7;\n    pp.xy*=rot(pp.z*2.);\n    pp.xz*=rot(iTime*2.);\n    pp.yz*=rot(iTime);\n    float sph=length(pp)-.04;\n    sph-=length(sin(pp*40.))*.05;\n    sph=max(sph,-length(pp)+.11);\n    float br2=length(pp)-.03;\n    br2=min(br2,length(pp.xy)+.005);\n    br2=min(br2,length(pp.xz)+.005);\n    br2=min(br2,length(pp.yz)+.005);\n    br2=max(br2,length(pp)-1.);\n    br=min(br2,br);\n    float d=min(br,sph);\n    return d;\n  }\n  \n  \n  float de(vec3 p) {\n    hit=0.;\n    br=1000.;\n    vec3 pp=p-sphpos;\n    p.xy-=path(p.z).xy;\n    p.xy*=rot(p.z+iTime*.5);\n    float s=sin(p.z*.5+iTime*.5);\n    p.xy*=1.3-s*s*.7;\n    \n    for(int i=0; i<6; i++) {\n      p=abs(p)-.4;\n    }\n    pos=p;\n    tub=-length(p.xy)+.45+sin(p.z*10.)*.1*smoothstep(.4,.5,abs(.5-fract(p.z*.05))*2.);\n    float co=coso(pp);\n    co=min(co,coso(pp+.7));\n    co=min(co,coso(pp-.7));\n    float d=min(tub,co);\n    if (d==tub) hit=step(fract(.1*length(sin(p*10.))),.05);\n    return d*.3;\n  }\n  \n  vec3 march(vec3 from, vec3 dir) {\n    vec2 uv=vec2(atan(dir.x,dir.y)+iTime*.5,length(dir.xy)+sin(iTime*.2));\n    vec3 col=fractal(uv);\n    float d=0.,td=0.,g=0., ref=0., ltd=0., li=0.;\n    vec3 p=from;\n    for (int i=0; i<200; i++) {\n      p+=dir*d;\n      d=de(p);\n      if (d<det && ref==0. && hit==1.) {\n        vec2 e=vec2(0.,.1);\n        vec3 n=normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));\n        p-=dir*d*2.;\n        dir=reflect(dir,n);\n        ref=1.;\n        td=0.;\n        ltd=td;\n        continue;\n      }\n      if (d<det || td>5.) break;\n      td+=d;\n      g+=.1/(.1+br*13.);\n      li+=.1/(.1+tub*5.);\n    }\n    g=max(g,li*.15);\n    float f=1.-td/3.;\n    if (ref==1.) f=1.-ltd/3.;\n    if (d<.01) {\n      col=vec3(1.);\n      vec2 e=vec2(0.,det);\n      vec3 n=normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));\n      col=vec3(n.x)*.7;\n      col+=fract(pos.z*5.)*vec3(.2,.1,.5);\n      col+=fractal(pos.xz*2.);\n      if (tub>.01) col=vec3(0.);\n    }\n    col*=f;\n    vec3 glo=g*.1*vec3(2.,1.,2.)*(.5+fract(sin(iTime)*123.456)*1.5)*.5;\n    glo.rb*=rot(dir.y*1.5);\n    col+=glo;\n    col*=vec3(.8,.7,.7);\n    col=mix(col,vec3(1.),ref*.3);\n    return col;\n  }\n  \n  void main( )\n  {\n    vec2 uv = vec2(vUv.x / iResolution.x, vUv.y / iResolution.y);\n    uv -= 0.5;\n    uv /= vec2(iResolution.y / iResolution.x, 1);\n    float t=iTime;\n    vec3 from= path(t);\n    if (mod(iTime,10.)>5.) from=path(floor(t/4.+.5)*4.);\n    sphpos=path(t+.5);\n    from.x+=.2;\n    vec3 fw=normalize(path(t+.5)-from);\n    vec3 dir=normalize(vec3(uv,.5));\n    dir=lookat(fw,vec3(fw.x*2.,1.,0.))*dir;\n    dir.xz+=sin(iTime)*.3;\n    vec3 col=march(from,dir);\n    col=mix(vec3(.5)*length(col),col,.8);\n    gl_FragColor =vec4(col,1.);\n  }\n    "
    });

    var Water = /** @class */ (function () {
        function Water(options) {
            this.radius = options.radius;
            this.textureWidth = options.textureWidth;
            this.textureHeight = options.textureHeight;
            this.sunPosition = options.sunPosition;
            this.sunColor = options.sunColor;
            this.waterColor = options.waterColor;
            this.distortionScale = options.distortionScale;
            this.waterPosition = options.waterPosition;
            this.time = options.time;
            this.texture = options.texture;
            this.scene = options.scene;
            this.animate = options.animate;
        }
        Water.prototype.init = function () {
            var _this = this;
            this.water = new Water$1(new THREE.CircleGeometry(this.radius, 32), {
                textureWidth: this.textureWidth,
                textureHeight: this.textureHeight,
                waterNormals: this.texture,
                sunDirection: this.sunPosition,
                sunColor: this.sunColor,
                waterColor: this.waterColor,
                distortionScale: this.distortionScale,
                fog: this.scene.fog !== undefined
            });
            this.water.rotation.x = -Math.PI / 2;
            this.water.position.copy(this.waterPosition);
            this.scene.add(this.water);
            this.animate.push(function () {
                _this.water.material.uniforms["time"].value += _this.time;
            });
        };
        Water.prototype.destroy = function () {
            this.scene.remove(this.water);
        };
        return Water;
    }());

    var MAP_NAMES = [
        "map",
        "aoMap",
        "emissiveMap",
        "glossinessMap",
        "metalnessMap",
        "normalMap",
        "roughnessMap",
        "specularMap",
    ];
    function traverseMaterials(object, callback) {
        object.traverse(function (node) {
            if (!node.isMesh)
                return;
            var materials = Array.isArray(node.material)
                ? node.material
                : [node.material];
            materials.forEach(callback);
        });
    }
    var Viewer = /** @class */ (function (_super) {
        __extends(Viewer, _super);
        function Viewer(options) {
            var _this = _super.call(this, options) || this;
            _this.createScene();
            _this.initAnimate();
            _this.initRender();
            _this.initControls();
            _this.initAmbient();
            return _this;
        }
        /*
         *@description: 创建场景
         *@author: yangj
         *@date: 2023-03-04 09:34:41
         *@return:
         */
        Viewer.prototype.createScene = function () {
            for (var i = 0; i < 15; i++) {
                this.gStatus[i] = false;
                var scene = new THREE.Scene();
                var mainGroup = new THREE.Group();
                //环境对象群
                var AMGroup = new THREE.Group();
                //Ray拾取对象群
                var RayGrop = new THREE.Group();
                mainGroup.add(AMGroup, RayGrop);
                scene.add(mainGroup);
                this.gScenes.push(scene);
                this.gAmGroup.push(AMGroup);
                this.gRayGroup.push(RayGrop);
            }
            this.scene = this.gScenes[this.sceneidx]; //当前场景
            this.cameraClass = new Camera(this.options.el);
            this.activeCamera = this.cameraClass.camera; //激活相机
            this.scene.add(this.activeCamera);
        };
        /*
         *@description: 初始化帧动画
         *@author: yangj
         *@date: 2023-03-04 12:56:30
         *@return:
         */
        Viewer.prototype.initAnimate = function () {
            this.animate = new Animate({
                clock: this.clock
            });
        };
        /*
         *@description: 天空盒子
         *@author: yangj
         *@date: 2023-03-04 17:23:13
         *@return:
         */
        Viewer.prototype.initSky = function () {
            this.sky = new Sky({
                gScenes: this.gScenes,
                path: this.options.path,
                sceneidx: this.sceneidx
            });
        };
        /*
         *@description: 环境贴图
         *@author: yangj
         *@date: 2023-03-04 20:43:33
         *@return:
         */
        Viewer.prototype.initEnvironment = function (environment) {
            this.environment = new Environment({
                renderer: this.renderer,
                path: this.options.path,
                scene: this.gScenes[this.sceneidx],
                environment: environment
            });
            this.environment.init();
        };
        /*
         *@description: 事件
         *@author: yangj
         *@date: 2023-03-04 21:03:26
         *@return:
         */
        Viewer.prototype.initEvent = function (types) {
            this.event = new Event({
                types: types,
                el: this.options.el,
                camera: this.activeCamera,
                scene: this.gRayGroup[this.sceneidx]
            });
            this.event.init();
        };
        /*
         *@description:渲染
         *@author: yangj
         *@date: 2023-03-04 10:53:31
         *@return:
         */
        Viewer.prototype.initRender = function () {
            var _this = this;
            var _a;
            this.renderer = new Renderer(this.options.el).renderer;
            this.options.el.appendChild(this.renderer.domElement);
            (_a = this.animate) === null || _a === void 0 ? void 0 : _a.animateFuntion.push(function () {
                _this.options.tween.update();
                _this.renderer.render(_this.scene, _this.activeCamera);
            });
        };
        /*
         *@description: 控制器
         *@author: yangj
         *@date: 2023-03-04 12:36:24
         *@return:
         */
        Viewer.prototype.initControls = function () {
            var _this = this;
            var _a;
            this.controls = new Control({
                camera: this.activeCamera,
                renderer: this.renderer,
                scene: this.gScenes
            });
            (_a = this.animate) === null || _a === void 0 ? void 0 : _a.animateFuntion.push(function (delta) {
                !_this.controls.orbitControls.enabled &&
                    _this.controls.orbitControls.update(delta);
            });
        };
        /*
         *@description: 初始化场景
         *@author: yangj
         *@date: 2023-03-04 13:52:01
         *@return:
         */
        Viewer.prototype.initModel = function () {
            this.model = new Model({
                gScenes: this.gScenes,
                gStatus: this.gStatus,
                gAmGroup: this.gAmGroup,
                gRayGroup: this.gRayGroup,
                baseURL: this.options.path,
                bus: this.options.bus,
                animateFuntion: this.animate.animateFuntion
            });
        };
        /*
         *@description: 环境光
         *@author: yangj
         *@date: 2023-03-04 16:53:53
         *@return:
         */
        Viewer.prototype.initAmbient = function () {
            this.ambient = new Ambient({
                scene: this.gScenes[this.sceneidx],
                renderer: this.renderer
            });
            this.ambient.setLight(1.5, 1);
        };
        /*
         *@description: 半球光
         *@author: yangj
         *@date: 2023-03-18 13:40:17
         *@return:
         */
        Viewer.prototype.initSkyLight = function (skyColor, earthColor, intensity) {
            this.hemisphereLight = new SkyLight(this.scene);
            this.hemisphereLight.init(skyColor, earthColor, intensity);
        };
        /*
         *@description: 平行光
         *@author: yangj
         *@date: 2023-03-18 16:07:02
         *@return:
         */
        Viewer.prototype.initDirectional = function (color, intensity) {
            this.directional = new Directional(this.scene);
            this.directional.init(color, intensity);
        };
        /*
         *@description: 点光源
         *@author: yangj
         *@date: 2023-03-18 16:39:38
         *@return:
         */
        Viewer.prototype.initPointLight = function (color, intensity, distance, decay) {
            var pointLight = new PointLight(this.scene);
            pointLight.init(color, intensity, distance, decay);
            this.pointGroup.push(pointLight);
            return this.pointGroup.length - 1;
        };
        /*
         *@description: 聚光
         *@author: yangj
         *@date: 2023-03-18 17:13:57
         *@return:
         */
        Viewer.prototype.initSpotLight = function (color, intensity, distance, target) {
            this.spotLight = new SpotLight(this.scene);
            this.spotLight.init(color, intensity, distance, target);
        };
        /*
         *@description: 单个区域光
         *@author: yangj
         *@date: 2023-03-18 18:50:36
         *@return:
         */
        Viewer.prototype.initRectArea = function (color, width, height, intensity) {
            this.rectAreaLight = new RectArea(this.scene);
            this.rectAreaLight.init(color, width, height, intensity);
        };
        /*
         *@description: 矩形区域光
         *@author: yangj
         *@date: 2023-03-18 18:54:21
         *@return:
         */
        Viewer.prototype.initRectAreaBox = function (color, width, intensity, position) {
            this.rectAreaLight = new RectArea(this.scene);
            this.rectAreaLight.initArea(color, width, intensity, position);
        };
        /*
         *@description: 雾
         *@author: yangj
         *@date: 2023-03-16 20:48:43
         *@return:
         */
        Viewer.prototype.initFog = function () {
            this.fog = new Fog(this.scene);
        };
        /*
         *@description: water
         *@author: yangj
         *@date: 2023-03-17 15:37:39
         *@return:
         */
        Viewer.prototype.initWater = function (options) {
            this.water = new Water(__assign(__assign({}, options), { animate: this.animate.animateFuntion }));
            this.water.init();
        };
        /*
         *@description: 资源加载类
         *@author: yangj
         *@date: 2023-03-09 17:14:40
         *@return:
         */
        Viewer.prototype.initSource = function () {
            this.souce = new Source();
        };
        /*
         *@description: 粒子
         *@author: yangj
         *@date: 2023-03-09 20:34:11
         *@return:
         */
        Viewer.prototype.loadSprite = function (_a) {
            var texture = _a.texture, name = _a.name;
            var sprite = new Sprite();
            sprite.init({
                texture: texture,
                name: name
            });
            this.spriteGroup.push(sprite);
            return sprite;
        };
        /*
         *@description: 巡检
         *@author: yangj
         *@date: 2023-03-10 15:42:52
         *@return:
         */
        Viewer.prototype.initParade = function (params) {
            this.parade = new Parade(params);
        };
        /*
         *@description: 粒子系统
         *@author: yangj
         *@date: 2023-03-15 15:58:00
         *@return:
         */
        Viewer.prototype.initParticleEngine = function (particle, mugen) {
            particle = new ParticleEngine({
                scene: this.gScenes[this.sceneidx],
                mugen: mugen
            });
            this.animate.animateFuntion.push(function (dt) {
                if (particle.start)
                    particle.update(dt);
            });
            return particle;
        };
        /*
         *@description: 粒子过渡函数
         *@author: yangj
         *@date: 2023-03-15 22:11:54
         *@return:
         */
        Viewer.prototype.getParticleTween = function (times, values) {
            return new Tween(times, values);
        };
        /*
         *@description: 设置粒子模式
         *@author: yangj
         *@date: 2023-03-15 16:07:32
         *@return:
         */
        Viewer.prototype.setParticleMode = function (particle, key, ParticleExamplesParams) {
            particle.setValues(Examples[key], ParticleExamplesParams);
            particle.initialize(this.scene);
        };
        /*
         *@description: 加载场景
         *@author: yangj
         *@date: 2023-03-04 13:37:42
         *@return:
         */
        Viewer.prototype.setScene = function (index, callback) {
            var _this = this;
            this.sceneidx = index;
            this.scene = this.gScenes[index];
            this.controls.transformControls && this.controls.transformControls.detach(); // 先释放持有物
            this.scene.updateMatrix();
            if (!this.gStatus[index]) {
                this.model &&
                    this.model.load(index, function () {
                        callback instanceof Function && callback();
                    });
                this.controls.transformControls &&
                    this.scene.add(this.controls.transformControls);
                this.initAmbient();
            }
            else {
                this.options.bus.emit("scene", {
                    type: "transition",
                    value: true
                });
                setTimeout(function () {
                    _this.options.bus.emit("scene", {
                        type: "transition",
                        value: false
                    });
                    callback instanceof Function && callback();
                }, 1500);
            }
        };
        /*
         *@description: 相机飞行
         *@author: yangj
         *@date: 2023-03-04 13:44:00
         *@return:
         */
        Viewer.prototype.flyTo = function (option) {
            var _a;
            (_a = this.cameraClass) === null || _a === void 0 ? void 0 : _a.flyTo(this.options.tween, this.controls, option);
        };
        /*
         *@description: 销毁场景
         *@author: yangj
         *@date: 2023-03-05 14:08:07
         *@return:
         */
        Viewer.prototype.destroy = function () {
            var _a, _b;
            if ((_a = this.animate) === null || _a === void 0 ? void 0 : _a.frameId)
                cancelAnimationFrame((_b = this.animate) === null || _b === void 0 ? void 0 : _b.frameId); //销毁requestAnimationFrame
            this.scene.traverse(function (child) {
                var _a;
                child.userData = {};
                if (((_a = child.material) === null || _a === void 0 ? void 0 : _a.dispose) &&
                    typeof child.material.dispose === "function") {
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
                child = null;
            });
            this.options.tween.removeAll();
            this.renderer.forceContextLoss(); //销毁context
            traverseMaterials(this.scene, function (material) {
                MAP_NAMES.forEach(function (map) {
                    if (material[map])
                        material[map].dispose();
                });
            });
            console.log("gapp.scene:", this.renderer.info);
            this.renderer = null;
            this.scene = null;
            this.activeCamera = null;
            THREE.Cache.clear();
        };
        return Viewer;
    }(Params));

    exports.Viewer = Viewer;

}));