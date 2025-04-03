// Types for our data
export interface Grant {
  id: string;
  ministry: string;
  program: string;
  recipient: string;
  fiscalYear: string;
  amount: number;
  flagged: boolean;
  flagReason?: string;
}

interface YearlyTotal {
  year: string;
  total: number;
}

interface MinistryTotal {
  ministry: string;
  total: number;
  color: string;
}

interface KeyMetric {
  title: string;
  value: string | number;
  description?: string;
}

// Sample data for demonstration
export const grantsData: Grant[] = [
  { id: "1", ministry: "HEALTH", program: "Healthcare Facilities", recipient: "Alberta Health Services", fiscalYear: "2023-2024", amount: 15400000, flagged: false },
  { id: "2", ministry: "EDUCATION", program: "School Infrastructure", recipient: "Edmonton Public Schools", fiscalYear: "2023-2024", amount: 7500000, flagged: false },
  { id: "3", ministry: "ADVANCED EDUCATION", program: "Research Funding", recipient: "University of Alberta", fiscalYear: "2023-2024", amount: 3200000, flagged: false },
  { id: "4", ministry: "MUNICIPAL AFFAIRS", program: "Urban Development", recipient: "City of Calgary", fiscalYear: "2023-2024", amount: 5100000, flagged: true, flagReason: "Unusual increase from previous year" },
  { id: "5", ministry: "AGRICULTURE AND IRRIGATION", program: "Sustainable Farming", recipient: "Alberta Agriculture Association", fiscalYear: "2023-2024", amount: 2800000, flagged: false },
  { id: "6", ministry: "ENVIRONMENT AND PROTECTED AREAS", program: "Conservation Efforts", recipient: "Alberta Conservation Society", fiscalYear: "2022-2023", amount: 1950000, flagged: false },
  { id: "7", ministry: "TECHNOLOGY AND INNOVATION", program: "Tech Startups", recipient: "Alberta Innovates", fiscalYear: "2022-2023", amount: 4200000, flagged: false },
  { id: "8", ministry: "HEALTH", program: "Mental Health Services", recipient: "Mental Health Alberta", fiscalYear: "2022-2023", amount: 3700000, flagged: true, flagReason: "Disbursement timing anomaly" },
  { id: "9", ministry: "EDUCATION", program: "Digital Learning", recipient: "Rural School Districts", fiscalYear: "2022-2023", amount: 2100000, flagged: false },
  { id: "10", ministry: "INDIGENOUS RELATIONS", program: "Community Support", recipient: "Treaty 7 Management Corp", fiscalYear: "2021-2022", amount: 1800000, flagged: false },
  { id: "11", ministry: "TRANSPORTATION AND ECONOMIC CORRIDORS", program: "Highway Development", recipient: "Alberta Transportation", fiscalYear: "2021-2022", amount: 12500000, flagged: false },
  { id: "12", ministry: "SENIORS COMMUNITY AND SOCIAL SERVICES", program: "Senior Care", recipient: "Alberta Seniors Care", fiscalYear: "2021-2022", amount: 4900000, flagged: false },
];

// Sample yearly total data
export const yearlyTotals: YearlyTotal[] = [
  { year: "2014-2015", total: 31172900000 },
  { year: "2015-2016", total: 32651700000 },
  { year: "2016-2017", total: 34380700000 },
  { year: "2017-2018", total: 34755800000 },
  { year: "2018-2019", total: 43262900000 },
  { year: "2019-2020", total: 36125000000 },
  { year: "2020-2021", total: 40595800000 },
  { year: "2021-2022", total: 38193800000 },
  { year: "2022-2023", total: 39246100000 },
  { year: "2023-2024", total: 42986900000 },
  { year: "2024-2025", total: 34788676160 },
];

// Sample ministry total data for visualization
export const ministryTotals: MinistryTotal[] = [
  { ministry: "HEALTH", total: 230300000000, color: "#3498db" },
  { ministry: "EDUCATION", total: 62100000000, color: "#2ecc71" },
  { ministry: "ADVANCED EDUCATION", total: 25600000000, color: "#9b59b6" },
  { ministry: "MUNICIPAL AFFAIRS", total: 17600000000, color: "#e74c3c" },
  { ministry: "SENIORS COMMUNITY AND SOCIAL SERVICES", total: 8000000000, color: "#f39c12" },
  { ministry: "HUMAN SERVICES", total: 6500000000, color: "#1abc9c" },
  { ministry: "SENIORS AND HOUSING", total: 4800000000, color: "#d35400" },
  { ministry: "AGRICULTURE AND FORESTRY", total: 4300000000, color: "#27ae60" },
  { ministry: "TRANSPORTATION", total: 3600000000, color: "#2980b9" },
];

// Key metrics for dashboard
export const keyMetrics: KeyMetric[] = [
  { title: "Number of Grants", value: "1.77 Million", description: "Total number of grants across all ministries" },
  { title: "Total Grant Value", value: "$417.26 Billion", description: "Total funding disbursed across all years" },
  { title: "Fiscal Years", value: 11, description: "Number of fiscal years covered in the data" },
  { title: "Grant Programs", value: 3940, description: "Unique programs receiving funding" },
  { title: "Grant Recipients", value: 420271, description: "Unique recipients receiving grants" },
];

// List of ministries for filtering
export const ministries = [
  "HEALTH",
  "EDUCATION",
  "ADVANCED EDUCATION",
  "MUNICIPAL AFFAIRS",
  "SENIORS COMMUNITY AND SOCIAL SERVICES",
  "AGRICULTURE AND FORESTRY",
  "AGRICULTURE AND IRRIGATION",
  "TRANSPORTATION AND ECONOMIC CORRIDORS",
  "ENVIRONMENT AND PROTECTED AREAS",
  "TECHNOLOGY AND INNOVATION",
  "INDIGENOUS RELATIONS",
  "CHILDREN AND FAMILY SERVICES",
  "MENTAL HEALTH AND ADDICTION",
  "ARTS CULTURE AND STATUS OF WOMEN",
  "AFFORDABILITY AND UTILITIES",
  "ALL MINISTRIES"
];

// List of fiscal years for filtering
export const fiscalYears = [
  "2014-2015",
  "2015-2016",
  "2016-2017",
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "ALL YEARS"
];

// Sample flagging criteria
export const flaggingCriteria = [
  { id: "unusual_increase", name: "Unusual Increase", description: "Annual increase exceeds 40% of previous year's funding", enabled: true },
  { id: "unusual_decrease", name: "Unusual Decrease", description: "Annual decrease exceeds 40% of previous year's funding", enabled: true },
  { id: "statistical_outlier", name: "Statistical Outlier", description: "Grant amount is more than 3 standard deviations from the mean", enabled: true },
  { id: "disbursement_timing", name: "Disbursement Timing", description: "Funds disbursed outside of typical disbursement periods", enabled: true },
  { id: "recipient_concentration", name: "Recipient Concentration", description: "Single recipient receives more than 30% of a program's funding", enabled: false },
];

// Generate CSV for export
export const generateCSV = (data: Grant[]): string => {
  const headers = "ID,Ministry,Program,Recipient,Fiscal Year,Amount,Flagged,Flag Reason\n";
  
  const rows = data.map(grant => {
    return `${grant.id},"${grant.ministry}","${grant.program}","${grant.recipient}","${grant.fiscalYear}",${grant.amount},${grant.flagged},"${grant.flagReason || ''}"`
  }).join('\n');
  
  return headers + rows;
};

// Helper function to download CSV
export const downloadCSV = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate sample grant data for a specific ministry
export const getMinistryGrantData = (ministry: string, year?: string) => {
  if (ministry === "ALL MINISTRIES") {
    return [];
  }
  
  // Sample grant categories for each ministry
  const grantCategories: Record<string, string[]> = {
    "HEALTH": ["Healthcare Facilities", "Medical Research", "Public Health", "Emergency Services", "Mental Health"],
    "EDUCATION": ["School Infrastructure", "Teacher Training", "Student Support", "Digital Learning", "Special Education"],
    "ADVANCED EDUCATION": ["Research Funding", "Innovation Grants", "Scholarship Programs", "Campus Infrastructure", "International Programs"],
    "MUNICIPAL AFFAIRS": ["Urban Development", "Rural Infrastructure", "Community Services", "Public Transportation", "Waste Management"],
    "AGRICULTURE AND IRRIGATION": ["Sustainable Farming", "Water Management", "Crop Research", "Rural Development", "Agricultural Technology"],
    "ENVIRONMENT AND PROTECTED AREAS": ["Conservation Efforts", "Renewable Energy", "Wildlife Protection", "Climate Change Mitigation", "Water Protection"],
    "INDIGENOUS RELATIONS": ["Community Support", "Cultural Programs", "Economic Development", "Health Services", "Education Initiatives"],
    "SENIORS COMMUNITY AND SOCIAL SERVICES": ["Senior Care", "Community Centers", "Disability Support", "Family Services", "Housing Assistance"]
  };
  
  const categories = grantCategories[ministry] || 
    ["Program A", "Program B", "Program C", "Program D", "Program E"];
  
  // Find the ministry in the totals or use a default value
  const ministryData = ministryTotals.find(m => m.ministry === ministry);
  const total = ministryData?.total || 10000000;
  
  // Apply year filtering if provided
  let adjustedTotal = total;
  if (year && year !== "ALL YEARS") {
    const yearFactor = yearlyTotals.find(y => y.year === year)?.total || 0;
    const totalSum = yearlyTotals.reduce((sum, item) => sum + item.total, 0);
    const yearRatio = yearFactor / totalSum;
    adjustedTotal = Math.round(total * yearRatio * (0.7 + Math.random() * 0.6));
  }
  
  // Generate distribution
  const values: number[] = [];
  let remaining = adjustedTotal;
  
  for (let i = 0; i < categories.length - 1; i++) {
    // Distribute between 10-30% of remaining funds to each category
    const allocation = remaining * (0.1 + Math.random() * 0.2);
    values.push(Math.round(allocation));
    remaining -= allocation;
  }
  values.push(Math.round(remaining)); // Assign remaining funds to last category
  
  return categories.map((category, index) => ({
    name: category,
    value: values[index],
    color: `hsl(${120 + index * 40}, 70%, 60%)`
  }));
};
