// ✅ 启用 Edge Runtime，将超时限制提升至 60秒
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 1. 处理跨域 (CORS)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 2. 处理预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // 3. 处理主请求
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const body = await req.json();
    
    // API Key (建议后续改为环境变量 process.env.VOLC_API_KEY)
    const API_KEY = process.env.VOLC_API_KEY || "4bcbe285-c162-4c7d-905c-941a3b030ba5";
    const endpoint = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

    // 4. 转发给豆包
    const upstreamRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`
      },
      body: JSON.stringify(body)
    });

    const data = await upstreamRes.json();

    // 5. 返回结果
    return new Response(JSON.stringify(data), {
      status: upstreamRes.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
