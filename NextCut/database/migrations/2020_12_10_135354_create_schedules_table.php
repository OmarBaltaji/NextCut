<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('hour_open');
            $table->string('hour_close');
            $table->string('day_open');
            $table->string('day_close');
            $table->timestamps();
            $table->foreignId('barber_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->unique('barber_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedules');
    }
}
