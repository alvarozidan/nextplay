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
            ->paginate(9)
            ->withQueryString();

        $news->getCollection()->transform(fn($item) => [
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

    public function show(News $news)
    {
        // Berita yang belum dipublish tidak boleh diakses publik,
        // kecuali oleh admin yang ingin mem-preview draft.
        $isAdmin = auth()->check() && auth()->user()->isAdmin();
        abort_unless($news->is_published || $isAdmin, 404);

        $related = News::published()
            ->where('id', '!=', $news->id)
            ->where('tag', $news->tag)
            ->latest('published_at')
            ->take(3)
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

        return Inertia::render('News/Show', [
            'news' => [
                'id'        => $news->id,
                'title'     => $news->title,
                'tag'       => $news->tag,
                'excerpt'   => $news->excerpt,
                'content'   => $news->content,
                'image'     => $news->image,
                'read_time' => $news->read_time,
                'date'      => $news->formatted_date,
            ],
            'related' => $related,
        ]);
    }
}