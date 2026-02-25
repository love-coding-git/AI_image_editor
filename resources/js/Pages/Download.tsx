import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { type Order } from '@/types';
import { Download as DownloadIcon, ArrowRight } from 'lucide-react';

interface Props {
    order: Order;
    downloadUrl: string;
}

export default function Download({ order, downloadUrl }: Props) {
    return (
        <AppLayout>
            <Head title="Download Your Images" />

            <div className="max-w-2xl mx-auto px-4 py-16">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <DownloadIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Your Images Are Ready</h1>
                    <p className="text-muted-foreground mt-2">
                        {order.service.name} - {order.image_count} images processed
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6 text-center">
                        <Button size="lg" asChild>
                            <a href={downloadUrl}>
                                <DownloadIcon className="mr-2 w-4 h-4" />
                                Download ZIP
                            </a>
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4">
                            Your download link is valid until{' '}
                            {order.download_expires_at
                                ? new Date(order.download_expires_at).toLocaleDateString()
                                : 'N/A'}
                        </p>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            Order More <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
