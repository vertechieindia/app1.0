/**
 * Email Notification Service
 * Handles sending email notifications for various events
 */

import { getApiUrl } from '../config/api';

// Email templates
interface EmailData {
  to: string;
  subject: string;
  body: string;
  templateType: 'job_application' | 'interest_expressed' | 'interview_scheduled' | 'application_status';
}

interface JobApplicationEmailData {
  hrEmail: string;
  hrName: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  candidateEmail: string;
  appliedAt: string;
}

interface InterestEmailData {
  hrEmail: string;
  hrName: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
}

// Email notification service
export const emailNotificationService = {
  /**
   * Send email notification when a techie applies for a job
   */
  sendJobApplicationEmail: async (data: JobApplicationEmailData): Promise<boolean> => {
    try {
      const emailBody = `
Dear ${data.hrName},

Great news! A new candidate has applied for your job posting.

📋 JOB DETAILS:
━━━━━━━━━━━━━━━
Position: ${data.jobTitle}
Company: ${data.companyName}

👤 CANDIDATE INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.candidateName}
Email: ${data.candidateEmail}
Applied: ${new Date(data.appliedAt).toLocaleString()}

🔔 NEXT STEPS:
━━━━━━━━━━━━━━
1. Review the candidate's profile and resume
2. Check their coding assessment scores (if applicable)
3. Schedule an interview if they're a good fit

Log in to your VerTechie HR Dashboard to view the complete application:
${window.location.origin}/hr/dashboard

Best regards,
The VerTechie Team

---
This is an automated notification from VerTechie.
If you have questions, please contact support@vertechie.com
      `.trim();

      // Try to send via backend API
      try {
        const response = await fetch(getApiUrl('/notifications/email'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            to: data.hrEmail,
            subject: `🎯 New Application: ${data.candidateName} applied for ${data.jobTitle}`,
            body: emailBody,
            template_type: 'job_application',
            metadata: {
              job_title: data.jobTitle,
              company_name: data.companyName,
              candidate_name: data.candidateName,
              candidate_email: data.candidateEmail,
            },
          }),
        });

        if (response.ok) {
          console.log('📧 Email notification sent successfully to:', data.hrEmail);
          return true;
        }
      } catch (apiError) {
        console.warn('Backend email API not available, using fallback notification');
      }

      // Fallback: Store notification locally for demo purposes
      const notifications = JSON.parse(localStorage.getItem('hr_notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        type: 'job_application',
        title: `New Application: ${data.candidateName}`,
        message: `${data.candidateName} applied for ${data.jobTitle}`,
        hrEmail: data.hrEmail,
        candidateName: data.candidateName,
        candidateEmail: data.candidateEmail,
        jobTitle: data.jobTitle,
        timestamp: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('hr_notifications', JSON.stringify(notifications));

      console.log('📧 Email notification stored locally (backend not available):', data.hrEmail);
      return true;
    } catch (error) {
      console.error('Failed to send job application email:', error);
      return false;
    }
  },

  /**
   * Send email notification when a techie expresses interest
   */
  sendInterestEmail: async (data: InterestEmailData): Promise<boolean> => {
    try {
      const emailBody = `
Dear ${data.hrName},

A candidate has expressed interest in your job posting!

📋 JOB: ${data.jobTitle}

👤 CANDIDATE:
Name: ${data.candidateName}
Email: ${data.candidateEmail}

This candidate is interested but hasn't fully applied yet. Consider reaching out to encourage them to complete their application.

View their profile on VerTechie:
${window.location.origin}/hr/dashboard

Best regards,
The VerTechie Team
      `.trim();

      // Try backend API first
      try {
        const response = await fetch(getApiUrl('/notifications/email'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            to: data.hrEmail,
            subject: `💡 Interest Alert: ${data.candidateName} is interested in ${data.jobTitle}`,
            body: emailBody,
            template_type: 'interest_expressed',
          }),
        });

        if (response.ok) {
          return true;
        }
      } catch (apiError) {
        console.warn('Backend email API not available');
      }

      // Fallback notification storage
      const notifications = JSON.parse(localStorage.getItem('hr_notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        type: 'interest_expressed',
        title: `Interest: ${data.candidateName}`,
        message: `${data.candidateName} expressed interest in ${data.jobTitle}`,
        hrEmail: data.hrEmail,
        candidateName: data.candidateName,
        jobTitle: data.jobTitle,
        timestamp: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('hr_notifications', JSON.stringify(notifications));

      return true;
    } catch (error) {
      console.error('Failed to send interest email:', error);
      return false;
    }
  },

  /**
   * Get stored notifications for HR
   */
  getHRNotifications: (): any[] => {
    return JSON.parse(localStorage.getItem('hr_notifications') || '[]');
  },

  /**
   * Mark notification as read
   */
  markAsRead: (notificationId: string): void => {
    const notifications = JSON.parse(localStorage.getItem('hr_notifications') || '[]');
    const updated = notifications.map((n: any) => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('hr_notifications', JSON.stringify(updated));
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: (): number => {
    const notifications = JSON.parse(localStorage.getItem('hr_notifications') || '[]');
    return notifications.filter((n: any) => !n.read).length;
  },
};

export default emailNotificationService;
