<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/order/{service}', [OrderController::class, 'create'])->name('order.create');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');
Route::get('/order/{uuid}/success', [OrderController::class, 'success'])->name('order.success');
Route::get('/download/{token}', [OrderController::class, 'download'])->name('order.download');
