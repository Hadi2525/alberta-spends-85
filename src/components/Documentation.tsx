
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Book, Code, List, Filter, Flag, LineChart, HelpCircle, PieChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Documentation = () => {
  const [docType, setDocType] = useState("user");
  const { toast } = useToast();
  
  const handleDownload = (docType: string) => {
    toast({
      title: "Documentation Downloaded",
      description: `The ${docType} documentation has been downloaded successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={docType} onValueChange={setDocType} className="w-full">
        <TabsList className="bg-gray-800 mb-6">
          <TabsTrigger value="user" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Book className="h-4 w-4 mr-2" /> User Guide
          </TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Code className="h-4 w-4 mr-2" /> Technical Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-white text-2xl">User Guide</CardTitle>
                <p className="text-gray-400 mt-2">
                  A comprehensive guide for using the Grant Data Explorer dashboard.
                </p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => handleDownload("user")}>
                <FileDown className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-teal-400" /> Introduction
                </h3>
                <p className="text-gray-300 mb-4">
                  The Insight Spark Explorer is a comprehensive dashboard designed to provide analysis and visualization of government grant data across multiple ministries and fiscal years. This user guide will help you navigate the dashboard effectively and make the most of its features.
                </p>
                <p className="text-gray-300">
                  The dashboard consists of four main sections:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                  <li><span className="font-medium text-teal-400">Dashboard</span>: Overview of key metrics and visualizations</li>
                  <li><span className="font-medium text-teal-400">Explorer</span>: Detailed data exploration with filtering and search capabilities</li>
                  <li><span className="font-medium text-teal-400">Flagged Items</span>: Review and manage flagged grants requiring attention</li>
                  <li><span className="font-medium text-teal-400">Documentation</span>: User guides and technical documentation</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-teal-400" /> Using the Dashboard
                </h3>
                <p className="text-gray-300 mb-3">
                  The Dashboard provides a high-level overview of grant data through various visualizations:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li>
                    <span className="font-medium text-teal-400">Key Metrics</span>: Displays important statistics like total number of grants, total funding, and unique recipients.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Ministry Funding Distribution</span>: Pie chart showing the proportion of funding allocated to each ministry. Use the year filter to view distributions for specific fiscal years.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Funding Trends Over Time</span>: Line chart displaying funding patterns across fiscal years, helping identify long-term trends.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Top Ministry Allocations</span>: Bar chart showing the ministries receiving the highest funding, sorted in descending order.
                  </li>
                </ul>
                <div className="bg-gray-800 p-4 rounded-md mt-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Tip:</strong> Hover over any chart element to see detailed information in a tooltip.
                  </p>
                </div>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-teal-400" /> Using the Explorer
                </h3>
                <p className="text-gray-300 mb-3">
                  The Explorer tab allows detailed analysis and filtering of grant data:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li>
                    <span className="font-medium text-teal-400">Filtering</span>: Use filters to narrow down data by ministry, fiscal year, or by searching programs and recipients.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Amount Range</span>: The slider allows filtering grants by amount, enabling focus on specific funding ranges.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Sorting</span>: Sort the data by different columns (amount, ministry, fiscal year, or program) in ascending or descending order.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Flagging</span>: Use the flag button to mark specific grants for review.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Exporting</span>: Export filtered results as CSV files for further analysis in other tools.
                  </li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-teal-400" /> Managing Flagged Items
                </h3>
                <p className="text-gray-300 mb-3">
                  The Flagged Items tab helps manage grants that have been flagged for review:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li>
                    <span className="font-medium text-teal-400">Review List</span>: Displays all flagged grants with their details and flag reasons.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Bulk Actions</span>: Select multiple items to approve or remove flags in batch.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Flagging Criteria</span>: Toggle automatic flagging criteria on/off to control how the system identifies potential issues.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Search</span>: Search within flagged items to find specific entries.
                  </li>
                </ul>
                <div className="bg-gray-800 p-4 rounded-md mt-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Note:</strong> Flagging is based on predefined criteria that identify potential anomalies in grant disbursements. These flags are meant to assist in review and do not necessarily indicate problems.
                  </p>
                </div>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-teal-400" /> Exporting Data
                </h3>
                <p className="text-gray-300 mb-3">
                  Several export options are available throughout the dashboard:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Export visualization data from the Dashboard</li>
                  <li>Export filtered results from the Explorer</li>
                  <li>Export flagged items (all or selected) from the Flagged Items tab</li>
                </ul>
                <p className="text-gray-300 mt-3">
                  All exports are in CSV format and can be opened in spreadsheet applications like Microsoft Excel or Google Sheets for further analysis.
                </p>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-white text-2xl">Technical Documentation</CardTitle>
                <p className="text-gray-400 mt-2">
                  Technical details about the dashboard implementation, data processing, and API integration.
                </p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => handleDownload("technical")}>
                <FileDown className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-teal-400" /> System Architecture
                </h3>
                <p className="text-gray-300 mb-4">
                  The Insight Spark Explorer is built on a modern web technology stack with separate frontend and backend components:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li>
                    <span className="font-medium text-teal-400">Frontend</span>: React.js with TypeScript, utilizing Tailwind CSS for styling and shadcn/ui for component library. Data visualization is handled through Recharts.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Backend</span>: REST API built with Node.js and Express, connected to a PostgreSQL database for data storage.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Authentication</span>: JWT-based authentication system with role-based access control.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Deployment</span>: Containerized with Docker and deployed on a cloud infrastructure.
                  </li>
                </ul>
                <div className="bg-gray-800 p-4 rounded-md mt-4 text-sm font-mono text-gray-300">
                  <pre>{`
# High-level Architecture
┌───────────────┐      ┌───────────────┐     ┌───────────────┐
│ React Frontend│◄────►│  REST API     │◄───►│ PostgreSQL DB │
└───────────────┘      └───────────────┘     └───────────────┘
                              ▲
                              │
                      ┌───────────────┐
                      │ Data          │
                      │ Processing    │
                      └───────────────┘
                  `}</pre>
                </div>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-teal-400" /> Data Processing
                </h3>
                <p className="text-gray-300 mb-3">
                  The dashboard processes grant data through several stages:
                </p>
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li>
                    <span className="font-medium text-teal-400">Data Ingestion</span>: Raw data is imported from CSV files or database exports and transformed into a standardized format.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Data Normalization</span>: Ministry names, program names, and other fields are normalized to ensure consistency across different fiscal years.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Aggregation</span>: Data is pre-aggregated at various levels (by ministry, fiscal year, program) to optimize dashboard performance.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Anomaly Detection</span>: Statistical algorithms identify potential anomalies based on historical patterns and predefined rules.
                  </li>
                </ol>
                <p className="text-gray-300 mt-3">
                  Data updates occur nightly, with full refreshes at the end of each fiscal quarter.
                </p>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-teal-400" /> Flagging Logic
                </h3>
                <p className="text-gray-300 mb-3">
                  The system automatically flags grants based on the following algorithms:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li>
                    <span className="font-medium text-teal-400">Unusual Increase</span>: Identifies grants where funding increased by more than 40% compared to the previous fiscal year without corresponding program expansion.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Unusual Decrease</span>: Identifies grants where funding decreased by more than 40% compared to the previous fiscal year without corresponding program reduction.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Statistical Outlier</span>: Uses Z-score calculation to identify grants that deviate significantly from the mean amount within their category.
                    <div className="bg-gray-800 p-2 mt-2 rounded-md text-sm font-mono">
                      <code>Z-score = (x - μ) / σ</code>
                      <br />
                      <code>where x = grant amount, μ = mean, σ = standard deviation</code>
                    </div>
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Disbursement Timing</span>: Identifies grants disbursed outside of typical fiscal quarter patterns or at unusual times.
                  </li>
                  <li>
                    <span className="font-medium text-teal-400">Recipient Concentration</span>: Identifies programs where a single recipient receives more than 30% of total program funding.
                  </li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <List className="h-5 w-5 mr-2 text-teal-400" /> API Documentation
                </h3>
                <p className="text-gray-300 mb-3">
                  The dashboard communicates with a REST API that provides the following endpoints:
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-teal-400 mb-2">GET /api/grants</h4>
                    <p className="text-gray-300 text-sm mb-2">Retrieves grant data with optional filtering parameters.</p>
                    <div className="bg-gray-800 p-3 rounded-md text-sm font-mono text-gray-300">
                      <pre>{`
Parameters:
  - ministry: Filter by ministry name
  - fiscalYear: Filter by fiscal year
  - minAmount: Minimum grant amount
  - maxAmount: Maximum grant amount
  - search: Search term for program or recipient
  - page: Page number for pagination
  - limit: Number of results per page
                      `}</pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-teal-400 mb-2">GET /api/metrics</h4>
                    <p className="text-gray-300 text-sm mb-2">Retrieves aggregated metrics for the dashboard.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-teal-400 mb-2">GET /api/flags</h4>
                    <p className="text-gray-300 text-sm mb-2">Retrieves flagged grants with reasons.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-teal-400 mb-2">POST /api/flags/:id</h4>
                    <p className="text-gray-300 text-sm mb-2">Manually flags a grant.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-teal-400 mb-2">DELETE /api/flags/:id</h4>
                    <p className="text-gray-300 text-sm mb-2">Removes a flag from a grant.</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-4">
                  All API endpoints require authentication via JWT token in the Authorization header.
                </p>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-teal-400" /> Troubleshooting
                </h3>
                <p className="text-gray-300 mb-3">
                  Common issues and their solutions:
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-teal-400">Slow Dashboard Loading</h4>
                    <p className="text-gray-300 text-sm">
                      If the dashboard loads slowly, try clearing your browser cache or using a different browser. 
                      The initial load caches data for better subsequent performance.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-teal-400">Export Failures</h4>
                    <p className="text-gray-300 text-sm">
                      If exports fail, check your browser's download settings and ensure you have permission to download files.
                      For large data sets, the export may take a moment to generate.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-teal-400">Filter Not Working</h4>
                    <p className="text-gray-300 text-sm">
                      If filters don't seem to be working correctly, try resetting all filters to their default state 
                      and then applying them one at a time.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-md mt-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Support:</strong> For technical issues not covered here, please contact the support team at support@insightsparkexplorer.gov with details of the problem.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
