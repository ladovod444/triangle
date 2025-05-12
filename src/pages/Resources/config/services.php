<?php

// config/packages/doctrine.php
namespace Symfony\Component\DependencyInjection\Loader\Configurator;

return static function (ContainerConfigurator $configurator)
{
    $services = $configurator->services()
      ->defaults()
      ->autowire()      // Automatically injects dependencies in your services.
      ->autoconfigure() // Automatically registers your services as commands, event subscribers, etc.
    ;
    
	$Module = 'Pages';
	
    $services->load($Module.'\Controller\\', __DIR__.'/../../Controller')
      ->tag('controller.service_arguments');
	
        //$services->load($Module.'\Repository\\', __DIR__.'/../../Repository');
		

    
    //$services->load($Module.'\Repository\\', __DIR__.'/../../Repository');
    
};

