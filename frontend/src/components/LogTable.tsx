
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Search } from "lucide-react";

interface LogTableProps {
  data: any[];
  isSample?: boolean;
}

export default function LogTable({ data, isSample = false }: LogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  
  const headers = Object.keys(data[0] || {});
  
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "error":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "info":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTargetLabelColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case "security alert":
        return "bg-red-100 text-red-700";
      case "system notification":
        return "bg-blue-100 text-blue-700";
      case "http status":
        return "bg-purple-100 text-purple-700";
      case "workflow error":
        return "bg-orange-100 text-orange-700";
      case "deprecation warning":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const filteredData = data.filter(row => {
    // Apply search filter
    const matchesSearch = Object.values(row).some(
      value => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply category/type filter
    const matchesFilter = currentFilter 
      ? row.category === currentFilter || row.severity === currentFilter || row.target_label === currentFilter
      : true;
    
    return matchesSearch && matchesFilter;
  });
  
  // Get unique categories, severities, and target_labels for filters
  const categories = Array.from(new Set(data.map(row => row.category))).filter(Boolean);
  const severities = Array.from(new Set(data.map(row => row.severity))).filter(Boolean);
  const targetLabels = Array.from(new Set(data.map(row => row.target_label))).filter(Boolean);

  return (
    <div className={`glass rounded-xl overflow-hidden subtle-shadow ${isSample ? 'border border-dashed border-blue-200' : ''}`}>
      {!isSample && (
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  {currentFilter || "Filter"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrentFilter(null)}>
                  All
                </DropdownMenuItem>
                {categories.length > 0 && (
                  <>
                    <DropdownMenuItem disabled className="text-xs text-gray-500 py-1 opacity-50">
                      By Category
                    </DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={`category-${category}`}
                        onClick={() => setCurrentFilter(category as string)}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                {severities.length > 0 && (
                  <>
                    <DropdownMenuItem disabled className="text-xs text-gray-500 py-1 opacity-50">
                      By Severity
                    </DropdownMenuItem>
                    {severities.map((severity) => (
                      <DropdownMenuItem 
                        key={`severity-${severity}`}
                        onClick={() => setCurrentFilter(severity as string)}
                      >
                        {severity}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                {targetLabels.length > 0 && (
                  <>
                    <DropdownMenuItem disabled className="text-xs text-gray-500 py-1 opacity-50">
                      By Classification
                    </DropdownMenuItem>
                    {targetLabels.map((label) => (
                      <DropdownMenuItem 
                        key={`label-${label}`}
                        onClick={() => setCurrentFilter(label as string)}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {currentFilter && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10"
                onClick={() => setCurrentFilter(null)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}
      
      {isSample && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <p className="text-blue-700 text-sm font-medium">Sample Classification Output</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="font-medium capitalize">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50">
                  {headers.map((header, cellIndex) => (
                    <TableCell key={`${rowIndex}-${cellIndex}`}>
                      {header.toLowerCase() === "severity" ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(row[header])}`}>
                          {row[header]}
                        </span>
                      ) : header.toLowerCase() === "target_label" ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTargetLabelColor(row[header])}`}>
                          {row[header]}
                        </span>
                      ) : (
                        row[header]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} className="h-32 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
