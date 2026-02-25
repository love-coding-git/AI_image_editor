<?php

namespace App\Services;

use App\Contracts\ImageProcessorInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GeminiImageProcessor implements ImageProcessorInterface
{
    private const PROMPTS = [
        'day-to-night' => 'Transform this real estate photo from daytime to nighttime. Keep the architecture and details intact. Add realistic night lighting, warm interior lights visible through windows, twilight sky. Return only the transformed image.',
        'summer-to-winter' => 'Transform this real estate property photo from summer to winter. Add realistic snow coverage, winter atmosphere, bare trees if applicable. Keep the building structure identical. Return only the transformed image.',
        'atmosphere-enhancement' => 'Enhance this real estate photo atmosphere. Improve lighting, add warm golden hour tones, make the property look more inviting and professional. Keep it realistic. Return only the transformed image.',
    ];

    public function process(string $originalPath, string $serviceSlug): string
    {
        $prompt = self::PROMPTS[$serviceSlug] ?? self::PROMPTS['atmosphere-enhancement'];
        $imageContent = Storage::disk('public')->get($originalPath);
        $mimeType = $this->getMimeType($originalPath);
        $base64Image = base64_encode($imageContent);

        $response = Http::timeout(120)
            ->withHeaders([
                'x-goog-api-key' => config('services.gemini.api_key'),
            ])
            ->post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data' => $base64Image,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'responseModalities' => ['TEXT', 'IMAGE'],
                    ],
                ]
            );

        if ($response->failed()) {
            Log::error('Gemini API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException('Gemini API request failed: ' . $response->status());
        }

        $data = $response->json();

        return $this->extractAndSaveImage($data, $originalPath);
    }

    private function extractAndSaveImage(array $data, string $originalPath): string
    {
        $candidates = $data['candidates'] ?? [];

        foreach ($candidates as $candidate) {
            $parts = $candidate['content']['parts'] ?? [];
            foreach ($parts as $part) {
                if (isset($part['inline_data'])) {
                    $imageData = base64_decode($part['inline_data']['data']);
                    $mime = $part['inline_data']['mime_type'] ?? 'image/png';
                    $ext = $this->mimeToExtension($mime);

                    $processedDir = 'processed/' . dirname($originalPath);
                    $filename = Str::random(20) . '.' . $ext;
                    $processedPath = $processedDir . '/' . $filename;

                    Storage::disk('public')->makeDirectory($processedDir);
                    Storage::disk('public')->put($processedPath, $imageData);

                    return $processedPath;
                }
            }
        }

        throw new \RuntimeException('No image returned from Gemini API');
    }

    private function getMimeType(string $path): string
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return match ($ext) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            default => 'image/jpeg',
        };
    }

    private function mimeToExtension(string $mime): string
    {
        return match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => 'png',
        };
    }
}
