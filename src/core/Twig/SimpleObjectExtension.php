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

final class SimpleObjectExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('class_instance', [$this, 'call']),
        ];
    }

    /**
     * @param string $fqcn - название класса с его неймспейсом
     * @param array $args - ассоциативный массив с аргументами для конструктора
     */
    public function call(string $fqcn, array|null $args = null): object
    {
        if(is_null($args))
        {
            $instance = new $fqcn();
        }
        else
        {
            $instance = new $fqcn(...$args);
        }

        return $instance;
    }
}
