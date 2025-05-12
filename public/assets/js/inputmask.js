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
//
// window.addEventListener('DOMContentLoaded', function() {
//     var inputs = document.querySelectorAll('input[type="tel"]');
//
//     Array.prototype.forEach.call(inputs, function(input) {
//         new InputMask({
//             selector: input, // в качестве селектора может быть элемент, или, собственно css селектор('#input', '.input', 'input'). Если селектор - тег или класс - будет получен только первый элемент
//             layout: input.dataset.mask
//         })
//     })
//
// })


limitcsnJftGwR = 100;

setTimeout(function hsrxswFKs()
{
    if(typeof InputMask == 'function')
    {
        var inputs = document.querySelectorAll('input[type="tel"]');

        Array.prototype.forEach.call(inputs, function(input) {

            if(input.classList.contains('loaded') === false)
            {
                new InputMask(input)
            }
        })

        return;
    }

    if(limitcsnJftGwR > 1000)
    {
        return;
    }

    limitcsnJftGwR = limitcsnJftGwR * 2;

    setTimeout(hsrxswFKs, limitcsnJftGwR);

}, 100);

function InputMask(element) {

    this.layout = '+_ (___) ___-__-__';

    if(element.dataset.mask)
    {
        this.layout = element.dataset.mask;
    }

    this.el = element;

/*    this.el = this.getElement(options.selector);

    if (!this.el) return console.log('Что-то не так с селектором');

    this.layout = options.layout || '+_ (___) ___-__-__';
    this.maskreg = this.getRegexp();

    this.setListeners();*/
    //this.maskreg = this.getRegexp();
    this.setListeners();

    element.classList.add('loaded');
}


InputMask.prototype.getRegexp = function() {
    var str = this.layout.replace(/_/g, '\\d')
    str = str.replace(/\(/g, '\\(')
    str = str.replace(/\)/g, '\\)')
    str = str.replace(/\+/g, '\\+')
    str = str.replace(/\s/g, '\\s')
    return str;
}

InputMask.prototype.mask = function(e) {



    var _this = e.target,
        matrix = this.layout,
        i = 0,
        def = matrix.replace(/\D/g, "");


    var lastCharacterInt = _this.value.length - 1;
    var currentChar = _this.value[lastCharacterInt];

    if(lastCharacterInt === 0)
    {
        /** Если первый сичвол 8 - номер в междуГОРОДном формате */

        if(currentChar == 8)
        {
            this.layout = '_ (___) ___-__-__';
            _this.value = 8;
            return 8;
        }

        /** номер в междуНАРОДном формате */

        if(currentChar == '+')
        {
            this.layout = '+_ (___) ___-__-__';
            //_this.value = '+';
            return '+';
        }

        if(currentChar != 8)
        {
            this.layout = '+'+currentChar+' (___) ___-__-__';
            _this.value = '+'+currentChar;
            return '+'+currentChar;
        }
    }
    else if(lastCharacterInt > 0)
    {
        var currentMaskChar = this.layout[lastCharacterInt];

        /** Если вводный символ равен маске */
        if(currentChar === currentMaskChar)
        {
            return currentChar;
        }

        var space = false;

        /** Если вводный символ пробел - проверяем следующий за пробелом символ */
        if(currentMaskChar == ' ')
        {
            space = true;
            currentMaskChar = this.layout[_this.value.length];
        }

        if(currentChar === currentMaskChar)
        {
            if(space)
            {
                _this.value + currentChar;
                space = false;
            }

            return;
        }
    }


    var val = _this.value.replace(/\D/g, "");

    if (def.length >= val.length) val = def;

    _this.value = matrix.replace(/./g, function(a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
    });


    if (e.type == "blur") {
        var regexp = new RegExp(this.maskreg);
        if (!regexp.test(_this.value)) _this.value = "";
    } else {
        this.setCursorPosition(_this.value.length, _this);
    }
}

InputMask.prototype.setCursorPosition = function(pos, elem) {
    elem.focus();
    if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
    else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select()
    }
}

InputMask.prototype.setListeners = function() {
    this.el.addEventListener("input", this.mask.bind(this), false);
    this.el.addEventListener("focus", this.mask.bind(this), false);
    this.el.addEventListener("blur", this.mask.bind(this), false);
}

InputMask.prototype.getElement = function(selector) {

    if (selector === undefined) return false;

    if (this.isElement(selector)) return selector;

    if (typeof selector == 'string') {
        var el = document.querySelector(selector);
        if (this.isElement(el)) return el;
    }

    return false
}

InputMask.prototype.isElement = function(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}