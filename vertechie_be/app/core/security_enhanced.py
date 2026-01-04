"""
Enhanced Security Module - OWASP Top 10 Compliance
Implements additional security measures for production readiness.
"""

import secrets
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from functools import wraps
import re

from fastapi import Request, HTTPException, status
from pydantic import BaseModel, Field, validator
import structlog

logger = structlog.get_logger()


# ============================================
# 1. SECRETS MANAGEMENT
# ============================================

class SecretsManager:
    """
    Secure secrets management.
    In production, replace with AWS Secrets Manager, HashiCorp Vault, etc.
    """
    
    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """Generate a cryptographically secure random token."""
        return secrets.token_urlsafe(length)
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate a secure API key."""
        return f"vtk_{secrets.token_urlsafe(32)}"
    
    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash an API key for storage."""
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    @staticmethod
    def verify_api_key(api_key: str, hashed_key: str) -> bool:
        """Verify an API key against its hash."""
        return hmac.compare_digest(
            hashlib.sha256(api_key.encode()).hexdigest(),
            hashed_key
        )


# ============================================
# 2. INPUT SANITIZATION
# ============================================

class InputSanitizer:
    """Sanitize and validate user inputs beyond Pydantic."""
    
    # Patterns for potential XSS/injection attacks
    DANGEROUS_PATTERNS = [
        r'<script\b[^>]*>',
        r'javascript:',
        r'on\w+\s*=',
        r'data:text/html',
        r'vbscript:',
        r'expression\s*\(',
    ]
    
    @classmethod
    def sanitize_string(cls, value: str, max_length: int = 10000) -> str:
        """Sanitize a string input."""
        if not value:
            return value
        
        # Truncate to max length
        value = value[:max_length]
        
        # Check for dangerous patterns
        for pattern in cls.DANGEROUS_PATTERNS:
            if re.search(pattern, value, re.IGNORECASE):
                logger.warning("potential_xss_detected", pattern=pattern)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid input detected"
                )
        
        return value
    
    @classmethod
    def sanitize_html(cls, value: str) -> str:
        """Remove potentially dangerous HTML tags."""
        import html
        return html.escape(value)
    
    @classmethod
    def validate_file_extension(cls, filename: str, allowed: List[str]) -> bool:
        """Validate file extension against whitelist."""
        ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
        return ext in allowed


# ============================================
# 3. SECURITY HEADERS MIDDLEWARE
# ============================================

class SecurityHeadersMiddleware:
    """Add security headers to all responses."""
    
    SECURITY_HEADERS = {
        # Prevent clickjacking
        "X-Frame-Options": "DENY",
        # Prevent MIME type sniffing
        "X-Content-Type-Options": "nosniff",
        # Enable XSS filter in browsers
        "X-XSS-Protection": "1; mode=block",
        # Control referrer information
        "Referrer-Policy": "strict-origin-when-cross-origin",
        # Permissions policy
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        # Content Security Policy (adjust as needed)
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    }
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        async def send_with_headers(message):
            if message["type"] == "http.response.start":
                headers = dict(message.get("headers", []))
                for key, value in self.SECURITY_HEADERS.items():
                    headers[key.encode()] = value.encode()
                message["headers"] = list(headers.items())
            await send(message)
        
        await self.app(scope, receive, send_with_headers)


# ============================================
# 4. BRUTE FORCE PROTECTION
# ============================================

class BruteForceProtection:
    """Track and prevent brute force login attempts."""
    
    def __init__(self):
        self.attempts: Dict[str, List[datetime]] = {}
        self.lockouts: Dict[str, datetime] = {}
        self.max_attempts = 5
        self.lockout_duration = timedelta(minutes=15)
        self.attempt_window = timedelta(minutes=5)
    
    def record_attempt(self, identifier: str, success: bool) -> None:
        """Record a login attempt."""
        now = datetime.utcnow()
        
        if success:
            # Clear attempts on successful login
            self.attempts.pop(identifier, None)
            self.lockouts.pop(identifier, None)
            return
        
        # Record failed attempt
        if identifier not in self.attempts:
            self.attempts[identifier] = []
        
        # Clean old attempts
        cutoff = now - self.attempt_window
        self.attempts[identifier] = [
            ts for ts in self.attempts[identifier] if ts > cutoff
        ]
        self.attempts[identifier].append(now)
        
        # Check for lockout
        if len(self.attempts[identifier]) >= self.max_attempts:
            self.lockouts[identifier] = now + self.lockout_duration
            logger.warning("account_locked", identifier=identifier)
    
    def is_locked(self, identifier: str) -> bool:
        """Check if an identifier is locked out."""
        if identifier not in self.lockouts:
            return False
        
        if datetime.utcnow() > self.lockouts[identifier]:
            del self.lockouts[identifier]
            return False
        
        return True
    
    def get_remaining_attempts(self, identifier: str) -> int:
        """Get remaining login attempts before lockout."""
        if identifier not in self.attempts:
            return self.max_attempts
        
        return max(0, self.max_attempts - len(self.attempts[identifier]))


# ============================================
# 5. AUDIT LOGGING
# ============================================

class AuditLogger:
    """Log security-relevant events for compliance."""
    
    @staticmethod
    def log_auth_event(
        event_type: str,
        user_id: Optional[str],
        ip_address: str,
        user_agent: str,
        success: bool,
        details: Optional[Dict] = None
    ) -> None:
        """Log authentication events."""
        logger.info(
            "auth_event",
            event_type=event_type,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent[:100] if user_agent else None,
            success=success,
            details=details,
            timestamp=datetime.utcnow().isoformat(),
        )
    
    @staticmethod
    def log_access_event(
        resource_type: str,
        resource_id: str,
        action: str,
        user_id: str,
        ip_address: str,
        success: bool
    ) -> None:
        """Log resource access events."""
        logger.info(
            "access_event",
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            user_id=user_id,
            ip_address=ip_address,
            success=success,
            timestamp=datetime.utcnow().isoformat(),
        )
    
    @staticmethod
    def log_data_change(
        resource_type: str,
        resource_id: str,
        action: str,  # create, update, delete
        user_id: str,
        changes: Optional[Dict] = None
    ) -> None:
        """Log data modification events."""
        logger.info(
            "data_change",
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            user_id=user_id,
            changes=changes,
            timestamp=datetime.utcnow().isoformat(),
        )


# ============================================
# 6. CSRF PROTECTION (for cookie-based auth)
# ============================================

class CSRFProtection:
    """CSRF token generation and validation."""
    
    @staticmethod
    def generate_token() -> str:
        """Generate a CSRF token."""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def validate_token(token: str, session_token: str) -> bool:
        """Validate a CSRF token."""
        return hmac.compare_digest(token, session_token)


# ============================================
# 7. PASSWORD STRENGTH CHECKER
# ============================================

class PasswordStrength:
    """Enhanced password strength validation."""
    
    COMMON_PASSWORDS = {
        'password', '123456', 'qwerty', 'admin', 'letmein',
        'welcome', 'monkey', 'dragon', 'master', 'login',
    }
    
    @classmethod
    def check_strength(cls, password: str) -> Dict[str, Any]:
        """Check password strength and return detailed feedback."""
        issues = []
        score = 0
        
        # Length check
        if len(password) >= 8:
            score += 1
        else:
            issues.append("Password must be at least 8 characters")
        
        if len(password) >= 12:
            score += 1
        
        if len(password) >= 16:
            score += 1
        
        # Character variety
        if re.search(r'[a-z]', password):
            score += 1
        else:
            issues.append("Add lowercase letters")
        
        if re.search(r'[A-Z]', password):
            score += 1
        else:
            issues.append("Add uppercase letters")
        
        if re.search(r'\d', password):
            score += 1
        else:
            issues.append("Add numbers")
        
        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            score += 1
        else:
            issues.append("Add special characters")
        
        # Common password check
        if password.lower() in cls.COMMON_PASSWORDS:
            score = 0
            issues.append("Password is too common")
        
        # Sequential characters
        if re.search(r'(.)\1{2,}', password):
            score -= 1
            issues.append("Avoid repeated characters")
        
        # Strength rating
        if score <= 2:
            strength = "weak"
        elif score <= 4:
            strength = "fair"
        elif score <= 6:
            strength = "good"
        else:
            strength = "strong"
        
        return {
            "score": max(0, score),
            "strength": strength,
            "issues": issues,
            "is_valid": score >= 4 and len(issues) == 0,
        }


# ============================================
# 8. IP BLOCKING
# ============================================

class IPBlocker:
    """Block malicious IP addresses."""
    
    def __init__(self):
        self.blocked_ips: Dict[str, datetime] = {}
        self.suspicious_activity: Dict[str, int] = {}
        self.threshold = 100  # Suspicious requests before auto-block
        self.block_duration = timedelta(hours=24)
    
    def block_ip(self, ip: str, duration: Optional[timedelta] = None) -> None:
        """Block an IP address."""
        self.blocked_ips[ip] = datetime.utcnow() + (duration or self.block_duration)
        logger.warning("ip_blocked", ip=ip)
    
    def unblock_ip(self, ip: str) -> None:
        """Unblock an IP address."""
        self.blocked_ips.pop(ip, None)
        self.suspicious_activity.pop(ip, None)
    
    def is_blocked(self, ip: str) -> bool:
        """Check if an IP is blocked."""
        if ip not in self.blocked_ips:
            return False
        
        if datetime.utcnow() > self.blocked_ips[ip]:
            del self.blocked_ips[ip]
            return False
        
        return True
    
    def record_suspicious(self, ip: str) -> None:
        """Record suspicious activity from an IP."""
        self.suspicious_activity[ip] = self.suspicious_activity.get(ip, 0) + 1
        
        if self.suspicious_activity[ip] >= self.threshold:
            self.block_ip(ip)


# ============================================
# 9. SENSITIVE DATA MASKING
# ============================================

class DataMasker:
    """Mask sensitive data in logs and responses."""
    
    @staticmethod
    def mask_email(email: str) -> str:
        """Mask email address."""
        if '@' not in email:
            return '***'
        local, domain = email.split('@')
        if len(local) <= 2:
            return f"**@{domain}"
        return f"{local[0]}***{local[-1]}@{domain}"
    
    @staticmethod
    def mask_phone(phone: str) -> str:
        """Mask phone number."""
        if len(phone) <= 4:
            return '****'
        return f"***{phone[-4:]}"
    
    @staticmethod
    def mask_card(card_number: str) -> str:
        """Mask credit card number."""
        digits = re.sub(r'\D', '', card_number)
        if len(digits) <= 4:
            return '****'
        return f"****-****-****-{digits[-4:]}"
    
    @staticmethod
    def mask_ssn(ssn: str) -> str:
        """Mask SSN."""
        digits = re.sub(r'\D', '', ssn)
        if len(digits) <= 4:
            return '****'
        return f"***-**-{digits[-4:]}"


# ============================================
# 10. REQUEST SIGNATURE VALIDATION
# ============================================

class RequestSigner:
    """Sign and validate API requests for integrity."""
    
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
    
    def sign_request(self, method: str, path: str, timestamp: str, body: str = "") -> str:
        """Generate request signature."""
        message = f"{method}|{path}|{timestamp}|{body}"
        signature = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def validate_signature(
        self,
        signature: str,
        method: str,
        path: str,
        timestamp: str,
        body: str = "",
        max_age: int = 300  # 5 minutes
    ) -> bool:
        """Validate a request signature."""
        # Check timestamp age
        try:
            ts = datetime.fromisoformat(timestamp)
            age = (datetime.utcnow() - ts).total_seconds()
            if age > max_age:
                return False
        except ValueError:
            return False
        
        # Validate signature
        expected = self.sign_request(method, path, timestamp, body)
        return hmac.compare_digest(signature, expected)


# Singleton instances
brute_force_protection = BruteForceProtection()
ip_blocker = IPBlocker()
audit_logger = AuditLogger()
secrets_manager = SecretsManager()
input_sanitizer = InputSanitizer()
data_masker = DataMasker()

