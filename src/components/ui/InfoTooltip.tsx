
import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const InfoTooltip = ({ 
  content, 
  icon = <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />,
  className = ""
}: InfoTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex cursor-help ${className}`}>{icon}</span>
      </TooltipTrigger>
      <TooltipContent 
        className="bg-gray-800 border-gray-700 text-gray-200 p-4 max-w-xs"
        sideOffset={5}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default InfoTooltip;
