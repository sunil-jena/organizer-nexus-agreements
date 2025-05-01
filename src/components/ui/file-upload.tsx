
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCheck, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  value?: string;
  onChange: (file: File | null) => void;
  onClear?: () => void;
  hint?: string;
  error?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept = "application/pdf,image/*",
  value,
  onChange,
  onClear,
  hint,
  error,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);
      
      // Create preview URL for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(null);
    if (onClear) onClear();
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      
      <div className="flex flex-col gap-2">
        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {!file && !preview ? (
          <div 
            onClick={handleButtonClick}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors",
              error ? "border-red-300" : "border-gray-300"
            )}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
          </div>
        ) : (
          <div className="border rounded-lg p-3 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium truncate max-w-[180px]">
                {file ? file.name : value || "File uploaded"}
              </span>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {preview && preview.startsWith('data:image') && (
          <div className="mt-2 border rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="max-h-32 object-contain mx-auto" />
          </div>
        )}
        
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};
