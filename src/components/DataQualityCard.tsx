
import React from "react";
import { AlertCircle, ArrowRightCircle, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface DataQualityIssue {
  field: string;
  issueCount: number;
  percentage: number;
}

// Added interfaces for the new props
interface MultipleGrantRecipient {
  recipient: string;
  count: number;
}

interface Grant {
  recipient: string;
  ministry: string;
  program: string;
  amount: number;
  [key: string]: any;
}

interface DataQualityCardProps {
  totalRecords?: number;
  issuesCount?: number;
  issuesByField: DataQualityIssue[];
  flaggedItemsCount?: number;
  onReviewList?: () => void;
  // Add the missing props
  corporateWelfarePrograms?: Grant[];
  multipleGrantRecipients?: MultipleGrantRecipient[];
}

const DataQualityCard = ({ 
  totalRecords = 1400, 
  issuesCount = 318, 
  issuesByField,
  flaggedItemsCount = 0,
  onReviewList,
  // Include the new props with defaults
  corporateWelfarePrograms = [],
  multipleGrantRecipients = []
}: DataQualityCardProps) => {
  const issuePercentage = (issuesCount / totalRecords) * 100;
  const hasWarning = issuePercentage > 10;

  return (
    <Card className={`${hasWarning ? 'border-amber-800/50' : 'border-gray-800'} bg-gray-900`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <AlertCircle size={18} className={`${hasWarning ? 'text-amber-500' : 'text-teal-400'} mr-2`} />
            Data Quality & Risk Assessment
            {hasWarning && (
              <Badge className="ml-2 bg-amber-900/20 text-amber-400 border-amber-800">Warning</Badge>
            )}
          </CardTitle>
          <InfoTooltip 
            content={
              <div>
                <p className="font-medium mb-1">Data Quality & Risk Assessment:</p>
                <p>This summary shows data quality issues and risk factors across grant records. Issues include missing data, potential corporate welfare, unnecessary or duplicative programs, and organizations exploiting multiple grant programs.</p>
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
              <span className="text-sm text-gray-300">Total Records with Quality Issues or Risk Factors</span>
              <span className="text-sm font-medium text-gray-200">{issuesCount} of {totalRecords} ({issuePercentage.toFixed(1)}%)</span>
            </div>
            <Progress 
              value={issuePercentage} 
              className="h-2 bg-gray-800" 
              indicatorClassName={hasWarning ? "bg-amber-500" : "bg-teal-500"} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {issuesByField && issuesByField.map((issue, index) => (
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

          <div className="border border-gray-800 rounded-md p-3 mt-4 bg-gray-800/30">
            <h3 className="text-sm font-medium text-white mb-2">Key Risk Assessment Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-red-800/50 rounded-md p-2 bg-red-900/10">
                <div className="flex items-start gap-2">
                  <Badge className="bg-red-900/30 text-red-400 border-red-800">Corporate Welfare</Badge>
                  <InfoTooltip 
                    content="Grants disproportionately benefiting large, profitable corporations without clear public benefit."
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Grants to profitable corporations, especially over $1M
                </p>
              </div>
              
              <div className="border border-amber-800/50 rounded-md p-2 bg-amber-900/10">
                <div className="flex items-start gap-2">
                  <Badge className="bg-amber-900/30 text-amber-400 border-amber-800">Unnecessary Programs</Badge>
                  <InfoTooltip 
                    content="Grants that appear duplicative, outdated, or lacking measurable impact."
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Duplicative or low-impact grant programs
                </p>
              </div>
              
              <div className="border border-blue-800/50 rounded-md p-2 bg-blue-900/10">
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-900/30 text-blue-400 border-blue-800">Multiple Program Exploitation</Badge>
                  <InfoTooltip 
                    content="Organizations receiving grants from multiple programs, potentially indicating over-reliance on public funds."
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Organizations receiving 3+ different grants
                </p>
              </div>
              
              <div className="border border-purple-800/50 rounded-md p-2 bg-purple-900/10">
                <div className="flex items-start gap-2">
                  <Badge className="bg-purple-900/30 text-purple-400 border-purple-800">Operational Grants</Badge>
                  <InfoTooltip 
                    content="Transfers between government and agencies (excluded from wasteful spending analysis)."
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Standard operational funding (excluded from analysis)
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {onReviewList && (
        <CardFooter className="border-t border-gray-800 pt-4 mt-1">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-center gap-2"
            onClick={onReviewList}
          >
            <Flag className="h-4 w-4 text-amber-500" />
            View Review List ({flaggedItemsCount} items)
            <ArrowRightCircle className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DataQualityCard;
