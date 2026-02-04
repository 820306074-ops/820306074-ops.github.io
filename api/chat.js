// api/chat.js
export default async function handler(req, res) {
    // 1. 处理跨域 (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // 2. 处理预检请求 (Options)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. 限制只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 4. 调用豆包 AI 接口
    try {
        // 【注意】：建议将 API_KEY 放在 Vercel 的 Environment Variables 中
        const API_KEY = "这里填入你的豆包API_KEY"; 
        const endpoint = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(req.body) // 将前端传来的 payload 直接转发
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '后端请求失败', details: error.message });
    }
}
