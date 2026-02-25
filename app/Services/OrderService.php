<?php

namespace App\Services;

use App\Contracts\PaymentServiceInterface;
use App\Jobs\ProcessOrderImages;
use App\Mail\OrderConfirmationMail;
use App\Models\Image;
use App\Models\Order;
use App\Models\Package;
use App\Models\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class OrderService
{
    public function __construct(
        private PaymentServiceInterface $paymentService,
    ) {}

    public function createOrder(
        Service $service,
        ?Package $package,
        string $email,
        array $files,
    ): Order {
        $imageCount = count($files);
        $unitPrice = $service->price_per_image;
        $discountPercent = $package?->discount_percent ?? 0;
        $subtotal = $unitPrice * $imageCount;
        $totalPrice = (int) round($subtotal * (1 - $discountPercent / 100));

        $order = Order::create([
            'email' => $email,
            'service_id' => $service->id,
            'package_id' => $package?->id,
            'image_count' => $imageCount,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        foreach ($files as $file) {
            $path = $this->storeUploadedFile($file, $order);
            Image::create([
                'order_id' => $order->id,
                'original_path' => $path,
                'status' => 'pending',
            ]);
        }

        $result = $this->paymentService->charge($order);

        if ($result['success']) {
            Mail::to($order->email)->queue(new OrderConfirmationMail($order));
            ProcessOrderImages::dispatch($order);
        }

        return $order->fresh();
    }

    private function storeUploadedFile(UploadedFile $file, Order $order): string
    {
        $directory = "orders/{$order->uuid}";
        Storage::disk('public')->makeDirectory($directory);

        $filename = $file->hashName();
        $file->storeAs($directory, $filename, 'public');

        return "{$directory}/{$filename}";
    }
}
