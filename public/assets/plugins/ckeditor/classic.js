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

ckeditors = {};

executeFunc(function initClassicEditor()
{
    if(typeof ClassicEditor !== 'function')
    {
        return false;
    }

    document.querySelectorAll('.ckeditor').forEach((ckeditor) =>
    {

        ClassicEditor
            .create(ckeditor, {
                extraPlugins: [MyCustomUploadAdapterPlugin],
                autoUpdateElement: true
            })
            .then(editor =>
            {
                ckeditors[editor.id] = editor;
            })
            .catch(error =>
            {
                console.error(error);
            });
    });

    return true;
})


BaksUploadAdapter = class BaksUploadAdapter
{
    constructor(loader)
    {
        // Экземпляр загрузчика файлов, который будет использоваться во время загрузки.
        this.loader = loader;
    }

    // Запускает процесс загрузки.
    upload()
    {
        return this.loader.file
            .then(file => new Promise((resolve, reject) =>
            {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    // Прерывает процесс загрузки.
    abort()
    {
        if(this.xhr)
        {
            this.xhr.abort();
        }
    }

    _initRequest()
    {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('POST', '/file/upload/image', true);
        xhr.responseType = 'json';
    }


    _initListeners(resolve, reject, file)
    {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () =>
        {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if(!response || response.error)
            {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // Если загрузка прошла успешно, разрешите обещание загрузки с помощью объекта, содержащего
            // по крайней мере, URL-адрес «по умолчанию», указывающий на изображение на сервере.
            // Этот URL-адрес будет использоваться для отображения изображения в контенте. Узнайте больше в
            // UploadAdapter#загрузить документацию.
            resolve({default: response.url});
        });

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if(xhr.upload)
        {
            xhr.upload.addEventListener('progress', evt =>
            {
                if(evt.lengthComputable)
                {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }


    _sendRequest(file)
    {
        // Prepare the form data.
        const data = new FormData();

        data.append('file', file);

        // Важное примечание: это подходящее место для реализации механизмов безопасности.
        // как аутентификация и защита CSRF. Например, вы можете использовать
        // XMLHttpRequest.setRequestHeader() для установки заголовков запроса, содержащих
        // токен CSRF, сгенерированный ранее вашим приложением.

        // Send the request.
        this.xhr.send(data);
    }
}


function MyCustomUploadAdapterPlugin(editor)
{
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
    {
        // Configure the URL to the upload script in your back-end here!
        return new BaksUploadAdapter(loader);
    };
}
