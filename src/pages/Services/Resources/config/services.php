<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

return static function(ContainerConfigurator $configurator): void {

    $services = $configurator
        ->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $NAMESPACE = 'Pages\\Services\\';

    $MODULE = substr(__DIR__, 0, strpos(__DIR__, "Resources"));

    $services
        ->load($NAMESPACE, $MODULE)
        ->exclude($MODULE.'{Entity,Resources,Type,*DTO.php,*Message.php}');
};
