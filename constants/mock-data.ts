export type EmployeeType = "full-time" | "part-time" | "contractor-individual" | "contractor-company";
export type DepartmentType = "engineering" | "hr" | "finance" | "none";

export type FieldType = "text" | "password" | "tel" | "email" | "checkbox" | "signature" | "info_block" | "radio_card_group" | "slider" | "terminal_block" | "authenticator" | "action_button" | "datetime" | "input_group";

export interface StepField {
  id: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  content?: string;
  required?: boolean;
  options?: { id: string; title: string; desc?: string }[];
  min?: number;
  max?: number;
  inputs?: { id: string; label: string; placeholder?: string; maxLength?: number }[];
  commands?: { prefix?: string; text: string; color?: string; bold?: boolean }[];
  actionText?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueOffsetDays: number;
  dueStatus: "overdue" | "due-soon" | "normal" | "warning";
  isManualAcknowledgement?: boolean;
  requiresSpecialView?: boolean;
  blocksRoutes?: string[];
  actionUrl?: string;
  fields?: StepField[];
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
            fields: [
              { id: "medicalPlan", type: "radio_card_group", label: "Choose Coverage Option", required: true, options: [
                { id: "ppo", title: "Standard PPO", desc: "Low copays, wide network." },
                { id: "hdhp", title: "HDHP HSA", desc: "Tax-free savings account." },
                { id: "hmo", title: "Premier HMO", desc: "No deductibles, local care." },
              ]}
            ]
          },
          { 
            id: "step-ft-2", 
            title: "Set Up 401(k) Contribution", 
            description: "Define your pre-tax or Roth retirement savings rate.", 
            isCompleted: false,
            dueOffsetDays: 7,
            dueStatus: "normal",
            fields: [
              { id: "contributionRate", type: "slider", label: "Retirement Savings Contribution", min: 0, max: 15, required: true }
            ]
          },
          { 
            id: "step-ft-3", 
            title: "Submit Direct Deposit Form", 
            description: "Provide routing and account numbers for payroll deposit.", 
            isCompleted: false,
            dueOffsetDays: 7,
            dueStatus: "normal",
            fields: [
              { id: "directDeposit", type: "input_group", label: "Bank Account Information", required: true, inputs: [
                { id: "routing", label: "Routing Number", placeholder: "9 Digits", maxLength: 9 },
                { id: "account", label: "Account Number", placeholder: "Up to 12 Digits", maxLength: 12 }
              ]}
            ]
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
            fields: [
              { id: "shifts", type: "checkbox", label: "I have submitted my shift preferences to my manager.", required: true }
            ]
          },
          { 
            id: "step-pt-2", 
            title: "Review Maximum Hour Policies", 
            description: "Acknowledge the part-time hourly weekly limit rules.", 
            isCompleted: false,
            dueOffsetDays: 5,
            dueStatus: "normal",
            fields: [
              { id: "ptInfo", type: "info_block", label: "Part-Time Hourly Compliance", content: "⚠️ Maximum Weekly Threshold: 29 Hours\n\nPart-time workers are strictly prohibited from logging more than 29 hours in a single pay cycle without pre-authorization from the regional operations director." },
              { id: "hoursAgreed", type: "checkbox", label: "I have read and agree to the hours limit.", required: true }
            ]
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
            dueStatus: "normal",
            fields: [
              { id: "password", type: "password", placeholder: "New Secure Password", required: true }
            ]
          },
          { 
            id: "step-2-2", 
            title: "Personal Information Setup", 
            description: "Confirm your full legal name and default contact phone number.", 
            isCompleted: false,
            dueOffsetDays: 0,
            dueStatus: "normal",
            fields: [
              { id: "fullName", type: "text", placeholder: "Legal Full Name", required: true },
              { id: "phoneNumber", type: "tel", placeholder: "Phone Number (e.g. +234 80 123 4567)", required: true }
            ]
          },
          { 
            id: "step-2-3", 
            title: "Policy & Document Acknowledgement", 
            description: "Review and electronically sign the master compliance and services agreement.", 
            isCompleted: false,
            dueOffsetDays: 0,
            dueStatus: "normal",
            fields: [
              { id: "msa_info", type: "info_block", label: "Master Compliance Policy Agreement", content: "By signing below, you agree to comply with all information security frameworks, multi-factor authentication protocols, and regular credential lifecycle audits established by the operations division.\n\nAny non-compliance may result in immediate suspension of access keys to internal system repositories." },
              { id: "signature", type: "signature", placeholder: "Type Full Name to E-Sign", required: true },
              { id: "policyAgreed", type: "checkbox", label: "I acknowledge that I have read and agree to all company compliance policies.", required: true }
            ]
          },
          { 
            id: "step-2-4", 
            title: "Accept Acceptable Use Policy", 
            description: "Confirm understanding of IT and data usage policies.", 
            isCompleted: false,
            dueOffsetDays: 0,
            dueStatus: "normal",
            fields: [
              { id: "aup_agreed", type: "checkbox", label: "I confirm understanding of IT and data usage policies.", required: true }
            ]
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
            dependsOn: { steps: [], order: 1 },
            fields: [
              { id: "gitHubEmail", type: "email", label: "GitHub Account Email", placeholder: "e.g. dev@company.com", required: true }
            ]
          },
          {
            id: "step-3-2",
            title: "Clone Core Monorepository",
            description: "Follow the README to pull down local environment dependencies.",
            isCompleted: false,
            dueOffsetDays: 1,
            dueStatus: "due-soon",
            dependsOn: { steps: ["step-3-1"], order: 2 },
            fields: [
              { id: "terminalClone", type: "terminal_block", label: "bash — clone", commands: [
                { text: "# Clone the repository", color: "text-zinc-500" },
                { prefix: "$", text: "git clone git@github.com:org/monorepo.git", color: "text-emerald-400" }
              ]}
            ]
          },
          {
            id: "step-3-3",
            title: "Install Required CLI Tools",
            description: "Run the setup script to install Node.js, Docker, and Terraform.",
            isCompleted: false,
            dueOffsetDays: 6,
            dueStatus: "normal",
            dependsOn: { steps: ["step-3-2"], order: 3 },
            fields: [
              { id: "terminalNpm", type: "terminal_block", label: "bash — npm", commands: [
                { prefix: "user@mac:~/monorepo$", text: "npm run setup-cli", color: "text-zinc-300" },
                { text: "Installing node packages... done.", color: "text-amber-400" },
                { text: "✓ Terraform and AWS CLI verified!", color: "text-emerald-400", bold: true }
              ]}
            ]
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
            description: "Secure your GitHub account with a YubiKey or authenticator app.",
            isCompleted: false,
            dueOffsetDays: 1,
            dueStatus: "normal",
            isManualAcknowledgement: false,
            blocksRoutes: ["/engineering"],
            fields: [
              { id: "2fa-code", type: "authenticator", label: "Enter Authenticator Code", required: true }
            ]
          },
          {
            id: "step-4-2",
            title: "Generate SSH Key",
            description: "Create an Ed25519 SSH key for secure repo access.",
            isCompleted: false,
            dueOffsetDays: 1,
            dueStatus: "warning",
            isManualAcknowledgement: false,
            blocksRoutes: ["/engineering"],
            dependsOn: { steps: ["step-4-1"], order: 2 },
            fields: [
              { id: "keygen-cmd", type: "terminal_block", label: "bash", commands: [{ prefix: "$", text: "ssh-keygen -t ed25519 -C \"you@company.com\"", color: "text-emerald-400" }] },
              { id: "keygen-action", type: "action_button", label: "Execute ssh-keygen Locally" },
              { id: "keygen-confirm", type: "checkbox", label: "I have securely backed up my private key", required: true }
            ]
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
            fields: [
              { id: "slackJoin", type: "action_button", label: "Launch Messaging Platform", actionText: "Join #engineering Channel", required: true }
            ]
          },
          { 
            id: "step-5-2", 
            title: "Schedule 1:1 with Tech Lead", 
            description: "Book a 30-minute introductory sync with your assigned tech lead.", 
            isCompleted: false,
            dueOffsetDays: 7,
            dueStatus: "normal",
            fields: [
              { id: "syncTime", type: "datetime", label: "Select Sync Time", required: true }
            ]
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

export const alwaysAllowedRoutes = ["/dashboard", "/task/*"];
