
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
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CardTitle className="text-foreground">Review List</CardTitle>
            <InfoTooltip 
              className="ml-2"
              content={
                <div>
                  <p className="font-medium mb-1">Review List:</p>
                  <p>This list contains all programs and recipients that have been flagged for review. Use the search and filters to narrow down the results.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Export the list as a CSV file for further analysis or action.</p>
                </div>
              }
            />
            <Badge className="ml-3 bg-teal-700 text-white border-teal-600">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute top-2.5 left-2.5 text-muted-foreground" />
              <Input
                placeholder="Search review list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[250px] bg-input border-border text-foreground placeholder-muted-foreground pl-9"
              />
              {searchQuery && (
                <X 
                  className="h-4 w-4 absolute top-2.5 right-2.5 text-muted-foreground cursor-pointer hover:text-foreground" 
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] bg-input border-border text-foreground">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all" className="text-foreground hover:bg-muted">All Types</SelectItem>
                <SelectItem value="program" className="text-foreground hover:bg-muted">Programs</SelectItem>
                <SelectItem value="recipient" className="text-foreground hover:bg-muted">Recipients</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-[180px] bg-input border-border text-foreground">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all" className="text-foreground hover:bg-muted">All Reasons</SelectItem>
                {uniqueReasons.map(reason => (
                  <SelectItem key={reason} value={reason} className="text-foreground hover:bg-muted">
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="text-foreground border-border hover:bg-muted flex items-center gap-1 font-medium shadow-sm hover:shadow"
              onClick={clearFilters}
            >
              <Filter className="h-4 w-4" /> Clear
            </Button>
            
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center shadow-md hover:shadow-lg"
              onClick={handleExport}
            >
              <Download className="mr-1 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Type</TableHead>
                <TableHead className="text-foreground">Ministry</TableHead>
                <TableHead className="text-foreground">Total Amount</TableHead>
                <TableHead className="text-foreground"># Programs</TableHead>
                <TableHead className="text-foreground">Flag Reasons</TableHead>
                <TableHead className="text-foreground">Date Added</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/40 border-b border-border">
                    <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                    <TableCell>
                      <Badge className={`${item.type === 'program' ? 'bg-blue-800 text-white border-blue-700' : 'bg-purple-800 text-white border-purple-700'}`}>
                        {item.type === 'program' ? 'Program' : 'Recipient'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{item.ministry || '-'}</TableCell>
                    <TableCell className="text-foreground">{formatCurrency(item.totalAmount)}</TableCell>
                    <TableCell className="text-foreground">{item.programCount || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.flagReason.map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="bg-red-800/30 text-red-300 border-red-700">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{formatDate(item.dateAdded)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                        onClick={() => removeFromReviewList(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
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
