<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *
 */

namespace Core\Controller\User;

use Core\Repository\LiderProduct\LiderProductInterface;
use Core\Repository\PageProduct\PageProductInterface;
use BaksDev\Core\Controller\AbstractController;
use BaksDev\Core\Form\Search\SearchDTO;
use BaksDev\Core\Form\Search\SearchForm;
use BaksDev\Orders\Order\UseCase\User\Basket\Add\OrderProductDTO;
use BaksDev\Orders\Order\UseCase\User\Basket\Add\OrderProductForm;
use BaksDev\Products\Category\Repository\AllCategoryByMenu\AllCategoryByMenuInterface;
use BaksDev\Products\Category\Type\Id\CategoryProductUid;
use BaksDev\Products\Product\Forms\ProductCategoryFilter\User\ProductCategoryFilterDTO;
use BaksDev\Products\Product\Forms\ProductCategoryFilter\User\ProductCategoryFilterForm;
use BaksDev\Reference\Cars\Forms\Filter\CarsFilterDTO;
use BaksDev\Reference\Cars\Forms\Filter\CarsFilterForm;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;


#[AsController]
class HomeController extends AbstractController
{
    #[Route('/', name: 'user.homepage')]
    public function index(
        Request $request,
        PageProductInterface $pageProduct,
        LiderProductInterface $leaderProduct,
        AllCategoryByMenuInterface $allCategory,
        #[Autowire(env: 'CDN_HOST')] string $CDN_HOST,
    ): Response
    {


        //dd($allCategory->fetchProductParentAllAssociative());

        $categorys = $allCategory->findAll(); //  fetchProductParentAllAssociative()->getData();


        $blockCategoryProducts = null;

        $basketForms = null;

        //foreach($categorys as $key => $category)
        //{
        $blockCategoryProducts = $pageProduct->fetchPageProductAssociative();
        $leaderCategoryProducts = $leaderProduct->fetchPageProductAssociative();


        $preload = [];

        foreach($blockCategoryProducts as $productCard)
        {

            $preload[] = ($productCard['product_image_cdn'] ? 'https://'.$CDN_HOST : '').
                $productCard['product_image'].'/'.
                ($productCard['product_image_cdn'] ? 'small' : 'image').'.'.$productCard['product_image_ext'];


            $AddProductBasketDTO = new OrderProductDTO();
            $form = $this->createForm(OrderProductForm::class, $AddProductBasketDTO, [
                'action' => $this->generateUrl('orders-order:user.add',
                    [
                        'product' => $productCard['event'],
                        'offer' => $productCard['product_offer_uid'],
                        'variation' => $productCard['product_variation_uid'],
                        'modification' => $productCard['product_modification_uid'],
                    ]
                ),
            ]);


            $basketForms[$productCard['event'].$productCard['product_offer_uid'].$productCard['product_variation_uid'].$productCard['product_modification_uid']] = $form->createView();

        }


        // Фильтр по авто
        $CarsFilterDTO = new CarsFilterDTO();
        $CarsFilterForm = $this->createForm(CarsFilterForm::class, $CarsFilterDTO,
            ['action' => $this->generateUrl('reference-cars:user.filter')]);
        //$CarsFilterForm->handleRequest($request);


        /** Идентификатор категории () */
        $CategoryUid = new CategoryProductUid('01876af0-ddfc-70c3-ab25-5f85f55a9907');
        $url = 'triangle';

        $ProductCategoryFilterDTO = new ProductCategoryFilterDTO($CategoryUid);
        $ProductFilterForm = $this->createForm(ProductCategoryFilterForm::class,
            $ProductCategoryFilterDTO,
            ['action' => $this->generateUrl('products-product:user.catalog.category', ['category' => $url])]
        );
        //$ProductFilterForm->handleRequest($request);


        // Поиск
        $search = new SearchDTO($request);
        $searchForm = $this->createForm(SearchForm::class, $search, [
            'action' => $this->generateUrl('core:search'),
        ]);
        $searchForm->handleRequest($request);

        // Exit
        return $this->render([
            'category' => $categorys,
            'products' => $blockCategoryProducts,
            'leader' => $leaderCategoryProducts,
            'basket' => $basketForms,

            'filter_cars' => $CarsFilterForm->createView(),
            'filter_tire' => $ProductFilterForm->createView(),

            'preloads' => $preload,

            'all_search' => $searchForm->createView(),
        ]);
    }


    #[Route('/manifest.json', name: 'manifest')]
    public function manifest(): Response
    {
        return new JsonResponse(
            [
                "manifest_version" => 3,
                "version" => "1.0.0",
                "icons" => [
                    "/favicon/android-icon-36x36.png",
                    "/favicon/android-icon-48x48.png",
                    "/favicon/android-icon-72x72.png"
                ]
            ]
        );
    }
}

