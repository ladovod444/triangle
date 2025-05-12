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

const scrollElements = document.querySelectorAll('[data-scroll]');

scrollElements.forEach(element =>
{
    element.addEventListener('click', () =>
    {
        const elementId = element.dataset.scroll;
        const position = element.dataset.scrollPosition || 'center'; // Добавьте опциональную позицию
        scrollToElement(elementId, position);

        if(typeof bootstrap !== 'object')
        {
            return;
        }

        /** Срываем все раскрытые dropdown */
        document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(menu =>
        {
            (bootstrap.Dropdown.getInstance(menu))?.hide();
        });

        /** Срываем все раскрытые offcanvas */
        document.querySelectorAll('.offcanvas').forEach(menu =>
        {
            (bootstrap.Offcanvas.getInstance(menu))?.hide();
        });
    });
});


/**
 * Функция скролит страницу до элемента. К элементу, при клике по которому произойдет скрол, необходимо добавить аттрибут
 *
 * data-scroll = "elementId" - указать идентификатор элемента к которому скролить
 * data-scroll-position = "top|center|bottom" - опционально можно указать как позиционировать этот элемент (По умолчанию - по центру)
 *
 */

function scrollToElement(elementId, position = 'center')
{

    const element = document.getElementById(elementId);

    if(!element)
    {
        console.error(`Элемент с ID "${elementId}" не найден!`);
        return;
    }

    let scrollTop = 0;

    switch(position)
    {
        case 'bottom':
            scrollTop = element.offsetTop;
            break;

        case 'top':
            scrollTop = element.offsetTop + element.offsetHeight;
            break;

        case 'center':

        default:
            scrollTop = element.offsetTop + (element.offsetHeight / 2) - (window.innerHeight / 2);
            break;
    }

    window.scrollTo({
        top: scrollTop, behavior: 'smooth'
    });
}