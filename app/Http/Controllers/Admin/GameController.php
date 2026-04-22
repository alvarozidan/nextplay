<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Inertia\Inertia;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::withCount('product')->latest()->get();

        return Inertia::render('Admin/Games/Index', [
            'games' => $games,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:game,slug',
        ]);

        Game::creat($request->only(['name', 'slug']));

        return back()->with('success', 'Game berhasil ditambahkan');
    }

    public function update(Request $request, Game $game)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_Active' => 'boolean',
        ]);

        $game->update($request->only('name', 'is_active'));

        return back()->with('success', 'Game berhasil diupdate');
    }

    public function destroy(Game $game)
    {
        $game->delete();

        return back()->with('success', 'Game berhasil dihapus');
    }
}
