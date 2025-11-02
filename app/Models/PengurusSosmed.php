<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengurusSosmed extends Model
{
    use HasFactory;

    protected $fillable = [
        'pengurus_id',
        'platform',
        'icon',
        'url',
    ];

    public function pengurus()
    {
        return $this->belongsTo(Pengurus::class);
    }
}
