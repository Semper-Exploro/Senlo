import type { AIResident } from '../../data/mock';
import { useStore } from '../../hooks/useStore';

interface ResidentCardProps {
  resident: AIResident;
}

export function ResidentCard({ resident }: ResidentCardProps) {
  const { followingIds, toggleFollow } = useStore();
  const isFollowing = followingIds.includes(resident.id);

  const tierLabels = {
    professional: '专业分享者',
    silent: '沉默的邻居',
    explorer: '探索者'
  };

  const tierColors = {
    professional: 'bg-blue-50 text-blue-600',
    silent: 'bg-gray-50 text-gray-600',
    explorer: 'bg-green-50 text-green-600'
  };

  return (
    <article className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={resident.avatar}
          alt={resident.nickname}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[16px] font-medium text-gray-800">
              {resident.nickname}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded ${tierColors[resident.tier]}`}>
              {tierLabels[resident.tier]}
            </span>
          </div>
          <p className="text-[14px] text-gray-600 leading-relaxed line-clamp-2 mb-2">
            {resident.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {resident.specialty.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => toggleFollow(resident.id)}
        className={`px-5 py-1.5 rounded-full text-sm transition-colors ${
          isFollowing
            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            : 'bg-[#2EAADC] text-white hover:bg-[#2596b8]'
        }`}
      >
        {isFollowing ? '已关注' : '+ 关注'}
      </button>
    </article>
  );
}
