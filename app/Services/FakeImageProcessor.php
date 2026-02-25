<?php

namespace App\Services;

use App\Contracts\ImageProcessorInterface;
use Illuminate\Support\Facades\Storage;

class FakeImageProcessor implements ImageProcessorInterface
{
    public function process(string $originalPath, string $serviceSlug): string
    {
        sleep(2);

        $processedDir = 'processed/' . dirname($originalPath);
        $filename = 'processed_' . basename($originalPath);
        $processedPath = $processedDir . '/' . $filename;

        Storage::disk('public')->makeDirectory($processedDir);
        Storage::disk('public')->copy($originalPath, $processedPath);

        return $processedPath;
    }
}
