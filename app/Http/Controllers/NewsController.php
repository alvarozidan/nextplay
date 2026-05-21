<?php

namespace App\Http\Controllers;

use App\Models\News;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::published()
            ->latest('published_at')
            ->get()
            ->map(fn($item) => [
                'id'        => $item->id,
                'title'     => $item->title,
                'tag'       => $item->tag,
                'excerpt'   => $item->excerpt,
                'image'     => $item->image,
                'read_time' => $item->read_time,
                'date'      => $item->formatted_date,
            ]);

        return Inertia::render('News/Index', [
            'news' => $news,
        ]);
    }
}