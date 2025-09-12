import { useState, useCallback, useMemo } from "react";

interface SearchableItem {
  id: string;
  name: string;
  type: 'client' | 'invoice' | 'quotation' | 'product' | 'supplier' | 'expense';
  data: any;
}

// Mock data for demonstration
const mockData: SearchableItem[] = [
  // Clients
  { id: 'c1', name: 'Safaricom Ltd', type: 'client', data: { email: 'orders@safaricom.co.ke', phone: '+254711123456' } },
  { id: 'c2', name: 'Equity Bank', type: 'client', data: { email: 'marketing@equitybank.co.ke', phone: '+254711654321' } },
  { id: 'c3', name: 'Kenya Power', type: 'client', data: { email: 'info@kplc.co.ke', phone: '+254711987654' } },
  
  // Invoices
  { id: 'i1', name: 'INV-2024-001', type: 'invoice', data: { client: 'Safaricom Ltd', amount: 'KES 12,500', status: 'paid' } },
  { id: 'i2', name: 'INV-2024-002', type: 'invoice', data: { client: 'Equity Bank', amount: 'KES 8,750', status: 'pending' } },
  
  // Quotations  
  { id: 'q1', name: 'Q-2024-001', type: 'quotation', data: { client: 'Kenya Power', amount: 'KES 15,200', status: 'sent' } },
  
  // Products
  { id: 'p1', name: 'Business Cards', type: 'product', data: { category: 'Printing', price: 'KES 1,500' } },
  { id: 'p2', name: 'A4 Flyers', type: 'product', data: { category: 'Printing', price: 'KES 800' } },
  { id: 'p3', name: 'Banner Design', type: 'product', data: { category: 'Design', price: 'KES 3,500' } },
  { id: 'p4', name: 'Logo Design', type: 'product', data: { category: 'Branding', price: 'KES 5,000' } },
  
  // Suppliers
  { id: 's1', name: 'Paper Plus Kenya', type: 'supplier', data: { contact: '+254722111222', category: 'Paper Supplies' } },
  { id: 's2', name: 'Ink Solutions Ltd', type: 'supplier', data: { contact: '+254733444555', category: 'Ink & Toners' } },
  
  // Expenses
  { id: 'e1', name: 'Office Rent - March 2024', type: 'expense', data: { amount: 'KES 45,000', category: 'Rent' } },
  { id: 'e2', name: 'Electricity Bill', type: 'expense', data: { amount: 'KES 8,500', category: 'Utilities' } },
];

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return mockData.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      JSON.stringify(item.data).toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  const getResultsByType = useCallback((type: SearchableItem['type']) => {
    return searchResults.filter(item => item.type === type);
  }, [searchResults]);

  return {
    searchQuery,
    searchResults,
    isSearching,
    search,
    clearSearch,
    getResultsByType,
    hasResults: searchResults.length > 0
  };
}