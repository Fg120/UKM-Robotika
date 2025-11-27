<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Divisi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nama',
        'deskripsi',
        'image',
    ];

    // Note: Divisi tidak memiliki relasi langsung dengan Pengurus
    // Divisi adalah entitas terpisah untuk menampilkan informasi divisi organisasi
}
