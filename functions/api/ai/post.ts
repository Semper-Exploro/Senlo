import type { PagesFunction } from '@cloudflare/workers-types';
import { callGLM } from '../../_shared/glm';
import { aiPersonas } from '../../_shared/personas';
import { Store } from '../../_shared/kv';
import type { Post, CardStyle } from '../../_shared/types';

export const onRequestPost: PagesFunction = async (context) => {
  const apiKey = context.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await context.request.json();
  const { aiId, topic } = body;

  const persona = aiPersonas.find(p => p.id === aiId);
  if (!persona) {
    return new Response(JSON.stringify({ error: 'AI persona not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const store = new Store(context.env);

  try {
    // 构建 system prompt
    const systemPrompt = `你是"${persona.nickname}"，${persona.bio}。

## 你的人设
${persona.persona}

## 你的发帖风格
${persona.postingStyle}

## 你关注的话题
${persona.topics.join('、')}

## 重要规则
- 用中文回复
- 保持你的人设和说话风格
- 帖子内容要真实、有深度，不要空洞
- 如果是图文卡片，请描述你想象中的一张配图（用一句话描述画面）
- 如果是语录卡片，写一句精炼的话
- 如果是纯文字卡片，写一段有思考的内容
- 如果是封面卡片，写一个标题和一段简短描述`;

    // 构建 user prompt
    let userPrompt = '';
    if (topic) {
      userPrompt = `请以"${persona.nickname}"的身份，围绕"${topic}"这个话题发一条帖子。
选择一种卡片风格（text/cover/quote/image-text），并给出：
1. cardStyle: 卡片风格
2. title: 标题（cover 和 image-text 风格需要，其他可选）
3. content: 正文内容
4. coverDescription: 封面描述（cover 和 image-text 风格需要，用一句话描述画面）

请用 JSON 格式回复，不要加 markdown 代码块标记：
{"cardStyle": "...", "title": "...", "content": "...", "coverDescription": "..."}`;
    } else {
      userPrompt = `请以"${persona.nickname}"的身份，从你关注的话题中选择一个，发一条帖子。
选择一种卡片风格（text/cover/quote/image-text），并给出：
1. cardStyle: 卡片风格
2. title: 标题（cover 和 image-text 风格需要，其他可选）
3. content: 正文内容
4. coverDescription: 封面描述（cover 和 image-text 风格需要，用一句话描述画面）

请用 JSON 格式回复，不要加 markdown 代码块标记：
{"cardStyle": "...", "title": "...", "content": "...", "coverDescription": "..."}`;
    }

    const content = await callGLM(apiKey, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.8, maxTokens: 512 });

    // 解析 AI 回复
    let parsed: { cardStyle: CardStyle; title?: string; content: string; coverDescription?: string };
    try {
      // 尝试直接解析
      parsed = JSON.parse(content);
    } catch {
      // 尝试提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        // fallback: 当作纯文字卡片
        parsed = { cardStyle: 'text', content: content.trim() };
      }
    }

    const post: Post = {
      id: `post-ai-${Date.now()}`,
      author: {
        id: persona.id,
        nickname: persona.nickname,
        avatar: persona.avatar,
        isAI: true,
        tier: persona.tier,
        bio: persona.bio,
        joinedAt: persona.joinedAt,
      },
      title: parsed.title,
      content: parsed.content,
      cardStyle: parsed.cardStyle || 'text',
      createdAt: new Date().toISOString(),
      resonances: [],
      commentCount: 0,
    };

    await store.savePost(post);

    return new Response(JSON.stringify({ success: true, post }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
