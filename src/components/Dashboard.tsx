
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, LineChart, PieChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ministryTotals, yearlyTotals, keyMetrics, fiscalYears, ministries, grantsData } from "@/data/grantsData";
import { useToast } from "@/hooks/use-toast";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { AlertTriangle, Flag, Download, PieChartIcon, BarChart3, LineChart as LineChartIcon, PlusCircle, Info } from "lucide-react";
import DashboardFilters from "@/components/DashboardFilters";
import TopRecipientsTable from "@/components/TopRecipientsTable";
import DataQualityCard from "@/components/DataQualityCard";
import ReviewList from "@/components/ReviewList";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const dataQualityIssues = [
  { field: "Recipient Name", issueCount: 45, percentage: 3.2 },
  { field: "Ministry", issueCount: 12, percentage: 0.8 },
  { field: "Program Name", issueCount: 68, percentage: 4.8 },
  { field: "Business Unit", issueCount: 156, percentage: 11.1 },
  { field: "Amount", issueCount: 29, percentage: 2.1 },
  { field: "Fiscal Year", issueCount: 8, percentage: 0.6 }
];

const topRecipientsByAmount = [
  { id: "1", name: "Alberta Health Services", totalAmount: 25000000, grantCount: 3, isFlagged: false, riskFactors: ["Operational Grant"] },
  { id: "2", name: "University of Alberta", totalAmount: 18500000, grantCount: 8, isFlagged: false, riskFactors: ["Multiple Programs"] },
  { id: "3", name: "TransAlta Corporation", totalAmount: 15200000, grantCount: 2, isFlagged: false, riskFactors: ["Corporate Welfare", "Large Amount"] },
  { id: "4", name: "City of Calgary", totalAmount: 12400000, grantCount: 5, isFlagged: false, riskFactors: [] },
  { id: "5", name: "Suncor Energy Inc.", totalAmount: 11800000, grantCount: 1, isFlagged: false, riskFactors: ["Corporate Welfare", "Large Amount"] },
  { id: "6", name: "ATCO Group", totalAmount: 9200000, grantCount: 3, isFlagged: false, riskFactors: ["Corporate Welfare"] },
  { id: "7", name: "University of Calgary", totalAmount: 8500000, grantCount: 6, isFlagged: false, riskFactors: ["Multiple Programs"] },
  { id: "8", name: "Edmonton Public Schools", totalAmount: 7300000, grantCount: 2, isFlagged: false, riskFactors: [] },
  { id: "9", name: "Cenovus Energy Inc.", totalAmount: 6700000, grantCount: 1, isFlagged: false, riskFactors: ["Corporate Welfare"] },
  { id: "10", name: "Alberta Innovates", totalAmount: 5900000, grantCount: 4, isFlagged: false, riskFactors: [] }
];

const topRecipientsByProgramCount = [
  { id: "11", name: "University of Alberta", programCount: 8, totalAmount: 18500000, isFlagged: false, riskFactors: ["Multiple Programs", "High Program Count"] },
  { id: "12", name: "University of Calgary", programCount: 6, totalAmount: 8500000, isFlagged: false, riskFactors: ["Multiple Programs", "High Program Count"] },
  { id: "13", name: "City of Calgary", programCount: 5, totalAmount: 12400000, isFlagged: false, riskFactors: ["Multiple Programs"] },
  { id: "14", name: "Alberta Innovates", programCount: 4, totalAmount: 5900000, isFlagged: false, riskFactors: [] },
  { id: "15", name: "Athabasca University", programCount: 4, totalAmount: 3200000, isFlagged: false, riskFactors: [] },
  { id: "16", name: "City of Edmonton", programCount: 4, totalAmount: 4800000, isFlagged: false, riskFactors: [] },
  { id: "17", name: "NAIT", programCount: 3, totalAmount: 2700000, isFlagged: false, riskFactors: [] },
  { id: "18", name: "Alberta Health Services", programCount: 3, totalAmount: 25000000, isFlagged: false, riskFactors: ["Operational Grant", "Large Amount"] },
  { id: "19", name: "ATCO Group", programCount: 3, totalAmount: 9200000, isFlagged: false, riskFactors: ["Corporate Welfare"] },
  { id: "20", name: "SAIT", programCount: 3, totalAmount: 2200000, isFlagged: false, riskFactors: [] }
];

// Modified to better align with corporate welfare analysis
const programSpendingData = [
  { name: "Healthcare Infrastructure", value: 32500000, color: "#4338ca", riskLevel: "low" },
  { name: "Education Grants", value: 26800000, color: "#6d28d9", riskLevel: "low" },
  { name: "Municipal Support", value: 19300000, color: "#a21caf", riskLevel: "low" },
  { name: "Energy Innovation", value: 15700000, color: "#db2777", riskLevel: "high" },
  { name: "Transportation", value: 12400000, color: "#e11d48", riskLevel: "medium" },
  { name: "Environmental Protection", value: 10800000, color: "#0891b2", riskLevel: "low" },
  { name: "Corporate Development", value: 28500000, color: "#f43f5e", riskLevel: "high" },
  { name: "Other Programs", value: 14000000, color: "#4b5563", riskLevel: "medium" }
];

const spendingTrendsData = [
  { year: "2019-2020", totalSpending: 32000000, recipientCount: 120, averageGrant: 266667 },
  { year: "2020-2021", totalSpending: 45000000, recipientCount: 150, averageGrant: 300000 },
  { year: "2021-2022", totalSpending: 78000000, recipientCount: 190, averageGrant: 410526 },
  { year: "2022-2023", totalSpending: 95000000, recipientCount: 210, averageGrant: 452381 },
  { year: "2023-2024", totalSpending: 110000000, recipientCount: 230, averageGrant: 478261 }
];

const Dashboard = () => {
  const [yearFilter, setYearFilter] = useState("ALL YEARS");
  const [selectedMinistry, setSelectedMinistry] = useState("ALL MINISTRIES");
  const [corporateWelfareTab, setCorporateWelfareTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visualizationTab, setVisualizationTab] = useState("ministry");
  const [reviewListItems, setReviewListItems] = useState<any[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true); // Always expanded
  const [viewMode, setViewMode] = useState("dashboard");
  const { toast } = useToast();

  const [activeFilters, setActiveFilters] = useState({
    years: ["ALL YEARS"],
    ministries: ["ALL MINISTRIES"],
    programs: ["ALL PROGRAMS"],
    businessUnits: ["ALL BUSINESS UNITS"],
    excludeOperational: false
  });

  const corporateWelfarePrograms = grantsData.filter(grant => 
    (grant.recipient.includes("Corp") || grant.recipient.includes("Ltd") || grant.recipient.includes("Inc")) && 
    grant.amount > 5000000
  );

  const organizationGrantCounts = grantsData.reduce((acc, grant) => {
    acc[grant.recipient] = (acc[grant.recipient] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const multipleGrantRecipients = Object.entries(organizationGrantCounts)
    .filter(([_, count]) => count > 2)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .map(([recipient, count]) => ({ recipient, count }));

  const nonOperationalGrants = grantsData.filter(grant => 
    !grant.recipient.includes("Services") && 
    !grant.recipient.includes("Agency") && 
    !grant.recipient.includes("Department") &&
    !grant.recipient.includes("Authority")
  );

  const filteredData = (() => {
    if (yearFilter === "ALL YEARS") {
      return ministryTotals;
    }
    
    const yearFactor = yearlyTotals.find(y => y.year === yearFilter)?.total || 0;
    const totalSum = yearlyTotals.reduce((sum, item) => sum + item.total, 0);
    const yearRatio = yearFactor / totalSum;
    
    return ministryTotals.map(ministry => ({
      ...ministry,
      total: Math.round(ministry.total * yearRatio * (0.7 + Math.random() * 0.6))
    }));
  })();
  
  const THRESHOLD = 0.02;
  const totalSum = filteredData.reduce((sum, item) => sum + item.total, 0);
  
  const processedMinistryTotals = (() => {
    const largeMinistries = filteredData
      .filter(ministry => ministry.total / totalSum >= THRESHOLD)
      .sort((a, b) => b.total - a.total);
    
    const otherTotal = filteredData
      .filter(ministry => ministry.total / totalSum < THRESHOLD)
      .reduce((sum, ministry) => sum + ministry.total, 0);
    
    return [
      ...largeMinistries,
      { 
        ministry: 'Other Ministries', 
        total: otherTotal, 
        color: '#6B7280'
      }
    ];
  })();
  
  const currentYearTotal = filteredData.reduce((sum, item) => sum + item.total, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'long'
  }).format(currentYearTotal);

  // Generate ministry grant data when selectedMinistry changes
  useEffect(() => {
    if (selectedMinistry !== "ALL MINISTRIES") {
      console.log("Generating data for ministry:", selectedMinistry);
    }
  }, [selectedMinistry]);

  const generateMinistryGrantData = (ministry) => {
    if (ministry === "ALL MINISTRIES") {
      return [];
    }
    
    const grantCategories = {
      "HEALTH": ["Healthcare Facilities", "Medical Research", "Public Health", "Emergency Services", "Mental Health"],
      "EDUCATION": ["School Infrastructure", "Teacher Training", "Student Support", "Digital Learning", "Special Education"],
      "ADVANCED EDUCATION": ["Research Funding", "Innovation Grants", "Scholarship Programs", "Campus Infrastructure", "International Programs"],
      "MUNICIPAL AFFAIRS": ["Urban Development", "Rural Infrastructure", "Community Services", "Public Transportation", "Waste Management"],
      "AGRICULTURE AND IRRIGATION": ["Sustainable Farming", "Water Management", "Crop Research", "Rural Development", "Agricultural Technology"],
      "ENVIRONMENT AND PROTECTED AREAS": ["Conservation Efforts", "Renewable Energy", "Wildlife Protection", "Climate Change Mitigation", "Water Protection"],
      "TRANSPORTATION AND ECONOMIC CORRIDORS": ["Highway Development", "Bridge Repair", "Public Transit", "Rural Connectivity", "Air Transport"],
      "INDIGENOUS RELATIONS": ["Community Support", "Cultural Programs", "Economic Development", "Health Services", "Education Initiatives"],
      "SENIORS COMMUNITY AND SOCIAL SERVICES": ["Senior Care", "Community Centers", "Disability Support", "Family Services", "Housing Assistance"]
    };
    
    const categories = grantCategories[ministry] || 
      ["Program A", "Program B", "Program C", "Program D", "Program E"];
    
    const total = filteredData.find(m => m.ministry === ministry)?.total || 10000000;
    const values = [];
    let remaining = total;
    
    for (let i = 0; i < categories.length - 1; i++) {
      const allocation = remaining * (0.1 + Math.random() * 0.2);
      values.push(Math.round(allocation));
      remaining -= allocation;
    }
    values.push(Math.round(remaining));
    
    return categories.map((category, index) => ({
      name: category,
      value: values[index],
      color: `hsl(${index * 40}, 70%, 60%)`
    }));
  };
  
  const ministryGrantData = generateMinistryGrantData(selectedMinistry);

  const handleExport = () => {
    toast({
      title: "Dashboard Exported",
      description: "The dashboard data has been exported successfully."
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const getFilteredCorporateWelfareGrants = () => {
    let filtered = corporateWelfarePrograms;
    
    if (corporateWelfareTab === "corporate") {
      filtered = corporateWelfarePrograms.filter(grant => 
        grant.recipient.includes("Corp") || 
        grant.recipient.includes("Ltd") || 
        grant.recipient.includes("Inc")
      );
    } else if (corporateWelfareTab === "unnecessary") {
      const programCounts = grantsData.reduce((acc, grant) => {
        const key = `${grant.ministry}-${grant.program}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const duplicativePrograms = Object.entries(programCounts)
        .filter(([_, count]) => count > 1)
        .map(([key]) => key.split('-')[1]);
      
      filtered = grantsData.filter(grant => duplicativePrograms.includes(grant.program));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(grant => 
        grant.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.ministry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.slice(0, 5);
  };

  const handleFlagRecipient = (id: string, flag: boolean) => {
    // Update flagged status for recipients in both tables
    const updatedTopByAmount = topRecipientsByAmount.map(recipient => 
      recipient.id === id ? { ...recipient, isFlagged: flag } : recipient
    );
    
    const updatedTopByProgramCount = topRecipientsByProgramCount.map(recipient => 
      recipient.id === id ? { ...recipient, isFlagged: flag } : recipient
    );
  };

  const addToReviewList = (item: any) => {
    const recipient = item.programCount 
      ? { ...item, type: 'recipient' } 
      : { ...item, type: 'recipient' };
    
    const newReviewItem = {
      id: recipient.id,
      name: recipient.name,
      type: 'recipient',
      totalAmount: recipient.totalAmount,
      programCount: recipient.programCount || 0,
      flagReason: recipient.riskFactors,
      dateAdded: new Date()
    };
    
    if (!reviewListItems.some(existingItem => existingItem.id === newReviewItem.id)) {
      setReviewListItems(prev => [...prev, newReviewItem]);
      
      toast({
        title: "Added to Review List",
        description: `${recipient.name} has been added to the review list for further analysis.`,
      });
    }
  };

  const removeFromReviewList = (id: string) => {
    setReviewListItems(prev => prev.filter(item => item.id !== id));
    
    handleFlagRecipient(id, false);
  };

  const handleAddProgramForRiskAssessment = () => {
    toast({
      title: "Risk Assessment Process",
      description: "To add programs for risk assessment, use the Explorer tab to find specific programs and flag them for review.",
    });
  };

  const flagButtonStyle = "bg-amber-600 hover:bg-amber-700 text-white";
  const flaggedButtonStyle = "bg-green-600 hover:bg-green-700 text-white";

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-md p-2 shadow-lg text-gray-100">
        {label && <p className="font-medium text-gray-200 mb-1">{label}</p>}
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: item.color || item.fill || '#fff' }}></div>
            <span className="text-gray-300">{item.name || item.dataKey}: </span>
            <span className="font-medium text-gray-100">
              {typeof item.value === 'number' 
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(item.value)
                : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (viewMode === "review-list") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Review List</h2>
          <Button 
            variant="outline" 
            className="text-gray-200 border-gray-700 hover:bg-gray-800"
            onClick={() => setViewMode("dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
        <ReviewList 
          items={reviewListItems} 
          removeFromReviewList={removeFromReviewList} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2 flex flex-row justify-between items-start">
              <CardTitle className="text-sm font-medium text-teal-400">{metric.title}</CardTitle>
              <InfoTooltip 
                content={
                  <div>
                    <p className="font-medium mb-1">About this metric:</p>
                    <p>{metric.description || `Shows the ${metric.title.toLowerCase()} across all grants.`}</p>
                  </div>
                } 
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-200">{metric.value}</div>
              {metric.description && <p className="text-xs text-gray-300 mt-1">{metric.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gray-800/40 border border-gray-700 rounded-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-amber-500" />
            <h3 className="text-white font-medium">How to Add Programs for Risk Assessment</h3>
          </div>
          <Button
            variant="outline"
            className="text-gray-200 border-gray-700 hover:bg-gray-700"
            onClick={handleAddProgramForRiskAssessment}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Program
          </Button>
        </div>
        <p className="text-gray-300 mt-2">
          Programs and recipients can be flagged for risk assessment in three ways:
        </p>
        <ul className="list-disc pl-5 mt-1 text-gray-300 space-y-1">
          <li>Use the <span className="text-white font-medium">"Flag for Review"</span> buttons in the recipient tables</li>
          <li>Navigate to the <span className="text-white font-medium">Explorer</span> tab to find and flag specific programs</li>
          <li>Use the <span className="text-white font-medium">Flagged Items</span> tab to manage items already flagged by the system</li>
        </ul>
      </div>

      <DashboardFilters 
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        isFilterExpanded={isFilterExpanded}
        setIsFilterExpanded={setIsFilterExpanded}
      />

      <div className="text-xl font-bold border-b border-gray-800 pb-2 text-gray-100 flex items-center">
        Total Grants: {formattedTotal}
        <InfoTooltip 
          className="ml-2"
          content={
            <div>
              <p className="font-medium mb-1">Total Grants:</p>
              <p>This represents the sum of all grant amounts for the selected filters, providing a comprehensive overview of funding distribution.</p>
              <p className="mt-1 text-sm text-gray-300">Use the filters above to adjust this total.</p>
            </div>
          } 
        />
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CardTitle className="text-white">Grant Visualizations</CardTitle>
              <InfoTooltip 
                className="ml-2"
                content={
                  <div>
                    <p className="font-medium mb-1">Grant Visualizations:</p>
                    <p>This section provides multiple views of the grant data to help identify patterns and anomalies.</p>
                    <p className="mt-1">Use the tabs to switch between different visualization types.</p>
                  </div>
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 flex items-center gap-1"
                onClick={() => setViewMode("review-list")}
              >
                <Flag className="h-4 w-4" /> View Review List ({reviewListItems.length})
              </Button>
              <Button 
                variant="outline" 
                className="bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 flex items-center"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" /> Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distribution" className="w-full">
            <TabsList className="bg-gray-800 mb-4">
              <TabsTrigger value="distribution" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center gap-1">
                <PieChartIcon className="h-4 w-4" /> Distribution
              </TabsTrigger>
              <TabsTrigger value="spending" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center gap-1">
                <BarChart3 className="h-4 w-4" /> Spending by Program
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center gap-1">
                <LineChartIcon className="h-4 w-4" /> Spending Trends
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="distribution">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-100">Ministry Funding Distribution</h3>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-300">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {fiscalYears.map((year) => (
                          <SelectItem key={year} value={year} className="text-white hover:bg-gray-700">
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedMinistryTotals}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="ministry"
                        label={({ ministry, percent }) => 
                          `${ministry.length > 15 ? ministry.substring(0, 12) + '...' : ministry}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {processedMinistryTotals.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={(props) => <CustomTooltip {...props} />} />
                      <Legend 
                        payload={processedMinistryTotals.map((entry) => ({
                          value: entry.ministry,
                          type: "square" as const,
                          color: entry.color
                        }))}
                        wrapperStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-80">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-100">Program Spending Distribution</h3>
                    <Tabs value={visualizationTab} onValueChange={setVisualizationTab} className="w-auto">
                      <TabsList className="bg-gray-800">
                        <TabsTrigger value="ministry" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                          By Ministry
                        </TabsTrigger>
                        <TabsTrigger value="program" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                          By Program
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visualizationTab === "ministry" ? processedMinistryTotals : programSpendingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey={visualizationTab === "ministry" ? "ministry" : "name"}
                        label={({ name, ministry, percent }) => {
                          const label = visualizationTab === "ministry" ? ministry : name;
                          return `${label && label.length > 15 ? label.substring(0, 12) + '...' : label}: ${(percent * 100).toFixed(0)}%`;
                        }}
                      >
                        {(visualizationTab === "ministry" ? processedMinistryTotals : programSpendingData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={(props) => <CustomTooltip {...props} />} />
                      <Legend 
                        payload={(visualizationTab === "ministry" ? processedMinistryTotals : programSpendingData).map((entry) => ({
                          value: visualizationTab === "ministry" ? entry.ministry : entry.name,
                          type: "square" as const,
                          color: entry.color
                        }))}
                        wrapperStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="spending">
              <div className="h-96">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-100">Total Spending by Program</h3>
                  <Select value={selectedMinistry} onValueChange={setSelectedMinistry}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-300">
                      <SelectValue placeholder="Select Ministry" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {ministries.map((ministry) => (
                        <SelectItem key={ministry} value={ministry} className="text-white hover:bg-gray-700">
                          {ministry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedMinistry === "ALL MINISTRIES" ? (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <p>Please select a specific ministry to view its grant breakdown</p>
                  </div>
                ) : ministryGrantData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ministryGrantData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        type="number" 
                        stroke="#aaa"
                        tickFormatter={(value) => `$${value / 1000000}M`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#aaa"
                        width={180}
                        tickFormatter={(value) => value.length > 25 ? value.substring(0, 22) + '...' : value}
                      />
                      <Tooltip content={(props) => <CustomTooltip {...props} />} />
                      <Bar dataKey="value" name="Funding Amount">
                        {ministryGrantData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke={entry.value > ministryGrantData.reduce((sum, item) => sum + item.value, 0) / ministryGrantData.length * 1.5 ? "#f43f5e" : undefined}
                            strokeWidth={entry.value > ministryGrantData.reduce((sum, item) => sum + item.value, 0) / ministryGrantData.length * 1.5 ? 2 : 0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <p>No data available for the selected ministry</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="h-80">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-100">Grant Spending Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="year" stroke="#aaa" />
                    <YAxis 
                      stroke="#aaa"
                      tickFormatter={(value) => `$${value / 1000000}M`}
                    />
                    <Tooltip content={(props) => <CustomTooltip {...props} />} />
                    <Legend wrapperStyle={{ color: '#fff' }} />
                    <Line 
                      type="monotone" 
                      dataKey="totalSpending" 
                      name="Total Spending"
                      stroke="#0ea5e9" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="recipientCount" 
                      name="Recipient Count"
                      stroke="#d946ef" 
                      yAxisId={1}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Top Recipients by Amount</CardTitle>
              <InfoTooltip 
                content={
                  <div>
                    <p className="font-medium mb-1">Top Recipients by Amount:</p>
                    <p>This table shows the organizations receiving the largest total funding amounts.</p>
                    <p className="mt-1 text-amber-300">Highlighted rows indicate potential concern areas worthy of review.</p>
                  </div>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <TopRecipientsTable 
              recipients={topRecipientsByAmount}
              addToReviewList={addToReviewList}
              reviewListItems={reviewListItems}
              type="amount"
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Organizations Exploiting Multiple Grant Programs</CardTitle>
              <InfoTooltip 
                content={
                  <div>
                    <p className="font-medium mb-1">Multiple Program Recipients:</p>
                    <p>Organizations receiving funding from multiple different grant programs might be overleveraging government funding.</p>
                    <p className="mt-1 text-amber-300">High program counts may indicate excessive reliance on government funding.</p>
                  </div>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <TopRecipientsTable 
              recipients={topRecipientsByProgramCount}
              addToReviewList={addToReviewList}
              reviewListItems={reviewListItems}
              type="programCount"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DataQualityCard 
          issuesByField={dataQualityIssues}
          corporateWelfarePrograms={corporateWelfarePrograms}
          multipleGrantRecipients={multipleGrantRecipients}
        />
      </div>
    </div>
  );
};

export default Dashboard;
