<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::all();

        return Inertia::render('Games/Index', [
            'games' => $games,
        ]);
    }

    public function show(Game $game)
    {
        $game->load(['products' => function($q) {
            $q->where('is_active', true)->orderBy('price');
        }]);

        return Inertia::render('Games/Show', [
            'game' => $game,
            'client_key' => config('midtrans.client_key'),
        ]);
    }
}