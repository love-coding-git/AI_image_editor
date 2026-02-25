<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; }
        .footer { padding: 16px; text-align: center; color: #94a3b8; font-size: 14px; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 16px 0; }
        .detail { margin: 8px 0; }
        .label { font-weight: 600; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin:0;font-size:24px;">Your Images Are Ready!</h1>
        <p style="margin:8px 0 0;">RealVision AI</p>
    </div>
    <div class="content">
        <p>Great news! Your images have been processed and are ready for download.</p>

        <div class="detail"><span class="label">Service:</span> {{ $order->service->name }}</div>
        <div class="detail"><span class="label">Images processed:</span> {{ $order->images()->where('status', 'completed')->count() }} / {{ $order->image_count }}</div>

        <p style="text-align:center;">
            <a href="{{ url('/download/' . $order->download_token) }}" class="btn">Download Your Images</a>
        </p>

        <p style="font-size:14px;color:#64748b;">This download link will expire on {{ $order->download_expires_at->format('F j, Y') }}.</p>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} RealVision AI. All rights reserved.
    </div>
</body>
</html>
