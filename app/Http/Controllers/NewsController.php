<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        return Inertia::render('News/Index');
    }
}