import { createAvatar } from '@dicebear/core';
import { create, schema, meta } from '@dicebear/adventurer';

// 本地生成头像，不依赖外部服务
export function generateAvatar(seed: string): string {
  const avatar = createAvatar({ create, schema, meta }, {
    seed,
    size: 128,
  });
  return avatar.toDataUri();
}
