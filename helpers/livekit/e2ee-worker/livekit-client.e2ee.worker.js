!(function (e) {
  'function' == typeof define && define.amd ? define(e) : e();
})(function () {
  'use strict';
  function e(e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function s(e) {
        try {
          c(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function a(e) {
        try {
          c(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function c(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(s, a);
      }
      c((r = r.apply(e, t || [])).next());
    });
  }
  'function' == typeof SuppressedError && SuppressedError;
  var t,
    n,
    r,
    i =
      'undefined' != typeof globalThis
        ? globalThis
        : 'undefined' != typeof window
          ? window
          : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self
              ? self
              : {},
    o = { exports: {} };
  (n = i),
    (r = function () {
      var e = function () {},
        t = 'undefined',
        n =
          typeof window !== t &&
          typeof window.navigator !== t &&
          /Trident\/|MSIE /.test(window.navigator.userAgent),
        r = ['trace', 'debug', 'info', 'warn', 'error'];
      function i(e, t) {
        var n = e[t];
        if ('function' == typeof n.bind) return n.bind(e);
        try {
          return Function.prototype.bind.call(n, e);
        } catch (t) {
          return function () {
            return Function.prototype.apply.apply(n, [e, arguments]);
          };
        }
      }
      function o() {
        console.log &&
          (console.log.apply
            ? console.log.apply(console, arguments)
            : Function.prototype.apply.apply(console.log, [
                console,
                arguments,
              ])),
          console.trace && console.trace();
      }
      function s(t, n) {
        for (var i = 0; i < r.length; i++) {
          var o = r[i];
          this[o] = i < t ? e : this.methodFactory(o, t, n);
        }
        this.log = this.debug;
      }
      function a(e, n, r) {
        return function () {
          typeof console !== t &&
            (s.call(this, n, r), this[e].apply(this, arguments));
        };
      }
      function c(r, s, c) {
        return (
          (function (r) {
            return (
              'debug' === r && (r = 'log'),
              typeof console !== t &&
                ('trace' === r && n
                  ? o
                  : void 0 !== console[r]
                    ? i(console, r)
                    : void 0 !== console.log
                      ? i(console, 'log')
                      : e)
            );
          })(r) || a.apply(this, arguments)
        );
      }
      function d(e, n, i) {
        var o,
          a = this;
        n = null == n ? 'WARN' : n;
        var d = 'loglevel';
        function u() {
          var e;
          if (typeof window !== t && d) {
            try {
              e = window.localStorage[d];
            } catch (e) {}
            if (typeof e === t)
              try {
                var n = window.document.cookie,
                  r = n.indexOf(encodeURIComponent(d) + '=');
                -1 !== r && (e = /^([^;]+)/.exec(n.slice(r))[1]);
              } catch (e) {}
            return void 0 === a.levels[e] && (e = void 0), e;
          }
        }
        'string' == typeof e
          ? (d += ':' + e)
          : 'symbol' == typeof e && (d = void 0),
          (a.name = e),
          (a.levels = {
            TRACE: 0,
            DEBUG: 1,
            INFO: 2,
            WARN: 3,
            ERROR: 4,
            SILENT: 5,
          }),
          (a.methodFactory = i || c),
          (a.getLevel = function () {
            return o;
          }),
          (a.setLevel = function (n, i) {
            if (
              ('string' == typeof n &&
                void 0 !== a.levels[n.toUpperCase()] &&
                (n = a.levels[n.toUpperCase()]),
              !('number' == typeof n && n >= 0 && n <= a.levels.SILENT))
            )
              throw 'log.setLevel() called with invalid level: ' + n;
            if (
              ((o = n),
              !1 !== i &&
                (function (e) {
                  var n = (r[e] || 'silent').toUpperCase();
                  if (typeof window !== t && d) {
                    try {
                      return void (window.localStorage[d] = n);
                    } catch (e) {}
                    try {
                      window.document.cookie =
                        encodeURIComponent(d) + '=' + n + ';';
                    } catch (e) {}
                  }
                })(n),
              s.call(a, n, e),
              typeof console === t && n < a.levels.SILENT)
            )
              return 'No console available for logging';
          }),
          (a.setDefaultLevel = function (e) {
            (n = e), u() || a.setLevel(e, !1);
          }),
          (a.resetLevel = function () {
            a.setLevel(n, !1),
              (function () {
                if (typeof window !== t && d) {
                  try {
                    return void window.localStorage.removeItem(d);
                  } catch (e) {}
                  try {
                    window.document.cookie =
                      encodeURIComponent(d) +
                      '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                  } catch (e) {}
                }
              })();
          }),
          (a.enableAll = function (e) {
            a.setLevel(a.levels.TRACE, e);
          }),
          (a.disableAll = function (e) {
            a.setLevel(a.levels.SILENT, e);
          });
        var y = u();
        null == y && (y = n), a.setLevel(y, !1);
      }
      var u = new d(),
        y = {};
      u.getLogger = function (e) {
        if (('symbol' != typeof e && 'string' != typeof e) || '' === e)
          throw new TypeError('You must supply a name when creating a logger.');
        var t = y[e];
        return t || (t = y[e] = new d(e, u.getLevel(), u.methodFactory)), t;
      };
      var l = typeof window !== t ? window.log : void 0;
      return (
        (u.noConflict = function () {
          return typeof window !== t && window.log === u && (window.log = l), u;
        }),
        (u.getLoggers = function () {
          return y;
        }),
        (u.default = u),
        u
      );
    }),
    (t = o).exports ? (t.exports = r()) : (n.log = r());
  var s,
    a,
    c = o.exports;
  !(function (e) {
    (e[(e.trace = 0)] = 'trace'),
      (e[(e.debug = 1)] = 'debug'),
      (e[(e.info = 2)] = 'info'),
      (e[(e.warn = 3)] = 'warn'),
      (e[(e.error = 4)] = 'error'),
      (e[(e.silent = 5)] = 'silent');
  })(s || (s = {})),
    (function (e) {
      (e.Default = 'livekit'),
        (e.Room = 'livekit-room'),
        (e.Participant = 'livekit-participant'),
        (e.Track = 'livekit-track'),
        (e.Publication = 'livekit-track-publication'),
        (e.Engine = 'livekit-engine'),
        (e.Signal = 'livekit-signal'),
        (e.PCManager = 'livekit-pc-manager'),
        (e.PCTransport = 'livekit-pc-transport'),
        (e.E2EE = 'lk-e2ee');
    })(a || (a = {}));
  let d = c.getLogger('livekit');
  Object.values(a).map((e) => c.getLogger(e)), d.setDefaultLevel(s.info);
  const u = c.getLogger('lk-e2ee'),
    y = 'AES-GCM',
    l = { key: 10, delta: 3, audio: 1, empty: 0 },
    h = {
      sharedKey: !1,
      ratchetSalt: 'LKFrameEncryptionKey',
      ratchetWindowSize: 8,
      failureTolerance: 10,
    };
  class p extends Error {
    constructor(e, t) {
      super(t || 'an error has occured'), (this.code = e);
    }
  }
  var f, v, g, m, w, I;
  !(function (e) {
    (e.PermissionDenied = 'PermissionDenied'),
      (e.NotFound = 'NotFound'),
      (e.DeviceInUse = 'DeviceInUse'),
      (e.Other = 'Other');
  })(f || (f = {})),
    (function (e) {
      e.getFailure = function (t) {
        if (t && 'name' in t)
          return 'NotFoundError' === t.name || 'DevicesNotFoundError' === t.name
            ? e.NotFound
            : 'NotAllowedError' === t.name || 'PermissionDeniedError' === t.name
              ? e.PermissionDenied
              : 'NotReadableError' === t.name || 'TrackStartError' === t.name
                ? e.DeviceInUse
                : e.Other;
      };
    })(f || (f = {})),
    (function (e) {
      (e[(e.InvalidKey = 0)] = 'InvalidKey'),
        (e[(e.MissingKey = 1)] = 'MissingKey'),
        (e[(e.InternalError = 2)] = 'InternalError');
    })(v || (v = {}));
  class b extends p {
    constructor(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : v.InternalError;
      super(40, e), (this.reason = t);
    }
  }
  !(function (e) {
    (e.SetKey = 'setKey'),
      (e.RatchetRequest = 'ratchetRequest'),
      (e.KeyRatcheted = 'keyRatcheted');
  })(g || (g = {})),
    (function (e) {
      e.KeyRatcheted = 'keyRatcheted';
    })(m || (m = {})),
    (function (e) {
      (e.ParticipantEncryptionStatusChanged =
        'participantEncryptionStatusChanged'),
        (e.EncryptionError = 'encryptionError');
    })(w || (w = {})),
    (function (e) {
      e.Error = 'cryptorError';
    })(I || (I = {}));
  var S,
    L = { exports: {} },
    k = 'object' == typeof Reflect ? Reflect : null,
    E =
      k && 'function' == typeof k.apply
        ? k.apply
        : function (e, t, n) {
            return Function.prototype.apply.call(e, t, n);
          };
  S =
    k && 'function' == typeof k.ownKeys
      ? k.ownKeys
      : Object.getOwnPropertySymbols
        ? function (e) {
            return Object.getOwnPropertyNames(e).concat(
              Object.getOwnPropertySymbols(e)
            );
          }
        : function (e) {
            return Object.getOwnPropertyNames(e);
          };
  var C =
    Number.isNaN ||
    function (e) {
      return e != e;
    };
  function K() {
    K.init.call(this);
  }
  (L.exports = K),
    (L.exports.once = function (e, t) {
      return new Promise(function (n, r) {
        function i(n) {
          e.removeListener(t, o), r(n);
        }
        function o() {
          'function' == typeof e.removeListener && e.removeListener('error', i),
            n([].slice.call(arguments));
        }
        M(e, t, o, { once: !0 }),
          'error' !== t &&
            (function (e, t, n) {
              'function' == typeof e.on && M(e, 'error', t, n);
            })(e, i, { once: !0 });
      });
    }),
    (K.EventEmitter = K),
    (K.prototype._events = void 0),
    (K.prototype._eventsCount = 0),
    (K.prototype._maxListeners = void 0);
  var T = 10;
  function _(e) {
    if ('function' != typeof e)
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof e
      );
  }
  function A(e) {
    return void 0 === e._maxListeners ? K.defaultMaxListeners : e._maxListeners;
  }
  function P(e, t, n, r) {
    var i, o, s, a;
    if (
      (_(n),
      void 0 === (o = e._events)
        ? ((o = e._events = Object.create(null)), (e._eventsCount = 0))
        : (void 0 !== o.newListener &&
            (e.emit('newListener', t, n.listener ? n.listener : n),
            (o = e._events)),
          (s = o[t])),
      void 0 === s)
    )
      (s = o[t] = n), ++e._eventsCount;
    else if (
      ('function' == typeof s
        ? (s = o[t] = r ? [n, s] : [s, n])
        : r
          ? s.unshift(n)
          : s.push(n),
      (i = A(e)) > 0 && s.length > i && !s.warned)
    ) {
      s.warned = !0;
      var c = new Error(
        'Possible EventEmitter memory leak detected. ' +
          s.length +
          ' ' +
          String(t) +
          ' listeners added. Use emitter.setMaxListeners() to increase limit'
      );
      (c.name = 'MaxListenersExceededWarning'),
        (c.emitter = e),
        (c.type = t),
        (c.count = s.length),
        (a = c),
        console && console.warn && console.warn(a);
    }
    return e;
  }
  function x() {
    if (!this.fired)
      return (
        this.target.removeListener(this.type, this.wrapFn),
        (this.fired = !0),
        0 === arguments.length
          ? this.listener.call(this.target)
          : this.listener.apply(this.target, arguments)
      );
  }
  function R(e, t, n) {
    var r = { fired: !1, wrapFn: void 0, target: e, type: t, listener: n },
      i = x.bind(r);
    return (i.listener = n), (r.wrapFn = i), i;
  }
  function F(e, t, n) {
    var r = e._events;
    if (void 0 === r) return [];
    var i = r[t];
    return void 0 === i
      ? []
      : 'function' == typeof i
        ? n
          ? [i.listener || i]
          : [i]
        : n
          ? (function (e) {
              for (var t = new Array(e.length), n = 0; n < t.length; ++n)
                t[n] = e[n].listener || e[n];
              return t;
            })(i)
          : U(i, i.length);
  }
  function O(e) {
    var t = this._events;
    if (void 0 !== t) {
      var n = t[e];
      if ('function' == typeof n) return 1;
      if (void 0 !== n) return n.length;
    }
    return 0;
  }
  function U(e, t) {
    for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
    return n;
  }
  function M(e, t, n, r) {
    if ('function' == typeof e.on) r.once ? e.once(t, n) : e.on(t, n);
    else {
      if ('function' != typeof e.addEventListener)
        throw new TypeError(
          'The "emitter" argument must be of type EventEmitter. Received type ' +
            typeof e
        );
      e.addEventListener(t, function i(o) {
        r.once && e.removeEventListener(t, i), n(o);
      });
    }
  }
  Object.defineProperty(K, 'defaultMaxListeners', {
    enumerable: !0,
    get: function () {
      return T;
    },
    set: function (e) {
      if ('number' != typeof e || e < 0 || C(e))
        throw new RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            e +
            '.'
        );
      T = e;
    },
  }),
    (K.init = function () {
      (void 0 !== this._events &&
        this._events !== Object.getPrototypeOf(this)._events) ||
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0);
    }),
    (K.prototype.setMaxListeners = function (e) {
      if ('number' != typeof e || e < 0 || C(e))
        throw new RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            e +
            '.'
        );
      return (this._maxListeners = e), this;
    }),
    (K.prototype.getMaxListeners = function () {
      return A(this);
    }),
    (K.prototype.emit = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
      var r = 'error' === e,
        i = this._events;
      if (void 0 !== i) r = r && void 0 === i.error;
      else if (!r) return !1;
      if (r) {
        var o;
        if ((t.length > 0 && (o = t[0]), o instanceof Error)) throw o;
        var s = new Error(
          'Unhandled error.' + (o ? ' (' + o.message + ')' : '')
        );
        throw ((s.context = o), s);
      }
      var a = i[e];
      if (void 0 === a) return !1;
      if ('function' == typeof a) E(a, this, t);
      else {
        var c = a.length,
          d = U(a, c);
        for (n = 0; n < c; ++n) E(d[n], this, t);
      }
      return !0;
    }),
    (K.prototype.addListener = function (e, t) {
      return P(this, e, t, !1);
    }),
    (K.prototype.on = K.prototype.addListener),
    (K.prototype.prependListener = function (e, t) {
      return P(this, e, t, !0);
    }),
    (K.prototype.once = function (e, t) {
      return _(t), this.on(e, R(this, e, t)), this;
    }),
    (K.prototype.prependOnceListener = function (e, t) {
      return _(t), this.prependListener(e, R(this, e, t)), this;
    }),
    (K.prototype.removeListener = function (e, t) {
      var n, r, i, o, s;
      if ((_(t), void 0 === (r = this._events))) return this;
      if (void 0 === (n = r[e])) return this;
      if (n === t || n.listener === t)
        0 == --this._eventsCount
          ? (this._events = Object.create(null))
          : (delete r[e],
            r.removeListener &&
              this.emit('removeListener', e, n.listener || t));
      else if ('function' != typeof n) {
        for (i = -1, o = n.length - 1; o >= 0; o--)
          if (n[o] === t || n[o].listener === t) {
            (s = n[o].listener), (i = o);
            break;
          }
        if (i < 0) return this;
        0 === i
          ? n.shift()
          : (function (e, t) {
              for (; t + 1 < e.length; t++) e[t] = e[t + 1];
              e.pop();
            })(n, i),
          1 === n.length && (r[e] = n[0]),
          void 0 !== r.removeListener && this.emit('removeListener', e, s || t);
      }
      return this;
    }),
    (K.prototype.off = K.prototype.removeListener),
    (K.prototype.removeAllListeners = function (e) {
      var t, n, r;
      if (void 0 === (n = this._events)) return this;
      if (void 0 === n.removeListener)
        return (
          0 === arguments.length
            ? ((this._events = Object.create(null)), (this._eventsCount = 0))
            : void 0 !== n[e] &&
              (0 == --this._eventsCount
                ? (this._events = Object.create(null))
                : delete n[e]),
          this
        );
      if (0 === arguments.length) {
        var i,
          o = Object.keys(n);
        for (r = 0; r < o.length; ++r)
          'removeListener' !== (i = o[r]) && this.removeAllListeners(i);
        return (
          this.removeAllListeners('removeListener'),
          (this._events = Object.create(null)),
          (this._eventsCount = 0),
          this
        );
      }
      if ('function' == typeof (t = n[e])) this.removeListener(e, t);
      else if (void 0 !== t)
        for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
      return this;
    }),
    (K.prototype.listeners = function (e) {
      return F(this, e, !0);
    }),
    (K.prototype.rawListeners = function (e) {
      return F(this, e, !1);
    }),
    (K.listenerCount = function (e, t) {
      return 'function' == typeof e.listenerCount
        ? e.listenerCount(t)
        : O.call(e, t);
    }),
    (K.prototype.listenerCount = O),
    (K.prototype.eventNames = function () {
      return this._eventsCount > 0 ? S(this._events) : [];
    });
  var D = L.exports;
  function N(e, t) {
    const n = new TextEncoder().encode(t);
    switch (e) {
      case 'HKDF':
        return {
          name: 'HKDF',
          salt: n,
          hash: 'SHA-256',
          info: new ArrayBuffer(128),
        };
      case 'PBKDF2':
        return { name: 'PBKDF2', salt: n, hash: 'SHA-256', iterations: 1e5 };
      default:
        throw new Error('algorithm '.concat(e, ' is currently unsupported'));
    }
  }
  function B(t, n) {
    return e(this, void 0, void 0, function* () {
      const e = N(t.algorithm.name, n),
        r = yield crypto.subtle.deriveKey(e, t, { name: y, length: 128 }, !1, [
          'encrypt',
          'decrypt',
        ]);
      return { material: t, encryptionKey: r };
    });
  }
  class j {
    constructor() {
      (this.consecutiveSifCount = 0),
        (this.lastSifReceivedAt = 0),
        (this.userFramesSinceSif = 0);
    }
    recordSif() {
      var e;
      (this.consecutiveSifCount += 1),
        (null !== (e = this.sifSequenceStartedAt) && void 0 !== e) ||
          (this.sifSequenceStartedAt = Date.now()),
        (this.lastSifReceivedAt = Date.now());
    }
    recordUserFrame() {
      void 0 !== this.sifSequenceStartedAt &&
        ((this.userFramesSinceSif += 1),
        (this.userFramesSinceSif > this.consecutiveSifCount ||
          Date.now() - this.lastSifReceivedAt > 2e3) &&
          this.reset());
    }
    isSifAllowed() {
      return (
        this.consecutiveSifCount < 100 &&
        (void 0 === this.sifSequenceStartedAt ||
          Date.now() - this.sifSequenceStartedAt < 2e3)
      );
    }
    reset() {
      (this.userFramesSinceSif = 0),
        (this.consecutiveSifCount = 0),
        (this.sifSequenceStartedAt = void 0);
    }
  }
  const q = new Map();
  class V extends D.EventEmitter {
    encodeFunction(e, t) {
      throw Error('not implemented for subclass');
    }
    decodeFunction(e, t) {
      throw Error('not implemented for subclass');
    }
  }
  class X extends V {
    constructor(e) {
      var t;
      super(),
        (this.sendCounts = new Map()),
        (this.keys = e.keys),
        (this.participantIdentity = e.participantIdentity),
        (this.rtpMap = new Map()),
        (this.keyProviderOptions = e.keyProviderOptions),
        (this.sifTrailer =
          null !== (t = e.sifTrailer) && void 0 !== t
            ? t
            : Uint8Array.from([])),
        (this.sifGuard = new j());
    }
    get logContext() {
      return {
        participant: this.participantIdentity,
        mediaTrackId: this.trackId,
        fallbackCodec: this.videoCodec,
      };
    }
    setParticipant(e, t) {
      (this.participantIdentity = e), (this.keys = t), this.sifGuard.reset();
    }
    unsetParticipant() {
      u.debug('unsetting participant', this.logContext),
        (this.participantIdentity = void 0);
    }
    isEnabled() {
      return this.participantIdentity
        ? q.get(this.participantIdentity)
        : void 0;
    }
    getParticipantIdentity() {
      return this.participantIdentity;
    }
    getTrackId() {
      return this.trackId;
    }
    setVideoCodec(e) {
      this.videoCodec = e;
    }
    setRtpMap(e) {
      this.rtpMap = e;
    }
    setupTransform(e, t, n, r, i) {
      i &&
        (u.info('setting codec on cryptor to', { codec: i }),
        (this.videoCodec = i)),
        u.debug(
          'Setting up frame cryptor transform',
          Object.assign(
            { operation: e, passedTrackId: r, codec: i },
            this.logContext
          )
        );
      const o = 'encode' === e ? this.encodeFunction : this.decodeFunction,
        s = new TransformStream({ transform: o.bind(this) });
      t
        .pipeThrough(s)
        .pipeTo(n)
        .catch((e) => {
          u.warn(e), this.emit(I.Error, e instanceof b ? e : new b(e.message));
        }),
        (this.trackId = r);
    }
    setSifTrailer(e) {
      u.debug(
        'setting SIF trailer',
        Object.assign(Object.assign({}, this.logContext), { trailer: e })
      ),
        (this.sifTrailer = e);
    }
    encodeFunction(t, n) {
      var r;
      return e(this, void 0, void 0, function* () {
        if (!this.isEnabled() || 0 === t.data.byteLength) return n.enqueue(t);
        const e = this.keys.getKeySet();
        if (!e)
          throw new TypeError(
            'key set not found for '
              .concat(this.participantIdentity, ' at index ')
              .concat(this.keys.getCurrentKeyIndex())
          );
        const { encryptionKey: i } = e,
          o = this.keys.getCurrentKeyIndex();
        if (i) {
          const e = this.makeIV(
            null !== (r = t.getMetadata().synchronizationSource) && void 0 !== r
              ? r
              : -1,
            t.timestamp
          );
          let a = this.getUnencryptedBytes(t);
          const c = new Uint8Array(t.data, 0, a.unencryptedBytes),
            d = new Uint8Array(2);
          (d[0] = 12), (d[1] = o);
          try {
            const r = yield crypto.subtle.encrypt(
              {
                name: y,
                iv: e,
                additionalData: new Uint8Array(t.data, 0, c.byteLength),
              },
              i,
              new Uint8Array(t.data, a.unencryptedBytes)
            );
            let o = new Uint8Array(r.byteLength + e.byteLength + d.byteLength);
            o.set(new Uint8Array(r)),
              o.set(new Uint8Array(e), r.byteLength),
              o.set(d, r.byteLength + e.byteLength),
              a.isH264 &&
                (o = (function (e) {
                  const t = [];
                  for (var n = 0, r = 0; r < e.length; ++r) {
                    var i = e[r];
                    i <= 3 && n >= 2 && (t.push(3), (n = 0)),
                      t.push(i),
                      0 == i ? ++n : (n = 0);
                  }
                  return new Uint8Array(t);
                })(o));
            var s = new Uint8Array(c.byteLength + o.byteLength);
            return (
              s.set(c),
              s.set(o, c.byteLength),
              (t.data = s.buffer),
              n.enqueue(t)
            );
          } catch (e) {
            u.error(e);
          }
        } else
          u.debug('failed to decrypt, emitting error', this.logContext),
            this.emit(
              I.Error,
              new b('encryption key missing for encoding', v.MissingKey)
            );
      });
    }
    decodeFunction(t, n) {
      return e(this, void 0, void 0, function* () {
        if (!this.isEnabled() || 0 === t.data.byteLength)
          return (
            u.debug('skipping empty frame', this.logContext),
            this.sifGuard.recordUserFrame(),
            n.enqueue(t)
          );
        if (
          (function (e, t) {
            if (0 === t.byteLength) return !1;
            const n = new Uint8Array(e.slice(e.byteLength - t.byteLength));
            return t.every((e, t) => e === n[t]);
          })(t.data, this.sifTrailer)
        )
          return (
            u.debug('enqueue SIF', this.logContext),
            this.sifGuard.recordSif(),
            this.sifGuard.isSifAllowed()
              ? ((t.data = t.data.slice(
                  0,
                  t.data.byteLength - this.sifTrailer.byteLength
                )),
                n.enqueue(t))
              : void u.warn('SIF limit reached, dropping frame')
          );
        this.sifGuard.recordUserFrame();
        const e = new Uint8Array(t.data)[t.data.byteLength - 1];
        if (this.keys.getKeySet(e) && this.keys.hasValidKey)
          try {
            const r = yield this.decryptFrame(t, e);
            if ((this.keys.decryptionSuccess(), r)) return n.enqueue(r);
          } catch (e) {
            e instanceof b && e.reason === v.InvalidKey
              ? this.keys.hasValidKey &&
                (this.emit(I.Error, e), this.keys.decryptionFailure())
              : u.warn('decoding frame failed', { error: e });
          }
        else
          !this.keys.getKeySet(e) &&
            this.keys.hasValidKey &&
            (u.warn(
              'skipping decryption due to missing key at index '.concat(e)
            ),
            this.emit(
              I.Error,
              new b(
                'missing key at index '
                  .concat(e, ' for participant ')
                  .concat(this.participantIdentity),
                v.MissingKey
              )
            ));
      });
    }
    decryptFrame(t, n) {
      let r =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : void 0,
        i =
          arguments.length > 3 && void 0 !== arguments[3]
            ? arguments[3]
            : { ratchetCount: 0 };
      var o;
      return e(this, void 0, void 0, function* () {
        const e = this.keys.getKeySet(n);
        if (!i.encryptionKey && !e)
          throw new TypeError(
            'no encryption key found for decryption of '.concat(
              this.participantIdentity
            )
          );
        let s = this.getUnencryptedBytes(t);
        try {
          const n = new Uint8Array(t.data, 0, s.unencryptedBytes);
          var a = new Uint8Array(
            t.data,
            n.length,
            t.data.byteLength - n.length
          );
          if (
            s.isH264 &&
            (function (e) {
              for (var t = 0; t < e.length - 3; t++)
                if (0 == e[t] && 0 == e[t + 1] && 3 == e[t + 2]) return !0;
              return !1;
            })(a)
          ) {
            a = (function (e) {
              const t = [];
              for (var n = e.length, r = 0; r < e.length; )
                n - r >= 3 && !e[r] && !e[r + 1] && 3 == e[r + 2]
                  ? (t.push(e[r++]), t.push(e[r++]), r++)
                  : t.push(e[r++]);
              return new Uint8Array(t);
            })(a);
            const e = new Uint8Array(n.byteLength + a.byteLength);
            e.set(n), e.set(a, n.byteLength), (t.data = e.buffer);
          }
          const r = new Uint8Array(t.data, t.data.byteLength - 2, 2),
            c = r[0],
            d = new Uint8Array(t.data, t.data.byteLength - c - r.byteLength, c),
            u = n.byteLength,
            l = t.data.byteLength - (n.byteLength + c + r.byteLength),
            h = yield crypto.subtle.decrypt(
              {
                name: y,
                iv: d,
                additionalData: new Uint8Array(t.data, 0, n.byteLength),
              },
              null !== (o = i.encryptionKey) && void 0 !== o
                ? o
                : e.encryptionKey,
              new Uint8Array(t.data, u, l)
            ),
            p = new ArrayBuffer(n.byteLength + h.byteLength),
            f = new Uint8Array(p);
          return (
            f.set(new Uint8Array(t.data, 0, n.byteLength)),
            f.set(new Uint8Array(h), n.byteLength),
            (t.data = p),
            t
          );
        } catch (o) {
          if (this.keyProviderOptions.ratchetWindowSize > 0) {
            if (i.ratchetCount < this.keyProviderOptions.ratchetWindowSize) {
              let o;
              if (
                (u.debug(
                  'ratcheting key attempt '
                    .concat(i.ratchetCount, ' of ')
                    .concat(
                      this.keyProviderOptions.ratchetWindowSize,
                      ', for kind '
                    )
                    .concat(
                      t instanceof RTCEncodedAudioFrame ? 'audio' : 'video'
                    )
                ),
                (null != r ? r : e) === this.keys.getKeySet(n))
              ) {
                const e = yield this.keys.ratchetKey(n, !1);
                o = yield B(e, this.keyProviderOptions.ratchetSalt);
              }
              const s = yield this.decryptFrame(t, n, r || e, {
                ratchetCount: i.ratchetCount + 1,
                encryptionKey: null == o ? void 0 : o.encryptionKey,
              });
              return (
                s &&
                  o &&
                  (null != r ? r : e) === this.keys.getKeySet(n) &&
                  (this.keys.setKeySet(o, n, !0),
                  this.keys.setCurrentKeyIndex(n)),
                s
              );
            }
            throw (
              (u.warn('maximum ratchet attempts exceeded'),
              new b(
                'valid key missing for participant '.concat(
                  this.participantIdentity
                ),
                v.InvalidKey
              ))
            );
          }
          throw new b('Decryption failed: '.concat(o.message), v.InvalidKey);
        }
      });
    }
    makeIV(e, t) {
      var n;
      const r = new ArrayBuffer(12),
        i = new DataView(r);
      this.sendCounts.has(e) ||
        this.sendCounts.set(e, Math.floor(65535 * Math.random()));
      const o = null !== (n = this.sendCounts.get(e)) && void 0 !== n ? n : 0;
      return (
        i.setUint32(0, e),
        i.setUint32(4, t),
        i.setUint32(8, t - (o % 65535)),
        this.sendCounts.set(e, o + 1),
        r
      );
    }
    getUnencryptedBytes(e) {
      var t,
        n = { unencryptedBytes: 0, isH264: !1 };
      if (
        (function (e) {
          return 'type' in e;
        })(e)
      ) {
        let r =
          null !== (t = this.getVideoCodec(e)) && void 0 !== t
            ? t
            : this.videoCodec;
        if (
          (r !== this.detectedCodec &&
            (u.debug(
              'detected different codec',
              Object.assign(
                { detectedCodec: r, oldCodec: this.detectedCodec },
                this.logContext
              )
            ),
            (this.detectedCodec = r)),
          'av1' === r || 'vp9' === r)
        )
          throw new Error(
            ''.concat(r, ' is not yet supported for end to end encryption')
          );
        if ('vp8' === r) return (n.unencryptedBytes = l[e.type]), n;
        const i = new Uint8Array(e.data);
        try {
          const e = (function (e) {
            const t = [];
            let n = 0,
              r = 0,
              i = e.length - 2;
            for (; r < i; ) {
              for (
                ;
                r < i && (0 !== e[r] || 0 !== e[r + 1] || 1 !== e[r + 2]);

              )
                r++;
              r >= i && (r = e.length);
              let o = r;
              for (; o > n && 0 === e[o - 1]; ) o--;
              if (0 === n) {
                if (o !== n)
                  throw TypeError('byte stream contains leading data');
              } else t.push(n);
              n = r += 3;
            }
            return t;
          })(i);
          if (
            ((n.isH264 =
              'h264' === r ||
              e.some((e) => [z.SLICE_IDR, z.SLICE_NON_IDR].includes(H(i[e])))),
            n.isH264)
          ) {
            for (const t of e) {
              switch (H(i[t])) {
                case z.SLICE_IDR:
                case z.SLICE_NON_IDR:
                  return (n.unencryptedBytes = t + 2), n;
              }
            }
            throw new TypeError('Could not find NALU');
          }
        } catch (e) {}
        return (n.unencryptedBytes = l[e.type]), n;
      }
      return (n.unencryptedBytes = l.audio), n;
    }
    getVideoCodec(e) {
      if (0 === this.rtpMap.size) return;
      const t = e.getMetadata().payloadType;
      return t ? this.rtpMap.get(t) : void 0;
    }
  }
  function H(e) {
    return e & G;
  }
  const G = 31;
  var z;
  !(function (e) {
    (e[(e.SLICE_NON_IDR = 1)] = 'SLICE_NON_IDR'),
      (e[(e.SLICE_PARTITION_A = 2)] = 'SLICE_PARTITION_A'),
      (e[(e.SLICE_PARTITION_B = 3)] = 'SLICE_PARTITION_B'),
      (e[(e.SLICE_PARTITION_C = 4)] = 'SLICE_PARTITION_C'),
      (e[(e.SLICE_IDR = 5)] = 'SLICE_IDR'),
      (e[(e.SEI = 6)] = 'SEI'),
      (e[(e.SPS = 7)] = 'SPS'),
      (e[(e.PPS = 8)] = 'PPS'),
      (e[(e.AUD = 9)] = 'AUD'),
      (e[(e.END_SEQ = 10)] = 'END_SEQ'),
      (e[(e.END_STREAM = 11)] = 'END_STREAM'),
      (e[(e.FILLER_DATA = 12)] = 'FILLER_DATA'),
      (e[(e.SPS_EXT = 13)] = 'SPS_EXT'),
      (e[(e.PREFIX_NALU = 14)] = 'PREFIX_NALU'),
      (e[(e.SUBSET_SPS = 15)] = 'SUBSET_SPS'),
      (e[(e.DPS = 16)] = 'DPS'),
      (e[(e.SLICE_AUX = 19)] = 'SLICE_AUX'),
      (e[(e.SLICE_EXT = 20)] = 'SLICE_EXT'),
      (e[(e.SLICE_LAYER_EXT = 21)] = 'SLICE_LAYER_EXT');
  })(z || (z = {}));
  class W extends D.EventEmitter {
    get hasValidKey() {
      return this._hasValidKey;
    }
    constructor(e, t) {
      super(),
        (this.decryptionFailureCount = 0),
        (this._hasValidKey = !0),
        (this.currentKeyIndex = 0),
        (this.cryptoKeyRing = new Array(16).fill(void 0)),
        (this.keyProviderOptions = t),
        (this.ratchetPromiseMap = new Map()),
        (this.participantIdentity = e),
        this.resetKeyStatus();
    }
    decryptionFailure() {
      this.keyProviderOptions.failureTolerance < 0 ||
        ((this.decryptionFailureCount += 1),
        this.decryptionFailureCount >
          this.keyProviderOptions.failureTolerance &&
          (u.warn(
            'key for '.concat(
              this.participantIdentity,
              ' is being marked as invalid'
            )
          ),
          (this._hasValidKey = !1)));
    }
    decryptionSuccess() {
      this.resetKeyStatus();
    }
    resetKeyStatus() {
      (this.decryptionFailureCount = 0), (this._hasValidKey = !0);
    }
    ratchetKey(t) {
      let n =
        !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      const r = null != t ? t : this.getCurrentKeyIndex(),
        i = this.ratchetPromiseMap.get(r);
      if (void 0 !== i) return i;
      const o = new Promise((t, i) =>
        e(this, void 0, void 0, function* () {
          try {
            const i = this.getKeySet(r);
            if (!i)
              throw new TypeError(
                'Cannot ratchet key without a valid keyset of participant '.concat(
                  this.participantIdentity
                )
              );
            const o = i.material,
              s = yield (function (t) {
                let n =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : { name: y },
                  r =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : 'encrypt';
                return e(this, void 0, void 0, function* () {
                  return crypto.subtle.importKey(
                    'raw',
                    t,
                    n,
                    !1,
                    'derive' === r
                      ? ['deriveBits', 'deriveKey']
                      : ['encrypt', 'decrypt']
                  );
                });
              })(
                yield (function (t, n) {
                  return e(this, void 0, void 0, function* () {
                    const e = N(t.algorithm.name, n);
                    return crypto.subtle.deriveBits(e, t, 256);
                  });
                })(o, this.keyProviderOptions.ratchetSalt),
                o.algorithm.name,
                'derive'
              );
            n &&
              (this.setKeyFromMaterial(s, r, !0),
              this.emit(m.KeyRatcheted, s, this.participantIdentity, r)),
              t(s);
          } catch (e) {
            i(e);
          } finally {
            this.ratchetPromiseMap.delete(r);
          }
        })
      );
      return this.ratchetPromiseMap.set(r, o), o;
    }
    setKey(t) {
      let n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
      return e(this, void 0, void 0, function* () {
        yield this.setKeyFromMaterial(t, n), this.resetKeyStatus();
      });
    }
    setKeyFromMaterial(t, n) {
      let r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      return e(this, void 0, void 0, function* () {
        const e = yield B(t, this.keyProviderOptions.ratchetSalt),
          i = n >= 0 ? n % this.cryptoKeyRing.length : this.currentKeyIndex;
        u.debug('setting new key with index '.concat(n), {
          usage: t.usages,
          algorithm: t.algorithm,
          ratchetSalt: this.keyProviderOptions.ratchetSalt,
        }),
          this.setKeySet(e, i, r),
          i >= 0 && (this.currentKeyIndex = i);
      });
    }
    setKeySet(e, t) {
      let n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      (this.cryptoKeyRing[t % this.cryptoKeyRing.length] = e),
        n && this.emit(m.KeyRatcheted, e.material, this.participantIdentity, t);
    }
    setCurrentKeyIndex(t) {
      return e(this, void 0, void 0, function* () {
        (this.currentKeyIndex = t % this.cryptoKeyRing.length),
          this.resetKeyStatus();
      });
    }
    getCurrentKeyIndex() {
      return this.currentKeyIndex;
    }
    getKeySet(e) {
      return this.cryptoKeyRing[null != e ? e : this.currentKeyIndex];
    }
  }
  const Y = [],
    Q = new Map();
  let J,
    Z,
    $ = !1,
    ee = h;
  function te(e, t) {
    let n = Y.find((e) => e.getTrackId() === t);
    if (n) e !== n.getParticipantIdentity() && n.setParticipant(e, ne(e));
    else {
      if ((u.info('creating new cryptor for', { participantIdentity: e }), !ee))
        throw Error('Missing keyProvider options');
      (n = new X({
        participantIdentity: e,
        keys: ne(e),
        keyProviderOptions: ee,
        sifTrailer: Z,
      })),
        (function (e) {
          e.on(I.Error, (e) => {
            const t = {
              kind: 'error',
              data: {
                error: new Error(
                  ''.concat(v[e.reason], ': ').concat(e.message)
                ),
              },
            };
            postMessage(t);
          });
        })(n),
        Y.push(n);
    }
    return n;
  }
  function ne(e) {
    if ($) return re();
    let t = Q.get(e);
    return t || ((t = new W(e, ee)), t.on(m.KeyRatcheted, ie), Q.set(e, t)), t;
  }
  function re() {
    return (
      J ||
        (u.debug('creating new shared key handler'),
        (J = new W('shared-key', ee))),
      J
    );
  }
  function ie(e, t, n) {
    postMessage({
      kind: 'ratchetKey',
      data: { participantIdentity: t, keyIndex: n, material: e },
    });
  }
  u.setDefaultLevel('info'),
    (onmessage = (t) => {
      const { kind: n, data: r } = t.data;
      switch (n) {
        case 'init':
          u.setLevel(r.loglevel),
            u.info('worker initialized'),
            (ee = r.keyProviderOptions),
            ($ = !!r.keyProviderOptions.sharedKey);
          postMessage({ kind: 'initAck', data: { enabled: false } });
          break;
        case 'enable':
          (a = r.enabled),
            (c = r.participantIdentity),
            u.debug('setting encryption enabled for all tracks of '.concat(c), {
              enable: a,
            }),
            q.set(c, a),
            u.info('updated e2ee enabled status'),
            postMessage(t.data);
          break;
        case 'decode':
          te(r.participantIdentity, r.trackId).setupTransform(
            n,
            r.readableStream,
            r.writableStream,
            r.trackId,
            r.codec
          );
          break;
        case 'encode':
          te(r.participantIdentity, r.trackId).setupTransform(
            n,
            r.readableStream,
            r.writableStream,
            r.trackId,
            r.codec
          );
          break;
        case 'setKey':
          $
            ? ((o = r.key),
              (s = r.keyIndex),
              u.info('set shared key', { index: s }),
              re().setKey(o, s))
            : r.participantIdentity
              ? (u.info(
                  'set participant sender key '
                    .concat(r.participantIdentity, ' index ')
                    .concat(r.keyIndex)
                ),
                ne(r.participantIdentity).setKey(r.key, r.keyIndex))
              : u.error(
                  'no participant Id was provided and shared key usage is disabled'
                );
          break;
        case 'removeTransform':
          !(function (e, t) {
            const n = Y.find(
              (n) => n.getParticipantIdentity() === t && n.getTrackId() === e
            );
            n
              ? n.unsetParticipant()
              : u.warn('Could not unset participant on cryptor', {
                  trackId: e,
                  participantIdentity: t,
                });
          })(r.trackId, r.participantIdentity);
          break;
        case 'updateCodec':
          te(r.participantIdentity, r.trackId).setVideoCodec(r.codec);
          break;
        case 'setRTPMap':
          Y.forEach((e) => {
            e.getParticipantIdentity() === r.participantIdentity &&
              e.setRtpMap(r.map);
          });
          break;
        case 'ratchetRequest':
          !(function (t) {
            e(this, void 0, void 0, function* () {
              if ($) {
                const e = re();
                yield e.ratchetKey(t.keyIndex), e.resetKeyStatus();
              } else if (t.participantIdentity) {
                const e = ne(t.participantIdentity);
                yield e.ratchetKey(t.keyIndex), e.resetKeyStatus();
              } else
                u.error(
                  'no participant Id was provided for ratchet request and shared key usage is disabled'
                );
            });
          })(r);
          break;
        case 'setSifTrailer':
          (i = r.trailer),
            (Z = i),
            Y.forEach((e) => {
              e.setSifTrailer(i);
            });
      }
      var i, o, s, a, c;
    }),
    self.RTCTransformEvent &&
      (u.debug('setup transform event'),
      (self.onrtctransform = (e) => {
        const t = e.transformer;
        u.debug('transformer', t), (t.handled = !0);
        const {
            kind: n,
            participantIdentity: r,
            trackId: i,
            codec: o,
          } = t.options,
          s = te(r, i);
        u.debug('transform', { codec: o }),
          s.setupTransform(n, t.readable, t.writable, i, o);
      }));
});
//# sourceMappingURL=livekit-client.e2ee.worker.js.map
