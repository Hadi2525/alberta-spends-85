
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import Explorer from "@/components/Explorer";
import FlaggedItems from "@/components/FlaggedItems";
import Documentation from "@/components/Documentation";
import InfoTooltip from "@/components/ui/InfoTooltip";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="min-h-screen bg-google-light-gray">
      <header className="border-b border-google-border-gray bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-google-sans font-medium text-google-gray">
              Grants Dashboard
            </h1>
            <InfoTooltip 
              className="ml-2"
              content={
                <div className="font-roboto">
                  <p className="font-medium mb-1">Grants Dashboard:</p>
                  <p>Welcome to the Grants Management System. This application helps you explore, analyze, and manage government grant data with a focus on identifying potential corporate welfare, unnecessary programs, and multiple grant exploitation.</p>
                  <p className="mt-1 text-sm text-google-gray">Use the tabs below to navigate between different sections of the application.</p>
                </div>
              }
            />
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="font-google-sans text-google-gray border-google-border-gray hover:bg-gray-50"
            >
              Export
              <InfoTooltip 
                className="ml-1"
                content="Export all dashboard data as a comprehensive report"
              />
            </Button>
            <Button className="bg-google-blue hover:bg-google-blue/90 text-white font-google-sans">
              Help
              <InfoTooltip 
                className="ml-1"
                content="Access detailed help documentation and tutorials"
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white border border-google-border-gray rounded-full p-1 shadow-sm">
            <TabsTrigger 
              value="dashboard" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-google-blue data-[state=active]:text-white"
            >
              Dashboard
              <InfoTooltip 
                className="ml-1"
                content="View data visualizations and key metrics"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="explorer" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-google-blue data-[state=active]:text-white"
            >
              Explorer
              <InfoTooltip 
                className="ml-1"
                content="Search and filter through all grant data"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="flagged" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-google-blue data-[state=active]:text-white"
            >
              Flagged Items
              <InfoTooltip 
                className="ml-1"
                content="Review grants that have been flagged for attention"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="documentation" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-google-blue data-[state=active]:text-white"
            >
              Documentation
              <InfoTooltip 
                className="ml-1"
                content="Access system documentation and help resources"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="bg-white rounded-lg shadow-sm border border-google-border-gray p-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="explorer" className="bg-white rounded-lg shadow-sm border border-google-border-gray p-6">
            <Explorer />
          </TabsContent>

          <TabsContent value="flagged" className="bg-white rounded-lg shadow-sm border border-google-border-gray p-6">
            <FlaggedItems />
          </TabsContent>

          <TabsContent value="documentation" className="bg-white rounded-lg shadow-sm border border-google-border-gray p-6">
            <Documentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
