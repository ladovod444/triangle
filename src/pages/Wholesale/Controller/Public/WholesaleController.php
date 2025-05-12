<?php

declare(strict_types=1);

namespace Pages\Wholesale\Controller\Public;

use BaksDev\Core\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
final class WholesaleController extends AbstractController
{
    #[Route('/wholesale', name: 'public.index', priority: 99)]
    public function index(Request $request): Response
    {
        return $this->render();
    }
}
