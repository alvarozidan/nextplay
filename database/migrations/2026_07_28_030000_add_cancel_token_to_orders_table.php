<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Token acak per-order, dipakai untuk otorisasi endpoint
     * POST /orders/{order}/cancel (guest tidak login, jadi tidak
     * bisa dicek lewat auth()->id()). Tanpa ini, ID order yang
     * mudah ditebak bikin siapa pun bisa cancel order orang lain.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('cancel_token', 40)->nullable()->after('snap_token');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('cancel_token');
        });
    }
};
