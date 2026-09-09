
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import os
import shutil

# ── Embedding model (free, runs locally) ──
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)

# ── Split text into chunks ──
def chunk_text(text: str) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,       # each chunk = ~500 chars
        chunk_overlap=50,     # overlap so context isn't lost between chunks
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.split_text(text)
    return chunks

# ── Store chunks in ChromaDB ──
def store_chunks(chunks: list[str], collection_name: str = "policy") -> Chroma:
    db_path = f"./chroma_db/{collection_name}"
    
    # Delete old data safely
    if os.path.exists(db_path):
        try:
            shutil.rmtree(db_path)
        except Exception:
            pass  # If locked, just overwrite

    vectorstore = Chroma.from_texts(
        texts=chunks,
        embedding=embeddings,
        persist_directory=db_path,
        collection_name=collection_name
    )
    return vectorstore

    vectorstore = Chroma.from_texts(
        texts=chunks,
        embedding=embeddings,
        persist_directory=db_path,
        collection_name=collection_name
    )
    return vectorstore

# ── Retrieve most relevant chunks for a query ──
def retrieve_chunks(query: str, collection_name: str = "policy", k: int = 5) -> str:
    db_path = f"./chroma_db/{collection_name}"
    vectorstore = Chroma(
        persist_directory=db_path,
        embedding_function=embeddings,
        collection_name=collection_name
    )
    results = vectorstore.similarity_search(query, k=k)
    # Join the top k chunks into one string
    return "\n\n".join([doc.page_content for doc in results])

# ── Full RAG pipeline: text → chunks → store → retrieve ──
def build_rag(text: str, collection_name: str = "policy") -> None:
    chunks = chunk_text(text)
    store_chunks(chunks, collection_name)
    print(f"✅ RAG ready: {len(chunks)} chunks stored in '{collection_name}'")