import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  children?: React.ReactNode;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "*", 
  maxSize = 5, 
  children, 
  className = "" 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    // Check file type if accept is specified
    if (accept !== "*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      const isValidType = acceptedTypes.some(type => 
        type === mimeType || type === fileExtension || type === '*'
      );

      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `Please select a file matching: ${accept}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <Card className={`${className} ${isDragOver ? 'border-primary bg-primary/5' : ''}`}>
      <CardContent className="p-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${selectedFile ? 'border-success bg-success/5' : ''}
          `}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-8 w-8 text-success" />
              <div className="space-y-2">
                <p className="font-medium text-success">File Selected</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  {accept !== "*" && `Accepted formats: ${accept}`}
                  {maxSize && ` • Max size: ${maxSize}MB`}
                </p>
              </div>
              
              <div className="pt-2">
                <input
                  type="file"
                  accept={accept}
                  onChange={handleInputChange}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}