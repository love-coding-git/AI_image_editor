<?php

namespace App\Jobs;

use App\Mail\OrderCompletedMail;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ProcessOrderImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public function __construct(
        public Order $order,
    ) {}

    public function handle(): void
    {
        $this->order->update(['status' => 'processing']);

        foreach ($this->order->images as $image) {
            ProcessSingleImage::dispatchSync($image);
        }

        $this->order->refresh();

        $completedCount = $this->order->images()->where('status', 'completed')->count();
        $totalCount = $this->order->images()->count();

        if ($completedCount === $totalCount) {
            $this->order->update(['status' => 'completed']);
            $this->order->generateDownloadToken();
            Mail::to($this->order->email)->send(new OrderCompletedMail($this->order));
        } elseif ($completedCount > 0) {
            $this->order->update(['status' => 'completed']);
            $this->order->generateDownloadToken();
            Mail::to($this->order->email)->send(new OrderCompletedMail($this->order));
            Log::warning("Order {$this->order->uuid}: {$completedCount}/{$totalCount} images processed successfully");
        } else {
            $this->order->update(['status' => 'failed']);
            Log::error("Order {$this->order->uuid}: all images failed processing");
        }
    }
}
