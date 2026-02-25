<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Day to Night',
                'slug' => 'day-to-night',
                'description' => 'Transform your daytime property photos into stunning twilight or nighttime shots with realistic lighting, warm interior glows, and dramatic skies.',
                'icon' => 'moon',
                'price_per_image' => 500,
            ],
            [
                'name' => 'Summer to Winter',
                'slug' => 'summer-to-winter',
                'description' => 'Convert summer property photos to beautiful winter scenes with realistic snow coverage, seasonal atmosphere, and cozy winter charm.',
                'icon' => 'snowflake',
                'price_per_image' => 500,
            ],
            [
                'name' => 'Atmosphere Enhancement',
                'slug' => 'atmosphere-enhancement',
                'description' => 'Elevate your property photos with professional atmosphere enhancements: golden hour lighting, improved warmth, and inviting ambiance.',
                'icon' => 'sun',
                'price_per_image' => 400,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
