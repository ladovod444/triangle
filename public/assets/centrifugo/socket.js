/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
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


/*

 Важно! В шаблне Twig необходимо передать параметры

 <script nonce="{{ csp_nonce() }}" class="lazy">
 window.centrifugo_dsn = "{{ centrifugo_dsn }}";
 window.centrifugo_token = "{{ token }}";
 </script>

 */

executeFunc(function stWhECbst()
{
    if(typeof Centrifuge === 'function')
    {
        const dsn = window.centrifugo_dsn; // Получаем значение dsn
        const token = window.centrifugo_token; // Получаем значение token

        if(!dsn || !token)
        {
            return false;
        }


        centrifuge = new Centrifuge("wss://" + dsn + "/connection/websocket",
            {
                token: token,
                getToken: function(ctx)
                {
                    return new Promise((resolve, reject) =>
                    {
                        fetch('/centrifugo/credentials/user', {
                            method: 'POST',
                            headers: new Headers({'Content-Type': 'application/json'}),
                            body: JSON.stringify(ctx)
                        })

                            .then(res =>
                            {
                                if(!res.ok)
                                {
                                    throw new Error(`Unexpected status code ${res.status}`);
                                }

                                return res.json();

                            })

                            .then(data =>
                            {
                                resolve(data.token);
                            })

                            .catch(err =>
                            {
                                reject(err);
                            });
                    });
                },
                debug: typeof window.debug == 'undefined' ? false : window.debug,
            });


        centrifuge.connect();

        return true;
    }


    return false;

})