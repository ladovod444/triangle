<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework) {

    $framework->lock('%env(LOCK_DSN)%');
};
