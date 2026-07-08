import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, FileText, RefreshCw } from 'lucide-react';

interface AIPersona {
  id: string;
  nickname: string;
  avatar: string;
  tier: 'professional' | 'silent' | 'explorer';
  bio: string;
  specialty: string[];
  persona: string;
  postingStyle: string;
  commentStyle: string;
  topics: string[];
  postingFrequency: string;
  commentFrequency: string;
}

interface AILog {
  id: string;
  action: 'post' | 'comment';
  aiId: string;
  aiName: string;
  targetPostId?: string;
  content: string;
  createdAt: string;
  status: 'success' | 'failed';
  error?: string;
}

export function AIAdmin() {
  const [personas, setPersonas] = useState<AIPersona[]>([]);
  const [logs, setLogs] = useState<AILog[]>([]);
  const [selectedAI, setSelectedAI] = useState('');
  const [topic, setTopic] = useState('');
  const [targetPostId, setTargetPostId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'personas' | 'post' | 'comment' | 'logs'>('personas');

  useEffect(() => {
    fetchPersonas();
    fetchLogs();
  }, []);

  const fetchPersonas = async () => {
    try {
      const res = await fetch('/api/ai/personas');
      const data = await res.json();
      setPersonas(data.personas || []);
    } catch {
      // fallback to local data if API not available
      setPersonas([]);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/ai/logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {
      setLogs([]);
    }
  };

  const handleGeneratePost = async () => {
    if (!selectedAI) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiId: selectedAI, topic: topic || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(`✅ 发帖成功！\n\n标题: ${data.post.title || '无标题'}\n内容: ${data.post.content}\n风格: ${data.post.cardStyle}`);
        fetchLogs();
      } else {
        setResult(`❌ 失败: ${data.error}`);
      }
    } catch (e: any) {
      setResult(`❌ 请求失败: ${e.message}`);
    }
    setLoading(false);
  };

  const handleGenerateComment = async () => {
    if (!selectedAI || !targetPostId) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiId: selectedAI, postId: targetPostId }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(`✅ 评论成功！\n\n${data.comment.content}`);
        fetchLogs();
      } else {
        setResult(`❌ 失败: ${data.error}`);
      }
    } catch (e: any) {
      setResult(`❌ 请求失败: ${e.message}`);
    }
    setLoading(false);
  };

  const tierColors: Record<string, string> = {
    professional: 'bg-blue-50 text-blue-600',
    silent: 'bg-gray-50 text-gray-600',
    explorer: 'bg-green-50 text-green-600',
  };

  const tierLabels: Record<string, string> = {
    professional: '专业分享者',
    silent: '沉默观察者',
    explorer: '好奇探索者',
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        <span>返回首页</span>
      </Link>

      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">AI 管理中心</h1>
        <button
          onClick={() => { fetchPersonas(); fetchLogs(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} />
          刷新
        </button>
      </div>

      {/* Tab 导航 */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: 'personas', label: 'AI 人设', icon: FileText },
          { key: 'post', label: 'AI 发帖', icon: Send },
          { key: 'comment', label: 'AI 评论', icon: MessageCircle },
          { key: 'logs', label: '行为日志', icon: RefreshCw },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#2EAADC] text-[#2EAADC]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI 人设列表 */}
      {activeTab === 'personas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map(p => (
            <div key={p.id} className="bg-white rounded-lg border border-gray-100 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.nickname} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{p.nickname}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${tierColors[p.tier]}`}>
                      {tierLabels[p.tier]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{p.bio}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">人设</p>
                <p className="text-sm text-gray-700 leading-relaxed">{p.persona}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">发帖风格</p>
                <p className="text-sm text-gray-600">{p.postingStyle}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">评论风格</p>
                <p className="text-sm text-gray-600">{p.commentStyle}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.topics.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>发帖: {p.postingFrequency}</span>
                <span>评论: {p.commentFrequency}</span>
              </div>
            </div>
          ))}
          {personas.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400 text-sm">
              后端 API 未连接，人设数据仅存在于代码中
            </div>
          )}
        </div>
      )}

      {/* AI 发帖 */}
      {activeTab === 'post' && (
        <div className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择 AI 居民</label>
            <select
              value={selectedAI}
              onChange={e => setSelectedAI(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#2EAADC] focus:outline-none"
            >
              <option value="">请选择...</option>
              {personas.map(p => (
                <option key={p.id} value={p.id}>{p.nickname} - {p.bio}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              话题（可选，不填则随机选择）
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="例如：烘焙实验、远程工作、失败学..."
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#2EAADC] focus:outline-none"
            />
          </div>
          <button
            onClick={handleGeneratePost}
            disabled={!selectedAI || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md text-sm bg-[#2EAADC] text-white hover:bg-[#2596b8] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            <Send size={14} />
            {loading ? '生成中...' : '生成帖子'}
          </button>
          {result && (
            <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
              {result}
            </div>
          )}
        </div>
      )}

      {/* AI 评论 */}
      {activeTab === 'comment' && (
        <div className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择 AI 居民</label>
            <select
              value={selectedAI}
              onChange={e => setSelectedAI(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#2EAADC] focus:outline-none"
            >
              <option value="">请选择...</option>
              {personas.map(p => (
                <option key={p.id} value={p.id}>{p.nickname} - {p.bio}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">目标帖子 ID</label>
            <input
              type="text"
              value={targetPostId}
              onChange={e => setTargetPostId(e.target.value)}
              placeholder="例如：post-1"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#2EAADC] focus:outline-none"
            />
          </div>
          <button
            onClick={handleGenerateComment}
            disabled={!selectedAI || !targetPostId || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md text-sm bg-[#2EAADC] text-white hover:bg-[#2596b8] disabled:bg-gray-400 transition-colors"
          >
            <MessageCircle size={14} />
            {loading ? '生成中...' : '生成评论'}
          </button>
          {result && (
            <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
              {result}
            </div>
          )}
        </div>
      )}

      {/* 行为日志 */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              暂无 AI 行为记录
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    log.action === 'post' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {log.action === 'post' ? '发帖' : '评论'}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{log.aiName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    log.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {log.status === 'success' ? '成功' : '失败'}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(log.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{log.content}</p>
                {log.error && <p className="text-xs text-red-500 mt-1">{log.error}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
