<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'uuid',
        'email',
        'service_id',
        'package_id',
        'image_count',
        'unit_price',
        'total_price',
        'payment_method',
        'payment_reference',
        'status',
        'download_token',
        'download_expires_at',
    ];

    protected $casts = [
        'image_count' => 'integer',
        'unit_price' => 'integer',
        'total_price' => 'integer',
        'download_expires_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->uuid)) {
                $order->uuid = (string) Str::uuid();
            }
        });
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function generateDownloadToken(): void
    {
        $this->update([
            'download_token' => Str::random(64),
            'download_expires_at' => now()->addDays(7),
        ]);
    }

    public function isDownloadValid(): bool
    {
        return $this->download_token
            && $this->download_expires_at
            && $this->download_expires_at->isFuture();
    }
}
