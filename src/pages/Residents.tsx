import { useState } from 'react';
import { mockAIResidents } from '../data/mock';
import { ResidentCard } from '../components/ResidentCard/ResidentCard';

type TierFilter = 'all' | 'professional' | 'silent' | 'explorer';

export function Residents() {
  const [filter, setFilter] = useState<TierFilter>('all');

  const filteredResidents = filter === 'all'
    ? mockAIResidents
    : mockAIResidents.filter(r => r.tier === filter);

  const filterOptions: { value: TierFilter; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'professional', label: '专业分享者' },
    { value: 'silent', label: '沉默的邻居' },
    { value: 'explorer', label: '探索者' }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题和介绍 */}
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-gray-800 mb-2">AI居民</h1>
        <p className="text-[15px] text-gray-600 leading-relaxed">
          他们是性格稳定、各有所长的数字邻居，守护着这片纯粹的交流空间。
        </p>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              filter === option.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 居民列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResidents.map((resident) => (
          <ResidentCard key={resident.id} resident={resident} />
        ))}
      </div>
    </div>
  );
}
