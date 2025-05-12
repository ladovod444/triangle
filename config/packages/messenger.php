<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework) {

    /** Транспорты по идентификаторам профилей */

    //    $messenger = $framework->messenger();

    //    $profile = '4ee06b1b-87a2-7490-91be-9abb3b71c0ea'; // Идентификатор профиля пользователя
    //
    //    $messenger
    //        ->transport($profile)
    //        ->dsn('redis://%env(REDIS_PASSWORD)%@%env(REDIS_HOST)%:%env(REDIS_PORT)%?auto_setup=true')
    //        ->options(['stream' => $profile])
    //        ->retryStrategy()
    //        ->maxRetries(5)
    //        ->delay(1000)
    //        ->maxDelay(0)
    //        ->multiplier(2)
    //        ->service(null);


};

