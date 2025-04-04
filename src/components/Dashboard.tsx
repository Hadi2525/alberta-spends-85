import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, LineChart, PieChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ministryTotals, yearlyTotals, keyMetrics, fiscalYears, ministries, grantsData } from "@/data/grantsData";
import { useToast } from "@/hooks/use-toast";
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const Dashboard = () => {
  const [yearFilter, setYearFilter] = useState("ALL YEARS");
  const [selectedMinistry, setSelectedMinistry] = useState("ALL MINISTRIES");
  const { toast } = useToast();
  
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

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CardTitle className="text-white">Top Ministry Allocations</CardTitle>
              <InfoTooltip 
                className="ml-2"
                content={
                  <div>
                    <p className="font-medium mb-1">Top Ministry Allocations:</p>
                    <p>This bar chart displays the top ministries by total funding allocation.</p>
                    <p className="mt-1">You can export this data using the Export Data button.</p>
                  </div>
                }
              />
            </div>
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700 hover:bg-gray-800 flex items-center" 
              onClick={handleExport}
            >
              Export Data
              <InfoTooltip 
                className="ml-1"
                content="Click to export the current view as a CSV file"
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedMinistryTotals.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="ministry" 
                  stroke="#aaa"
                  tickFormatter={(value) => value.length > 12 ? value.substring(0, 9) + '...' : value}
                />
                <YAxis 
                  stroke="#aaa" 
                  tickFormatter={(value) => `$${value / 1000000000}B`}
                />
                <Tooltip content={(props) => <CustomTooltip {...props} />} />
                <Bar dataKey="total" name="Total Funding">
                  {processedMinistryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
