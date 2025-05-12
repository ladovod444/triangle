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

declare(strict_types=1);

namespace Core\Repository\Modification;

use BaksDev\Core\Doctrine\DBALQueryBuilder;
use BaksDev\Core\Form\Search\SearchDTO;
use BaksDev\Elastic\Api\Index\ElasticGetIndex;
use BaksDev\Elastic\Index\ElasticIndexInterface;
use BaksDev\Products\Category\Entity\CategoryProduct;
use BaksDev\Products\Category\Entity\Info\CategoryProductInfo;
use BaksDev\Products\Product\Entity\Category\ProductCategory;
use BaksDev\Products\Product\Entity\Event\ProductEvent;
use BaksDev\Products\Product\Entity\Offers\ProductOffer;
use BaksDev\Products\Product\Entity\Offers\Variation\Modification\ProductModification;
use BaksDev\Products\Product\Entity\Offers\Variation\ProductVariation;
use BaksDev\Products\Product\Entity\Product;
use BaksDev\Products\Product\Entity\Seo\ProductSeo;
use BaksDev\Products\Product\Entity\Trans\ProductTrans;

final class ElasticProductsModificationIndex implements ElasticIndexInterface
{
    private DBALQueryBuilder $DBALQueryBuilder;

    public function __construct(
        DBALQueryBuilder $DBALQueryBuilder
    )
    {
        $this->DBALQueryBuilder = $DBALQueryBuilder;
    }

    public function getIndex(): string
    {
        return ProductModification::class;
    }

    public function getData(): array
    {
        $dbal = $this->DBALQueryBuilder->createQueryBuilder(self::class);

        $dbal->select('product_modification.id');

        $dbal->from(Product::class, 'product');



        /* Категория */
        $dbal->leftJoin(
            'product',
            ProductCategory::class,
            'product_category',
            'product_category.event = product.event AND product_category.root = true'
        );


        $dbal->leftJoin(
            'product_category',
            CategoryProduct::class,
            'category',
            'category.id = product_category.category'
        );

        $dbal
            ->join(
                'category',
                CategoryProductInfo::class,
                'category_info',
                'category_info.event = category.event AND category_info.active = true'
            );

        $dbal
            ->addSelect('trans.name')
            ->leftJoin(
                'product',
                ProductTrans::class,
                'trans',
                'trans.event = product.event'
            );

        $dbal
            ->addSelect('product_offer.value as product_offer_value')
            ->addSelect('product_offer.postfix as product_offer_postfix')
            ->join(
                'product',
                ProductOffer::class,
                'product_offer',
                'product_offer.event = product.event'
            );

        $dbal
            ->addSelect('seo.title')
            ->leftJoin(
                'product',
                ProductSeo::class,
                'seo',
                'seo.event = product.event'
            );

        $dbal
            ->addSelect('product_variation.value as product_variation_value')
            ->addSelect('product_variation.postfix as product_variation_postfix')
            ->join(
                'product_offer',
                ProductVariation::TABLE,
                'product_variation',
                'product_variation.offer = product_offer.id'
            );

        $dbal
            ->addSelect('product_modification.value as product_modification_value')
            ->addSelect('product_modification.postfix as product_modification_postfix')
            ->join(
                'product_variation',
                ProductModification::TABLE,
                'product_modification',
                'product_modification.variation = product_variation.id '
            );



        return $dbal
            //->enableCache('products-product', 3600)
            ->fetchAllAssociativeIndexed();
    }


}