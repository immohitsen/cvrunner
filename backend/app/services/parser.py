# pyrefly: ignore [missing-import]
import fitz  # PyMuPDF
import io

def parse_pdf_bytes(file_bytes: bytes) -> str:
    """
    Extracts raw text from a PDF file provided as bytes.
    We use bytes here so we don't have to save the uploaded file to disk first.
    It processes the file entirely in memory, which is faster and stateless.
    """
    text = ""
    try:
        # Open the PDF directly from the byte stream
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text("text") + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")
