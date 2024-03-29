/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/@algolia/autocomplete-js@1.9.2/dist/umd/index.production.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*! @algolia/autocomplete-js 1.9.2 | MIT License | © Algolia, Inc. and contributors | https://github.com/algolia/autocomplete */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(
        ((e = "undefined" != typeof globalThis ? globalThis : e || self)[
          "@algolia/autocomplete-js"
        ] = {})
      );
})(this, function (e) {
  "use strict";
  function t(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function n(e) {
    for (var n = 1; n < arguments.length; n++) {
      var r = null != arguments[n] ? arguments[n] : {};
      n % 2
        ? t(Object(r), !0).forEach(function (t) {
            o(e, t, r[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : t(Object(r)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
          });
    }
    return e;
  }
  function r(e) {
    return (
      (r =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      r(e)
    );
  }
  function o(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" != typeof e || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" != typeof r) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" == typeof t ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function i() {
    return (
      (i = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          }),
      i.apply(this, arguments)
    );
  }
  function u(e, t) {
    if (null == e) return {};
    var n,
      r,
      o = (function (e, t) {
        if (null == e) return {};
        var n,
          r,
          o = {},
          i = Object.keys(e);
        for (r = 0; r < i.length; r++)
          (n = i[r]), t.indexOf(n) >= 0 || (o[n] = e[n]);
        return o;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++)
        (n = i[r]),
          t.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n]));
    }
    return o;
  }
  function a(e, t) {
    return (
      (function (e) {
        if (Array.isArray(e)) return e;
      })(e) ||
      (function (e, t) {
        var n =
          null == e
            ? null
            : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
              e["@@iterator"];
        if (null != n) {
          var r,
            o,
            i,
            u,
            a = [],
            c = !0,
            l = !1;
          try {
            if (((i = (n = n.call(e)).next), 0 === t)) {
              if (Object(n) !== n) return;
              c = !1;
            } else
              for (
                ;
                !(c = (r = i.call(n)).done) &&
                (a.push(r.value), a.length !== t);
                c = !0
              );
          } catch (e) {
            (l = !0), (o = e);
          } finally {
            try {
              if (!c && null != n.return && ((u = n.return()), Object(u) !== u))
                return;
            } finally {
              if (l) throw o;
            }
          }
          return a;
        }
      })(e, t) ||
      l(e, t) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function c(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return s(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      l(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function l(e, t) {
    if (e) {
      if ("string" == typeof e) return s(e, t);
      var n = Object.prototype.toString.call(e).slice(8, -1);
      return (
        "Object" === n && e.constructor && (n = e.constructor.name),
        "Map" === n || "Set" === n
          ? Array.from(e)
          : "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          ? s(e, t)
          : void 0
      );
    }
  }
  function s(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function f(e) {
    return { current: e };
  }
  function p(e, t) {
    var n = void 0;
    return function () {
      for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++)
        o[i] = arguments[i];
      n && clearTimeout(n),
        (n = setTimeout(function () {
          return e.apply(void 0, o);
        }, t));
    };
  }
  function m(e) {
    return e.reduce(function (e, t) {
      return e.concat(t);
    }, []);
  }
  var v = 0;
  function d() {
    return "autocomplete-".concat(v++);
  }
  function y(e, t) {
    return t.reduce(function (e, t) {
      return e && e[t];
    }, e);
  }
  function b(e) {
    return 0 === e.collections.length
      ? 0
      : e.collections.reduce(function (e, t) {
          return e + t.items.length;
        }, 0);
  }
  function g(e) {
    return e !== Object(e);
  }
  function h(e, t) {
    if (e === t) return !0;
    if (g(e) || g(t) || "function" == typeof e || "function" == typeof t)
      return e === t;
    if (Object.keys(e).length !== Object.keys(t).length) return !1;
    for (var n = 0, r = Object.keys(e); n < r.length; n++) {
      var o = r[n];
      if (!(o in t)) return !1;
      if (!h(e[o], t[o])) return !1;
    }
    return !0;
  }
  var O = function () {};
  var _ = "1.9.2",
    S = [{ segment: "autocomplete-core", version: _ }];
  function j(e) {
    var t = e.item,
      n = e.items;
    return {
      index: t.__autocomplete_indexName,
      items: [t],
      positions: [
        1 +
          n.findIndex(function (e) {
            return e.objectID === t.objectID;
          }),
      ],
      queryID: t.__autocomplete_queryID,
      algoliaSource: ["autocomplete"],
    };
  }
  function P(e, t) {
    return (
      (function (e) {
        if (Array.isArray(e)) return e;
      })(e) ||
      (function (e, t) {
        var n =
          null == e
            ? null
            : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
              e["@@iterator"];
        if (null != n) {
          var r,
            o,
            i,
            u,
            a = [],
            c = !0,
            l = !1;
          try {
            if (((i = (n = n.call(e)).next), 0 === t)) {
              if (Object(n) !== n) return;
              c = !1;
            } else
              for (
                ;
                !(c = (r = i.call(n)).done) &&
                (a.push(r.value), a.length !== t);
                c = !0
              );
          } catch (e) {
            (l = !0), (o = e);
          } finally {
            try {
              if (!c && null != n.return && ((u = n.return()), Object(u) !== u))
                return;
            } finally {
              if (l) throw o;
            }
          }
          return a;
        }
      })(e, t) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return w(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return w(e, t);
      })(e, t) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function w(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  var I = ["items"],
    E = ["items"];
  function A(e) {
    return (
      (A =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      A(e)
    );
  }
  function D(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return C(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return C(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return C(e, t);
      })(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function C(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function k(e, t) {
    if (null == e) return {};
    var n,
      r,
      o = (function (e, t) {
        if (null == e) return {};
        var n,
          r,
          o = {},
          i = Object.keys(e);
        for (r = 0; r < i.length; r++)
          (n = i[r]), t.indexOf(n) >= 0 || (o[n] = e[n]);
        return o;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++)
        (n = i[r]),
          t.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n]));
    }
    return o;
  }
  function x(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function N(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? x(Object(n), !0).forEach(function (t) {
            T(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : x(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function T(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== A(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== A(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === A(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function q(e) {
    for (
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 20,
        n = [],
        r = 0;
      r < e.objectIDs.length;
      r += t
    )
      n.push(N(N({}, e), {}, { objectIDs: e.objectIDs.slice(r, r + t) }));
    return n;
  }
  function R(e) {
    return e.map(function (e) {
      var t = e.items,
        n = k(e, I);
      return N(
        N({}, n),
        {},
        {
          objectIDs:
            (null == t
              ? void 0
              : t.map(function (e) {
                  return e.objectID;
                })) || n.objectIDs,
        }
      );
    });
  }
  function B(e) {
    var t,
      n,
      r,
      o =
        ((t = P((e.version || "").split(".").map(Number), 2)),
        (n = t[0]),
        (r = t[1]),
        n >= 3 || (2 === n && r >= 4) || (1 === n && r >= 10));
    function i(t, n, r) {
      if (o && void 0 !== r) {
        var i = r[0].__autocomplete_algoliaCredentials,
          u = {
            "X-Algolia-Application-Id": i.appId,
            "X-Algolia-API-Key": i.apiKey,
          };
        e.apply(void 0, [t].concat(D(n), [{ headers: u }]));
      } else e.apply(void 0, [t].concat(D(n)));
    }
    return {
      init: function (t, n) {
        e("init", { appId: t, apiKey: n });
      },
      setUserToken: function (t) {
        e("setUserToken", t);
      },
      clickedObjectIDsAfterSearch: function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        t.length > 0 && i("clickedObjectIDsAfterSearch", R(t), t[0].items);
      },
      clickedObjectIDs: function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        t.length > 0 && i("clickedObjectIDs", R(t), t[0].items);
      },
      clickedFilters: function () {
        for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
          n[r] = arguments[r];
        n.length > 0 && e.apply(void 0, ["clickedFilters"].concat(n));
      },
      convertedObjectIDsAfterSearch: function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        t.length > 0 && i("convertedObjectIDsAfterSearch", R(t), t[0].items);
      },
      convertedObjectIDs: function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        t.length > 0 && i("convertedObjectIDs", R(t), t[0].items);
      },
      convertedFilters: function () {
        for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
          n[r] = arguments[r];
        n.length > 0 && e.apply(void 0, ["convertedFilters"].concat(n));
      },
      viewedObjectIDs: function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        t.length > 0 &&
          t
            .reduce(function (e, t) {
              var n = t.items,
                r = k(t, E);
              return [].concat(
                D(e),
                D(
                  q(
                    N(
                      N({}, r),
                      {},
                      {
                        objectIDs:
                          (null == n
                            ? void 0
                            : n.map(function (e) {
                                return e.objectID;
                              })) || r.objectIDs,
                      }
                    )
                  ).map(function (e) {
                    return { items: n, payload: e };
                  })
                )
              );
            }, [])
            .forEach(function (e) {
              var t = e.items;
              return i("viewedObjectIDs", [e.payload], t);
            });
      },
      viewedFilters: function () {
        for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
          n[r] = arguments[r];
        n.length > 0 && e.apply(void 0, ["viewedFilters"].concat(n));
      },
    };
  }
  function F(e) {
    var t = e.items.reduce(function (e, t) {
      var n;
      return (
        (e[t.__autocomplete_indexName] = (
          null !== (n = e[t.__autocomplete_indexName]) && void 0 !== n ? n : []
        ).concat(t)),
        e
      );
    }, {});
    return Object.keys(t).map(function (e) {
      return { index: e, items: t[e], algoliaSource: ["autocomplete"] };
    });
  }
  function L(e) {
    return e.objectID && e.__autocomplete_indexName && e.__autocomplete_queryID;
  }
  function U(e) {
    return (
      (U =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      U(e)
    );
  }
  function M(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return H(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return H(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return H(e, t);
      })(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function H(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function V(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function W(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? V(Object(n), !0).forEach(function (t) {
            Q(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : V(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function Q(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== U(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== U(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === U(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var K = "2.6.0",
    $ = "https://cdn.jsdelivr.net/npm/search-insights@".concat(
      K,
      "/dist/search-insights.min.js"
    ),
    z = p(function (e) {
      var t = e.onItemsChange,
        n = e.items,
        r = e.insights,
        o = e.state;
      t({
        insights: r,
        insightsEvents: F({ items: n }).map(function (e) {
          return W({ eventName: "Items Viewed" }, e);
        }),
        state: o,
      });
    }, 400);
  function G(e) {
    var t = (function (e) {
        return W(
          {
            onItemsChange: function (e) {
              var t = e.insights,
                n = e.insightsEvents;
              t.viewedObjectIDs.apply(
                t,
                M(
                  n.map(function (e) {
                    return W(
                      W({}, e),
                      {},
                      {
                        algoliaSource: [].concat(M(e.algoliaSource || []), [
                          "autocomplete-internal",
                        ]),
                      }
                    );
                  })
                )
              );
            },
            onSelect: function (e) {
              var t = e.insights,
                n = e.insightsEvents;
              t.clickedObjectIDsAfterSearch.apply(
                t,
                M(
                  n.map(function (e) {
                    return W(
                      W({}, e),
                      {},
                      {
                        algoliaSource: [].concat(M(e.algoliaSource || []), [
                          "autocomplete-internal",
                        ]),
                      }
                    );
                  })
                )
              );
            },
            onActive: O,
          },
          e
        );
      })(e),
      n = t.insightsClient,
      r = t.onItemsChange,
      o = t.onSelect,
      i = t.onActive,
      u = n;
    n ||
      (function (e) {
        if ("undefined" != typeof window) e({ window: window });
      })(function (e) {
        var t = e.window,
          n = t.AlgoliaAnalyticsObject || "aa";
        "string" == typeof n && (u = t[n]),
          u ||
            ((t.AlgoliaAnalyticsObject = n),
            t[n] ||
              (t[n] = function () {
                t[n].queue || (t[n].queue = []);
                for (
                  var e = arguments.length, r = new Array(e), o = 0;
                  o < e;
                  o++
                )
                  r[o] = arguments[o];
                t[n].queue.push(r);
              }),
            (t[n].version = K),
            (u = t[n]),
            (function (e) {
              var t =
                "[Autocomplete]: Could not load search-insights.js. Please load it manually following https://alg.li/insights-autocomplete";
              try {
                var n = e.document.createElement("script");
                (n.async = !0),
                  (n.src = $),
                  (n.onerror = function () {
                    console.error(t);
                  }),
                  document.body.appendChild(n);
              } catch (e) {
                console.error(t);
              }
            })(t));
      });
    var a = B(u),
      c = f([]),
      l = p(function (e) {
        var t = e.state;
        if (t.isOpen) {
          var n = t.collections
            .reduce(function (e, t) {
              return [].concat(M(e), M(t.items));
            }, [])
            .filter(L);
          h(
            c.current.map(function (e) {
              return e.objectID;
            }),
            n.map(function (e) {
              return e.objectID;
            })
          ) ||
            ((c.current = n),
            n.length > 0 &&
              z({ onItemsChange: r, items: n, insights: a, state: t }));
        }
      }, 0);
    return {
      name: "aa.algoliaInsightsPlugin",
      subscribe: function (e) {
        var t = e.setContext,
          n = e.onSelect,
          r = e.onActive;
        u("addAlgoliaAgent", "insights-plugin"),
          t({
            algoliaInsightsPlugin: {
              __algoliaSearchParameters: { clickAnalytics: !0 },
              insights: a,
            },
          }),
          n(function (e) {
            var t = e.item,
              n = e.state,
              r = e.event;
            L(t) &&
              o({
                state: n,
                event: r,
                insights: a,
                item: t,
                insightsEvents: [
                  W(
                    { eventName: "Item Selected" },
                    j({ item: t, items: c.current })
                  ),
                ],
              });
          }),
          r(function (e) {
            var t = e.item,
              n = e.state,
              r = e.event;
            L(t) &&
              i({
                state: n,
                event: r,
                insights: a,
                item: t,
                insightsEvents: [
                  W(
                    { eventName: "Item Active" },
                    j({ item: t, items: c.current })
                  ),
                ],
              });
          });
      },
      onStateChange: function (e) {
        var t = e.state;
        l({ state: t });
      },
      __autocomplete_pluginOptions: e,
    };
  }
  function J(e, t) {
    var n = t;
    return {
      then: function (t, r) {
        return J(e.then(Y(t, n, e), Y(r, n, e)), n);
      },
      catch: function (t) {
        return J(e.catch(Y(t, n, e)), n);
      },
      finally: function (t) {
        return (
          t && n.onCancelList.push(t),
          J(
            e.finally(
              Y(
                t &&
                  function () {
                    return (n.onCancelList = []), t();
                  },
                n,
                e
              )
            ),
            n
          )
        );
      },
      cancel: function () {
        n.isCanceled = !0;
        var e = n.onCancelList;
        (n.onCancelList = []),
          e.forEach(function (e) {
            e();
          });
      },
      isCanceled: function () {
        return !0 === n.isCanceled;
      },
    };
  }
  function X(e) {
    return J(e, { isCanceled: !1, onCancelList: [] });
  }
  function Y(e, t, n) {
    return e
      ? function (n) {
          return t.isCanceled ? n : e(n);
        }
      : n;
  }
  function Z(e, t, n, r) {
    if (!n) return null;
    if (e < 0 && (null === t || (null !== r && 0 === t))) return n + e;
    var o = (null === t ? -1 : t) + e;
    return o <= -1 || o >= n ? (null === r ? null : 0) : o;
  }
  function ee(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function te(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? ee(Object(n), !0).forEach(function (t) {
            ne(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : ee(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function ne(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== re(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== re(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === re(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function re(e) {
    return (
      (re =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      re(e)
    );
  }
  function oe(e) {
    var t = (function (e) {
      var t = e.collections
        .map(function (e) {
          return e.items.length;
        })
        .reduce(function (e, t, n) {
          var r = (e[n - 1] || 0) + t;
          return e.push(r), e;
        }, [])
        .reduce(function (t, n) {
          return n <= e.activeItemId ? t + 1 : t;
        }, 0);
      return e.collections[t];
    })(e);
    if (!t) return null;
    var n =
        t.items[
          (function (e) {
            for (
              var t = e.state, n = e.collection, r = !1, o = 0, i = 0;
              !1 === r;

            ) {
              var u = t.collections[o];
              if (u === n) {
                r = !0;
                break;
              }
              (i += u.items.length), o++;
            }
            return t.activeItemId - i;
          })({ state: e, collection: t })
        ],
      r = t.source;
    return {
      item: n,
      itemInputValue: r.getItemInputValue({ item: n, state: e }),
      itemUrl: r.getItemUrl({ item: n, state: e }),
      source: r,
    };
  }
  var ie = /((gt|sm)-|galaxy nexus)|samsung[- ]/i;
  function ue(e) {
    return (
      (ue =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      ue(e)
    );
  }
  function ae(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function ce(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? ae(Object(n), !0).forEach(function (t) {
            le(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : ae(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function le(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== ue(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== ue(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === ue(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function se(e) {
    return (
      (se =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      se(e)
    );
  }
  function fe(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function pe(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== se(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== se(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === se(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function me(e, t, n) {
    var r,
      o = t.initialState;
    return {
      getState: function () {
        return o;
      },
      dispatch: function (r, i) {
        var u = (function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? fe(Object(n), !0).forEach(function (t) {
                  pe(e, t, n[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : fe(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
          }
          return e;
        })({}, o);
        (o = e(o, { type: r, props: t, payload: i })),
          n({ state: o, prevState: u });
      },
      pendingRequests:
        ((r = []),
        {
          add: function (e) {
            return (
              r.push(e),
              e.finally(function () {
                r = r.filter(function (t) {
                  return t !== e;
                });
              })
            );
          },
          cancelAll: function () {
            r.forEach(function (e) {
              return e.cancel();
            });
          },
          isEmpty: function () {
            return 0 === r.length;
          },
        }),
    };
  }
  function ve(e) {
    return (
      (ve =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      ve(e)
    );
  }
  function de(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function ye(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? de(Object(n), !0).forEach(function (t) {
            be(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : de(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function be(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== ve(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== ve(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === ve(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function ge(e) {
    return (
      (ge =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      ge(e)
    );
  }
  function he(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return Oe(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return Oe(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return Oe(e, t);
      })(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function Oe(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function _e(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function Se(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? _e(Object(n), !0).forEach(function (t) {
            je(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : _e(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function je(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== ge(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== ge(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === ge(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function Pe(e, t) {
    var n,
      r = "undefined" != typeof window ? window : {},
      o = e.plugins || [];
    return Se(
      Se(
        {
          debug: !1,
          openOnFocus: !1,
          placeholder: "",
          autoFocus: !1,
          defaultActiveItemId: null,
          stallThreshold: 300,
          insights: !1,
          environment: r,
          shouldPanelOpen: function (e) {
            return b(e.state) > 0;
          },
          reshape: function (e) {
            return e.sources;
          },
        },
        e
      ),
      {},
      {
        id: null !== (n = e.id) && void 0 !== n ? n : d(),
        plugins: o,
        initialState: Se(
          {
            activeItemId: null,
            query: "",
            completion: null,
            collections: [],
            isOpen: !1,
            status: "idle",
            context: {},
          },
          e.initialState
        ),
        onStateChange: function (t) {
          var n;
          null === (n = e.onStateChange) || void 0 === n || n.call(e, t),
            o.forEach(function (e) {
              var n;
              return null === (n = e.onStateChange) || void 0 === n
                ? void 0
                : n.call(e, t);
            });
        },
        onSubmit: function (t) {
          var n;
          null === (n = e.onSubmit) || void 0 === n || n.call(e, t),
            o.forEach(function (e) {
              var n;
              return null === (n = e.onSubmit) || void 0 === n
                ? void 0
                : n.call(e, t);
            });
        },
        onReset: function (t) {
          var n;
          null === (n = e.onReset) || void 0 === n || n.call(e, t),
            o.forEach(function (e) {
              var n;
              return null === (n = e.onReset) || void 0 === n
                ? void 0
                : n.call(e, t);
            });
        },
        getSources: function (n) {
          return Promise.all(
            []
              .concat(
                he(
                  o.map(function (e) {
                    return e.getSources;
                  })
                ),
                [e.getSources]
              )
              .filter(Boolean)
              .map(function (e) {
                return (function (e, t) {
                  var n = [];
                  return Promise.resolve(e(t)).then(function (e) {
                    return Promise.all(
                      e
                        .filter(function (e) {
                          return Boolean(e);
                        })
                        .map(function (e) {
                          if ((e.sourceId, n.includes(e.sourceId)))
                            throw new Error(
                              "[Autocomplete] The `sourceId` ".concat(
                                JSON.stringify(e.sourceId),
                                " is not unique."
                              )
                            );
                          n.push(e.sourceId);
                          var t = {
                            getItemInputValue: function (e) {
                              return e.state.query;
                            },
                            getItemUrl: function () {},
                            onSelect: function (e) {
                              (0, e.setIsOpen)(!1);
                            },
                            onActive: O,
                            onResolve: O,
                          };
                          Object.keys(t).forEach(function (e) {
                            t[e].__default = !0;
                          });
                          var r = te(te({}, t), e);
                          return Promise.resolve(r);
                        })
                    );
                  });
                })(e, n);
              })
          )
            .then(function (e) {
              return m(e);
            })
            .then(function (e) {
              return e.map(function (e) {
                return Se(
                  Se({}, e),
                  {},
                  {
                    onSelect: function (n) {
                      e.onSelect(n),
                        t.forEach(function (e) {
                          var t;
                          return null === (t = e.onSelect) || void 0 === t
                            ? void 0
                            : t.call(e, n);
                        });
                    },
                    onActive: function (n) {
                      e.onActive(n),
                        t.forEach(function (e) {
                          var t;
                          return null === (t = e.onActive) || void 0 === t
                            ? void 0
                            : t.call(e, n);
                        });
                    },
                    onResolve: function (n) {
                      e.onResolve(n),
                        t.forEach(function (e) {
                          var t;
                          return null === (t = e.onResolve) || void 0 === t
                            ? void 0
                            : t.call(e, n);
                        });
                    },
                  }
                );
              });
            });
        },
        navigator: Se(
          {
            navigate: function (e) {
              var t = e.itemUrl;
              r.location.assign(t);
            },
            navigateNewTab: function (e) {
              var t = e.itemUrl,
                n = r.open(t, "_blank", "noopener");
              null == n || n.focus();
            },
            navigateNewWindow: function (e) {
              var t = e.itemUrl;
              r.open(t, "_blank", "noopener");
            },
          },
          e.navigator
        ),
      }
    );
  }
  function we(e) {
    return (
      (we =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      we(e)
    );
  }
  function Ie(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function Ee(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? Ie(Object(n), !0).forEach(function (t) {
            Ae(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Ie(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function Ae(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== we(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== we(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === we(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function De(e) {
    return (
      (De =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      De(e)
    );
  }
  function Ce(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function ke(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? Ce(Object(n), !0).forEach(function (t) {
            xe(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Ce(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function xe(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== De(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== De(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === De(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function Ne(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return Te(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return Te(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return Te(e, t);
      })(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function Te(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function qe(e) {
    return Boolean(e.execute);
  }
  function Re(e, t, n) {
    if (((o = e), Boolean(null == o ? void 0 : o.execute))) {
      var r =
        "algolia" === e.requesterId
          ? Object.assign.apply(
              Object,
              [{}].concat(
                Ne(
                  Object.keys(n.context).map(function (e) {
                    var t;
                    return null === (t = n.context[e]) || void 0 === t
                      ? void 0
                      : t.__algoliaSearchParameters;
                  })
                )
              )
            )
          : {};
      return ke(
        ke({}, e),
        {},
        {
          requests: e.queries.map(function (n) {
            return {
              query:
                "algolia" === e.requesterId
                  ? ke(ke({}, n), {}, { params: ke(ke({}, r), n.params) })
                  : n,
              sourceId: t,
              transformResponse: e.transformResponse,
            };
          }),
        }
      );
    }
    var o;
    return { items: e, sourceId: t };
  }
  function Be(e) {
    var t = e
      .reduce(function (e, t) {
        if (!qe(t)) return e.push(t), e;
        var n = t.searchClient,
          r = t.execute,
          o = t.requesterId,
          i = t.requests,
          u = e.find(function (e) {
            return (
              qe(t) &&
              qe(e) &&
              e.searchClient === n &&
              Boolean(o) &&
              e.requesterId === o
            );
          });
        if (u) {
          var a;
          (a = u.items).push.apply(a, Ne(i));
        } else {
          var c = { execute: r, requesterId: o, items: i, searchClient: n };
          e.push(c);
        }
        return e;
      }, [])
      .map(function (e) {
        if (!qe(e)) return Promise.resolve(e);
        var t = e,
          n = t.execute,
          r = t.items;
        return n({ searchClient: t.searchClient, requests: r });
      });
    return Promise.all(t).then(function (e) {
      return m(e);
    });
  }
  function Fe(e, t, n) {
    return t.map(function (t) {
      var r = e.filter(function (e) {
          return e.sourceId === t.sourceId;
        }),
        o = r.map(function (e) {
          return e.items;
        }),
        i = r[0].transformResponse,
        u = i
          ? i(
              (function (e) {
                var t = e.map(function (e) {
                  var t;
                  return ce(
                    ce({}, e),
                    {},
                    {
                      hits:
                        null === (t = e.hits) || void 0 === t
                          ? void 0
                          : t.map(function (t) {
                              return ce(
                                ce({}, t),
                                {},
                                {
                                  __autocomplete_indexName: e.index,
                                  __autocomplete_queryID: e.queryID,
                                }
                              );
                            }),
                    }
                  );
                });
                return {
                  results: t,
                  hits: t
                    .map(function (e) {
                      return e.hits;
                    })
                    .filter(Boolean),
                  facetHits: t
                    .map(function (e) {
                      var t;
                      return null === (t = e.facetHits) || void 0 === t
                        ? void 0
                        : t.map(function (e) {
                            return {
                              label: e.value,
                              count: e.count,
                              _highlightResult: {
                                label: { value: e.highlighted },
                              },
                            };
                          });
                    })
                    .filter(Boolean),
                };
              })(o)
            )
          : o;
      return (
        t.onResolve({ source: t, results: o, items: u, state: n.getState() }),
        u.every(Boolean),
        'The `getItems` function from source "'
          .concat(t.sourceId, '" must return an array of items but returned ')
          .concat(
            JSON.stringify(void 0),
            ".\n\nDid you forget to return items?\n\nSee: https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/#param-getitems"
          ),
        { source: t, items: u }
      );
    });
  }
  function Le(e) {
    return (
      (Le =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      Le(e)
    );
  }
  var Ue = ["event", "nextState", "props", "query", "refresh", "store"];
  function Me(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function He(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? Me(Object(n), !0).forEach(function (t) {
            Ve(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Me(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function Ve(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== Le(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== Le(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === Le(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function We(e, t) {
    if (null == e) return {};
    var n,
      r,
      o = (function (e, t) {
        if (null == e) return {};
        var n,
          r,
          o = {},
          i = Object.keys(e);
        for (r = 0; r < i.length; r++)
          (n = i[r]), t.indexOf(n) >= 0 || (o[n] = e[n]);
        return o;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++)
        (n = i[r]),
          t.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n]));
    }
    return o;
  }
  var Qe,
    Ke,
    $e,
    ze = null,
    Ge =
      ((Qe = -1),
      (Ke = -1),
      ($e = void 0),
      function (e) {
        var t = ++Qe;
        return Promise.resolve(e).then(function (e) {
          return $e && t < Ke ? $e : ((Ke = t), ($e = e), e);
        });
      });
  function Je(e) {
    var t = e.event,
      n = e.nextState,
      r = void 0 === n ? {} : n,
      o = e.props,
      i = e.query,
      u = e.refresh,
      a = e.store,
      c = We(e, Ue);
    ze && o.environment.clearTimeout(ze);
    var l = c.setCollections,
      s = c.setIsOpen,
      f = c.setQuery,
      p = c.setActiveItemId,
      v = c.setStatus;
    if ((f(i), p(o.defaultActiveItemId), !i && !1 === o.openOnFocus)) {
      var d,
        y = a.getState().collections.map(function (e) {
          return He(He({}, e), {}, { items: [] });
        });
      v("idle"),
        l(y),
        s(
          null !== (d = r.isOpen) && void 0 !== d
            ? d
            : o.shouldPanelOpen({ state: a.getState() })
        );
      var b = X(
        Ge(y).then(function () {
          return Promise.resolve();
        })
      );
      return a.pendingRequests.add(b);
    }
    v("loading"),
      (ze = o.environment.setTimeout(function () {
        v("stalled");
      }, o.stallThreshold));
    var g = X(
      Ge(
        o
          .getSources(He({ query: i, refresh: u, state: a.getState() }, c))
          .then(function (e) {
            return Promise.all(
              e.map(function (e) {
                return Promise.resolve(
                  e.getItems(
                    He({ query: i, refresh: u, state: a.getState() }, c)
                  )
                ).then(function (t) {
                  return Re(t, e.sourceId, a.getState());
                });
              })
            )
              .then(Be)
              .then(function (t) {
                return Fe(t, e, a);
              })
              .then(function (e) {
                return (function (e) {
                  var t = e.collections,
                    n = e.props,
                    r = e.state,
                    o = t.reduce(function (e, t) {
                      return Ee(
                        Ee({}, e),
                        {},
                        Ae(
                          {},
                          t.source.sourceId,
                          Ee(
                            Ee({}, t.source),
                            {},
                            {
                              getItems: function () {
                                return m(t.items);
                              },
                            }
                          )
                        )
                      );
                    }, {}),
                    i = n.plugins.reduce(
                      function (e, t) {
                        return t.reshape ? t.reshape(e) : e;
                      },
                      { sourcesBySourceId: o, state: r }
                    ).sourcesBySourceId;
                  return m(
                    n.reshape({
                      sourcesBySourceId: i,
                      sources: Object.values(i),
                      state: r,
                    })
                  )
                    .filter(Boolean)
                    .map(function (e) {
                      return { source: e, items: e.getItems() };
                    });
                })({ collections: e, props: o, state: a.getState() });
              });
          })
      )
    )
      .then(function (e) {
        var n;
        v("idle"), l(e);
        var f = o.shouldPanelOpen({ state: a.getState() });
        s(
          null !== (n = r.isOpen) && void 0 !== n
            ? n
            : (o.openOnFocus && !i && f) || f
        );
        var p = oe(a.getState());
        if (null !== a.getState().activeItemId && p) {
          var m = p.item,
            d = p.itemInputValue,
            y = p.itemUrl,
            b = p.source;
          b.onActive(
            He(
              {
                event: t,
                item: m,
                itemInputValue: d,
                itemUrl: y,
                refresh: u,
                source: b,
                state: a.getState(),
              },
              c
            )
          );
        }
      })
      .finally(function () {
        v("idle"), ze && o.environment.clearTimeout(ze);
      });
    return a.pendingRequests.add(g);
  }
  function Xe(e) {
    return (
      (Xe =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      Xe(e)
    );
  }
  var Ye = ["event", "props", "refresh", "store"];
  function Ze(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function et(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? Ze(Object(n), !0).forEach(function (t) {
            tt(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Ze(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function tt(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== Xe(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== Xe(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === Xe(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function nt(e, t) {
    if (null == e) return {};
    var n,
      r,
      o = (function (e, t) {
        if (null == e) return {};
        var n,
          r,
          o = {},
          i = Object.keys(e);
        for (r = 0; r < i.length; r++)
          (n = i[r]), t.indexOf(n) >= 0 || (o[n] = e[n]);
        return o;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++)
        (n = i[r]),
          t.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n]));
    }
    return o;
  }
  function rt(e) {
    return (
      (rt =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      rt(e)
    );
  }
  var ot = ["props", "refresh", "store"],
    it = ["inputElement", "formElement", "panelElement"],
    ut = ["inputElement"],
    at = ["inputElement", "maxLength"],
    ct = ["sourceIndex"],
    lt = ["sourceIndex"],
    st = ["item", "source", "sourceIndex"];
  function ft(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function pt(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? ft(Object(n), !0).forEach(function (t) {
            mt(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : ft(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function mt(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== rt(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== rt(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === rt(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function vt(e, t) {
    if (null == e) return {};
    var n,
      r,
      o = (function (e, t) {
        if (null == e) return {};
        var n,
          r,
          o = {},
          i = Object.keys(e);
        for (r = 0; r < i.length; r++)
          (n = i[r]), t.indexOf(n) >= 0 || (o[n] = e[n]);
        return o;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++)
        (n = i[r]),
          t.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n]));
    }
    return o;
  }
  function dt(e) {
    var t = e.props,
      n = e.refresh,
      r = e.store,
      o = vt(e, ot),
      i = function (e, t) {
        return void 0 !== t ? "".concat(e, "-").concat(t) : e;
      };
    return {
      getEnvironmentProps: function (e) {
        var n = e.inputElement,
          o = e.formElement,
          i = e.panelElement;
        function u(e) {
          (!r.getState().isOpen && r.pendingRequests.isEmpty()) ||
            e.target === n ||
            (!1 ===
              [o, i].some(function (t) {
                return (n = t), (r = e.target), n === r || n.contains(r);
                var n, r;
              }) &&
              (r.dispatch("blur", null),
              t.debug || r.pendingRequests.cancelAll()));
        }
        return pt(
          {
            onTouchStart: u,
            onMouseDown: u,
            onTouchMove: function (e) {
              !1 !== r.getState().isOpen &&
                n === t.environment.document.activeElement &&
                e.target !== n &&
                n.blur();
            },
          },
          vt(e, it)
        );
      },
      getRootProps: function (e) {
        return pt(
          {
            role: "combobox",
            "aria-expanded": r.getState().isOpen,
            "aria-haspopup": "listbox",
            "aria-owns": r.getState().isOpen
              ? "".concat(t.id, "-list")
              : void 0,
            "aria-labelledby": "".concat(t.id, "-label"),
          },
          e
        );
      },
      getFormProps: function (e) {
        return (
          e.inputElement,
          pt(
            {
              action: "",
              noValidate: !0,
              role: "search",
              onSubmit: function (i) {
                var u;
                i.preventDefault(),
                  t.onSubmit(
                    pt({ event: i, refresh: n, state: r.getState() }, o)
                  ),
                  r.dispatch("submit", null),
                  null === (u = e.inputElement) || void 0 === u || u.blur();
              },
              onReset: function (i) {
                var u;
                i.preventDefault(),
                  t.onReset(
                    pt({ event: i, refresh: n, state: r.getState() }, o)
                  ),
                  r.dispatch("reset", null),
                  null === (u = e.inputElement) || void 0 === u || u.focus();
              },
            },
            vt(e, ut)
          )
        );
      },
      getLabelProps: function (e) {
        var n = e || {},
          r = n.sourceIndex,
          o = vt(n, ct);
        return pt(
          {
            htmlFor: "".concat(i(t.id, r), "-input"),
            id: "".concat(i(t.id, r), "-label"),
          },
          o
        );
      },
      getInputProps: function (e) {
        var i;
        function u(e) {
          (t.openOnFocus || Boolean(r.getState().query)) &&
            Je(
              pt(
                {
                  event: e,
                  props: t,
                  query: r.getState().completion || r.getState().query,
                  refresh: n,
                  store: r,
                },
                o
              )
            ),
            r.dispatch("focus", null);
        }
        var a = e || {};
        a.inputElement;
        var c = a.maxLength,
          l = void 0 === c ? 512 : c,
          s = vt(a, at),
          f = oe(r.getState()),
          p = (function (e) {
            return Boolean(e && e.match(ie));
          })(
            (null === (i = t.environment.navigator) || void 0 === i
              ? void 0
              : i.userAgent) || ""
          ),
          m = null != f && f.itemUrl && !p ? "go" : "search";
        return pt(
          {
            "aria-autocomplete": "both",
            "aria-activedescendant":
              r.getState().isOpen && null !== r.getState().activeItemId
                ? "".concat(t.id, "-item-").concat(r.getState().activeItemId)
                : void 0,
            "aria-controls": r.getState().isOpen
              ? "".concat(t.id, "-list")
              : void 0,
            "aria-labelledby": "".concat(t.id, "-label"),
            value: r.getState().completion || r.getState().query,
            id: "".concat(t.id, "-input"),
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            enterKeyHint: m,
            spellCheck: "false",
            autoFocus: t.autoFocus,
            placeholder: t.placeholder,
            maxLength: l,
            type: "search",
            onChange: function (e) {
              Je(
                pt(
                  {
                    event: e,
                    props: t,
                    query: e.currentTarget.value.slice(0, l),
                    refresh: n,
                    store: r,
                  },
                  o
                )
              );
            },
            onKeyDown: function (e) {
              !(function (e) {
                var t = e.event,
                  n = e.props,
                  r = e.refresh,
                  o = e.store,
                  i = nt(e, Ye);
                if ("ArrowUp" === t.key || "ArrowDown" === t.key) {
                  var u = function () {
                      var e = n.environment.document.getElementById(
                        ""
                          .concat(n.id, "-item-")
                          .concat(o.getState().activeItemId)
                      );
                      e &&
                        (e.scrollIntoViewIfNeeded
                          ? e.scrollIntoViewIfNeeded(!1)
                          : e.scrollIntoView(!1));
                    },
                    a = function () {
                      var e = oe(o.getState());
                      if (null !== o.getState().activeItemId && e) {
                        var n = e.item,
                          u = e.itemInputValue,
                          a = e.itemUrl,
                          c = e.source;
                        c.onActive(
                          et(
                            {
                              event: t,
                              item: n,
                              itemInputValue: u,
                              itemUrl: a,
                              refresh: r,
                              source: c,
                              state: o.getState(),
                            },
                            i
                          )
                        );
                      }
                    };
                  t.preventDefault(),
                    !1 === o.getState().isOpen &&
                    (n.openOnFocus || Boolean(o.getState().query))
                      ? Je(
                          et(
                            {
                              event: t,
                              props: n,
                              query: o.getState().query,
                              refresh: r,
                              store: o,
                            },
                            i
                          )
                        ).then(function () {
                          o.dispatch(t.key, {
                            nextActiveItemId: n.defaultActiveItemId,
                          }),
                            a(),
                            setTimeout(u, 0);
                        })
                      : (o.dispatch(t.key, {}), a(), u());
                } else if ("Escape" === t.key)
                  t.preventDefault(),
                    o.dispatch(t.key, null),
                    o.pendingRequests.cancelAll();
                else if ("Tab" === t.key)
                  o.dispatch("blur", null), o.pendingRequests.cancelAll();
                else if ("Enter" === t.key) {
                  if (
                    null === o.getState().activeItemId ||
                    o.getState().collections.every(function (e) {
                      return 0 === e.items.length;
                    })
                  )
                    return void (n.debug || o.pendingRequests.cancelAll());
                  t.preventDefault();
                  var c = oe(o.getState()),
                    l = c.item,
                    s = c.itemInputValue,
                    f = c.itemUrl,
                    p = c.source;
                  if (t.metaKey || t.ctrlKey)
                    void 0 !== f &&
                      (p.onSelect(
                        et(
                          {
                            event: t,
                            item: l,
                            itemInputValue: s,
                            itemUrl: f,
                            refresh: r,
                            source: p,
                            state: o.getState(),
                          },
                          i
                        )
                      ),
                      n.navigator.navigateNewTab({
                        itemUrl: f,
                        item: l,
                        state: o.getState(),
                      }));
                  else if (t.shiftKey)
                    void 0 !== f &&
                      (p.onSelect(
                        et(
                          {
                            event: t,
                            item: l,
                            itemInputValue: s,
                            itemUrl: f,
                            refresh: r,
                            source: p,
                            state: o.getState(),
                          },
                          i
                        )
                      ),
                      n.navigator.navigateNewWindow({
                        itemUrl: f,
                        item: l,
                        state: o.getState(),
                      }));
                  else if (t.altKey);
                  else {
                    if (void 0 !== f)
                      return (
                        p.onSelect(
                          et(
                            {
                              event: t,
                              item: l,
                              itemInputValue: s,
                              itemUrl: f,
                              refresh: r,
                              source: p,
                              state: o.getState(),
                            },
                            i
                          )
                        ),
                        void n.navigator.navigate({
                          itemUrl: f,
                          item: l,
                          state: o.getState(),
                        })
                      );
                    Je(
                      et(
                        {
                          event: t,
                          nextState: { isOpen: !1 },
                          props: n,
                          query: s,
                          refresh: r,
                          store: o,
                        },
                        i
                      )
                    ).then(function () {
                      p.onSelect(
                        et(
                          {
                            event: t,
                            item: l,
                            itemInputValue: s,
                            itemUrl: f,
                            refresh: r,
                            source: p,
                            state: o.getState(),
                          },
                          i
                        )
                      );
                    });
                  }
                }
              })(pt({ event: e, props: t, refresh: n, store: r }, o));
            },
            onFocus: u,
            onBlur: O,
            onClick: function (n) {
              e.inputElement !== t.environment.document.activeElement ||
                r.getState().isOpen ||
                u(n);
            },
          },
          s
        );
      },
      getPanelProps: function (e) {
        return pt(
          {
            onMouseDown: function (e) {
              e.preventDefault();
            },
            onMouseLeave: function () {
              r.dispatch("mouseleave", null);
            },
          },
          e
        );
      },
      getListProps: function (e) {
        var n = e || {},
          r = n.sourceIndex,
          o = vt(n, lt);
        return pt(
          {
            role: "listbox",
            "aria-labelledby": "".concat(i(t.id, r), "-label"),
            id: "".concat(i(t.id, r), "-list"),
          },
          o
        );
      },
      getItemProps: function (e) {
        var u = e.item,
          a = e.source,
          c = e.sourceIndex,
          l = vt(e, st);
        return pt(
          {
            id: "".concat(i(t.id, c), "-item-").concat(u.__autocomplete_id),
            role: "option",
            "aria-selected": r.getState().activeItemId === u.__autocomplete_id,
            onMouseMove: function (e) {
              if (u.__autocomplete_id !== r.getState().activeItemId) {
                r.dispatch("mousemove", u.__autocomplete_id);
                var t = oe(r.getState());
                if (null !== r.getState().activeItemId && t) {
                  var i = t.item,
                    a = t.itemInputValue,
                    c = t.itemUrl,
                    l = t.source;
                  l.onActive(
                    pt(
                      {
                        event: e,
                        item: i,
                        itemInputValue: a,
                        itemUrl: c,
                        refresh: n,
                        source: l,
                        state: r.getState(),
                      },
                      o
                    )
                  );
                }
              }
            },
            onMouseDown: function (e) {
              e.preventDefault();
            },
            onClick: function (e) {
              var i = a.getItemInputValue({ item: u, state: r.getState() }),
                c = a.getItemUrl({ item: u, state: r.getState() });
              (c
                ? Promise.resolve()
                : Je(
                    pt(
                      {
                        event: e,
                        nextState: { isOpen: !1 },
                        props: t,
                        query: i,
                        refresh: n,
                        store: r,
                      },
                      o
                    )
                  )
              ).then(function () {
                a.onSelect(
                  pt(
                    {
                      event: e,
                      item: u,
                      itemInputValue: i,
                      itemUrl: c,
                      refresh: n,
                      source: a,
                      state: r.getState(),
                    },
                    o
                  )
                );
              });
            },
          },
          l
        );
      },
    };
  }
  function yt(e) {
    return (
      (yt =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      yt(e)
    );
  }
  function bt(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function gt(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? bt(Object(n), !0).forEach(function (t) {
            ht(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : bt(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function ht(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== yt(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== yt(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === yt(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function Ot(e) {
    var t,
      n,
      r,
      o,
      i = e.plugins,
      u = e.options,
      a =
        null ===
          (t = ((null === (n = u.__autocomplete_metadata) || void 0 === n
            ? void 0
            : n.userAgents) || [])[0]) || void 0 === t
          ? void 0
          : t.segment,
      c = a
        ? ht(
            {},
            a,
            Object.keys(
              (null === (r = u.__autocomplete_metadata) || void 0 === r
                ? void 0
                : r.options) || {}
            )
          )
        : {};
    return {
      plugins: i.map(function (e) {
        return {
          name: e.name,
          options: Object.keys(e.__autocomplete_pluginOptions || []),
        };
      }),
      options: gt({ "autocomplete-core": Object.keys(u) }, c),
      ua: S.concat(
        (null === (o = u.__autocomplete_metadata) || void 0 === o
          ? void 0
          : o.userAgents) || []
      ),
    };
  }
  function _t(e) {
    var t,
      n = e.state;
    return !1 === n.isOpen || null === n.activeItemId
      ? null
      : (null === (t = oe(n)) || void 0 === t ? void 0 : t.itemInputValue) ||
          null;
  }
  function St(e) {
    return (
      (St =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      St(e)
    );
  }
  function jt(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function Pt(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? jt(Object(n), !0).forEach(function (t) {
            wt(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : jt(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function wt(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== St(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== St(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === St(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var It = function (e, t) {
    switch (t.type) {
      case "setActiveItemId":
      case "mousemove":
        return Pt(Pt({}, e), {}, { activeItemId: t.payload });
      case "setQuery":
        return Pt(Pt({}, e), {}, { query: t.payload, completion: null });
      case "setCollections":
        return Pt(Pt({}, e), {}, { collections: t.payload });
      case "setIsOpen":
        return Pt(Pt({}, e), {}, { isOpen: t.payload });
      case "setStatus":
        return Pt(Pt({}, e), {}, { status: t.payload });
      case "setContext":
        return Pt(Pt({}, e), {}, { context: Pt(Pt({}, e.context), t.payload) });
      case "ArrowDown":
        var n = Pt(
          Pt({}, e),
          {},
          {
            activeItemId: t.payload.hasOwnProperty("nextActiveItemId")
              ? t.payload.nextActiveItemId
              : Z(1, e.activeItemId, b(e), t.props.defaultActiveItemId),
          }
        );
        return Pt(Pt({}, n), {}, { completion: _t({ state: n }) });
      case "ArrowUp":
        var r = Pt(
          Pt({}, e),
          {},
          {
            activeItemId: Z(
              -1,
              e.activeItemId,
              b(e),
              t.props.defaultActiveItemId
            ),
          }
        );
        return Pt(Pt({}, r), {}, { completion: _t({ state: r }) });
      case "Escape":
        return e.isOpen
          ? Pt(
              Pt({}, e),
              {},
              { activeItemId: null, isOpen: !1, completion: null }
            )
          : Pt(
              Pt({}, e),
              {},
              { activeItemId: null, query: "", status: "idle", collections: [] }
            );
      case "submit":
        return Pt(
          Pt({}, e),
          {},
          { activeItemId: null, isOpen: !1, status: "idle" }
        );
      case "reset":
        return Pt(
          Pt({}, e),
          {},
          {
            activeItemId:
              !0 === t.props.openOnFocus ? t.props.defaultActiveItemId : null,
            status: "idle",
            query: "",
          }
        );
      case "focus":
        return Pt(
          Pt({}, e),
          {},
          {
            activeItemId: t.props.defaultActiveItemId,
            isOpen:
              (t.props.openOnFocus || Boolean(e.query)) &&
              t.props.shouldPanelOpen({ state: e }),
          }
        );
      case "blur":
        return t.props.debug
          ? e
          : Pt(Pt({}, e), {}, { isOpen: !1, activeItemId: null });
      case "mouseleave":
        return Pt(Pt({}, e), {}, { activeItemId: t.props.defaultActiveItemId });
      default:
        return (
          "The reducer action ".concat(
            JSON.stringify(t.type),
            " is not supported."
          ),
          e
        );
    }
  };
  function Et(e) {
    return (
      (Et =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      Et(e)
    );
  }
  function At(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function Dt(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? At(Object(n), !0).forEach(function (t) {
            Ct(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : At(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function Ct(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== Et(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== Et(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === Et(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function kt(e) {
    var t = [],
      n = Pe(e, t),
      r = me(It, n, function (e) {
        var t = e.prevState,
          r = e.state;
        n.onStateChange(
          Dt({ prevState: t, state: r, refresh: u, navigator: n.navigator }, o)
        );
      }),
      o = (function (e) {
        var t = e.store;
        return {
          setActiveItemId: function (e) {
            t.dispatch("setActiveItemId", e);
          },
          setQuery: function (e) {
            t.dispatch("setQuery", e);
          },
          setCollections: function (e) {
            var n = 0,
              r = e.map(function (e) {
                return ye(
                  ye({}, e),
                  {},
                  {
                    items: m(e.items).map(function (e) {
                      return ye(ye({}, e), {}, { __autocomplete_id: n++ });
                    }),
                  }
                );
              });
            t.dispatch("setCollections", r);
          },
          setIsOpen: function (e) {
            t.dispatch("setIsOpen", e);
          },
          setStatus: function (e) {
            t.dispatch("setStatus", e);
          },
          setContext: function (e) {
            t.dispatch("setContext", e);
          },
        };
      })({ store: r }),
      i = dt(Dt({ props: n, refresh: u, store: r, navigator: n.navigator }, o));
    function u() {
      return Je(
        Dt(
          {
            event: new Event("input"),
            nextState: { isOpen: r.getState().isOpen },
            props: n,
            navigator: n.navigator,
            query: r.getState().query,
            refresh: u,
            store: r,
          },
          o
        )
      );
    }
    if (
      e.insights &&
      !n.plugins.some(function (e) {
        return "aa.algoliaInsightsPlugin" === e.name;
      })
    ) {
      var a = "boolean" == typeof e.insights ? {} : e.insights;
      n.plugins.push(G(a));
    }
    return (
      n.plugins.forEach(function (e) {
        var r;
        return null === (r = e.subscribe) || void 0 === r
          ? void 0
          : r.call(
              e,
              Dt(
                Dt({}, o),
                {},
                {
                  navigator: n.navigator,
                  refresh: u,
                  onSelect: function (e) {
                    t.push({ onSelect: e });
                  },
                  onActive: function (e) {
                    t.push({ onActive: e });
                  },
                  onResolve: function (e) {
                    t.push({ onResolve: e });
                  },
                }
              )
            );
      }),
      (function (e) {
        var t,
          n,
          r = e.metadata,
          o = e.environment;
        if (
          null === (t = o.navigator) ||
          void 0 === t ||
          null === (n = t.userAgent) ||
          void 0 === n
            ? void 0
            : n.includes("Algolia Crawler")
        ) {
          var i = o.document.createElement("meta"),
            u = o.document.querySelector("head");
          (i.name = "algolia:metadata"),
            setTimeout(function () {
              (i.content = JSON.stringify(r)), u.appendChild(i);
            }, 0);
        }
      })({
        metadata: Ot({ plugins: n.plugins, options: e }),
        environment: n.environment,
      }),
      Dt(Dt({ refresh: u, navigator: n.navigator }, i), o)
    );
  }
  var xt = function (e, t, n, r) {
      var o;
      t[0] = 0;
      for (var i = 1; i < t.length; i++) {
        var u = t[i++],
          a = t[i] ? ((t[0] |= u ? 1 : 2), n[t[i++]]) : t[++i];
        3 === u
          ? (r[0] = a)
          : 4 === u
          ? (r[1] = Object.assign(r[1] || {}, a))
          : 5 === u
          ? ((r[1] = r[1] || {})[t[++i]] = a)
          : 6 === u
          ? (r[1][t[++i]] += a + "")
          : u
          ? ((o = e.apply(a, xt(e, a, n, ["", null]))),
            r.push(o),
            a[0] ? (t[0] |= 2) : ((t[i - 2] = 0), (t[i] = o)))
          : r.push(a);
      }
      return r;
    },
    Nt = new Map();
  function Tt(e) {
    var t = Nt.get(this);
    return (
      t || ((t = new Map()), Nt.set(this, t)),
      (t = xt(
        this,
        t.get(e) ||
          (t.set(
            e,
            (t = (function (e) {
              for (
                var t,
                  n,
                  r = 1,
                  o = "",
                  i = "",
                  u = [0],
                  a = function (e) {
                    1 === r &&
                    (e || (o = o.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))
                      ? u.push(0, e, o)
                      : 3 === r && (e || o)
                      ? (u.push(3, e, o), (r = 2))
                      : 2 === r && "..." === o && e
                      ? u.push(4, e, 0)
                      : 2 === r && o && !e
                      ? u.push(5, 0, !0, o)
                      : r >= 5 &&
                        ((o || (!e && 5 === r)) &&
                          (u.push(r, 0, o, n), (r = 6)),
                        e && (u.push(r, e, 0, n), (r = 6))),
                      (o = "");
                  },
                  c = 0;
                c < e.length;
                c++
              ) {
                c && (1 === r && a(), a(c));
                for (var l = 0; l < e[c].length; l++)
                  (t = e[c][l]),
                    1 === r
                      ? "<" === t
                        ? (a(), (u = [u]), (r = 3))
                        : (o += t)
                      : 4 === r
                      ? "--" === o && ">" === t
                        ? ((r = 1), (o = ""))
                        : (o = t + o[0])
                      : i
                      ? t === i
                        ? (i = "")
                        : (o += t)
                      : '"' === t || "'" === t
                      ? (i = t)
                      : ">" === t
                      ? (a(), (r = 1))
                      : r &&
                        ("=" === t
                          ? ((r = 5), (n = o), (o = ""))
                          : "/" === t && (r < 5 || ">" === e[c][l + 1])
                          ? (a(),
                            3 === r && (u = u[0]),
                            (r = u),
                            (u = u[0]).push(2, 0, r),
                            (r = 0))
                          : " " === t || "\t" === t || "\n" === t || "\r" === t
                          ? (a(), (r = 2))
                          : (o += t)),
                    3 === r && "!--" === o && ((r = 4), (u = u[0]));
              }
              return a(), u;
            })(e))
          ),
          t),
        arguments,
        []
      )).length > 1
        ? t
        : t[0]
    );
  }
  var qt = function (e) {
    var t = e.environment,
      n = t.document.createElementNS("http://www.w3.org/2000/svg", "svg");
    n.setAttribute("class", "aa-ClearIcon"),
      n.setAttribute("viewBox", "0 0 24 24"),
      n.setAttribute("width", "18"),
      n.setAttribute("height", "18"),
      n.setAttribute("fill", "currentColor");
    var r = t.document.createElementNS("http://www.w3.org/2000/svg", "path");
    return (
      r.setAttribute(
        "d",
        "M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"
      ),
      n.appendChild(r),
      n
    );
  };
  function Rt(e, t) {
    if ("string" == typeof t) {
      var n = e.document.querySelector(t);
      return (
        "The element ".concat(JSON.stringify(t), " is not in the document."), n
      );
    }
    return t;
  }
  function Bt() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    return t.reduce(function (e, t) {
      return (
        Object.keys(t).forEach(function (n) {
          var r = e[n],
            o = t[n];
          r !== o && (e[n] = [r, o].filter(Boolean).join(" "));
        }),
        e
      );
    }, {});
  }
  var Ft = function (e) {
    return (
      e &&
      "object" === r(e) &&
      "[object Object]" === Object.prototype.toString.call(e)
    );
  };
  function Lt() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    return t.reduce(function (e, t) {
      return (
        Object.keys(t).forEach(function (n) {
          var r = e[n],
            o = t[n];
          Array.isArray(r) && Array.isArray(o)
            ? (e[n] = r.concat.apply(r, c(o)))
            : Ft(r) && Ft(o)
            ? (e[n] = Lt(r, o))
            : (e[n] = o);
        }),
        e
      );
    }, {});
  }
  function Ut(e, t) {
    return Object.entries(e).reduce(function (e, r) {
      var i = a(r, 2),
        u = i[0],
        c = i[1];
      return t({ key: u, value: c }) ? n(n({}, e), {}, o({}, u, c)) : e;
    }, {});
  }
  var Mt = ["ontouchstart", "ontouchend", "ontouchmove", "ontouchcancel"];
  function Ht(e, t, n) {
    e[t] = null === n ? "" : "number" != typeof n ? n : n + "px";
  }
  function Vt(e) {
    this._listeners[e.type](e);
  }
  function Wt(e, t, n) {
    var r,
      o,
      i = e[t];
    if ("style" === t)
      if ("string" == typeof n) e.style = n;
      else if (null === n) e.style = "";
      else for (t in n) (i && n[t] === i[t]) || Ht(e.style, t, n[t]);
    else
      "o" === t[0] && "n" === t[1]
        ? ((r = t !== (t = t.replace(/Capture$/, ""))),
          ((o = t.toLowerCase()) in e || Mt.includes(o)) && (t = o),
          (t = t.slice(2)),
          e._listeners || (e._listeners = {}),
          (e._listeners[t] = n),
          n
            ? i || e.addEventListener(t, Vt, r)
            : e.removeEventListener(t, Vt, r))
        : "list" !== t &&
          "tagName" !== t &&
          "form" !== t &&
          "type" !== t &&
          "size" !== t &&
          "download" !== t &&
          "href" !== t &&
          t in e
        ? (e[t] = null == n ? "" : n)
        : "function" != typeof n &&
          "dangerouslySetInnerHTML" !== t &&
          (null == n || (!1 === n && !/^ar/.test(t))
            ? e.removeAttribute(t)
            : e.setAttribute(t, n));
  }
  function Qt(e) {
    return "onChange" === e ? "onInput" : e;
  }
  function Kt(e, t) {
    for (var n in t) Wt(e, Qt(n), t[n]);
  }
  function $t(e, t) {
    for (var n in t) ("o" === n[0] && "n" === n[1]) || Wt(e, Qt(n), t[n]);
  }
  var zt = ["children"];
  function Gt(e) {
    return function (t, n) {
      var r = n.children,
        o = void 0 === r ? [] : r,
        i = u(n, zt),
        a = e.document.createElement(t);
      return Kt(a, i), a.append.apply(a, c(o)), a;
    };
  }
  var Jt = [
      "autocompleteScopeApi",
      "environment",
      "classNames",
      "getInputProps",
      "getInputPropsCore",
      "isDetached",
      "state",
    ],
    Xt = function (e) {
      var t = e.environment.document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      return (
        t.setAttribute("class", "aa-LoadingIcon"),
        t.setAttribute("viewBox", "0 0 100 100"),
        t.setAttribute("width", "20"),
        t.setAttribute("height", "20"),
        (t.innerHTML =
          '<circle\n  cx="50"\n  cy="50"\n  fill="none"\n  r="35"\n  stroke="currentColor"\n  stroke-dasharray="164.93361431346415 56.97787143782138"\n  stroke-width="6"\n>\n  <animateTransform\n    attributeName="transform"\n    type="rotate"\n    repeatCount="indefinite"\n    dur="1s"\n    values="0 50 50;90 50 50;180 50 50;360 50 50"\n    keyTimes="0;0.40;0.65;1"\n  />\n</circle>'),
        t
      );
    },
    Yt = function (e) {
      var t = e.environment,
        n = t.document.createElementNS("http://www.w3.org/2000/svg", "svg");
      n.setAttribute("class", "aa-SubmitIcon"),
        n.setAttribute("viewBox", "0 0 24 24"),
        n.setAttribute("width", "20"),
        n.setAttribute("height", "20"),
        n.setAttribute("fill", "currentColor");
      var r = t.document.createElementNS("http://www.w3.org/2000/svg", "path");
      return (
        r.setAttribute(
          "d",
          "M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
        ),
        n.appendChild(r),
        n
      );
    };
  function Zt(e) {
    var t = e.autocomplete,
      r = e.autocompleteScopeApi,
      o = e.classNames,
      i = e.environment,
      a = e.isDetached,
      c = e.placeholder,
      l = void 0 === c ? "Search" : c,
      s = e.propGetters,
      f = e.setIsModalOpen,
      p = e.state,
      m = e.translations,
      v = Gt(i),
      d = s.getRootProps(n({ state: p, props: t.getRootProps({}) }, r)),
      y = v("div", n({ class: o.root }, d)),
      b = v("div", {
        class: o.detachedContainer,
        onMouseDown: function (e) {
          e.stopPropagation();
        },
      }),
      g = v("div", {
        class: o.detachedOverlay,
        children: [b],
        onMouseDown: function () {
          f(!1), t.setIsOpen(!1);
        },
      }),
      h = s.getLabelProps(n({ state: p, props: t.getLabelProps({}) }, r)),
      O = v("button", {
        class: o.submitButton,
        type: "submit",
        title: m.submitButtonTitle,
        children: [Yt({ environment: i })],
      }),
      _ = v("label", n({ class: o.label, children: [O] }, h)),
      S = v("button", {
        class: o.clearButton,
        type: "reset",
        title: m.clearButtonTitle,
        children: [qt({ environment: i })],
      }),
      j = v("div", {
        class: o.loadingIndicator,
        children: [Xt({ environment: i })],
      }),
      P = (function (e) {
        var t = e.autocompleteScopeApi,
          r = e.environment;
        e.classNames;
        var o = e.getInputProps,
          i = e.getInputPropsCore,
          a = e.isDetached,
          c = e.state,
          l = u(e, Jt),
          s = Gt(r)("input", l),
          f = o(
            n({ state: c, props: i({ inputElement: s }), inputElement: s }, t)
          );
        return (
          Kt(
            s,
            n(
              n({}, f),
              {},
              {
                onKeyDown: function (e) {
                  (a && "Tab" === e.key) || f.onKeyDown(e);
                },
              }
            )
          ),
          s
        );
      })({
        class: o.input,
        environment: i,
        state: p,
        getInputProps: s.getInputProps,
        getInputPropsCore: t.getInputProps,
        autocompleteScopeApi: r,
        isDetached: a,
      }),
      w = v("div", { class: o.inputWrapperPrefix, children: [_, j] }),
      I = v("div", { class: o.inputWrapperSuffix, children: [S] }),
      E = v("div", { class: o.inputWrapper, children: [P] }),
      A = s.getFormProps(
        n({ state: p, props: t.getFormProps({ inputElement: P }) }, r)
      ),
      D = v("form", n({ class: o.form, children: [w, E, I] }, A)),
      C = s.getPanelProps(n({ state: p, props: t.getPanelProps({}) }, r)),
      k = v("div", n({ class: o.panel }, C)),
      x = v("div", {
        class: o.detachedSearchButtonQuery,
        textContent: p.query,
      }),
      N = v("div", {
        class: o.detachedSearchButtonPlaceholder,
        hidden: Boolean(p.query),
        textContent: l,
      });
    if (a) {
      var T = v("div", {
          class: o.detachedSearchButtonIcon,
          children: [Yt({ environment: i })],
        }),
        q = v("button", {
          type: "button",
          class: o.detachedSearchButton,
          onClick: function () {
            f(!0);
          },
          children: [T, N, x],
        }),
        R = v("button", {
          type: "button",
          class: o.detachedCancelButton,
          textContent: m.detachedCancelButtonText,
          onTouchStart: function (e) {
            e.stopPropagation();
          },
          onClick: function () {
            t.setIsOpen(!1), f(!1);
          },
        }),
        B = v("div", { class: o.detachedFormContainer, children: [D, R] });
      b.appendChild(B), y.appendChild(q);
    } else y.appendChild(D);
    return {
      detachedContainer: b,
      detachedOverlay: g,
      detachedSearchButtonQuery: x,
      detachedSearchButtonPlaceholder: N,
      inputWrapper: E,
      input: P,
      root: y,
      form: D,
      label: _,
      submitButton: O,
      clearButton: S,
      loadingIndicator: j,
      panel: k,
    };
  }
  var en,
    tn,
    nn,
    rn,
    on,
    un,
    an,
    cn = {},
    ln = [],
    sn = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  function fn(e, t) {
    for (var n in t) e[n] = t[n];
    return e;
  }
  function pn(e) {
    var t = e.parentNode;
    t && t.removeChild(e);
  }
  function mn(e, t, n) {
    var r,
      o,
      i,
      u = {};
    for (i in t)
      "key" == i ? (r = t[i]) : "ref" == i ? (o = t[i]) : (u[i] = t[i]);
    if (
      (arguments.length > 2 &&
        (u.children = arguments.length > 3 ? en.call(arguments, 2) : n),
      "function" == typeof e && null != e.defaultProps)
    )
      for (i in e.defaultProps) void 0 === u[i] && (u[i] = e.defaultProps[i]);
    return vn(e, u, r, o, null);
  }
  function vn(e, t, n, r, o) {
    var i = {
      type: e,
      props: t,
      key: n,
      ref: r,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      __h: null,
      constructor: void 0,
      __v: null == o ? ++nn : o,
    };
    return null == o && null != tn.vnode && tn.vnode(i), i;
  }
  function dn(e) {
    return e.children;
  }
  function yn(e, t) {
    (this.props = e), (this.context = t);
  }
  function bn(e, t) {
    if (null == t) return e.__ ? bn(e.__, e.__.__k.indexOf(e) + 1) : null;
    for (var n; t < e.__k.length; t++)
      if (null != (n = e.__k[t]) && null != n.__e) return n.__e;
    return "function" == typeof e.type ? bn(e) : null;
  }
  function gn(e) {
    var t, n;
    if (null != (e = e.__) && null != e.__c) {
      for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
        if (null != (n = e.__k[t]) && null != n.__e) {
          e.__e = e.__c.base = n.__e;
          break;
        }
      return gn(e);
    }
  }
  function hn(e) {
    ((!e.__d && (e.__d = !0) && rn.push(e) && !On.__r++) ||
      on !== tn.debounceRendering) &&
      ((on = tn.debounceRendering) || un)(On);
  }
  function On() {
    var e, t, n, r, o, i, u, a;
    for (rn.sort(an); (e = rn.shift()); )
      e.__d &&
        ((t = rn.length),
        (r = void 0),
        (o = void 0),
        (u = (i = (n = e).__v).__e),
        (a = n.__P) &&
          ((r = []),
          ((o = fn({}, i)).__v = i.__v + 1),
          Dn(
            a,
            i,
            o,
            n.__n,
            void 0 !== a.ownerSVGElement,
            null != i.__h ? [u] : null,
            r,
            null == u ? bn(i) : u,
            i.__h
          ),
          Cn(r, i),
          i.__e != u && gn(i)),
        rn.length > t && rn.sort(an));
    On.__r = 0;
  }
  function _n(e, t, n, r, o, i, u, a, c, l) {
    var s,
      f,
      p,
      m,
      v,
      d,
      y,
      b = (r && r.__k) || ln,
      g = b.length;
    for (n.__k = [], s = 0; s < t.length; s++)
      if (
        null !=
        (m = n.__k[s] =
          null == (m = t[s]) || "boolean" == typeof m || "function" == typeof m
            ? null
            : "string" == typeof m ||
              "number" == typeof m ||
              "bigint" == typeof m
            ? vn(null, m, null, null, m)
            : Array.isArray(m)
            ? vn(dn, { children: m }, null, null, null)
            : m.__b > 0
            ? vn(m.type, m.props, m.key, m.ref ? m.ref : null, m.__v)
            : m)
      ) {
        if (
          ((m.__ = n),
          (m.__b = n.__b + 1),
          null === (p = b[s]) || (p && m.key == p.key && m.type === p.type))
        )
          b[s] = void 0;
        else
          for (f = 0; f < g; f++) {
            if ((p = b[f]) && m.key == p.key && m.type === p.type) {
              b[f] = void 0;
              break;
            }
            p = null;
          }
        Dn(e, m, (p = p || cn), o, i, u, a, c, l),
          (v = m.__e),
          (f = m.ref) &&
            p.ref != f &&
            (y || (y = []),
            p.ref && y.push(p.ref, null, m),
            y.push(f, m.__c || v, m)),
          null != v
            ? (null == d && (d = v),
              "function" == typeof m.type && m.__k === p.__k
                ? (m.__d = c = Sn(m, c, e))
                : (c = jn(e, m, p, b, v, c)),
              "function" == typeof n.type && (n.__d = c))
            : c && p.__e == c && c.parentNode != e && (c = bn(p));
      }
    for (n.__e = d, s = g; s--; )
      null != b[s] &&
        ("function" == typeof n.type &&
          null != b[s].__e &&
          b[s].__e == n.__d &&
          (n.__d = Pn(r).nextSibling),
        Nn(b[s], b[s]));
    if (y) for (s = 0; s < y.length; s++) xn(y[s], y[++s], y[++s]);
  }
  function Sn(e, t, n) {
    for (var r, o = e.__k, i = 0; o && i < o.length; i++)
      (r = o[i]) &&
        ((r.__ = e),
        (t =
          "function" == typeof r.type
            ? Sn(r, t, n)
            : jn(n, r, r, o, r.__e, t)));
    return t;
  }
  function jn(e, t, n, r, o, i) {
    var u, a, c;
    if (void 0 !== t.__d) (u = t.__d), (t.__d = void 0);
    else if (null == n || o != i || null == o.parentNode)
      e: if (null == i || i.parentNode !== e) e.appendChild(o), (u = null);
      else {
        for (a = i, c = 0; (a = a.nextSibling) && c < r.length; c += 1)
          if (a == o) break e;
        e.insertBefore(o, i), (u = i);
      }
    return void 0 !== u ? u : o.nextSibling;
  }
  function Pn(e) {
    var t, n, r;
    if (null == e.type || "string" == typeof e.type) return e.__e;
    if (e.__k)
      for (t = e.__k.length - 1; t >= 0; t--)
        if ((n = e.__k[t]) && (r = Pn(n))) return r;
    return null;
  }
  function wn(e, t, n) {
    "-" === t[0]
      ? e.setProperty(t, null == n ? "" : n)
      : (e[t] =
          null == n ? "" : "number" != typeof n || sn.test(t) ? n : n + "px");
  }
  function In(e, t, n, r, o) {
    var i;
    e: if ("style" === t)
      if ("string" == typeof n) e.style.cssText = n;
      else {
        if (("string" == typeof r && (e.style.cssText = r = ""), r))
          for (t in r) (n && t in n) || wn(e.style, t, "");
        if (n) for (t in n) (r && n[t] === r[t]) || wn(e.style, t, n[t]);
      }
    else if ("o" === t[0] && "n" === t[1])
      (i = t !== (t = t.replace(/Capture$/, ""))),
        (t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2)),
        e.l || (e.l = {}),
        (e.l[t + i] = n),
        n
          ? r || e.addEventListener(t, i ? An : En, i)
          : e.removeEventListener(t, i ? An : En, i);
    else if ("dangerouslySetInnerHTML" !== t) {
      if (o) t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (
        "width" !== t &&
        "height" !== t &&
        "href" !== t &&
        "list" !== t &&
        "form" !== t &&
        "tabIndex" !== t &&
        "download" !== t &&
        t in e
      )
        try {
          e[t] = null == n ? "" : n;
          break e;
        } catch (e) {}
      "function" == typeof n ||
        (null == n || (!1 === n && "-" !== t[4])
          ? e.removeAttribute(t)
          : e.setAttribute(t, n));
    }
  }
  function En(e) {
    return this.l[e.type + !1](tn.event ? tn.event(e) : e);
  }
  function An(e) {
    return this.l[e.type + !0](tn.event ? tn.event(e) : e);
  }
  function Dn(e, t, n, r, o, i, u, a, c) {
    var l,
      s,
      f,
      p,
      m,
      v,
      d,
      y,
      b,
      g,
      h,
      O,
      _,
      S,
      j,
      P = t.type;
    if (void 0 !== t.constructor) return null;
    null != n.__h &&
      ((c = n.__h), (a = t.__e = n.__e), (t.__h = null), (i = [a])),
      (l = tn.__b) && l(t);
    try {
      e: if ("function" == typeof P) {
        if (
          ((y = t.props),
          (b = (l = P.contextType) && r[l.__c]),
          (g = l ? (b ? b.props.value : l.__) : r),
          n.__c
            ? (d = (s = t.__c = n.__c).__ = s.__E)
            : ("prototype" in P && P.prototype.render
                ? (t.__c = s = new P(y, g))
                : ((t.__c = s = new yn(y, g)),
                  (s.constructor = P),
                  (s.render = Tn)),
              b && b.sub(s),
              (s.props = y),
              s.state || (s.state = {}),
              (s.context = g),
              (s.__n = r),
              (f = s.__d = !0),
              (s.__h = []),
              (s._sb = [])),
          null == s.__s && (s.__s = s.state),
          null != P.getDerivedStateFromProps &&
            (s.__s == s.state && (s.__s = fn({}, s.__s)),
            fn(s.__s, P.getDerivedStateFromProps(y, s.__s))),
          (p = s.props),
          (m = s.state),
          (s.__v = t),
          f)
        )
          null == P.getDerivedStateFromProps &&
            null != s.componentWillMount &&
            s.componentWillMount(),
            null != s.componentDidMount && s.__h.push(s.componentDidMount);
        else {
          if (
            (null == P.getDerivedStateFromProps &&
              y !== p &&
              null != s.componentWillReceiveProps &&
              s.componentWillReceiveProps(y, g),
            (!s.__e &&
              null != s.shouldComponentUpdate &&
              !1 === s.shouldComponentUpdate(y, s.__s, g)) ||
              t.__v === n.__v)
          ) {
            for (
              t.__v !== n.__v &&
                ((s.props = y), (s.state = s.__s), (s.__d = !1)),
                s.__e = !1,
                t.__e = n.__e,
                t.__k = n.__k,
                t.__k.forEach(function (e) {
                  e && (e.__ = t);
                }),
                h = 0;
              h < s._sb.length;
              h++
            )
              s.__h.push(s._sb[h]);
            (s._sb = []), s.__h.length && u.push(s);
            break e;
          }
          null != s.componentWillUpdate && s.componentWillUpdate(y, s.__s, g),
            null != s.componentDidUpdate &&
              s.__h.push(function () {
                s.componentDidUpdate(p, m, v);
              });
        }
        if (
          ((s.context = g),
          (s.props = y),
          (s.__P = e),
          (O = tn.__r),
          (_ = 0),
          "prototype" in P && P.prototype.render)
        ) {
          for (
            s.state = s.__s,
              s.__d = !1,
              O && O(t),
              l = s.render(s.props, s.state, s.context),
              S = 0;
            S < s._sb.length;
            S++
          )
            s.__h.push(s._sb[S]);
          s._sb = [];
        } else
          do {
            (s.__d = !1),
              O && O(t),
              (l = s.render(s.props, s.state, s.context)),
              (s.state = s.__s);
          } while (s.__d && ++_ < 25);
        (s.state = s.__s),
          null != s.getChildContext && (r = fn(fn({}, r), s.getChildContext())),
          f ||
            null == s.getSnapshotBeforeUpdate ||
            (v = s.getSnapshotBeforeUpdate(p, m)),
          (j =
            null != l && l.type === dn && null == l.key ? l.props.children : l),
          _n(e, Array.isArray(j) ? j : [j], t, n, r, o, i, u, a, c),
          (s.base = t.__e),
          (t.__h = null),
          s.__h.length && u.push(s),
          d && (s.__E = s.__ = null),
          (s.__e = !1);
      } else null == i && t.__v === n.__v ? ((t.__k = n.__k), (t.__e = n.__e)) : (t.__e = kn(n.__e, t, n, r, o, i, u, c));
      (l = tn.diffed) && l(t);
    } catch (e) {
      (t.__v = null),
        (c || null != i) &&
          ((t.__e = a), (t.__h = !!c), (i[i.indexOf(a)] = null)),
        tn.__e(e, t, n);
    }
  }
  function Cn(e, t) {
    tn.__c && tn.__c(t, e),
      e.some(function (t) {
        try {
          (e = t.__h),
            (t.__h = []),
            e.some(function (e) {
              e.call(t);
            });
        } catch (e) {
          tn.__e(e, t.__v);
        }
      });
  }
  function kn(e, t, n, r, o, i, u, a) {
    var c,
      l,
      s,
      f = n.props,
      p = t.props,
      m = t.type,
      v = 0;
    if (("svg" === m && (o = !0), null != i))
      for (; v < i.length; v++)
        if (
          (c = i[v]) &&
          "setAttribute" in c == !!m &&
          (m ? c.localName === m : 3 === c.nodeType)
        ) {
          (e = c), (i[v] = null);
          break;
        }
    if (null == e) {
      if (null === m) return document.createTextNode(p);
      (e = o
        ? document.createElementNS("http://www.w3.org/2000/svg", m)
        : document.createElement(m, p.is && p)),
        (i = null),
        (a = !1);
    }
    if (null === m) f === p || (a && e.data === p) || (e.data = p);
    else {
      if (
        ((i = i && en.call(e.childNodes)),
        (l = (f = n.props || cn).dangerouslySetInnerHTML),
        (s = p.dangerouslySetInnerHTML),
        !a)
      ) {
        if (null != i)
          for (f = {}, v = 0; v < e.attributes.length; v++)
            f[e.attributes[v].name] = e.attributes[v].value;
        (s || l) &&
          ((s && ((l && s.__html == l.__html) || s.__html === e.innerHTML)) ||
            (e.innerHTML = (s && s.__html) || ""));
      }
      if (
        ((function (e, t, n, r, o) {
          var i;
          for (i in n)
            "children" === i ||
              "key" === i ||
              i in t ||
              In(e, i, null, n[i], r);
          for (i in t)
            (o && "function" != typeof t[i]) ||
              "children" === i ||
              "key" === i ||
              "value" === i ||
              "checked" === i ||
              n[i] === t[i] ||
              In(e, i, t[i], n[i], r);
        })(e, p, f, o, a),
        s)
      )
        t.__k = [];
      else if (
        ((v = t.props.children),
        _n(
          e,
          Array.isArray(v) ? v : [v],
          t,
          n,
          r,
          o && "foreignObject" !== m,
          i,
          u,
          i ? i[0] : n.__k && bn(n, 0),
          a
        ),
        null != i)
      )
        for (v = i.length; v--; ) null != i[v] && pn(i[v]);
      a ||
        ("value" in p &&
          void 0 !== (v = p.value) &&
          (v !== e.value ||
            ("progress" === m && !v) ||
            ("option" === m && v !== f.value)) &&
          In(e, "value", v, f.value, !1),
        "checked" in p &&
          void 0 !== (v = p.checked) &&
          v !== e.checked &&
          In(e, "checked", v, f.checked, !1));
    }
    return e;
  }
  function xn(e, t, n) {
    try {
      "function" == typeof e ? e(t) : (e.current = t);
    } catch (e) {
      tn.__e(e, n);
    }
  }
  function Nn(e, t, n) {
    var r, o;
    if (
      (tn.unmount && tn.unmount(e),
      (r = e.ref) && ((r.current && r.current !== e.__e) || xn(r, null, t)),
      null != (r = e.__c))
    ) {
      if (r.componentWillUnmount)
        try {
          r.componentWillUnmount();
        } catch (e) {
          tn.__e(e, t);
        }
      (r.base = r.__P = null), (e.__c = void 0);
    }
    if ((r = e.__k))
      for (o = 0; o < r.length; o++)
        r[o] && Nn(r[o], t, n || "function" != typeof e.type);
    n || null == e.__e || pn(e.__e), (e.__ = e.__e = e.__d = void 0);
  }
  function Tn(e, t, n) {
    return this.constructor(e, n);
  }
  (en = ln.slice),
    (tn = {
      __e: function (e, t, n, r) {
        for (var o, i, u; (t = t.__); )
          if ((o = t.__c) && !o.__)
            try {
              if (
                ((i = o.constructor) &&
                  null != i.getDerivedStateFromError &&
                  (o.setState(i.getDerivedStateFromError(e)), (u = o.__d)),
                null != o.componentDidCatch &&
                  (o.componentDidCatch(e, r || {}), (u = o.__d)),
                u)
              )
                return (o.__E = o);
            } catch (t) {
              e = t;
            }
        throw e;
      },
    }),
    (nn = 0),
    (yn.prototype.setState = function (e, t) {
      var n;
      (n =
        null != this.__s && this.__s !== this.state
          ? this.__s
          : (this.__s = fn({}, this.state))),
        "function" == typeof e && (e = e(fn({}, n), this.props)),
        e && fn(n, e),
        null != e && this.__v && (t && this._sb.push(t), hn(this));
    }),
    (yn.prototype.forceUpdate = function (e) {
      this.__v && ((this.__e = !0), e && this.__h.push(e), hn(this));
    }),
    (yn.prototype.render = dn),
    (rn = []),
    (un =
      "function" == typeof Promise
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout),
    (an = function (e, t) {
      return e.__v.__b - t.__v.__b;
    }),
    (On.__r = 0);
  var qn = "__aa-highlight__",
    Rn = "__/aa-highlight__";
  function Bn(e) {
    var t = e.highlightedValue.split(qn),
      n = t.shift(),
      r = (function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
        return {
          get: function () {
            return e;
          },
          add: function (t) {
            var n = e[e.length - 1];
            (null == n ? void 0 : n.isHighlighted) === t.isHighlighted
              ? (e[e.length - 1] = {
                  value: n.value + t.value,
                  isHighlighted: n.isHighlighted,
                })
              : e.push(t);
          },
        };
      })(n ? [{ value: n, isHighlighted: !1 }] : []);
    return (
      t.forEach(function (e) {
        var t = e.split(Rn);
        r.add({ value: t[0], isHighlighted: !0 }),
          "" !== t[1] && r.add({ value: t[1], isHighlighted: !1 });
      }),
      r.get()
    );
  }
  function Fn(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return Ln(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return Ln(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return Ln(e, t);
      })(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function Ln(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function Un(e) {
    var t = e.hit,
      n = e.attribute,
      r = Array.isArray(n) ? n : [n],
      o = y(t, ["_highlightResult"].concat(Fn(r), ["value"]));
    return (
      "string" != typeof o && (o = y(t, r) || ""), Bn({ highlightedValue: o })
    );
  }
  var Mn = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
    },
    Hn = new RegExp(/\w/i),
    Vn = /&(amp|quot|lt|gt|#39);/g,
    Wn = RegExp(Vn.source);
  function Qn(e, t) {
    var n,
      r,
      o,
      i = e[t],
      u =
        (null === (n = e[t + 1]) || void 0 === n ? void 0 : n.isHighlighted) ||
        !0,
      a =
        (null === (r = e[t - 1]) || void 0 === r ? void 0 : r.isHighlighted) ||
        !0;
    return Hn.test(
      (o = i.value) && Wn.test(o)
        ? o.replace(Vn, function (e) {
            return Mn[e];
          })
        : o
    ) || a !== u
      ? i.isHighlighted
      : a;
  }
  function Kn(e) {
    return (
      (Kn =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      Kn(e)
    );
  }
  function $n(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function zn(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? $n(Object(n), !0).forEach(function (t) {
            Gn(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : $n(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function Gn(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== Kn(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== Kn(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === Kn(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function Jn(e) {
    return e.some(function (e) {
      return e.isHighlighted;
    })
      ? e.map(function (t, n) {
          return zn(zn({}, t), {}, { isHighlighted: !Qn(e, n) });
        })
      : e.map(function (e) {
          return zn(zn({}, e), {}, { isHighlighted: !1 });
        });
  }
  function Xn(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return Yn(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return Yn(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return Yn(e, t);
      })(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function Yn(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function Zn(e) {
    var t = e.hit,
      n = e.attribute,
      r = Array.isArray(n) ? n : [n],
      o = y(t, ["_snippetResult"].concat(Xn(r), ["value"]));
    return (
      "string" != typeof o && (o = y(t, r) || ""), Bn({ highlightedValue: o })
    );
  }
  function er(e) {
    return (
      (er =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      er(e)
    );
  }
  function tr(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function nr(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? tr(Object(n), !0).forEach(function (t) {
            rr(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : tr(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function rr(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== er(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== er(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === er(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function or(e) {
    return (
      (or =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      or(e)
    );
  }
  var ir = ["params"];
  function ur(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function ar(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? ur(Object(n), !0).forEach(function (t) {
            cr(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : ur(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function cr(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" !== or(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" !== or(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" === or(t) ? t : String(t);
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function lr(e, t) {
    if (null == e) return {};
    var n,
      r,
      o = (function (e, t) {
        if (null == e) return {};
        var n,
          r,
          o = {},
          i = Object.keys(e);
        for (r = 0; r < i.length; r++)
          (n = i[r]), t.indexOf(n) >= 0 || (o[n] = e[n]);
        return o;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++)
        (n = i[r]),
          t.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n]));
    }
    return o;
  }
  function sr(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return fr(e);
      })(e) ||
      (function (e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      })(e) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return fr(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return fr(e, t);
      })(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function fr(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function pr(e) {
    var t = e.createElement,
      n = e.Fragment;
    function r(e) {
      var r = e.hit,
        o = e.attribute,
        i = e.tagName,
        u = void 0 === i ? "mark" : i;
      return t(
        n,
        {},
        Un({ hit: r, attribute: o }).map(function (e, n) {
          return e.isHighlighted ? t(u, { key: n }, e.value) : e.value;
        })
      );
    }
    return (r.__autocomplete_componentName = "Highlight"), r;
  }
  function mr(e) {
    var t = e.createElement,
      n = e.Fragment;
    function r(e) {
      var r,
        o = e.hit,
        i = e.attribute,
        u = e.tagName,
        a = void 0 === u ? "mark" : u;
      return t(
        n,
        {},
        ((r = { hit: o, attribute: i }), Jn(Un(r))).map(function (e, n) {
          return e.isHighlighted ? t(a, { key: n }, e.value) : e.value;
        })
      );
    }
    return (r.__autocomplete_componentName = "ReverseHighlight"), r;
  }
  function vr(e) {
    var t = e.createElement,
      n = e.Fragment;
    function r(e) {
      var r,
        o = e.hit,
        i = e.attribute,
        u = e.tagName,
        a = void 0 === u ? "mark" : u;
      return t(
        n,
        {},
        ((r = { hit: o, attribute: i }), Jn(Zn(r))).map(function (e, n) {
          return e.isHighlighted ? t(a, { key: n }, e.value) : e.value;
        })
      );
    }
    return (r.__autocomplete_componentName = "ReverseSnippet"), r;
  }
  function dr(e) {
    var t = e.createElement,
      n = e.Fragment;
    function r(e) {
      var r = e.hit,
        o = e.attribute,
        i = e.tagName,
        u = void 0 === i ? "mark" : i;
      return t(
        n,
        {},
        Zn({ hit: r, attribute: o }).map(function (e, n) {
          return e.isHighlighted ? t(u, { key: n }, e.value) : e.value;
        })
      );
    }
    return (r.__autocomplete_componentName = "Snippet"), r;
  }
  var yr = [
      "classNames",
      "container",
      "getEnvironmentProps",
      "getFormProps",
      "getInputProps",
      "getItemProps",
      "getLabelProps",
      "getListProps",
      "getPanelProps",
      "getRootProps",
      "panelContainer",
      "panelPlacement",
      "render",
      "renderNoResults",
      "renderer",
      "detachedMediaQuery",
      "components",
      "translations",
    ],
    br = {
      clearButton: "aa-ClearButton",
      detachedCancelButton: "aa-DetachedCancelButton",
      detachedContainer: "aa-DetachedContainer",
      detachedFormContainer: "aa-DetachedFormContainer",
      detachedOverlay: "aa-DetachedOverlay",
      detachedSearchButton: "aa-DetachedSearchButton",
      detachedSearchButtonIcon: "aa-DetachedSearchButtonIcon",
      detachedSearchButtonPlaceholder: "aa-DetachedSearchButtonPlaceholder",
      detachedSearchButtonQuery: "aa-DetachedSearchButtonQuery",
      form: "aa-Form",
      input: "aa-Input",
      inputWrapper: "aa-InputWrapper",
      inputWrapperPrefix: "aa-InputWrapperPrefix",
      inputWrapperSuffix: "aa-InputWrapperSuffix",
      item: "aa-Item",
      label: "aa-Label",
      list: "aa-List",
      loadingIndicator: "aa-LoadingIndicator",
      panel: "aa-Panel",
      panelLayout: "aa-PanelLayout aa-Panel--scrollable",
      root: "aa-Autocomplete",
      source: "aa-Source",
      sourceFooter: "aa-SourceFooter",
      sourceHeader: "aa-SourceHeader",
      sourceNoResults: "aa-SourceNoResults",
      submitButton: "aa-SubmitButton",
    },
    gr = function (e, t) {
      var n = e.children;
      (0, e.render)(n, t);
    },
    hr = {
      createElement: mn,
      Fragment: dn,
      render: function (e, t, n) {
        var r, o, i;
        tn.__ && tn.__(e, t),
          (o = (r = "function" == typeof n) ? null : (n && n.__k) || t.__k),
          (i = []),
          Dn(
            t,
            (e = ((!r && n) || t).__k = mn(dn, null, [e])),
            o || cn,
            cn,
            void 0 !== t.ownerSVGElement,
            !r && n
              ? [n]
              : o
              ? null
              : t.firstChild
              ? en.call(t.childNodes)
              : null,
            i,
            !r && n ? n : o ? o.__e : t.firstChild,
            r
          ),
          Cn(i, e);
      },
    };
  function Or(e) {
    var t = e.panelPlacement,
      n = e.container,
      r = e.form,
      o = e.environment,
      i = n.getBoundingClientRect(),
      u =
        (o.pageYOffset ||
          o.document.documentElement.scrollTop ||
          o.document.body.scrollTop ||
          0) +
        i.top +
        i.height;
    switch (t) {
      case "start":
        return { top: u, left: i.left };
      case "end":
        return {
          top: u,
          right: o.document.documentElement.clientWidth - (i.left + i.width),
        };
      case "full-width":
        return { top: u, left: 0, right: 0, width: "unset", maxWidth: "unset" };
      case "input-wrapper-width":
        var a = r.getBoundingClientRect();
        return {
          top: u,
          left: a.left,
          right: o.document.documentElement.clientWidth - (a.left + a.width),
          width: "unset",
          maxWidth: "unset",
        };
      default:
        throw new Error(
          "[Autocomplete] The `panelPlacement` value ".concat(
            JSON.stringify(t),
            " is not valid."
          )
        );
    }
  }
  var _r = [{ segment: "autocomplete-js", version: _ }],
    Sr = ["components"];
  var jr = (function (e, t) {
    function n(t) {
      return e({
        searchClient: t.searchClient,
        queries: t.requests.map(function (e) {
          return e.query;
        }),
      }).then(function (e) {
        return e.map(function (e, n) {
          var r = t.requests[n];
          return {
            items: e,
            sourceId: r.sourceId,
            transformResponse: r.transformResponse,
          };
        });
      });
    }
    return function (e) {
      return function (r) {
        return nr(nr({ requesterId: t, execute: n }, e), r);
      };
    };
  })(function (e) {
    return (function (e) {
      var t = e.searchClient,
        n = e.queries,
        r = e.userAgents,
        o = void 0 === r ? [] : r;
      "function" == typeof t.addAlgoliaAgent &&
        [].concat(sr(S), sr(o)).forEach(function (e) {
          var n = e.segment,
            r = e.version;
          t.addAlgoliaAgent(n, r);
        });
      var i = (function (e) {
          var t = e.transporter,
            n = t.headers,
            r = t.queryParameters,
            o = "x-algolia-application-id",
            i = "x-algolia-api-key";
          return { appId: n[o] || r[o], apiKey: n[i] || r[i] };
        })(t),
        u = i.appId,
        a = i.apiKey;
      return t
        .search(
          n.map(function (e) {
            var t = e.params;
            return ar(
              ar({}, lr(e, ir)),
              {},
              {
                params: ar(
                  { hitsPerPage: 5, highlightPreTag: qn, highlightPostTag: Rn },
                  t
                ),
              }
            );
          })
        )
        .then(function (e) {
          return e.results.map(function (e) {
            var t;
            return ar(
              ar({}, e),
              {},
              {
                hits:
                  null === (t = e.hits) || void 0 === t
                    ? void 0
                    : t.map(function (e) {
                        return ar(
                          ar({}, e),
                          {},
                          {
                            __autocomplete_algoliaCredentials: {
                              appId: u,
                              apiKey: a,
                            },
                          }
                        );
                      }),
              }
            );
          });
        });
    })(n(n({}, e), {}, { userAgents: _r }));
  }, "algolia");
  var Pr = jr({
    transformResponse: function (e) {
      return e.hits;
    },
  });
  (e.autocomplete = function (e) {
    var t,
      r = (function () {
        var e = [],
          t = [];
        function n(n) {
          e.push(n);
          var r = n();
          t.push(r);
        }
        return {
          runEffect: n,
          cleanupEffects: function () {
            var e = t;
            (t = []),
              e.forEach(function (e) {
                e();
              });
          },
          runEffects: function () {
            var t = e;
            (e = []),
              t.forEach(function (e) {
                n(e);
              });
          },
        };
      })(),
      a = r.runEffect,
      c = r.cleanupEffects,
      l = r.runEffects,
      s =
        ((t = []),
        {
          reactive: function (e) {
            var n = e(),
              r = {
                _fn: e,
                _ref: { current: n },
                get value() {
                  return this._ref.current;
                },
                set value(e) {
                  this._ref.current = e;
                },
              };
            return t.push(r), r;
          },
          runReactives: function () {
            t.forEach(function (e) {
              e._ref.current = e._fn();
            });
          },
        }),
      m = s.reactive,
      v = s.runReactives,
      y = f(!1),
      g = f(e),
      h = f(void 0),
      O = m(function () {
        return (function (e) {
          var t,
            r = e.classNames,
            o = e.container,
            i = e.getEnvironmentProps,
            a = e.getFormProps,
            c = e.getInputProps,
            l = e.getItemProps,
            s = e.getLabelProps,
            f = e.getListProps,
            p = e.getPanelProps,
            m = e.getRootProps,
            v = e.panelContainer,
            y = e.panelPlacement,
            b = e.render,
            g = e.renderNoResults,
            h = e.renderer,
            O = e.detachedMediaQuery,
            _ = e.components,
            S = e.translations,
            j = u(e, yr),
            P = "undefined" != typeof window ? window : {},
            w = Rt(P, o);
          w.tagName;
          var I = n(n({}, hr), h),
            E = {
              Highlight: pr(I),
              ReverseHighlight: mr(I),
              ReverseSnippet: vr(I),
              Snippet: dr(I),
            };
          return {
            renderer: {
              classNames: Bt(br, null != r ? r : {}),
              container: w,
              getEnvironmentProps:
                null != i
                  ? i
                  : function (e) {
                      return e.props;
                    },
              getFormProps:
                null != a
                  ? a
                  : function (e) {
                      return e.props;
                    },
              getInputProps:
                null != c
                  ? c
                  : function (e) {
                      return e.props;
                    },
              getItemProps:
                null != l
                  ? l
                  : function (e) {
                      return e.props;
                    },
              getLabelProps:
                null != s
                  ? s
                  : function (e) {
                      return e.props;
                    },
              getListProps:
                null != f
                  ? f
                  : function (e) {
                      return e.props;
                    },
              getPanelProps:
                null != p
                  ? p
                  : function (e) {
                      return e.props;
                    },
              getRootProps:
                null != m
                  ? m
                  : function (e) {
                      return e.props;
                    },
              panelContainer: v ? Rt(P, v) : P.document.body,
              panelPlacement: null != y ? y : "input-wrapper-width",
              render: null != b ? b : gr,
              renderNoResults: g,
              renderer: I,
              detachedMediaQuery:
                null != O
                  ? O
                  : getComputedStyle(
                      P.document.documentElement
                    ).getPropertyValue("--aa-detached-media-query"),
              components: n(n({}, E), _),
              translations: n(
                n(
                  {},
                  {
                    clearButtonTitle: "Clear",
                    detachedCancelButtonText: "Cancel",
                    submitButtonTitle: "Submit",
                  }
                ),
                S
              ),
            },
            core: n(
              n({}, j),
              {},
              {
                id: null !== (t = j.id) && void 0 !== t ? t : d(),
                environment: P,
              }
            ),
          };
        })(g.current);
      }),
      _ = m(function () {
        return O.value.core.environment.matchMedia(
          O.value.renderer.detachedMediaQuery
        ).matches;
      }),
      S = m(function () {
        return kt(
          n(
            n({}, O.value.core),
            {},
            {
              onStateChange: function (e) {
                var t, n, r;
                (y.current = e.state.collections.some(function (e) {
                  return e.source.templates.noResults;
                })),
                  null === (t = h.current) || void 0 === t || t.call(h, e),
                  null === (n = (r = O.value.core).onStateChange) ||
                    void 0 === n ||
                    n.call(r, e);
              },
              shouldPanelOpen:
                g.current.shouldPanelOpen ||
                function (e) {
                  var t = e.state;
                  if (_.value) return !0;
                  var n = b(t) > 0;
                  if (!O.value.core.openOnFocus && !t.query) return n;
                  var r = Boolean(
                    y.current || O.value.renderer.renderNoResults
                  );
                  return (!n && r) || n;
                },
              __autocomplete_metadata: { userAgents: _r, options: e },
            }
          )
        );
      }),
      j = f(
        n(
          {
            collections: [],
            completion: null,
            context: {},
            isOpen: !1,
            query: "",
            activeItemId: null,
            status: "idle",
          },
          O.value.core.initialState
        )
      ),
      P = {
        getEnvironmentProps: O.value.renderer.getEnvironmentProps,
        getFormProps: O.value.renderer.getFormProps,
        getInputProps: O.value.renderer.getInputProps,
        getItemProps: O.value.renderer.getItemProps,
        getLabelProps: O.value.renderer.getLabelProps,
        getListProps: O.value.renderer.getListProps,
        getPanelProps: O.value.renderer.getPanelProps,
        getRootProps: O.value.renderer.getRootProps,
      },
      w = {
        setActiveItemId: S.value.setActiveItemId,
        setQuery: S.value.setQuery,
        setCollections: S.value.setCollections,
        setIsOpen: S.value.setIsOpen,
        setStatus: S.value.setStatus,
        setContext: S.value.setContext,
        refresh: S.value.refresh,
        navigator: S.value.navigator,
      },
      I = m(function () {
        return Tt.bind(O.value.renderer.renderer.createElement);
      }),
      E = m(function () {
        return Zt({
          autocomplete: S.value,
          autocompleteScopeApi: w,
          classNames: O.value.renderer.classNames,
          environment: O.value.core.environment,
          isDetached: _.value,
          placeholder: O.value.core.placeholder,
          propGetters: P,
          setIsModalOpen: k,
          state: j.current,
          translations: O.value.renderer.translations,
        });
      });
    function A() {
      Kt(E.value.panel, {
        style: _.value
          ? {}
          : Or({
              panelPlacement: O.value.renderer.panelPlacement,
              container: E.value.root,
              form: E.value.form,
              environment: O.value.core.environment,
            }),
      });
    }
    function D(e) {
      j.current = e;
      var t = {
          autocomplete: S.value,
          autocompleteScopeApi: w,
          classNames: O.value.renderer.classNames,
          components: O.value.renderer.components,
          container: O.value.renderer.container,
          html: I.value,
          dom: E.value,
          panelContainer: _.value
            ? E.value.detachedContainer
            : O.value.renderer.panelContainer,
          propGetters: P,
          state: j.current,
          renderer: O.value.renderer.renderer,
        },
        r =
          (!b(e) && !y.current && O.value.renderer.renderNoResults) ||
          O.value.renderer.render;
      !(function (e) {
        var t = e.autocomplete,
          r = e.autocompleteScopeApi,
          o = e.dom,
          i = e.propGetters,
          u = e.state;
        $t(
          o.root,
          i.getRootProps(n({ state: u, props: t.getRootProps({}) }, r))
        ),
          $t(
            o.input,
            i.getInputProps(
              n(
                {
                  state: u,
                  props: t.getInputProps({ inputElement: o.input }),
                  inputElement: o.input,
                },
                r
              )
            )
          ),
          Kt(o.label, { hidden: "stalled" === u.status }),
          Kt(o.loadingIndicator, { hidden: "stalled" !== u.status }),
          Kt(o.clearButton, { hidden: !u.query }),
          Kt(o.detachedSearchButtonQuery, { textContent: u.query }),
          Kt(o.detachedSearchButtonPlaceholder, { hidden: Boolean(u.query) });
      })(t),
        (function (e, t) {
          var r = t.autocomplete,
            o = t.autocompleteScopeApi,
            u = t.classNames,
            a = t.html,
            c = t.dom,
            l = t.panelContainer,
            s = t.propGetters,
            f = t.state,
            p = t.components,
            m = t.renderer;
          if (f.isOpen) {
            l.contains(c.panel) ||
              "loading" === f.status ||
              l.appendChild(c.panel),
              c.panel.classList.toggle(
                "aa-Panel--stalled",
                "stalled" === f.status
              );
            var v = f.collections
                .filter(function (e) {
                  var t = e.source,
                    n = e.items;
                  return t.templates.noResults || n.length > 0;
                })
                .map(function (e, t) {
                  var c = e.source,
                    l = e.items;
                  return m.createElement(
                    "section",
                    {
                      key: t,
                      className: u.source,
                      "data-autocomplete-source-id": c.sourceId,
                    },
                    c.templates.header &&
                      m.createElement(
                        "div",
                        { className: u.sourceHeader },
                        c.templates.header({
                          components: p,
                          createElement: m.createElement,
                          Fragment: m.Fragment,
                          items: l,
                          source: c,
                          state: f,
                          html: a,
                        })
                      ),
                    c.templates.noResults && 0 === l.length
                      ? m.createElement(
                          "div",
                          { className: u.sourceNoResults },
                          c.templates.noResults({
                            components: p,
                            createElement: m.createElement,
                            Fragment: m.Fragment,
                            source: c,
                            state: f,
                            html: a,
                          })
                        )
                      : m.createElement(
                          "ul",
                          i(
                            { className: u.list },
                            s.getListProps(
                              n(
                                {
                                  state: f,
                                  props: r.getListProps({ sourceIndex: t }),
                                },
                                o
                              )
                            )
                          ),
                          l.map(function (e) {
                            var l = r.getItemProps({
                              item: e,
                              source: c,
                              sourceIndex: t,
                            });
                            return m.createElement(
                              "li",
                              i(
                                { key: l.id, className: u.item },
                                s.getItemProps(n({ state: f, props: l }, o))
                              ),
                              c.templates.item({
                                components: p,
                                createElement: m.createElement,
                                Fragment: m.Fragment,
                                item: e,
                                state: f,
                                html: a,
                              })
                            );
                          })
                        ),
                    c.templates.footer &&
                      m.createElement(
                        "div",
                        { className: u.sourceFooter },
                        c.templates.footer({
                          components: p,
                          createElement: m.createElement,
                          Fragment: m.Fragment,
                          items: l,
                          source: c,
                          state: f,
                          html: a,
                        })
                      )
                  );
                }),
              d = m.createElement(
                m.Fragment,
                null,
                m.createElement("div", { className: u.panelLayout }, v),
                m.createElement("div", { className: "aa-GradientBottom" })
              ),
              y = v.reduce(function (e, t) {
                return (e[t.props["data-autocomplete-source-id"]] = t), e;
              }, {});
            e(
              n(
                n({ children: d, state: f, sections: v, elements: y }, m),
                {},
                { components: p, html: a },
                o
              ),
              c.panel
            );
          } else l.contains(c.panel) && l.removeChild(c.panel);
        })(r, t);
    }
    function C() {
      var e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      c();
      var t = O.value.renderer,
        n = t.components,
        r = u(t, Sr);
      (g.current = Lt(
        r,
        O.value.core,
        {
          components: Ut(n, function (e) {
            return !e.value.hasOwnProperty("__autocomplete_componentName");
          }),
          initialState: j.current,
        },
        e
      )),
        v(),
        l(),
        S.value.refresh().then(function () {
          D(j.current);
        });
    }
    function k(e) {
      requestAnimationFrame(function () {
        var t = O.value.core.environment.document.body.contains(
          E.value.detachedOverlay
        );
        e !== t &&
          (e
            ? (O.value.core.environment.document.body.appendChild(
                E.value.detachedOverlay
              ),
              O.value.core.environment.document.body.classList.add(
                "aa-Detached"
              ),
              E.value.input.focus())
            : (O.value.core.environment.document.body.removeChild(
                E.value.detachedOverlay
              ),
              O.value.core.environment.document.body.classList.remove(
                "aa-Detached"
              )));
      });
    }
    return (
      a(function () {
        var e = S.value.getEnvironmentProps({
          formElement: E.value.form,
          panelElement: E.value.panel,
          inputElement: E.value.input,
        });
        return (
          Kt(O.value.core.environment, e),
          function () {
            Kt(
              O.value.core.environment,
              Object.keys(e).reduce(function (e, t) {
                return n(n({}, e), {}, o({}, t, void 0));
              }, {})
            );
          }
        );
      }),
      a(function () {
        var e = _.value
            ? O.value.core.environment.document.body
            : O.value.renderer.panelContainer,
          t = _.value ? E.value.detachedOverlay : E.value.panel;
        return (
          _.value && j.current.isOpen && k(!0),
          D(j.current),
          function () {
            e.contains(t) && e.removeChild(t);
          }
        );
      }),
      a(function () {
        var e = O.value.renderer.container;
        return (
          e.appendChild(E.value.root),
          function () {
            e.removeChild(E.value.root);
          }
        );
      }),
      a(function () {
        var e = p(function (e) {
          D(e.state);
        }, 0);
        return (
          (h.current = function (t) {
            var n = t.state,
              r = t.prevState;
            (_.value && r.isOpen !== n.isOpen && k(n.isOpen),
            _.value || !n.isOpen || r.isOpen || A(),
            n.query !== r.query) &&
              O.value.core.environment.document
                .querySelectorAll(".aa-Panel--scrollable")
                .forEach(function (e) {
                  0 !== e.scrollTop && (e.scrollTop = 0);
                });
            e({ state: n });
          }),
          function () {
            h.current = void 0;
          }
        );
      }),
      a(function () {
        var e = p(function () {
          var e = _.value;
          (_.value = O.value.core.environment.matchMedia(
            O.value.renderer.detachedMediaQuery
          ).matches),
            e !== _.value ? C({}) : requestAnimationFrame(A);
        }, 20);
        return (
          O.value.core.environment.addEventListener("resize", e),
          function () {
            O.value.core.environment.removeEventListener("resize", e);
          }
        );
      }),
      a(function () {
        if (!_.value) return function () {};
        function e(e) {
          E.value.detachedContainer.classList.toggle(
            "aa-DetachedContainer--modal",
            e
          );
        }
        function t(t) {
          e(t.matches);
        }
        var n = O.value.core.environment.matchMedia(
          getComputedStyle(
            O.value.core.environment.document.documentElement
          ).getPropertyValue("--aa-detached-modal-media-query")
        );
        e(n.matches);
        var r = Boolean(n.addEventListener);
        return (
          r ? n.addEventListener("change", t) : n.addListener(t),
          function () {
            r ? n.removeEventListener("change", t) : n.removeListener(t);
          }
        );
      }),
      a(function () {
        return requestAnimationFrame(A), function () {};
      }),
      n(
        n({}, w),
        {},
        {
          update: C,
          destroy: function () {
            c();
          },
        }
      )
    );
  }),
    (e.getAlgoliaFacets = function (e) {
      var t = jr({
          transformResponse: function (e) {
            return e.facetHits;
          },
        }),
        r = e.queries.map(function (e) {
          return n(n({}, e), {}, { type: "facet" });
        });
      return t(n(n({}, e), {}, { queries: r }));
    }),
    (e.getAlgoliaResults = Pr),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
//# sourceMappingURL=index.production.js.map
