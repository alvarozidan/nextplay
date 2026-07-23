<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'game_user_id', 'status', 
                            'total_price', 'payment_method', 'snap_token',
                            'guest_name', 'guest_email',];

    protected $casts = ['total_price' => 'decimal:2'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function product()
    {
    return $this->belongsTo(Product::class, 'id'); // sesuaikan foreign key
    }
}
