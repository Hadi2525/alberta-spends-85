
import React, { useState } from "react";
import { Flag, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { useToast } from "@/hooks/use-toast";

interface Recipient {
  id: string;
  name: string;
  programCount?: number;
  totalAmount: number;
  grantCount?: number;
  isFlagged: boolean;
  riskFactors: string[];
}

interface TopRecipientsTableProps {
  title: string;
  subtitle?: string;
  recipients: Recipient[];
  type: "amount" | "programCount";
  onFlagRecipient: (id: string, flag: boolean) => void;
  addToReviewList: (recipient: Recipient) => void;
}

const TopRecipientsTable = ({ 
  title,
  subtitle,
  recipients, 
  type,
  onFlagRecipient,
  addToReviewList
}: TopRecipientsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
    key: type === "amount" ? "totalAmount" : "programCount",
    direction: 'descending'
  });
  const { toast } = useToast();

  // Sort recipients based on current sort configuration
  const sortedRecipients = [...recipients].sort((a, b) => {
    const key = sortConfig.key as keyof Recipient;
    
    if (key === "totalAmount" || key === "programCount" || key === "grantCount") {
      const aValue = a[key] as number || 0;
      const bValue = b[key] as number || 0;
      
      return sortConfig.direction === 'ascending' 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    // Handle string sorting
    const aValue = String(a[key] || "");
    const bValue = String(b[key] || "");
    
    return sortConfig.direction === 'ascending' 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });

  // Filter recipients based on search query
  const filteredRecipients = sortedRecipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'descending' 
        ? 'ascending' 
        : 'descending'
    });
  };

  const handleFlagClick = (recipient: Recipient) => {
    onFlagRecipient(recipient.id, !recipient.isFlagged);
    
    if (!recipient.isFlagged) {
      addToReviewList(recipient);
      toast({
        title: `${recipient.name} flagged for review`,
        description: `Added to the review list for further investigation.`
      });
    } else {
      toast({
        title: `${recipient.name} removed from review list`,
        description: `No longer flagged for review.`
      });
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpDown className="h-4 w-4 text-teal-400" /> 
      : <ArrowUpDown className="h-4 w-4 text-teal-400 transform rotate-180" />;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CardTitle className="text-white">
              {title}
            </CardTitle>
            <InfoTooltip 
              className="ml-2"
              content={
                <div>
                  <p className="font-medium mb-1">{title}:</p>
                  <p>{subtitle || (type === "amount" 
                      ? "Organizations receiving the largest total grant amounts across all programs." 
                      : "Organizations receiving grants from multiple different programs, potentially indicating over-reliance on government funding.")}</p>
                </div>
              }
            />
          </div>
          <div>
            <Input
              placeholder="Search recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead 
                  className="text-gray-300 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Recipient {getSortIcon('name')}
                  </div>
                </TableHead>
                {type === "programCount" && (
                  <TableHead 
                    className="text-gray-300 cursor-pointer"
                    onClick={() => handleSort('programCount')}
                  >
                    <div className="flex items-center">
                      Program Count {getSortIcon('programCount')}
                    </div>
                  </TableHead>
                )}
                <TableHead 
                  className="text-gray-300 cursor-pointer"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Total Amount {getSortIcon('totalAmount')}
                  </div>
                </TableHead>
                {type === "amount" && (
                  <TableHead 
                    className="text-gray-300 cursor-pointer"
                    onClick={() => handleSort('grantCount')}
                  >
                    <div className="flex items-center">
                      Grant Count {getSortIcon('grantCount')}
                    </div>
                  </TableHead>
                )}
                <TableHead className="text-gray-300">Risk Factors</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipients.length > 0 ? (
                filteredRecipients.map((recipient) => (
                  <TableRow key={recipient.id} className="hover:bg-gray-800/60">
                    <TableCell className="font-medium text-gray-200">
                      {recipient.name}
                    </TableCell>
                    {type === "programCount" && (
                      <TableCell className="text-gray-200">
                        {recipient.programCount}
                        {recipient.programCount && recipient.programCount > 5 && (
                          <Badge className="ml-2 bg-amber-900/20 text-amber-400 border-amber-800">High</Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-gray-200">
                      {formatCurrency(recipient.totalAmount)}
                    </TableCell>
                    {type === "amount" && (
                      <TableCell className="text-gray-200">
                        {recipient.grantCount}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {recipient.riskFactors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="bg-red-900/20 text-red-400 border-red-800">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className={recipient.isFlagged 
                          ? "bg-red-900/20 text-red-400 border-red-800 hover:bg-red-900/40" 
                          : "text-gray-300 border-gray-700 hover:bg-gray-800"}
                        onClick={() => handleFlagClick(recipient)}
                      >
                        {recipient.isFlagged ? (
                          <>
                            <AlertTriangle className="mr-1 h-4 w-4" /> Flagged
                          </>
                        ) : (
                          <>
                            <Flag className="mr-1 h-4 w-4" /> Flag for Review
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={type === "amount" ? 5 : 5} className="text-center py-6 text-gray-400">
                    No recipients found matching your search criteria.
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

export default TopRecipientsTable;
