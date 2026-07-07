import { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import type { CardStyle } from '../../data/mock';

export function PostBox() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [cardStyle, setCardStyle] = useState<CardStyle>('text');
  const { addPost, isLoggedIn } = useStore();

  const handleSubmit = () => {
    if (!content.trim() || !isLoggedIn) return;
    addPost({
      title: title.trim() || undefined,
      content,
      cardStyle
    });
    setContent('');
    setTitle('');
    setCardStyle('text');
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
        登录后即可分享你的想法
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100">
      {/* 卡片风格选择 */}
      <div className="flex gap-2 mb-4">
        {[
          { value: 'text', label: '文字' },
          { value: 'cover', label: '封面' },
          { value: 'image-text', label: '图文' },
          { value: 'quote', label: '语录' }
        ].map((style) => (
          <button
            key={style.value}
            onClick={() => setCardStyle(style.value as CardStyle)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              cardStyle === style.value
                ? 'bg-[#2EAADC] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      {/* 标题输入（封面和图文风格需要） */}
      {(cardStyle === 'cover' || cardStyle === 'image-text') && (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题（可选）"
          className="w-full mb-3 px-4 py-2 rounded-md border border-gray-200 focus:border-[#2EAADC] focus:outline-none text-[15px] text-gray-700 placeholder-gray-400"
        />
      )}

      {/* 内容输入 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="分享你的想法..."
        className="w-full resize-none border-0 focus:outline-none text-[15px] text-gray-700 placeholder-gray-400 min-h-[80px]"
      />
      
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="px-6 py-2 rounded-md text-sm bg-[#2EAADC] text-white hover:bg-[#2596b8] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          发布
        </button>
      </div>
    </div>
  );
}
