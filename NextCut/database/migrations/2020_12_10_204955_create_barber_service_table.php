<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBarberServiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('barber_service', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedSmallInteger('price');
            $table->unsignedTinyInteger('estimated_time');
            $table->foreignId('barber_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->unique(['barber_id', 'service_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('barber_service');
    }
}
