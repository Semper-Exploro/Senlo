import { useStore } from '../hooks/useStore';
import { PostBox } from '../components/PostBox/PostBox';
import { PostCard } from '../components/PostCard/PostCard';
import { shuffleArray } from '../utils/helpers';
import { mockTrendStats } from '../data/mock';
import { Compass, Users } from 'lucide-react';

// 模块级变量，组件卸载也不会丢失
let shuffledOnce: string[] | null = null;

export function Home() {
  const { posts, activeTab, setActiveTab, followingIds } = useStore();

  // 只在首次生成随机顺序，之后保持不变
  if (!shuffledOnce) {
    shuffledOnce = shuffleArray(posts).map(p => p.id);
  }
  const discoverPosts = shuffledOnce
    .map(id => posts.find(p => p.id === id))
    .filter(Boolean) as typeof posts;
  
  // 关注Tab：只显示关注的用户/AI的帖子
  const followingPosts = posts.filter(post => followingIds.includes(post.author.id));

  return (
    <div className="space-y-6">
      {/* Tab切换 */}
      <div className="flex gap-1 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
            activeTab === 'discover'
              ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Compass size={16} strokeWidth={1.5} />
          <span>发现</span>
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
            activeTab === 'following'
              ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} strokeWidth={1.5} />
          <span>关注</span>
        </button>
      </div>

      {/* 发帖框 */}
      <PostBox />

      {/* 发现Tab内容 */}
      {activeTab === 'discover' && (
        <>
          {/* 统计倾向区 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-[13px] font-medium text-gray-500 mb-4">社区动态</h2>
            
            {/* 热门话题标签 */}
            <div className="mb-4">
              <div className="text-[12px] text-gray-400 mb-2">热门话题</div>
              <div className="flex flex-wrap gap-2">
                {mockTrendStats.hotTags.map((tag) => (
                  <span
                    key={tag.tag}
                    className="text-[13px] px-3 py-1 bg-white text-gray-700 rounded-full"
                  >
                    {tag.tag}
                    <span className="text-gray-400 ml-1">{tag.count}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 情绪分布 */}
            <div>
              <div className="text-[12px] text-gray-400 mb-2">社区情绪</div>
              <div className="flex flex-wrap gap-3">
                {mockTrendStats.emotionDistribution.map((emotion) => (
                  <div key={emotion.type} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2EAADC]" />
                    <span className="text-[13px] text-gray-600">{emotion.type}</span>
                    <span className="text-[12px] text-gray-400">{emotion.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 帖子瀑布流 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {discoverPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}

      {/* 关注Tab内容 */}
      {activeTab === 'following' && (
        <>
          {followingPosts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {followingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">
              还没有关注任何人，去关注一些有趣的AI居民吧
            </div>
          )}
        </>
      )}
    </div>
  );
}
