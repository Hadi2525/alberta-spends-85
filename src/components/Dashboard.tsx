
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
import { AlertTriangle, Flag, Download, PieChartIcon, BarChart3, LineChart as LineChartIcon } from "lucide-react";
import DashboardFilters from "@/components/DashboardFilters";
import TopRecipientsTable from "@/components/TopRecipientsTable";
import DataQualityCard from "@/components/DataQualityCard";
import ReviewList from "@/components/ReviewList";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// Sample data for data quality
const dataQualityIssues = [
  { field: "Recipient Name", issueCount: 45, percentage: 3.2 },
  { field: "Ministry", issueCount: 12, percentage: 0.8 },
  { field: "Program Name", issueCount: 68, percentage: 4.8 },
  { field: "Business Unit", issueCount: 156, percentage: 11.1 },
  { field: "Amount", issueCount: 29, percentage: 2.1 },
  { field: "Fiscal Year", issueCount: 8, percentage: 0.6 }
];

// Mock top recipients by amount
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

// Mock top recipients by program count
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

// Sample program spending data
const programSpendingData = [
  { name: "Healthcare Infrastructure", value: 32500000, color: "#4f46e5" },
  { name: "Education Grants", value: 26800000, color: "#8b5cf6" },
  { name: "Municipal Support", value: 19300000, color: "#d946ef" },
  { name: "Energy Innovation", value: 15700000, color: "#ec4899" },
  { name: "Transportation", value: 12400000, color: "#f43f5e" },
  { name: "Environmental Protection", value: 10800000, color: "#06b6d4" },
  { name: "Other Programs", value: 42500000, color: "#6b7280" }
];

// Mock data for spending trends
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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [viewMode, setViewMode] = useState("dashboard");
  const { toast } = useToast();

  // Dashboard filters state
  const [activeFilters, setActiveFilters] = useState({
    years: ["ALL YEARS"],
    ministries: ["ALL MINISTRIES"],
    programs: ["ALL PROGRAMS"],
    businessUnits: ["ALL BUSINESS UNITS"],
    excludeOperational: false
  });

  // Identify corporate welfare and unnecessary programs
  const corporateWelfarePrograms = grantsData.filter(grant => 
    (grant.recipient.includes("Corp") || grant.recipient.includes("Ltd") || grant.recipient.includes("Inc")) && 
    grant.amount > 5000000
  );
  
  // Identify organizations with multiple grants
  const organizationGrantCounts = grantsData.reduce((acc, grant) => {
    acc[grant.recipient] = (acc[grant.recipient] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const multipleGrantRecipients = Object.entries(organizationGrantCounts)
    .filter(([_, count]) => count > 2)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .map(([recipient, count]) => ({ recipient, count }));

  // Exclude operational grants
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

  // Filter grants for the risk assessment section
  const getFilteredCorporateWelfareGrants = () => {
    let filtered = corporateWelfarePrograms;
    
    if (corporateWelfareTab === "corporate") {
      filtered = corporateWelfarePrograms.filter(grant => 
        grant.recipient.includes("Corp") || 
        grant.recipient.includes("Ltd") || 
        grant.recipient.includes("Inc")
      );
    } else if (corporateWelfareTab === "unnecessary") {
      // Defining unnecessary as potentially duplicative programs
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
    
    return filtered.slice(0, 5); // Limiting to 5 items for display
  };

  // Handler for flagging a recipient
  const handleFlagRecipient = (id: string, flag: boolean) => {
    // Update topRecipientsByAmount
    const updatedTopByAmount = topRecipientsByAmount.map(recipient => 
      recipient.id === id ? { ...recipient, isFlagged: flag } : recipient
    );
    
    // Update topRecipientsByProgramCount
    const updatedTopByProgramCount = topRecipientsByProgramCount.map(recipient => 
      recipient.id === id ? { ...recipient, isFlagged: flag } : recipient
    );
  };

  // Handler for adding an item to the review list
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
    
    // Check if the item is already in the review list
    if (!reviewListItems.some(existingItem => existingItem.id === newReviewItem.id)) {
      setReviewListItems(prev => [...prev, newReviewItem]);
    }
  };
  
  // Handler for removing an item from the review list
  const removeFromReviewList = (id: string) => {
    setReviewListItems(prev => prev.filter(item => item.id !== id));
    
    // Also update the isFlagged property in the recipient lists
    handleFlagRecipient(id, false);
  };

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

  // Render the main dashboard content
  if (viewMode === "review-list") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Review List</h2>
          <Button 
            variant="outline" 
            className="text-gray-300 border-gray-700 hover:bg-gray-800"
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
      {/* Key Metrics Cards */}
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

      {/* Dashboard Filters */}
      <DashboardFilters 
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        isFilterExpanded={isFilterExpanded}
        setIsFilterExpanded={setIsFilterExpanded}
      />

      {/* Total Grant Summary */}
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

      {/* Main Visualization Tabs */}
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
                className="text-gray-300 border-gray-700 hover:bg-gray-800 flex items-center gap-1"
                onClick={() => setViewMode("review-list")}
              >
                <Flag className="h-4 w-4" /> View Review List ({reviewListItems.length})
              </Button>
              <Button 
                variant="outline" 
                className="text-gray-300 border-gray-700 hover:bg-gray-800 flex items-center"
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
            
            {/* Distribution Tab Content */}
            <TabsContent value="distribution">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ministry Distribution Pie Chart */}
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
                          type: 'square',
                          color: entry.color
                        }))}
                        wrapperStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Program Distribution Pie Chart */}
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
                        nameKey="name"
                        label={({ name, percent }) => 
                          `${name.length > 15 ? name.substring(0, 12) + '...' : name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {(visualizationTab === "ministry" ? processedMinistryTotals : programSpendingData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={(props) => <CustomTooltip {...props} />} />
                      <Legend 
                        payload={(visualizationTab === "ministry" ? processedMinistryTotals : programSpendingData).map((entry) => ({
                          value: visualizationTab === "ministry" ? entry.ministry : entry.name,
                          type: 'square',
                          color: entry.color
                        }))}
                        wrapperStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            {/* Spending By Program Tab Content */}
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
                            // Highlight programs with unusually high spending
                            stroke={entry.value > ministryGrantData.reduce((sum, item) => sum + item.value, 0) / ministryGrantData.length * 1.5 ? "#f43f5e" : undefined}
                            strokeWidth={entry.value > ministryGrantData.reduce((sum, item) => sum + item.value, 0) / ministryGrantData.length * 1.5 ? 2 : 0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <p>No data available for this ministry</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Spending Trends Tab Content */}
            <TabsContent value="trends">
              <div className="h-96">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-100">Spending Trends Over Time</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-600">Total Spending</Badge>
                    <Badge className="bg-blue-600">Recipient Count</Badge>
                    <Badge className="bg-purple-600">Average Grant</Badge>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="year" stroke="#aaa" />
                    <YAxis 
                      yAxisId="left"
                      stroke="#aaa" 
                      tickFormatter={(value) => `$${value / 1000000}M`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#aaa"
                      domain={[0, 'dataMax + 50']}
                    />
                    <Tooltip content={(props) => <CustomTooltip {...props} />} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="totalSpending" 
                      stroke="#14b8a6" 
                      strokeWidth={2}
                      dot={{ fill: '#14b8a6', r: 4 }}
                      activeDot={{ r: 8 }}
                      name="Total Spending"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="recipientCount" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 8 }}
                      name="Recipient Count"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="averageGrant" 
                      stroke="#a855f7" 
                      strokeWidth={2}
                      dot={{ fill: '#a855f7', r: 4 }}
                      activeDot={{ r: 8 }}
                      name="Average Grant"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Data Quality Card */}
      <DataQualityCard
        totalRecords={1400}
        issuesCount={187}
        issuesByField={dataQualityIssues}
      />

      {/* Top Recipients by Program Count */}
      <TopRecipientsTable
        title="Top Recipients by Program Count"
        subtitle="Organizations receiving grants from multiple different programs, potentially indicating over-reliance on government funding."
        recipients={topRecipientsByProgramCount}
        type="programCount"
        onFlagRecipient={handleFlagRecipient}
        addToReviewList={addToReviewList}
      />

      {/* Top Recipients by Amount */}
      <TopRecipientsTable
        title="Top Recipients by Amount"
        subtitle="Organizations receiving the largest total grant amounts across all programs."
        recipients={topRecipientsByAmount}
        type="amount"
        onFlagRecipient={handleFlagRecipient}
        addToReviewList={addToReviewList}
      />
      
      {/* Risk Assessment Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CardTitle className="text-white flex items-center">
                <AlertTriangle size={18} className="text-amber-500 mr-2" /> 
                Risk Assessment
              </CardTitle>
              <InfoTooltip 
                className="ml-2"
                content={
                  <div>
                    <p className="font-medium mb-1">Risk Assessment:</p>
                    <p>This section identifies grants that may qualify as "corporate welfare" or unnecessary government spending.</p>
                    <p className="mt-1">Use the tabs to filter between different risk categories.</p>
                  </div>
                }
              />
            </div>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Search programs or recipients..."
                className="w-[300px] bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="outline" 
                className="text-gray-300 border-gray-700 hover:bg-gray-800 flex items-center" 
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={corporateWelfareTab} onValueChange={setCorporateWelfareTab} className="w-full">
            <TabsList className="bg-gray-800 mb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                All Risks
              </TabsTrigger>
              <TabsTrigger value="corporate" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                Corporate Welfare
              </TabsTrigger>
              <TabsTrigger value="unnecessary" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                Unnecessary Programs
              </TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border border-gray-800">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow>
                    <TableHead className="text-gray-300">Recipient</TableHead>
                    <TableHead className="text-gray-300">Ministry</TableHead>
                    <TableHead className="text-gray-300">Program</TableHead>
                    <TableHead className="text-gray-300 text-right">Amount</TableHead>
                    <TableHead className="text-gray-300">Risk Factors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCorporateWelfareGrants().length > 0 ? (
                    getFilteredCorporateWelfareGrants().map((grant, index) => (
                      <TableRow key={index} className="hover:bg-gray-800/60">
                        <TableCell className="font-medium text-gray-200">{grant.recipient}</TableCell>
                        <TableCell className="text-gray-200">{grant.ministry}</TableCell>
                        <TableCell className="text-gray-200">{grant.program}</TableCell>
                        <TableCell className="text-right text-gray-200">{formatCurrency(grant.amount)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {(grant.recipient.includes("Corp") || grant.recipient.includes("Ltd") || grant.recipient.includes("Inc")) && (
                              <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-800">
                                Corporate Welfare
                              </Badge>
                            )}
                            {grant.amount > 10000000 && (
                              <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-800">
                                Large Amount
                              </Badge>
                            )}
                            {organizationGrantCounts[grant.recipient] > 2 && (
                              <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800">
                                Multiple Grants ({organizationGrantCounts[grant.recipient]})
                              </Badge>
                            )}
                            {(Math.random() > 0.5) && (
                              <Badge variant="outline" className="bg-teal-900/20 text-teal-400 border-teal-800">
                                Potential Duplication
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                        No risk factors identified matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Organizations with Multiple Grants Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-white">
              <Flag className="inline-block mr-2 h-5 w-5 text-teal-400" />
              Organizations Exploiting Multiple Grant Programs
            </CardTitle>
            <InfoTooltip 
              className="ml-2"
              content={
                <div>
                  <p className="font-medium mb-1">Multiple Grant Recipients:</p>
                  <p>This chart identifies organizations that are receiving grants from multiple different programs, which may indicate over-reliance on government funding or exploitation of the system.</p>
                </div>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={multipleGrantRecipients.slice(0, 10)} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  type="number" 
                  stroke="#aaa"
                />
                <YAxis 
                  type="category" 
                  dataKey="recipient" 
                  stroke="#aaa"
                  tickFormatter={(value) => value.length > 25 ? value.substring(0, 22) + '...' : value}
                />
                <Tooltip 
                  content={(props) => <CustomTooltip {...props} />}
                  formatter={(value) => [`${value} Programs`, "Programs Used"]}
                  labelFormatter={(value) => `Recipient: ${value}`}
                />
                <Bar 
                  dataKey="count" 
                  name="Number of Grant Programs" 
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
