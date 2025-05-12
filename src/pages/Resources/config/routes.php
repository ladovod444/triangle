<?php

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes)
{
    $routes->import('../../Controller', 'attribute')
      ->prefix(\BaksDev\Core\Type\Locale\Locale::routes())
      ->namePrefix('pages:');
    
};