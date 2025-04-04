
import React, { useState } from "react";
import { Download, Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { useToast } from "@/hooks/use-toast";

interface ReviewItem {
  id: string;
  name: string;
  type: 'program' | 'recipient';
  ministry?: string;
  totalAmount: number;
  programCount?: number;
  flagReason: string[];
  dateAdded: Date;
}

interface ReviewListProps {
  items: ReviewItem[];
  removeFromReviewList: (id: string) => void;
}

const ReviewList = ({ items, removeFromReviewList }: ReviewListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Get unique flag reasons for filtering
  const uniqueReasons = Array.from(
    new Set(items.flatMap(item => item.flagReason))
  );

  // Filter the items based on search query and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.ministry && item.ministry.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    const matchesReason = reasonFilter === "all" || 
                         item.flagReason.some(reason => reason.toLowerCase().includes(reasonFilter.toLowerCase()));
    
    return matchesSearch && matchesType && matchesReason;
  });

  const handleExport = () => {
    // In a real app, this would generate and download a CSV file
    toast({
      title: "Review List Exported",
      description: "The review list has been exported as a CSV file."
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setReasonFilter("all");
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CardTitle className="text-white">Review List</CardTitle>
            <InfoTooltip 
              className="ml-2"
              content={
                <div>
                  <p className="font-medium mb-1">Review List:</p>
                  <p>This list contains all programs and recipients that have been flagged for review. Use the search and filters to narrow down the results.</p>
                  <p className="mt-1 text-sm text-gray-300">Export the list as a CSV file for further analysis or action.</p>
                </div>
              }
            />
            <Badge className="ml-3 bg-teal-900/20 text-teal-400 border-teal-800">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute top-2.5 left-2.5 text-gray-500" />
              <Input
                placeholder="Search review list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[250px] bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 pl-9"
              />
              {searchQuery && (
                <X 
                  className="h-4 w-4 absolute top-2.5 right-2.5 text-gray-500 cursor-pointer hover:text-gray-300" 
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-gray-300">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Types</SelectItem>
                <SelectItem value="program" className="text-white hover:bg-gray-700">Programs</SelectItem>
                <SelectItem value="recipient" className="text-white hover:bg-gray-700">Recipients</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-300">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Reasons</SelectItem>
                {uniqueReasons.map(reason => (
                  <SelectItem key={reason} value={reason} className="text-white hover:bg-gray-700">
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700 hover:bg-gray-800 flex items-center gap-1"
              onClick={clearFilters}
            >
              <Filter className="h-4 w-4" /> Clear
            </Button>
            
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center"
              onClick={handleExport}
            >
              <Download className="mr-1 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Ministry</TableHead>
                <TableHead className="text-gray-300">Total Amount</TableHead>
                <TableHead className="text-gray-300"># Programs</TableHead>
                <TableHead className="text-gray-300">Flag Reasons</TableHead>
                <TableHead className="text-gray-300">Date Added</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-800/60">
                    <TableCell className="font-medium text-gray-200">{item.name}</TableCell>
                    <TableCell>
                      <Badge className={`${item.type === 'program' ? 'bg-blue-900/20 text-blue-400 border-blue-800' : 'bg-purple-900/20 text-purple-400 border-purple-800'}`}>
                        {item.type === 'program' ? 'Program' : 'Recipient'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-200">{item.ministry || '-'}</TableCell>
                    <TableCell className="text-gray-200">{formatCurrency(item.totalAmount)}</TableCell>
                    <TableCell className="text-gray-200">{item.programCount || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.flagReason.map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="bg-red-900/20 text-red-400 border-red-800">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-200">{formatDate(item.dateAdded)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => removeFromReviewList(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-400">
                    {items.length > 0 
                      ? "No items match your filter criteria. Try adjusting your filters."
                      : "No items have been flagged for review yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewList;
