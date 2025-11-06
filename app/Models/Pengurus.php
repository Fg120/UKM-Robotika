<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengurus extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pengurus';

    protected $fillable = [
        'nama',
        'image',
        'posisi_id',
        'bidang_id',
    ];

    public function posisi()
    {
        return $this->belongsTo(Posisi::class);
    }

    public function bidang()
    {
        return $this->belongsTo(Bidang::class);
    }

    public function sosmeds()
    {
        return $this->hasMany(PengurusSosmed::class);
    }
}
