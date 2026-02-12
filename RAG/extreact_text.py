from PyPDF2 import PdfReader
import re

# -------------------------
# CONFIG
# -------------------------
PDF_PATH = "the_punjab_municipal_act_1911.pdf"
OUTPUT_PATH = "punjab_municipal_act_1911.txt"


# -------------------------
# TEXT CLEANING FUNCTION
# -------------------------
def clean_text(text):
    # Remove page numbers like "123"
    text = re.sub(r"\n\d+\n", "\n", text)

    # Remove headers/footers like "THE CONSTITUTION OF INDIA"
    text = re.sub(r"THE CONSTITUTION OF INDIA", "", text, flags=re.IGNORECASE)

    # Fix broken words across lines
    text = re.sub(r"-\n", "", text)

    # Replace multiple newlines with one
    text = re.sub(r"\n{2,}", "\n", text)

    # Replace multiple spaces with one
    text = re.sub(r"[ \t]+", " ", text)

    # Remove spaces before punctuation
    text = re.sub(r"\s+([.,;:])", r"\1", text)

    return text.strip()


# -------------------------
# PDF EXTRACTION
# -------------------------
def extract_pdf_text(pdf_path):
    reader = PdfReader(pdf_path)
    full_text = ""

    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            full_text += text + "\n"

    return full_text


# -------------------------
# MAIN
# -------------------------
if __name__ == "__main__":
    print("Extracting text from PDF...")
    raw_text = extract_pdf_text(PDF_PATH)

    print("Cleaning text...")
    cleaned_text = clean_text(raw_text)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(cleaned_text)

    print(f"Done! Clean text saved to: {OUTPUT_PATH}")
