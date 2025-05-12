<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;
use Symfony\Config\WebProfilerConfig;

return static function(WebProfilerConfig $config, FrameworkConfig $frameworkConfig) {
    $config
        ->toolbar(false)
        ->interceptRedirects(false);

    $frameworkConfig->profiler([
        'collect' => false
    ]);

};