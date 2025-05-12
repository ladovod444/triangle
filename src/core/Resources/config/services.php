<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Cache\AppCacheInterface;
use Core\Cache\RedisCache;

return static function(ContainerConfigurator $configurator): void {

    $services = $configurator
        ->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $NAMESPACE = 'Core\\';

    $MODULE = substr(__DIR__, 0, strpos(__DIR__, "Resources"));

    $services
        ->load($NAMESPACE, $MODULE)
        ->exclude($MODULE.'{Entity,Resources,Type,*DTO.php,*Message.php}');

    /** Используем Redis для кеширования */
    $services->set(RedisCache::class);
    $services->alias(AppCacheInterface::class, RedisCache::class);
};
