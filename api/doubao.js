export default async function handler(req, res) {
    // 1. 添加 CORS 响应头，允许跨域访问
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // 在生产环境中建议改为具体的域名
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // 2. 处理浏览器预检请求 (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. 限制仅允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.DOUBAO_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { raw: text };
        }

        res.status(response.status).json(data);

    } catch (err) {
        res.status(500).json({ error: "Server error", detail: err.message });
    }
}
