<?php

namespace App\Providers;

use App\Contracts\ImageProcessorInterface;
use App\Contracts\PaymentServiceInterface;
use App\Services\FakeImageProcessor;
use App\Services\GeminiImageProcessor;
use App\Services\MockPaymentService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ImageProcessorInterface::class, function () {
            if (config('services.gemini.enabled') && config('services.gemini.api_key')) {
                return new GeminiImageProcessor();
            }
            return new FakeImageProcessor();
        });

        $this->app->bind(PaymentServiceInterface::class, function () {
            return new MockPaymentService();
        });
    }

    public function boot(): void
    {
        //
    }
}
