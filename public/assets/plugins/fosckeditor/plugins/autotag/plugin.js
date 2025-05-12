

/**
 * Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 *
 * Simple CKEditor tag autocomplete that was built in the
 * https://ckeditor.com/docs/ckeditor4/latest/features/autocomplete.html tutorial.
 */

// Register the plugin in the editor.
CKEDITOR.plugins.add( 'autotag', {
    requires: 'autocomplete,textmatch,codemirror',

    init: function( editor ) {


        //editor.mode = 'source';
        //editor.setMode('source');

        /*editor.on( 'mode', function() {
            editor.setMode('source');
        } );*/

        editor.on( 'instanceReady', function() {
            var config = {};



            // Вызывается, когда пользователь вводит текст в редакторе или перемещает курсор.
            // Диапазон представляет позицию курсора.
            function textTestCallback( range ) {
                // Вы не хотите автоматически заполнять непустой выбор.
                if ( !range.collapsed ) {
                    return null;
                }

                // Используйте плагин сопоставления текста, который выполняет сложную работу
                // текстовый поиск в DOM. Функция matchCallback должна вернуть
                // соответствующий фрагмент текста.
                return CKEDITOR.plugins.textMatch.match( range, matchCallback );
            }

            // Возвращает позицию совпадающего текста.
            // Соответствует слову, начинающемуся с символа '#'
            // до позиции курсора.
            function matchCallback( text, offset ) {
                // Получите текст перед кареткой.
                var left = text.slice( 0, offset ),
                    // Ищет символ "#", за которым следует номер билета.
                    match = left.match( /\w*$/ );

                if ( !match ) {
                    return null;
                }
                return {
                    start: match.index,
                    end: offset
                };
            }

            config.textTestCallback = textTestCallback;

            // Переменная itemsArray является примером «базы данных».
            var itemsArray = [
                {
                    id: 'div',
                    name: '<div></div>',
                    type: 'feature'
                },
                {
                    id: 'span',
                    name: '<span></span>',
                    type: 'feature'
                }
            ];

            // Возвращает (через обратный вызов) предложения для текущего запроса.
            function dataCallback( matchInfo, callback ) {



                // Remove the '#' tag.
                var query = matchInfo.query.substring( 0 );

                // Простой поиск.
                // Фильтруем весь массив элементов, чтобы остались только элементы,
                // которые начинаются с запроса.
                var suggestions = itemsArray.filter( function( item ) {

                    console.log(item);
                    console.log(query);
                    console.log(String( item.id ).indexOf( query ));



                    return String( item.id ).indexOf( query ) == 0;
                } );

            // Примечание. Функция обратного вызова также может выполняться асинхронно,
            // поэтому dataCallback может выполнять запрос XHR или использовать любой другой асинхронный API.
                callback( suggestions );
            }



            config.dataCallback = dataCallback;

            // Определите шаблоны раскрывающегося списка предложений автозаполнения и вывода текста.
            config.itemTemplate = '{id}: {name}';
            config.outputTemplate = '{name}';

            // Прикрепите автозаполнение к редактору.
            new CKEDITOR.plugins.autocomplete( editor, config );


        } );
    }
} );

