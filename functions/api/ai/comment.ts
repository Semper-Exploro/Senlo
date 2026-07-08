import type { PagesFunction } from '@cloudflare/workers-types';
import { callGLM } from '../../_shared/glm';
import { aiPersonas } from '../../_shared/personas';
import { Store } from '../../_shared/kv';
import type { Comment } from '../../_shared/types';

export const onRequestPost: PagesFunction = async (context) => {
  const apiKey = context.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await context.request.json();
  const { aiId, postId } = body;

  const persona = aiPersonas.find(p => p.id === aiId);
  if (!persona) {
    return new Response(JSON.stringify({ error: 'AI persona not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const store = new Store(context.env);

  try {
    // 获取目标帖子
    const post = await store.getPost(postId);
    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 获取该帖子已有的评论（避免重复）
    const existingComments = await store.getCommentsByPost(postId);

    // 构建 system prompt
    const systemPrompt = `你是"${persona.nickname}"，${persona.bio}。

## 你的人设
${persona.persona}

## 你的评论风格
${persona.commentStyle}

## 你关注的话题
${persona.topics.join('、')}

## 重要规则
- 用中文回复
- 保持你的人设和说话风格
- 评论要有深度，不要空洞的"好棒"、"同意"
- 从你的独特视角出发，给出有价值的回应
- 评论长度适中，不要太长（50-200字）
- 如果帖子内容和你的关注话题无关，你可以说"这个话题我不太了解，但..."然后从一个相关角度评论`;

    // 构建 user prompt
    const postContext = `作者：${post.author.nickname}（${post.author.bio || '普通用户'}）
标题：${post.title || '无标题'}
内容：${post.content}
卡片风格：${post.cardStyle}`;

    const existingContext = existingComments.length > 0
      ? `\n\n已有评论：\n${existingComments.map(c => `- ${c.author.nickname}: ${c.content}`).join('\n')}`
      : '';

    const userPrompt = `请阅读以下帖子，以"${persona.nickname}"的身份写一条评论：

${postContext}${existingContext}

请直接回复评论内容，不要加引号，不要加其他说明。`;

    const commentContent = await callGLM(apiKey, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.7, maxTokens: 256 });

    const comment: Comment = {
      id: `comment-ai-${Date.now()}`,
      postId,
      author: {
        id: persona.id,
        nickname: persona.nickname,
        avatar: persona.avatar,
        isAI: true,
        tier: persona.tier,
        bio: persona.bio,
        joinedAt: persona.joinedAt,
      },
      content: commentContent.trim(),
      createdAt: new Date().toISOString(),
    };

    await store.saveComment(comment);

    return new Response(JSON.stringify({ success: true, comment }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
