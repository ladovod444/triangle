<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use DirectoryIterator;
use Monolog\Formatter\LineFormatter;
use Monolog\Processor\WebProcessor;
use Symfony\Config\MonologConfig;

return static function(MonologConfig $config, ContainerConfigurator $configurator): void {

    $services = $configurator->services();

    $services->set(WebProcessor::class)->tag('monolog.processor');

    $services->set('monolog.formatter.standard')->class(LineFormatter::class)
        ->arg('$format', "%%extra.ip%% [%%datetime%%] [%%extra.token%%] | %%channel%%.%%level_name%%: --- %%extra%% --- %%context%% \n");

    $config->handler('console')
        ->type('console')
        ->level('debug');

    $config->handler('request')
        ->formatter('monolog.formatter.standard')
        ->type('rotating_file')
        ->maxFiles(10)
        ->path('%kernel.logs_dir%/%kernel.environment%_request.log')
        ->level('notice')
        ->channels()->elements(['request']);

    /* Критические ошибки приложения */
    $config->handler('critical')
        ->type('rotating_file')
        ->maxFiles(10)
        ->path('%kernel.logs_dir%/critical.log')
        ->level('critical')
        ->channels();


    /**
     * Модульные каналы
     */

    $channels['message-dispatch'] = 'messageDispatch';
    $channels['validator'] = 'validator';

    $project_dir = substr(__DIR__, 0, strpos(__DIR__, "config"));

    /** @var DirectoryIterator $module */
    foreach(new DirectoryIterator($project_dir.'vendor/baks-dev') as $module)
    {
        if($module->isDot() || !$module->isDir())
        {
            continue;
        }

        $words = explode('-', strtolower($module->getBasename()));
        $words = array_map("ucfirst", $words);

        $channels[$module->getBasename()] = lcfirst(implode('', $words));
    }


    $config->channels($channels);

    foreach($channels as $module => $chanel)
    {
        /* MESSAGE DISPATCH LOGER */
        $services->defaults()->bind('$'.$chanel.'Logger', '@monolog.logger.'.$chanel);

        $config->handler('handler_'.$chanel)
            ->type('rotating_file')
            ->maxFiles(10)
            ->path('%kernel.logs_dir%/'.$module.'.log')
            ->level('debug')
            ->channels($chanel);
    }
};