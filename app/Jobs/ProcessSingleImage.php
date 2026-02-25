<?php

namespace App\Jobs;

use App\Contracts\ImageProcessorInterface;
use App\Models\Image;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessSingleImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        public Image $image,
    ) {}

    public function handle(ImageProcessorInterface $processor): void
    {
        $this->image->update(['status' => 'processing']);

        try {
            $processedPath = $processor->process(
                $this->image->original_path,
                $this->image->order->service->slug,
            );

            $this->image->update([
                'processed_path' => $processedPath,
                'status' => 'completed',
            ]);
        } catch (\Throwable $e) {
            Log::error('Image processing failed', [
                'image_id' => $this->image->id,
                'error' => $e->getMessage(),
            ]);

            $this->image->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }
}
