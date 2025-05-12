<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;
use Symfony\Config\WebProfilerConfig;

return static function(WebProfilerConfig $config, FrameworkConfig $frameworkConfig) {

    $config
        ->toolbar(true)
        ->interceptRedirects(false)
        ->excludedAjaxPaths('^/((index|app(_[\w]+)?)\.php/)?_wdt')
        ->excludedAjaxPaths('^/((index|app(_[\w]+)?)\.php/)?_profiler');

    $frameworkConfig
        ->profiler()
        ->onlyExceptions(false)
        ->collectSerializerData(true);
};
