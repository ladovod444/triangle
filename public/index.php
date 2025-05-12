<?php

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function(array $context) {

    gc_disable();

//    if(
//        false === in_array($_SERVER['REMOTE_ADDR'], [
//            //            '188.134.84.129',
//            '77.239.239.67',
//            '93.84.158.19' // Михаил
//        ])
//    )
//    {
//        return new \Symfony\Component\HttpFoundation\Response(content: (string)$_SERVER['REMOTE_ADDR'], status: 404);
//    }

    if(
        true === in_array($_SERVER['REMOTE_ADDR'], [
            //            '188.134.84.129',
            '77.239.239.67',
            '93.84.158.19' // Михаил
        ])
    )
    {
        $context['APP_ENV'] = 'dev';
        $context['APP_DEBUG'] = true;
    }

    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
