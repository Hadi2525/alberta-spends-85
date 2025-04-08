
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/components/Dashboard";
import Explorer from "@/components/Explorer";
import FlaggedItems from "@/components/FlaggedItems";
import Documentation from "@/components/Documentation";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="min-h-screen bg-[#121726] text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Grants</h1>
            <InfoTooltip 
              className="ml-2"
              content={
                <div>
                  <p className="font-medium mb-1">Grants Dashboard:</p>
                  <p>Welcome to the Grants Management System. This application helps you explore, analyze, and manage government grant data with a focus on identifying potential corporate welfare, unnecessary programs, and multiple grant exploitation.</p>
                  <p className="mt-1 text-sm text-gray-300">Use the tabs below to navigate between different sections of the application.</p>
                </div>
              }
            />
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="text-gray-200 border-gray-700 hover:bg-gray-800 hover:text-white"
            >
              Export
              <InfoTooltip 
                className="ml-1"
                content="Export all dashboard data as a comprehensive report"
              />
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Help
              <InfoTooltip 
                className="ml-1"
                content="Access detailed help documentation and tutorials"
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900 mb-6 flex items-center">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center">
              Dashboard
              <InfoTooltip 
                className="ml-1"
                content="View data visualizations and key metrics"
              />
            </TabsTrigger>
            <TabsTrigger value="explorer" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center">
              Explorer
              <InfoTooltip 
                className="ml-1"
                content="Search and filter through all grant data"
              />
            </TabsTrigger>
            <TabsTrigger value="flagged" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center">
              Flagged Items
              <InfoTooltip 
                className="ml-1"
                content="Review grants that have been flagged for attention"
              />
            </TabsTrigger>
            <TabsTrigger value="documentation" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center">
              Documentation
              <InfoTooltip 
                className="ml-1"
                content="Access system documentation and help resources"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="explorer">
            <Explorer />
          </TabsContent>

          <TabsContent value="flagged">
            <FlaggedItems />
          </TabsContent>

          <TabsContent value="documentation">
            <Documentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
