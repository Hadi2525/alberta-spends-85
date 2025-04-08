
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { Flag, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipient {
  id: string;
  name: string;
  totalAmount?: number;
  programCount?: number;
  grantCount?: number;
  isFlagged: boolean;
  riskFactors: string[];
}

interface TopRecipientsTableProps {
  title: string;
  subtitle: string;
  recipients: Recipient[];
  type: 'amount' | 'programCount';
  onFlagRecipient: (id: string, flag: boolean) => void;
  addToReviewList: (recipient: Recipient) => void;
  flagButtonStyle?: string;
  flaggedButtonStyle?: string;
}

const TopRecipientsTable = ({ 
  title, 
  subtitle, 
  recipients, 
  type, 
  onFlagRecipient, 
  addToReviewList,
  flagButtonStyle = "bg-amber-600 hover:bg-amber-700 text-white",
  flaggedButtonStyle = "bg-green-600 hover:bg-green-700 text-white" 
}: TopRecipientsTableProps) => {
  const { toast } = useToast();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const handleAddToReview = (recipient: Recipient) => {
    addToReviewList(recipient);
    onFlagRecipient(recipient.id, true);
    
    toast({
      title: "Recipient Flagged",
      description: `${recipient.name} has been added to your review list.`,
    });
  };

  const handleRemoveFlag = (recipient: Recipient, id: string) => {
    onFlagRecipient(id, false);
    
    toast({
      title: "Flag Removed",
      description: `${recipient.name} has been removed from your review list.`,
    });
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-white">{title}</CardTitle>
          <InfoTooltip 
            className="ml-2"
            content={
              <div>
                <p className="font-medium mb-1">{title}:</p>
                <p>{subtitle}</p>
              </div>
            }
          />
        </div>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-300">Recipient</TableHead>
              {type === 'programCount' ? (
                <TableHead className="text-gray-300 text-center">Program Count</TableHead>
              ) : (
                <TableHead className="text-gray-300 text-center">Grant Count</TableHead>
              )}
              <TableHead className="text-gray-300 text-right">Total Amount</TableHead>
              <TableHead className="text-gray-300">Risk Factors</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipients.map((recipient) => (
              <TableRow key={recipient.id} className="hover:bg-gray-800/60">
                <TableCell className="font-medium text-gray-200">{recipient.name}</TableCell>
                {type === 'programCount' ? (
                  <TableCell className="text-center text-gray-200">{recipient.programCount}</TableCell>
                ) : (
                  <TableCell className="text-center text-gray-200">{recipient.grantCount}</TableCell>
                )}
                <TableCell className="text-right text-gray-200">{formatCurrency(recipient.totalAmount || 0)}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {recipient.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className={
                        factor.includes("Corporate") ? "bg-red-900/20 text-red-400 border-red-800" :
                        factor.includes("Amount") ? "bg-amber-900/20 text-amber-400 border-amber-800" :
                        factor.includes("Multiple") || factor.includes("Program Count") ? "bg-blue-900/20 text-blue-400 border-blue-800" :
                        factor.includes("Operational") ? "bg-purple-900/20 text-purple-400 border-purple-800" :
                        "bg-gray-700 text-gray-300 border-gray-600"
                      }>
                        {factor}
                      </Badge>
                    ))}
                    {recipient.riskFactors.length === 0 && (
                      <span className="text-gray-400 text-xs">No risk factors</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {recipient.isFlagged ? (
                    <Button 
                      size="sm" 
                      className={flaggedButtonStyle}
                      onClick={() => handleRemoveFlag(recipient, recipient.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" /> Submitted for Review
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      className={flagButtonStyle}
                      onClick={() => handleAddToReview(recipient)}
                    >
                      <Flag className="mr-1 h-4 w-4" /> Flag for Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopRecipientsTable;
