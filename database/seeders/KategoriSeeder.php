<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            [
                'nama' => 'Robotika Dasar',
                'deskripsi' => 'Artikel tentang fondasi dan dasar-dasar robotika untuk pemula',
            ],
            [
                'nama' => 'Mekanika',
                'deskripsi' => 'Artikel tentang sistem mekanik dan mesin dalam robotika',
            ],
            [
                'nama' => 'Elektronika',
                'deskripsi' => 'Artikel tentang komponen elektronik dan circuit robotika',
            ],
            [
                'nama' => 'Pemrograman',
                'deskripsi' => 'Artikel tentang coding dan programming untuk robot',
            ],
            [
                'nama' => 'Tutorial Proyek',
                'deskripsi' => 'Artikel tutorial membuat proyek robotika dari awal hingga akhir',
            ],
            [
                'nama' => 'Kompetisi',
                'deskripsi' => 'Artikel tentang kompetisi robotika dan ajang bergengsi',
            ],
            [
                'nama' => 'Berita',
                'deskripsi' => 'Berita terbaru seputar dunia robotika dan teknologi',
            ],
            [
                'nama' => 'Review & Analisis',
                'deskripsi' => 'Review produk robotika dan analisis mendalam tentang tren teknologi',
            ],
        ];

        foreach ($kategoris as $kategori) {
            Kategori::create($kategori);
        }
    }
}
