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

namespace Core\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class GroupByExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('mapping', [$this, 'arrayMapping']),
            new TwigFunction('groupBy', [$this, 'groupBy']),
        ];
    }

    /**
     * Группирует данные.
     * @param array $values - массив объектов
     * @param string $method - метод, значение которого используется для группировки данных
     * @param bool $unique - оставляет в группе только одно уникальное значение
     */
    public function groupBy(array $values, string $method, bool $unique = false): array|false
    {
        $result = null;
        $uniqueKey = null;

        foreach($values as $value)
        {

            if($uniqueKey !== $value->$method())
            {
                $key = $value->$method();

                $newArray = array_filter($values, function($element) use ($method, $key) {

                    return $element->$method() === $key;
                });

                $uniqueArray = null;

                if(true === $unique and count($newArray) > 1)
                {
                    $prev = null;

                    foreach($newArray as $array)
                    {
                        if($prev !== null)
                        {
                            if($array->$method() !== $prev)
                            {
                                $uniqueArray[] = $array;
                            }

                            $prev = $array->$method();
                        }
                        else
                        {
                            $uniqueArray[] = $array;
                            $prev = $array->$method();
                        }
                    }

                    /** Если хотим получать уникальное значение - возвращается текущий массив */
                    if(count($uniqueArray) === 1)
                    {
                        $uniqueArray = current($uniqueArray);
                    }
                }

                /** Если хотим получать уникальное значение - возвращается текущий массив */
                if(true === $unique)
                {
                    $newArray = current($newArray);
                }

                $result[$key] = $uniqueArray ?? $newArray;
            }

            $uniqueKey = $value->$method();
        }

        return $result ?? false;
    }

    /**
     * Группирует данные.
     * @param array|string $values - массив или json с данными для группировки
     * @param string $index - ключ, значение которого будет использовано для группировки данных
     * @param bool $unique - оставляет в группе только одно уникальное значение
     */
    public function arrayMapping(array|string $values, string $index, bool $unique = false): array|false
    {

        if(is_string($values))
        {
            $values = json_decode($values, true, 512, JSON_THROW_ON_ERROR);
        }

        $map = null;
        $uniqueKey = null;

        /**
         * @var array $value - ассоциативный массив, по одному из индексов которого будет происходить объединение данных
         */
        foreach($values as $value)
        {

            /** @var $value [$index] - объединяющий ключ */
            if($uniqueKey !== $value[$index])
            {
                $key = $value[$index];

                $newArray = array_filter($values, function($element) use ($index, $key) {

                    return $element[$index] === $key;
                });

                $uniqueArray = null;

                /**  */
                if(true === $unique and count($newArray) > 1)
                {
                    $prev = null;

                    foreach($newArray as $array)
                    {
                        if($prev !== null)
                        {
                            if($array[$index] !== $prev)
                            {
                                $uniqueArray[] = $array;
                            }

                            $prev = $array[$index];
                        }
                        else
                        {
                            $uniqueArray[] = $array;
                            $prev = $array[$index];
                        }
                    }

                    /** Если хотим получать уникальное значение - возвращается текущий массив */
                    if(count($uniqueArray) === 1)
                    {
                        $uniqueArray = current($uniqueArray);
                    }
                }

                /** Если хотим получать уникальное значение - возвращается текущий массив */
                if(true === $unique)
                {
                    $newArray = current($newArray);
                }

                $map[$key] = $uniqueArray ?? $newArray;
            }

            $uniqueKey = $value[$index];
        }

        return $map ?? false;
    }
}
