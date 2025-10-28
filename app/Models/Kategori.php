<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Kategori extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Kolom yang dapat diisi massal.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($kategori) {
            if (empty($kategori->slug)) {
                $kategori->slug = Str::slug($kategori->nama);
            }
        });

        static::updating(function ($kategori) {
            if ($kategori->isDirty('nama') && empty($kategori->slug)) {
                $kategori->slug = Str::slug($kategori->nama);
            }
        });
    }

    /**
     * Relasi dengan Artikel
     */
    // public function artikels()
    // {
    //     return $this->hasMany(Artikel::class);
    // }

    /**
     * Accessor untuk mendapatkan jumlah artikel
     */
    // public function getArtikelsCountAttribute()
    // {
    //     return $this->artikels()->count();
    // }
}
