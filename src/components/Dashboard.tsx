
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
import { AlertTriangle, Flag, Filter, Download } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const Dashboard = () => {
  const [yearFilter, setYearFilter] = useState("ALL YEARS");
  const [selectedMinistry, setSelectedMinistry] = useState("ALL MINISTRIES");
  const [corporateWelfareTab, setCorporateWelfareTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
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

      <div className="text-xl font-bold border-b border-gray-800 pb-2 text-gray-100 flex items-center">
        Total Grants: {formattedTotal}
        <InfoTooltip 
          className="ml-2"
          content={
            <div>
              <p className="font-medium mb-1">Total Grants:</p>
              <p>This represents the sum of all grant amounts for the selected fiscal year, providing a comprehensive overview of funding distribution.</p>
              <p className="mt-1 text-sm text-gray-300">Use the year filters in the charts below to change this total.</p>
            </div>
          } 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CardTitle className="text-white">Ministry Funding Distribution</CardTitle>
                <InfoTooltip 
                  className="ml-2"
                  content={
                    <div>
                      <p className="font-medium mb-1">Ministry Funding Distribution:</p>
                      <p>This pie chart shows how funding is distributed across different ministries. Small ministries (less than 2% of total funding) are grouped as "Other Ministries" for clarity.</p>
                      <p className="mt-1">Use the year filter to view distribution for specific fiscal years.</p>
                    </div>
                  }
                />
              </div>
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
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-white">Funding Trends Over Time</CardTitle>
              <InfoTooltip 
                className="ml-2"
                content={
                  <div>
                    <p className="font-medium mb-1">Funding Trends Over Time:</p>
                    <p>This line chart shows how the total grant funding has changed over different fiscal years.</p>
                    <p className="mt-1">Hover over points to see exact values for each year.</p>
                  </div>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyTotals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="year" stroke="#aaa" />
                  <YAxis 
                    stroke="#aaa" 
                    tickFormatter={(value) => `$${value / 1000000000}B`}
                  />
                  <Tooltip content={(props) => <CustomTooltip {...props} />} />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#2dd4bf" 
                    strokeWidth={2}
                    dot={{ fill: '#2dd4bf', r: 4 }}
                    activeDot={{ r: 8 }}
                    name="Total Funding"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CardTitle className="text-white">Ministry Grant Breakdown</CardTitle>
              <InfoTooltip 
                className="ml-2"
                content={
                  <div>
                    <p className="font-medium mb-1">Ministry Grant Breakdown:</p>
                    <p>This chart shows the distribution of grants within a selected ministry.</p>
                    <p className="mt-1">Select a ministry from the dropdown to see its specific grant categories.</p>
                  </div>
                }
              />
            </div>
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
        </CardHeader>
        <CardContent>
          <div className="h-96">
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
                    width={150}
                    tickFormatter={(value) => value.length > 18 ? value.substring(0, 15) + '...' : value}
                  />
                  <Tooltip content={(props) => <CustomTooltip {...props} />} />
                  <Bar dataKey="value" name="Funding Amount">
                    {ministryGrantData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
        </CardContent>
      </Card>

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
    </div>
  );
};

export default Dashboard;
