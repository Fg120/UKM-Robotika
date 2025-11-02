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
        'posisi',
        'divisi_id',
        'sub_divisi_id',
    ];

    public function divisi()
    {
        return $this->belongsTo(Divisi::class);
    }

    public function subDivisi()
    {
        return $this->belongsTo(SubDivisi::class, 'sub_divisi_id');
    }

    public function sosmeds()
    {
        return $this->hasMany(PengurusSosmed::class);
    }
}
