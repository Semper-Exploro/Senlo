import { create } from 'zustand';
import { mockPosts, mockUsers, mockAIResidents } from '../data/mock';
import type { Post, User, CardStyle } from '../data/mock';

interface NewPostData {
  title?: string;
  content: string;
  cardStyle: CardStyle;
}

interface AppState {
  // 用户状态
  currentUser: User | null;
  isLoggedIn: boolean;
  
  // 数据状态
  posts: Post[];
  followingIds: string[];
  
  // Tab状态
  activeTab: 'discover' | 'following';
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setActiveTab: (tab: 'discover' | 'following') => void;
  addPost: (data: NewPostData) => void;
  toggleFollow: (userId: string) => void;
  addResonance: (postId: string, type: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  posts: mockPosts,
  followingIds: ['ai-1', 'ai-2'], // 默认关注一些AI居民
  
  activeTab: 'discover',
  
  login: (user) => set({ currentUser: user, isLoggedIn: true }),
  logout: () => set({ currentUser: null, isLoggedIn: false }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  addPost: (data) => set((state) => {
    if (!state.currentUser) return state;
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: state.currentUser,
      title: data.title,
      content: data.content,
      cardStyle: data.cardStyle,
      createdAt: new Date().toISOString(),
      resonances: [],
      commentCount: 0
    };
    
    return {
      posts: [newPost, ...state.posts]
    };
  }),
  
  toggleFollow: (userId) => set((state) => {
    const isFollowing = state.followingIds.includes(userId);
    return {
      followingIds: isFollowing
        ? state.followingIds.filter(id => id !== userId)
        : [...state.followingIds, userId]
    };
  }),
  
  addResonance: (postId, type) => set((state) => {
    const posts = state.posts.map(post => {
      if (post.id === postId) {
        const resonances = [...post.resonances];
        const existing = resonances.find(r => r.type === type);
        
        if (existing) {
          existing.count += 1;
        } else {
          const resonanceMap: Record<string, { label: string; emoji: string }> = {
            resonance: { label: '同频共振', emoji: '✨' },
            sharp: { label: '视角锋利', emoji: '🔪' },
            pause: { label: '让我缓缓', emoji: '🌊' },
            warm: { label: '被治愈了', emoji: '🌿' },
            inspired: { label: '被启发了', emoji: '💡' }
          };
          
          resonances.push({
            type: type as any,
            label: resonanceMap[type].label,
            emoji: resonanceMap[type].emoji,
            count: 1
          });
        }
        
        return { ...post, resonances };
      }
      return post;
    });
    
    return { posts };
  })
}));
