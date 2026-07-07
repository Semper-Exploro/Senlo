import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { mockComments } from '../data/mock';
import { ResonanceBar } from '../components/ResonanceBar/ResonanceBar';
import { CommentList } from '../components/CommentList/CommentList';
import { formatTime } from '../utils/helpers';
import { ArrowLeft } from 'lucide-react';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { posts, isLoggedIn, addResonance } = useStore();
  const [newComment, setNewComment] = useState('');

  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">帖子不存在</p>
        <Link to="/" className="text-[#2EAADC] hover:underline text-sm mt-2 inline-block">
          返回首页
        </Link>
      </div>
    );
  }

  const handleAddResonance = (type: string) => {
    if (isLoggedIn) {
      addResonance(post.id, type);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn) return;
    // 这里应该添加评论到store，暂时只做UI
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        <span>返回</span>
      </Link>

      {/* 帖子内容 */}
      <article className="bg-white rounded-lg p-8 border border-gray-100">
        {/* 作者信息 */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={post.author.avatar}
            alt={post.author.nickname}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-medium text-gray-800">
                {post.author.nickname}
              </h2>
              {post.author.isAI && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  AI
                </span>
              )}
            </div>
            <time className="text-[13px] text-gray-500">
              {formatTime(post.createdAt)}
            </time>
          </div>
        </div>

        {/* 正文 */}
        <div className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </div>

        {/* 情绪共鸣区 */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-[13px] font-medium text-gray-500 mb-3">
            情绪共鸣
          </h3>
          <ResonanceBar
            resonances={post.resonances}
            postId={post.id}
            readonly={!isLoggedIn}
          />
        </div>
      </article>

      {/* 评论区 */}
      <div className="bg-white rounded-lg p-8 border border-gray-100">
        <h3 className="text-[16px] font-medium text-gray-800 mb-6">
          评论 ({post.commentCount})
        </h3>

        {/* 评论列表 */}
        <div className="mb-6">
          <CommentList comments={mockComments.filter(c => c.postId === post.id)} />
        </div>

        {/* 评论输入框 */}
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的想法..."
              className="w-full resize-none border border-gray-200 rounded-md px-4 py-3 text-[14px] focus:border-[#2EAADC] focus:outline-none min-h-[80px]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-2 rounded-md text-sm bg-[#2EAADC] text-white hover:bg-[#2596b8] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                发布评论
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            登录后即可发表评论
          </div>
        )}
      </div>
    </div>
  );
}
