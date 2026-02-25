export interface Service {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    price_per_image: number;
    is_active: boolean;
}

export interface Package {
    id: number;
    name: string;
    image_count: number;
    discount_percent: number;
    is_active: boolean;
}

export interface Order {
    id: number;
    uuid: string;
    email: string;
    service: Service;
    package: Package | null;
    image_count: number;
    unit_price: number;
    total_price: number;
    status: 'pending' | 'paid' | 'processing' | 'completed' | 'failed';
    download_token: string | null;
    download_expires_at: string | null;
    images: OrderImage[];
    created_at: string;
}

export interface OrderImage {
    id: number;
    order_id: number;
    original_path: string;
    processed_path: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message: string | null;
}

export interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}
