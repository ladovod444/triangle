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

namespace Core\Lock;

use BaksDev\Core\Lock\AppLockInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Lock\LockFactory;
use Symfony\Component\Lock\SharedLockInterface;
use Symfony\Component\Lock\Store\FlockStore;
use Symfony\Component\Lock\Store\RedisStore;

final class RedisLock implements AppLockInterface
{
    private SharedLockInterface $lock;
    private LockFactory $factory;

    private string $key;
    private float $ttl = 60;

    private bool $release = true;


    private string $REDIS_HOST;
    private int $REDIS_PORT;
    private string $REDIS_PASSWORD;


    public function __construct(
        #[Autowire(env: 'REDIS_HOST')] string $REDIS_HOST,
        #[Autowire(env: 'REDIS_PORT')] int $REDIS_PORT,
        #[Autowire(env: 'REDIS_PASSWORD')] string $REDIS_PASSWORD,
    ) {
        $this->REDIS_HOST = $REDIS_HOST;
        $this->REDIS_PORT = $REDIS_PORT;
        $this->REDIS_PASSWORD = $REDIS_PASSWORD;
    }


    /**
     * Метод включает блокировку ресурса
     */
    public function createLock(string|array $keys): self //SharedLockInterface
    {

        $key = is_array($keys) ? implode('.', $keys) : $keys;

        $this->key = md5($key.'lock');

        $Redis = new \Redis();

        $Redis->connect(
            host: $this->REDIS_HOST,
            port: $this->REDIS_PORT
        );

        $Redis->auth($this->REDIS_PASSWORD);

        $RedisStore = new RedisStore($Redis);
        $this->factory = new LockFactory($RedisStore);

        return $this;
    }

    /**
     * Устанавливает время жизни блокировки
     */
    public function lifetime(int|float $ttl = 60): self
    {
        $this->ttl = (float) $ttl;
        return $this;
    }

    /**
     * Метод создает блокировку ресурса, параллельные запросы будут ожидать завершения процесса
     *
     * <code>
     * $lock = $appLock
     *  ->createLock('example-key')
     *  ->lifetime(30)
     *  ->wait(); // выполняем последовательно запросы
     *
     * // выполняем код
     *
     * $lock->release(); // снимаем блокировку
     *
     * </code>
     *
     */
    public function wait(): self
    {
        $this->lock = $this->factory->createLock(
            $this->key,
            $this->ttl,
            true
        );

        $this->lock->acquire(true);

        return $this;
    }


    /**
     * Метод применяет блокировку процесса, без последующего снятия (ожидает все время)
     */
    public function waitAllTime(): self
    {
        $this->release = false;

        $this->lock = $this->factory->createLock(
            $this->key,
            $this->ttl,
            false
        );

        $this->lock->acquire(true);

        return $this;
    }

    /**
     * Метод возвращает результат блокировки процесса
     *
     * false - Если ресурс не заблокирован (блокируем для других процессов и продолжаем выполнение)
     * true - Если ресурс занят другом процессом (завершаем выполнение программы)
     *
     * <code>
     *
     * $lock = $appLock
     *  ->createLock('example-key')
     *  ->lifetime(30);
     *
     * if($lock->isLock())
     * {
     *      return 'Невозможно выполнить запрос: процесс заблокирован';
     * }
     *
     * </code>
     *
     */
    public function isLock(): bool
    {

        $this->lock = $this->factory->createLock(
            $this->key,
            $this->ttl,
            false
        );

        $this->lock->acquire();

        if($this->lock->isAcquired())
        {
            return false;
        }

        return true;
    }


    /**
     * Метод завершает блокировку
     */
    public function release(): void
    {
        if($this->release)
        {
            $this->lock->release();
        }
    }


    public function getTypeLock(): string
    {
        return 'redis';
    }
}
