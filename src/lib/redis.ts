/**
 * 内存版 Redis 替代实现
 * 用于开发/原型阶段，暂时不使用真实 Redis
 */

// 存储结构: Map<key, { value: string, expiresAt: number | null }>
const store = new Map<string, { value: string; expiresAt: number | null }>();

/**
 * 清理过期键
 */
function cleanup(): void {
  const now = Date.now();
  for (const [key, item] of store.entries()) {
    if (item.expiresAt !== null && item.expiresAt < now) {
      store.delete(key);
    }
  }
}

class MemoryRedis {
  async get(key: string): Promise<string | null> {
    cleanup();
    const item = store.get(key);
    if (!item) return null;
    if (item.expiresAt !== null && item.expiresAt < Date.now()) {
      store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ...args: unknown[]): Promise<'OK'> {
    let expiresAt: number | null = null;

    // 处理 EX 选项 (set key value EX seconds)
    const exIndex = args.findIndex((arg) => arg === 'EX');
    if (exIndex !== -1 && typeof args[exIndex + 1] === 'number') {
      const seconds = args[exIndex + 1] as number;
      expiresAt = Date.now() + seconds * 1000;
    }

    store.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = (parseInt(current || '0', 10) + 1).toString();
    const item = store.get(key);
    store.set(key, { value: newValue, expiresAt: item?.expiresAt ?? null });
    return parseInt(newValue, 10);
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    return 1;
  }

  /**
   * 管道操作支持 (简化实现)
   */
  multi(): { incr: (key: string) => object; expire: (key: string, seconds: number) => object; exec: () => Promise<Array<[null, number]>> } {
    const commands: Array<{ type: 'incr' | 'expire'; key: string; args?: number }> = [];

    const chain = {
      incr: (key: string) => {
        commands.push({ type: 'incr', key });
        return chain;
      },
      expire: (key: string, seconds: number) => {
        commands.push({ type: 'expire', key, args: seconds });
        return chain;
      },
      exec: async () => {
        const results: Array<[null, number]> = [];
        for (const cmd of commands) {
          if (cmd.type === 'incr') {
            const result = await this.incr(cmd.key);
            results.push([null, result]);
          } else if (cmd.type === 'expire') {
            const result = await this.expire(cmd.key, cmd.args!);
            results.push([null, result]);
          }
        }
        return results;
      },
    };

    return chain;
  }

  on(_event: string, _callback: () => void): this {
    return this;
  }
}

// 单例
const globalForRedis = globalThis as unknown as {
  redis: MemoryRedis | undefined;
};

export const redis = globalForRedis.redis ?? new MemoryRedis();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

console.log('Using in-memory Redis (dev mode)');

export default redis;
