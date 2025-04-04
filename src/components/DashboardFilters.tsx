
import React from "react";
import { FilterIcon, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import InfoTooltip from "@/components/ui/InfoTooltip";

// Mock data for elements - replace with API calls
const fiscalYears = ["ALL YEARS", "2023-2024", "2022-2023", "2021-2022", "2020-2021", "2019-2020"];
const ministries = ["ALL MINISTRIES", "HEALTH", "EDUCATION", "ADVANCED EDUCATION", "MUNICIPAL AFFAIRS", "AGRICULTURE AND IRRIGATION", "ENVIRONMENT AND PROTECTED AREAS", "TRANSPORTATION AND ECONOMIC CORRIDORS", "INDIGENOUS RELATIONS", "SENIORS COMMUNITY AND SOCIAL SERVICES"];
const programs = ["ALL PROGRAMS", "Healthcare Infrastructure", "School Support", "Research Grants", "Municipal Development", "Rural Support Initiative", "Climate Action Fund", "Transportation Development", "Indigenous Community Support", "Senior Care Services"];
const businessUnits = ["ALL BUSINESS UNITS", "Community Services", "Health Services", "Education Services", "Infrastructure", "Economic Development", "Research and Development", "Program Administration", "Policy Development", "Grant Administration"];

interface DashboardFiltersProps {
  activeFilters: {
    years: string[];
    ministries: string[];
    programs: string[];
    businessUnits: string[];
    excludeOperational: boolean;
  };
  setActiveFilters: React.Dispatch<React.SetStateAction<{
    years: string[];
    ministries: string[];
    programs: string[];
    businessUnits: string[];
    excludeOperational: boolean;
  }>>;
  isFilterExpanded: boolean;
  setIsFilterExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardFilters = ({ 
  activeFilters, 
  setActiveFilters, 
  isFilterExpanded, 
  setIsFilterExpanded 
}: DashboardFiltersProps) => {
  
  const updateFilter = (
    type: 'years' | 'ministries' | 'programs' | 'businessUnits', 
    value: string
  ) => {
    setActiveFilters(prev => {
      // If ALL is selected, clear all other selections
      if (value.includes("ALL")) {
        return {
          ...prev,
          [type]: [value]
        };
      }
      
      // If any specific item is selected, remove ALL from the array
      const newValues = prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type].filter(item => !item.includes("ALL")), value];
      
      // If nothing is selected, default to ALL
      if (newValues.length === 0) {
        return {
          ...prev,
          [type]: [type === 'years' ? "ALL YEARS" : 
                   type === 'ministries' ? "ALL MINISTRIES" : 
                   type === 'programs' ? "ALL PROGRAMS" : 
                   "ALL BUSINESS UNITS"]
        };
      }
      
      return {
        ...prev,
        [type]: newValues
      };
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      years: ["ALL YEARS"],
      ministries: ["ALL MINISTRIES"],
      programs: ["ALL PROGRAMS"],
      businessUnits: ["ALL BUSINESS UNITS"],
      excludeOperational: false
    });
  };

  const renderFilterBadges = () => {
    if (!isFilterExpanded) {
      const totalFilters = 
        (activeFilters.years.length > 0 && !activeFilters.years.includes("ALL YEARS") ? activeFilters.years.length : 0) +
        (activeFilters.ministries.length > 0 && !activeFilters.ministries.includes("ALL MINISTRIES") ? activeFilters.ministries.length : 0) +
        (activeFilters.programs.length > 0 && !activeFilters.programs.includes("ALL PROGRAMS") ? activeFilters.programs.length : 0) +
        (activeFilters.businessUnits.length > 0 && !activeFilters.businessUnits.includes("ALL BUSINESS UNITS") ? activeFilters.businessUnits.length : 0) +
        (activeFilters.excludeOperational ? 1 : 0);
      
      if (totalFilters === 0) return null;
      
      return (
        <Badge variant="outline" className="bg-teal-600/20 text-teal-400 border-teal-800 px-2 py-1">
          {totalFilters} active filter{totalFilters !== 1 ? 's' : ''}
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <Card className="bg-gray-900 border-gray-800 mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CardTitle className="text-white flex items-center">
              <FilterIcon size={18} className="text-teal-400 mr-2" />
              Filters
            </CardTitle>
            <InfoTooltip 
              className="ml-2"
              content={
                <div>
                  <p className="font-medium mb-1">Dashboard Filters:</p>
                  <p>Filter the dashboard data by fiscal year, ministry, program, and business unit. You can also exclude operational grants to government agencies.</p>
                </div>
              }
            />
            {renderFilterBadges()}
          </div>
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            {isFilterExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>
      
      {isFilterExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Fiscal Year</label>
              <Select 
                value={activeFilters.years.length === 1 ? activeFilters.years[0] : undefined}
                onValueChange={(value) => updateFilter('years', value)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-300">
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
              {activeFilters.years.length > 0 && !activeFilters.years.includes("ALL YEARS") && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeFilters.years.map(year => (
                    <Badge key={year} variant="outline" className="bg-gray-800 text-gray-200 hover:bg-gray-700 gap-1 cursor-pointer" onClick={() => updateFilter('years', year)}>
                      {year} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Ministry</label>
              <Select 
                value={activeFilters.ministries.length === 1 ? activeFilters.ministries[0] : undefined}
                onValueChange={(value) => updateFilter('ministries', value)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-300">
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
              {activeFilters.ministries.length > 0 && !activeFilters.ministries.includes("ALL MINISTRIES") && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeFilters.ministries.map(ministry => (
                    <Badge key={ministry} variant="outline" className="bg-gray-800 text-gray-200 hover:bg-gray-700 gap-1 cursor-pointer" onClick={() => updateFilter('ministries', ministry)}>
                      {ministry.length > 15 ? ministry.substring(0, 12) + '...' : ministry} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Program</label>
              <Select 
                value={activeFilters.programs.length === 1 ? activeFilters.programs[0] : undefined}
                onValueChange={(value) => updateFilter('programs', value)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {programs.map((program) => (
                    <SelectItem key={program} value={program} className="text-white hover:bg-gray-700">
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeFilters.programs.length > 0 && !activeFilters.programs.includes("ALL PROGRAMS") && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeFilters.programs.map(program => (
                    <Badge key={program} variant="outline" className="bg-gray-800 text-gray-200 hover:bg-gray-700 gap-1 cursor-pointer" onClick={() => updateFilter('programs', program)}>
                      {program.length > 15 ? program.substring(0, 12) + '...' : program} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Business Unit</label>
              <Select 
                value={activeFilters.businessUnits.length === 1 ? activeFilters.businessUnits[0] : undefined}
                onValueChange={(value) => updateFilter('businessUnits', value)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Select Business Unit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {businessUnits.map((unit) => (
                    <SelectItem key={unit} value={unit} className="text-white hover:bg-gray-700">
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeFilters.businessUnits.length > 0 && !activeFilters.businessUnits.includes("ALL BUSINESS UNITS") && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeFilters.businessUnits.map(unit => (
                    <Badge key={unit} variant="outline" className="bg-gray-800 text-gray-200 hover:bg-gray-700 gap-1 cursor-pointer" onClick={() => updateFilter('businessUnits', unit)}>
                      {unit.length > 15 ? unit.substring(0, 12) + '...' : unit} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="exclude-operational" 
                checked={activeFilters.excludeOperational}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({ ...prev, excludeOperational: checked === true }))
                }
                className="bg-gray-800 border-gray-700 data-[state=checked]:bg-teal-600"
              />
              <label
                htmlFor="exclude-operational"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
              >
                Exclude Operational Grants
              </label>
              <InfoTooltip 
                content={
                  <div>
                    <p>Excludes grants to government agencies like Alberta Health Services or other operational entities.</p>
                  </div>
                }
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DashboardFilters;
