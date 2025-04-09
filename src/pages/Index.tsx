
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
    <div className="min-h-screen bluebooks-bg bg-bluebooks-navy">
      <header className="border-b border-bluebooks-border">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-google-sans font-semibold text-white">
              Bluebooks
            </h1>
            <InfoTooltip 
              className="ml-2"
              content={
                <div className="font-roboto">
                  <p className="font-medium mb-1">Grants Dashboard:</p>
                  <p>Welcome to the Grants Management System. This application helps you explore, analyze, and manage government grant data with a focus on identifying potential corporate welfare, unnecessary programs, and multiple grant exploitation.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Use the tabs below to navigate between different sections of the application.</p>
                </div>
              }
            />
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="font-google-sans border-bluebooks-border hover:bg-bluebooks-navy-light text-white"
            >
              Export
              <InfoTooltip 
                className="ml-1"
                content="Export all dashboard data as a comprehensive report"
              />
            </Button>
            <Button className="bg-bluebooks-teal hover:bg-bluebooks-teal/80 text-bluebooks-navy font-google-sans font-semibold">
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
          <TabsList className="mb-6 bg-bluebooks-navy-light border border-bluebooks-border rounded-none p-0 shadow-none gap-4 flex">
            <TabsTrigger 
              value="dashboard" 
              className="bluebooks-tab rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-bluebooks-teal"
            >
              Dashboard
              <InfoTooltip 
                className="ml-1"
                content="View data visualizations and key metrics"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="explorer" 
              className="bluebooks-tab rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-bluebooks-teal"
            >
              Explorer
              <InfoTooltip 
                className="ml-1"
                content="Search and filter through all grant data"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="flagged" 
              className="bluebooks-tab rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-bluebooks-teal"
            >
              Flagged Items
              <InfoTooltip 
                className="ml-1"
                content="Review grants that have been flagged for attention"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="documentation" 
              className="bluebooks-tab rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-bluebooks-teal"
            >
              Documentation
              <InfoTooltip 
                className="ml-1"
                content="Access system documentation and help resources"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="bluebooks-card p-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="explorer" className="bluebooks-card p-6">
            <Explorer />
          </TabsContent>

          <TabsContent value="flagged" className="bluebooks-card p-6">
            <FlaggedItems />
          </TabsContent>

          <TabsContent value="documentation" className="bluebooks-card p-6">
            <Documentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
