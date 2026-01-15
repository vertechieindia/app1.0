"""
Email Service for sending emails via SMTP.
"""

import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> bool:
    """
    Send an email using SMTP.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML body of the email
        text_content: Plain text body (optional, derived from html if not provided)
    
    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        # Check if SMTP is configured
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            logger.warning("SMTP credentials not configured. Email not sent.")
            logger.info(f"[DEV MODE] Would send email to {to_email}: {subject}")
            return True  # Return True in dev mode to not block the flow
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        msg["To"] = to_email
        
        # Add plain text version
        if text_content:
            msg.attach(MIMEText(text_content, "plain"))
        
        # Add HTML version
        msg.attach(MIMEText(html_content, "html"))
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(
                settings.EMAILS_FROM_EMAIL,
                to_email,
                msg.as_string()
            )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False


async def send_password_reset_email(email: str, token: str, user_name: str = "User") -> bool:
    """
    Send password reset email with the reset link.
    
    Args:
        email: User's email address
        token: Password reset token
        user_name: User's name for personalization
    
    Returns:
        True if email sent successfully
    """
    # Get frontend URL from settings or use default
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    subject = "Reset Your VerTechie Password"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .header h1 {{
                color: #fff;
                margin: 0;
                font-size: 28px;
            }}
            .content {{
                background: #f8f9fa;
                padding: 30px;
                border: 1px solid #e9ecef;
            }}
            .button {{
                display: inline-block;
                background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                color: #fff !important;
                padding: 14px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }}
            .button:hover {{
                background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
            }}
            .footer {{
                background: #1a1a2e;
                padding: 20px;
                text-align: center;
                border-radius: 0 0 10px 10px;
                color: #94a3b8;
                font-size: 12px;
            }}
            .warning {{
                background: #fff3cd;
                border: 1px solid #ffc107;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                color: #856404;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔐 Password Reset</h1>
        </div>
        <div class="content">
            <p>Hi {user_name},</p>
            <p>We received a request to reset your password for your VerTechie account. Click the button below to set a new password:</p>
            
            <div style="text-align: center;">
                <a href="{reset_link}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                ⚠️ This link will expire in <strong>1 hour</strong>. If you didn't request this reset, please ignore this email or contact support if you have concerns.
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #0077B5; font-size: 12px;">{reset_link}</p>
            
            <p>Best regards,<br><strong>The VerTechie Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 VerTechie. All rights reserved.</p>
            <p>Built on Trust. Driven by Technology.</p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Hi {user_name},
    
    We received a request to reset your password for your VerTechie account.
    
    Click this link to reset your password:
    {reset_link}
    
    This link will expire in 1 hour.
    
    If you didn't request this reset, please ignore this email.
    
    Best regards,
    The VerTechie Team
    """
    
    return await send_email(email, subject, html_content, text_content)
