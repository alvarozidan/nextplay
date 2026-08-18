<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::withCount('products')->latest()->get();

        return Inertia::render('Admin/Games/Index', [
            'games' => $games,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|unique:games,slug',
            'developer'      => 'nullable|string|max:255',
            'description'    => 'nullable|string|max:1000',
            'currency_name'  => 'nullable|string|max:50',
            'currency_icon'  => 'nullable|string|max:10',
            'image'          => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'slug', 'developer', 'description', 'currency_name', 'currency_icon');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('games', 'public');
        }

        Game::create($data);

        return back()->with('success', 'Game berhasil ditambahkan');
    }

    public function update(Request $request, Game $game)
    {
        $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'developer'      => 'nullable|string|max:255',
            'description'    => 'nullable|string|max:1000',
            'currency_name'  => 'nullable|string|max:50',
            'currency_icon'  => 'nullable|string|max:10',
            'is_active'      => 'sometimes|boolean',
            'image'          => 'nullable|image|max:2048',
        ]);

        $data = array_filter([
            'name'           => $request->input('name'),
            'developer'      => $request->input('developer'),
            'description'    => $request->input('description'),
            'currency_name'  => $request->input('currency_name'),
            'currency_icon'  => $request->input('currency_icon'),
            'is_active'      => $request->has('is_active') ? $request->boolean('is_active') : null,
        ], fn($v) => !is_null($v));

        if ($request->hasFile('image')) {
            if ($game->image) {
                Storage::disk('public')->delete($game->image);
            }
            $data['image'] = $request->file('image')->store('games', 'public');
        }

        $game->update($data);

        return back()->with('success', 'Game berhasil diupdate');
    }

    public function destroy(Game $game)
    {
        if ($game->image) {
            Storage::disk('public')->delete($game->image);
        }

        $game->delete();

        return back()->with('success', 'Game berhasil dihapus');
    }
}