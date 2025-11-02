<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubDivisi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'divisi_id',
        'nama',
        'deskripsi',
        'image',
    ];

    public function divisi()
    {
        return $this->belongsTo(Divisi::class);
    }
}
