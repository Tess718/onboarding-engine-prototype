export type EmployeeType = "full-time" | "part-time" | "contractor-individual" | "contractor-company";
export type DepartmentType = "engineering" | "hr" | "finance" | "none";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueOffsetDays: number;
  dueStatus: "overdue" | "due-soon" | "normal";
  isManualAcknowledgement?: boolean;
  requiresSpecialView?: boolean;
  actionUrl?: string;
  dependsOn?: {
    steps: string[];
    order?: number;
  };
}

export interface OnboardingStage {
  id: string;
  name: string;
  isMandatory: boolean;
  isSystemGate?: boolean;
  dependsOn: {
    stages: string[];
    order?: number;
  };
  steps: OnboardingStep[];
}

export interface OnboardingPipeline {
  id: string;
  title: string;
  targetTypes: EmployeeType[];
  targetDepartments?: DepartmentType[];
  stages: OnboardingStage[];
}

export const mock3DMatrixData: OnboardingPipeline[] = [
  {
    id: "org-pipeline-global",
    title: "Global Onboarding",
    targetTypes: ["full-time", "part-time", "contractor-individual", "contractor-company"],
    targetDepartments: ["engineering", "hr", "finance", "none"],
    stages: [
      {
        id: "stage-org-profile",
        name: "Organization Essentials",
        isMandatory: true,
        dependsOn: { stages: [], order: 1 },
        steps: [
          { 
            id: "step-1-1", 
            title: "Update Profile Picture", 
            description: "Upload a crisp corporate headshot.", 
            isCompleted: false, 
            dueOffsetDays: 2,
            dueStatus: "normal",
            isManualAcknowledgement: false,
            actionUrl: "/settings/profile" 
          },
          { 
            id: "step-1-2", 
            title: "Review Vision & Mission Document", 
            description: "Read the core organizational playbook.", 
            isCompleted: false, 
            dueOffsetDays: 3,
            dueStatus: "normal",
            isManualAcknowledgement: true,
            actionUrl: "/documents/vision" 
          },
        ],
      },
    ],
  },

  {
    id: "full-time-pipeline",
    title: "Full-Time Benefits & Corporate Structure",
    targetTypes: ["full-time"],
    targetDepartments: ["engineering", "hr", "finance", "none"],
    stages: [
      {
        id: "stage-ft-benefits",
        name: "Benefits & Payroll Enrollment",
        isMandatory: true,
        dependsOn: { stages: ["stage-org-profile"], order: 2 },
        steps: [
          { 
            id: "step-ft-1", 
            title: "Select Medical & Dental Plan", 
            description: "Choose coverage options for yourself and dependents.", 
            isCompleted: false,
            dueOffsetDays: 7,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
          { 
            id: "step-ft-2", 
            title: "Set Up 401(k) Contribution", 
            description: "Define your pre-tax or Roth retirement savings rate.", 
            isCompleted: false,
            dueOffsetDays: 7,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
          { 
            id: "step-ft-3", 
            title: "Submit Direct Deposit Form", 
            description: "Provide routing and account numbers for payroll deposit.", 
            isCompleted: false,
            dueOffsetDays: 7,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
        ],
      },
      {
        id: "stage-ft-corporate",
        name: "Corporate Framework & Performance",
        isMandatory: false,
        dependsOn: { stages: ["stage-ft-benefits"], order: 3 },
        steps: [
          { 
            id: "step-ft-4", 
            title: "Sign Employee Handbook", 
            description: "Acknowledge company policies, standards, and guidelines.", 
            isCompleted: false,
            dueOffsetDays: 14,
            dueStatus: "normal",
            isManualAcknowledgement: true
          },
          { 
            id: "step-ft-5", 
            title: "Complete Code of Ethics Training", 
            description: "Read the modules and complete the compliance assessment.", 
            isCompleted: false,
            dueOffsetDays: 14,
            dueStatus: "normal",
            isManualAcknowledgement: true
          },
        ],
      },
    ],
  },

  {
    id: "part-time-pipeline",
    title: "Part-Time Scheduling & Compliance",
    targetTypes: ["part-time"],
    targetDepartments: ["engineering", "hr", "finance", "none"],
    stages: [
      {
        id: "stage-pt-logistics",
        name: "Scheduling & Availability",
        isMandatory: true,
        dependsOn: { stages: ["stage-org-profile"], order: 2 },
        steps: [
          { 
            id: "step-pt-1", 
            title: "Define Weekly Availability", 
            description: "Provide your weekly work window preferences to your manager.", 
            isCompleted: false,
            dueOffsetDays: 5,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
          { 
            id: "step-pt-2", 
            title: "Review Maximum Hour Policies", 
            description: "Acknowledge the part-time hourly weekly limit rules.", 
            isCompleted: false,
            dueOffsetDays: 5,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
        ],
      },
      {
        id: "stage-pt-compliance",
        name: "Part-Time Compliance & Timesheets",
        isMandatory: false,
        dependsOn: { stages: ["stage-pt-logistics"], order: 3 },
        steps: [
          { 
            id: "step-pt-3", 
            title: "Timesheet System Training", 
            description: "Watch the 5-minute guide on logging daily shift hours.", 
            isCompleted: false,
            dueOffsetDays: 10,
            dueStatus: "normal",
            isManualAcknowledgement: true
          },
          { 
            id: "step-pt-4", 
            title: "Submit Payment Details", 
            description: "Configure hourly payment deposit settings.", 
            isCompleted: false,
            dueOffsetDays: 10,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
        ],
      },
    ],
  },

  {
    id: "identity-provisioning-pipeline",
    title: "Day-Zero Identity & Provisioning",
    targetTypes: ["full-time", "part-time", "contractor-individual", "contractor-company"],
    targetDepartments: ["engineering", "hr", "finance", "none"],
    stages: [
      {
        id: "stage-identity-gate",
        name: "Day-Zero Identity & Provisioning",
        isMandatory: true,
        isSystemGate: true,
        dependsOn: { stages: [], order: 0 },
        steps: [
          { 
            id: "step-2-1", 
            title: "Reset Temporary Password", 
            description: "Update your credentials for baseline security.", 
            isCompleted: false,
            dueOffsetDays: 0,
            dueStatus: "normal"
          },
          { 
            id: "step-2-2", 
            title: "Personal Information Setup", 
            description: "Confirm your full legal name and default contact phone number.", 
            isCompleted: false,
            dueOffsetDays: 0,
            dueStatus: "normal"
          },
          { 
            id: "step-2-3", 
            title: "Policy & Document Acknowledgement", 
            description: "Review and electronically sign the master compliance and services agreement.", 
            isCompleted: false,
            dueOffsetDays: 0,
            dueStatus: "normal"
          },
        ],
      },
    ],
  },

  {
    id: "engineering-department-pipeline",
    title: "Engineering Department",
    targetTypes: ["full-time", "part-time", "contractor-individual"],
    targetDepartments: ["engineering"],
    stages: [
      {
        id: "stage-engineering-tools",
        name: "Engineering Environment Setup",
        isMandatory: false,
        dependsOn: { stages: ["stage-org-profile"], order: 2 },
        steps: [
          {
            id: "step-3-1",
            title: "Submit GitHub Email",
            description: "Provide your email to automatically join the GitHub Org.",
            isCompleted: false,
            dueOffsetDays: 4,
            dueStatus: "normal",
            isManualAcknowledgement: false,
            dependsOn: { steps: [], order: 1 },
          },
          {
            id: "step-3-2",
            title: "Clone Core Monorepository",
            description: "Follow the README to pull down local environment dependencies.",
            isCompleted: false,
            dueOffsetDays: 1,
            dueStatus: "due-soon",
            isManualAcknowledgement: true,
            dependsOn: { steps: ["step-3-1"], order: 2 },
          },
          {
            id: "step-3-3",
            title: "Install Required CLI Tools",
            description: "Run the setup script to install Node.js, Docker, and Terraform.",
            isCompleted: false,
            dueOffsetDays: 6,
            dueStatus: "normal",
            isManualAcknowledgement: true,
            dependsOn: { steps: ["step-3-2"], order: 3 },
          },
        ],
      },
      {
        id: "stage-engineering-security",
        name: "Security & Access Provisioning",
        isMandatory: false,
        dependsOn: { stages: ["stage-engineering-tools"], order: 3 },
        steps: [
          {
            id: "step-4-1",
            title: "Enable 2FA on GitHub",
            description: "Two-factor authentication is mandatory for all engineering accounts.",
            isCompleted: false,
            dueOffsetDays: -2,
            dueStatus: "overdue",
            isManualAcknowledgement: false,
            dependsOn: { steps: [], order: 1 },
          },
          {
            id: "step-4-2",
            title: "Generate SSH Key Pair",
            description: "Create and register your SSH key for secure repository access.",
            isCompleted: false,
            dueOffsetDays: -2,
            dueStatus: "overdue",
            isManualAcknowledgement: false,
            dependsOn: { steps: ["step-4-1"], order: 2 },
          },
          {
            id: "step-4-3",
            title: "Request AWS IAM Credentials",
            description: "Submit a ticket for your scoped cloud infrastructure access.",
            isCompleted: false,
            dueOffsetDays: 3,
            dueStatus: "normal",
            isManualAcknowledgement: false,
            requiresSpecialView: true,
            dependsOn: { steps: ["step-4-2"], order: 3 },
          },
        ],
      },
      {
        id: "stage-engineering-team",
        name: "Team Integration & Culture",
        isMandatory: false,
        dependsOn: { stages: ["stage-engineering-security"], order: 4 },
        steps: [
          { 
            id: "step-5-1", 
            title: "Join #engineering Slack Channel", 
            description: "Get plugged into the team's primary communication hub.", 
            isCompleted: false,
            dueOffsetDays: 5,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
          { 
            id: "step-5-2", 
            title: "Schedule 1:1 with Tech Lead", 
            description: "Book a 30-minute introductory sync with your assigned tech lead.", 
            isCompleted: false,
            dueOffsetDays: 7,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
          { 
            id: "step-5-3", 
            title: "Review Engineering Handbook", 
            description: "Read through code standards, PR conventions, and deployment processes.", 
            isCompleted: false,
            dueOffsetDays: 10,
            dueStatus: "normal",
            isManualAcknowledgement: true
          },
          { 
            id: "step-5-4", 
            title: "Complete First Good-First-Issue", 
            description: "Pick up a tagged starter ticket and submit your first pull request.", 
            isCompleted: false,
            dueOffsetDays: 30,
            dueStatus: "normal",
            isManualAcknowledgement: false
          },
        ],
      },
    ],
  },
];
