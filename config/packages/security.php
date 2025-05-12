<?php
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

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Auth\Email\Security\UserEmailAuthenticator;
use BaksDev\Auth\Telegram\Security\TelegramBotAuthenticator;
use BaksDev\Auth\Telegram\Security\TelegramFormAuthenticator;
use BaksDev\Users\Profile\Group\Security\Switcher\SwitchUserProvider;
use BaksDev\Users\User\Entity\User;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Config\SecurityConfig;

return static function(SecurityConfig $config) {

    /** FIREWALL DEV */

    $config->firewall('dev')
        ->pattern('^/(_(profiler|wdt)|css|images|js)/')
        ->security(false);

    /** PASSWORD ALGORITHM */
    $config
        ->passwordHasher(PasswordAuthenticatedUserInterface::class)
        ->algorithm('bcrypt');


    /** PROVIDER CDN
     * для генерирования дайджеста пароля воспользуйтесь коммандой
     * php bin/console security:hash-password
     */

    $config->provider('in_memory_users')
        ->memory()
        ->user('admin')
        ->password('$2y$13$mlMF9.25ivZInO5G3biESexozDAWIAxXSBhyRH6uc5xETx7svZsYW')
        ->roles(['ROLE_CDN']);

    $config->firewall('main')
        ->pattern('^/cdn/upload')
        ->provider('in_memory_users')
        ->httpBasic();

    $config
        ->provider('app_user_provider')
        ->entity()
        ->class(User::class)
        ->property('id');


    /**
     * TELEGRAM
     */

    //    if(class_exists(TelegramBotAuthenticator::class))
    //    {
    ////        $config
    ////            ->provider('app_telegram_bot_provider')
    ////            ->entity()
    ////            ->class(User::class)
    ////            ->property('id');
    //
    //
    //    }


    /**
     * PROVIDER USER
     */

    $Authenticator = [];

    if(class_exists(UserEmailAuthenticator::class))
    {
        $Authenticator[] = UserEmailAuthenticator::class;
    }

    if(class_exists(TelegramFormAuthenticator::class))
    {
        $config->firewall('telegram')
            ->pattern('^/telegram/endpoint')
            ->lazy(true)
            ->security(true)
            ->stateless(false)
            ->provider('app_user_provider')
            ->customAuthenticators([TelegramBotAuthenticator::class]);

        $Authenticator[] = TelegramFormAuthenticator::class;
    }


    if(!empty($Authenticator))
    {
        $config->firewall('user')
            ->lazy(true)
            ->security(true)
            ->provider('app_user_provider')
            ->customAuthenticators($Authenticator)
            ->logout()
            ->path('auth-email:logout');

        $config->firewall('user')
            //->pattern('^/')
            ->rememberMe()
            ->signatureProperties(['id', 'credentials'])
            ->secret('%kernel.secret%') // required
            ->lifetime(60 * 60 * 24)
            ->samesite('strict')
            ->secure(true);


        /* по умолчанию разрешаем 5 попыток входа в минуту */
        $config->firewall('user')->loginThrottling();


        /**
         * PROVIDER SWITCH USER
         */

        if(class_exists(SwitchUserProvider::class))
        {
            $config->provider('switch_user_provider')
                ->id(SwitchUserProvider::class);

            $config->firewall('user')
                ->switchUser()
                ->provider('switch_user_provider')
                ->role('ROLE_USER')
                ->parameter('authority');
        }
    }
};
