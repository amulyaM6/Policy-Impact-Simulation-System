import os
import PyPDF2
import io

DATASETS_FOLDER = "./datasets"

# ── Map filenames to their sector ──
DATASET_MAP = {
    "5T_": "economy_gdp",
    "9T_": "economy_percapita",
    "15T_": "agriculture_production",
    "17T_": "agriculture_commercial",
    "27T_": "infrastructure_industry",
}

def get_dataset_sector(filename: str) -> str:
    for prefix, sector in DATASET_MAP.items():
        if prefix in filename:
            return sector
    return "general"

# ── Extract text from a single PDF ──
def extract_pdf_text(filepath: str) -> str:
    with open(filepath, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = " ".join(page.extract_text() for page in reader.pages if page.extract_text())
    return text

# ── Load all datasets from the datasets folder ──
def load_all_datasets() -> dict:
    datasets = {}
    
    if not os.path.exists(DATASETS_FOLDER):
        print("⚠️ datasets folder not found!")
        return datasets

    for filename in os.listdir(DATASETS_FOLDER):
        if filename.endswith(".pdf"):
            filepath = os.path.join(DATASETS_FOLDER, filename)
            sector = get_dataset_sector(filename)
            print(f"📂 Loading {sector} dataset from {filename}...")
            text = extract_pdf_text(filepath)
            datasets[sector] = text
            print(f"✅ Loaded {sector} — {len(text)} characters")

    return datasets

# ── Format datasets into context string for RAG ──
def format_dataset_context(datasets: dict, query_sectors: list) -> str:
    context_parts = []

    sector_map = {
        "agriculture": ["agriculture_production", "agriculture_commercial"],
        "economy": ["economy_gdp", "economy_percapita"],
        "infrastructure": ["infrastructure_industry"],
        "healthcare": ["economy_gdp"],  # fallback
        "education": ["economy_percapita"],  # fallback
    }

    for query_sector in query_sectors:
        matched_keys = sector_map.get(query_sector.lower(), [])
        for key in matched_keys:
            if key in datasets:
                # Take first 1000 chars of each dataset as context
                context_parts.append(f"\n=== INDIA {query_sector.upper()} DATA (RBI) ===\n{datasets[key][:1000]}")

    return "\n".join(context_parts)


# ── Single function to call from main.py ──
def get_sector_context(sectors: list) -> str:
    datasets = load_all_datasets()
    if not datasets:
        return "No reference datasets available."
    return format_dataset_context(datasets, sectors)
