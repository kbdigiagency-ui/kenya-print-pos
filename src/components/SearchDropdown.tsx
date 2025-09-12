import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, FileText, Users, Package, Building2, Receipt, DollarSign } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useNavigate } from "react-router-dom";

export function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { search, searchResults, isSearching, clearSearch, hasResults } = useSearch();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (inputValue.trim()) {
        search(inputValue);
        setIsOpen(true);
      } else {
        clearSearch();
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [inputValue, search, clearSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'client': return <Users className="h-4 w-4" />;
      case 'invoice': return <FileText className="h-4 w-4" />;
      case 'quotation': return <Receipt className="h-4 w-4" />;
      case 'product': return <Package className="h-4 w-4" />;
      case 'supplier': return <Building2 className="h-4 w-4" />;
      case 'expense': return <DollarSign className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getNavigationPath = (type: string) => {
    switch (type) {
      case 'client': return '/clients';
      case 'invoice':
      case 'quotation': return '/invoices';
      case 'supplier': return '/suppliers';
      case 'expense': return '/expenses';
      case 'product': return '/sales';
      default: return '/dashboard';
    }
  };

  const handleResultClick = (result: any) => {
    const path = getNavigationPath(result.type);
    navigate(path);
    setIsOpen(false);
    setInputValue('');
    clearSearch();
  };

  const handleClear = () => {
    setInputValue('');
    clearSearch();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder="Search clients, invoices, or products..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (hasResults) setIsOpen(true);
          }}
          className="pl-9 pr-9 bg-muted/50 border-0 focus-visible:ring-1"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isOpen && (inputValue.trim() || hasResults) && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-hidden shadow-lg"
        >
          <CardContent className="p-0">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-6 w-6 mx-auto mb-2 animate-pulse" />
                Searching...
              </div>
            ) : hasResults ? (
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-muted-foreground">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{result.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        {result.data && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.type === 'client' && result.data.email}
                            {result.type === 'invoice' && `${result.data.client} - ${result.data.amount}`}
                            {result.type === 'quotation' && `${result.data.client} - ${result.data.amount}`}
                            {result.type === 'product' && `${result.data.category} - ${result.data.price}`}
                            {result.type === 'supplier' && result.data.category}
                            {result.type === 'expense' && `${result.data.category} - ${result.data.amount}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : inputValue.trim() ? (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p>No results found for "{inputValue}"</p>
                <p className="text-xs mt-1">Try searching for clients, invoices, products, or suppliers</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}