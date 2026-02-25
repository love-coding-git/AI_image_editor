<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class DownloadService
{
    public function generateZip(Order $order): string
    {
        $zipFilename = "order_{$order->uuid}.zip";
        $zipPath = storage_path("app/public/downloads/{$zipFilename}");

        $dir = dirname($zipPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $zip = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        foreach ($order->images()->where('status', 'completed')->get() as $image) {
            $filePath = Storage::disk('public')->path($image->processed_path);
            if (file_exists($filePath)) {
                $zip->addFile($filePath, basename($image->processed_path));
            }
        }

        $zip->close();

        return $zipPath;
    }
}
