<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $news = [
            [
                'tag'          => 'Mobile Legends',
                'title'        => 'Update Patch Terbaru Mobile Legends: Hero Baru dan Penyesuaian Balance',
                'excerpt'      => 'Moonton merilis patch terbaru yang membawa hero baru bernama Arlott, seorang ksatria naga dengan kemampuan burst damage tinggi. Selain itu, beberapa hero seperti Fanny dan Chou mendapat penyesuaian skill untuk menjaga keseimbangan gameplay.',
                'read_time'    => 3,
                'published_at' => '2026-05-20 08:00:00',
            ],
            [
                'tag'          => 'Free Fire',
                'title'        => 'Free Fire OB44 Hadir dengan Mode Battle Royale Baru dan Karakter Eksklusif',
                'excerpt'      => 'Garena mengumumkan update OB44 yang membawa perombakan besar pada map Bermuda. Mode baru "Lone Wolf" memungkinkan pemain bermain solo dengan mekanisme unik. Karakter baru juga hadir dengan skill aktif yang bisa mengubah jalannya pertandingan.',
                'read_time'    => 4,
                'published_at' => '2026-05-18 08:00:00',
            ],
            [
                'tag'          => 'Genshin Impact',
                'title'        => 'Genshin Impact Version 5.6: Wilayah Baru Natlan Diperluas dengan Quest Epik',
                'excerpt'      => 'HoYoverse kembali menghadirkan konten besar di versi 5.6. Wilayah Natlan mendapat perluasan area dengan dungeon baru dan event musiman yang memberikan primogem gratis hingga 1600. Dua karakter baru dari elemen Pyro juga siap hadir di banner berikutnya.',
                'read_time'    => 5,
                'published_at' => '2026-05-15 08:00:00',
            ],
            [
                'tag'          => 'PUBG Mobile',
                'title'        => 'PUBG Mobile Season Baru Bawa Map Eksklusif dan Sistem Ranked yang Diperbarui',
                'excerpt'      => 'Season terbaru PUBG Mobile hadir dengan map baru bertema gurun arktik. Sistem ranked diperbarui dengan tier baru di atas Conqueror. Berbagai reward menarik tersedia untuk pemain yang berhasil mencapai tier tertinggi sebelum season berakhir.',
                'read_time'    => 3,
                'published_at' => '2026-05-12 08:00:00',
            ],
            [
                'tag'          => 'Honkai: Star Rail',
                'title'        => 'Honkai: Star Rail 3.3 Hadirkan Planet Baru dan Mekanisme Combat Terbaru',
                'excerpt'      => 'Update 3.3 membawa pemain ke planet baru dengan lore yang sangat dalam. Sistem combat mendapat tambahan mechanic baru bernama "Resonance Chain" yang memungkinkan kombinasi ultimate antar karakter. Event poin memberikan light cone 5-bintang gratis.',
                'read_time'    => 4,
                'published_at' => '2026-05-10 08:00:00',
            ],
            [
                'tag'          => 'Valorant',
                'title'        => 'Valorant Mobile Resmi Diumumkan, Closed Beta Segera Dibuka di Asia Tenggara',
                'excerpt'      => 'Riot Games akhirnya mengumumkan secara resmi Valorant Mobile untuk perangkat iOS dan Android. Closed beta pertama akan dibuka di kawasan Asia Tenggara termasuk Indonesia. Pendaftaran sudah bisa dilakukan melalui situs resmi Riot Games.',
                'read_time'    => 3,
                'published_at' => '2026-05-08 08:00:00',
            ],
        ];

        foreach ($news as $item) {
            News::create(array_merge($item, ['is_published' => true]));
        }
    }
}