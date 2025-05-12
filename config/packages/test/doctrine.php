<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\DoctrineConfig;

return static function(DoctrineConfig $config) {

    $config
        ->dbal()
        ->connection('default', ['url' => '%env(resolve:DATABASE_URL)%']);


};

