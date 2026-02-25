<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Package;
use App\Models\Service;
use App\Services\DownloadService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
        private DownloadService $downloadService,
    ) {}

    public function create(Service $service): Response
    {
        $packages = Package::where('is_active', true)->get();

        return Inertia::render('OrderCreate', [
            'service' => $service,
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'package_id' => 'nullable|exists:packages,id',
            'email' => 'required|email|max:255',
            'images' => 'required|array|min:1|max:50',
            'images.*' => 'required|image|max:20480',
        ]);

        try {
            $service = Service::findOrFail($validated['service_id']);
            $package = isset($validated['package_id'])
                ? Package::find($validated['package_id'])
                : null;

            $order = $this->orderService->createOrder(
                service: $service,
                package: $package,
                email: $validated['email'],
                files: $request->file('images'),
            );

            return redirect()->route('order.success', $order->uuid);
        } catch (\Throwable $e) {
            \Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['general' => $e->getMessage()]);
        }
    }

    public function success(string $uuid): Response
    {
        $order = Order::where('uuid', $uuid)
            ->with(['service', 'package', 'images'])
            ->firstOrFail();

        return Inertia::render('OrderSuccess', [
            'order' => $order,
        ]);
    }

    public function download(string $token): BinaryFileResponse
    {
        $order = Order::where('download_token', $token)
            ->with('images')
            ->firstOrFail();

        if (!$order->isDownloadValid()) {
            abort(410, 'This download link has expired.');
        }

        $zipPath = $this->downloadService->generateZip($order);

        return response()->download($zipPath, "realvision-{$order->uuid}.zip");
    }
}
