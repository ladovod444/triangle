<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework) {

    $framework->secret('%env(APP_SECRET)%');

    $framework->httpMethodOverride(false);
    $framework->phpErrors(['log' => true]);
    $framework->cache()->pool('doctrine.result_cache_pool')->adapters(['cache.app']);
    $framework->session()->enabled(true);
    $framework->csrfProtection()->enabled(true);

};