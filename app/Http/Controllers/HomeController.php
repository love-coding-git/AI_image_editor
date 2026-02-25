<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $services = Service::where('is_active', true)->get();

        return Inertia::render('Home', [
            'services' => $services,
        ]);
    }
}
