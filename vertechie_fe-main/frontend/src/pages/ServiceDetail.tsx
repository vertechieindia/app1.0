import React, { useEffect, useState, ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Paper,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DevicesIcon from '@mui/icons-material/Devices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ApiIcon from '@mui/icons-material/Api';
import EventIcon from '@mui/icons-material/Event';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SendIcon from '@mui/icons-material/Send';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: '#FFFFFF',
  color: theme.palette.text.primary,
  minHeight: '100vh',
}));

const DetailHero = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f9ff 0%, #e3f2fd 100%)',
  padding: theme.spacing(8, 0),
  borderRadius: 12,
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(6),
  boxShadow: '0 20px 40px rgba(25, 118, 210, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 30% 50%, rgba(25, 118, 210, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 70% 20%, rgba(25, 118, 210, 0.08) 0%, transparent 50%)`,
    zIndex: 1,
  }
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 60,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  }
}));

const ServiceIconLarge = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(25, 118, 210, 0.1)',
  color: theme.palette.primary.main,
  width: 100,
  height: 100,
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  '& svg': {
    fontSize: 48,
  }
}));

const BenefitCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(25, 118, 210, 0.2)',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(25, 118, 210, 0.2)',
    border: '1px solid rgba(25, 118, 210, 0.4)',
  }
}));

const BenefitTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const BenefitDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const ProcessStep = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(25, 118, 210, 0.1)',
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  marginRight: theme.spacing(2),
}));

const ContactFormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(25, 118, 210, 0.2)',
  borderRadius: 12,
  boxShadow: '0 10px 30px rgba(25, 118, 210, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(25, 118, 210, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(25, 118, 210, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 5px 15px rgba(25, 118, 210, 0.3)',
  }
}));

const BackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
  marginBottom: theme.spacing(2),
}));

// BoxGrid: Simple grid-like layout using Box
const BoxGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-2),
}));

// BoxGridItem: Column in the grid
interface BoxGridItemProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

const BoxGridItem = styled(Box, {
  shouldForwardProp: (prop) => !['xs', 'sm', 'md', 'lg'].includes(prop as string),
})<BoxGridItemProps>(({ xs = 12, sm, md, lg, theme }) => {
  const getWidth = (cols: number) => `${(cols / 12) * 100}%`;
  
  return {
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    width: '100%',
    
    [theme.breakpoints.up('xs')]: {
      width: getWidth(xs),
    },
    ...(sm && {
      [theme.breakpoints.up('sm')]: {
        width: getWidth(sm),
      },
    }),
    ...(md && {
      [theme.breakpoints.up('md')]: {
        width: getWidth(md),
      },
    }),
    ...(lg && {
      [theme.breakpoints.up('lg')]: {
        width: getWidth(lg),
      },
    }),
  };
});

// Service data
const serviceIcons: Record<number, ReactElement> = {
  1: <CodeIcon />,
  2: <StorageIcon />,
  3: <CloudIcon />,
  4: <SecurityIcon />,
  5: <AnalyticsIcon />,
  6: <DevicesIcon />,
  7: <VerifiedUserIcon />,
  8: <AssessmentIcon />,
  9: <BusinessCenterIcon />,
  10: <PeopleIcon />,
  11: <ApiIcon />,
  12: <SchoolIcon />,
  13: <EventIcon />,
  14: <WorkspacePremiumIcon />,
};

// Detailed content for each service
const serviceDetails: Record<number, {
  title: string;
  description: string;
  longDescription: string[];
  benefits: Array<{ title: string; description: string }>;
  features: string[];
  process: string[];
  faq: Array<{ question: string; answer: string }>;
}> = {
  1: {
    title: 'Custom Software Development',
    description: 'We build custom software solutions tailored to your specific business needs.',
    longDescription: [
      'Our custom software development services deliver tailored solutions that address your unique business challenges. We follow a comprehensive approach, from requirements gathering to deployment and maintenance.',
      'Our team of experienced developers works closely with you throughout the development process to ensure that the final product meets your expectations and business objectives.',
      'We utilize the latest technologies and industry best practices to create scalable, secure, and user-friendly software solutions that give your business a competitive edge.'
    ],
    benefits: [
      {
        title: 'Tailored to Your Needs',
        description: 'Solutions designed specifically for your business processes and workflows'
      },
      {
        title: 'Scalability',
        description: 'Systems that grow with your business and adapt to changing requirements'
      },
      {
        title: 'Competitive Advantage',
        description: 'Unique software that helps you stand out from competitors using off-the-shelf solutions'
      },
      {
        title: 'Enhanced Efficiency',
        description: 'Streamlined processes that save time, reduce errors, and increase productivity'
      }
    ],
    features: [
      'Web Applications',
      'Mobile Applications',
      'API Development',
      'Software Integrations',
      'UI/UX Design',
      'Backend Systems',
      'Database Design',
      'Testing & QA'
    ],
    process: [
      'Requirements gathering and analysis to understand your business needs',
      'Design and architecture planning to create a solid foundation',
      'Development using agile methodologies for frequent deliverables and feedback',
      'Testing and quality assurance to ensure functionality and security',
      'Deployment to production environment with minimal disruption',
      'Ongoing support and maintenance to keep your software running smoothly'
    ],
    faq: [
      {
        question: 'How long does it take to develop a custom software solution?',
        answer: 'The timeline varies based on the complexity of the project. Simple applications may take 2-3 months, while enterprise-level solutions can take 6-12 months or more. We provide detailed timelines during the project planning phase.'
      },
      {
        question: 'Do you provide ongoing support after the software is launched?',
        answer: 'Yes, we offer various support packages to ensure your software remains up-to-date, secure, and functioning optimally after launch. This includes bug fixes, feature enhancements, and technical support.'
      },
      {
        question: 'What technologies do you use for development?',
        answer: 'We work with a wide range of technologies including JavaScript/TypeScript (React, Angular, Node.js), Python, Java, .NET, PHP, and mobile frameworks like React Native and Flutter. We select the most appropriate technology stack based on your project requirements.'
      }
    ]
  },
  2: {
    title: 'Database Management',
    description: 'Optimize your database performance and ensure data security with our expert services.',
    longDescription: [
      'Our database management services are designed to help businesses optimize their database performance, ensure data security, and implement efficient data storage solutions.',
      'With our team of experienced database administrators and architects, we provide comprehensive database services that cover everything from design and implementation to maintenance and optimization.',
      'We work with all major database technologies and can help you choose the right solution for your specific business needs, whether it\'s a relational database, NoSQL database, or a hybrid approach.'
    ],
    benefits: [
      {
        title: 'Enhanced Performance',
        description: 'Optimize queries and database structure for faster data access and processing'
      },
      {
        title: 'Improved Security',
        description: 'Implement robust security measures to protect sensitive data from breaches'
      },
      {
        title: 'Reliable Backups',
        description: 'Ensure your data is backed up regularly with efficient recovery procedures'
      },
      {
        title: 'Scalable Solutions',
        description: 'Design databases that can grow with your business and handle increasing data loads'
      }
    ],
    features: [
      'Database Design & Architecture',
      'Performance Optimization',
      'Data Migration & Integration',
      'Database Security',
      'Backup & Recovery Solutions',
      'High Availability Setup',
      'Database Monitoring',
      'Maintenance & Support'
    ],
    process: [
      'Assessment of your current database infrastructure and requirements',
      'Strategy development for optimization, security enhancement, or migration',
      'Implementation of recommended solutions with minimal disruption',
      'Performance testing and fine-tuning for optimal results',
      'Staff training on best practices for database usage',
      'Ongoing monitoring and maintenance to ensure continued performance'
    ],
    faq: [
      {
        question: 'Which database technologies do you support?',
        answer: 'We work with all major database technologies including Oracle, Microsoft SQL Server, MySQL, PostgreSQL, MongoDB, Cassandra, Redis, and many others. Our team is experienced in both relational and NoSQL database solutions.'
      },
      {
        question: 'How can you improve our database performance?',
        answer: 'We use a comprehensive approach including query optimization, indexing strategies, server configuration tuning, database structure improvements, and caching mechanisms. We analyze your specific workload patterns to implement the most effective optimizations.'
      },
      {
        question: 'Can you help migrate our database to the cloud?',
        answer: 'Yes, we provide full database migration services to cloud platforms like AWS, Azure, and Google Cloud. This includes planning the migration strategy, testing, execution with minimal downtime, and post-migration optimization.'
      }
    ]
  },
  3: {
    title: 'Cloud Solutions',
    description: 'Leverage the power of cloud computing to enhance your business operations.',
    longDescription: [
      'Our cloud solutions service helps businesses leverage the power of cloud computing to improve efficiency, reduce costs, and increase scalability of their IT infrastructure.',
      'Whether you\'re looking to migrate your existing infrastructure to the cloud, optimize your current cloud setup, or implement a hybrid solution, our team of cloud experts can guide you through every step of the process.',
      'We work with leading cloud platforms including AWS, Microsoft Azure, and Google Cloud to provide you with the most suitable solution for your specific business needs and goals.'
    ],
    benefits: [
      {
        title: 'Cost Efficiency',
        description: 'Reduce capital expenditure and pay only for the resources you actually use'
      },
      {
        title: 'Scalability',
        description: 'Easily scale resources up or down based on demand, supporting growth without large upfront investments'
      },
      {
        title: 'Business Continuity',
        description: 'Improve disaster recovery capabilities and minimize downtime risks'
      },
      {
        title: 'Enhanced Collaboration',
        description: 'Enable teams to access, edit, and share documents and applications from anywhere'
      }
    ],
    features: [
      'Cloud Migration',
      'AWS/Azure/GCP Services',
      'Serverless Architecture',
      'Cloud Security',
      'Infrastructure as Code',
      'DevOps Integration',
      'Microservices Implementation',
      'Containerization'
    ],
    process: [
      'Assessment of your current infrastructure and cloud readiness',
      'Development of a tailored cloud strategy and roadmap',
      'Planning and design of cloud architecture',
      'Migration execution with testing and validation',
      'Optimization of cloud resources for cost and performance',
      'Ongoing management and support of cloud infrastructure'
    ],
    faq: [
      {
        question: 'How long does a typical cloud migration take?',
        answer: 'The timeline for cloud migration varies depending on the complexity of your infrastructure, the amount of data to be migrated, and any application refactoring required. Simple migrations might take a few weeks, while complex enterprise migrations can take several months. We provide a detailed timeline during the planning phase.'
      },
      {
        question: 'Is the cloud secure for my business data?',
        answer: 'Yes, major cloud providers offer robust security measures that often exceed what most organizations can implement on-premises. We enhance this with additional security layers including encryption, access controls, network security, and continuous monitoring to ensure your data remains secure.'
      },
      {
        question: 'How can cloud solutions reduce our IT costs?',
        answer: 'Cloud solutions reduce costs by eliminating the need for upfront hardware investments, reducing maintenance costs, optimizing resource usage through pay-as-you-go models, automating manual tasks, and reducing energy consumption. We help you implement cost optimization strategies to maximize these savings.'
      }
    ]
  },
  4: {
    title: 'Cybersecurity',
    description: 'Protect your digital assets with our comprehensive cybersecurity services.',
    longDescription: [
      'Our cybersecurity services provide robust protection for your digital assets against evolving threats in today\'s interconnected business environment.',
      'We offer a comprehensive approach to security, from vulnerability assessment and threat detection to incident response and recovery, ensuring your business remains protected at all times.',
      'Our team of certified security experts leverages industry-leading technologies and best practices to create custom security solutions that adapt to your specific business risks and compliance requirements.'
    ],
    benefits: [
      {
        title: 'Threat Prevention',
        description: 'Proactive measures to identify and mitigate security risks before they become threats'
      },
      {
        title: 'Data Protection',
        description: 'Advanced encryption and security controls to safeguard sensitive information'
      },
      {
        title: 'Compliance Support',
        description: 'Ensure adherence to industry regulations such as GDPR, HIPAA, PCI DSS, and more'
      },
      {
        title: 'Business Continuity',
        description: 'Minimize downtime and data loss with effective incident response and recovery plans'
      }
    ],
    features: [
      'Security Auditing',
      'Penetration Testing',
      'Compliance Solutions',
      'Security Training',
      'Threat Intelligence',
      'Incident Response',
      'Security Monitoring',
      'Identity Management'
    ],
    process: [
      'Comprehensive security assessment to identify vulnerabilities and gaps',
      'Development of custom security strategy tailored to your risk profile',
      'Implementation of security controls and monitoring systems',
      'Staff security awareness training to strengthen your human firewall',
      'Regular security testing and continuous monitoring for emerging threats',
      'Incident response and recovery planning to ensure business continuity'
    ],
    faq: [
      {
        question: 'How often should we conduct security assessments?',
        answer: 'We recommend comprehensive security assessments at least annually, with additional assessments after significant infrastructure changes, acquisitions, or new product launches. We also provide continuous monitoring for ongoing protection.'
      },
      {
        question: 'What sets your cybersecurity services apart from others?',
        answer: 'Our approach combines technical expertise with business context. We don\'t just identify vulnerabilities; we understand how they impact your business and prioritize solutions accordingly. We also provide 24/7 support and adapt our services to your specific industry regulations and threats.'
      },
      {
        question: 'How do you handle security incidents?',
        answer: 'Our incident response team follows a proven methodology: containment to stop the breach, investigation to identify the cause and impact, remediation to fix vulnerabilities, and recovery to restore operations. We also conduct post-incident analysis to strengthen future protections.'
      }
    ]
  },
  5: {
    title: 'Data Analytics',
    description: 'Transform your data into actionable insights with our analytics solutions.',
    longDescription: [
      'Our data analytics services help businesses harness the full potential of their data to make informed decisions, identify opportunities, and gain competitive advantages.',
      'From data collection and cleaning to advanced analytics and visualization, we provide end-to-end solutions that turn raw data into meaningful insights that drive business growth.',
      'Our team of data scientists and analysts combines technical expertise with business acumen to deliver tailored analytics solutions that address your specific business challenges and goals.'
    ],
    benefits: [
      {
        title: 'Informed Decision Making',
        description: 'Base strategic and operational decisions on data-driven insights rather than assumptions'
      },
      {
        title: 'Revenue Growth',
        description: 'Identify new revenue streams, optimize pricing, and improve customer targeting'
      },
      {
        title: 'Operational Efficiency',
        description: 'Streamline processes and reduce costs by identifying bottlenecks and inefficiencies'
      },
      {
        title: 'Competitive Advantage',
        description: 'Stay ahead of market trends and competitor actions with predictive analytics'
      }
    ],
    features: [
      'Business Intelligence',
      'Data Visualization',
      'Predictive Analytics',
      'Big Data Solutions',
      'Machine Learning Models',
      'Real-time Analytics',
      'Customer Analytics',
      'Performance Dashboards'
    ],
    process: [
      'Data discovery and assessment to understand your data landscape',
      'Strategy development to align analytics with business objectives',
      'Data preparation and cleaning to ensure quality and consistency',
      'Analytics model development using appropriate techniques',
      'Implementation of visualization tools for intuitive insights',
      'Continuous refinement and optimization of analytics solutions'
    ],
    faq: [
      {
        question: 'Do we need to have clean, structured data before starting?',
        answer: 'No, our process includes data preparation and cleaning. We can work with structured, semi-structured, or unstructured data in various formats and from multiple sources. Part of our service is to organize and prepare your data for effective analysis.'
      },
      {
        question: 'How long does it take to implement a data analytics solution?',
        answer: 'Timeframes vary based on complexity and scope. A basic dashboard implementation might take 2-4 weeks, while complex predictive analytics projects could take 2-3 months. We typically deliver value incrementally, with initial insights available within the first few weeks.'
      },
      {
        question: 'What analytics tools and technologies do you use?',
        answer: 'We leverage a variety of tools based on your specific needs and existing technology stack, including Tableau, Power BI, Python, R, TensorFlow, Apache Spark, and cloud-based analytics services from AWS, Azure, and Google Cloud. We focus on selecting the right tool for your specific use case.'
      }
    ]
  },
  6: {
    title: 'IT Infrastructure',
    description: 'Build a robust and scalable IT infrastructure to support your business growth.',
    longDescription: [
      'Our IT infrastructure services help businesses establish a solid technological foundation that is reliable, secure, and scalable to support current operations and future growth.',
      'Whether you need to optimize your existing infrastructure, migrate to a new environment, or build from scratch, our experts design and implement solutions that align with your business goals and budget.',
      'We focus on creating flexible, efficient, and resilient infrastructure that minimizes downtime, reduces operational costs, and enhances overall performance and security.'
    ],
    benefits: [
      {
        title: 'Reliability',
        description: 'Minimize downtime and disruptions with redundant systems and proactive monitoring'
      },
      {
        title: 'Scalability',
        description: 'Easily accommodate growth and changing business needs without major overhauls'
      },
      {
        title: 'Cost Optimization',
        description: 'Reduce capital expenditure and operational costs with efficient resource utilization'
      },
      {
        title: 'Performance',
        description: 'Enhance speed, responsiveness, and overall system performance for better user experience'
      }
    ],
    features: [
      'Network Design',
      'System Integration',
      'Hardware Solutions',
      'IT Support',
      'Virtualization',
      'Disaster Recovery',
      'Infrastructure Security',
      'Performance Monitoring'
    ],
    process: [
      'Assessment of current infrastructure and business requirements',
      'Development of infrastructure roadmap and architecture design',
      'Procurement and implementation of hardware and software solutions',
      'Integration with existing systems and data migration',
      'Testing and optimization to ensure performance and reliability',
      'Ongoing monitoring, maintenance, and support'
    ],
    faq: [
      {
        question: 'Should we move our infrastructure to the cloud or keep it on-premises?',
        answer: 'This depends on your specific business needs, compliance requirements, and cost considerations. We can help you assess the pros and cons of each approach and often recommend a hybrid solution that leverages the benefits of both cloud and on-premises infrastructure.'
      },
      {
        question: 'How do you ensure our infrastructure remains secure?',
        answer: 'We implement a defense-in-depth approach with multiple security layers, including network segmentation, firewalls, intrusion detection/prevention systems, endpoint protection, and access controls. We also conduct regular security assessments and keep all systems updated with the latest security patches.'
      },
      {
        question: 'What kind of support do you provide after implementation?',
        answer: 'We offer various support options, from basic monitoring and maintenance to 24/7 managed services with guaranteed response times. Our support teams provide proactive monitoring, troubleshooting, performance optimization, and regular health checks to ensure your infrastructure operates at peak efficiency.'
      }
    ]
  },
  7: {
    title: 'Profile Verification',
    description: 'Our rigorous verification process ensures that you stand out as a genuine professional in the IT industry.',
    longDescription: [
      'Our Profile Verification service provides comprehensive validation of IT professionals\' credentials, experience, and skills to establish trust and credibility in the competitive tech job market.',
      'Through our multi-step verification process, we authenticate education credentials, employment history, skills certifications, and professional references to create a verified professional profile that stands out to employers.',
      'Having a verified profile not only enhances your credibility but also increases your visibility to top employers and can fast-track your application process for premium job opportunities.'
    ],
    benefits: [
      {
        title: 'Enhanced Credibility',
        description: 'Stand out from other candidates with third-party validation of your credentials'
      },
      {
        title: 'Increased Visibility',
        description: 'Verified profiles receive preferential ranking in employer searches and recommendations'
      },
      {
        title: 'Expedited Hiring',
        description: 'Skip preliminary screening steps with employers who trust our verification process'
      },
      {
        title: 'Fraud Protection',
        description: 'Protect your professional identity and reputation from impersonation'
      }
    ],
    features: [
      'Identity Verification',
      'Professional Background Check',
      'Education Verification',
      'Skills Certification',
      'Reference Validation',
      'Digital Verification Badge',
      'Continuous Monitoring',
      'Dispute Resolution'
    ],
    process: [
      'Registration and submission of credentials and professional information',
      'Document review and initial verification of submitted information',
      'Third-party verification with educational institutions and previous employers',
      'Skills assessment to validate technical knowledge and abilities',
      'Final review and issuance of verification status and digital badge',
      'Annual review and revalidation to ensure continued accuracy'
    ],
    faq: [
      {
        question: 'How long does the verification process take?',
        answer: 'The standard verification process typically takes 3-5 business days once all required documents are submitted. For expedited verification, we offer a premium service that can complete the process in 24-48 hours for an additional fee.'
      },
      {
        question: 'What happens if there\'s a discrepancy in my credentials?',
        answer: 'If we find minor discrepancies, we\'ll contact you for clarification or additional documentation. For significant discrepancies, we provide a detailed report and allow you to explain or correct the information before making a final verification decision.'
      },
      {
        question: 'How do employers view my verified credentials?',
        answer: 'Employers see a verification badge on your profile and can access a detailed verification report that shows which aspects of your profile have been verified (education, employment history, skills, etc.) without revealing personal or sensitive information.'
      }
    ]
  },
  8: {
    title: 'Skill Assessment',
    description: 'Validate your technical expertise through our skill assessment tests designed by industry experts.',
    longDescription: [
      'Our Skill Assessment service provides comprehensive evaluation of technical skills through practical, real-world challenges designed by industry experts and senior practitioners.',
      'Unlike traditional certification exams, our assessments focus on practical problem-solving abilities and code quality, measuring not just what you know but how effectively you apply that knowledge in realistic scenarios.',
      'Successful completion of our skill assessments provides validated credentials that demonstrate your capabilities to employers, giving you a competitive edge in the job market.'
    ],
    benefits: [
      {
        title: 'Objective Validation',
        description: 'Demonstrate your real-world skills with standardized, industry-recognized assessments'
      },
      {
        title: 'Skill Gap Identification',
        description: 'Receive detailed feedback highlighting strengths and areas for improvement'
      },
      {
        title: 'Career Advancement',
        description: 'Use verified skill badges to negotiate better positions and compensation'
      },
      {
        title: 'Continuous Learning',
        description: 'Access personalized learning recommendations based on assessment results'
      }
    ],
    features: [
      'Technical Skill Tests',
      'Coding Challenges',
      'Problem-Solving Exercises',
      'Competency Evaluation',
      'Performance Analytics',
      'Skill Badges',
      'Comparative Benchmarking',
      'Personalized Feedback'
    ],
    process: [
      'Selection of skill domains and technical areas for assessment',
      'Preliminary self-assessment to determine appropriate difficulty level',
      'Completion of timed practical assessments in controlled environment',
      'Automatic and human evaluation of submitted solutions',
      'Detailed feedback report with strengths and improvement areas',
      'Issuance of skill badges and certifications for successful completion'
    ],
    faq: [
      {
        question: 'What types of skills can be assessed?',
        answer: 'We offer assessments across a wide range of technical domains, including various programming languages (Python, Java, JavaScript, etc.), frameworks (React, Angular, Node.js, etc.), cloud platforms (AWS, Azure, GCP), database technologies, DevOps practices, cybersecurity, data science, and many more.'
      },
      {
        question: 'How are the assessments structured?',
        answer: 'Our assessments typically combine multiple formats: Multiple-choice questions to test conceptual knowledge, coding challenges for practical implementation skills, debugging exercises, system design problems, and case studies. Most assessments take 1-3 hours to complete, depending on complexity.'
      },
      {
        question: 'Do I get multiple attempts if I don\'t pass?',
        answer: 'Yes, you can retake assessments after a 14-day waiting period. We provide detailed feedback after each attempt to help you identify improvement areas. We keep only your highest score on record. Certain premium assessments may have limited attempts or different waiting periods.'
      }
    ]
  },
  9: {
    title: 'Job Matching',
    description: 'Get matched with genuine job opportunities based on your verified skills and experience.',
    longDescription: [
      'Our Job Matching service uses advanced algorithms and AI to connect you with job opportunities that align perfectly with your skills, experience, career goals, and workplace preferences.',
      'Unlike traditional job boards, we go beyond keyword matching to analyze the depth of your technical expertise, soft skills, work style, and career trajectory to recommend positions where you\'ll truly excel.',
      'With our verified profiles and established employer relationships, we facilitate connections with quality opportunities while eliminating the noise of irrelevant job postings and reducing time spent on unsuitable applications.'
    ],
    benefits: [
      {
        title: 'Precision Matching',
        description: 'Receive highly relevant job recommendations based on comprehensive profile analysis'
      },
      {
        title: 'Time Efficiency',
        description: 'Eliminate hours spent searching through irrelevant job postings'
      },
      {
        title: 'Hidden Opportunities',
        description: 'Access positions not advertised on public job boards'
      },
      {
        title: 'Career Path Optimization',
        description: 'Get matched with roles that advance your long-term career objectives'
      }
    ],
    features: [
      'AI-Powered Matching',
      'Personalized Recommendations',
      'Career Path Analysis',
      'Interview Preparation',
      'Salary Insights',
      'Application Tracking',
      'Employer Verification',
      'Direct Hiring Manager Contact'
    ],
    process: [
      'Comprehensive profile creation with skills, experience, and career preferences',
      'AI analysis of your profile to identify key strengths and optimal positions',
      'Continuous matching against new opportunities as they enter our system',
      'Personalized job recommendations with fit scoring and comparative analysis',
      'Application support and interview preparation for selected positions',
      'Feedback collection and refinement of matching parameters'
    ],
    faq: [
      {
        question: 'How is this different from regular job boards?',
        answer: 'Unlike traditional job boards where you search through thousands of listings, our AI proactively matches you with relevant opportunities based on a deep analysis of your verified skills and preferences. We also verify employers and provide insights about company culture, team composition, and growth opportunities - information typically unavailable on job boards.'
      },
      {
        question: 'Can I specify salary requirements and other preferences?',
        answer: 'Absolutely. Our matching algorithm considers your salary expectations, preferred work arrangements (remote, hybrid, on-site), desired company size, industry preferences, location requirements, and even cultural factors. You can update these preferences at any time to refine your matches.'
      },
      {
        question: 'What happens after I\'m matched with a job?',
        answer: 'When you express interest in a match, we facilitate the connection with the employer. Depending on the employer\'s preferences, this may involve submitting an application through our platform, scheduling a direct call with the hiring manager, or participating in a preliminary assessment. We provide guidance throughout the process.'
      }
    ]
  },
  10: {
    title: 'Talent Acquisition',
    description: 'Access our pool of verified IT professionals and find the perfect match for your requirements.',
    longDescription: [
      'Our Talent Acquisition service helps companies identify, attract, and hire top-tier technology professionals whose skills, experience, and work style align perfectly with their organizational needs and culture.',
      'Unlike traditional recruitment agencies, we leverage our pool of pre-verified candidates, sophisticated matching algorithms, and deep industry expertise to connect you with the right talent efficiently and cost-effectively.',
      'Our comprehensive approach includes understanding your technical requirements, company culture, and long-term objectives to ensure that candidates not only have the right skills but also fit well within your team dynamic.'
    ],
    benefits: [
      {
        title: 'Quality Candidates',
        description: 'Access pre-verified professionals with validated skills and experience'
      },
      {
        title: 'Time Efficiency',
        description: 'Reduce time-to-hire by up to 60% with pre-screened, relevant candidates'
      },
      {
        title: 'Cost Reduction',
        description: 'Lower recruitment costs with our efficient, targeted matching process'
      },
      {
        title: 'Retention Improvement',
        description: 'Increase employee retention through better cultural and technical fit'
      }
    ],
    features: [
      'Candidate Screening',
      'Skill Validation',
      'Culture Fit Assessment',
      'Hiring Process Optimization',
      'Market Intelligence',
      'Diversity Sourcing',
      'Interview Coordination',
      'Onboarding Support'
    ],
    process: [
      'Detailed assessment of your technical requirements and team dynamics',
      'Development of ideal candidate profiles based on technical and cultural criteria',
      'AI-powered matching supplemented by human expertise for candidate identification',
      'Presentation of carefully selected candidates with comprehensive profiles',
      'Support throughout the interview, selection, and offer process',
      'Post-hire follow-up to ensure successful integration'
    ],
    faq: [
      {
        question: 'How do you verify the skills of candidates?',
        answer: 'We use a multi-layered verification process that includes identity verification, credential validation, practical skill assessments, technical interviews with domain experts, and reference checks. All candidates in our network have undergone this rigorous process, ensuring that their claimed skills and experience are authentic.'
      },
      {
        question: 'What makes your service different from traditional recruiting?',
        answer: 'Our approach combines technology and human expertise in a unique way. We maintain a network of pre-verified candidates, use AI to identify optimal matches, provide data-driven insights about market conditions, and focus on both technical capabilities and cultural alignment. We also offer flexible engagement models from project-based to full-time hiring.'
      },
      {
        question: 'How quickly can you provide candidates?',
        answer: 'For most technical roles, we can present highly qualified candidates within 1-2 weeks. For specialized or senior positions, it might take 2-3 weeks to ensure quality matches. In urgent situations, we can often provide initial candidates within 2-3 days from our pool of immediately available professionals.'
      }
    ]
  },
  11: {
    title: 'Verification API',
    description: 'Integrate our verification system into your hiring process to ensure authenticity of candidates.',
    longDescription: [
      'Our Verification API allows businesses to seamlessly integrate our comprehensive credential verification capabilities directly into their existing HR systems, applicant tracking software, and hiring workflows.',
      'With simple API calls, you can verify candidate identities, educational qualifications, professional certifications, employment history, and technical skills, all while maintaining a smooth candidate experience.',
      'The API provides flexible integration options, robust security measures, and detailed verification responses that help you make confident hiring decisions while reducing fraud risk and streamlining your verification process.'
    ],
    benefits: [
      {
        title: 'Easy Integration',
        description: 'Quickly implement verification into existing systems with minimal development'
      },
      {
        title: 'Real-time Verification',
        description: 'Instantly validate credentials at any stage of the hiring process'
      },
      {
        title: 'Custom Workflows',
        description: 'Configure verification steps based on role requirements and risk levels'
      },
      {
        title: 'Secure Data Transfer',
        description: 'Ensure sensitive information remains protected with enterprise-grade security'
      }
    ],
    features: [
      'RESTful API Interface',
      'Webhook Notifications',
      'Customizable Verification Levels',
      'Detailed Report Generation',
      'Candidate Experience Portal',
      'Admin Dashboard',
      'Automated Document Analysis',
      'Compliance Documentation'
    ],
    process: [
      'API integration planning and access provisioning',
      'Configuration of verification parameters and workflow triggers',
      'Testing in sandbox environment with sample data',
      'Production deployment with monitoring and support',
      'Regular updates and feature enhancements',
      'Quarterly reviews and optimization recommendations'
    ],
    faq: [
      {
        question: 'What technical resources are needed for integration?',
        answer: 'Integration is straightforward for teams with basic API experience. We provide comprehensive documentation, client libraries in major languages (JavaScript, Python, Java, etc.), a sandbox environment for testing, and dedicated technical support during implementation. Most clients complete basic integration in 2-3 days.'
      },
      {
        question: 'How does the API handle candidate consent and privacy?',
        answer: 'The API includes built-in consent management features that allow candidates to review verification requests, provide specific consent for each verification type, and view their verification status. All data processing complies with GDPR, CCPA, and other relevant privacy regulations, with options for data retention policies.'
      },
      {
        question: 'Can the API be customized for our specific industry requirements?',
        answer: 'Yes, the API supports industry-specific verification needs through custom verification modules. For example, we offer specialized verifications for healthcare (license verification, sanction checks), financial services (regulatory certifications, compliance history), and government contractors (security clearance validation).'
      }
    ]
  },
  12: {
    title: 'Professional Courses',
    description: 'Enhance your skills with industry-relevant courses taught by experts and get certified.',
    longDescription: [
      'Our Professional Courses provide comprehensive, up-to-date training designed by industry experts to help you master in-demand technical skills and advance your career in the rapidly evolving tech landscape.',
      'Unlike traditional educational programs, our courses focus on practical, job-relevant skills with hands-on projects, real-world case studies, and personalized feedback to ensure you can apply what you learn immediately.',
      'Each course includes industry-recognized certification options, career support resources, and ongoing access to course updates, ensuring your knowledge remains current in a fast-changing industry.'
    ],
    benefits: [
      {
        title: 'Technical Mastery',
        description: 'Develop comprehensive skills validated by industry-recognized certifications'
      },
      {
        title: 'Career Advancement',
        description: 'Unlock new job opportunities and higher compensation with in-demand skills'
      },
      {
        title: 'Expert Guidance',
        description: 'Learn directly from senior practitioners with extensive real-world experience'
      },
      {
        title: 'Flexible Learning',
        description: 'Balance professional development with work through self-paced online formats'
      }
    ],
    features: [
      'Technical Courses',
      'Soft Skills Training',
      'Industry Certifications',
      'Hands-on Projects',
      'Interactive Workshops',
      'Mentorship Programs',
      'Career Coaching',
      'Learning Paths'
    ],
    process: [
      'Skills assessment to determine appropriate course level and learning path',
      'Customized learning plan development based on career goals',
      'Structured course progression with practical exercises and projects',
      'Regular knowledge checks and personalized feedback',
      'Final assessment and certification upon successful completion',
      'Post-course resources and ongoing learning opportunities'
    ],
    faq: [
      {
        question: 'How do your courses compare to free online resources?',
        answer: 'While free resources can be valuable, our courses offer a structured, comprehensive curriculum developed by industry experts. We provide personalized feedback, hands-on projects evaluated by professionals, interactive sessions with instructors, and recognized certifications. Our courses also include career services and networking opportunities not available through self-study.'
      },
      {
        question: 'How much time should I dedicate to complete a course?',
        answer: 'Most of our courses are designed for working professionals and require 5-10 hours per week over 8-12 weeks. We offer flexible scheduling with self-paced options and extended access periods. Some intensive programs may require more time, while short certificate courses can be completed in 2-4 weeks.'
      },
      {
        question: 'Are your certifications recognized by employers?',
        answer: 'Yes, our certifications are developed in collaboration with industry partners and recognized by major employers. Many of our programs are aligned with industry-standard certifications or prepare you for them. We regularly gather feedback from employers to ensure our certifications reflect current industry requirements and have value in the job market.'
      }
    ]
  },
  13: {
    title: 'Networking Events',
    description: 'Connect with other professionals and companies through our virtual and in-person networking events.',
    longDescription: [
      'Our Networking Events bring together IT professionals, industry leaders, and hiring companies in curated environments designed to foster meaningful connections, knowledge sharing, and career opportunities.',
      'Whether virtual or in-person, our events go beyond typical networking with structured activities, targeted matching based on interests and goals, and follow-up support to ensure connections lead to tangible outcomes.',
      'From tech-specific meetups and career fairs to workshops and executive roundtables, our diverse event formats cater to different networking styles and professional objectives.'
    ],
    benefits: [
      {
        title: 'Industry Connections',
        description: 'Build relationships with peers, mentors, and potential employers'
      },
      {
        title: 'Virtual Meetups',
        description: 'Connect globally without geographical limitations through online platforms'
      },
      {
        title: 'Mentorship Opportunities',
        description: 'Find guidance from experienced professionals in your field'
      },
      {
        title: 'Career Advancement',
        description: 'Discover hidden job opportunities through personal connections'
      }
    ],
    features: [
      'Industry Meetups',
      'Virtual Conferences',
      'Mentorship Programs',
      'Community Forums',
      'Tech Talks',
      'Hiring Events',
      'Hackathons',
      'Professional Workshops'
    ],
    process: [
      'Profile creation with professional interests and networking objectives',
      'Recommendations for relevant events based on your goals and background',
      'Pre-event preparation with attendee information and conversation starters',
      'Facilitated introductions to key contacts during events',
      'Post-event follow-up support and connection management',
      'Ongoing community engagement between formal events'
    ],
    faq: [
      {
        question: 'How do you ensure quality networking experiences?',
        answer: 'We curate our events carefully, with selective admission processes, balanced attendee ratios across experience levels and specializations, structured activities for meaningful interaction, and trained facilitators who help initiate conversations. We also gather feedback after each event to continuously improve the experience.'
      },
      {
        question: 'I\'m introverted - will these events work for me?',
        answer: 'Absolutely! We design our events with different personality types in mind. For introverts, we offer smaller group settings, one-on-one matching, pre-scheduled meetings, and digital tools that make connections easier. Our virtual events also include options for text-based networking alongside video interactions.'
      },
      {
        question: 'What industries and professionals typically attend your events?',
        answer: 'Our events attract professionals from across the tech ecosystem, including software developers, data scientists, cybersecurity experts, IT managers, product managers, UX designers, and CTOs. Attendees come from various industries including tech companies, financial services, healthcare, retail, manufacturing, and startups at different growth stages.'
      }
    ]
  },
  14: {
    title: 'Certification Programs',
    description: 'Get industry-recognized certifications to boost your career prospects and credibility.',
    longDescription: [
      'Our Certification Programs provide industry-recognized credentials that validate your expertise in specific technical domains, increasing your credibility with employers and clients.',
      'Designed in collaboration with industry leaders and subject matter experts, our certifications emphasize practical skills assessment alongside theoretical knowledge, ensuring that certified professionals can apply their expertise in real-world scenarios.',
      'Each certification follows a rigorous development process to ensure it reflects current industry standards, best practices, and employer requirements, making them valuable differentiators in competitive job markets.'
    ],
    benefits: [
      {
        title: 'Industry-Recognized Credentials',
        description: 'Earn certifications valued by employers across the technology sector'
      },
      {
        title: 'Career Advancement',
        description: 'Qualify for higher-level positions and salary increases'
      },
      {
        title: 'Skill Validation',
        description: 'Demonstrate proven expertise with standardized assessments'
      },
      {
        title: 'Professional Network',
        description: 'Join communities of certified professionals for knowledge sharing'
      }
    ],
    features: [
      'Industry-Recognized Credentials',
      'Exam Preparation',
      'Continuing Education',
      'Certificate Verification',
      'Digital Badges',
      'Certification Renewal',
      'Professional Directory',
      'Employer Recognition'
    ],
    process: [
      'Pre-assessment to evaluate readiness for certification exam',
      'Preparation through recommended learning resources and practice tests',
      'Proctored examination with theoretical and practical components',
      'Evaluation of exam results and practical assignments',
      'Issuance of digital and physical certificates upon successful completion',
      'Continuing education for certification maintenance and renewal'
    ],
    faq: [
      {
        question: 'How are your certifications different from vendor certifications?',
        answer: 'While vendor certifications focus on specific products or technologies, our certifications validate broader skill sets and competencies that apply across different platforms and environments. We emphasize practical application rather than product-specific knowledge, making our certifications valuable regardless of the specific tools a company uses.'
      },
      {
        question: 'How do employers verify my certification?',
        answer: 'All certifications include a unique verification code and QR code that employers can use to validate authenticity through our secure verification portal. Digital badges can be shared on LinkedIn and other platforms with embedded verification metadata. We also provide a certificate holder directory that employers can search with permission.'
      },
      {
        question: 'How long are certifications valid, and how do I maintain them?',
        answer: 'Most certifications are valid for 2-3 years, after which renewal is required to ensure your knowledge remains current. Renewal typically requires continuing education credits earned through approved activities such as courses, conferences, publishing articles, contributing to open source, or re-examination with updated content.'
      }
    ]
  }
};

// Fallback service details for any service that hasn't been fully detailed yet
const fallbackServiceDetail = {
  longDescription: [
    'Our comprehensive service is designed to meet your specific needs and deliver exceptional results.',
    'With years of industry experience and a team of skilled professionals, we provide solutions that help you achieve your goals and overcome challenges.',
    'We use cutting-edge technologies and methodologies to ensure that our service meets the highest standards of quality and effectiveness.'
  ],
  benefits: [
    {
      title: 'Enhanced Performance',
      description: 'Improve efficiency and productivity with our optimized solutions'
    },
    {
      title: 'Cost-Effective',
      description: 'Reduce unnecessary expenses and maximize your return on investment'
    },
    {
      title: 'Expert Support',
      description: 'Access to dedicated professionals who understand your needs'
    },
    {
      title: 'Future-Proof',
      description: 'Solutions designed to adapt and evolve with changing requirements'
    }
  ],
  process: [
    'Initial consultation to understand your specific needs and requirements',
    'Detailed analysis and planning to create a tailored approach',
    'Implementation of solutions with regular updates and feedback',
    'Testing and quality assurance to ensure optimal performance',
    'Deployment and integration with existing systems',
    'Ongoing support and maintenance to ensure continued success'
  ],
  faq: [
    {
      question: 'How can this service benefit my business?',
      answer: 'Our service helps streamline operations, reduce costs, and improve overall performance, allowing you to focus on your core business activities while we handle the technical aspects.'
    },
    {
      question: 'What is the typical timeline for implementation?',
      answer: 'Timelines vary based on complexity and scope, but we provide detailed project plans with milestones during the initial consultation phase.'
    },
    {
      question: 'Do you offer customizable packages?',
      answer: 'Yes, we understand that each business has unique needs. We offer flexible packages that can be tailored to your specific requirements and budget.'
    }
  ]
};

// Service theme colors based on service type
const serviceThemes: Record<number, {
  gradient: string;
  accentColor: string;
}> = {
  // IT Services
  1: { gradient: 'linear-gradient(135deg, #0A2647 0%, #144272 100%)', accentColor: '#2C74B3' }, // Software Development
  2: { gradient: 'linear-gradient(135deg, #3C2A21 0%, #674736 100%)', accentColor: '#D5CEA3' }, // Database Management
  3: { gradient: 'linear-gradient(135deg, #1A374D 0%, #406882 100%)', accentColor: '#6998AB' }, // Cloud Solutions
  4: { gradient: 'linear-gradient(135deg, #3F0071 0%, #610094 100%)', accentColor: '#9A0680' }, // Cybersecurity
  5: { gradient: 'linear-gradient(135deg, #1F4690 0%, #3A5BA0 100%)', accentColor: '#5789D8' }, // Data Analytics
  6: { gradient: 'linear-gradient(135deg, #1B262C 0%, #3282B8 100%)', accentColor: '#0F4C75' }, // IT Infrastructure

  // Professional Verification
  7: { gradient: 'linear-gradient(135deg, #1E5128 0%, #4E9F3D 100%)', accentColor: '#D8E9A8' }, // Profile Verification
  8: { gradient: 'linear-gradient(135deg, #293462 0%, #1CD6CE 100%)', accentColor: '#FEDB39' }, // Skill Assessment
  9: { gradient: 'linear-gradient(135deg, #3D0C11 0%, #9E1030 100%)', accentColor: '#F3CED1' }, // Job Matching
  10: { gradient: 'linear-gradient(135deg, #370665 0%, #35589A 100%)', accentColor: '#A076F9' }, // Talent Acquisition

  // Business Services
  11: { gradient: 'linear-gradient(135deg, #0A2647 0%, #2C74B3 100%)', accentColor: '#144272' }, // Verification API
  12: { gradient: 'linear-gradient(135deg, #413F42 0%, #7F8487 100%)', accentColor: '#D8D9CF' }, // Professional Courses

  // Educational Services
  13: { gradient: 'linear-gradient(135deg, #1C3879 0%, #607EAA 100%)', accentColor: '#EAE3D2' }, // Networking Events
  14: { gradient: 'linear-gradient(135deg, #332FD0 0%, #9254C8 100%)', accentColor: '#E15FED' }, // Certification Programs
};

// Default theme for fallback
const defaultTheme = { 
  gradient: 'linear-gradient(135deg, #080808 0%, #202020 100%)', 
  accentColor: '#C0C0C0' 
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Comprehensive service data
  const getServiceDetails = (serviceId: string) => {
    const serviceData: Record<string, any> = {
      '1': {
        id: '1',
        title: 'Software Development',
        description: 'Where your wildest business ideas become reality',
        icon: <CodeIcon />,
        longDescription: [
          'Picture this: Your team is drowning in spreadsheets, manual processes are eating up 40% of your day, and that "quick fix" from three years ago has become a digital Frankenstein that everyone avoids touching. Sound familiar?',
          'We don\'t just write code—we architect digital transformations that turn your biggest operational headaches into your greatest competitive advantages. Our developers are the kind who get genuinely excited about solving problems that keep you awake at night.',
          'From sleek mobile apps that your customers will actually want to use, to enterprise systems that scale with your ambitions, we build software that doesn\'t just work—it works so well that your team will wonder how they ever lived without it.'
        ],
        benefits: [
          {
            title: 'Your Business, Your Rules',
            description: 'Forget forcing your processes into off-the-shelf software. We build exactly what you need, how you need it—no compromises, no "workarounds," no settling for "good enough."',
            icon: <CodeIcon />
          },
          {
            title: 'Built to Last (and Scale)',
            description: 'Remember that startup that built their MVP in a weekend and now can\'t handle 10,000 users? That\'s not us. We architect for tomorrow, so when you\'re ready to conquer the world, your software is ready too.',
            icon: <DevicesIcon />
          },
          {
            title: 'Future-Proof Technology',
            description: 'We\'re not just using today\'s hottest frameworks—we\'re building with tomorrow\'s standards. Your software won\'t just work now; it\'ll be the envy of your competitors in five years.',
            icon: <SecurityIcon />
          },
          {
            title: 'Your Success is Our Obsession',
            description: 'We don\'t disappear after launch day. We\'re your long-term partners, continuously optimizing, updating, and ensuring your software gets better with age—like fine wine, but more profitable.',
            icon: <VerifiedUserIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Deep Dive',
            description: 'We don\'t just ask what you want—we discover what you actually need. Through workshops, interviews, and a bit of detective work, we uncover the real problems your software should solve.'
          },
          {
            step: 2,
            title: 'Blueprint to Brilliance',
            description: 'Our architects don\'t just design systems; they craft digital masterpieces. Every pixel, every function, every user interaction is planned with the precision of a Swiss watchmaker.'
          },
          {
            step: 3,
            title: 'Code That Actually Works',
            description: 'Using agile methodologies and continuous testing, we build your software in sprints. You see progress every week, provide feedback, and watch your vision come to life—one feature at a time.'
          },
          {
            step: 4,
            title: 'Launch Day (The Fun Part)',
            description: 'We don\'t just deploy and disappear. We\'re there on launch day, training your team, monitoring everything, and celebrating your success. Because your win is our win.'
          },
          {
            step: 5,
            title: 'The Long Game',
            description: 'The relationship doesn\'t end at go-live. We\'re your ongoing partners, continuously improving, updating, and ensuring your software evolves with your business.'
          }
        ],
        technologies: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
        pricing: 'Starting from $5,000',
        timeline: '4-12 weeks depending on complexity',
        tagline: 'From idea to impact—we code your competitive advantage.'
      },
      '2': {
        id: '2',
        title: 'Database Management',
        description: 'Your data deserves better than "it works, I guess"',
        icon: <StorageIcon />,
        longDescription: [
          'Ever had that sinking feeling when your database takes 30 seconds to load a simple report? Or worse—when it crashes right before your biggest client presentation? We\'ve been there, and we\'ve made it our mission to ensure you never have to experience that particular brand of corporate trauma again.',
          'Your data is the lifeblood of your business. It\'s not just numbers in a spreadsheet—it\'s customer insights, operational intelligence, and the foundation of every decision you make. We treat it with the respect it deserves.',
          'From lightning-fast queries that make your team wonder if they\'re using the same database, to bulletproof security that would make Fort Knox jealous, we transform your data infrastructure from a necessary evil into your secret weapon.'
        ],
        benefits: [
          {
            title: 'Speed That Impresses',
            description: 'Remember when your reports took 5 minutes to generate? Those days are over. We optimize your database so thoroughly that your team will think you upgraded to a supercomputer.',
            icon: <AnalyticsIcon />
          },
          {
            title: 'Security That Sleeps Well',
            description: 'Your data is safer with us than your grandmother\'s secret cookie recipe. Multi-layer encryption, access controls, and monitoring so tight that even we can\'t access your data without permission.',
            icon: <SecurityIcon />
          },
          {
            title: 'Disaster-Proof Your Dreams',
            description: 'What if your server room caught fire tomorrow? (We hope it doesn\'t, but just in case...) Our backup and recovery systems ensure your business keeps running even when everything else goes wrong.',
            icon: <CloudIcon />
          },
          {
            title: 'Always-On Peace of Mind',
            description: 'While you sleep, we watch. Our 24/7 monitoring catches problems before they become disasters, so you can focus on growing your business instead of worrying about your database.',
            icon: <VerifiedUserIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Data Detective Work',
            description: 'We don\'t just look at your database—we investigate it like CSI. We find the bottlenecks, identify the security gaps, and discover opportunities you didn\'t know existed.'
          },
          {
            step: 2,
            title: 'The Master Plan',
            description: 'Every great database transformation starts with a plan. We create a roadmap that\'s so detailed, it could guide a tourist through a foreign city—except this city is your data infrastructure.'
          },
          {
            step: 3,
            title: 'Surgical Precision',
            description: 'We implement changes with the precision of a brain surgeon. Zero downtime, zero data loss, zero excuses. Your business keeps running while we make it better.'
          },
          {
            step: 4,
            title: 'The Proof is in the Performance',
            description: 'We test everything twice, then test it again. Because when it comes to your data, "good enough" isn\'t good enough. We want you to be amazed.'
          },
          {
            step: 5,
            title: 'Your Data\'s Personal Bodyguard',
            description: 'We don\'t just fix your database and disappear. We become your data\'s personal bodyguard, monitoring, optimizing, and protecting it 24/7/365.'
          }
        ],
        technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'AWS RDS', 'Docker'],
        pricing: 'Starting from $2,500/month',
        timeline: '2-6 weeks for implementation',
        tagline: 'Data that works as hard as you do—only faster and more secure.'
      },
      '3': {
        id: '3',
        title: 'Cloud Solutions',
        description: 'Your business deserves to fly, not just survive',
        icon: <CloudIcon />,
        longDescription: [
          'Remember when "the cloud" was just a buzzword that made your IT team roll their eyes? Those days are over. The cloud isn\'t just the future—it\'s the present, and it\'s the difference between businesses that thrive and those that barely survive.',
          'We don\'t just move your stuff to the cloud and call it a day. We architect cloud solutions that make your business more agile, more secure, and more profitable. Think of us as your cloud transformation sherpas—we guide you to the summit of digital excellence.',
          'From seamless migrations that your users won\'t even notice, to cost optimizations that make your CFO do a happy dance, we turn the cloud from a technical challenge into your competitive advantage.'
        ],
        benefits: [
          {
            title: 'Scale Like a Silicon Valley Unicorn',
            description: 'Your infrastructure grows with your ambitions. Need to handle 10x traffic tomorrow? No problem. Your cloud setup scales automatically, so you can focus on growing your business, not your server room.',
            icon: <CloudIcon />
          },
          {
            title: 'Costs That Actually Make Sense',
            description: 'Stop paying for servers that sit idle 80% of the time. Our cloud optimization strategies can reduce your IT costs by up to 40% while improving performance. Your CFO will thank us.',
            icon: <AnalyticsIcon />
          },
          {
            title: 'Security That\'s Fort Knox-Level',
            description: 'Your data in the cloud is more secure than it ever was on-premises. Multi-factor authentication, encryption at rest and in transit, and security monitoring that would make the NSA jealous.',
            icon: <SecurityIcon />
          },
          {
            title: 'Disaster Recovery That Actually Works',
            description: 'What if your office burned down tomorrow? (Again, we hope it doesn\'t.) With our cloud disaster recovery, your business would be back online in minutes, not days. Sleep well tonight.',
            icon: <VerifiedUserIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Cloud Reality Check',
            description: 'We audit your current setup with the brutal honesty of a best friend. What works, what doesn\'t, and what could be amazing in the cloud. No sugar-coating, just the truth.'
          },
          {
            step: 2,
            title: 'The Master Cloud Plan',
            description: 'Every great cloud transformation needs a strategy. We create a roadmap that\'s so detailed, it could guide a rocket to Mars—except this rocket is your business transformation.'
          },
          {
            step: 3,
            title: 'The Seamless Migration',
            description: 'We move your applications and data to the cloud so smoothly that your team might not even notice. Zero downtime, zero data loss, zero headaches. Just pure, cloud-powered magic.'
          },
          {
            step: 4,
            title: 'The Performance Tuning',
            description: 'We optimize your cloud setup until it purrs like a well-tuned sports car. Every resource is perfectly allocated, every cost is justified, and every performance metric is optimized.'
          },
          {
            step: 5,
            title: 'Your Cloud Success Partner',
            description: 'We don\'t just set it and forget it. We\'re your ongoing cloud partners, continuously optimizing, monitoring, and ensuring your cloud investment pays dividends every single day.'
          }
        ],
        technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
        pricing: 'Starting from $3,000/month',
        timeline: '3-8 weeks for migration',
        tagline: 'Cloud computing that lifts your business to new heights—literally.'
      },
      '4': {
        id: '4',
        title: 'Cybersecurity',
        description: 'Because hackers don\'t take coffee breaks',
        icon: <SecurityIcon />,
        longDescription: [
          'Picture this: It\'s 3 AM, your phone rings, and it\'s your IT manager with that tone in their voice. "We\'ve been breached." Your heart sinks, your mind races, and you realize that all those "it won\'t happen to us" conversations were just wishful thinking.',
          'In today\'s digital world, cyber threats aren\'t just a possibility—they\'re inevitable. But here\'s the thing: with the right cybersecurity strategy, you don\'t just survive these attacks; you make them irrelevant.',
          'We don\'t just install antivirus software and call it a day. We build digital fortresses so robust that even the most sophisticated hackers would rather target someone else. Your business becomes the one that\'s "too much trouble" to hack.'
        ],
        benefits: [
          {
            title: 'Fortress-Level Protection',
            description: 'Multi-layered security that makes your systems harder to breach than Fort Knox. Firewalls, intrusion detection, endpoint protection—we build walls that would make medieval castle builders jealous.',
            icon: <SecurityIcon />
          },
          {
            title: 'Threat Hunting That Never Sleeps',
            description: 'While you sleep, our AI-powered systems hunt for threats 24/7. We catch attacks before they happen, not after the damage is done. It\'s like having a digital security guard who never needs coffee breaks.',
            icon: <VerifiedUserIcon />
          },
          {
            title: 'Employee Training That Actually Works',
            description: 'The weakest link in any security system? Humans. We train your team to spot phishing attempts, avoid suspicious links, and become your first line of defense instead of your biggest vulnerability.',
            icon: <SchoolIcon />
          },
          {
            title: 'Incident Response That Saves the Day',
            description: 'If the worst happens, we don\'t panic—we act. Our incident response team can contain breaches in minutes, not hours, minimizing damage and getting you back to business faster than you thought possible.',
            icon: <AnalyticsIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Security Audit',
            description: 'We examine your current security setup with the thoroughness of a forensic investigator. Every vulnerability, every weak spot, every "that\'s probably fine" moment gets exposed.'
          },
          {
            step: 2,
            title: 'The Battle Plan',
            description: 'We create a comprehensive security strategy that\'s so detailed, it could guide a military operation. Every threat gets a countermeasure, every vulnerability gets a solution.'
          },
          {
            step: 3,
            title: 'The Digital Fortress',
            description: 'We implement security measures with the precision of a Swiss watchmaker. Every firewall rule, every access control, every monitoring system is perfectly calibrated for maximum protection.'
          },
          {
            step: 4,
            title: 'The Training Ground',
            description: 'We turn your team into cybersecurity warriors through engaging training that actually sticks. No boring PowerPoints—just practical skills that protect your business every day.'
          },
          {
            step: 5,
            title: 'The Watchtower',
            description: 'We become your 24/7 security command center, monitoring, analyzing, and responding to threats in real-time. Your business is always protected, even when you\'re sleeping.'
          }
        ],
        technologies: ['Firewalls', 'SIEM', 'EDR', 'MFA', 'Zero Trust', 'Penetration Testing'],
        pricing: 'Starting from $4,000/month',
        timeline: '2-4 weeks for implementation',
        tagline: 'Security so tight, even we can\'t break in—and we built it.'
      },
      '5': {
        id: '5',
        title: 'Data Analytics',
        description: 'Turn your data into your secret weapon',
        icon: <AnalyticsIcon />,
        longDescription: [
          'Your business generates more data in a day than most companies did in a year just a decade ago. But here\'s the thing: raw data is like a diamond in the rough—valuable, but useless until it\'s cut and polished.',
          'We don\'t just collect your data; we transform it into actionable insights that drive real business decisions. Every chart, every report, every dashboard tells a story that helps you understand your business better than ever before.',
          'From predicting customer behavior to optimizing operations, we turn your data into a crystal ball that actually works. The future of your business isn\'t just visible—it\'s actionable.'
        ],
        benefits: [
          {
            title: 'Insights That Actually Matter',
            description: 'Forget vanity metrics that look impressive but don\'t drive decisions. We focus on the data that moves the needle, the insights that change how you do business, and the analytics that make you money.',
            icon: <AnalyticsIcon />
          },
          {
            title: 'Predictive Power',
            description: 'What if you could predict which customers are about to leave? Or which products will be bestsellers next quarter? Our predictive analytics give you a competitive edge that feels like cheating—but it\'s completely legal.',
            icon: <VerifiedUserIcon />
          },
          {
            title: 'Real-Time Intelligence',
            description: 'While your competitors are making decisions based on last month\'s data, you\'re making decisions based on what happened five minutes ago. Real-time analytics give you the speed advantage that wins markets.',
            icon: <CloudIcon />
          },
          {
            title: 'Beautiful Dashboards',
            description: 'Data visualization so beautiful, your team will actually want to look at it. No more ugly spreadsheets or confusing charts—just clean, intuitive dashboards that make complex data simple to understand.',
            icon: <DevicesIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Data Discovery',
            description: 'We explore your data landscape like digital archaeologists, uncovering hidden treasures and identifying the gold mines of information that can transform your business.'
          },
          {
            step: 2,
            title: 'The Analytics Architecture',
            description: 'We design a data infrastructure so robust, it could handle the data needs of a Fortune 500 company. Every pipeline, every database, every processing system is optimized for maximum insight generation.'
          },
          {
            step: 3,
            title: 'The Insight Factory',
            description: 'We build the analytical models and algorithms that turn raw data into pure business intelligence. Machine learning, statistical analysis, and predictive modeling—we use every tool in the data scientist\'s arsenal.'
          },
          {
            step: 4,
            title: 'The Visualization Studio',
            description: 'We create dashboards and reports so intuitive, your team will wonder how they ever made decisions without them. Every chart tells a story, every metric drives action.'
          },
          {
            step: 5,
            title: 'The Intelligence Engine',
            description: 'We become your ongoing data intelligence partners, continuously refining models, updating insights, and ensuring your analytics stay ahead of your competition.'
          }
        ],
        technologies: ['Python', 'R', 'Tableau', 'Power BI', 'Machine Learning', 'Big Data'],
        pricing: 'Starting from $3,500/month',
        timeline: '4-8 weeks for implementation',
        tagline: 'Data that doesn\'t just inform—it transforms.'
      },
      '6': {
        id: '6',
        title: 'IT Infrastructure',
        description: 'The digital backbone that never breaks',
        icon: <DevicesIcon />,
        longDescription: [
          'Your IT infrastructure is like the foundation of a building—when it\'s solid, you don\'t even notice it. But when it\'s shaky, everything else crumbles. We build digital foundations so strong, your business can grow to any height without fear.',
          'From network design that handles traffic spikes like a champ, to server configurations that run smoother than a Swiss watch, we create IT infrastructure that\'s not just reliable—it\'s bulletproof.',
          'We don\'t just fix what\'s broken; we build what\'s better. Your IT infrastructure becomes the competitive advantage that lets you focus on growing your business, not maintaining your technology.'
        ],
        benefits: [
          {
            title: 'Rock-Solid Reliability',
            description: 'Uptime that would make NASA jealous. We build infrastructure so reliable, your team forgets what downtime feels like. 99.9% uptime isn\'t just a goal—it\'s a guarantee.',
            icon: <DevicesIcon />
          },
          {
            title: 'Performance That Impresses',
            description: 'Network speeds that make your team wonder if they\'re using the same internet as everyone else. Server performance so optimized, your applications run like they\'re powered by rocket fuel.',
            icon: <AnalyticsIcon />
          },
          {
            title: 'Scalability That Grows With You',
            description: 'Infrastructure that expands with your ambitions. Need to handle 10x the traffic tomorrow? No problem. Your infrastructure scales automatically, so growth never becomes a bottleneck.',
            icon: <CloudIcon />
          },
          {
            title: 'Security That Sleeps Well',
            description: 'Network security so comprehensive, even the most determined hackers would rather target someone else. Your infrastructure becomes the digital equivalent of a maximum-security prison.',
            icon: <SecurityIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Infrastructure Assessment',
            description: 'We examine your current setup with the thoroughness of a building inspector. Every cable, every server, every network configuration gets evaluated for performance, security, and scalability.'
          },
          {
            step: 2,
            title: 'The Master Blueprint',
            description: 'We design infrastructure so robust, it could support a company ten times your size. Every component is planned for maximum performance, security, and future growth.'
          },
          {
            step: 3,
            title: 'The Precision Implementation',
            description: 'We implement your new infrastructure with the precision of a Swiss watchmaker. Every configuration is optimized, every connection is tested, every component is perfectly tuned.'
          },
          {
            step: 4,
            title: 'The Performance Optimization',
            description: 'We fine-tune your infrastructure until it purrs like a well-oiled machine. Every resource is perfectly allocated, every bottleneck is eliminated, every performance metric is maximized.'
          },
          {
            step: 5,
            title: 'The Ongoing Excellence',
            description: 'We become your infrastructure guardians, continuously monitoring, optimizing, and ensuring your technology foundation stays strong as your business grows.'
          }
        ],
        technologies: ['Cisco', 'Dell', 'HP', 'VMware', 'Windows Server', 'Linux'],
        pricing: 'Starting from $2,000/month',
        timeline: '3-6 weeks for implementation',
        tagline: 'Infrastructure so solid, your business can build anything on it.'
      },
      '7': {
        id: '7',
        title: 'Profile Verification',
        description: 'Turn your LinkedIn profile from "probably real" to "absolutely verified"',
        icon: <VerifiedUserIcon />,
        longDescription: [
          'Ever wonder why some professionals get flooded with job offers while others can\'t get a callback? The difference isn\'t just skill—it\'s credibility. In a world where anyone can claim to be anything on their resume, verification is your secret weapon.',
          'We don\'t just check a few boxes and call it verification. We conduct a thorough investigation that would make Sherlock Holmes proud. Every degree, every job title, every skill gets the verification treatment.',
          'The result? A profile so trustworthy that employers don\'t just notice you—they trust you. And in today\'s competitive job market, trust is the currency that gets you hired.'
        ],
        benefits: [
          {
            title: 'Verification That Actually Works',
            description: 'Forget those "verified" badges that anyone can get. Our verification process is so thorough, employers know that when they see our badge, they\'re looking at the real deal.',
            icon: <VerifiedUserIcon />
          },
          {
            title: 'Background Checks That Impress',
            description: 'We verify everything—your education, your work history, your skills. No more awkward moments when an employer asks about that "master\'s degree" you mentioned.',
            icon: <SecurityIcon />
          },
          {
            title: 'Trust That Opens Doors',
            description: 'When employers see our verification badge, they don\'t just see your skills—they see your integrity. And that\'s the kind of professional they want on their team.',
            icon: <BusinessCenterIcon />
          },
          {
            title: 'Credibility That Gets You Hired',
            description: 'In a sea of unverified profiles, yours stands out like a lighthouse. Employers know they can trust what they see, and that trust translates into job offers.',
            icon: <PeopleIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Deep Dive Investigation',
            description: 'We examine every claim on your profile with the thoroughness of a forensic investigator. Every degree, every job, every skill gets verified through official channels.'
          },
          {
            step: 2,
            title: 'The Credential Verification',
            description: 'We contact your universities, previous employers, and certification bodies to confirm every detail. No shortcuts, no assumptions—just the truth.'
          },
          {
            step: 3,
            title: 'The Skills Validation',
            description: 'We don\'t just take your word for your skills—we test them. Through practical assessments and real-world challenges, we prove you can do what you say you can do.'
          },
          {
            step: 4,
            title: 'The Trust Badge',
            description: 'Once everything checks out, you get our coveted verification badge—a symbol of trust that employers recognize and respect.'
          },
          {
            step: 5,
            title: 'The Ongoing Monitoring',
            description: 'Verification isn\'t a one-time thing. We continuously monitor and update your verification status to ensure it stays current and trustworthy.'
          }
        ],
        technologies: ['Identity Verification', 'Background Checks', 'Education Verification', 'Skills Testing', 'Document Verification', 'Reference Checks'],
        pricing: 'Starting from $199',
        timeline: '3-5 business days',
        tagline: 'Verification so thorough, even your mother would be impressed.'
      },
      '8': {
        id: '8',
        title: 'Skill Assessment',
        description: 'Prove your skills are as sharp as your resume says they are',
        icon: <AssessmentIcon />,
        longDescription: [
          'Your resume says you\'re a "Python expert," but can you actually write code that doesn\'t make other developers cringe? Our skill assessments don\'t just test what you know—they test what you can do.',
          'We\'ve designed assessments that challenge you in ways that matter. Real-world problems, actual coding challenges, and scenarios that mirror what you\'ll face on the job.',
          'The result? A skill profile that doesn\'t just list your abilities—it proves them. And when employers see our assessment results, they know they\'re looking at someone who can actually deliver.'
        ],
        benefits: [
          {
            title: 'Tests That Challenge You',
            description: 'Forget multiple-choice questions that anyone can guess. Our assessments use real-world problems that actually test your ability to think, code, and solve problems like a pro.',
            icon: <AssessmentIcon />
          },
          {
            title: 'Coding Challenges That Show Genius',
            description: 'Our coding challenges are designed by industry experts who know what separates good developers from great ones. Show your skills, not just your knowledge.',
            icon: <CodeIcon />
          },
          {
            title: 'Problem-Solving That Proves Worth',
            description: 'We test your ability to think on your feet, adapt to new situations, and solve problems under pressure. The skills that actually matter in the real world.',
            icon: <AnalyticsIcon />
          },
          {
            title: 'Evaluation That Gets You Hired',
            description: 'Our assessment results are so detailed and accurate that employers use them to make hiring decisions. Your skills don\'t just look good—they look hireable.',
            icon: <VerifiedUserIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Skills Inventory',
            description: 'We start by understanding what you claim to know and what you actually need to prove. Every skill gets its own customized assessment.'
          },
          {
            step: 2,
            title: 'The Challenge Design',
            description: 'We create assessments that mirror real-world scenarios. No theoretical questions—just practical challenges that test your actual ability to perform.'
          },
          {
            step: 3,
            title: 'The Assessment Experience',
            description: 'You take the assessments at your own pace, in your own environment. We want to see how you actually work, not how you perform under artificial pressure.'
          },
          {
            step: 4,
            title: 'The Expert Evaluation',
            description: 'Our industry experts review your work with the same standards they\'d use in a real job interview. Fair, thorough, and brutally honest.'
          },
          {
            step: 5,
            title: 'The Skills Profile',
            description: 'You get a detailed skills profile that shows not just what you know, but how well you know it. The kind of proof that gets you hired.'
          }
        ],
        technologies: ['Coding Challenges', 'Problem Solving', 'Technical Tests', 'Real-World Scenarios', 'Expert Evaluation', 'Skills Profiling'],
        pricing: 'Starting from $149',
        timeline: '2-3 hours per assessment',
        tagline: 'Skills that speak louder than words—and get you hired faster.'
      },
      '9': {
        id: '9',
        title: 'Job Matching',
        description: 'Stop applying to jobs that don\'t want you—find the ones that do',
        icon: <BusinessCenterIcon />,
        longDescription: [
          'Tired of sending out hundreds of resumes and getting crickets in return? The problem isn\'t your skills—it\'s your strategy. You\'re applying to jobs that don\'t want you instead of finding the ones that do.',
          'Our AI-powered matching system doesn\'t just look at keywords on your resume. It understands your career goals, your work style, your values, and matches you with opportunities that actually fit.',
          'The result? Job applications that get responses, interviews that lead to offers, and career moves that actually make sense. Stop wasting time on the wrong opportunities and start finding the right ones.'
        ],
        benefits: [
          {
            title: 'Matching That Actually Works',
            description: 'Our AI doesn\'t just match keywords—it matches people. We understand what makes you tick and find opportunities that align with your goals, values, and work style.',
            icon: <BusinessCenterIcon />
          },
          {
            title: 'Recommendations That Make Sense',
            description: 'Forget generic job suggestions. We provide personalized recommendations based on your unique profile, career goals, and what you actually want to do with your life.',
            icon: <AnalyticsIcon />
          },
          {
            title: 'Career Analysis That Guides You',
            description: 'We don\'t just find you jobs—we help you understand your career path. Where you\'ve been, where you\'re going, and what opportunities will get you there.',
            icon: <VerifiedUserIcon />
          },
          {
            title: 'Interview Prep That Gets You Hired',
            description: 'Once we find you the right opportunity, we help you nail the interview. From practice questions to salary negotiation, we prepare you for success.',
            icon: <PeopleIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Profile Deep Dive',
            description: 'We analyze your skills, experience, goals, and preferences to understand what makes you tick. The more we know about you, the better we can match you.'
          },
          {
            step: 2,
            title: 'The Opportunity Scan',
            description: 'Our AI scans thousands of job opportunities to find the ones that actually match your profile. No more applying to jobs that don\'t want you.'
          },
          {
            step: 3,
            title: 'The Smart Matching',
            description: 'We use advanced algorithms to match you with opportunities that align with your goals, skills, and work style. Quality over quantity, every time.'
          },
          {
            step: 4,
            title: 'The Application Strategy',
            description: 'We help you craft applications that get noticed. From resume optimization to cover letter writing, we make sure you stand out from the crowd.'
          },
          {
            step: 5,
            title: 'The Interview Success',
            description: 'We prepare you for interviews with practice questions, salary negotiation tips, and strategies that actually work. Your success is our success.'
          }
        ],
        technologies: ['AI Matching', 'Career Analysis', 'Resume Optimization', 'Interview Prep', 'Salary Negotiation', 'Job Market Intelligence'],
        pricing: 'Starting from $299',
        timeline: '1-2 weeks for matching',
        tagline: 'Job hunting that actually works—because we do the work for you.'
      },
      '10': {
        id: '10',
        title: 'Talent Acquisition',
        description: 'Find the perfect candidate without the usual hiring headaches',
        icon: <PeopleIcon />,
        longDescription: [
          'Hiring is hard. Really hard. You post a job, get 500 applications, and 499 of them are from people who clearly didn\'t read the job description. Sound familiar?',
          'We don\'t just send you resumes—we send you candidates. Pre-screened, pre-verified, pre-qualified professionals who actually match what you\'re looking for.',
          'The result? Faster hiring, better candidates, and less time wasted on interviews that go nowhere. Your hiring process becomes a competitive advantage instead of a necessary evil.'
        ],
        benefits: [
          {
            title: 'Screening That Saves Time',
            description: 'We do the heavy lifting so you don\'t have to. Every candidate we send you has been thoroughly screened, verified, and pre-qualified. No more wasting time on unqualified applicants.',
            icon: <PeopleIcon />
          },
          {
            title: 'Validation That Builds Confidence',
            description: 'Every candidate comes with verified skills, confirmed experience, and proven abilities. You know what you\'re getting before you even meet them.',
            icon: <VerifiedUserIcon />
          },
          {
            title: 'Culture Fit That Actually Fits',
            description: 'We don\'t just match skills—we match people. Our candidates fit your culture, share your values, and are the kind of people you actually want to work with.',
            icon: <BusinessCenterIcon />
          },
          {
            title: 'Support That Gets Results',
            description: 'We don\'t just send you candidates and disappear. We support you through the entire hiring process, from initial screening to final offer negotiation.',
            icon: <AnalyticsIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'The Requirements Analysis',
            description: 'We understand exactly what you\'re looking for—not just the skills, but the personality, work style, and cultural fit that will make someone successful in your organization.'
          },
          {
            step: 2,
            title: 'The Candidate Search',
            description: 'We search our verified talent pool to find candidates who match your requirements. No more sifting through hundreds of unqualified applications.'
          },
          {
            step: 3,
            title: 'The Pre-Screening',
            description: 'We interview candidates, verify their skills, and assess their fit before we send them to you. Quality over quantity, every time.'
          },
          {
            step: 4,
            title: 'The Candidate Presentation',
            description: 'We present you with detailed profiles of pre-qualified candidates, complete with skills assessments, cultural fit analysis, and our recommendations.'
          },
          {
            step: 5,
            title: 'The Hiring Support',
            description: 'We support you through interviews, reference checks, and offer negotiation. Your success is our success, and we\'re invested in making it work.'
          }
        ],
        technologies: ['Candidate Screening', 'Skills Verification', 'Cultural Assessment', 'Reference Checks', 'Interview Coordination', 'Offer Negotiation'],
        pricing: 'Starting from $2,500 per hire',
        timeline: '2-4 weeks per position',
        tagline: 'Hiring that actually works—because we do the hard part for you.'
      }
    };

    return serviceData[serviceId] || {
        id: id,
        title: 'IT Services',
        description: 'Comprehensive IT solutions for your business needs',
        icon: <CodeIcon />,
      longDescription: [
        'Our comprehensive service is designed to meet your specific needs and deliver exceptional results.',
        'With years of industry experience and a team of skilled professionals, we provide solutions that help you achieve your goals and overcome challenges.',
        'We use cutting-edge technologies and methodologies to ensure that our service meets the highest standards of quality and effectiveness.'
      ],
        benefits: [
          {
            title: 'Expert Support',
            description: '24/7 technical support from certified professionals',
            icon: <VerifiedUserIcon />
          },
          {
            title: 'Custom Solutions',
            description: 'Tailored IT solutions to meet your specific requirements',
            icon: <DevicesIcon />
          },
          {
            title: 'Security First',
            description: 'Enterprise-grade security measures to protect your data',
            icon: <SecurityIcon />
          }
        ],
        process: [
          {
            step: 1,
            title: 'Initial Consultation',
            description: 'We discuss your requirements and goals'
          },
          {
            step: 2,
            title: 'Solution Design',
            description: 'Our experts design a customized solution'
          },
          {
            step: 3,
            title: 'Implementation',
            description: 'We implement the solution with minimal disruption'
          },
          {
            step: 4,
            title: 'Ongoing Support',
            description: 'Continuous monitoring and support'
          }
        ]
    };
  };

  useEffect(() => {
    // Simulated API call to get service details
    setTimeout(() => {
      setService(getServiceDetails(id || '1'));
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <BackButton
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back to Services
        </BackButton>

        <DetailHero>
          <Container>
            <Box display="flex" alignItems="center" mb={4}>
              <ServiceIconLarge>
                {service.icon}
              </ServiceIconLarge>
              <Box ml={3}>
                <Typography variant="h3" component="h1" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {service.description}
                </Typography>
              </Box>
            </Box>
          </Container>
        </DetailHero>

        <ContentSection>
          <Container>
            <SectionTitle variant="h4">Benefits</SectionTitle>
            <BoxGrid>
              {service.benefits.map((benefit: any, index: number) => (
                <BoxGridItem key={index} xs={12} sm={6} md={4}>
                  <BenefitCard>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box mr={2} color="primary.main">
                        {benefit.icon}
                      </Box>
                      <BenefitTitle variant="h6">
                        {benefit.title}
                      </BenefitTitle>
                    </Box>
                    <BenefitDescription>
                      {benefit.description}
                    </BenefitDescription>
                  </BenefitCard>
                </BoxGridItem>
              ))}
            </BoxGrid>
          </Container>
        </ContentSection>

        <ContentSection>
          <Container>
            <SectionTitle variant="h4">Our Process</SectionTitle>
            {service.process.map((step: any) => (
              <ProcessStep key={step.step}>
                <StepNumber>{step.step}</StepNumber>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </ProcessStep>
            ))}
          </Container>
        </ContentSection>

        <ContentSection>
          <Container>
            <SectionTitle variant="h4">Contact Us</SectionTitle>
            <ContactFormCard>
              <form onSubmit={handleFormSubmit}>
                <StyledTextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                />
                <SubmitButton
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Send Message
                </SubmitButton>
              </form>
            </ContactFormCard>
          </Container>
        </ContentSection>
      </Container>
    </PageContainer>
  );
};

export default ServiceDetail; 