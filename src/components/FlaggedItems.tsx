
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Flag, AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";
import { grantsData, flaggingCriteria, downloadCSV, generateCSV } from "@/data/grantsData";
import { useToast } from "@/hooks/use-toast";

const FlaggedItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [criteria, setCriteria] = useState(flaggingCriteria);
  const { toast } = useToast();
  
  // Get only flagged items from the data
  const flaggedData = grantsData.filter(item => item.flagged);
  
  // Format currency numbers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };
  
  // Filter flagged items by search query
  const filteredData = searchQuery
    ? flaggedData.filter(
        item => 
          item.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.flagReason && item.flagReason.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : flaggedData;
  
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };
  
  const handleExport = () => {
    const dataToExport = selectedItems.length > 0
      ? filteredData.filter(item => selectedItems.includes(item.id))
      : filteredData;
      
    const csvData = generateCSV(dataToExport);
    const fileName = `flagged_grants_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvData, fileName);
    
    toast({
      title: "Export Complete",
      description: `${dataToExport.length} flagged records exported to ${fileName}`
    });
  };
  
  const handleCriteriaChange = (id: string, enabled: boolean) => {
    setCriteria(prev => prev.map(item => 
      item.id === id ? { ...item, enabled } : item
    ));
    
    toast({
      title: "Flagging Criteria Updated",
      description: "Changes to flagging criteria will apply to new data analyses."
    });
  };
  
  const handleRemoveFlag = (id: string) => {
    // This would normally update the database
    setSelectedItems(prev => prev.filter(item => item !== id));
    
    toast({
      title: "Flag Removed",
      description: "This item has been removed from the flagged list.",
      variant: "success"
    });
  };

  const handleBulkAction = (action: 'approve' | 'remove') => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to perform this action.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: action === 'approve' ? "Items Approved" : "Flags Removed",
      description: `${selectedItems.length} items have been ${action === 'approve' ? 'approved' : 'unflagged'}.`,
      variant: "success"
    });
    
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> Flagged Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{flaggedData.length}</div>
            <p className="text-sm text-gray-400 mt-1">Total grants flagged for review</p>
          </Card>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Flag size={18} className="text-teal-500" /> Flagging Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {((flaggedData.length / grantsData.length) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-400 mt-1">Percentage of total grants flagged</p>
          </Card>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> Total Value At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(flaggedData.reduce((sum, item) => sum + item.amount, 0))}
            </div>
            <p className="text-sm text-gray-400 mt-1">Total value of flagged grants</p>
          </Card>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <CardTitle className="text-white">Review List</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => handleBulkAction('approve')}
                    disabled={selectedItems.length === 0}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Selected
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => handleBulkAction('remove')}
                    disabled={selectedItems.length === 0}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Remove Flags
                  </Button>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleExport}
                  >
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search flagged items..."
                    className="pl-9 bg-gray-800 border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-800">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-gray-400">Ministry</TableHead>
                      <TableHead className="text-gray-400">Program</TableHead>
                      <TableHead className="text-gray-400">Recipient</TableHead>
                      <TableHead className="text-gray-400 text-right">Amount</TableHead>
                      <TableHead className="text-gray-400">Flag Reason</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-800/60">
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.ministry}</TableCell>
                          <TableCell>{item.program}</TableCell>
                          <TableCell>{item.recipient}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-800">
                              {item.flagReason || "Potential Anomaly"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-900/20 hover:text-red-400"
                              onClick={() => handleRemoveFlag(item.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                          No flagged items found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Flagging Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {criteria.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 pb-3 border-b border-gray-800">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(checked) => handleCriteriaChange(item.id, checked)}
                  />
                  <div>
                    <h4 className="font-medium text-white">{item.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <p className="text-sm text-gray-500">
                  <AlertTriangle className="inline h-4 w-4 mr-1 text-amber-500" />
                  Flagging criteria are used to automatically identify potential issues in grant disbursements. Enable or disable criteria as needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlaggedItems;
