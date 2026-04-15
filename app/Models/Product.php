<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['game_id', 'name', 'diamond_amount', 'price', 'is_active'];

    protected $casts = ['is_active' => 'boolean', 'price' => 'decimal:2'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
