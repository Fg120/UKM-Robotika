<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Artikel extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'judul',
        'slug',
        'excerpt',
        'konten',
        'image',
        'kategori_id',
        'user_id',
        'published',
        'published_at',
        'views',
    ];

    protected $casts = [
        'published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Auto generate slug from judul
    public static function boot()
    {
        parent::boot();

        static::creating(function ($artikel) {
            if (empty($artikel->slug)) {
                $artikel->slug = Str::slug($artikel->judul);
            }
        });

        static::updating(function ($artikel) {
            if ($artikel->isDirty('judul') && !$artikel->isDirty('slug')) {
                $artikel->slug = Str::slug($artikel->judul);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'artikel_tag');
    }

    // Scope untuk artikel published
    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    // Increment views
    public function incrementViews()
    {
        $this->increment('views');
    }
}
