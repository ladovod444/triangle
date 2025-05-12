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


//centrifuge.connect();


function createToast(ctx) {

    let data = JSON.parse(ctx);

    let $type = data.type;
    let $header = data.header;
    let $message = data.message;
    let $href = data.href;
    let $name = data.name;

    var toastDiv = document.getElementById('toast');

    if (toastDiv) {
        // class="alert alert-light" role="alert"
        var toastEl = document.createElement('div');
        toastEl.className = 'toast';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        var tostHeader = document.createElement('div');
        tostHeader.className = 'toast-header';
        toastEl.append(tostHeader);

        var toastSpan = document.createElement('SPAN');
        toastSpan.classList.add('symbol');
        toastSpan.classList.add('symbol-circle');
        toastSpan.classList.add('toast-icon');
        toastSpan.classList.add('bg-' + $type);
        toastSpan.classList.add('me-3');

        tostHeader.append(toastSpan);

        /* Заголовок */
        var tostStrong = document.createElement('strong');
        tostStrong.classList.add('me-auto');
        tostStrong.classList.add('mt-1');
        tostStrong.textContent = $header;
        tostHeader.append(tostStrong);

        /* Кнопка закрыть */
        var tostClosed = document.createElement('button');
        tostClosed.type = 'button';
        tostClosed.className = 'btn-close';
        tostClosed.setAttribute('data-bs-dismiss', 'toast');
        tostClosed.setAttribute('aria-label', 'Close');
        tostHeader.append(tostClosed);


        /* Текст сообщения */
        var toastBody = document.createElement('div');
        toastBody.className = 'toast-body';
        toastEl.append(toastBody);

        var toastText = document.createElement('p');
        toastText.textContent = $message;
        toastBody.append(toastText);


        if ($href) {
            var toastHref = document.createElement('a');
            toastHref.classList.add('text-decoration-none');
            toastHref.classList.add('ms-3');
            toastHref.href = $href;
            toastHref.textContent = $name;
            toastText.append(toastHref);
        }

        document.getElementById('toast').appendChild(toastEl);
        document.getElementById('toast').appendChild(toastEl);
        document.getElementById('toast').appendChild(toastEl);

        new bootstrap.Toast(toastEl, {delay: 3000000}).show();
    }
}
