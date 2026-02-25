import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { type Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Clock, Download, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface Props {
    order: Order;
}

const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: 'bg-slate-100 text-slate-700', label: 'Pending' },
    paid: { color: 'bg-blue-100 text-blue-700', label: 'Paid' },
    processing: { color: 'bg-yellow-100 text-yellow-700', label: 'Processing' },
    completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
    failed: { color: 'bg-red-100 text-red-700', label: 'Failed' },
};

export default function OrderSuccess({ order }: Props) {
    const isCompleted = order.status === 'completed';
    const isFailed = order.status === 'failed';
    const isProcessing = order.status === 'paid' || order.status === 'processing';

    useEffect(() => {
        if (!isProcessing) return;

        const interval = setInterval(() => {
            router.reload({ only: ['order'], preserveState: true, preserveScroll: true });
        }, 3000);

        return () => clearInterval(interval);
    }, [isProcessing]);

    const status = statusConfig[order.status] || statusConfig.pending;

    return (
        <AppLayout>
            <Head title={isCompleted ? 'Images Ready' : 'Order Confirmed'} />

            <div className="max-w-2xl mx-auto px-4 py-16">
                <div className="text-center mb-8">
                    {isCompleted ? (
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    ) : isFailed ? (
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    )}

                    <h1 className="text-2xl font-bold text-foreground">
                        {isCompleted
                            ? 'Your Images Are Ready!'
                            : isFailed
                            ? 'Processing Failed'
                            : 'Order Confirmed!'}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {isCompleted
                            ? 'Your transformed images are ready for download.'
                            : isFailed
                            ? 'Something went wrong while processing your images. Please contact support.'
                            : 'Your images are being processed. This page will update automatically.'}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Order Details</CardTitle>
                            <Badge className={status.color}>
                                {status.label}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-mono text-xs">{order.uuid}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service</span>
                            <span className="font-medium">{order.service.name}</span>
                        </div>
                        {order.package && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Package</span>
                                <span className="font-medium">{order.package.name}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Images</span>
                            <span className="font-medium">{order.image_count}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium">{order.email}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(order.total_price)}</span>
                        </div>
                    </CardContent>
                </Card>

                {isProcessing && (
                    <div className="mt-6 flex items-center justify-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                        <p className="text-sm text-blue-700">
                            Processing your images... This page refreshes automatically every few seconds.
                        </p>
                    </div>
                )}

                {isCompleted && order.download_token && (
                    <div className="mt-6 p-6 rounded-lg bg-green-50 border border-green-200 text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-3" />
                        <p className="text-sm text-green-700 mb-4">All images have been processed successfully!</p>
                        <Button size="lg" asChild>
                            <a href={`/download/${order.download_token}`}>
                                <Download className="mr-2 w-4 h-4" />
                                Download Your Images
                            </a>
                        </Button>
                    </div>
                )}

                {isFailed && (
                    <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-700">
                            Image processing encountered an error. Please try placing a new order or contact support.
                        </p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            Back to Home
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
