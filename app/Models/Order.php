<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    // Prefix nomor invoice yang ditampilkan ke user, mis. "NP-000123".
    // Bukan kolom database — cuma format tampilan dari id order.
    const INVOICE_PREFIX = 'NP-';

    protected $fillable = ['user_id', 'game_user_id', 'status', 
                            'total_price', 'payment_method', 'snap_token',
                            'guest_name', 'guest_email', 'cancel_token',];

    protected $hidden = ['cancel_token'];

    protected $casts = ['total_price' => 'decimal:2'];

    // Otomatis ikut ke JSON/Inertia props tanpa perlu ditulis manual di controller.
    protected $appends = ['invoice_number'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function firstProduct(): ?Product
    {
        return $this->items->first()?->product;
    }

    public function invoiceNumber(): string
    {
        return static::formatInvoiceNumber($this->id);
    }

    public function getInvoiceNumberAttribute(): string
    {
        return $this->invoiceNumber();
    }

    public static function formatInvoiceNumber(int $id): string
    {
        return static::INVOICE_PREFIX . str_pad((string) $id, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Ubah nomor invoice ("NP-000123", boleh dengan/tanpa padding nol,
     * case-insensitive) balik jadi id order. Null kalau formatnya tidak valid.
     */
    public static function parseInvoiceNumber(string $invoiceNumber): ?int
    {
        $prefix = static::INVOICE_PREFIX;

        if (stripos($invoiceNumber, $prefix) !== 0) {
            return null;
        }

        $numericPart = substr($invoiceNumber, strlen($prefix));

        if ($numericPart === '' || !ctype_digit($numericPart)) {
            return null;
        }

        return (int) $numericPart;
    }
}