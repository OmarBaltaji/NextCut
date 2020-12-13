<?php

namespace Database\Seeders;

use App\Models\BarberService;
use Illuminate\Database\Seeder;

class BarberServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        BarberService::factory()
        ->times(3)
        ->create(['barber_id' => 1]);
    }
}
