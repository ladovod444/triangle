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
use BaksDev\Products\Category\Entity\CategoryProduct;
use BaksDev\Products\Category\Entity\Info\CategoryProductInfo;
use BaksDev\Products\Category\Entity\Trans\CategoryProductTrans;

use BaksDev\Products\Product\Entity\Category\ProductCategory;
use BaksDev\Products\Product\Entity\Event\ProductEvent;
use BaksDev\Products\Product\Entity\Info\ProductInfo;
use BaksDev\Products\Product\Entity\Offers\ProductOffer;
use BaksDev\Products\Product\Entity\Offers\Variation\Modification\ProductModification;
use BaksDev\Products\Product\Entity\Offers\Variation\ProductVariation;
use BaksDev\Products\Product\Entity\Photo\ProductPhoto;
use BaksDev\Products\Product\Entity\Product;
use BaksDev\Products\Product\Entity\Seo\ProductSeo;
use BaksDev\Products\Product\Entity\Trans\ProductTrans;
use Doctrine\DBAL\ArrayParameterType;

final class ProductsModificationSearchRepository implements ProductsModificationSearchRepositoryInterface
{
    private DBALQueryBuilder $DBALQueryBuilder;

    private ElasticGetIndex $elasticGetIndex;

    public function __construct(
        DBALQueryBuilder $DBALQueryBuilder,
        ElasticGetIndex $elasticGetIndex
    )
    {
        $this->DBALQueryBuilder = $DBALQueryBuilder;
        $this->elasticGetIndex = $elasticGetIndex;
    }

    private int $counter = 0;
    private ?array $keys = null;


    public function search(SearchDTO $search): self
    {
        //$search->query = 'Triangle 301';

        if($search->getQuery())
        {

            $result = $this->elasticGetIndex->handle(ProductModification::class, $search->getQuery(), 0);
            /** Количество орезультатов */
            $this->counter = $result['hits']['total']['value'] ?? 0;

            if($this->counter)
            {
                /** Идентификаторы */
                $data = array_column($result['hits']['hits'], "_source");
                $this->keys = array_column($data, "id");
                return $this;
            }


            if(
                strpos($search->getQuery(), 'летни') === false &&
                strpos($search->getQuery(), 'зимни') === false &&
                strpos($search->getQuery(), 'шипованны') === false &&
                strpos($search->getQuery(), 'всесезонны') === false
            )
            {
                $currentTimestamp = time();
                $oneWeekAgo = strtotime("-1 week", $currentTimestamp);
                $currentMonth = date('n', $oneWeekAgo);

                if($currentMonth >= 3 && $currentMonth <= 8)
                {
                    $search->query .= ' летние';
                }
                else
                {
                    $search->query .= ' зимние';
                }
            }

            $result = $this->elasticGetIndex->handle(ProductModification::class, $search->getQuery(), 1);


            /** Количество орезультатов */
            $this->counter = $result['hits']['total']['value'] ?? 0;

            if($this->counter)
            {
                /** Идентификаторы */
                $data = array_column($result['hits']['hits'], "_source");
                $this->keys = array_column($data, "id");
            }
        }

        return $this;
    }


    /**
     * Метод осуществляет поиск по индексам Elastic
     */
    public function find(): array|bool
    {
        if(empty($this->keys))
        {
            return false;
        }

        $dbal = $this->DBALQueryBuilder
            ->createQueryBuilder(self::class)
            ->bindLocal();

        //$dbal->select('product.id');
        //$dbal->addSelect('product.event');

        $dbal
            ->addSelect('product_modification.value AS modification_value')
            ->addSelect('product_modification.postfix AS modification_postfix')
            ->from(ProductModification::class, 'product_modification')
            ->where('product_modification.id IN(:search)')
            ->setParameter('search', $this->keys, ArrayParameterType::STRING);

        /** Сортируем */
        $orderString = "CASE product_modification.id";
        foreach($this->keys as $key => $value)
        {
            $orderString .= " WHEN '$value' THEN $key ";
        }
        $orderString .= "END";
        $dbal->orderBy($orderString);


        $dbal
            ->addSelect('product_variation.value AS variation_value')
            ->addSelect('product_variation.postfix AS variation_postfix')
            ->leftJoin(
                'product_modification',
                ProductVariation::class,
                'product_variation',
                'product_variation.id = product_modification.variation'
            );


        $dbal
            ->addSelect('product_offer.value AS offer_value')
            ->addSelect('product_offer.postfix AS offer_postfix')
            ->leftJoin(
                'product_variation',
                ProductOffer::class,
                'product_offer',
                'product_offer.id = product_variation.offer'
            );


        //        $dbal
        //            ->from(Product::class, 'product')
        //            ->where('product.id IN(:products)')
        //            ->setParameter('products', $this->keys, ArrayParameterType::STRING);


        $dbal
            ->leftJoin(
                'product_offer',
                ProductEvent::class,
                'product_event',
                'product_event.id = product_offer.event'
            );


        $dbal
            ->leftJoin(
                'product_event',
                Product::class,
                'product',
                'product.id = product_event.main'
            );


        $dbal
            ->addSelect('trans.name AS search_name')
            ->leftJoin(
                'product',
                ProductTrans::class,
                'trans',
                'trans.event = product.event AND trans.local = :local'
            );

        $dbal
            ->addSelect('product_info.url AS search_url')
            ->leftJoin(
                'product',
                ProductInfo::class,
                'product_info',
                'product_info.product = product.id '
            );

        $dbal
            ->addSelect('seo.title AS search_desc')
            ->leftJoin(
                'product',
                ProductSeo::class,
                'seo',
                'seo.event = product.event'
            );


        /* Категория */
        $dbal->leftJoin(
            'product_event',
            ProductCategory::class,
            'product_category',
            'product_category.event = product_event.id AND product_category.root = true'
        );

        $dbal->join(
            'product_category',
            CategoryProduct::class,
            'category',
            'category.id = product_category.category'
        );

        $dbal
            ->addSelect('category_trans.name AS category_name')
            ->leftJoin(
                'category',
                CategoryProductTrans::class,
                'category_trans',
                'category_trans.event = category.event AND category_trans.local = :local'
            );

        $dbal
            ->addSelect('category_info.url AS category_url')
            ->leftJoin(
                'category',
                CategoryProductInfo::class,
                'category_info',
                'category_info.event = category.event'
            );


        /** Фото продукта */

        $dbal->leftJoin(
            'product_event',
            ProductPhoto::class,
            'product_photo',
            'product_photo.event = product_event.id AND product_photo.root = true'
        );


        $dbal->addSelect("
			CASE

			   WHEN product_photo.name IS NOT NULL THEN
					CONCAT ( '/upload/".$dbal->table(ProductPhoto::class)."' , '/', product_photo.name)
			   ELSE NULL
			END AS product_image
		"
        );

        /** Флаг загрузки файла CDN */
        $dbal->addSelect("
			CASE
			 
			   WHEN product_photo.name IS NOT NULL THEN
					product_photo.ext
			   ELSE NULL
			END AS product_image_ext
		");


        /** Флаг загрузки файла CDN */
        $dbal->addSelect("
			CASE
			  
			   WHEN product_photo.name IS NOT NULL THEN
					product_photo.cdn
			   ELSE NULL
			END AS product_image_cdn
		");


        //
        //        dd($dbal
        //            // ->enableCache('Namespace', 3600)
        //            ->fetchAllAssociative());

        $dbal->setMaxResults(5);

        return $dbal
            // ->enableCache('Namespace', 3600)
            ->fetchAllAssociative();
    }
}