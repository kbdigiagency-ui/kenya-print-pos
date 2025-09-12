import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { importFromCSV, ExportData } from '@/utils/fileExport';

interface ImportResult {
  success: boolean;
  data?: ExportData[];
  error?: string;
  fileName?: string;
}

export function useFileImport() {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const importCSV = async (file: File): Promise<ImportResult> => {
    setIsImporting(true);
    
    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('Please select a CSV file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const data = await importFromCSV(file);
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${data.length} records from ${file.name}`,
      });

      setIsImporting(false);
      return {
        success: true,
        data,
        fileName: file.name
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Import failed';
      
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsImporting(false);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const importJSON = async (file: File): Promise<ImportResult> => {
    setIsImporting(true);
    
    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        throw new Error('Please select a JSON file');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate backup format
      if (!data.data || !data.generatedAt) {
        throw new Error('Invalid backup file format');
      }

      toast({
        title: "Backup Import Successful",
        description: `Successfully imported backup from ${file.name}`,
      });

      setIsImporting(false);
      return {
        success: true,
        data: data.data,
        fileName: file.name
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Import failed';
      
      toast({
        title: "Import Failed", 
        description: errorMessage,
        variant: "destructive",
      });

      setIsImporting(false);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const validateImportData = (data: ExportData[], requiredFields: string[]): boolean => {
    if (!data.length) return false;
    
    // Check if all required fields are present
    const firstRow = data[0];
    const missingFields = requiredFields.filter(field => !(field in firstRow));
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Missing required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    importCSV,
    importJSON,
    validateImportData,
    isImporting
  };
}