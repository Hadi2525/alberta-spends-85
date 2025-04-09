
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-google-sans font-semibold text-gradient">
              Grants Dashboard
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
              className="font-google-sans border-border hover:bg-muted shadow-sm hover:shadow text-foreground"
            >
              Export
              <InfoTooltip 
                className="ml-1"
                content="Export all dashboard data as a comprehensive report"
              />
            </Button>
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-google-sans shadow-md hover:shadow-lg">
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
          <TabsList className="mb-6 bg-card border border-border rounded-full p-1 shadow-md">
            <TabsTrigger 
              value="dashboard" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Dashboard
              <InfoTooltip 
                className="ml-1"
                content="View data visualizations and key metrics"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="explorer" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Explorer
              <InfoTooltip 
                className="ml-1"
                content="Search and filter through all grant data"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="flagged" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Flagged Items
              <InfoTooltip 
                className="ml-1"
                content="Review grants that have been flagged for attention"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="documentation" 
              className="font-google-sans rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Documentation
              <InfoTooltip 
                className="ml-1"
                content="Access system documentation and help resources"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="bg-card rounded-lg shadow-lg border border-border p-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="explorer" className="bg-card rounded-lg shadow-lg border border-border p-6">
            <Explorer />
          </TabsContent>

          <TabsContent value="flagged" className="bg-card rounded-lg shadow-lg border border-border p-6">
            <FlaggedItems />
          </TabsContent>

          <TabsContent value="documentation" className="bg-card rounded-lg shadow-lg border border-border p-6">
            <Documentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
