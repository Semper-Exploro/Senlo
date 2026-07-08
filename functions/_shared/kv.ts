// KV 存储封装 - 使用 Cloudflare KV 存储帖子和评论
// 在 Pages Functions 中通过 env.MY_KV 访问

import type { Post, Comment, AILog } from './types';

// 内存存储（开发环境 fallback，生产环境应该用 KV）
const memoryStore: {
  posts: Map<string, Post>;
  comments: Map<string, Comment>;
  logs: Map<string, AILog>;
} = {
  posts: new Map(),
  comments: new Map(),
  logs: new Map(),
};

export class Store {
  private env: any;

  constructor(env: any) {
    this.env = env;
  }

  private get kv(): any {
    return this.env.MY_KV;
  }

  // 帖子操作
  async getPost(id: string): Promise<Post | null> {
    if (this.kv) {
      const data = await this.kv.get(`post:${id}`, 'json');
      return data as Post | null;
    }
    return memoryStore.posts.get(id) || null;
  }

  async getAllPosts(): Promise<Post[]> {
    if (this.kv) {
      const keys = await this.kv.list({ prefix: 'post:' });
      const posts: Post[] = [];
      for (const key of keys.keys) {
        const post = await this.kv.get(key.name, 'json');
        if (post) posts.push(post as Post);
      }
      return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return Array.from(memoryStore.posts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async savePost(post: Post): Promise<void> {
    if (this.kv) {
      await this.kv.put(`post:${post.id}`, JSON.stringify(post));
    } else {
      memoryStore.posts.set(post.id, post);
    }
  }

  // 评论操作
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    if (this.kv) {
      const keys = await this.kv.list({ prefix: `comment:${postId}:` });
      const comments: Comment[] = [];
      for (const key of keys.keys) {
        const comment = await this.kv.get(key.name, 'json');
        if (comment) comments.push(comment as Comment);
      }
      return comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return Array.from(memoryStore.comments.values())
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async saveComment(comment: Comment): Promise<void> {
    if (this.kv) {
      await this.kv.put(`comment:${comment.postId}:${comment.id}`, JSON.stringify(comment));
    } else {
      memoryStore.comments.set(comment.id, comment);
    }
  }

  // AI 日志
  async saveLog(log: AILog): Promise<void> {
    if (this.kv) {
      await this.kv.put(`log:${log.id}`, JSON.stringify(log));
    } else {
      memoryStore.logs.set(log.id, log);
    }
  }

  async getLogs(limit = 50): Promise<AILog[]> {
    if (this.kv) {
      const keys = await this.kv.list({ prefix: 'log:', limit });
      const logs: AILog[] = [];
      for (const key of keys.keys) {
        const log = await this.kv.get(key.name, 'json');
        if (log) logs.push(log as AILog);
      }
      return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return Array.from(memoryStore.logs.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}
