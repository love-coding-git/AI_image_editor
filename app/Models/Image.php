<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model
{
    protected $fillable = [
        'order_id',
        'original_path',
        'processed_path',
        'status',
        'error_message',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
