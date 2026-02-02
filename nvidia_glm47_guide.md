# NVIDIA GLM-4.7 API 集成指南

## 1. 安装依赖
```bash
pip install openai
```

## 2. 基础使用代码

```python
import os
from openai import OpenAI

# NVIDIA API配置
def create_nvidia_client(api_key):
    """创建NVIDIA API客户端"""
    return OpenAI(
        api_key=api_key,
        base_url="https://integrate.api.nvidia.com/v1"
    )

def chat_with_glm47(client, message, max_tokens=1024, temperature=0.7):
    """使用GLM-4.7进行对话"""
    try:
        response = client.chat.completions.create(
            model="glm-4.7",  # GLM-4.7模型
            messages=[{"role": "user", "content": message}],
            max_tokens=max_tokens,
            temperature=temperature
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
```

## 3. 环境变量方式

```bash
# 设置环境变量
export NVIDIA_API_KEY="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"
```

```python
import os
from openai import OpenAI

# 使用环境变量
client = OpenAI(
    api_key=os.getenv("NVIDIA_API_KEY"),
    base_url="https://integrate.api.nvidia.com/v1"
)
```

## 4. 多轮对话示例

```python
def multi_turn_chat(client, messages):
    """多轮对话"""
    try:
        response = client.chat.completions.create(
            model="glm-4.7",
            messages=messages,
            max_tokens=1024,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"错误: {e}"

# 对话历史
conversation = [
    {"role": "user", "content": "我想学习Python编程"},
    {"role": "assistant", "content": "很好！Python是一门优秀的编程语言。你想从哪里开始学起？"},
    {"role": "user", "content": "从基础语法开始"}
]
```

## 5. 错误处理和重试

```python
import time
from openai import OpenAI

def robust_chat(client, message, max_retries=3):
    """带重试机制的聊天"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="glm-4.7",
                messages=[{"role": "user", "content": message}],
                max_tokens=1024,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            if attempt == max_retries - 1:
                return f"重试{max_retries}次后仍然失败: {e}"
            time.sleep(2 ** attempt)  # 指数退避
```

## 6. 测试连接

```python
def test_connection(api_key):
    """测试API连接"""
    client = create_nvidia_client(api_key)
    response = chat_with_glm47(client, "测试连接")
    return response
```

## 注意事项
- API密钥已提供：`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`
- 请确保GLM-4.7模型在NVIDIA API Catalog中可用
- 如遇到模型名称问题，可尝试：`zhipuai/glm-4.7` 或其他变体
- 免费额度为10K次请求