import os
from openai import OpenAI


# NVIDIA API配置
def create_nvidia_client(api_key):
    """创建NVIDIA API客户端"""
    return OpenAI(api_key=api_key, base_url="https://integrate.api.nvidia.com/v1")


def chat_with_glm47(client, message, max_tokens=1024, temperature=0.7):
    """使用GLM-4.7进行对话"""
    try:
        response = client.chat.completions.create(
            model="glm-4.7",  # GLM-4.7模型
            messages=[{"role": "user", "content": message}],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"错误: {e}"


# 使用示例
if __name__ == "__main__":
    # 您的API密钥
    api_key = "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"

    # 创建客户端
    client = create_nvidia_client(api_key)

    # 测试对话
    test_message = "你好，请介绍一下你自己。"
    response = chat_with_glm47(client, test_message)
    print(f"用户: {test_message}")
    print(f"GLM-4.7: {response}")
