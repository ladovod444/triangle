<?php
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

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Services\BaksSessionTtl;
use Redis;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler;
use Symfony\Config\FrameworkConfig;


return static function(ContainerConfigurator $container, FrameworkConfig $framework) {

    $services = $container->services();

    $services->set('Redis')
        ->class(Redis::class)
        ->call('connect', ['%env(REDIS_HOST)%', '%env(int:REDIS_PORT)%'])
        ->call('auth', ['%env(REDIS_PASSWORD)%'])
    ;

    $services
        ->set('baks.session.ttl', BaksSessionTtl::class)
        ->args([service('security.authorization_checker')])
    ;

    $services
        ->set(RedisSessionHandler::class)
        ->args([
            service('Redis'),
            ['ttl' => closure(service('baks.session.ttl'))],
        ])
    ;

    $framework->session()
        ->enabled(true)
        ->handlerId(RedisSessionHandler::class)
        ->cookieSecure(true)
        ->cookieSamesite(Cookie::SAMESITE_STRICT)
    ;
};