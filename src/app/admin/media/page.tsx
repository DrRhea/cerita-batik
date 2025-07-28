'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiUpload, FiSearch, FiImage, FiFile, FiTrash2, FiDownload } from 'react-icons/fi';
import Image from 'next/image';

interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media:', error);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Insert into media table
      const { error: dbError } = await supabase
        .from('media')
        .insert({
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          alt_text: file.name
        });

      if (dbError) {
        console.error('Error saving media record:', dbError);
      }
    }

    setUploading(false);
    fetchMedia();
  }

  async function handleDeleteFile(id: string, filePath: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus file ini?')) return;

    // Extract file path from URL
    const pathMatch = filePath.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)/);
    if (pathMatch) {
      const storagePath = pathMatch[1];
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([storagePath]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Error deleting from database:', dbError);
    } else {
      fetchMedia();
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function isImage(mimeType: string) {
    return mimeType.startsWith('image/');
  }

  const filteredFiles = files.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Media</h1>
            <p className="text-muted-foreground">Upload dan kelola file media</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <FiUpload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop file atau klik untuk memilih
              </p>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
              >
                <FiUpload className="mr-2" />
                {uploading ? 'Uploading...' : 'Pilih File'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted relative">
                  {isImage(file.mime_type) ? (
                    <Image
                      src={file.file_path}
                      alt={file.alt_text || file.file_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiFile className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm truncate" title={file.file_name}>
                    {file.file_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(file.file_size)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString('id-ID')}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <FiDownload size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteFile(file.id, file.file_path)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FiImage className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">
              {searchTerm ? 'Tidak ada file yang cocok dengan pencarian.' : 'Belum ada file media.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 