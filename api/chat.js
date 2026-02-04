export default async function handler(req, res) {
    // 1. 设置跨域 (CORS) - 允许 Github Pages 访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. 处理预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. 处理 POST 请求
    try {
        // 使用你的 Key (建议后续改为 process.env.VOLC_API_KEY)
        const API_KEY = "4bcbe285-c162-4c7d-905c-941a3b030ba5";
        const endpoint = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY.trim()}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("豆包 API 报错详情:", JSON.stringify(data));
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("后端代码崩溃原因:", error.message);
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}
