<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::latest()->paginate(10)->withQueryString();

        $news->getCollection()->transform(fn($item) => [
            'id'           => $item->id,
            'title'        => $item->title,
            'tag'          => $item->tag,
            'excerpt'      => $item->excerpt,
            'content'      => $item->content,
            'image'        => $item->image,
            'read_time'    => $item->read_time,
            'is_published' => $item->is_published,
            'date'         => $item->formatted_date,
        ]);

        return Inertia::render('Admin/News/Index', [
            'news'  => $news,
            // Daftar nama game yang sudah terdaftar, dipakai sebagai saran/opsi tag
            'games' => Game::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'tag'          => 'required|string|max:100',
            'excerpt'      => 'required|string|max:500',
            'content'      => 'nullable|string',
            'read_time'    => 'required|integer|min:1|max:60',
            'is_published' => 'boolean',
            'image'        => 'nullable|image|max:2048',
        ]);

        $data = $request->only('title', 'tag', 'excerpt', 'content', 'read_time', 'is_published');
        $data['published_at'] = now();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        News::create($data);

        return back()->with('success', 'Berita berhasil ditambahkan');
    }

    public function update(Request $request, News $news)
    {
        $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'tag'          => 'sometimes|required|string|max:100',
            'excerpt'      => 'sometimes|required|string|max:500',
            'content'      => 'nullable|string',
            'read_time'    => 'sometimes|integer|min:1|max:60',
            'is_published' => 'sometimes|boolean',
            'image'        => 'nullable|image|max:2048',
        ]);

        // Hanya field yang benar-benar dikirim yang akan diupdate,
        // supaya konten/gambar lama tidak tertimpa kosong secara tidak sengaja.
        $data = $request->only('title', 'tag', 'excerpt', 'content', 'read_time', 'is_published');

        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        $news->update($data);

        return back()->with('success', 'Berita berhasil diupdate');
    }

    public function destroy(News $news)
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        return back()->with('success', 'Berita berhasil dihapus');
    }
}