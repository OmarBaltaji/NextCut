<?php

namespace Database\Seeders;

use App\Models\Barber;
use Illuminate\Database\Seeder;

class BarberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Barber::factory()
        ->times(1)
        ->create(['user_id' => 1]);
    }
}
