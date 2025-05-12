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

namespace Core\Cache;

use BaksDev\Core\Cache\AppCacheInterface;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Cache\Adapter\RedisAdapter;
use Symfony\Component\Cache\Marshaller\MarshallerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\CacheInterface;

final class RedisCache implements AppCacheInterface
{
    private string $type = RedisAdapter::class;

    private bool $restricted = true;

    public function __construct(
        #[Autowire(env: 'HOST')] private readonly string $HOST,
        #[Autowire(env: 'REDIS_HOST')] private readonly string $REDIS_HOST,
        #[Autowire(env: 'REDIS_PORT')] private readonly string $REDIS_PORT,
        #[Autowire(env: 'REDIS_PASSWORD')] private readonly string $REDIS_PASSWORD,
        #[Autowire(env: 'REDIS_TABLE')] private readonly string $REDIS_TABLE,
        #[Autowire(env: 'APP_ENV')] private readonly string $environment,
    ) {}

    public function init(
        string|null $namespace = null,
        int $defaultLifetime = 86400,
        MarshallerInterface|null $marshaller = null
    ): CacheInterface
    {

        if(empty($this->REDIS_TABLE))
        {
            throw new \InvalidArgumentException('Вы должны определить «REDIS_TABLE» в .env больше 0');
        }


        // Определяем индекс таблицы

        $table = 3;

        if(!empty($namespace))
        {
            $table = str_replace('deduplicator-', '', $namespace);
            $table = strlen($table);

            while(true)
            {
                if($table < 15)
                {
                    break;
                }

                $table /= 2;
            }
        }

        if($this->restricted)
        {
            $namespace = $namespace ? $this->HOST.'.'.$namespace : $this->HOST;
        }
        else
        {
            $namespace = $namespace ?: $this->HOST;
        }


        if($this->restricted)
        {
            $namespace = $namespace ? $this->HOST.'.'.$namespace : $this->HOST;
        }
        else
        {
            $namespace = $namespace ?: $this->HOST;
        }

        if($this->environment === 'test')
        {
            return new FilesystemAdapter($namespace, $defaultLifetime, marshaller: $marshaller);
        }

        return new RedisAdapter(
            RedisAdapter::createConnection(
                sprintf(
                    'redis://%s@%s:%s?dbindex=%s',
                    $this->REDIS_PASSWORD,
                    $this->REDIS_HOST,
                    $this->REDIS_PORT,
                    $table
                )
            ),
            $namespace,
            $defaultLifetime,
            $marshaller
        );
    }

    /** Сбросить кеш не относящийся к домену */
    public function notRestricted(): self
    {
        $this->restricted = false;
        return $this;
    }

    public function getCacheType(): string
    {
        return $this->type;
    }

    public function __destruct()
    {
        // TODO: Implement __destruct() method.
    }
}


# find /tmp -ctime +1 -exec rm -rf {} +
