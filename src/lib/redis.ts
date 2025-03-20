// src/lib/redis.ts
import { createClient } from 'redis';

const redis = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
});

redis.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
  return redis;
}

export default redis;