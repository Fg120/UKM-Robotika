<?php

namespace Database\Seeders;

use App\Models\Sponsor;
use Illuminate\Database\Seeder;

class SponsorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sponsors = [
            [
                'judul' => 'PT. Teknologi Indonesia',
                'deskripsi' => 'Perusahaan teknologi terkemuka yang mendukung inovasi di bidang robotika dan otomasi industri.',
                'url' => 'https://www.teknologiindonesia.com',
                'foto' => null,
            ],
            [
                'judul' => 'CV. Electronic Solutions',
                'deskripsi' => 'Supplier resmi komponen elektronik dan suku cadang berkualitas tinggi untuk robotika.',
                'url' => 'https://www.electronicsolutions.id',
                'foto' => null,
            ],
            [
                'judul' => 'Universitas Indonesia Engineering',
                'deskripsi' => 'Mendukung pengembangan talenta muda di bidang teknik dan robotika Indonesia.',
                'url' => 'https://www.ui.ac.id',
                'foto' => null,
            ],
            [
                'judul' => 'Digital Innovation Hub',
                'deskripsi' => 'Pusat inovasi digital yang bermitra dengan UKM dalam pengembangan proyek robotika canggih.',
                'url' => 'https://www.digitalinnovationhub.id',
                'foto' => null,
            ],
            [
                'judul' => 'Software Development Pro',
                'deskripsi' => 'Penyedia solusi software dan sistem kontrol untuk aplikasi robotika terintegrasi.',
                'url' => 'https://www.softwaredevpro.id',
                'foto' => null,
            ],
        ];

        foreach ($sponsors as $sponsor) {
            Sponsor::create($sponsor);
        }
    }
}
