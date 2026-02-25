<?php

namespace App\Services;

use App\Contracts\PaymentServiceInterface;
use App\Models\Order;
use Illuminate\Support\Str;

class MockPaymentService implements PaymentServiceInterface
{
    public function charge(Order $order): array
    {
        $order->update([
            'payment_method' => 'mock',
            'payment_reference' => 'mock_' . Str::random(24),
            'status' => 'paid',
        ]);

        return [
            'success' => true,
            'reference' => $order->payment_reference,
        ];
    }
}
