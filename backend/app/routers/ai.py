from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.ai_service import (
    client,
    get_low_stock_products,
    get_product_detail
)
import json

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(request: ChatRequest):

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_low_stock_products",
                "description": "Get list of products that are low in stock",
                "parameters": {
                    "type": "object",
                    "properties": {}
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_product_detail",
                "description": "Get product details by product name",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "product_name": {"type": "string"}
                    },
                    "required": ["product_name"]
                }
            }
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are SmartStore AI assistant. Always use tools when needed."},
            {"role": "user", "content": request.message}
        ],
        tools=tools,
        tool_choice="auto"
    )

    message = response.choices[0].message

    # ✅ If tool is called
    if message.tool_calls:
        tool_call = message.tool_calls[0]
        tool_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)

        if tool_name == "get_low_stock_products":
            result = get_low_stock_products()

        elif tool_name == "get_product_detail":
            result = get_product_detail(arguments["product_name"])

        else:
            result = {"error": "Unknown tool"}

        return {
            "tool_used": tool_name,
            "data": result
        }

    # ✅ Normal response
    return {"response": message.content}