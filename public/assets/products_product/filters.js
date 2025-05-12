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

executeFunc(function productFilter()
{
    if(typeof formDebounce !== 'function')
    {
        return false;
    }

    document.querySelectorAll('.product_filter_form').forEach(function(form)
    {
        form.addEventListener('click', () =>
        {
            if(idFormDebounce == lastFormDebounce)
            {
                /* Сбрасываем отправку формы, если выбран выпадающий список */
                clearTimeout(lastFormDebounce);
            }

            lastFormDebounce = idFormDebounce;
        });

        const inputFields = form.querySelectorAll('input, select, textarea');

        // Добавляем обработчик изменения для каждого поля ввода
        inputFields.forEach(field =>
        {
            if(
                field.id === 'product_filter_form_category' ||
                field.id === 'product_filter_form_all'
            )
            {
                field.addEventListener('change', () =>
                {
                    const product_filter_form_offer = form.product_filter_form_offer;

                    if(typeof product_filter_form_offer === 'object')
                    {
                        const options = product_filter_form_offer.options;

                        for(var i = 0; i < options.length; i++)
                        {
                            options[i].selected = false;
                        }

                        product_filter_form_offer.selectedIndex = 0;
                    }

                    setTimeout(() => { form.submit(); }, 300);

                });

                return;
            }

            field.addEventListener('change', formDebounce(() => { form.submit(); }, 1500));

        });

    });

    return true;

});