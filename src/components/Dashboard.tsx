
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, LineChart, PieChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ministryTotals, yearlyTotals, keyMetrics, fiscalYears } from "@/data/grantsData";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [yearFilter, setYearFilter] = useState("ALL YEARS");
  const { toast } = useToast();
  
  // Aggregate small ministry totals into 'Other'
  const THRESHOLD = 0.02; // 2% threshold for aggregation
  const totalSum = ministryTotals.reduce((sum, item) => sum + item.total, 0);
  
  const processedMinistryTotals = (() => {
    const largeMinistries = ministryTotals
      .filter(ministry => ministry.total / totalSum >= THRESHOLD)
      .sort((a, b) => b.total - a.total);
    
    const otherTotal = ministryTotals
      .filter(ministry => ministry.total / totalSum < THRESHOLD)
      .reduce((sum, ministry) => sum + ministry.total, 0);
    
    return [
      ...largeMinistries,
      { 
        ministry: 'Other Ministries', 
        total: otherTotal, 
        color: '#6B7280' // Neutral gray for 'Other'
      }
    ];
  })();

  const handleExport = () => {
    toast({
      title: "Dashboard Exported",
      description: "The dashboard data has been exported successfully."
    });
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-400">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-200">{metric.value}</div>
              {metric.description && <p className="text-xs text-gray-300 mt-1">{metric.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Grants Header with Improved Readability */}
      <div className="text-xl font-bold border-b border-gray-800 pb-2 text-gray-100">
        Total Grants: $417,260,276,160.40
        <p className="text-sm font-normal text-gray-400 mt-1">
          This total represents the sum of all grant amounts across all ministries and fiscal years, providing a comprehensive overview of funding distribution.
        </p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ministry Distribution with Consolidated Other */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-white">Ministry Funding Distribution</CardTitle>
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
                    label={({ ministry, percent }) => `${ministry}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {processedMinistryTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${(value as number / 1000000000).toFixed(1)}B`} 
                    labelFormatter={(name) => name as string}
                    contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }}
                  />
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

        {/* Yearly Trend with Improved Readability */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Funding Trends Over Time</CardTitle>
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
                  <Tooltip 
                    formatter={(value) => `$${(value as number / 1000000000).toFixed(2)}B`}
                    labelFormatter={(label) => `Fiscal Year: ${label}`}
                    contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }}
                  />
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

      {/* Top Ministries Bar Chart with Improved Text */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Top Ministry Allocations</CardTitle>
            <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800" onClick={handleExport}>
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedMinistryTotals.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="ministry" stroke="#aaa" />
                <YAxis 
                  stroke="#aaa" 
                  tickFormatter={(value) => `$${value / 1000000000}B`}
                />
                <Tooltip 
                  formatter={(value) => `$${(value as number / 1000000000).toFixed(2)}B`}
                  labelFormatter={(label) => `Ministry: ${label}`}
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }}
                />
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
