<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('game')->latest()->get();
        $games = Game::where('is_active', true)->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'games' => $games,
        ]);
    }

    public function store(Request $request)
    {
         

        $request->validate([
            'game_id' => 'required|integer',
            'name' => 'required|string',
            'diamond_amount' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        Product::create($request->only('game_id', 'name', 'diamond_amount', 'price'));
        return back()->with('success', 'Produk berhasil ditambahkan');
    }   
    
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string',
            'diamond_amount' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $product->update($request->only('name', 'diamond_amount', 'price', 'is_active'));

        return back()->with('success', 'Produk berhasil diupdate');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus');
    }


}
