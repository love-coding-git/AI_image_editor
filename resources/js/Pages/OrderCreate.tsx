import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StepIndicator from '@/Components/StepIndicator';
import ImageUploader from '@/Components/ImageUploader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { type Service, type Package } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';

interface Props {
    service: Service;
    packages: Package[];
}

const steps = [
    { label: 'Package' },
    { label: 'Upload' },
    { label: 'Checkout' },
];

export default function OrderCreate({ service, packages }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const maxImages = selectedPackage?.image_count || 50;

    const discountPercent = selectedPackage?.discount_percent || 0;
    const unitPrice = service.price_per_image;
    const subtotal = unitPrice * files.length;
    const totalPrice = Math.round(subtotal * (1 - discountPercent / 100));

    const canProceedStep0 = selectedPackage !== null;
    const canProceedStep1 = files.length > 0;
    const canProceedStep2 = email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    function handleNext() {
        if (currentStep < 2) setCurrentStep(currentStep + 1);
    }

    function handleBack() {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    }

    function handleSubmit() {
        if (submitting) return;
        setSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append('service_id', String(service.id));
        if (selectedPackage) formData.append('package_id', String(selectedPackage.id));
        formData.append('email', email);
        files.forEach((file) => formData.append('images[]', file));

        router.post('/order', formData, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    }

    return (
        <AppLayout>
            <Head title={`Order - ${service.name}`} />

            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Badge variant="outline" className="mb-2">{service.name}</Badge>
                    <h1 className="text-2xl font-bold text-foreground">Place Your Order</h1>
                    <p className="text-muted-foreground mt-1">
                        {formatCurrency(service.price_per_image)} per image
                    </p>
                </div>

                <StepIndicator steps={steps} currentStep={currentStep} />

                {/* Step 0: Package Selection */}
                {currentStep === 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Choose a Package</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {packages.map((pkg) => {
                                const pkgPrice = Math.round(
                                    unitPrice * pkg.image_count * (1 - pkg.discount_percent / 100)
                                );
                                return (
                                    <Card
                                        key={pkg.id}
                                        className={cn(
                                            'cursor-pointer transition-all hover:shadow-md',
                                            selectedPackage?.id === pkg.id
                                                ? 'ring-2 ring-primary border-primary'
                                                : ''
                                        )}
                                        onClick={() => {
                                            setSelectedPackage(pkg);
                                            setFiles((prev) => prev.slice(0, pkg.image_count));
                                        }}
                                    >
                                        <CardHeader className="pb-2 text-center">
                                            <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                            {pkg.discount_percent > 0 && (
                                                <Badge variant="secondary" className="mx-auto">
                                                    Save {pkg.discount_percent}%
                                                </Badge>
                                            )}
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <div className="text-2xl font-bold">
                                                {formatCurrency(pkgPrice)}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatCurrency(Math.round(unitPrice * (1 - pkg.discount_percent / 100)))}/image
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button onClick={handleNext} disabled={!canProceedStep0}>
                                Continue <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 1: Image Upload */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Upload Your Images</h2>
                            <span className="text-sm text-muted-foreground">
                                {files.length} / {maxImages} images
                            </span>
                        </div>

                        <ImageUploader
                            files={files}
                            onFilesChange={(newFiles) => setFiles(newFiles.slice(0, maxImages))}
                            maxFiles={maxImages}
                        />

                        {errors.images && (
                            <p className="text-sm text-destructive">{errors.images}</p>
                        )}

                        <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="mr-2 w-4 h-4" /> Back
                            </Button>
                            <Button onClick={handleNext} disabled={!canProceedStep1}>
                                Continue <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Checkout */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Review & Checkout</h2>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Service</span>
                                    <span className="font-medium">{service.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Package</span>
                                    <span className="font-medium">{selectedPackage?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Images</span>
                                    <span className="font-medium">{files.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Price per image</span>
                                    <span className="font-medium">{formatCurrency(unitPrice)}</span>
                                </div>
                                {discountPercent > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Package discount</span>
                                        <span>-{discountPercent}%</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                We will send the download link to this email once your images are processed.
                            </p>
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {Object.keys(errors).length > 0 && !errors.email && !errors.images && (
                            <div className="p-3 bg-destructive/10 rounded-md">
                                {errors.general ? (
                                    <p className="text-sm text-destructive">{errors.general}</p>
                                ) : (
                                    <p className="text-sm text-destructive">
                                        {Object.values(errors).join(', ')}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={handleBack} disabled={submitting}>
                                <ArrowLeft className="mr-2 w-4 h-4" /> Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!canProceedStep2 || submitting}
                                size="lg"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 w-4 h-4" />
                                        Place Order - {formatCurrency(totalPrice)}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
