from fastapi import APIRouter, UploadFile, File, HTTPException
from openai import OpenAI
import os
import base64
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.post("/parse")
async def parse_invoice(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files supported")

    contents = await file.read()
    base64_image = base64.b64encode(contents).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """
                You are an invoice parser.
                Extract structured JSON:
                {
                  supplier_name,
                  invoice_date,
                  line_items: [
                    { name, quantity, unit_price, total }
                  ],
                  grand_total
                }
                Return ONLY valid JSON.
                """
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Extract data from this invoice image"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    )

    return response.choices[0].message.content