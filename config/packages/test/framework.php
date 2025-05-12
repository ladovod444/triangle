<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;

return static function (FrameworkConfig $framework) {
    $framework
        ->test(true)
        ->session()
        ->storageFactoryId('session.storage.factory.mock_file');
};
