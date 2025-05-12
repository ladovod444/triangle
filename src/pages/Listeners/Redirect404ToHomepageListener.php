<?php

declare(strict_types=1);

namespace Pages\Listeners;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

#[AsEventListener(event: ExceptionEvent::class)]
final class Redirect404ToHomepageListener
{
    public function onKernelException(ExceptionEvent $event)
    {
        if (!$event) {
            return;
        }

        $response = new RedirectResponse('/');

        $event->setResponse($response);
    }
}