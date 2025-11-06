<?php

namespace Database\Seeders;

use App\Models\Divisi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DivisiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'id' => 1,
                'nama' => 'Divisi Kontes Robot Sepak Bola Indonesia (KRSBI)',
                'deskripsi' => 'Divisi KRSBI merupakan salah satu fokus kegiatan UKM Robotika UNEJ yang bergerak dalam pengembangan robot cerdas untuk kompetisi robot sepak bola. Divisi ini melatih anggota dalam bidang pemrograman, mekanika, dan strategi pertandingan robotik yang kompetitif.'
            ],
            [
                'id' => 2,
                'nama' => 'Divisi Kontes Robot ABU Indonesia (KRAI)',
                'deskripsi' => 'Divisi KRAI fokus pada pengembangan robot semi-otonom yang dirancang untuk menyelesaikan misi sesuai tema Kontes Robot ABU setiap tahunnya. Mahasiswa dilatih dalam mekanika, elektronika, dan pengendalian robot berbasis mikrokontroler serta strategi lapangan.'
            ],
            [
                'id' => 3,
                'nama' => 'Divisi Kontes Robot Tematik Indonesia (KRTMI)',
                'deskripsi' => 'Divisi KRTMI bertujuan mengembangkan robot tematik yang menyesuaikan dengan isu atau tantangan nasional tertentu. Anggota ditantang untuk berinovasi dalam menciptakan solusi robotik yang relevan dan kreatif.'
            ],
            [
                'id' => 4,
                'nama' => 'Divisi Kontes Robot SAR Indonesia (KRSTI)',
                'deskripsi' => 'Divisi KRSRI mengembangkan robot penyelamat yang mampu menavigasi medan berbahaya secara otomatis untuk menyelamatkan korban. Anggota dilatih dalam pemrograman sensor, logika navigasi, serta sistem otonomi.'
            ],
            [
                'id' => 5,
                'nama' => 'Divisi Kontes Robot Bawah Air Indonesia (KRBAI)',
                'deskripsi' => 'Divisi KRBAI berfokus pada pembuatan robot bawah air (ROV/AUV) yang dapat bergerak dan menjalankan misi di dalam air. Divisi ini memperkuat keahlian anggota dalam sistem kedap air, propulsi, serta kontrol navigasi berbasis sensor bawah air.'
            ],
        ];
        foreach ($data as $i) {
            Divisi::updateOrCreate(['id' => $i['id']], $i);
        }
    }
}
