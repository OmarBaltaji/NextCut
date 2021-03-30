<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerRequestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_request', function (Blueprint $table) {
            $table->id();
            $table->string('date_booked');
            $table->string('time_booked');
            $table->unsignedSmallInteger('total_price');
            $table->unsignedTinyInteger('total_time');
            $table->string('appointment_location');
            $table->string('customer_address')->nullable();
            $table->boolean('completed')->default(false);
            $table->unsignedTinyInteger('state')->default(0);
            $table->timestamps();
            $table->unique(['date_booked', 'time_booked', 'appointment_location'], 'date_time_booked_app_location');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customer_request');
    }
}
