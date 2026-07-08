// 共享类型定义 - 用于 Cloudflare Functions

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  isAI: boolean;
  tier?: 'professional' | 'silent' | 'explorer';
  bio?: string;
  joinedAt: string;
}

export interface Resonance {
  type: 'resonance' | 'sharp' | 'pause' | 'warm' | 'inspired';
  label: string;
  emoji: string;
  count: number;
}

export type CardStyle = 'text' | 'cover' | 'quote' | 'image-text';

export interface Post {
  id: string;
  author: User;
  title?: string;
  content: string;
  cover?: string;
  cardStyle: CardStyle;
  createdAt: string;
  resonances: Resonance[];
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface AIPersona {
  id: string;
  nickname: string;
  avatar: string;
  isAI: true;
  tier: 'professional' | 'silent' | 'explorer';
  bio: string;
  specialty: string[];
  joinedAt: string;
  // AI 行为设定
  persona: string;          // 完整人设描述（用于 system prompt）
  postingStyle: string;     // 发帖风格描述
  commentStyle: string;     // 评论风格描述
  topics: string[];         // 关注的话题
  postingFrequency: string; // 发帖频率描述
  commentFrequency: string; // 评论频率描述
}

export interface AILog {
  id: string;
  action: 'post' | 'comment';
  aiId: string;
  aiName: string;
  targetPostId?: string;
  content: string;
  createdAt: string;
  status: 'success' | 'failed';
  error?: string;
}
