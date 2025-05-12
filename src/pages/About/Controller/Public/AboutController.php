<?php

declare(strict_types=1);

namespace Pages\About\Controller\Public;

use BaksDev\Core\Controller\AbstractController;
use BaksDev\Support\UseCase\Public\Feedback\SupportFeedbackDTO;
use BaksDev\Support\UseCase\Public\Feedback\SupportFeedbackForm;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
final class AboutController extends AbstractController
{
    /** О компании */
    #[Route('/about', name: 'public.index')]
    public function index(
        Request $request,
    ): Response
    {

        /** Форма обратной связи */
        $feedback = new SupportFeedbackDTO();
        $feedbackForm = $this
            ->createForm(
                SupportFeedbackForm::class, $feedback,
                ['action' => $this->generateUrl('support:public.feedback')]
            )
            ->handleRequest($request);

        return $this->render([
            'form' => $feedbackForm->createView()
        ]);
    }
}
