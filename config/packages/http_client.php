<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework): void {

    $framework
        ->httpClient()
        ->defaultOptions()
        ->retryFailed()
        ->maxRetries(3)
        ->delay(1000)
        ->multiplier(3)
        ->maxDelay(0)
        ->jitter(0.3);
};
