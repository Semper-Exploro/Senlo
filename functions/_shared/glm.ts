// 智谱 GLM-4V-Flash API 封装
// 文档: https://open.bigmodel.cn/dev/api/normal-model/glm-4v

const ZHIPU_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentItem[];
}

export interface ContentItem {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

export interface GLMResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callGLM(
  apiKey: string,
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
): Promise<string> {
  const { temperature = 0.7, maxTokens = 1024, model = 'glm-4v-flash' } = options || {};

  const response = await fetch(`${ZHIPU_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GLM API error: ${response.status} ${errorText}`);
  }

  const data: GLMResponse = await response.json();
  return data.choices[0].message.content;
}
