from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
import io
import json
import PyPDF2
import docx
from dotenv import load_dotenv
from rag import build_rag, retrieve_chunks
from datasets import get_sector_context

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Extract text from uploaded file ──
def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        return " ".join(page.extract_text() for page in reader.pages)
    elif filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(file_bytes))
        return " ".join(p.text for p in doc.paragraphs)
    else:
        return file_bytes.decode("utf-8")

# ── Send RAG context to Groq for analysis ──
def analyse_with_groq(policy_text: str) -> dict:
    prompt = f"""
You are a government policy analyst for India.

Analyse this policy document and return ONLY a JSON object with this exact structure, no extra text, no markdown, no backticks:

{{
  "policy_title": "title of the policy",
  "overall_risk_score": 65,
  "sectors": [
    {{"name": "Agriculture", "score": 80, "sentiment": "negative"}},
    {{"name": "Economy", "score": 55, "sentiment": "neutral"}},
    {{"name": "Healthcare", "score": 30, "sentiment": "positive"}},
    {{"name": "Education", "score": 45, "sentiment": "neutral"}},
    {{"name": "Infrastructure", "score": 60, "sentiment": "negative"}}
  ],
  "states": [
    {{"state": "Punjab", "impact_score": 90}},
    {{"state": "Maharashtra", "impact_score": 65}},
    {{"state": "Uttar Pradesh", "impact_score": 75}},
    {{"state": "Tamil Nadu", "impact_score": 40}},
    {{"state": "Kerala", "impact_score": 20}},
    {{"state": "Gujarat", "impact_score": 55}},
    {{"state": "Rajasthan", "impact_score": 70}}
  ],
  "stakeholders": [
    {{"group": "Farmers", "impact": "describe impact here", "severity": "high"}},
    {{"group": "Urban Workers", "impact": "describe impact here", "severity": "medium"}},
    {{"group": "State Governments", "impact": "describe impact here", "severity": "high"}},
    {{"group": "Exporters", "impact": "describe impact here", "severity": "low"}}
  ],
  "timeline": [
    {{"period": "6 months", "impact_score": 40, "description": "short description of impact at 6 months"}},
    {{"period": "1 year", "impact_score": 55, "description": "short description of impact at 1 year"}},
    {{"period": "2 years", "impact_score": 65, "description": "short description of impact at 2 years"}},
    {{"period": "3 years", "impact_score": 72, "description": "short description of impact at 3 years"}},
    {{"period": "5 years", "impact_score": 80, "description": "short description of impact at 5 years"}}
  ],
  "recommendations": [
    {{
      "title": "Short title of recommendation",
      "description": "2-3 sentence explanation of what change should be made and why",
      "priority": "high",
      "sector": "Economy"
    }},
    {{
      "title": "Short title",
      "description": "2-3 sentence explanation",
      "priority": "medium",
      "sector": "Agriculture"
    }},
    {{
      "title": "Short title",
      "description": "2-3 sentence explanation",
      "priority": "low",
      "sector": "Healthcare"
    }},
    {{
      "title": "Short title",
      "description": "2-3 sentence explanation",
      "priority": "high",
      "sector": "Infrastructure"
    }}
  ]
}}

Score rules:
- overall_risk_score: 0 to 100
- sector scores: 0 to 100
- sentiment: only "positive", "negative", or "neutral"
- severity: only "high", "medium", or "low"
- priority: only "high", "medium", or "low"
- timeline impact_score: 0 to 100 (predicted impact growth over time)
- Give exactly 4 recommendations based on actual policy weaknesses
- Use the RBI reference data to give accurate state-wise and sector-wise scores

Policy document (relevant excerpts):
{policy_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=2000,
        messages=[
            {
                "role": "system",
                "content": "You are a policy analyst. Always respond with valid JSON only. No markdown, no backticks, no extra text."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    response_text = response.choices[0].message.content.strip()
    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]

    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        raise ValueError(f"Groq returned invalid JSON. Response was: {response_text[:200]}")


# ── Route: Upload + Analyse ──
@app.post("/upload")
async def upload_policy(file: UploadFile = File(...)):
    try:
        # Check file type
        allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
        ]
        if file.content_type not in allowed_types:
            return {"error": "Only PDF, DOCX, or TXT files are allowed"}

        # Check file size (10MB max)
        file_bytes = await file.read()
        if len(file_bytes) > 10 * 1024 * 1024:
            return {"error": "File is too large. Maximum size is 10MB"}

        # Extract text
        text = extract_text(file_bytes, file.filename)

        # Check if text is empty
        if not text or len(text.strip()) < 50:
            return {"error": "Could not extract text from this file. It may be a scanned image or blank document. Please upload a text-based PDF or DOCX."}

        # ── Check if it's actually a government policy ──
        check_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=10,
            messages=[
                {
                    "role": "system",
                    "content": "You are a document classifier. Reply with only 'yes' or 'no'."
                },
                {
                    "role": "user",
                    "content": f"Is this document a government policy, legislation, bill, scheme, act, or official government document? Reply only yes or no.\n\n{text[:1000]}"
                }
            ]
        )

        is_policy = check_response.choices[0].message.content.strip().lower()

        if 'no' in is_policy:
            return {"error": "This does not appear to be a government policy document. Please upload a policy, bill, act, scheme, or official government document."}

        # ── RAG: chunk, embed, store, retrieve ──
        build_rag(text, collection_name="policy")

        sector_context = retrieve_chunks("sector impact risk economy agriculture healthcare infrastructure education", "policy")
        state_context = retrieve_chunks("state wise impact india punjab maharashtra kerala uttar pradesh gujarat", "policy")
        stakeholder_context = retrieve_chunks("stakeholders affected groups people farmers organizations government", "policy")
        timeline_context = retrieve_chunks("timeline short term long term future impact years months", "policy")

        # ── Fetch real RBI dataset context ──
        dataset_context = get_sector_context(["agriculture", "economy", "infrastructure", "healthcare", "education"])

        rag_context = f"""
SECTOR IMPACT CONTEXT (from policy):
{sector_context}

STATE IMPACT CONTEXT (from policy):
{state_context}

STAKEHOLDER CONTEXT (from policy):
{stakeholder_context}

TIMELINE CONTEXT (from policy):
{timeline_context}

REAL INDIA REFERENCE DATA (RBI Handbook of Statistics):
{dataset_context}
"""

        result = analyse_with_groq(rag_context)
        result["id"] = "sim_001"
        return result

    except Exception as e:
        return {"error": str(e)}


# ── Route: Health check ──
@app.get("/")
def root():
    return {"status": "Backend is running!"}


# ── Route: Compare Two Policies ──
@app.post("/compare")
async def compare_policies(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    try:
        bytes1 = await file1.read()
        bytes2 = await file2.read()
        text1 = extract_text(bytes1, file1.filename)
        text2 = extract_text(bytes2, file2.filename)

        # ── RAG for both policies ──
        build_rag(text1, collection_name="policy1")
        build_rag(text2, collection_name="policy2")

        context1 = retrieve_chunks("sector economy agriculture healthcare infrastructure impact", "policy1")
        context2 = retrieve_chunks("sector economy agriculture healthcare infrastructure impact", "policy2")

        # ── Fetch real RBI dataset context for comparison ──
        dataset_context = get_sector_context(["agriculture", "economy", "infrastructure", "healthcare", "education"])

        prompt = f"""
You are a government policy analyst for India.

Compare these two policy documents and return ONLY a JSON object, no extra text, no backticks:

{{
  "policy1_title": "title of first policy",
  "policy2_title": "title of second policy",
  "common_fields": ["Economy", "Agriculture", "Healthcare", "Education", "Infrastructure"],
  "comparison": {{
    "Economy": {{
      "policy1_score": 70,
      "policy2_score": 45,
      "policy1_summary": "one line about policy 1 economy impact",
      "policy2_summary": "one line about policy 2 economy impact",
      "winner": "policy1"
    }},
    "Agriculture": {{
      "policy1_score": 60,
      "policy2_score": 80,
      "policy1_summary": "one line about policy 1 agriculture impact",
      "policy2_summary": "one line about policy 2 agriculture impact",
      "winner": "policy2"
    }},
    "Healthcare": {{
      "policy1_score": 55,
      "policy2_score": 65,
      "policy1_summary": "one line summary",
      "policy2_summary": "one line summary",
      "winner": "policy2"
    }},
    "Education": {{
      "policy1_score": 75,
      "policy2_score": 50,
      "policy1_summary": "one line summary",
      "policy2_summary": "one line summary",
      "winner": "policy1"
    }},
    "Infrastructure": {{
      "policy1_score": 65,
      "policy2_score": 70,
      "policy1_summary": "one line summary",
      "policy2_summary": "one line summary",
      "winner": "policy2"
    }}
  }},
  "overall_winner": "policy1",
  "overall_winner_reason": "one line explaining why"
}}

Score rules:
- All scores 0 to 100 (higher = better for that sector)
- winner: either "policy1" or "policy2"
- overall_winner: either "policy1" or "policy2"
- Use the RBI reference data to make scores more accurate

Policy 1 (relevant excerpts):
{context1}

Policy 2 (relevant excerpts):
{context2}

REAL INDIA REFERENCE DATA (RBI):
{dataset_context}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1500,
            messages=[
                {
                    "role": "system",
                    "content": "You are a policy analyst. Always respond with valid JSON only. No markdown, no backticks, no extra text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        response_text = response.choices[0].message.content.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]

        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            raise ValueError(f"Groq returned invalid JSON. Response was: {response_text[:200]}")

    except Exception as e:
        return {"error": str(e)}