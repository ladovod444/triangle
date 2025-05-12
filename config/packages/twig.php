<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\TwigConfig;

return static function(TwigConfig $config) {

    $config->formThemes(['@core/form/bootstrap_5_layout.html.twig']);
    $config->path('%kernel.project_dir%/templates', 'Template');

    //$config->global('MAPS_YANDEX_API')->value('%env(MAPS_YANDEX_API)%');

    $config->global('version')->value('DTzH2ZC6');

};