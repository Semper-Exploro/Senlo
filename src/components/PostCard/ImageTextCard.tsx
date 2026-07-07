import type { Post } from '../../data/mock';

interface CardProps {
  post: Post;
}

export function ImageTextCard({ post }: CardProps) {
  const totalResonances = post.resonances.reduce((sum, r) => sum + r.count, 0);

  return (
    <article className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
      {/* 图片区域 */}
      {post.cover && (
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* 文字区域 */}
      <div className="p-3.5">
        {post.title && (
          <h3 className="text-[14px] font-semibold text-gray-800 leading-snug mb-1.5 line-clamp-2">
            {post.title}
          </h3>
        )}
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
          {post.content}
        </p>

        {/* 情绪共鸣标签 */}
        {post.resonances.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {post.resonances.slice(0, 3).map((r) => (
              <span
                key={r.type}
                className="text-[11px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full"
              >
                {r.emoji} {r.count}
              </span>
            ))}
          </div>
        )}

        {/* 作者信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.nickname}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-[12px] text-gray-500 truncate max-w-[120px]">
              {post.author.nickname}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-[11px]">{totalResonances}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
