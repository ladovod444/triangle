<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;


use BaksDev\Core\Type\Locale\Locale;
use Symfony\Config\Framework\TranslatorConfig;
use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework) {
    $framework
        ->translator()
        ->defaultPath('%kernel.project_dir%/translations');
};

