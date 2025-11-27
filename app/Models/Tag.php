<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->nama);
            }
        });

        static::updating(function ($tag) {
            if ($tag->isDirty('nama') && empty($tag->slug)) {
                $tag->slug = Str::slug($tag->nama);
            }
        });
    }

    /**
     * Relasi dengan Artikel (many-to-many)
     */
    public function artikel()
    {
        return $this->belongsToMany(Artikel::class, 'artikel_tag');
    }
}
