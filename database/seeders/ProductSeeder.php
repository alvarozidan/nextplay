<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $catalog = [
            'mobile-legends' => [
                ['name' => '86 Diamonds', 'diamond_amount' => 86, 'price' => 19000],
                ['name' => '172 Diamonds', 'diamond_amount' => 172, 'price' => 38000],
                ['name' => '257 Diamonds', 'diamond_amount' => 257, 'price' => 56000],
                ['name' => '344 Diamonds', 'diamond_amount' => 344, 'price' => 75000],
                ['name' => '514 Diamonds', 'diamond_amount' => 514, 'price' => 112000],
                ['name' => '706 Diamonds', 'diamond_amount' => 706, 'price' => 150000],
                ['name' => '1412 Diamonds', 'diamond_amount' => 1412, 'price' => 299000],
                ['name' => 'Weekly Diamond Pass', 'diamond_amount' => 0, 'price' => 29000],
            ],
            'free-fire' => [
                ['name' => '50 Diamonds', 'diamond_amount' => 50, 'price' => 8000],
                ['name' => '70 Diamonds', 'diamond_amount' => 70, 'price' => 11000],
                ['name' => '140 Diamonds', 'diamond_amount' => 140, 'price' => 21000],
                ['name' => '210 Diamonds', 'diamond_amount' => 210, 'price' => 31000],
                ['name' => '355 Diamonds', 'diamond_amount' => 355, 'price' => 51000],
                ['name' => '720 Diamonds', 'diamond_amount' => 720, 'price' => 101000],
                ['name' => '1450 Diamonds', 'diamond_amount' => 1450, 'price' => 201000],
                ['name' => 'Member Mingguan', 'diamond_amount' => 0, 'price' => 27000],
            ],
            'pubg-mobile' => [
                ['name' => '60 UC', 'diamond_amount' => 60, 'price' => 15000],
                ['name' => '325 UC', 'diamond_amount' => 325, 'price' => 75000],
                ['name' => '660 UC', 'diamond_amount' => 660, 'price' => 149000],
                ['name' => '1800 UC', 'diamond_amount' => 1800, 'price' => 379000],
                ['name' => '3850 UC', 'diamond_amount' => 3850, 'price' => 749000],
                ['name' => '8100 UC', 'diamond_amount' => 8100, 'price' => 1499000],
            ],
            'genshin-impact' => [
                ['name' => '60 Genesis Crystal', 'diamond_amount' => 60, 'price' => 16000],
                ['name' => '300 Genesis Crystal', 'diamond_amount' => 300, 'price' => 79000],
                ['name' => '980 Genesis Crystal', 'diamond_amount' => 980, 'price' => 249000],
                ['name' => '1980 Genesis Crystal', 'diamond_amount' => 1980, 'price' => 479000],
                ['name' => '3280 Genesis Crystal', 'diamond_amount' => 3280, 'price' => 749000],
                ['name' => '6480 Genesis Crystal', 'diamond_amount' => 6480, 'price' => 1449000],
                ['name' => 'Welkin Moon (30 hari)', 'diamond_amount' => 0, 'price' => 79000],
            ],
            'valorant' => [
                ['name' => '125 VP', 'diamond_amount' => 125, 'price' => 15000],
                ['name' => '420 VP', 'diamond_amount' => 420, 'price' => 49000],
                ['name' => '700 VP', 'diamond_amount' => 700, 'price' => 79000],
                ['name' => '1375 VP', 'diamond_amount' => 1375, 'price' => 149000],
                ['name' => '2400 VP', 'diamond_amount' => 2400, 'price' => 249000],
                ['name' => '4000 VP', 'diamond_amount' => 4000, 'price' => 399000],
            ],
        ];

        foreach ($catalog as $slug => $products) {
            $game = Game::where('slug', $slug)->first();

            if (! $game) {
                continue;
            }

            foreach ($products as $p) {
                $game->products()->updateOrCreate(
                    ['name' => $p['name']],
                    $p
                );
            }
        }
    }
}
