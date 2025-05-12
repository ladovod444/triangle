<?php

declare(strict_types=1);

namespace Pages\Calc\Controller\Public;

use BaksDev\Core\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
final class CalcController extends AbstractController
{
    #[Route('/calc', name: 'public.index', priority: 99)]
    public function index(Request $request): Response
    {
        return $this->render();
    }
}
