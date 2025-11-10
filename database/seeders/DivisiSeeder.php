<?php

namespace Database\Seeders;

use App\Models\Divisi;
use Illuminate\Database\Seeder;

class DivisiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisis = [
            [
                'nama' => 'KRSBI Beroda (Kontes Robot Sepak Bola Indonesia Beroda)',
                'deskripsi' => 'KRSBI Beroda adalah divisi KRI yang berfokus pada pengembangan robot pemain sepak bola yang dapat bergerak menggunakan roda. Dalam kompetisi ini, robot harus mampu bermain sepak bola secara otomatis tanpa dikendalikan manusia, mulai dari mendeteksi bola, menentukan arah gawang, hingga mengatur strategi melawan tim lawan. Robot-robot ini biasanya menggunakan sensor kamera, sensor jarak, dan algoritma kecerdasan buatan untuk melakukan navigasi dan pengambilan keputusan. Tujuan utama dari divisi ini adalah melatih kemampuan peserta dalam bidang vision system, kontrol gerak, serta komunikasi antar-robot, sehingga tim dapat bekerja sama layaknya pemain sepak bola sungguhan.',
            ],
            [
                'nama' => 'KRSRI (Kontes Robot SAR Indonesia)',
                'deskripsi' => 'KRSRI merupakan divisi yang menantang peserta untuk membuat robot penyelamat (Search and Rescue) yang dapat beroperasi di area bencana. Dalam lomba ini, robot harus mampu menemukan dan mengevakuasi korban di area simulasi yang dipenuhi rintangan seperti tangga, lorong sempit, atau permukaan tidak rata. Robot akan memanfaatkan berbagai sensor seperti ultrasonik, kamera, sensor panas, atau RFID untuk mendeteksi "korban". Divisi ini menekankan kemampuan robot dalam navigasi otonom, efisiensi waktu, dan pengambilan keputusan dalam kondisi sulit, yang menggambarkan situasi nyata pada operasi SAR.',
            ],
            [
                'nama' => 'KRBAI (Kontes Robot Bawah Air Indonesia)',
                'deskripsi' => 'Divisi KRBAI menantang peserta untuk merancang robot yang mampu beroperasi di bawah air. Robot ini dapat berupa ROV (Remotely Operated Vehicle) yang dikendalikan dari permukaan, atau AUV (Autonomous Underwater Vehicle) yang bergerak secara mandiri. Dalam kompetisi, robot biasanya harus melakukan tugas seperti menyelam, menghindari rintangan, atau mengambil objek di dasar kolam. Tantangan utama pada KRBAI terletak pada pengendalian daya apung, stabilitas gerak tiga dimensi, serta komunikasi data di lingkungan air yang sulit. Kompetisi ini bertujuan untuk mengembangkan teknologi robotika yang dapat diterapkan pada eksplorasi laut dan penelitian bawah air.',
            ],
            [
                'nama' => 'KRAI (Kontes Robot ABU Indonesia)',
                'deskripsi' => 'KRAI adalah divisi tertua dan paling bergengsi dalam KRI karena pemenangnya akan mewakili Indonesia di ajang ABU Robocon, kompetisi robot tingkat Asia-Pasifik. Setiap tahun, tema lomba KRAI mengikuti aturan dan konsep dari ABU Robocon yang diselenggarakan oleh negara tuan rumah, biasanya terinspirasi dari permainan tradisional atau budaya khas. Robot dalam KRAI bisa bersifat semi-otomatis atau otomatis penuh, tergantung peraturan tahun tersebut. Fokus utama lomba ini adalah inovasi mekanik, presisi gerakan, dan strategi tim. KRAI mendorong mahasiswa untuk menggabungkan kreativitas teknik dengan kecepatan dan ketepatan dalam menyelesaikan misi lomba.',
            ],
            [
                'nama' => 'KRTMI (Kontes Robot Tematik Indonesia)',
                'deskripsi' => 'KRTMI merupakan divisi yang menonjolkan aspek kreativitas dan inovasi dalam bidang robotika. Setiap tahun, tema lomba KRTMI berubah sesuai isu nasional, misalnya robot untuk pertanian, pendidikan, kebencanaan, atau pelestarian budaya. Peserta ditantang untuk menciptakan robot yang bermanfaat bagi masyarakat dan memiliki nilai tambah dari sisi teknologi maupun sosial. Penilaian dalam KRTMI tidak hanya berdasarkan performa teknis robot, tetapi juga pada ide, desain, fungsi, dan dampaknya terhadap kehidupan manusia. Divisi ini menjadi wadah bagi mahasiswa untuk berinovasi bebas dan mengembangkan solusi robotika yang relevan dengan kebutuhan bangsa.',
            ],
        ];

        foreach ($divisis as $divisi) {
            Divisi::create($divisi);
        }
    }
}
