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


/** Коллекция СЕКЦИЙ */

/* кнопка Добавить коллекцию */
//var $addButton = document.querySelector('button.add_collection');
var $addButton = document.getElementById('section_addCollection');


/* Блок для новой коллекции */
let $blockCollection = document.getElementById('section_collection');

if($blockCollection)
{

    /* добавить событие на удаление ко всем существующим элементам формы в блок с классом .del-item */
    let $delItem = $blockCollection.querySelectorAll('.del-item-section');

    /* Удаляем при клике колекцию СЕКЦИЙ */
    if($delItem)
    {
        $delItem.forEach(function(item, i, arr)
        {
            item.addEventListener('click', function(event)
            {
                let $counter = $addButton.dataset.index

                item.closest('.item-collection-section').remove();

            });
        });
    }


    /* кнопки Добавить поле */
    let $addButtonField = document.querySelectorAll('[id^="field_addCollection_"]');
    $addButtonField.forEach(function(item, i, arr)
    {
        fieldCollection(item.dataset.section);
    });


    /* Удаляем при клике колекцию ПОЛЕЙ */
    /* добавить событие на удаление ко всем существующим элементам формы в блок с классом .del-item */
    let $delItemField = $blockCollection.querySelectorAll('.del-item-field');

    /* Удаляем при клике колекцию ПОЛЕЙ */
    $delItemField.forEach(function(item, i, arr)
    {
        item.addEventListener('click', function(event)
        {

            let $countField = item.closest('.item-collection-field').parentNode.getElementsByClassName('item-collection-field').length;

            if($countField > 1)
            {
                item.closest('.item-collection-field').remove();
            } else
            {
                alert('Минимально должно быть добавлено одно поле');
            }
        });
    });


    /* Добавляем новую коллекцию */
    $addButton.addEventListener('click', function(event)
    {
        let $addButton = this;


        /* получаем прототип коллекции  */
        let newForm = $addButton.dataset.prototype;
        let index = $addButton.dataset.index * 1;

        /* Замена '__name__' в HTML-коде прототипа на
         вместо этого будет число, основанное на том, сколько коллекций */
        newForm = newForm.replace(/__section__/g, index);
        //newForm = newForm.replace(/__field__/g, 0);

        /* Вставляем новую коллекцию */
        let div = document.createElement('div');
        div.classList.add('card');
        div.classList.add('card-flush');
        div.classList.add('p-4');
        div.classList.add('mb-4');
        div.classList.add('item-collection-section');

        div.innerHTML = newForm;
        $blockCollection.append(div);

        /* Увеличиваем data-index на 1 после вставки новой коллекции */
        $addButton.dataset.index = (index + 1).toString();

        /* Удаляем при клике колекцию СЕКЦИЙ */
        div.querySelector('.del-item-section').addEventListener('click', function(event)
        {
            let $counter = $blockCollection.getElementsByClassName('item-collection-section').length;
            if($counter > 1)
            {
                $addButton.dataset.index = ($addButton.dataset.index - 1).toString();
                this.closest('.item-collection-section').remove();
            } else
            {
                alert('Минимально должна быть добавлена одна секция');
            }
        });


        /* получаем количество коллекций и присваеваем data-index прототипу */
        //let $index = $blockCollection.getElementsByClassName('item-collection').length;


        /* Добавляем новую коллекцию FIELD */
        fieldCollection(index);

        /* Получаем блок колекций FIELD в новой коллекции SECTION */
        //let $blockCollectionFields = document.getElementById('field_collection_'+index);


        /* Удаляем при клике колекцию */
        let $delField = div.querySelector('.del-item-field');
        if($delField)
        {
            $delField.addEventListener('click', function(event)
            {
                this.closest('.item-collection-field').remove();

            });
        }


        /* Добавляем в форму FIELD */
        //createField($blockCollectionFields, index);

    });
}

//});


function fieldCollection(index)
{

    /** Коллекция FIELDS */

    /* кнопка Добавить коллекцию */
    var $addButtonFields = document.getElementById('field_addCollection_' + index);

    /* Блок для новой коллекции */
    //let $blockCollectionFields = document.getElementById('field_collection_'+index);

    $addButtonFields.addEventListener('click', function(event)
    {
        /* Добавляем в форму FIELD */
        createField($addButtonFields);
    });
}


function createField($addButtonFields)
{

    //console.log($addButtonFields);


    /* получаем прототип коллекции  */
    let newFormField = $addButtonFields.dataset.prototype;
    let index = $addButtonFields.dataset.index * 1;
    let section = $addButtonFields.dataset.section * 1;


    /* Блок для новой коллекции */
    let $blockCollectionFields = document.getElementById('field_collection_' + section);


    /* Замена '__name__' в HTML-коде прототипа на
     вместо этого будет число, основанное на том, сколько коллекций */
    //newFormField = newFormField.replace(/__SECTION__/g, index);
    newFormField = newFormField.replace(/__section__/g, section);
    newFormField = newFormField.replace(/__field__/g, index);


    /* Вставляем новую коллекцию */
    let div = document.createElement('div');
    div.classList.add('item-collection-field')
    div.classList.add('card')
    div.classList.add('card-body')
    div.classList.add('border-light')


    div.innerHTML = newFormField;
    $blockCollectionFields.append(div);

    /* Увеличиваем data-index на 1 после вставки новой коллекции */
    $addButtonFields.dataset.index = (index + 1).toString();

    /* Удаляем при клике колекцию */
    div.querySelector('.del-item-field').addEventListener('click', function(event)
    {

        let $countField = div.parentNode.getElementsByClassName('item-collection-field').length;
        if($countField > 1)
        {


            $addButtonFields.dataset.index = ($addButtonFields.dataset.index - 1).toString();


            div.remove();


        } /* Удаляем блок */
        else
        {
            alert('Минимально должно быть добавлено одно поле');
        }

    });


}


