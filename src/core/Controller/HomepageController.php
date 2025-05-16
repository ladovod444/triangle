<?php

declare(strict_types=1);

namespace Core\Controller;

use BaksDev\Core\Controller\AbstractController;
use BaksDev\Products\Category\Repository\AllCategory\AllCategoryInterface;
use BaksDev\Products\Category\Type\Id\CategoryProductUid;
use BaksDev\Products\Product\Forms\ProductCategoryFilter\User\ProductCategoryFilterDTO;
use BaksDev\Products\Product\Forms\ProductCategoryFilter\User\ProductCategoryFilterForm;
use BaksDev\Products\Product\Repository\Cards\ModelOrProduct\ModelOrProductInterface;
use BaksDev\Products\Product\Repository\LiederCategory\ProductLiederInterface;
use BaksDev\Reference\Cars\Forms\Filter\CarsFilterDTO;
use BaksDev\Reference\Cars\Forms\Filter\CarsFilterForm;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
final class HomepageController extends AbstractController
{

    #[Route('/{page<\d+>}', name: 'public.homepage', priority: 99)]
    public function index(
        Request $request,
        AllCategoryInterface $allCategoryRec,
        ProductLiederInterface $productsLeader,
        ModelOrProductInterface $modelOrProduct,
        int $page = 0,
    ): Response
    {

        $categories = $allCategoryRec->getRecursive();

        $westlake = array_filter($categories, function(array $category) {
            return $category['category_url'] === 'westlake';
        });

        $categoryUid = new CategoryProductUid(current($westlake)['id']);

        /** Фильтр по параметрам */
        $productCategoryFilterDTO = new ProductCategoryFilterDTO($categoryUid);
        $productFilterForm = $this->createForm(ProductCategoryFilterForm::class,
            $productCategoryFilterDTO,
            ['action' => $this->generateUrl('products-product:public.catalog.index')]
        );

        /** Фильтр по авто */
        $carsFilterDTO = new CarsFilterDTO();
        $carsFilterForm = $this->createForm(CarsFilterForm::class, $carsFilterDTO,
            ['action' => $this->generateUrl('reference-cars:user.filter')]);

        /** Карточки продукции */
        $cards = $modelOrProduct
            ->maxResult(12)
            ->withProperties()
            ->toArray();

        /** Лучшие предложения */
        $bestOffers = $productsLeader
            ->maxResult(10)
            ->find();

        return $this->render(
            [
                'categories' => $categories,
                'cards' => $cards,
                'bestOffers' => $bestOffers,
//                'tire_select' => $productFilterForm->createView(),
                'filter_tire' => $productFilterForm->createView(),
//                'car_select' => $carsFilterForm->createView(),
                'filter_cars' => $carsFilterForm->createView(),
            ]);
    }
}