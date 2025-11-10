<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            // Arduino & Microcontroller Tags
            [
                'nama' => 'Arduino',
                'deskripsi' => 'Tag untuk artikel yang menggunakan platform Arduino',
            ],
            [
                'nama' => 'Microcontroller',
                'deskripsi' => 'Tag untuk artikel tentang microcontroller',
            ],
            [
                'nama' => 'Raspberry Pi',
                'deskripsi' => 'Tag untuk artikel yang menggunakan Raspberry Pi',
            ],

            // Sensor & Actuator Tags
            [
                'nama' => 'Sensor',
                'deskripsi' => 'Tag untuk artikel tentang berbagai jenis sensor',
            ],
            [
                'nama' => 'Motor',
                'deskripsi' => 'Tag untuk artikel tentang motor DC, servo, dan motor stepper',
            ],
            [
                'nama' => 'Servo',
                'deskripsi' => 'Tag untuk artikel tentang servo motor',
            ],

            // Programming Language Tags
            [
                'nama' => 'C++',
                'deskripsi' => 'Tag untuk artikel yang menggunakan bahasa C++',
            ],
            [
                'nama' => 'Python',
                'deskripsi' => 'Tag untuk artikel yang menggunakan bahasa Python',
            ],
            [
                'nama' => 'Assembly',
                'deskripsi' => 'Tag untuk artikel yang menggunakan assembly language',
            ],

            // Robotics Type Tags
            [
                'nama' => 'Robot Beroda',
                'deskripsi' => 'Tag untuk artikel tentang robot dengan sistem roda',
            ],
            [
                'nama' => 'Robot Humanoid',
                'deskripsi' => 'Tag untuk artikel tentang robot humanoid',
            ],
            [
                'nama' => 'Drone',
                'deskripsi' => 'Tag untuk artikel tentang drone dan robotika udara',
            ],
            [
                'nama' => 'Robotic Arm',
                'deskripsi' => 'Tag untuk artikel tentang lengan robot industrial',
            ],

            // Technical Concept Tags
            [
                'nama' => 'IoT',
                'deskripsi' => 'Tag untuk artikel tentang Internet of Things',
            ],
            [
                'nama' => 'AI & Machine Learning',
                'deskripsi' => 'Tag untuk artikel tentang artificial intelligence dan machine learning',
            ],
            [
                'nama' => 'Kontrol Otomatis',
                'deskripsi' => 'Tag untuk artikel tentang sistem kontrol otomatis',
            ],
            [
                'nama' => 'Komunikasi Nirkabel',
                'deskripsi' => 'Tag untuk artikel tentang Bluetooth, WiFi, dan wireless',
            ],

            // General Tags
            [
                'nama' => 'Beginner',
                'deskripsi' => 'Tag untuk artikel yang cocok untuk pemula',
            ],
            [
                'nama' => 'Advanced',
                'deskripsi' => 'Tag untuk artikel tingkat lanjut',
            ],
            [
                'nama' => 'Tips & Trik',
                'deskripsi' => 'Tag untuk artikel berisi tips dan trik berguna',
            ],
            [
                'nama' => 'DIY',
                'deskripsi' => 'Tag untuk artikel do-it-yourself robotika',
            ],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
