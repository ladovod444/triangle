/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
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

//document.addEventListener("DOMContentLoaded", (event) => {

const search_form = document.forms.search_form;
if (search_form) {


    const input = search_form.querySelector('#search_form_query'); //basket.getElementById('order_product_form_price_total');

    const search_result = document.getElementById('search_result');

    if (search_result) {

        search_form.addEventListener('submit', function (event) {
            event.preventDefault();
        });

        /** При фокусе на поле поиска отправляем запрос если результата нет */
        input.addEventListener("focus", (event) => {
            if (input.value.length > 2 && !search_result.innerText) {
                submitSearch();
            }
        });


        /** Показать результат поиска при наведение курсора мыши курсора на форму поиска */
        search_form.addEventListener("mouseover", (event) => {
            if (input.value.length > 2 && search_result.innerText) {
                search_result.classList.add('show');
            }
        });

        /** Скрываем результат поиска при выходе курсора с результата */
        search_result.addEventListener("mouseout", (event) => {
            search_result.classList.remove('show');
        });

        /** Скрываем результат поиска при клике все формы поиска */
        document.addEventListener("click", function (event) {

            var isClickInsideBlock1 = input.contains(event.target);
            var isClickInsideBlock2 = search_result.contains(event.target);

            if (!isClickInsideBlock1 && !isClickInsideBlock2) {
                search_result.classList.remove('show');
            }
        });


        let HpbxMyNKd = 100;

        setTimeout(function FFAAVWpUZ() {

            if (typeof submitSearch.debounce === 'function') {
                input.addEventListener('input', submitSearch.debounce(700));
                return;
            }

            if (HpbxMyNKd >= 1000) {
                return;
            }
            HpbxMyNKd = HpbxMyNKd * 2;

            setTimeout(FFAAVWpUZ, HpbxMyNKd);

        }, 100);

    }
}


async function submitSearch() {

    const search_icon = document.getElementById('search_icon');
    const search_spiner = document.getElementById('search_spiner');
    const search_result = document.getElementById('search_result');
    const input = document.getElementById('search_form_query');
    const data = new FormData(search_form);

    search_spiner.classList.remove('d-none');
    search_icon.classList.add('d-none');

    if (!search_result || typeof search_result === 'undefined' || input.value.length < 3) {

        search_spiner.classList.add('d-none');
        search_icon.classList.remove('d-none');
        search_result.classList.remove('show');
        search_result.innerHTML = '';

        return;
    }


    await fetch(search_form.action, {
        method: search_form.method, // *GET, POST, PUT, DELETE, etc.
        //mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            // 'X-Requested-With': 'XMLHttpChange'
            'X-Requested-With': 'XMLHttpRequest'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: data // body data type must match "Content-Type" header
    })


        .then((response) => {

            if (response.status !== 200) {
                return false;
            }

            return response.text();
        })

        .then((data) => {

            search_spiner.classList.add('d-none');
            search_icon.classList.remove('d-none');
            search_result.classList.add('show');

            if (data !== '' && data !== false) {

                search_result.innerHTML = data;

            } else {
                //search_result.classList.remove('show');
                search_result.innerHTML = '<div class="alert alert-light">К сожалению ничего не найдено</div>';
            }

        });


    return false;

}