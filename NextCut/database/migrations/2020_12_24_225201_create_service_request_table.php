<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceRequestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_request', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('barber_service_id')->constrained('barber_service')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('customer_request_id')->constrained('customer_request')->onDelete('cascade')->onUpdate('cascade');
            $table->unique(['customer_request_id', 'barber_service_id', 'customer_id'], 'customer_service_request_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_request');
    }
}
