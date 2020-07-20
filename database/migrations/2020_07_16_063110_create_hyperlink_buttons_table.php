<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHyperlinkButtonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hyperlink_buttons', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('buttonID');
            $table->string('websiteTitle');
            $table->string('websiteLink');
            $table->string('buttonColor');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hyperlink_buttons');
    }
}
