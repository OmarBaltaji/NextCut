<?php

namespace Database\Factories;

use App\Models\Barber;
use App\Models\BarberWorkDay;
use App\Models\WorkDay;
use Illuminate\Database\Eloquent\Factories\Factory;

class BarberWorkDayFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BarberWorkDay::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'barber_id' => Barber::factory(),
            'work_day_id' => WorkDay::factory(),
        ];
    }
}
