<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $games = [
            ['name' => 'Mobile Legends', 'slug' => 'game moba'],
            ['name' => 'Free Fire', 'slug' => 'game burik'],
            ['name' => 'PUBG Mobile', 'slug' => 'game berat'],
            ['name' => 'Genshin Impact', 'slug' => 'game berat wibu '],
            ['name' => 'Valorant', 'slug' => 'game moba FPS'],
        ];

        foreach ($games as $game){
            Game::create($game);
        }
    }
}
