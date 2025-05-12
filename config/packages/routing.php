<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $config) {

    $config
        ->router()
        ->utf8(true)
        ->strictRequirements(false);

};
