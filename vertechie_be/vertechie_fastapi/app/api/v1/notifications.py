"""
Notifications API - Email and push notifications
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


# ============= Schemas =============

class EmailNotificationRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str
    template_type: str = "general"
    metadata: Optional[Dict[str, Any]] = None


class EmailNotificationResponse(BaseModel):
    success: bool
    message: str
    notification_id: Optional[str] = None


# ============= Email Service =============

def send_email_smtp(to: str, subject: str, body: str) -> bool:
    """Send email using SMTP."""
    try:
        # Get SMTP settings from environment
        smtp_host = getattr(settings, 'SMTP_HOST', 'smtp.gmail.com')
        smtp_port = getattr(settings, 'SMTP_PORT', 587)
        smtp_user = getattr(settings, 'SMTP_USER', '')
        smtp_password = getattr(settings, 'SMTP_PASSWORD', '')
        from_email = getattr(settings, 'FROM_EMAIL', 'noreply@vertechie.com')
        
        if not smtp_user or not smtp_password:
            logger.warning("SMTP credentials not configured, email not sent")
            return False
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"VerTechie <{from_email}>"
        msg['To'] = to
        
        # Create HTML version
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .header {{ background: linear-gradient(135deg, #0d47a1 0%, #1a237e 100%); padding: 20px; text-align: center; }}
                .header h1 {{ color: white; margin: 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .footer {{ padding: 20px; text-align: center; font-size: 12px; color: #666; }}
                pre {{ white-space: pre-wrap; font-family: inherit; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>VerTechie</h1>
            </div>
            <div class="content">
                <pre>{body}</pre>
            </div>
            <div class="footer">
                <p>&copy; 2024 VerTechie. All rights reserved.</p>
                <p>Built on Trust. Driven by Technology.</p>
            </div>
        </body>
        </html>
        """
        
        # Attach both plain text and HTML
        msg.attach(MIMEText(body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to, msg.as_string())
        
        logger.info(f"Email sent successfully to {to}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {str(e)}")
        return False


def send_email_background(to: str, subject: str, body: str, template_type: str):
    """Background task to send email."""
    success = send_email_smtp(to, subject, body)
    if success:
        logger.info(f"Background email sent: {template_type} to {to}")
    else:
        logger.warning(f"Background email failed: {template_type} to {to}")


# ============= Endpoints =============

@router.post("/email", response_model=EmailNotificationResponse)
async def send_email_notification(
    request: EmailNotificationRequest,
    background_tasks: BackgroundTasks,
):
    """
    Send an email notification.
    
    Used for:
    - Job application notifications to HR
    - Interest notifications to HR
    - Interview scheduled notifications
    - Application status updates
    """
    try:
        # Add email to background tasks
        background_tasks.add_task(
            send_email_background,
            request.to,
            request.subject,
            request.body,
            request.template_type
        )
        
        return EmailNotificationResponse(
            success=True,
            message=f"Email notification queued for {request.to}",
            notification_id=f"email-{request.template_type}-{hash(request.to + request.subject) % 1000000}"
        )
        
    except Exception as e:
        logger.error(f"Error queuing email notification: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to queue email notification")


@router.post("/test-email")
async def test_email_notification(
    to: EmailStr,
    background_tasks: BackgroundTasks,
):
    """Test email notification endpoint."""
    try:
        test_body = """
Hello!

This is a test email from VerTechie.

If you received this email, your notification system is working correctly.

Best regards,
The VerTechie Team
        """
        
        background_tasks.add_task(
            send_email_background,
            to,
            "🧪 VerTechie Test Email",
            test_body,
            "test"
        )
        
        return {"success": True, "message": f"Test email queued for {to}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= Stage Change Notification =============

class StageChangeRequest(BaseModel):
    candidate_email: EmailStr
    candidate_name: str
    old_stage: str
    new_stage: str
    hr_name: str
    job_title: str


@router.post("/stage-change")
async def send_stage_change_notification(
    request: StageChangeRequest,
    background_tasks: BackgroundTasks,
):
    """
    Send email notification when a candidate's pipeline stage changes.
    
    This notifies the candidate about their application status update.
    """
    try:
        # Determine if this is a forward or backward move
        stage_order = ['New Applicants', 'Screening', 'Interview', 'Offer Stage', 'Hired']
        old_index = stage_order.index(request.old_stage) if request.old_stage in stage_order else -1
        new_index = stage_order.index(request.new_stage) if request.new_stage in stage_order else -1
        
        is_forward = new_index > old_index
        
        # Create appropriate email content based on the new stage
        if request.new_stage == 'Screening':
            stage_message = "Your application is now under review by our team. We will be in touch soon with next steps."
            emoji = "📋"
        elif request.new_stage == 'Interview':
            stage_message = "Congratulations! We would like to schedule an interview with you. Our HR team will reach out to coordinate a suitable time."
            emoji = "🎉"
        elif request.new_stage == 'Offer Stage':
            stage_message = "Great news! We are preparing an offer for you. Our HR team will be in contact shortly with the details."
            emoji = "🌟"
        elif request.new_stage == 'Hired':
            stage_message = "Welcome to the team! We are thrilled to have you join us. Our HR team will send you onboarding details soon."
            emoji = "🎊"
        elif request.new_stage == 'New Applicants':
            stage_message = "Your application status has been updated. Our team will review your profile shortly."
            emoji = "📝"
        else:
            stage_message = f"Your application status has been updated to: {request.new_stage}."
            emoji = "📬"
        
        email_body = f"""
Dear {request.candidate_name},

{emoji} Application Status Update

We wanted to let you know that your application status for the {request.job_title} position has been updated.

Previous Status: {request.old_stage}
New Status: {request.new_stage}

{stage_message}

If you have any questions, please don't hesitate to reach out.

Best regards,
{request.hr_name}
VerTechie Hiring Team

---
This is an automated notification from VerTechie.
        """
        
        subject = f"{emoji} Application Update: Your status has changed to {request.new_stage}"
        
        # Queue the email
        background_tasks.add_task(
            send_email_background,
            request.candidate_email,
            subject,
            email_body.strip(),
            "stage_change"
        )
        
        logger.info(f"Stage change notification queued: {request.candidate_name} ({request.old_stage} -> {request.new_stage})")
        
        return {
            "success": True,
            "message": f"Stage change notification sent to {request.candidate_email}",
            "old_stage": request.old_stage,
            "new_stage": request.new_stage
        }
        
    except Exception as e:
        logger.error(f"Error sending stage change notification: {str(e)}")
        # Don't fail the request, just log the error
        return {
            "success": False,
            "message": f"Failed to send notification: {str(e)}",
            "old_stage": request.old_stage,
            "new_stage": request.new_stage
        }
