// api/chat.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // 【关键】如果你没设环境变量，暂时先直接把 Key 填在这里字符串里测试
        const API_KEY = process.env.VOLC_API_KEY || "4bcbe285-c162-4c7d-905c-941a3b030ba5";
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
            // 如果豆包 API 返回错误，打印出来，方便我们在日志里看
            console.error("豆包 API 报错详情:", JSON.stringify(data));
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        // 如果代码本身崩溃，打印崩溃原因
        console.error("后端代码崩溃原因:", error.message);
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}
