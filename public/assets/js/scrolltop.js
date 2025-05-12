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

var KTScrolltop = function (e, t) {
    var n = this, i = document.getElementsByTagName("BODY")[0];
    if (null != e) {
        var r = {offset: 300, speed: 600}, o = function () {
            n.options = KTUtil.deepExtend({}, r, t), n.uid = KTUtil.getUniqueId("scrolltop"), n.element = e, n.element.setAttribute("data-kt-scrolltop", "true"), a(), KTUtil.data(n.element).set("scrolltop", n)
        }, a = function () {
            window.addEventListener("scroll", (function () {
                KTUtil.throttle(undefined, (function () {
                    l()
                }), 200)
            })), KTUtil.addEvent(n.element, "click", (function (e) {
                e.preventDefault(), s()
            }))
        }, l = function () {
            var e = parseInt(u("offset"));
            KTUtil.getScrollTop() > e ? !1 === i.hasAttribute("data-kt-scrolltop") && i.setAttribute("data-kt-scrolltop", "on") : !0 === i.hasAttribute("data-kt-scrolltop") && i.removeAttribute("data-kt-scrolltop")
        }, s = function () {
            var e = parseInt(u("speed"));
            KTUtil.scrollTop(0, e)
        }, u = function (e) {
            if (!0 === n.element.hasAttribute("data-kt-scrolltop-" + e)) {
                var t = n.element.getAttribute("data-kt-scrolltop-" + e), i = KTUtil.getResponsiveValue(t);
                return null !== i && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1), i
            }
            var r = KTUtil.snakeToCamel(e);
            return n.options[r] ? KTUtil.getResponsiveValue(n.options[r]) : null
        };
        KTUtil.data(e).has("scrolltop") ? n = KTUtil.data(e).get("scrolltop") : o(), n.go = function () {
            return s()
        }, n.getElement = function () {
            return n.element
        }, n.destroy = function () {
            KTUtil.data(n.element).remove("scrolltop")
        }
    }
};
KTScrolltop.getInstance = function (e) {
    return e && KTUtil.data(e).has("scrolltop") ? KTUtil.data(e).get("scrolltop") : null
}, KTScrolltop.createInstances = function (e = '[data-kt-scrolltop="true"]') {
    var t = document.getElementsByTagName("BODY")[0].querySelectorAll(e);
    if (t && t.length > 0) for (var n = 0, i = t.length; n < i; n++) new KTScrolltop(t[n])
}, KTScrolltop.init = function () {
    KTScrolltop.createInstances()
}, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", KTScrolltop.init) : KTScrolltop.init(), "undefined" != typeof module && void 0 !== module.exports && (module.exports = KTScrolltop);
