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


let options = {
    minLength: 8,
    checkUppercase: !0,
    checkLowercase: !0,
    checkDigit: !0,
    checkChar: !0,
    scoreHighlightClass: "active",
    score: 0,
    checkSteps: 5,
};

document.body.querySelectorAll('[data-password-meter]').forEach((e) => {


    let inputElement = e.querySelector("input[type]");


    /** Показать/скрыть */

    let visibility = e.querySelector('[data-password-meter-control="visibility"]')

    visibility?.addEventListener("click", (function ()
    {
        let e = visibility.querySelector("i:not(.d-none), .svg-icon:not(.d-none)");
        let t = visibility.querySelector("i.d-none, .svg-icon.d-none");

        inputElement.getAttribute("type").toLowerCase() === "password" ? inputElement.setAttribute("type", "text") : inputElement.setAttribute("type", "password");

        e.classList.add("d-none");
        t.classList.remove("d-none");
        inputElement.focus();
    }));



    let passGenerator = e.querySelector('[data-password-meter-generator]');

    if (passGenerator)
    {
        passGenerator.addEventListener("click", event => generate_password(8));
    }


    /** Сложность пароля */
    let highlight = e.querySelector('[data-password-meter-control="highlight"]');

    if (inputElement) {
        inputElement.addEventListener("input",  event => init());
        init();
    }

    function init() {
        var e = 0,
            t = m();

        !0 === l() && (e += t),
        !0 === options.checkUppercase && !0 === s() && (e += t),
        !0 === options.checkLowercase && !0 === u() && (e += t),
        !0 === options.checkDigit && !0 === d() && (e += t),
        !0 === options.checkChar && !0 === c() && (e += t),
            options.score = e,
            f()
    }

    function l() {
        return inputElement.value.length >= options.minLength
    }

    function m() {
        var e = 1;
        return !0 === options.checkUppercase && e++,
        !0 === options.checkLowercase && e++, !0 === options.checkDigit && e++, !0 === options.checkChar && e++, checkSteps = e, 100 / options.checkSteps
    }

    function s() {
        return /[a-z]/.test(inputElement.value)
    }

    function u() {
        return /[A-Z]/.test(inputElement.value)
    }

    function d() {
        return /[0-9]/.test(inputElement.value)
    }

    function c() {
        return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inputElement.value)
    }

    function f() {
        var e = [].slice.call(highlight.querySelectorAll("div")), t = e.length, i = 1, r = m(), o = g();
        e.map((function (e) {

            if (r * i * (options.checkSteps / t) <= o) {

                if (l()) {
                    e.classList.add("bg-primary");
                    e.classList.remove("bg-light");
                    e.classList.remove("bg-danger");
                }
                else
                {
                    e.classList.add("bg-danger");
                }

            } else {

                if (l() == false && i === 1) {
                    e.classList.add("bg-danger");
                } else {

                    e.classList.add("bg-light");
                    e.classList.remove("bg-primary");
                }
            }

            i++;
        }))
    }

    function g() {
        return options.score
    }

    function generate_password(length = 8)
    {
        // Символы, которые можно использовать в пароле
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = lowercaseChars.toUpperCase();
        const numberChars = '0123456789';
        const specialChars = '!?:@#$%&*';

        // Создаем пустую строку, в которую будем добавлять символы
        let password = '';

        // Генерируем пароль, включая по одному символу из каждой категории
        password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        password += numberChars[Math.floor(Math.random() * numberChars.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];

        // Генерируем остальные символы пароля
        for (let i = 0; i < length - 4; i++) {
            // Получаем случайный индекс символа из строки characters
            const index = Math.floor(Math.random() * (lowercaseChars.length + uppercaseChars.length + numberChars.length + specialChars.length));

            // Добавляем символ в пароль
            if (index < lowercaseChars.length) {
                password += lowercaseChars[index];
            } else if (index < lowercaseChars.length + uppercaseChars.length) {
                password += uppercaseChars[index - lowercaseChars.length];
            } else if (index < lowercaseChars.length + uppercaseChars.length + numberChars.length) {
                password += numberChars[index - lowercaseChars.length - uppercaseChars.length];
            } else {
                password += specialChars[index - lowercaseChars.length - uppercaseChars.length - numberChars.length];
            }
        }

        // Перемешиваем символы пароля
        password = password.split('').sort(() => Math.random() - 0.5).join('');


        // Заполняем поля
        inputElement.value = password;

        let second = document.querySelector('input[name*="[second]"]');
        if (second)
        {
            second.value = password;
        }


        let e = visibility.querySelector("i:not(.d-none), .svg-icon:not(.d-none)");
        let t = visibility.querySelector("i.d-none, .svg-icon.d-none");

        if  (inputElement.getAttribute("type").toLowerCase() === "password" ) {
            inputElement.setAttribute("type", "text");

            e.classList.add("d-none");
            t.classList.remove("d-none");

        }

        inputElement.focus();
        init();

    }
});


