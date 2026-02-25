<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => '1 Image',
                'image_count' => 1,
                'discount_percent' => 0,
            ],
            [
                'name' => '5 Images',
                'image_count' => 5,
                'discount_percent' => 10,
            ],
            [
                'name' => '10 Images',
                'image_count' => 10,
                'discount_percent' => 15,
            ],
            [
                'name' => '20 Images',
                'image_count' => 20,
                'discount_percent' => 25,
            ],
        ];

        foreach ($packages as $package) {
            Package::updateOrCreate(['name' => $package['name']], $package);
        }
    }
}
