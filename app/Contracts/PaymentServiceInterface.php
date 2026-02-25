<?php

namespace App\Contracts;

use App\Models\Order;

interface PaymentServiceInterface
{
    public function charge(Order $order): array;
}
