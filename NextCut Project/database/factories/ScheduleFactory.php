<?php

namespace Database\Factories;

use App\Models\Barber;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Schedule::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'hour_open' => $this->faker->time($format = 'H:i'),
            'hour_close' => $this->faker->time($format = 'H:i'),
            'day_open' => $this->faker->dayOfWeek,
            'day_close' => $this->faker->dayOfWeek,
            'barber_id' => Barber::factory(),
        ];
    }
}
