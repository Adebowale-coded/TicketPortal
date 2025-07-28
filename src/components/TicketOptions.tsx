export interface TicketIssue {
    name: string;
    department: string;
    issues: string[];
}

export interface TicketCategory {
    category: string;
    subcategories: TicketIssue[];
}


const ticketOptions = [
    {
        category: "Software",
        subcategories: [
            {
                name: "Finacle",
                department: "IT Support",
                issues: [
                    "Finacle login failure during peak hours",
                    "Account statement not generating in Finacle",
                    "Error while posting transactions in Finacle",
                    "Finacle reports not loading or timing out",
                    "Customer details not syncing across Finacle modules"
                ]
            },
            {
                name: "Installation",
                department: "IT Support",
                issues: [
                    "Unable to install teller transaction software",
                    "CRM tool not installing on PC",
                    "Antivirus failed to install on customer service system"
                ]
            },
            {
                name: "Bug",
                department: "IT Support",
                issues: [
                    "Customer onboarding software freezes at BVN input",
                    "GL account screen not loading on teller workstation",
                    "Loan calculator crashing on officer's system",
                    "Blue screen"
                ]
            },
            {
                name: "Update",
                department: "IT Support",
                issues: [
                    "System slow after last update",
                    "CRM update removed important features",
                    "Teller application prompts 'update failed' message"
                ]
            },
            {
                name: "Other Apps",
                department: "IT Support",
                
            }
        ]
    },
    {
        category: "Network",
        subcategories: [
            {
                name: "Connectivity",
                department: "Network",
                issues: [
                    "No internet access in customer service area",
                    "LAN port not working on manager's PC",
                    "Frequent disconnection from core banking portal"
                ]
            },
            {
                name: "Email",
                department: "Network",
                issues: [
                    "Cannot log into Outlook email",
                    "Branch email not syncing",
                    "Forgotten email password - can't reset"
                ]
            }
        ]
    },
    {
        category: "Hardware",
        subcategories: [
            {
                name: "Printer",
                department: "Channels",
                issues: [
                    "Receipt printer not printing deposit slips",
                    "Teller printer showing paper jam",
                    "Loan printer producing blurry documents"
                ]
            },
            {
                name: "ATM",
                department: "Channels",
                issues: [
                    "ATM not dispensing cash",
                    "ATM screen blank",
                    "ATM out of service despite cash loaded"
                ]
            }
        ]
    },
    {
        category: "Other Categories",
        subcategories: [
            {
                name: "Other Categories",
                department: "IT Support",
                
            }
        ]
    },
];



export default ticketOptions;
