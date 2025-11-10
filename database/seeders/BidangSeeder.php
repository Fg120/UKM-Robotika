<?php

namespace Database\Seeders;

use App\Models\Bidang;
use Illuminate\Database\Seeder;

class BidangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bidangs = [
            [
                'nama' => 'Badan Pengurus Harian',
                'deskripsi' => 'Badan yang bertanggung jawab atas operasional harian organisasi UKM Robotika',
                'urutan' => 1,
            ],
            [
                'nama' => 'Creative Branding',
                'deskripsi' => 'Bidang yang menangani branding, design, dan identitas visual UKM Robotika',
                'urutan' => 2,
            ],
            [
                'nama' => 'Official',
                'deskripsi' => 'Bidang yang menangani administrasi resmi dan dokumentasi organisasi',
                'urutan' => 3,
            ],
            [
                'nama' => 'Internal Affairs',
                'deskripsi' => 'Bidang yang menangani masalah internal organisasi dan hubungan antar anggota',
                'urutan' => 4,
            ],
            [
                'nama' => 'Research and Development',
                'deskripsi' => 'Bidang yang fokus pada riset, inovasi, dan pengembangan teknologi robotika',
                'urutan' => 5,
            ],
            [
                'nama' => 'Training and Regeneration',
                'deskripsi' => 'Bidang yang menangani program pelatihan dan regenerasi anggota baru',
                'urutan' => 6,
            ],
            [
                'nama' => 'Public Relation',
                'deskripsi' => 'Bidang yang menangani hubungan dengan publik, media, dan stakeholder eksternal',
                'urutan' => 7,
            ],
        ];

        foreach ($bidangs as $bidang) {
            Bidang::create($bidang);
        }
    }
}
