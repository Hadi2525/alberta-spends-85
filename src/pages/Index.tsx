
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, LineChart, PieChart, Pie, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/components/Dashboard";
import Explorer from "@/components/Explorer";
import FlaggedItems from "@/components/FlaggedItems";
import Documentation from "@/components/Documentation";
import { grantsData, ministryTotals, yearlyTotals, keyMetrics } from "@/data/grantsData";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="min-h-screen bg-[#121726] text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Grants</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white">
              Export
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Help
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900 mb-6">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="explorer" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Explorer
            </TabsTrigger>
            <TabsTrigger value="flagged" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Flagged Items
            </TabsTrigger>
            <TabsTrigger value="documentation" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Documentation
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
