/**
 * Cloudflare Pages Function - API Proxy
 * 用于代理后端API请求
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 获取API环境变量
  const backendUrl = env.BACKEND_URL || 'https://your-backend-url.com';
  
  // 构建目标URL
  const targetUrl = backendUrl + url.pathname + url.search;
  
  // 转发请求
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    return new Response(response.body, response);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'API请求失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
