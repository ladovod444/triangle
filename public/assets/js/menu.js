/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

TUtil = false;

setTimeout(function initMenu() {

    if (TUtil) {


        var KTMenu = function (e, t) {
            var n = this;
            if (null != e) {
                var i = {dropdown: {hoverTimeout: 200, zindex: 105}, accordion: {slideSpeed: 250, expand: !1}},
                    r = function () {
                        n.options = KTUtil.deepExtend({}, i, t), n.uid = KTUtil.getUniqueId("menu"), n.element = e, n.triggerElement, n.element.setAttribute("data-kt-menu", "true"), d(), u(), KTUtil.data(n.element).set("menu", n)
                    }, o = function (e) {
                        e || (e = n.triggerElement), !0 === m(e) ? l(e) : a(e)
                    }, a = function (e) {
                        e || (e = n.triggerElement), !0 !== m(e) && ("dropdown" === v(e) ? U(e) : "accordion" === v(e) && S(e), KTUtil.data(e).set("type", v(e)))
                    }, l = function (e) {
                        e || (e = n.triggerElement), !1 !== m(e) && ("dropdown" === v(e) ? w(e) : "accordion" === v(e) && A(e))
                    }, s = function (e) {
                        if (!1 !== f(e)) {
                            var t = g(e);
                            KTUtil.data(e).has("type") && KTUtil.data(e).get("type") !== v(e) && (KTUtil.removeClass(e, "hover"), KTUtil.removeClass(e, "show"), KTUtil.removeClass(t, "show"))
                        }
                    }, u = function () {
                        var e = n.element.querySelectorAll(".menu-item[data-kt-menu-trigger]");
                        if (e && e.length > 0) for (var t = 0, i = e.length; t < i; t++) s(e[t])
                    }, d = function () {
                        var e = document.querySelector('[data-kt-menu-target="# ' + n.element.getAttribute("id") + '"]');
                        null !== e ? n.triggerElement = e : n.element.closest("[data-kt-menu-trigger]") ? n.triggerElement = n.element.closest("[data-kt-menu-trigger]") : n.element.parentNode && KTUtil.child(n.element.parentNode, "[data-kt-menu-trigger]") && (n.triggerElement = KTUtil.child(n.element.parentNode, "[data-kt-menu-trigger]")), n.triggerElement && KTUtil.data(n.triggerElement).set("menu", n)
                    }, c = function (e) {
                        return n.triggerElement === e
                    }, m = function (e) {
                        var t = g(e);
                        return null !== t && ("dropdown" === v(e) ? !0 === KTUtil.hasClass(t, "show") && !0 === t.hasAttribute("data-popper-placement") : KTUtil.hasClass(e, "show"))
                    }, f = function (e) {
                        return KTUtil.hasClass(e, "menu-item") && e.hasAttribute("data-kt-menu-trigger")
                    }, p = function (e) {
                        return KTUtil.child(e, ".menu-link")
                    }, g = function (e) {
                        return !0 === c(e) ? n.element : !0 === e.classList.contains("menu-sub") ? e : KTUtil.data(e).has("sub") ? KTUtil.data(e).get("sub") : KTUtil.child(e, ".menu-sub")
                    }, v = function (e) {
                        var t = g(e);
                        return t && parseInt(KTUtil.css(t, "z-index")) > 0 ? "dropdown" : "accordion"
                    }, T = function (e) {
                        var t, n;
                        return c(e) || e.hasAttribute("data-kt-menu-trigger") ? e : KTUtil.data(e).has("item") ? KTUtil.data(e).get("item") : (t = e.closest(".menu-item[data-kt-menu-trigger]")) ? t : (n = e.closest(".menu-sub")) && !0 === KTUtil.data(n).has("item") ? KTUtil.data(n).get("item") : void 0
                    }, h = function (e) {
                        var t, n = e.closest(".menu-sub");
                        return KTUtil.data(n).has("item") ? KTUtil.data(n).get("item") : n && (t = n.closest(".menu-item[data-kt-menu-trigger]")) ? t : null
                    }, K = function (e) {
                        var t = e;
                        return KTUtil.data(e).get("sub") && (t = KTUtil.data(e).get("sub")), null !== t && t.querySelector(".menu-item[data-kt-menu-trigger]") || null
                    }, E = function (e) {
                        var t, n = [], i = 0;
                        do {
                            (t = K(e)) && (n.push(t), e = t), i++
                        } while (null !== t && i < 20);
                        return n
                    }, U = function (e) {
                        if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.dropdown.show", e)) {
                            KTMenu.hideDropdowns(e);
                            c(e) || p(e);
                            var t = g(e), i = x(e, "width"), r = x(e, "height"), o = n.options.dropdown.zindex,
                                a = KTUtil.getHighestZindex(e);
                            null !== a && a >= o && (o = a + 1), o > 0 && KTUtil.css(t, "z-index", o), null !== i && KTUtil.css(t, "width", i), null !== r && KTUtil.css(t, "height", r), KTUtil.css(t, "display", ""), KTUtil.css(t, "overflow", ""), b(e, t), KTUtil.addClass(e, "show"), KTUtil.addClass(e, "menu-dropdown"), KTUtil.addClass(t, "show"), !0 === x(e, "overflow") ? (document.body.appendChild(t), KTUtil.data(e).set("sub", t), KTUtil.data(t).set("item", e), KTUtil.data(t).set("menu", n)) : KTUtil.data(t).set("item", e), KTEventHandler.trigger(n.element, "kt.menu.dropdown.shown", e)
                        }
                    }, w = function (e) {
                        if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.dropdown.hide", e)) {
                            var t = g(e);
                            KTUtil.css(t, "z-index", ""), KTUtil.css(t, "width", ""), KTUtil.css(t, "height", ""), KTUtil.removeClass(e, "show"), KTUtil.removeClass(e, "menu-dropdown"), KTUtil.removeClass(t, "show"), !0 === x(e, "overflow") && (e.classList.contains("menu-item") ? e.appendChild(t) : KTUtil.insertAfter(n.element, e), KTUtil.data(e).remove("sub"), KTUtil.data(t).remove("item"), KTUtil.data(t).remove("menu")), k(e), KTEventHandler.trigger(n.element, "kt.menu.dropdown.hidden", e)
                        }
                    }, b = function (e, t) {
                        var n, i = x(e, "attach");
                        n = i ? "parent" === i ? e.parentNode : document.querySelector(i) : e;
                        var r = Popper.createPopper(n, t, y(e));
                        KTUtil.data(e).set("popper", r)
                    }, k = function (e) {
                        !0 === KTUtil.data(e).has("popper") && (KTUtil.data(e).get("popper").destroy(), KTUtil.data(e).remove("popper"))
                    }, y = function (e) {
                        var t = x(e, "placement");
                        t || (t = "right");
                        var n = x(e, "offset"), i = n ? n.split(",") : [];
                        return {
                            placement: t,
                            strategy: !0 === x(e, "overflow") ? "absolute" : "fixed",
                            modifiers: [{name: "offset", options: {offset: i}}, {
                                name: "preventOverflow",
                                options: {altAxis: !1 !== x(e, "flip")}
                            }, {name: "flip", options: {flipVariations: !1}}]
                        }
                    }, S = function (e) {
                        if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.accordion.show", e)) {
                            var t = g(e), i = n.options.accordion.expand;
                            !0 === x(e, "expand") ? i = !0 : !1 === x(e, "expand") ? i = !1 : !0 === x(n.element, "expand") && (i = !0), !1 === i && I(e), !0 === KTUtil.data(e).has("popper") && w(e), KTUtil.addClass(e, "hover"), KTUtil.addClass(e, "showing"), KTUtil.slideDown(t, n.options.accordion.slideSpeed, (function () {
                                KTUtil.removeClass(e, "showing"), KTUtil.addClass(e, "show"), KTUtil.addClass(t, "show"), KTEventHandler.trigger(n.element, "kt.menu.accordion.shown", e)
                            }))
                        }
                    }, A = function (e) {
                        if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.accordion.hide", e)) {
                            var t = g(e);
                            KTUtil.addClass(e, "hiding"), KTUtil.slideUp(t, n.options.accordion.slideSpeed, (function () {
                                KTUtil.removeClass(e, "hiding"), KTUtil.removeClass(e, "show"), KTUtil.removeClass(t, "show"), KTUtil.removeClass(e, "hover"), KTEventHandler.trigger(n.element, "kt.menu.accordion.hidden", e)
                            }))
                        }
                    }, I = function (e) {
                        var t, i = KTUtil.findAll(n.element, ".show[data-kt-menu-trigger]");
                        if (i && i.length > 0) for (var r = 0, o = i.length; r < o; r++) t = i[r], "accordion" === v(t) && t !== e && !1 === e.contains(t) && !1 === t.contains(e) && A(t)
                    }, x = function (e, t) {
                        var n, i = null;
                        return e && e.hasAttribute("data-kt-menu-" + t) && (n = e.getAttribute("data-kt-menu-" + t), null !== (i = KTUtil.getResponsiveValue(n)) && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1)), i
                    };
                !0 === KTUtil.data(e).has("menu") ? n = KTUtil.data(e).get("menu") : r(), n.click = function (e, t) {
                    return function (e, t) {
                        t.preventDefault();
                        var n = T(e);
                        "click" === x(n, "trigger") && (!1 === x(n, "toggle") ? a(n) : o(n))
                    }(e, t)
                }, n.link = function (e, t) {
                    !1 !== KTEventHandler.trigger(n.element, "kt.menu.link.click", n) && (KTMenu.hideDropdowns(), KTEventHandler.trigger(n.element, "kt.menu.link.clicked", n))
                }, n.dismiss = function (e, t) {
                    return function (e, t) {
                        var n = T(e), i = E(n);
                        if (null !== n && "dropdown" === v(n) && (l(n), i.length > 0)) for (var r = 0, o = i.length; r < o; r++) null !== i[r] && "dropdown" === v(i[r]) && l(tems[r])
                    }(e)
                }, n.mouseover = function (e, t) {
                    return function (e, t) {
                        var n = T(e);
                        null !== n && "hover" === x(n, "trigger") && ("1" === KTUtil.data(n).get("hover") && (clearTimeout(KTUtil.data(n).get("timeout")), KTUtil.data(n).remove("hover"), KTUtil.data(n).remove("timeout")), a(n))
                    }(e)
                }, n.mouseout = function (e, t) {
                    return function (e, t) {
                        var i = T(e);
                        if (null !== i && "hover" === x(i, "trigger")) {
                            var r = setTimeout((function () {
                                "1" === KTUtil.data(i).get("hover") && l(i)
                            }), n.options.dropdown.hoverTimeout);
                            KTUtil.data(i).set("hover", "1"), KTUtil.data(i).set("timeout", r)
                        }
                    }(e)
                }, n.getItemTriggerType = function (e) {
                    return x(e, "trigger")
                }, n.getItemSubType = function (e) {
                    return v(e)
                }, n.show = function (e) {
                    return a(e)
                }, n.hide = function (e) {
                    return l(e)
                }, n.reset = function (e) {
                    return s(e)
                }, n.update = function () {
                    return u()
                }, n.getElement = function () {
                    return n.element
                }, n.getItemLinkElement = function (e) {
                    return p(e)
                }, n.getItemToggleElement = function (e) {
                    return function (e) {
                        return n.triggerElement ? n.triggerElement : p(e)
                    }(e)
                }, n.getItemSubElement = function (e) {
                    return g(e)
                }, n.getItemParentElements = function (e) {
                    return function (e) {
                        var t, i = [], r = 0;
                        do {
                            (t = h(e)) && (i.push(t), e = t), r++
                        } while (null !== t && r < 20);
                        return n.triggerElement && i.unshift(n.triggerElement), i
                    }(e)
                }, n.isItemSubShown = function (e) {
                    return m(e)
                }, n.isItemParentShown = function (e) {
                    return function (e) {
                        return KTUtil.parents(e, ".menu-item.show").length > 0
                    }(e)
                }, n.getTriggerElement = function () {
                    return n.triggerElement
                }, n.isItemDropdownPermanent = function (e) {
                    return function (e) {
                        return !0 === x(e, "permanent")
                    }(e)
                }, n.destroy = function () {
                    KTUtil.data(n.element).remove("menu")
                }, n.hideAccordions = function (e) {
                    return I(e)
                }, n.on = function (e, t) {
                    return KTEventHandler.on(n.element, e, t)
                }, n.one = function (e, t) {
                    return KTEventHandler.one(n.element, e, t)
                }, n.off = function (e) {
                    return KTEventHandler.off(n.element, e)
                }
            }
        };
        KTMenu.getInstance = function (e) {
            var t;
            if (KTUtil.data(e).has("menu")) return KTUtil.data(e).get("menu");
            if ((t = e.closest(".menu")) && KTUtil.data(t).has("menu")) return KTUtil.data(t).get("menu");
            if (KTUtil.hasClass(e, "menu-link")) {
                var n = e.closest(".menu-sub");
                if (KTUtil.data(n).has("menu")) return KTUtil.data(n).get("menu")
            }
            return null
        }, KTMenu.hideDropdowns = function (e) {
            var t = document.querySelectorAll(".show.menu-dropdown[data-kt-menu-trigger]");
            if (t && t.length > 0) for (var n = 0, i = t.length; n < i; n++) {
                var r = t[n], o = KTMenu.getInstance(r);
                o && "dropdown" === o.getItemSubType(r) && (e ? !1 === o.getItemSubElement(r).contains(e) && !1 === r.contains(e) && r !== e && o.hide(r) : o.hide(r))
            }
        }, KTMenu.updateDropdowns = function () {
            var e = document.querySelectorAll(".show.menu-dropdown[data-kt-menu-trigger]");
            if (e && e.length > 0) for (var t = 0, n = e.length; t < n; t++) {
                var i = e[t];
                KTUtil.data(i).has("popper") && KTUtil.data(i).get("popper").forceUpdate()
            }
        }, KTMenu.initGlobalHandlers = function () {
            document.addEventListener("click", (function (e) {
                var t, n, i, r = document.querySelectorAll(".show.menu-dropdown[data-kt-menu-trigger]");
                if (r && r.length > 0) for (var o = 0, a = r.length; o < a; o++) if (t = r[o], (i = KTMenu.getInstance(t)) && "dropdown" === i.getItemSubType(t)) {
                    if (i.getElement(), n = i.getItemSubElement(t), t === e.target || t.contains(e.target)) continue;
                    if (n === e.target || n.contains(e.target)) continue;
                    i.hide(t)
                }
            })), KTUtil.on(document.body, '.menu-item[data-kt-menu-trigger] > .menu-link, [data-kt-menu-trigger]:not(.menu-item):not([data-kt-menu-trigger="auto"])', "click", (function (e) {
                var t = KTMenu.getInstance(this);
                if (null !== t) return t.click(this, e)
            })), KTUtil.on(document.body, ".menu-item:not([data-kt-menu-trigger]) > .menu-link", "click", (function (e) {
                var t = KTMenu.getInstance(this);
                if (null !== t) return t.link(this, e)
            })), KTUtil.on(document.body, '[data-kt-menu-dismiss="true"]', "click", (function (e) {
                var t = KTMenu.getInstance(this);
                if (null !== t) return t.dismiss(this, e)
            })), KTUtil.on(document.body, "[data-kt-menu-trigger], .menu-sub", "mouseover", (function (e) {
                var t = KTMenu.getInstance(this);
                if (null !== t && "dropdown" === t.getItemSubType(this)) return t.mouseover(this, e)
            })), KTUtil.on(document.body, "[data-kt-menu-trigger], .menu-sub", "mouseout", (function (e) {
                var t = KTMenu.getInstance(this);
                if (null !== t && "dropdown" === t.getItemSubType(this)) return t.mouseout(this, e)
            })), window.addEventListener("resize", (function () {
                var e;
                KTUtil.throttle(undefined, (function () {
                    var t = document.querySelectorAll('[data-kt-menu="true"]');

                    //console.log(t);

                    if (t && t.length > 0) for (var n = 0, i = t.length; n < i; n++) (e = KTMenu.getInstance(t[n])) && e.update()
                }), 200)
            }))
        }, KTMenu.createInstances = function (e = '[data-kt-menu="true"]') {
            var t = document.querySelectorAll(e);
            if (t && t.length > 0) for (var n = 0, i = t.length; n < i; n++) new KTMenu(t[n])
        }, KTMenu.init = function () {
            KTMenu.initGlobalHandlers(), KTMenu.createInstances()
        }, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", KTMenu.init) : KTMenu.init(), "undefined" != typeof module && void 0 !== module.exports && (module.exports = KTMenu);


        return;
    }

    setTimeout(initMenu, 500);

}, 500);



