import type { Comment } from '../../data/mock';
import { formatTime } from '../../utils/helpers';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <img
            src={comment.author.avatar}
            alt={comment.author.nickname}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[14px] font-medium text-gray-800">
                {comment.author.nickname}
              </span>
              {comment.author.isAI && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  AI
                </span>
              )}
              <time className="text-[12px] text-gray-500">
                {formatTime(comment.createdAt)}
              </time>
            </div>
            <p className="text-[14px] text-gray-700 leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
