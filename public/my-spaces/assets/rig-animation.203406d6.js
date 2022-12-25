const D = function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s);
  new MutationObserver((s) => {
    for (const n of s)
      if (n.type === 'childList')
        for (const a of n.addedNodes)
          a.tagName === 'LINK' && a.rel === 'modulepreload' && i(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(s) {
    const n = {};
    return (
      s.integrity && (n.integrity = s.integrity),
      s.referrerpolicy && (n.referrerPolicy = s.referrerpolicy),
      s.crossorigin === 'use-credentials'
        ? (n.credentials = 'include')
        : s.crossorigin === 'anonymous'
        ? (n.credentials = 'omit')
        : (n.credentials = 'same-origin'),
      n
    );
  }
  function i(s) {
    if (s.ep) return;
    s.ep = !0;
    const n = o(s);
    fetch(s.href, n);
  }
};
D();
const L = Math.PI / 2;
AFRAME.registerComponent('my-look-controls', {
  dependencies: ['position', 'rotation'],
  schema: {
    enabled: { default: !0 },
    magicWindowTrackingEnabled: { default: !0 },
    pointerLockEnabled: { default: !1, type: 'boolean' },
    reverseMouseDrag: { default: !1 },
    reverseTouchDrag: { default: !1 },
    touchEnabled: { default: !0 },
    mouseEnabled: { default: !0 },
    initRotationY: { default: 0 },
    sitDirection: { default: 0 },
    isSitting: { default: !1 },
  },
  init: function () {
    (this.deltaYaw = 0),
      (this.previousHMDPosition = new THREE.Vector3()),
      (this.hmdQuaternion = new THREE.Quaternion()),
      (this.magicWindowAbsoluteEuler = new THREE.Euler()),
      (this.magicWindowDeltaEuler = new THREE.Euler()),
      (this.position = new THREE.Vector3()),
      (this.magicWindowObject = new THREE.Object3D()),
      (this.rotation = {}),
      (this.deltaRotation = {}),
      (this.savedPose = null),
      (this.pointerLocked = !1),
      this.setupMouseControls(this.data.initRotationY),
      this.bindMethods(),
      (this.previousMouseEvent = {}),
      this.setupMagicWindowControls(),
      (this.rig = document.querySelector('#cameraRig')),
      (this.camera = this.rig.querySelector('#camera')),
      (this.savedPose = {
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(),
      }),
      (this.el.sceneEl.is('vr-mode') || this.el.sceneEl.is('ar-mode')) &&
        this.onEnterVR();
    const t = this.onResize.bind(this);
    window.addEventListener('resize', t);
  },
  onResize: function () {
    E() && (this.pitchObject.rotation.x = Math.PI / 2);
  },
  setupMagicWindowControls: function () {
    var t,
      e = this.data;
    (E() || O()) &&
      ((t = this.magicWindowControls =
        new THREE.DeviceOrientationControls(this.magicWindowObject)),
      typeof DeviceOrientationEvent < 'u' &&
        DeviceOrientationEvent.requestPermission &&
        ((t.enabled = !1),
        this.el.sceneEl.components['device-orientation-permission-ui']
          .permissionGranted
          ? (t.enabled = e.magicWindowTrackingEnabled)
          : this.el.sceneEl.addEventListener(
              'deviceorientationpermissiongranted',
              function () {
                t.enabled = e.magicWindowTrackingEnabled;
              },
            )));
  },
  update: function (t) {
    var e = this.data,
      o = this.camera;
    if (
      (e.enabled !== t.enabled && this.updateGrabCursor(e.enabled),
      o && e.isSitting !== t.isSitting)
    ) {
      const { cameraPosition: i } = appConfig,
        s = e.isSitting ? i.y - 0.3 : i.y,
        n = e.isSitting ? i.z - 0.5 : i.z;
      o.object3D.position.setY(s), o.object3D.position.setZ(n);
    }
    t &&
      !e.magicWindowTrackingEnabled &&
      t.magicWindowTrackingEnabled &&
      (this.magicWindowAbsoluteEuler.set(0, 0, 0),
      this.magicWindowDeltaEuler.set(0, 0, 0)),
      this.magicWindowControls &&
        (this.magicWindowControls.enabled = e.magicWindowTrackingEnabled),
      t &&
        !e.pointerLockEnabled !== t.pointerLockEnabled &&
        (this.removeEventListeners(),
        this.addEventListeners(),
        this.pointerLocked && this.exitPointerLock());
  },
  tick: function (t) {
    var e = this.data;
    !e.enabled || this.updateOrientation();
  },
  play: function () {
    this.addEventListeners();
  },
  pause: function () {
    this.removeEventListeners(), this.pointerLocked && this.exitPointerLock();
  },
  remove: function () {
    this.removeEventListeners(), this.pointerLocked && this.exitPointerLock();
  },
  bindMethods: function () {
    (this.onMouseDown = c(this.onMouseDown, this)),
      (this.onMouseMove = c(this.onMouseMove, this)),
      (this.onMouseUp = c(this.onMouseUp, this)),
      (this.onTouchStart = c(this.onTouchStart, this)),
      (this.onTouchMove = c(this.onTouchMove, this)),
      (this.onTouchEnd = c(this.onTouchEnd, this)),
      (this.onEnterVR = c(this.onEnterVR, this)),
      (this.onExitVR = c(this.onExitVR, this)),
      (this.onPointerLockChange = c(this.onPointerLockChange, this)),
      (this.onPointerLockError = c(this.onPointerLockError, this));
  },
  setupMouseControls: function (t) {
    (this.mouseDown = !1),
      (this.pitchObject = new THREE.Object3D()),
      (this.yawObject = new THREE.Object3D()),
      (this.yawObject.rotation.y = t),
      (this.yawObject.position.y = 10),
      this.yawObject.add(this.pitchObject);
  },
  addEventListeners: function () {
    var t = this.el.sceneEl,
      e = t.canvas;
    if (!e) {
      t.addEventListener(
        'render-target-loaded',
        c(this.addEventListeners, this),
      );
      return;
    }
    e.addEventListener('mousedown', this.onMouseDown, !1),
      window.addEventListener('mousemove', this.onMouseMove, !1),
      window.addEventListener('mouseup', this.onMouseUp, !1),
      e.addEventListener('touchstart', this.onTouchStart),
      window.addEventListener('touchmove', this.onTouchMove),
      window.addEventListener('touchend', this.onTouchEnd),
      t.addEventListener('enter-vr', this.onEnterVR),
      t.addEventListener('exit-vr', this.onExitVR),
      this.data.pointerLockEnabled &&
        (document.addEventListener(
          'pointerlockchange',
          this.onPointerLockChange,
          !1,
        ),
        document.addEventListener(
          'mozpointerlockchange',
          this.onPointerLockChange,
          !1,
        ),
        document.addEventListener(
          'pointerlockerror',
          this.onPointerLockError,
          !1,
        ));
  },
  removeEventListeners: function () {
    var t = this.el.sceneEl,
      e = t && t.canvas;
    !e ||
      (e.removeEventListener('mousedown', this.onMouseDown),
      window.removeEventListener('mousemove', this.onMouseMove),
      window.removeEventListener('mouseup', this.onMouseUp),
      e.removeEventListener('touchstart', this.onTouchStart),
      window.removeEventListener('touchmove', this.onTouchMove),
      window.removeEventListener('touchend', this.onTouchEnd),
      t.removeEventListener('enter-vr', this.onEnterVR),
      t.removeEventListener('exit-vr', this.onExitVR),
      document.removeEventListener(
        'pointerlockchange',
        this.onPointerLockChange,
        !1,
      ),
      document.removeEventListener(
        'mozpointerlockchange',
        this.onPointerLockChange,
        !1,
      ),
      document.removeEventListener(
        'pointerlockerror',
        this.onPointerLockError,
        !1,
      ));
  },
  updateOrientation: function () {
    var t = this.el.object3D,
      e = this.pitchObject,
      o = this.yawObject,
      i = this.el.sceneEl;
    ((i.is('vr-mode') || i.is('ar-mode')) && i.checkHeadsetConnected()) ||
      (this.updateMagicWindowOrientation(),
      (t.rotation.x = this.magicWindowDeltaEuler.x + e.rotation.x),
      (t.rotation.z = this.magicWindowDeltaEuler.z),
      this.data.isSitting
        ? ((this.rig.object3D.rotation.y = this.data.sitDirection),
          (t.rotation.y = this.magicWindowDeltaEuler.y + o.rotation.y))
        : (this.rig.object3D.rotation.y =
            this.magicWindowDeltaEuler.y + o.rotation.y));
  },
  updateMagicWindowOrientation: function () {
    var t = this.magicWindowAbsoluteEuler,
      e = this.magicWindowDeltaEuler;
    this.magicWindowControls &&
      this.magicWindowControls.enabled &&
      (this.magicWindowControls.update(),
      t.setFromQuaternion(this.magicWindowObject.quaternion, 'YXZ'),
      !this.previousMagicWindowYaw &&
        t.y !== 0 &&
        (this.previousMagicWindowYaw = t.y),
      this.previousMagicWindowYaw &&
        ((e.x = t.x),
        (e.y += t.y - this.previousMagicWindowYaw),
        (e.z = t.z),
        (this.previousMagicWindowYaw = t.y)));
  },
  onMouseMove: function (t) {
    var e,
      o,
      i,
      s = this.pitchObject,
      n = this.previousMouseEvent,
      a = this.yawObject;
    !this.data.enabled ||
      (!this.mouseDown && !this.pointerLocked) ||
      (this.pointerLocked
        ? ((o = t.movementX || t.mozMovementX || 0),
          (i = t.movementY || t.mozMovementY || 0))
        : ((o = t.screenX - n.screenX), (i = t.screenY - n.screenY)),
      (this.previousMouseEvent.screenX = t.screenX),
      (this.previousMouseEvent.screenY = t.screenY),
      (e = this.data.reverseMouseDrag ? 1 : -1),
      (a.rotation.y += o * 0.002 * e),
      (s.rotation.x += i * 0.002 * e),
      (s.rotation.x = Math.max(-L, Math.min(L, s.rotation.x))));
  },
  onMouseDown: function (t) {
    var e = this.el.sceneEl;
    if (
      !(
        !this.data.enabled ||
        !this.data.mouseEnabled ||
        ((e.is('vr-mode') || e.is('ar-mode')) && e.checkHeadsetConnected())
      ) &&
      t.button === 0
    ) {
      var o = e && e.canvas;
      (this.mouseDown = !0),
        (this.previousMouseEvent.screenX = t.screenX),
        (this.previousMouseEvent.screenY = t.screenY),
        this.showGrabbingCursor(),
        this.data.pointerLockEnabled &&
          !this.pointerLocked &&
          (o.requestPointerLock
            ? o.requestPointerLock()
            : o.mozRequestPointerLock && o.mozRequestPointerLock());
    }
  },
  showGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = 'grabbing';
  },
  hideGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = '';
  },
  onMouseUp: function () {
    (this.mouseDown = !1), this.hideGrabbingCursor();
  },
  onTouchStart: function (t) {
    t.touches.length !== 1 ||
      !this.data.touchEnabled ||
      this.el.sceneEl.is('vr-mode') ||
      this.el.sceneEl.is('ar-mode') ||
      ((this.touchStart = { x: t.touches[0].pageX, y: t.touches[0].pageY }),
      (this.touchStarted = !0));
  },
  onTouchMove: function (t) {
    var e,
      o = this.el.sceneEl.canvas,
      i,
      s = this.yawObject;
    !this.touchStarted ||
      !this.data.touchEnabled ||
      ((i =
        (2 * Math.PI * (t.touches[0].pageX - this.touchStart.x)) /
        o.clientWidth),
      (e = this.data.reverseTouchDrag ? 1 : -1),
      (s.rotation.y -= i * 0.5 * e),
      (this.touchStart = { x: t.touches[0].pageX, y: t.touches[0].pageY }));
  },
  onTouchEnd: function () {
    this.touchStarted = !1;
  },
  onEnterVR: function () {
    var t = this.el.sceneEl;
    !t.checkHeadsetConnected() ||
      (this.saveCameraPose(),
      this.el.object3D.position.set(0, 0, 0),
      this.el.object3D.rotation.set(0, 0, 0),
      t.hasWebXR &&
        ((this.el.object3D.matrixAutoUpdate = !1),
        this.el.object3D.updateMatrix()));
  },
  onExitVR: function () {
    !this.el.sceneEl.checkHeadsetConnected() ||
      (this.restoreCameraPose(),
      this.previousHMDPosition.set(0, 0, 0),
      (this.el.object3D.matrixAutoUpdate = !0));
  },
  onPointerLockChange: function () {
    this.pointerLocked = !!(
      document.pointerLockElement || document.mozPointerLockElement
    );
  },
  onPointerLockError: function () {
    this.pointerLocked = !1;
  },
  exitPointerLock: function () {
    document.exitPointerLock(), (this.pointerLocked = !1);
  },
  updateGrabCursor: function (t) {
    var e = this.el.sceneEl;
    function o() {
      e.canvas.classList.add('a-grab-cursor');
    }
    function i() {
      e.canvas.classList.remove('a-grab-cursor');
    }
    if (!e.canvas) {
      t
        ? e.addEventListener('render-target-loaded', o)
        : e.addEventListener('render-target-loaded', i);
      return;
    }
    if (t) {
      o();
      return;
    }
    i();
  },
  saveCameraPose: function () {
    var t = this.el;
    this.savedPose.position.copy(t.object3D.position),
      this.savedPose.rotation.copy(t.object3D.rotation),
      (this.hasSavedPose = !0);
  },
  restoreCameraPose: function () {
    var t = this.el,
      e = this.savedPose;
    !this.hasSavedPose ||
      (t.object3D.position.copy(e.position),
      t.object3D.rotation.copy(e.rotation),
      (this.hasSavedPose = !1));
  },
});
function R() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}
function P(t) {
  var e = t || window.navigator.userAgent;
  return /ipad|Nexus (7|9)|xoom|sch-i800|playbook|tablet|kindle/i.test(e);
}
function T() {
  return /R7 Build/.test(window.navigator.userAgent);
}
var E = (function () {
  var t = !1;
  return (
    (function (e) {
      (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        e,
      ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          e.substr(0, 4),
        )) &&
        (t = !0),
        (R() || P() || T()) && (t = !0),
        x() && (t = !1);
    })(window.navigator.userAgent || window.navigator.vendor || window.opera),
    function () {
      return t;
    }
  );
})();
function C() {
  return /(OculusBrowser)/i.test(window.navigator.userAgent);
}
function x() {
  return C() || A();
}
function A() {
  return /(Mobile VR)/i.test(window.navigator.userAgent);
}
function O() {
  return !E() && !x() && window.orientation !== void 0;
}
function c(t, e) {
  return (function (o) {
    return function () {
      var s = o.concat(Array.prototype.slice.call(arguments, 0));
      return t.apply(e, s);
    };
  })(Array.prototype.slice.call(arguments, 2));
}
const j = '-controls',
  S = 0.2,
  W = 1e-5;
AFRAME.registerComponent('my-movement-controls', {
  dependencies: ['rotation'],
  schema: {
    enabled: { default: !0 },
    controls: { default: ['gamepad', 'trackpad', 'keyboard', 'touch'] },
    speed: { default: 0.125, min: 0 },
    fly: { default: !1 },
    constrainToNavMesh: { default: !1 },
    camera: { default: '[movement-controls] [camera]', type: 'selector' },
    gender: { default: 'm' },
    isSitting: { default: !1 },
  },
  init: function () {
    (this.avatar = document.querySelector('#avatar')),
      this.avatar.setAttribute(
        'rig-animation',
        `gender:${this.data.gender};clip:IDLE;loop:repeat;crossFadeDuration:0.2`,
      ),
      (this.isMoving = !1),
      (this.isRunning = !1),
      this.avatar || console.warn('Avatar not found');
    const t = this.el;
    this.data.camera || (this.data.camera = t.querySelector('[camera]')),
      (this.velocityCtrl = null),
      (this.velocity = new THREE.Vector3()),
      (this.heading = new THREE.Quaternion()),
      (this.navGroup = null),
      (this.navNode = null),
      t.sceneEl.hasLoaded
        ? this.injectControls()
        : t.sceneEl.addEventListener('loaded', this.injectControls.bind(this)),
      (this.handleTouch = (i) => {
        (this.isMoving = !0), this.usingTouch || (this.usingTouch = !0);
        const { screenX: s, screenY: n } = i.touches[0];
        (this.positionRaw = { x: s, y: n }),
          (this.startPositionRaw = this.startPositionRaw || this.positionRaw);
      }),
      (this.clearTouch = (i) => {
        (this.startPositionRaw = null), (this.isMoving = !1);
      }),
      window.addEventListener('touchstart', this.handleTouch),
      window.addEventListener('touchmove', this.handleTouch),
      window.addEventListener('touchend', this.clearTouch),
      document.getElementById('overlay'),
      (this.joystickParent = document.createElement('div')),
      this.joystickParent.classList.add(
        'joystick-container',
        'absolute-fill',
        'shadowed',
      ),
      (this.joystickPosition = document.createElement('div')),
      this.joystickPosition.classList.add('joystick', 'position'),
      this.joystickParent.appendChild(this.joystickPosition),
      (this.joystickOrigin = document.createElement('div')),
      this.joystickOrigin.classList.add('joystick', 'origin', 'visible'),
      this.joystickParent.appendChild(this.joystickOrigin);
    const e = (i) => {
        ['arrowup', 'w'].includes(i.key.toLowerCase()) && (this.fwd = !0),
          ['arrowdown', 's'].includes(i.key.toLowerCase()) && (this.back = !0),
          ['arrowleft', 'a'].includes(i.key.toLowerCase()) && (this.left = !0),
          ['arrowright', 'd'].includes(i.key.toLowerCase()) &&
            (this.right = !0),
          ['shift'].includes(i.key.toLowerCase()) && (this.isRunning = !0),
          this.usingKeyboard || (this.usingKeyboard = !0);
      },
      o = (i) => {
        ['arrowup', 'w'].includes(i.key.toLowerCase()) && (this.fwd = !1),
          ['arrowdown', 's'].includes(i.key.toLowerCase()) && (this.back = !1),
          ['arrowleft', 'a'].includes(i.key.toLowerCase()) && (this.left = !1),
          ['arrowright', 'd'].includes(i.key.toLowerCase()) &&
            (this.right = !1),
          ['shift'].includes(i.key.toLowerCase()) && (this.isRunning = !1);
      };
    window.addEventListener('keydown', e), window.addEventListener('keyup', o);
  },
  update: function (t) {
    const e = this.el,
      o = this.data,
      i = e.sceneEl.systems.nav;
    e.sceneEl.hasLoaded && this.injectControls(),
      i &&
        o.constrainToNavMesh !== t.constrainToNavMesh &&
        (o.constrainToNavMesh ? i.addAgent(this) : i.removeAgent(this));
  },
  injectControls: function () {
    const t = this.data;
    var e;
    for (let o = 0; o < t.controls.length; o++)
      (e = t.controls[o] + j),
        this.el.components[e] || this.el.setAttribute(e, '');
  },
  updateNavLocation: function () {
    (this.navGroup = null), (this.navNode = null);
  },
  tick: (function () {
    const t = new THREE.Vector3(),
      e = new THREE.Vector3(),
      o = new THREE.Vector3();
    let i = 0;
    return function (s, n) {
      if (!n) return;
      const a = this.el,
        d = this.data,
        l = this.avatar,
        p = d.camera;
      if (!d.enabled) return;
      const h = this.startPositionRaw,
        y = this.positionRaw;
      if (h) {
        const f = window.matchMedia('(min-width: 961px)').matches,
          r = Math.min(window.innerWidth, window.innerHeight) / (f ? 12 : 6.5);
        let u = y.x - h.x,
          v = y.y - h.y;
        const g = Math.sqrt(u ** 2 + v ** 2);
        g > r && ((u *= r / g), (v *= r / g));
        const k = 100 / window.innerWidth,
          M = 100 / window.innerHeight;
        this.joystickParent.classList.add('visible'),
          (this.joystickOrigin.style.left = `${h.x * k}%`),
          (this.joystickOrigin.style.top = `${h.y * M}%`),
          (this.joystickPosition.style.left = `${(h.x + u) * k}%`),
          (this.joystickPosition.style.top = `${(h.y + v) * M}%`),
          (this.offsetX = u / r),
          (this.offsetY = v / r);
      }
      this.checkInput(), this.updateVelocityCtrl();
      const b = this.velocityCtrl,
        m = this.velocity;
      if (d.isSitting) {
        if (this.isMoving && this.fwd) {
          this.el.emit('stand-up');
          return;
        }
        (l.object3D.rotation.y = Math.PI),
          l.setAttribute(
            'rig-animation',
            `gender:${this.data.gender};clip:SITTING;loop:repeat;crossFadeDuration:0.2`,
          );
        return;
      }
      if (!b) {
        l.setAttribute(
          'rig-animation',
          `gender:${this.data.gender};clip:IDLE;loop:repeat;crossFadeDuration:0.2`,
        );
        return;
      }
      if (
        (n / 1e3 > S ? m.set(0, 0, 0) : this.updateVelocity(n),
        d.constrainToNavMesh && b.isNavMeshConstrained !== !1)
      ) {
        if (m.lengthSq() < W) return;
        this.isMoving || (this.isMoving = !0),
          l.setAttribute(
            'rig-animation',
            `gender:${this.data.gender};clip:${
              this.isRunning ? 'RUNNING' : 'WALKING'
            };loop:repeat;crossFadeDuration:0.2`,
          );
        const f = p.object3D.rotation.y;
        let r = Math.atan2(this.forward, this.side);
        (r -= f),
          (i = -r - Math.PI / 2),
          this.usingKeyboard && (l.object3D.rotation.y = i),
          t.copy(a.object3D.position),
          e
            .copy(m)
            .multiplyScalar(n / 1e3)
            .add(t);
        const u = a.sceneEl.systems.nav;
        (this.navGroup =
          this.navGroup === null ? u.getGroup(t) : this.navGroup),
          (this.navNode = this.navNode || u.getNode(t, this.navGroup)),
          (this.navNode = u.clampStep(t, e, this.navGroup, this.navNode, o)),
          a.object3D.position.copy(o);
      } else if (!a.hasAttribute('velocity')) {
        l.setAttribute(
          'rig-animation',
          `gender:${this.data.gender};clip:${
            this.isMoving ? (this.isRunning ? 'RUNNING' : 'WALKING') : 'IDLE'
          };loop:repeat;crossFadeDuration:0.2`,
        ),
          (a.object3D.position.x += (m.x * n) / 1e3),
          (a.object3D.position.y += (m.y * n) / 1e3),
          (a.object3D.position.z += (m.z * n) / 1e3);
        const f = p.object3D.rotation.y;
        let r = Math.atan2(this.forward, this.side);
        (r -= f),
          (i = -r - Math.PI / 2),
          this.usingKeyboard && (l.object3D.rotation.y = i);
      }
    };
  })(),
  updateVelocityCtrl: function () {
    const t = this.data;
    if (t.enabled) {
      for (let e = 0, o = t.controls.length; e < o; e++) {
        const i = this.el.components[t.controls[e] + j];
        if (i && i.isVelocityActive()) {
          this.velocityCtrl = i;
          return;
        }
      }
      this.velocityCtrl = null;
    }
  },
  updateVelocity: (function () {
    const t = new THREE.Vector2(),
      e = new THREE.Quaternion();
    return function (o) {
      let i;
      const s = this.el,
        n = this.velocityCtrl,
        a = this.velocity,
        d = this.data;
      if (n)
        if (n.getVelocityDelta) i = n.getVelocityDelta(o);
        else if (n.getVelocity) {
          a.copy(n.getVelocity());
          return;
        } else if (n.getPositionDelta) {
          a.copy(n.getPositionDelta(o).multiplyScalar(1e3 / o));
          return;
        } else throw new Error('Incompatible movement controls: ', n);
      if (
        (s.hasAttribute('velocity') &&
          !d.constrainToNavMesh &&
          a.copy(this.el.getAttribute('velocity')),
        i && d.enabled)
      ) {
        const l = d.camera;
        e.copy(l.object3D.quaternion),
          e.premultiply(s.object3D.quaternion),
          i.applyQuaternion(e);
        const p = i.length(),
          h = this.data.speed * (this.isRunning ? 2.5 : 1);
        d.fly
          ? (a.copy(i), a.multiplyScalar(h * 16.66667))
          : (t.set(i.x, i.z),
            t.setLength(p * h * 16.66667),
            (a.x = t.x),
            (a.z = t.y));
      }
    };
  })(),
  checkInput: (function () {
    return function () {
      if (this.usingKeyboard) {
        if (!this.fwd && !this.back && !this.left && !this.right) {
          (this.usingKeyboard = !1), (this.isMoving = !1);
          return;
        }
        this.fwd &&
          this.left &&
          ((this.forward = -Math.min(Math.max(-1, -1), 1)),
          (this.side = -Math.min(Math.max(-1, -1), 1))),
          this.fwd &&
            this.right &&
            ((this.forward = -Math.min(Math.max(-1, -1), 1)),
            (this.side = -Math.min(Math.max(-1, 1), 1))),
          this.back &&
            this.left &&
            ((this.forward = -Math.min(Math.max(-1, 1), 1)),
            (this.side = -Math.min(Math.max(-1, -1), 1))),
          this.back &&
            this.right &&
            ((this.forward = -Math.min(Math.max(-1, 1), 1)),
            (this.side = -Math.min(Math.max(-1, 1), 1))),
          this.fwd &&
            !this.left &&
            !this.right &&
            ((this.forward = -Math.min(Math.max(-1, -1), 1)), (this.side = 0)),
          this.back &&
            !this.left &&
            !this.right &&
            ((this.forward = -Math.min(Math.max(-1, 1), 1)), (this.side = 0)),
          this.left &&
            !this.fwd &&
            !this.back &&
            ((this.forward = 0), (this.side = -Math.min(Math.max(-1, -1), 1))),
          this.right &&
            !this.fwd &&
            !this.back &&
            ((this.forward = 0), (this.side = -Math.min(Math.max(-1, 1), 1))),
          (this.isMoving = !0);
        return;
      }
      if (this.usingTouch) {
        this.offsetY > 0.3 ||
        this.offsetY < -0.3 ||
        this.offsetX < -0.3 ||
        this.offsetX > 0.3
          ? ((this.forward = -Math.min(Math.max(-1, this.offsetY), 1)),
            (this.side = -Math.min(Math.max(-1, this.offsetX), 1)),
            (this.isMoving = !0))
          : (this.isMoving = !1);
        return;
      }
    };
  })(),
});
const w = {
  once: THREE.LoopOnce,
  repeat: THREE.LoopRepeat,
  pingpong: THREE.LoopPingPong,
};
function N(t) {
  return new RegExp(`^${t.split(/\*+/).map(z).join('.*')}$`);
}
function z(t) {
  return t.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
AFRAME.registerComponent('rig-animation', {
  schema: {
    gender: { default: 'm', type: 'string' },
    clip: { default: '*', type: 'string' },
    duration: { default: 0, type: 'number' },
    clampWhenFinished: { default: !1, type: 'boolean' },
    crossFadeDuration: { default: 0, type: 'number' },
    loop: { default: 'repeat', oneOf: Object.keys(w) },
    repetitions: { default: 1 / 0, min: 0 },
    timeScale: { default: 1 },
  },
  init() {
    (this.mixer = null), (this.activeActions = []);
    const t = this.data.gender;
    this.model = this.el.getObject3D('mesh');
    const e = new THREE.ObjectLoader();
    console.log('rig-animation.js: loading animations', `animations-${t}.json`);
    const o = () => {
      this.model &&
        fetch(`assets/common/models/avatar/animations-${t}.json`)
          .then((i) => i.json())
          .then((i) => {
            this.model.animations = [];
            const s = e.parseAnimations(i.animations);
            this.model.animations = Object.values(s);
          })
          .then(() => this.load())
          .catch(console.log);
    };
    this.model
      ? o()
      : this.el.addEventListener('model-loaded', (i) => {
          (this.model = i.detail.model), o();
        });
  },
  load() {
    const { el: t } = this;
    (this.mixer = new THREE.AnimationMixer(this.model)),
      this.mixer.addEventListener('loop', (e) => {
        t.emit('animation-loop', { action: e.action, loopDelta: e.loopDelta });
      }),
      this.mixer.addEventListener('finished', (e) => {
        t.emit('animation-finished', {
          action: e.action,
          direction: e.direction,
        });
      }),
      this.data.clip && this.update({});
  },
  remove() {
    this.mixer && this.mixer.stopAllAction();
  },
  update(t) {
    if (!t) return;
    const { data: e } = this,
      o = AFRAME.utils.diff(e, t);
    if ('clip' in o)
      return this.stopAction(), void (e.clip && this.playAction());
    this.activeActions.forEach((i) => {
      'duration' in o && e.duration && i.setDuration(e.duration),
        'clampWhenFinished' in o && (i.clampWhenFinished = e.clampWhenFinished),
        ('loop' in o || 'repetitions' in o) &&
          i.setLoop(w[e.loop], e.repetitions),
        'timeScale' in o && i.setEffectiveTimeScale(e.timeScale);
    });
  },
  stopAction() {
    const { data: t } = this;
    for (let e = 0; e < this.activeActions.length; e++)
      t.crossFadeDuration
        ? this.activeActions[e].fadeOut(t.crossFadeDuration)
        : this.activeActions[e].stop();
    this.activeActions = [];
  },
  playAction() {
    if (!this.mixer) return;
    const { model: t } = this,
      { data: e } = this,
      o = t.animations || (t.geometry || {}).animations || [];
    if (!o.length) return;
    const i = N(e.clip);
    for (let s, n = 0; (s = o[n]); n++)
      if (s.name.match(i)) {
        const a = this.mixer.clipAction(s, t);
        (a.enabled = !0),
          (a.clampWhenFinished = e.clampWhenFinished),
          e.duration && a.setDuration(e.duration),
          e.timeScale !== 1 && a.setEffectiveTimeScale(e.timeScale),
          a
            .setLoop(w[e.loop], e.repetitions)
            .fadeIn(e.crossFadeDuration)
            .play(),
          this.activeActions.push(a);
      }
  },
  tick(t, e) {
    this.mixer && !Number.isNaN(e) && this.mixer.update(e / 1e3);
  },
});
