<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'tag',
        'excerpt',
        'content',
        'image',
        'read_time',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published'  => 'boolean',
        'published_at'  => 'datetime',
    ];

    // Scope: hanya yang sudah dipublish
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    // Format tanggal untuk frontend (misal: "20 Mei 2026")
    public function getFormattedDateAttribute(): string
    {
        $date = $this->published_at ?? $this->created_at;
        return $date->translatedFormat('j F Y');
    }
}