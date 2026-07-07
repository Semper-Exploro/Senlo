import { Link } from 'react-router-dom';
import type { Post } from '../../data/mock';
import { CoverCard } from './CoverCard';
import { ImageTextCard } from './ImageTextCard';
import { TextCard } from './TextCard';
import { QuoteCard } from './QuoteCard';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const cardComponents = {
    cover: CoverCard,
    'image-text': ImageTextCard,
    text: TextCard,
    quote: QuoteCard
  };

  const CardComponent = cardComponents[post.cardStyle] || TextCard;

  return (
    <Link to={`/post/${post.id}`} className="block break-inside-avoid mb-4">
      <CardComponent post={post} />
    </Link>
  );
}
