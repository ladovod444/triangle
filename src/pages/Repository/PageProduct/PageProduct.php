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
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

declare(strict_types=1);

namespace Pages\Repository\PageProduct;

use BaksDev\Core\Services\Paginator\PaginatorInterface;
use BaksDev\Core\Services\Switcher\Switcher;
use BaksDev\Core\Type\Locale\Locale;
use BaksDev\Products\Category\Type\Id\ProductCategoryUid;
use BaksDev\Users\Profile\UserProfile\Type\Id\UserProfileUid;
use Doctrine\DBAL\Cache\QueryCacheProfile;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Translation\TranslatorInterface;

use BaksDev\Products\Category\Entity as CategoryEntity;
use BaksDev\Products\Product\Entity as ProductEntity;

final class PageProduct implements PageProductInterface
{
	private Connection $connection;
	
	private Locale $locale;
	
	
	public function __construct(
		Connection $connection,
		TranslatorInterface $translator,
	)
	{
		$this->connection = $connection;
		$this->locale = new Locale($translator->getLocale());
	}
	
	
	public function fetchPageProductAssociative(ProductCategoryUid $category = null) : array
	{
		$qb = $this->connection->createQueryBuilder();
		
		$qb->setParameter('local', $this->locale, Locale::TYPE);
		
		$qb->select('product.id')->groupBy('product.id');
		$qb->addSelect('product.event')->addGroupBy('product.event');
		
		$qb->from(ProductEntity\Product::TABLE, 'product');
		
		$qb->join('product',
			ProductEntity\Event\ProductEvent::TABLE,
			'product_event',
			'product_event.id = product.event'
		);
		
		$qb->addSelect('product_trans.name AS product_name')->addGroupBy('product_trans.name');
		$qb->addSelect('product_trans.preview AS product_preview')->addGroupBy('product_trans.preview');
		$qb->leftJoin(
			'product_event',
			ProductEntity\Trans\ProductTrans::TABLE,
			'product_trans',
			'product_trans.event = product_event.id AND product_trans.local = :local'
		);
		
		/** Цена товара */
		$qb->leftJoin(
			'product_event',
			ProductEntity\Price\ProductPrice::TABLE,
			'product_price',
			'product_price.event = product_event.id'
		)
			->addGroupBy('product_price.price')
			->addGroupBy('product_price.currency')
			->addGroupBy('product_price.quantity')
			->addGroupBy('product_price.reserve')
		;
		
		/* ProductInfo */
		
		$qb->addSelect('product_info.url')->addGroupBy('product_info.url');
		
		$qb->leftJoin(
			'product_event',
			ProductEntity\Info\ProductInfo::TABLE,
			'product_info',
			'product_info.product = product.id'
		)->addGroupBy('product_info.article');
		
		/** Торговое предложение */
		
		$qb->addSelect('product_offer.id as product_offer_uid')->addGroupBy('product_offer.id');
		$qb->addSelect('product_offer.value as product_offer_value')->addGroupBy('product_offer.value');

        $qb->addSelect('product_offer.postfix as product_offer_postfix')
            ->addGroupBy('product_offer.postfix')
        ;
		
		$qb->leftJoin(
			'product_event',
			ProductEntity\Offers\ProductOffer::TABLE,
			'product_offer',
			'product_offer.event = product_event.id'
		)
			->addGroupBy('product_offer.article')
		;
		
		/** Цена торгового предожения */
		$qb->leftJoin(
			'product_offer',
			ProductEntity\Offers\Price\ProductOfferPrice::TABLE,
			'product_offer_price',
			'product_offer_price.offer = product_offer.id'
		)
			->addGroupBy('product_offer_price.price')
			->addGroupBy('product_offer_price.currency')
		;
		
		/** Наличие торгового предожения */
		$qb->leftJoin(
			'product_offer',
			ProductEntity\Offers\Quantity\ProductOfferQuantity::TABLE,
			'product_offer_quantity',
			'product_offer_quantity.offer = product_offer.id'
		)
			->addGroupBy('product_offer_quantity.quantity')
			->addGroupBy('product_offer_quantity.reserve')
		;
		
		/** Получаем тип торгового предложения */
		$qb->addSelect('category_offer.reference as product_offer_reference')->addGroupBy('category_offer.reference');
		$qb->leftJoin(
			'product_offer',
			CategoryEntity\Offers\ProductCategoryOffers::TABLE,
			'category_offer',
			'category_offer.id = product_offer.category_offer'
		);
		
		//ProductCategoryOffers
		
		/** Множественные варианты торгового предложения */
		$qb->addSelect('product_offer_variation.id as product_variation_uid')
			->addGroupBy('product_offer_variation.id')
		;
		$qb->addSelect('product_offer_variation.value as product_variation_value')
			->addGroupBy('product_offer_variation.value')
		;

        $qb->addSelect('product_offer_variation.postfix as product_variation_postfix')
            ->addGroupBy('product_offer_variation.postfix')
        ;

		$qb->leftJoin(
			'product_offer',
			ProductEntity\Offers\Variation\ProductOfferVariation::TABLE,
			'product_offer_variation',
			'product_offer_variation.offer = product_offer.id'
		)
			->addGroupBy('product_offer_variation.article')
		;
		
		/** Цена множественного варианта */
		
		$qb->leftJoin(
			'category_offer_variation',
			ProductEntity\Offers\Variation\Price\ProductOfferVariationPrice::TABLE,
			'product_variation_price',
			'product_variation_price.variation = product_offer_variation.id'
		)
			->addGroupBy('product_variation_price.price')
			->addGroupBy('product_variation_price.currency')
		;
		
		/** Наличие множественного варианта */
		
		$qb->leftJoin(
			'category_offer_variation',
			ProductEntity\Offers\Variation\Quantity\ProductOfferVariationQuantity::TABLE,
			'product_variation_quantity',
			'product_variation_quantity.variation = product_offer_variation.id'
		)
			->addGroupBy('product_variation_quantity.quantity')
			->addGroupBy('product_variation_quantity.reserve')
		;
		
		/** Получаем тип множественного варианта */
		$qb->addSelect('category_offer_variation.reference as product_variation_reference')
			->addGroupBy('category_offer_variation.reference')
		;
		$qb->leftJoin(
			'product_offer_variation',
			CategoryEntity\Offers\Variation\ProductCategoryOffersVariation::TABLE,
			'category_offer_variation',
			'category_offer_variation.id = product_offer_variation.category_variation'
		);



		/** Модификация множественного варианта торгового предложения */
		
		$qb->addSelect('product_offer_modification.id as product_modification_uid')
			->addGroupBy('product_offer_modification.id')
		;

		$qb->addSelect('product_offer_modification.value as product_modification_value')
			->addGroupBy('product_offer_modification.value')
		;

        $qb->addSelect('product_offer_modification.postfix as product_modification_postfix')
            ->addGroupBy('product_offer_modification.postfix')
        ;
		
		$qb->leftJoin(
			'product_offer_variation',
			ProductEntity\Offers\Variation\Modification\ProductOfferVariationModification::TABLE,
			'product_offer_modification',
			'product_offer_modification.variation = product_offer_variation.id'
		)
			->addGroupBy('product_offer_modification.article')
		;
		
		/** Цена множественного варианта */
		$qb->leftJoin(
			'product_offer_modification',
			ProductEntity\Offers\Variation\Modification\Price\ProductOfferVariationModificationPrice::TABLE,
			'product_modification_price',
			'product_modification_price.modification = product_offer_modification.id'
		)
			->addGroupBy('product_modification_price.price')
			->addGroupBy('product_modification_price.currency')
		;
		
		/** Наличие множественного варианта */
		$qb->leftJoin(
			'product_offer_modification',
			ProductEntity\Offers\Variation\Modification\Quantity\ProductOfferVariationModificationQuantity::TABLE,
			'product_modification_quantity',
			'product_modification_quantity.modification = product_offer_modification.id'
		)
			->addGroupBy('product_modification_quantity.quantity')
			->addGroupBy('product_modification_quantity.reserve')
		;
		
		/** Получаем тип множественного варианта */
		$qb->addSelect('category_offer_modification.reference as product_modification_reference')
			->addGroupBy('category_offer_modification.reference')
		;
		$qb->leftJoin(
			'product_offer_modification',
			CategoryEntity\Offers\Variation\Modification\ProductCategoryOffersVariationModification::TABLE,
			'category_offer_modification',
			'category_offer_modification.id = product_offer_modification.category_modification'
		);
		
		//$qb->addSelect("'".Entity\Offers\Variation\Image\ProductOfferVariationImage::TABLE."' AS upload_image_dir ");
		
		/** Артикул продукта */
		
		$qb->addSelect("
			CASE
			   WHEN product_offer_modification.article IS NOT NULL THEN product_offer_modification.article
			   WHEN product_offer_variation.article IS NOT NULL THEN product_offer_variation.article
			   WHEN product_offer.article IS NOT NULL THEN product_offer.article
			   WHEN product_info.article IS NOT NULL THEN product_info.article
			   ELSE NULL
			END AS product_article
		"
		);
		
		/** Фото продукта */
		
		$qb->leftJoin(
			'product_offer_modification',
			ProductEntity\Offers\Variation\Modification\Image\ProductOfferVariationModificationImage::TABLE,
			'product_offer_modification_image',
			'
			product_offer_modification_image.modification = product_offer_modification.id AND
			product_offer_modification_image.root = true
			'
		)
			->addGroupBy('product_offer_modification_image.name')
			->addGroupBy('product_offer_modification_image.dir')
			->addGroupBy('product_offer_modification_image.ext')
			->addGroupBy('product_offer_modification_image.cdn')
		;
		
		$qb->leftJoin(
			'product_offer',
			ProductEntity\Offers\Variation\Image\ProductOfferVariationImage::TABLE,
			'product_offer_variation_image',
			'
			product_offer_variation_image.variation = product_offer_variation.id AND
			product_offer_variation_image.root = true
			'
		)
			->addGroupBy('product_offer_variation_image.name')
			->addGroupBy('product_offer_variation_image.dir')
			->addGroupBy('product_offer_variation_image.ext')
			->addGroupBy('product_offer_variation_image.cdn')
		;
		
		$qb->leftJoin(
			'product_offer',
			ProductEntity\Offers\Image\ProductOfferImage::TABLE,
			'product_offer_images',
			'
			product_offer_variation_image.name IS NULL AND
			product_offer_images.offer = product_offer.id AND
			product_offer_images.root = true
			'
		)
			->addGroupBy('product_offer_images.name')
			->addGroupBy('product_offer_images.dir')
			->addGroupBy('product_offer_images.ext')
			->addGroupBy('product_offer_images.cdn')
		;
		
		$qb->leftJoin(
			'product_offer',
			ProductEntity\Photo\ProductPhoto::TABLE,
			'product_photo',
			'
			product_offer_images.name IS NULL AND
			product_photo.event = product_event.id AND
			product_photo.root = true
			'
		)->addGroupBy('product_photo.name')
			->addGroupBy('product_photo.dir')
			->addGroupBy('product_photo.ext')
			->addGroupBy('product_photo.cdn')
		;
		
		$qb->addSelect("
			CASE
			 WHEN product_offer_modification_image.name IS NOT NULL THEN
					CONCAT ( '/upload/".ProductEntity\Offers\Variation\Modification\Image\ProductOfferVariationModificationImage::TABLE."' , '/', product_offer_modification_image.dir, '/', product_offer_modification_image.name, '.')
			   WHEN product_offer_variation_image.name IS NOT NULL THEN
					CONCAT ( '/upload/".ProductEntity\Offers\Variation\Image\ProductOfferVariationImage::TABLE."' , '/', product_offer_variation_image.dir, '/', product_offer_variation_image.name, '.')
			   WHEN product_offer_images.name IS NOT NULL THEN
					CONCAT ( '/upload/".ProductEntity\Offers\Image\ProductOfferImage::TABLE."' , '/', product_offer_images.dir, '/', product_offer_images.name, '.')
			   WHEN product_photo.name IS NOT NULL THEN
					CONCAT ( '/upload/".ProductEntity\Photo\ProductPhoto::TABLE."' , '/', product_photo.dir, '/', product_photo.name, '.')
			   ELSE NULL
			END AS product_image
		"
		);
		
		/** Флаг загрузки файла CDN */
		$qb->addSelect("
			CASE
			WHEN product_offer_modification_image.name IS NOT NULL THEN
					product_offer_modification_image.ext
			   WHEN product_offer_variation_image.name IS NOT NULL THEN
					product_offer_variation_image.ext
			   WHEN product_offer_images.name IS NOT NULL THEN
					product_offer_images.ext
			   WHEN product_photo.name IS NOT NULL THEN
					product_photo.ext
			   ELSE NULL
			END AS product_image_ext
		"
		);
		
		/** Флаг загрузки файла CDN */
		$qb->addSelect("
			CASE
			   WHEN product_offer_variation_image.name IS NOT NULL THEN
					product_offer_variation_image.cdn
			   WHEN product_offer_images.name IS NOT NULL THEN
					product_offer_images.cdn
			   WHEN product_photo.name IS NOT NULL THEN
					product_photo.cdn
			   ELSE NULL
			END AS product_image_cdn
		"
		);
		
		/** Стоимость продукта */
		$qb->addSelect("
			CASE
			   WHEN COALESCE(product_modification_price.price, 0) != 0 THEN product_modification_price.price
			   WHEN COALESCE(product_variation_price.price, 0) != 0 THEN product_variation_price.price
			   WHEN COALESCE(product_offer_price.price, 0) != 0 THEN product_offer_price.price
			   WHEN COALESCE(product_price.price, 0) != 0 THEN product_price.price
			   ELSE NULL
			END AS product_price
		"
		);
		
		/** Стоимость продукта */
		$qb->addSelect("
			CASE
			   WHEN COALESCE(product_modification_price.price, 0) != 0 THEN product_modification_price.currency
			   WHEN COALESCE(product_variation_price.price, 0) != 0 THEN product_variation_price.currency
			   WHEN COALESCE(product_offer_price.price, 0) != 0 THEN product_offer_price.currency
			   WHEN COALESCE(product_price.price, 0) != 0 THEN product_price.currency
			   ELSE NULL
			END AS product_currency
		"
		);
		
		/* Категория */
		$qb->join(
			'product_event',
			ProductEntity\Category\ProductCategory::TABLE,
			'product_event_category',
			'product_event_category.event = product_event.id AND product_event_category.root = true'
		);
		
		$qb->andWhere('product_event_category.category = :category');
		$qb->setParameter('category', $category, ProductCategoryUid::TYPE);
		
		$qb->join(
			'product_event_category',
			CategoryEntity\ProductCategory::TABLE,
			'category',
			'category.id = product_event_category.category'
		);
		
		$qb->addSelect('category_trans.name AS category_name')->addGroupBy('category_trans.name');
		
		$qb->leftJoin(
			'category',
			CategoryEntity\Trans\ProductCategoryTrans::TABLE,
			'category_trans',
			'category_trans.event = category.event AND category_trans.local = :local'
		);
		
		$qb->leftJoin(
			'category',
			CategoryEntity\Section\ProductCategorySection::TABLE,
			'category_section',
			'category_section.event = category.event'
		);
		
		/** Свойства, учавствующие в карточке */
		
		$qb->leftJoin(
			'category_section',
			CategoryEntity\Section\Field\ProductCategorySectionField::TABLE,
			'category_section_field',
			'category_section_field.section = category_section.id AND (category_section_field.card = TRUE OR category_section_field.photo = TRUE OR category_section_field.name = TRUE )'
		);
		
		$qb->leftJoin(
			'category_section_field',
			CategoryEntity\Section\Field\Trans\ProductCategorySectionFieldTrans::TABLE,
			'category_section_field_trans',
			'category_section_field_trans.field = category_section_field.id AND category_section_field_trans.local = :local'
		);
		
		$qb->leftJoin(
			'category_section_field',
			ProductEntity\Property\ProductProperty::TABLE,
			'product_property',
			'product_property.event = product.event AND product_property.field = category_section_field.id'
		);
		
		
		
		$qb->addSelect("JSON_AGG
		( DISTINCT
			
				JSONB_BUILD_OBJECT
				(
					'field_sort', category_section_field.sort,
					'field_name', category_section_field.name,
					'field_card', category_section_field.card,
					'field_photo', category_section_field.photo,
					'field_type', category_section_field.type,
					'field_trans', category_section_field_trans.name,
					'field_value', product_property.value
				
				)
			
		)
			AS category_section_field"
		);
		
		//$qb->addGroupBy('product_event, product_offer.id, product_offer_variation.id');
		
		$qb->orderBy('product.event', 'DESC');
		
		$qb->setMaxResults(8);
		
		//dd($qb->fetchAllAssociative());
		
		/** Только с ценой */
		
		$qb->andWhere("

 			CASE
			   WHEN product_modification_price.price  IS NOT NULL THEN product_modification_price.price
			   WHEN product_variation_price.price  IS NOT NULL THEN product_variation_price.price
			   WHEN product_offer_price.price IS NOT NULL THEN product_offer_price.price
			   WHEN product_price.price IS NOT NULL THEN product_price.price
			   ELSE 0
			END > 0

 		"
		);
		
		/** Только при наличии */
		
		$qb->andWhere("
 		
 			CASE
			   WHEN product_modification_quantity.quantity IS NOT NULL THEN (product_modification_quantity.quantity - product_modification_quantity.reserve)
			   WHEN product_variation_quantity.quantity IS NOT NULL THEN (product_variation_quantity.quantity - product_variation_quantity.reserve)
			   WHEN product_offer_quantity.quantity IS NOT NULL THEN (product_offer_quantity.quantity - product_offer_quantity.reserve)
			   WHEN product_price.quantity  IS NOT NULL THEN (product_price.quantity - product_price.reserve)
			   ELSE 0
			END > 0
 		
 		"
		);


        $qb->orderBy('RANDOM()');

		//dump($qb->fetchAllAssociative());
		
		/* Кешируем результат запроса */
		$cacheFilesystem = new FilesystemAdapter('CacheProduct');
		
		$config = $this->connection->getConfiguration();
		$config?->setResultCache($cacheFilesystem);
		
		return $this->connection->executeCacheQuery(
			$qb->getSQL(),
			$qb->getParameters(),
			$qb->getParameterTypes(),
			new QueryCacheProfile((60 * 60 * 30))
		)->fetchAllAssociative();
		
		//return $qb->fetchAllAssociative();
	}
	
}