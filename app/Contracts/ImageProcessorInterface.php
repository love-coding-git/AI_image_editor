<?php

namespace App\Contracts;

interface ImageProcessorInterface
{
    public function process(string $originalPath, string $serviceSlug): string;
}
