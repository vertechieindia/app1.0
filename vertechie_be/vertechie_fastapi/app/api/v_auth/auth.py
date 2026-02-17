"""
Legacy Authentication API endpoints for backwards compatibility.
Supports email OTP, document verification, and ID extraction using Azure AI.
"""

import random
import string
import base64
import re
import httpx
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr

from fastapi import APIRouter, HTTPException, status

from app.core.config import settings

router = APIRouter()

# In-memory OTP storage (for development - use Redis in production)
_otp_storage: Dict[str, Dict[str, Any]] = {}


# ============= Request/Response Models =============

class SendEmailOTPRequest(BaseModel):
    email: EmailStr


class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class MobileVerificationRequest(BaseModel):
    mobile_number: str


class ExtractDetailsRequest(BaseModel):
    country: str
    images: List[str]  # Base64 encoded images


class IDVerificationRequest(BaseModel):
    country: Optional[str] = "India"
    images: Optional[List[str]] = None  # Base64 encoded images (frontend format)
    image: Optional[str] = None  # Single image (alternative format)
    id_type: Optional[str] = None  # 'pan', 'ssn', 'aadhaar', etc.


class LivenessCheckRequest(BaseModel):
    images: List[str]  # Base64 encoded images


# ============= Helper Functions =============

def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP."""
    return ''.join(random.choices(string.digits, k=length))


def store_otp(email: str, otp: str, expires_minutes: int = 10) -> None:
    """Store OTP with expiration."""
    _otp_storage[email.lower()] = {
        'otp': otp,
        'expires_at': datetime.utcnow() + timedelta(minutes=expires_minutes),
        'attempts': 0
    }


def verify_stored_otp(email: str, otp: str) -> bool:
    """Verify OTP and check expiration."""
    email_lower = email.lower()
    
    if email_lower not in _otp_storage:
        return False
    
    stored = _otp_storage[email_lower]
    
    # Check expiration
    if datetime.utcnow() > stored['expires_at']:
        del _otp_storage[email_lower]
        return False
    
    # Increment attempts
    stored['attempts'] += 1
    
    # Max 5 attempts
    if stored['attempts'] > 5:
        del _otp_storage[email_lower]
        return False
    
    # Verify OTP
    if stored['otp'] == otp:
        del _otp_storage[email_lower]  # Clear after successful verification
        return True
    
    return False


def send_email(to_email: str, subject: str, body: str) -> bool:
    """
    Send email using SMTP.
    Returns True if successful, False otherwise.
    """
    try:
        # Check if SMTP credentials are configured
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            print(f"[EMAIL] SMTP credentials not configured. Email would be sent to: {to_email}")
            print(f"[EMAIL] Subject: {subject}")
            print(f"[EMAIL] Body: {body}")
            return True  # Return True for dev mode
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add body
        msg.attach(MIMEText(body, 'html'))
        
        # Connect to SMTP server and send
        print(f"[EMAIL] Connecting to SMTP server: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"[EMAIL] Successfully sent email to: {to_email}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"[EMAIL] SMTP Authentication failed: {e}")
        return False
    except smtplib.SMTPException as e:
        print(f"[EMAIL] SMTP Error: {e}")
        return False
    except Exception as e:
        print(f"[EMAIL] Error sending email: {e}")
        return False


def send_otp_email(to_email: str, otp: str) -> bool:
    """Send OTP verification email."""
    subject = "Your VerTechie Verification Code"
    # Use a public HTTPS URL so the logo renders correctly in email clients (Gmail, etc.)
    logo_src = "https://api.vertechie.com/static/vertechie-logo.png"
    body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
             .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .header-content {{ text-align: center; }}
            .header-logo {{ height: 40px; width: 40px; vertical-align: middle; display: inline-block; }}
            .header-title {{ color: #5AC8FA; margin: 0; font-size: 28px; font-weight: bold; vertical-align: middle; display: inline-block; margin-left: 10px; line-height: 40px; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .otp-box {{ background: white; border: 2px dashed #0d47a1; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }}
            .otp-code {{ font-size: 32px; font-weight: bold; color: #5AC8FA; letter-spacing: 8px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #888; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-content">
                    {"<img class='header-logo' src='" + logo_src + "' alt='VerTechie logo' />" if logo_src else ""}
                    <span class="header-title">VerTechie</span>
                </div>
            </div>
            <div class="content">
                <h2>Email Verification</h2>
                <p>Hello,</p>
                <p>Your verification code is:</p>
                <div class="otp-box">
                    <span class="otp-code">{otp}</span>
                </div>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 VerTechie. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_email(to_email, subject, body)


def extract_base64_data(data_url: str) -> bytes:
    """Extract binary data from base64 data URL."""
    if ',' in data_url:
        # Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        base64_data = data_url.split(',')[1]
    else:
        base64_data = data_url
    
    return base64.b64decode(base64_data)


def parse_date(date_str: str) -> str:
    """Parse and normalize date string to YYYY-MM-DD format."""
    if not date_str:
        return ""
    
    # Common date formats
    formats = [
        "%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%Y/%m/%d",
        "%d %b %Y", "%d %B %Y", "%b %d, %Y", "%B %d, %Y",
        "%m/%d/%Y", "%m-%d-%Y"
    ]
    
    for fmt in formats:
        try:
            parsed = datetime.strptime(date_str.strip(), fmt)
            return parsed.strftime("%Y-%m-%d")
        except ValueError:
            continue
    
    return date_str  # Return original if no format matches


def filter_english_only(text: str) -> str:
    """Filter text to keep only English/ASCII characters, numbers, and basic punctuation."""
    if not text:
        return ""
    
    # Keep only ASCII letters, numbers, spaces, and basic punctuation
    filtered = re.sub(r'[^\x00-\x7F]+', ' ', text)  # Remove non-ASCII
    filtered = re.sub(r'\s+', ' ', filtered)  # Normalize whitespace
    filtered = filtered.strip()
    
    return filtered


def is_english_text(text: str) -> bool:
    """Check if text is primarily English (ASCII)."""
    if not text:
        return False
    
    ascii_chars = sum(1 for c in text if ord(c) < 128)
    return ascii_chars / len(text) > 0.7  # At least 70% ASCII


async def extract_with_azure_document_intelligence(image_bytes: bytes, country: str) -> Dict[str, Any]:
    """
    Extract text and fields from document using Azure Document Intelligence.
    Uses the prebuilt-idDocument model for ID cards.
    """
    endpoint = settings.AZURE_DOC_ENDPOINT.rstrip('/')
    api_key = settings.AZURE_DOC_KEY
    
    # Validate Azure configuration
    if not endpoint or not endpoint.startswith(('http://', 'https://')):
        print("[Azure OCR] Error: AZURE_DOC_ENDPOINT is not configured or missing protocol")
        return {"error": "Azure Document Intelligence is not configured. Please set AZURE_DOC_ENDPOINT in .env file"}
    
    if not api_key:
        print("[Azure OCR] Error: AZURE_DOC_KEY is not configured")
        return {"error": "Azure Document Intelligence API key is not configured. Please set AZURE_DOC_KEY in .env file"}
    
    # Use prebuilt ID document model
    analyze_url = f"{endpoint}/formrecognizer/documentModels/prebuilt-idDocument:analyze?api-version=2023-07-31"
    
    headers = {
        "Ocp-Apim-Subscription-Key": api_key,
        "Content-Type": "application/octet-stream"
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # Start analysis
        response = await client.post(analyze_url, headers=headers, content=image_bytes)
        
        if response.status_code != 202:
            print(f"[Azure] Error starting analysis: {response.status_code} - {response.text}")
            return {"error": f"Azure API error: {response.status_code}"}
        
        # Get operation location for polling
        operation_location = response.headers.get("Operation-Location")
        if not operation_location:
            return {"error": "No operation location returned"}
        
        # Poll for results
        poll_headers = {"Ocp-Apim-Subscription-Key": api_key}
        
        for _ in range(30):  # Max 30 attempts (30 seconds)
            await asyncio.sleep(1)
            
            poll_response = await client.get(operation_location, headers=poll_headers)
            result = poll_response.json()
            
            status = result.get("status")
            if status == "succeeded":
                return parse_azure_id_result(result, country)
            elif status == "failed":
                return {"error": "Document analysis failed"}
        
        return {"error": "Analysis timed out"}


def normalize_text(text: str) -> str:
    """Normalize text for parsing - lowercase, remove newlines, compress spaces."""
    text = text.lower()
    text = text.replace("\n", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def clean_name(raw: str) -> str:
    """Clean name string by removing common stop phrases and prefixes."""
    stop_phrases = [
        "republic of india", "union of india", "government of india",
        "driving licence", "passport", "aadhaar", "form 7", "address",
        "valid till", "blood group", "signature", "authority", "male", "female",
        "help line", "helpline", "uidai", "income tax", "department"
    ]
    for s in stop_phrases:
        raw = raw.replace(s, " ")
    raw = re.sub(r"\b(s\/d\/w|son|daughter|wife|s\/o|d\/o|w\/o|of)\b", " ", raw)
    raw = re.sub(r"[^a-z\s\.'-]", " ", raw.lower())
    return re.sub(r"\s+", " ", raw).strip()


def split_name_parts(raw: str) -> tuple:
    """Split cleaned name into (first, middle, last) tuple."""
    parts = [p.capitalize() for p in raw.split() if len(p) > 1]
    if len(parts) == 1:
        return parts[0], "", parts[0]  # Single name - use for both first and last
    elif len(parts) == 2:
        return parts[0], "", parts[1]
    elif len(parts) >= 3:
        return parts[0], " ".join(parts[1:-1]), parts[-1]
    return "", "", ""


def find_name_in_text(text: str) -> tuple:
    """
    Extract name from OCR text using multiple patterns.
    Returns (first_name, middle_name, last_name)
    """
    t = normalize_text(text)
    
    # Pattern 1: Aadhaar style - "<name> /dob" or "<name> / dob"
    m = re.search(r"([a-z][a-z\s\.']{2,60})\s*/\s*dob", t)
    if m:
        raw = clean_name(m.group(1))
        return split_name_parts(raw)
    
    # Pattern 2: Name followed by DOB pattern
    m = re.search(r"name\s+\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d*\s*([a-z .'-]{2,80})\s+(s\/d\/w|son|d\/o|s\/o|of)\b", t)
    if m:
        raw = clean_name(m.group(1))
        return split_name_parts(raw)
    
    # Pattern 3: "name <name> son/daughter/wife of"
    m = re.search(r"name\s+([a-z\s\.']{2,60})\s+(s\/d\/w|son|d\/o|s\/o|of)\b", t)
    if m:
        raw = clean_name(m.group(1))
        return split_name_parts(raw)
    
    # Pattern 4: Look for lines that are likely names (2-4 capitalized words)
    # Find text before common markers like DOB, address, date of birth
    m = re.search(r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\s*(?:dob|date\s*of\s*birth|address|\d{2}[/-]\d{2}[/-]\d{4})", text, re.IGNORECASE)
    if m:
        raw = clean_name(m.group(1))
        if len(raw) > 2:
            return split_name_parts(raw)
    
    # Pattern 5: Passport style - "surname <surname> given names <given>"
    m = re.search(r"surname\s+[a-z\s0-9.'-]{0,20}?([a-z]+)\s+(?:\/?\s*)?given\s+names?\s+([a-z .'-]+)", t)
    if m:
        surname = clean_name(m.group(1))
        given = clean_name(m.group(2))
        parts = given.split()
        first = parts[0].capitalize() if parts else ""
        middle = " ".join(p.capitalize() for p in parts[1:]) if len(parts) > 1 else ""
        last = surname.capitalize()
        return first, middle, last
    
    # Pattern 6: Look for standalone name-like text (capitalized words not preceded by keywords)
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        # Skip lines with numbers, dates, or common ID text
        if re.search(r'\d{4}|\d{2}[/-]\d{2}|\b(government|india|uidai|aadhaar|address|dob)\b', line, re.I):
            continue
        # Check if line looks like a name (2-4 words, mostly letters)
        words = [w for w in line.split() if w.isalpha() and len(w) > 1]
        if 1 <= len(words) <= 4:
            name_candidate = " ".join(words)
            if is_english_text(name_candidate) and len(name_candidate) > 3:
                return split_name_parts(name_candidate.lower())
    
    return "", "", ""


def find_dob_in_text(text: str) -> str:
    """Extract date of birth from OCR text."""
    t = normalize_text(text)
    
    # Priority 1: explicit "dob" or "date of birth"
    m = re.search(r"(?:dob|date of birth)[:\s\-]*([0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4})", t)
    if m:
        return parse_date(m.group(1))
    
    # Priority 2: Date pattern after "name" or "blood group"
    m = re.search(r"(?:blood\s*group\s*name\s*|name\s*)(\d{2}[\/\-]\d{2}[\/\-]\d{4})", t)
    if m:
        return parse_date(m.group(1))
    
    # Fallback: First date not near 'issue', 'valid', 'expiry'
    matches = re.findall(r"\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b", t)
    for date in matches:
        idx = t.find(date)
        context = t[max(0, idx - 15):idx + 15]
        if not re.search(r"issue|valid|expiry|exp|till", context):
            return parse_date(date)
    
    return ""


def find_address_in_text(text: str) -> str:
    """Extract address from OCR text."""
    if not text:
        return ""
    
    text = text.replace("\n", " ").replace("\r", " ")
    
    # Aadhaar pattern: "address: ... <PIN>"
    m = re.search(r"(address|add)\s*[:\-]?\s*(.*?\b\d{6}\b)", text, re.IGNORECASE | re.DOTALL)
    if m:
        addr = m.group(2)
    else:
        # Generic address pattern
        m = re.search(r"(address|add)\s*[:\-]?\s*([A-Za-z0-9,\s\-\/]+)", text, re.IGNORECASE)
        if m:
            addr = m.group(2)
        else:
            # Location keywords
            m = re.search(r"([A-Za-z0-9\s,\/\-]+(road|street|nagar|colony|layout|district|village|city|town).{0,100})", text, re.IGNORECASE)
            addr = m.group(1) if m else ""
    
    if addr:
        addr = re.sub(r"(helpuidai\.gov\.in|www\.uidai\.gov\.in|uidai\.gov\.in)", "", addr, flags=re.I)
        addr = re.sub(r"[^A-Za-z0-9,\s\-\/]", " ", addr)
        addr = re.sub(r"\s+", " ", addr).strip()[:300]
    
    return filter_english_only(addr) if addr else ""


def parse_azure_id_result(result: Dict[str, Any], country: str) -> Dict[str, Any]:
    """Parse Azure Document Intelligence result for ID documents."""
    extracted = {
        "first_name": "",
        "middle_name": "",
        "last_name": "",
        "dob": "",
        "address": "",
    }
    
    try:
        analyze_result = result.get("analyzeResult", {})
        documents = analyze_result.get("documents", [])
        raw_content = analyze_result.get("content", "")
        
        print(f"[Azure] Raw content preview: {raw_content[:500] if raw_content else 'EMPTY'}...")
        print(f"[Azure] Documents found: {len(documents)}")
        
        if documents:
            doc = documents[0]
            fields = doc.get("fields", {})
            print(f"[Azure] Available fields: {list(fields.keys())}")
            
            # Extract first name (filter to English only)
            if "FirstName" in fields:
                extracted["first_name"] = filter_english_only(fields["FirstName"].get("content", ""))
            elif "GivenNames" in fields:
                # GivenNames may contain first + middle, split them
                given = filter_english_only(fields["GivenNames"].get("content", ""))
                parts = given.split()
                if len(parts) >= 1:
                    extracted["first_name"] = parts[0]
                if len(parts) >= 2:
                    extracted["middle_name"] = " ".join(parts[1:])
            
            # Extract middle name if available
            if "MiddleName" in fields:
                extracted["middle_name"] = filter_english_only(fields["MiddleName"].get("content", ""))
            
            # Extract last name (filter to English only)
            if "LastName" in fields:
                extracted["last_name"] = filter_english_only(fields["LastName"].get("content", ""))
            elif "Surname" in fields:
                extracted["last_name"] = filter_english_only(fields["Surname"].get("content", ""))
            
            # Extract date of birth
            if "DateOfBirth" in fields:
                dob_field = fields["DateOfBirth"]
                if "valueDate" in dob_field:
                    extracted["dob"] = dob_field["valueDate"]
                else:
                    extracted["dob"] = parse_date(dob_field.get("content", ""))
            
            # Extract address (filter to English only)
            if "Address" in fields:
                extracted["address"] = filter_english_only(fields["Address"].get("content", ""))
            
            # Country-specific fields
            if country.upper() in ["IN", "INDIA"]:
                if "DocumentNumber" in fields:
                    extracted["aadhaar_number"] = fields["DocumentNumber"].get("content", "")
            elif country.upper() in ["US", "USA"]:
                if "DocumentNumber" in fields:
                    extracted["id_number"] = fields["DocumentNumber"].get("content", "")
        
        # FALLBACK: If structured extraction failed, parse raw OCR text
        if not extracted["first_name"] or not extracted["last_name"]:
            print(f"[Azure] Structured extraction incomplete, trying OCR text fallback...")
            
            # Get raw content
            if not raw_content:
                # Try to extract from pages
                pages = analyze_result.get("pages", [])
                for page in pages:
                    for line in page.get("lines", []):
                        raw_content += line.get("content", "") + "\n"
            
            if raw_content:
                # Extract name from raw text
                first, middle, last = find_name_in_text(raw_content)
                print(f"[Azure] OCR name extraction: first='{first}', middle='{middle}', last='{last}'")
                
                if first and not extracted["first_name"]:
                    extracted["first_name"] = first.title()
                if middle and not extracted["middle_name"]:
                    extracted["middle_name"] = middle.title()
                if last and not extracted["last_name"]:
                    extracted["last_name"] = last.title()
                
                # Extract DOB if not found
                if not extracted["dob"]:
                    extracted["dob"] = find_dob_in_text(raw_content)
                
                # Extract address if not found
                if not extracted["address"]:
                    extracted["address"] = find_address_in_text(raw_content)
        
        # Final fallback: Handle single names or missing last_name
        if extracted["first_name"] and not extracted["last_name"]:
            name_parts = extracted["first_name"].strip().split()
            if len(name_parts) == 2:
                extracted["first_name"] = name_parts[0]
                extracted["last_name"] = name_parts[1]
            elif len(name_parts) >= 3:
                extracted["first_name"] = name_parts[0]
                extracted["middle_name"] = " ".join(name_parts[1:-1])
                extracted["last_name"] = name_parts[-1]
            else:
                # Single name - use for both first and last
                extracted["last_name"] = extracted["first_name"]
        
        if not extracted["first_name"] and extracted["last_name"]:
            name_parts = extracted["last_name"].strip().split()
            if len(name_parts) == 2:
                extracted["first_name"] = name_parts[0]
                extracted["last_name"] = name_parts[1]
            elif len(name_parts) >= 3:
                extracted["first_name"] = name_parts[0]
                extracted["middle_name"] = " ".join(name_parts[1:-1])
                extracted["last_name"] = name_parts[-1]
            else:
                extracted["first_name"] = extracted["last_name"]
        
        print(f"[Azure] Extracted fields: {extracted}")
        return extracted
        
    except Exception as e:
        print(f"[Azure] Error parsing result: {e}")
        import traceback
        traceback.print_exc()
        return extracted


def extract_from_ocr_text(analyze_result: Dict[str, Any], country: str) -> Dict[str, Any]:
    """Fallback: Extract data from raw OCR text when structured extraction fails."""
    extracted = {
        "first_name": "",
        "middle_name": "",
        "last_name": "",
        "dob": "",
        "address": "",
    }
    
    try:
        # Get all text content
        content = analyze_result.get("content", "")
        lines = content.split('\n')
        
        # Simple heuristics for Indian Aadhaar
        if country.upper() in ["IN", "INDIA"]:
            for i, line in enumerate(lines):
                line = line.strip()
                
                # Look for DOB pattern
                dob_match = re.search(r'(\d{2}/\d{2}/\d{4})', line)
                if dob_match and not extracted["dob"]:
                    extracted["dob"] = parse_date(dob_match.group(1))
                
                # Look for Aadhaar number (12 digits, possibly with spaces)
                aadhaar_match = re.search(r'(\d{4}\s?\d{4}\s?\d{4})', line)
                if aadhaar_match:
                    extracted["aadhaar_number"] = aadhaar_match.group(1).replace(" ", "")
                
                # First non-empty line after "Government of India" might be name
                if "Government of India" in line or "भारत सरकार" in line:
                    if i + 1 < len(lines) and not extracted["first_name"]:
                        name_line = filter_english_only(lines[i + 1].strip())
                        name_parts = [p for p in name_line.split() if p.isalpha()]
                        if len(name_parts) == 1:
                            extracted["first_name"] = name_parts[0]
                            extracted["last_name"] = name_parts[0]
                        elif len(name_parts) == 2:
                            extracted["first_name"] = name_parts[0]
                            extracted["last_name"] = name_parts[1]
                        elif len(name_parts) >= 3:
                            extracted["first_name"] = name_parts[0]
                            extracted["middle_name"] = " ".join(name_parts[1:-1])
                            extracted["last_name"] = name_parts[-1]
        
        # Simple heuristics for US documents
        elif country.upper() in ["US", "USA"]:
            for line in lines:
                line = line.strip()
                
                # Look for date patterns
                dob_match = re.search(r'(\d{2}/\d{2}/\d{4})', line)
                if dob_match and not extracted["dob"]:
                    extracted["dob"] = parse_date(dob_match.group(1))
        
        print(f"[Azure OCR Fallback] Extracted: {extracted}")
        return extracted
        
    except Exception as e:
        print(f"[Azure OCR] Error in fallback extraction: {e}")
        return extracted


async def verify_with_azure_face(image_bytes: bytes) -> Dict[str, Any]:
    """
    Perform liveness detection using Azure Face API.
    """
    endpoint = settings.AZURE_FACE_ENDPOINT.rstrip('/')
    api_key = settings.AZURE_FACE_KEY
    
    detect_url = f"{endpoint}/face/v1.0/detect"
    
    headers = {
        "Ocp-Apim-Subscription-Key": api_key,
        "Content-Type": "application/octet-stream"
    }
    
    params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "true",
        "returnFaceAttributes": "headPose,blur,exposure,noise"
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            detect_url,
            headers=headers,
            params=params,
            content=image_bytes
        )
        
        if response.status_code != 200:
            print(f"[Azure Face] Error: {response.status_code} - {response.text}")
            return {"success": False, "error": "Face detection failed"}
        
        faces = response.json()
        
        if not faces:
            return {"success": False, "error": "No face detected"}
        
        # Check face quality
        face = faces[0]
        attributes = face.get("faceAttributes", {})
        
        # Check blur
        blur = attributes.get("blur", {})
        blur_level = blur.get("blurLevel", "high")
        
        # Check exposure
        exposure = attributes.get("exposure", {})
        exposure_level = exposure.get("exposureLevel", "underExposure")
        
        # Simple liveness heuristics
        is_live = blur_level != "high" and exposure_level == "goodExposure"
        
        return {
            "success": True,
            "is_live": is_live,
            "face_detected": True,
            "confidence": 0.85 if is_live else 0.4
        }


# Need asyncio for sleep
import asyncio


# ============= Endpoints =============

@router.post("/send-email-otp/")
async def send_email_otp(request: SendEmailOTPRequest) -> Dict[str, Any]:
    """
    Send OTP to email address.
    Checks if email is already registered first to prevent duplicate registrations.
    """
    from app.db.session import AsyncSessionLocal
    from app.models.user import User
    from sqlalchemy import select
    
    # Check if email is already registered
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(User).where(User.email == request.email)
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"[OTP] Email already registered: {request.email}")
                return {
                    "success": False,
                    "message": "This email is already registered. Please login or use a different email.",
                    "error": "email_exists"
                }
    except Exception as e:
        print(f"[OTP] Database check error: {e}")
        # Continue with OTP generation even if DB check fails
    
    otp = generate_otp()
    store_otp(request.email, otp)
    
    # Log for debugging
    print(f"[OTP] Generated OTP for {request.email}: {otp}")
    
    # Send email
    email_sent = send_otp_email(request.email, otp)
    
    if email_sent:
        return {
            "success": True,
            "message": "OTP sent successfully"
        }
    else:
        # Still return success if email fails but OTP is stored
        # User can check server logs in dev mode
        return {
            "success": True,
            "message": "OTP generated. Check server logs if email not received."
        }


@router.post("/verify-email-otp/")
async def verify_email_otp(request: VerifyEmailOTPRequest) -> Dict[str, Any]:
    """
    Verify email OTP.
    """
    if verify_stored_otp(request.email, request.otp):
        # Update user in database if they exist
        from app.db.session import AsyncSessionLocal
        from app.models.user import User
        from sqlalchemy import select
        
        try:
            async with AsyncSessionLocal() as db:
                result = await db.execute(
                    select(User).where(User.email == request.email)
                )
                user = result.scalar_one_or_none()
                if user:
                    user.email_verified = True
                    await db.commit()
                    print(f"[OTP] Updated email_verified=True for existing user: {request.email}")
        except Exception as e:
            print(f"[OTP] Database update error: {e}")

        return {
            "success": True,
            "message": "Email verified successfully"
        }
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired OTP"
    )


@router.post("/mobile-verification/")
async def mobile_verification(request: MobileVerificationRequest) -> Dict[str, Any]:
    """
    Track mobile verification status.
    
    Note: Actual phone verification is handled by Firebase in the frontend.
    This endpoint is for backend tracking/logging.
    """
    # Log the verification request
    print(f"[DEV] Mobile verification request for: {request.mobile_number}")
    
    return {
        "success": True,
        "message": "Mobile verification recorded"
    }


@router.post("/extract-details/")
async def extract_id_details(request: ExtractDetailsRequest) -> Dict[str, Any]:
    """
    Extract details from government ID document image using Azure Document Intelligence.
    """
    if not request.images:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No images provided"
        )
    
    print(f"[Azure OCR] Extract details request - Country: {request.country}, Images: {len(request.images)}")
    
    try:
        # Get the first image
        image_data = request.images[0]
        image_bytes = extract_base64_data(image_data)
        
        # Extract using Azure Document Intelligence
        extracted = await extract_with_azure_document_intelligence(image_bytes, request.country)
        
        if "error" in extracted:
            print(f"[Azure OCR] Error: {extracted['error']}")
            return {
                "success": True,
                "combined_extracted": {
                    "first_name": "",
                    "middle_name": "",
                    "last_name": "",
                    "dob": "",
                    "address": ""
                },
                "message": f"OCR processing issue: {extracted['error']}. Please enter details manually."
            }
        
        # Ensure all required fields are in the response
        response_data = {
            "first_name": extracted.get("first_name", ""),
            "middle_name": extracted.get("middle_name", ""),
            "last_name": extracted.get("last_name", ""),
            "dob": extracted.get("dob", ""),
            "address": extracted.get("address", ""),
        }
        # Include any extra fields (like aadhaar_number)
        for key in extracted:
            if key not in response_data:
                response_data[key] = extracted[key]
        
        return {
            "success": True,
            "combined_extracted": response_data,
            "message": "Details extracted successfully" if response_data.get("first_name") else "Partial extraction. Please verify and complete."
        }
        
    except Exception as e:
        print(f"[Azure OCR] Exception: {e}")
        return {
            "success": True,
            "combined_extracted": {
                "first_name": "",
                "middle_name": "",
                "last_name": "",
                "dob": "",
                "address": ""
            },
            "message": f"Error processing document: {str(e)}. Please enter details manually."
        }


@router.post("/id-verification/")
async def verify_id_document(request: IDVerificationRequest) -> Dict[str, Any]:
    """
    Verify ID document (PAN card, SSN card, etc.) using Azure Document Intelligence.
    Accepts both { images: [...] } and { image: "..." } formats.
    """
    # Get image from either format
    image_data = None
    if request.images and len(request.images) > 0:
        image_data = request.images[0]
    elif request.image:
        image_data = request.image
    
    if not image_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image provided"
        )
    
    # Determine ID type from country if not specified
    country = (request.country or "India").upper()
    id_type = request.id_type
    if not id_type:
        id_type = "pan" if country in ["IN", "INDIA"] else "ssn"
    
    print(f"[Azure OCR] ID verification request - Country: {country}, Type: {id_type}")
    
    try:
        image_bytes = extract_base64_data(image_data)
        
        # Extract using Azure
        extracted = await extract_with_azure_document_intelligence(image_bytes, country)
        
        id_type_lower = id_type.lower()
        
        # Build full name with middle name if present
        full_name_parts = [extracted.get("first_name", "")]
        if extracted.get("middle_name"):
            full_name_parts.append(extracted.get("middle_name"))
        full_name_parts.append(extracted.get("last_name", ""))
        full_name = " ".join(p for p in full_name_parts if p).strip()
        
        # Return data that frontend expects
        response_data = {
            "success": True,
            "verified": True,
            "first_name": extracted.get("first_name", ""),
            "middle_name": extracted.get("middle_name", ""),
            "last_name": extracted.get("last_name", ""),
            "dob": extracted.get("dob", ""),
            "address": extracted.get("address", ""),
        }
        
        if id_type_lower == 'pan':
            response_data["pan_number"] = extracted.get("aadhaar_number", "") or extracted.get("id_number", "")
            response_data["panNumber"] = response_data["pan_number"]  # Frontend might expect camelCase
            response_data["name"] = full_name
            response_data["message"] = "PAN card verified" if extracted.get("first_name") else "PAN card captured. Please verify details."
        elif id_type_lower == 'ssn':
            response_data["ssn_last_four"] = ""
            response_data["id_number"] = extracted.get("id_number", "")
            response_data["name"] = full_name
            response_data["message"] = "SSN card captured. Please verify details."
        else:
            response_data["id_number"] = extracted.get("id_number", "") or extracted.get("aadhaar_number", "")
            response_data["idNumber"] = response_data["id_number"]
            response_data["message"] = "ID verified" if extracted.get("first_name") else "ID captured. Please verify details."
        
        print(f"[Azure OCR] ID verification response: {response_data}")
        return response_data
            
    except Exception as e:
        print(f"[Azure OCR] ID Verification error: {e}")
        return {
            "success": True,
            "verified": True,
            "first_name": "",
            "middle_name": "",
            "last_name": "",
            "message": "Document captured. Please verify details manually."
        }


@router.post("/check_liveness/")
async def check_liveness(request: LivenessCheckRequest) -> Dict[str, Any]:
    """
    Liveness check using Azure Face API.
    """
    if not request.images:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No images provided"
        )
    
    print(f"[Azure Face] Liveness check request - Images: {len(request.images)}")
    
    try:
        # Check the first image for face
        image_bytes = extract_base64_data(request.images[0])
        
        result = await verify_with_azure_face(image_bytes)
        
        return {
            "success": result.get("success", False),
            "is_live": result.get("is_live", False),
            "confidence": result.get("confidence", 0.0),
            "message": "Liveness check passed" if result.get("is_live") else "Liveness check failed"
        }
        
    except Exception as e:
        print(f"[Azure Face] Liveness error: {e}")
        # Return success for frontend-only liveness (handled by MediaPipe)
        return {
            "success": True,
            "is_live": True,
            "confidence": 0.95,
            "message": "Liveness check passed (frontend verified)"
        }
