<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->trim()->toString();

        $games = Game::where('is_active', true)
            ->when($search !== '', fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->get();

        return Inertia::render('Games/Index', [
            'games'  => $games,
            'search' => $search,
        ]);
    }

    public function show(Game $game)
    {
        abort_if(!$game->is_active, 404);

        $game->load(['products' => function($q) {
            $q->where('is_active', true)->orderBy('price');
        }]);

        return Inertia::render('Games/Show', [
            'game' => $game,
            'client_key' => config('midtrans.client_key'),
        ]);
    }
}