
import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface DataQualityIssue {
  field: string;
  issueCount: number;
  percentage: number;
}

interface DataQualityCardProps {
  totalRecords?: number;
  issuesCount?: number;
  issuesByField: DataQualityIssue[];
  flaggedItemsCount?: number;
}

const DataQualityCard = ({ 
  totalRecords = 1400, 
  issuesCount = 318, 
  issuesByField,
  flaggedItemsCount = 0
}: DataQualityCardProps) => {
  const issuePercentage = (issuesCount / totalRecords) * 100;
  const hasWarning = issuePercentage > 10;

  return (
    <Card className={`${hasWarning ? 'border-amber-800/50' : 'border-gray-800'} bg-gray-900`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <AlertCircle size={18} className={`${hasWarning ? 'text-amber-500' : 'text-teal-400'} mr-2`} />
            Data Quality Overview
            {hasWarning && (
              <Badge className="ml-2 bg-amber-900/20 text-amber-400 border-amber-800">Warning</Badge>
            )}
          </CardTitle>
          <InfoTooltip 
            content={
              <div>
                <p className="font-medium mb-1">Data Quality:</p>
                <p>This summary shows data quality issues across grant records. Issues include missing data, inconsistent formatting, or potential errors.</p>
                <p className="mt-1 text-sm text-gray-300">A warning is shown when more than 10% of records have quality issues.</p>
              </div>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-300">Total Records with Issues</span>
              <span className="text-sm font-medium text-gray-200">{issuesCount} of {totalRecords} ({issuePercentage.toFixed(1)}%)</span>
            </div>
            <Progress 
              value={issuePercentage} 
              className="h-2 bg-gray-800" 
              indicatorClassName={hasWarning ? "bg-amber-500" : "bg-teal-500"} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {issuesByField.map((issue, index) => (
              <div key={index} className="border border-gray-800 rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">{issue.field}</span>
                  <span className="text-sm font-medium text-gray-200">{issue.percentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={issue.percentage} 
                  className="h-1.5 bg-gray-800" 
                  indicatorClassName={issue.percentage > 15 ? "bg-red-500" : issue.percentage > 5 ? "bg-amber-500" : "bg-teal-500"} 
                />
                <p className="text-xs text-gray-400 mt-1">{issue.issueCount} records affected</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataQualityCard;
