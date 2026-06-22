export type EmployeeType = "full-time" | "part-time" | "contractor-individual" | "contractor-company";
export type DepartmentType = "engineering" | "hr" | "finance" | "none";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
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
          { id: "step-1-1", title: "Update Profile Picture", description: "Upload a crisp corporate headshot.", isCompleted: false, actionUrl: "/settings/profile" },
          { id: "step-1-2", title: "Review Vision & Mission Document", description: "Read the core organizational playbook.", isCompleted: false, actionUrl: "/documents/vision" },
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
          { id: "step-ft-1", title: "Select Medical & Dental Plan", description: "Choose coverage options for yourself and dependents.", isCompleted: false },
          { id: "step-ft-2", title: "Set Up 401(k) Contribution", description: "Define your pre-tax or Roth retirement savings rate.", isCompleted: false },
          { id: "step-ft-3", title: "Submit Direct Deposit Form", description: "Provide routing and account numbers for payroll deposit.", isCompleted: false },
        ],
      },
      {
        id: "stage-ft-corporate",
        name: "Corporate Framework & Performance",
        isMandatory: false,
        dependsOn: { stages: ["stage-ft-benefits"], order: 3 },
        steps: [
          { id: "step-ft-4", title: "Sign Employee Handbook", description: "Acknowledge company policies, standards, and guidelines.", isCompleted: false },
          { id: "step-ft-5", title: "Complete Code of Ethics Training", description: "Read the modules and complete the compliance assessment.", isCompleted: false },
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
          { id: "step-pt-1", title: "Define Weekly Availability", description: "Provide your weekly work window preferences to your manager.", isCompleted: false },
          { id: "step-pt-2", title: "Review Maximum Hour Policies", description: "Acknowledge the part-time hourly weekly limit rules.", isCompleted: false },
        ],
      },
      {
        id: "stage-pt-compliance",
        name: "Part-Time Compliance & Timesheets",
        isMandatory: false,
        dependsOn: { stages: ["stage-pt-logistics"], order: 3 },
        steps: [
          { id: "step-pt-3", title: "Timesheet System Training", description: "Watch the 5-minute guide on logging daily shift hours.", isCompleted: false },
          { id: "step-pt-4", title: "Submit Payment Details", description: "Configure hourly payment deposit settings.", isCompleted: false },
        ],
      },
    ],
  },

  {
    id: "contractor-special-pipeline",
    title: "Contractor Compliance",
    targetTypes: ["contractor-individual", "contractor-company"],
    targetDepartments: ["engineering", "hr", "finance", "none"],
    stages: [
      {
        id: "stage-legal-compliance",
        name: "Legal & Compliance Auditing",
        isMandatory: true,
        dependsOn: { stages: ["stage-org-profile"], order: 2 },
        steps: [
          { id: "step-2-1", title: "Sign Master Services Agreement (MSA)", description: "Review and e-sign legal contract terms.", isCompleted: false },
          { id: "step-2-2", title: "Upload Liability Insurance Cert", description: "Required for compliance validation.", isCompleted: false, requiresSpecialView: true },
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
            dependsOn: { steps: [], order: 1 },
          },
          {
            id: "step-3-2",
            title: "Clone Core Monorepository",
            description: "Follow the README to pull down local environment dependencies.",
            isCompleted: false,
            dependsOn: { steps: ["step-3-1"], order: 2 },
          },
          {
            id: "step-3-3",
            title: "Install Required CLI Tools",
            description: "Run the setup script to install Node.js, Docker, and Terraform.",
            isCompleted: false,
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
            dependsOn: { steps: [], order: 1 },
          },
          {
            id: "step-4-2",
            title: "Generate SSH Key Pair",
            description: "Create and register your SSH key for secure repository access.",
            isCompleted: false,
            dependsOn: { steps: ["step-4-1"], order: 2 },
          },
          {
            id: "step-4-3",
            title: "Request AWS IAM Credentials",
            description: "Submit a ticket for your scoped cloud infrastructure access.",
            isCompleted: false,
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
          { id: "step-5-1", title: "Join #engineering Slack Channel", description: "Get plugged into the team's primary communication hub.", isCompleted: false },
          { id: "step-5-2", title: "Schedule 1:1 with Tech Lead", description: "Book a 30-minute introductory sync with your assigned tech lead.", isCompleted: false },
          { id: "step-5-3", title: "Review Engineering Handbook", description: "Read through code standards, PR conventions, and deployment processes.", isCompleted: false },
          { id: "step-5-4", title: "Complete First Good-First-Issue", description: "Pick up a tagged starter ticket and submit your first pull request.", isCompleted: false },
        ],
      },
    ],
  },
];
