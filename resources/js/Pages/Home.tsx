import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { type Service } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Moon, Snowflake, Sun, Upload, CreditCard, Download, ArrowRight, Sparkles, ImageIcon, Play } from 'lucide-react';

interface Props {
    services: Service[];
}

const serviceIcons: Record<string, React.ReactNode> = {
    moon: <Moon className="w-8 h-8" />,
    snowflake: <Snowflake className="w-8 h-8" />,
    sun: <Sun className="w-8 h-8" />,
};

const serviceGradients: Record<string, string> = {
    moon: 'from-indigo-500 to-purple-600',
    snowflake: 'from-cyan-400 to-blue-600',
    sun: 'from-amber-400 to-orange-500',
};

export default function Home({ services }: Props) {
    return (
        <AppLayout>
            <Head title="Professional Real Estate Image Transformations" />

            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-[600px] flex items-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm text-white mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>AI-Powered Image Transformations</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                            Transform Your Property Photos{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Instantly
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-xl leading-relaxed">
                            Upload your real estate photos and let our AI transform them.
                            Day to night, summer to winter, or enhanced atmosphere - delivered in minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-base px-8 h-12" asChild>
                                <a href="#services">
                                    Get Started
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </a>
                            </Button>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 backdrop-blur-sm text-white text-base font-medium px-8 h-12 hover:bg-white/20 transition-colors"
                            >
                                <Play className="mr-2 w-4 h-4" />
                                How It Works
                            </a>
                        </div>

                        <div className="mt-12 flex items-center gap-8 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-blue-400" />
                                <span>High-quality results</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span>AI-powered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Download className="w-4 h-4 text-blue-400" />
                                <span>Fast delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Choose the transformation that best fits your listing needs
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                <div className={`h-2 bg-gradient-to-r ${serviceGradients[service.icon] || 'from-blue-500 to-indigo-600'}`} />
                                <CardHeader className="text-center pb-2">
                                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${serviceGradients[service.icon] || 'from-blue-500 to-indigo-600'} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        {serviceIcons[service.icon] || <Sun className="w-8 h-8" />}
                                    </div>
                                    <CardTitle className="text-xl">{service.name}</CardTitle>
                                    <CardDescription className="mt-2">{service.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="text-3xl font-bold text-foreground">
                                        {formatCurrency(service.price_per_image)}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">per image</p>
                                </CardContent>
                                <CardFooter className="justify-center pb-6">
                                    <Button className="w-full" asChild>
                                        <Link href={`/order/${service.slug}`}>
                                            Select Service <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Three simple steps to transform your property photos
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: 1, icon: <Upload className="w-6 h-6" />, title: 'Upload', desc: 'Select a service, choose your package, and upload your property photos.' },
                            { step: 2, icon: <CreditCard className="w-6 h-6" />, title: 'Checkout', desc: 'Review your order and complete the checkout process securely.' },
                            { step: 3, icon: <Download className="w-6 h-6" />, title: 'Download', desc: 'Receive an email with a download link once your images are processed.' },
                        ].map(({ step, icon, title, desc }) => (
                            <div key={step} className="text-center">
                                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                                    {icon}
                                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                                        {step}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                                <p className="text-muted-foreground">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-3xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Listings?</h2>
                    <p className="text-lg text-blue-100 mb-8">
                        Start with a single image and see the difference AI can make for your property photos.
                    </p>
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-base px-8" asChild>
                        <a href="#services">Get Started Now</a>
                    </Button>
                </div>
            </section>
        </AppLayout>
    );
}
