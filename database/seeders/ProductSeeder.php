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
        $mlbb = Game::where('slug', 'game moba')->first();

        $products = [
            ['name' => '86 diamonds', 'diamond_amount' => 86, 'price' => 19000],
            ['name' => '172 diamonds', 'diamond_amount' => 172, 'price' => 38000],
            ['name' => '257 diamonds', 'diamond_amount' => 257, 'price' => 56000],
            ['name' => '514 diamonds', 'diamond_amount' => 514, 'price' => 112000],
        ];

        foreach($products as $p){
            $mlbb->products()->create($p);
        }
    }
}
