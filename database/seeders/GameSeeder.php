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
            [
                'name' => 'Mobile Legends',
                'slug' => 'mobile-legends',
                'developer' => 'Moonton',
                'description' => 'Top up Diamond Mobile Legends: Bang Bang, proses otomatis dan instan.',
                'currency_name' => 'Diamond',
                'currency_icon' => '💎',
            ],
            [
                'name' => 'Free Fire',
                'slug' => 'free-fire',
                'developer' => 'Garena',
                'description' => 'Top up Diamond Free Fire, promo bundle setiap hari.',
                'currency_name' => 'Diamond',
                'currency_icon' => '💎',
            ],
            [
                'name' => 'PUBG Mobile',
                'slug' => 'pubg-mobile',
                'developer' => 'Krafton',
                'description' => 'Top up UC (Unknown Cash) PUBG Mobile, aman dan cepat.',
                'currency_name' => 'UC',
                'currency_icon' => '🪙',
            ],
            [
                'name' => 'Genshin Impact',
                'slug' => 'genshin-impact',
                'developer' => 'HoYoverse',
                'description' => 'Top up Genesis Crystal Genshin Impact, harga terbaik.',
                'currency_name' => 'Genesis Crystal',
                'currency_icon' => '🔮',
            ],
            [
                'name' => 'Valorant',
                'slug' => 'valorant',
                'developer' => 'Riot Games',
                'description' => 'Top up VP (Valorant Points), proses otomatis 24 jam.',
                'currency_name' => 'VP',
                'currency_icon' => '🔶',
            ],
        ];

        foreach ($games as $game) {
            Game::updateOrCreate(['slug' => $game['slug']], $game);
        }
    }
}
