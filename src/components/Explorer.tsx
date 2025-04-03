
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Flag, Download, Filter, AlertTriangle } from "lucide-react";
import { grantsData, ministries, fiscalYears, downloadCSV, generateCSV } from "@/data/grantsData";
import { useToast } from "@/hooks/use-toast";

const Explorer = () => {
  const [filteredData, setFilteredData] = useState(grantsData);
  const [selectedMinistry, setSelectedMinistry] = useState("ALL MINISTRIES");
  const [selectedYear, setSelectedYear] = useState("ALL YEARS");
  const [searchQuery, setSearchQuery] = useState("");
  const [amountRange, setAmountRange] = useState([0, 20000000]);
  const [sortBy, setSortBy] = useState("amount");
  const [sortOrder, setSortOrder] = useState("desc");
  const { toast } = useToast();
  
  // Format currency numbers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  // Update filtered data when filters change
  useEffect(() => {
    let result = [...grantsData];
    
    // Filter by ministry
    if (selectedMinistry !== "ALL MINISTRIES") {
      result = result.filter(item => item.ministry === selectedMinistry);
    }
    
    // Filter by fiscal year
    if (selectedYear !== "ALL YEARS") {
      result = result.filter(item => item.fiscalYear === selectedYear);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.program.toLowerCase().includes(query) || 
          item.recipient.toLowerCase().includes(query)
      );
    }
    
    // Filter by amount range
    result = result.filter(
      item => item.amount >= amountRange[0] && item.amount <= amountRange[1]
    );
    
    // Sort data
    result.sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === "fiscalYear") {
        return sortOrder === "asc" 
          ? a.fiscalYear.localeCompare(b.fiscalYear) 
          : b.fiscalYear.localeCompare(a.fiscalYear);
      } else {
        return sortOrder === "asc" 
          ? a[sortBy].localeCompare(b[sortBy]) 
          : b[sortBy].localeCompare(a[sortBy]);
      }
    });
    
    setFilteredData(result);
  }, [selectedMinistry, selectedYear, searchQuery, amountRange, sortBy, sortOrder]);

  const handleExport = () => {
    const csvData = generateCSV(filteredData);
    const fileName = `grants_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvData, fileName);
    
    toast({
      title: "Export Complete",
      description: `${filteredData.length} records exported to ${fileName}`
    });
  };

  const handleFlag = (id: string) => {
    // This would normally update the database
    toast({
      title: "Item Flagged",
      description: "The selected grant has been flagged for review.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <Filter size={20} /> Grant Explorer Filters
            </CardTitle>
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" /> Export Results
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Ministry</label>
              <Select value={selectedMinistry} onValueChange={setSelectedMinistry}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
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
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Fiscal Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
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
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Search Programs & Recipients</label>
              <Input
                placeholder="Search..."
                className="bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <label className="text-sm text-gray-400">Grant Amount Range</label>
              <span className="text-sm text-gray-400">
                {formatCurrency(amountRange[0])} - {formatCurrency(amountRange[1])}
              </span>
            </div>
            <Slider
              defaultValue={[0, 20000000]}
              max={20000000}
              step={100000}
              value={amountRange}
              onValueChange={setAmountRange}
              className="py-4"
            />
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-400">
              {filteredData.length} grants found
            </div>
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="amount" className="text-white hover:bg-gray-700">Amount</SelectItem>
                  <SelectItem value="ministry" className="text-white hover:bg-gray-700">Ministry</SelectItem>
                  <SelectItem value="fiscalYear" className="text-white hover:bg-gray-700">Fiscal Year</SelectItem>
                  <SelectItem value="program" className="text-white hover:bg-gray-700">Program</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="asc" className="text-white hover:bg-gray-700">Ascending</SelectItem>
                  <SelectItem value="desc" className="text-white hover:bg-gray-700">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <div className="rounded-md border border-gray-800">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow>
                  <TableHead className="text-gray-400">Ministry</TableHead>
                  <TableHead className="text-gray-400">Program</TableHead>
                  <TableHead className="text-gray-400">Recipient</TableHead>
                  <TableHead className="text-gray-400">Fiscal Year</TableHead>
                  <TableHead className="text-gray-400 text-right">Amount</TableHead>
                  <TableHead className="text-gray-400 text-center">Status</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-800/60">
                      <TableCell className="font-medium">{item.ministry}</TableCell>
                      <TableCell>{item.program}</TableCell>
                      <TableCell>{item.recipient}</TableCell>
                      <TableCell>{item.fiscalYear}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="text-center">
                        {item.flagged ? (
                          <Badge variant="destructive" className="flex items-center justify-center gap-1 mx-auto">
                            <AlertTriangle size={12} />
                            Flagged
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-transparent text-gray-400 mx-auto">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-red-900/20 hover:text-red-400"
                          onClick={() => handleFlag(item.id)}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No results found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Explorer;
