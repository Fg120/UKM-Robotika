<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengurus_sosmeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengurus_id')->constrained('pengurus')->cascadeOnDelete();
            $table->string('platform');
            $table->string('icon');
            $table->string('url');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengurus_sosmeds');
    }
};