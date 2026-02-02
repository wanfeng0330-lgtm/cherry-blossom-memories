"""
NVIDIA GLM-4.7 API 测试脚本
请先安装: pip install openai
"""

from openai import OpenAI


def test_nvidia_api():
    """测试NVIDIA API连接和GLM-4.7模型"""

    # API配置
    api_key = "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"

    try:
        # 创建客户端
        client = OpenAI(api_key=api_key, base_url="https://integrate.api.nvidia.com/v1")

        print("✅ 客户端创建成功")

        # 测试连接
        response = client.chat.completions.create(
            model="glm-4.7",
            messages=[{"role": "user", "content": "Hello, test connection"}],
            max_tokens=50,
            temperature=0.1,
        )

        print("✅ API调用成功")
        print(f"响应: {response.choices[0].message.content}")

    except Exception as e:
        print(f"❌ 错误: {e}")

        # 如果GLM-4.7不可用，尝试其他模型
        print("\n尝试其他模型...")
        alternative_models = [
            "meta/llama-3.1-8b-instruct",
            "mistralai/mixtral-8x7b-instruct",
            "google/gemma-7b",
        ]

        for model in alternative_models:
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=50,
                )
                print(f"✅ {model} 可用")
                break
            except:
                print(f"❌ {model} 不可用")


if __name__ == "__main__":
    test_nvidia_api()
