/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */


var isMobile = {
    Android: function Android() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    AndroidMobile: function AndroidMobile() {
        return navigator.userAgent.match(/Android(?=.+Mobile)/i) ? true : false;
    },
    AndroidTablet: function AndroidTablet() {
        return navigator.userAgent.match(/Android(?!.+Mobile)/i) ? true : false;
    },
    BlackBerry: function BlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function iOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    iPhone: function iPhone() {
        return (/iphone/.test(navigator.userAgent.toLowerCase()) && !window.MSStream
        );
    },
    iPad: function iPad() {
        return (/ipad/.test(navigator.userAgent.toLowerCase()) && !window.MSStream
        );
    },
    iPod: function iPod() {
        return (/ipod/.test(navigator.userAgent.toLowerCase()) && !window.MSStream
        );
    },
    Windows: function Windows() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    Other: function Other() {
        return navigator.userAgent.match(/windows\ phone|windows\ mobile|windows\ ce|symbian|opera\ mini|nokia|symbos|blackberry/i) ? true : false;
    },
    any: function any() {
        return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows();
    }
};

// user_agent = navigator.userAgent.toLowerCase();
//
// mac = -1 != user_agent.indexOf('mac');
// windows = -1 != user_agent.indexOf('windows');
// ua_chrome = -1 != user_agent.indexOf("chrome");
// ua_ya = -1 != user_agent.indexOf("yabrowser");
// firefox = -1 != user_agent.indexOf("firefox");
// linux = -1 != user_agent.indexOf("linux");
// new_opera = -1 != user_agent.indexOf("opr");
// ua_opera = -1 != user_agent.indexOf("opera");
// ie_11_edge = !window.ActiveXObject && "ActiveXObject" in window;
// edge = -1 != user_agent.indexOf("edge");
// opera_dev = -1 != user_agent.indexOf("developer");
// ie_8 = document.all && !document.addEventListener;
// ie_9 = (navigator.userAgent.toLowerCase().indexOf('msie') != -1 ? parseInt(navigator.userAgent.toLowerCase().split('msie')[1]) : false) == 9;
// ios = /ipad|iphone|ipod/.test(user_agent) && !window.MSStream;
//
// edge = -1 != navigator.userAgent.toLowerCase().indexOf("edge");
// linux = -1 != navigator.userAgent.toLowerCase().indexOf("linux");
// new_opera = -1 != navigator.userAgent.toLowerCase().indexOf("opr");
// if (isMobile.any()) {
//     return;
// }
// ua_ios_opera = -1 != navigator.userAgent.toLowerCase().indexOf("opios");
// ua_ios_opera_mini = -1 != navigator.userAgent.toLowerCase().indexOf("opera mini");