import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface Props {
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
}

export default function ImageUploader({ files, onFilesChange, maxFiles = 50 }: Props) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
            onFilesChange(newFiles);
        },
        [files, onFilesChange, maxFiles]
    );

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        onFilesChange(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: maxFiles - files.length,
        maxSize: 20 * 1024 * 1024,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                )}
            >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                {isDragActive ? (
                    <p className="text-primary font-medium">Drop your images here...</p>
                ) : (
                    <>
                        <p className="font-medium text-foreground">
                            Drag & drop images here, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            JPG, PNG, WebP up to 20MB each. Max {maxFiles} images.
                        </p>
                    </>
                )}
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        {files.length} image{files.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {files.map((file, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                    <p className="text-xs text-white truncate">{file.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
