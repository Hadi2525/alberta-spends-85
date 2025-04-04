
import React, { useState } from "react";
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
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const InfoTooltip = ({ 
  content, 
  icon = <Info className="h-4 w-4 text-teal-400 hover:text-teal-300 transition-colors" />,
  className = "",
  side = "top",
  align = "center"
}: InfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <span 
            className={`inline-flex cursor-help ${className}`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
          >
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-gray-800 border-gray-700 text-gray-200 p-4 max-w-xs shadow-xl"
          sideOffset={5}
          side={side}
          align={align}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
