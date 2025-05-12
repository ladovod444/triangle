<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\DoctrineMigrationsConfig;

return static function(DoctrineMigrationsConfig $config) {

    $config
        ->migrationsPath('DoctrineMigrations', '%kernel.project_dir%/migrations')
        ->enableProfiler('%kernel.debug%');
};