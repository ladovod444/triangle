<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

namespace Core\Controller\User;

use Core\Repository\Modification\ProductsModificationSearchRepositoryInterface;
use Core\Repository\Products\ProductsSearchRepositoryInterface;
use BaksDev\Core\Controller\AbstractController;
use BaksDev\Core\Form\Search\SearchDTO;
use BaksDev\Core\Form\Search\SearchForm;
use BaksDev\Core\Listeners\Event\Security\RoleSecurity;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\RouterInterface;


#[AsController]
final class SearchController extends AbstractController
{
    /* Обновление страницы и сброс кеша */
    #[Route('/search', name: 'search', methods: ['POST', 'GET'])]
    public function search(
        Request $request,
        ProductsSearchRepositoryInterface $productsSearch,
        ProductsModificationSearchRepositoryInterface $modificationSearch
    ): Response
    {
        // Поиск
        $search = new SearchDTO($request);
        $searchForm = $this->createForm(SearchForm::class, $search, [
            'action' => $this->generateUrl('core:search'),
        ]);

        $searchForm->handleRequest($request);

        $modification = null;
        $products = null;

        /** Поиск по модификации */
        $modification = $modificationSearch
            ->search($search)
            ->find();

        if($modification && $request->headers->get('X-Requested-With') === 'XMLHttpRequest')
        {
            return $this->render(['result' => $modification], file: 'modification.html.twig');
        }

        /** Поиск по множественному варианту */

        /** Поиск по торговому предложению */

        if(!$modification)
        {
            /** Поиск по продукции */
            $products = $productsSearch
                ->search($search)
                ->find();
        }

        if($products && $request->headers->get('X-Requested-With') === 'XMLHttpRequest')
        {
            return $this->render(['result' => $products], file: 'products.html.twig');
        }

        return $this->render([
            'search' => $searchForm->createView(),
            'products' => $products,
            'modification' => $modification
        ]);
    }

}
