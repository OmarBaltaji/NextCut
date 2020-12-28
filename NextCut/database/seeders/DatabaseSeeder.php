<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\BarberService;
use App\Models\WorkDay;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            BarberSeeder::class,
            BarberServiceSeeder::class,
            GallerySeeder::class,
            ScheduleSeeder::class,
            ServiceSeeder::class,
            AddressSeeder::class,
            WorkDaySeeder::class,
        ]);
    }
}
