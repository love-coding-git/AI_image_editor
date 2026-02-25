<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('email');
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('package_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('image_count');
            $table->unsignedInteger('unit_price');
            $table->unsignedInteger('total_price');
            $table->string('payment_method')->default('mock');
            $table->string('payment_reference')->nullable();
            $table->string('status')->default('pending');
            $table->string('download_token')->nullable()->unique();
            $table->timestamp('download_expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
