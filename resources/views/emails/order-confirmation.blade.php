<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; }
        .footer { padding: 16px; text-align: center; color: #94a3b8; font-size: 14px; }
        .detail { margin: 8px 0; }
        .label { font-weight: 600; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin:0;font-size:24px;">Order Confirmed</h1>
        <p style="margin:8px 0 0;">RealVision AI</p>
    </div>
    <div class="content">
        <p>Hi there,</p>
        <p>We have received your order and your images are now being processed. You will receive another email with a download link once everything is ready.</p>

        <div class="detail"><span class="label">Order ID:</span> {{ $order->uuid }}</div>
        <div class="detail"><span class="label">Service:</span> {{ $order->service->name }}</div>
        <div class="detail"><span class="label">Images:</span> {{ $order->image_count }}</div>
        <div class="detail"><span class="label">Total:</span> ${{ number_format($order->total_price / 100, 2) }}</div>

        <p>Processing typically takes a few minutes to a few hours depending on the number of images.</p>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} RealVision AI. All rights reserved.
    </div>
</body>
</html>
