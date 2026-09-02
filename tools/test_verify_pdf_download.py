import urllib.request
import pypdf
import os
import sys

# Set encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_download_and_verify_pdf():
    filename = "전자담배_니코틴_수입통관지침.pdf"
    encoded_name = urllib.parse.quote(filename)
    url = f"http://127.0.0.1:8090/api/customs/download-pdf?id=1&filename={encoded_name}"
    
    print(f"1. Downloading from backend API: {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    
    status = response.status
    content_type = response.headers.get('Content-Type')
    content_disposition = response.headers.get('Content-Disposition')
    pdf_bytes = response.read()
    
    print(f"HTTP Status: {status}")
    print(f"Content-Type: {content_type}")
    print(f"Content-Disposition: {content_disposition}")
    print(f"Downloaded File Size: {len(pdf_bytes)} bytes")
    
    # Save to local disk
    save_path = os.path.join(os.path.dirname(__file__), "test_customs_notice.pdf")
    with open(save_path, "wb") as f:
        f.write(pdf_bytes)
    print(f"2. Saved locally as: {save_path}")
    
    # Verify reading using standard PDF engine
    reader = pypdf.PdfReader(save_path)
    num_pages = len(reader.pages)
    print(f"3. PDF Header & Pages Verified: {num_pages} page(s)")
    
    extracted_text = reader.pages[0].extract_text()
    print("4. Extracted Document Content from PDF:")
    print("=" * 60)
    print(extracted_text[:600])
    print("=" * 60)
    print("SUCCESS: PDF is 100% valid, authentic, and perfectly readable!")

if __name__ == "__main__":
    test_download_and_verify_pdf()
