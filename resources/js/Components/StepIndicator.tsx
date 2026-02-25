import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
    label: string;
}

interface Props {
    steps: Step[];
    currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: Props) {
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center">
                        <div
                            className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                                index < currentStep
                                    ? 'bg-primary text-primary-foreground'
                                    : index === currentStep
                                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                    : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                        </div>
                        <span
                            className={cn(
                                'ml-2 text-sm font-medium hidden sm:inline',
                                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                            )}
                        >
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                'w-12 sm:w-20 h-0.5 mx-2',
                                index < currentStep ? 'bg-primary' : 'bg-muted'
                            )}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
