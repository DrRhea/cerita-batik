'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FiCheck, FiX, FiUpload } from 'react-icons/fi';

interface UploadFile {
  name: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadProgressProps {
  files: UploadFile[];
  onClose: () => void;
}

export default function UploadProgress({ files, onClose }: UploadProgressProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (files.length === 0) return null;

  const uploadingFiles = files.filter(f => f.status === 'uploading');
  const completedFiles = files.filter(f => f.status === 'success');
  const errorFiles = files.filter(f => f.status === 'error');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`transition-all duration-300 ${isMinimized ? 'w-64' : 'w-80'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiUpload className="text-primary" />
              <span className="font-medium">Upload Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMinimized ? '▼' : '▲'}
              </button>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="space-y-3">
              {/* Uploading Files */}
              {uploadingFiles.map((file, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground">{file.progress}%</span>
                  </div>
                  <Progress value={file.progress} className="h-2" />
                </div>
              ))}

              {/* Completed Files */}
              {completedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                  <FiCheck size={16} />
                  <span className="truncate">{file.name}</span>
                </div>
              ))}

              {/* Error Files */}
              {errorFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                  <FiX size={16} />
                  <span className="truncate">{file.name}</span>
                  {file.error && (
                    <span className="text-xs text-muted-foreground">({file.error})</span>
                  )}
                </div>
              ))}

              {/* Summary */}
              <div className="pt-2 border-t text-xs text-muted-foreground">
                {uploadingFiles.length > 0 && (
                  <div>Uploading: {uploadingFiles.length}</div>
                )}
                {completedFiles.length > 0 && (
                  <div className="text-green-600">Completed: {completedFiles.length}</div>
                )}
                {errorFiles.length > 0 && (
                  <div className="text-red-600">Failed: {errorFiles.length}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 