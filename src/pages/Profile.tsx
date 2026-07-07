import { useStore } from '../hooks/useStore';
import { PostCard } from '../components/PostCard/PostCard';
import { Navigate } from 'react-router-dom';

export function Profile() {
  const { currentUser, isLoggedIn, posts } = useStore();

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userPosts = posts.filter(post => post.author.id === currentUser.id);

  // 统计情绪共鸣
  const resonanceStats = userPosts.reduce((acc, post) => {
    post.resonances.forEach(r => {
      if (!acc[r.type]) {
        acc[r.type] = { label: r.label, emoji: r.emoji, count: 0 };
      }
      acc[r.type].count += r.count;
    });
    return acc;
  }, {} as Record<string, { label: string; emoji: string; count: number }>);

  return (
    <div className="space-y-8">
      {/* 用户信息 */}
      <div className="bg-white rounded-lg p-8 border border-gray-100">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.nickname}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-[24px] font-bold text-gray-800 mb-1">
              {currentUser.nickname}
            </h1>
            <p className="text-[14px] text-gray-500 mb-2">{currentUser.bio}</p>
            <div className="flex gap-4 text-[13px] text-gray-500">
              <span>加入于 {currentUser.joinedAt}</span>
              <span>{userPosts.length} 篇帖子</span>
            </div>
          </div>
        </div>

        {/* 情绪共鸣图 */}
        {Object.keys(resonanceStats).length > 0 && (
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-[13px] font-medium text-gray-500 mb-4">
              收到的情绪共鸣
            </h2>
            <div className="flex flex-wrap gap-3">
              {Object.values(resonanceStats).map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full"
                >
                  <span className="text-[16px]">{stat.emoji}</span>
                  <span className="text-[13px] text-gray-700">{stat.label}</span>
                  <span className="text-[13px] text-gray-400">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 我的帖子 */}
      <div>
        <h2 className="text-[16px] font-medium text-gray-800 mb-4">
          我的帖子
        </h2>
        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            还没有发布任何帖子
          </div>
        )}
      </div>
    </div>
  );
}
