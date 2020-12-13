<?php

namespace Database\Factories;

use App\Models\Barber;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BarberFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Barber::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'salon_name' => $this->faker->word,
            'hour_open' => $this->faker->time($format = 'H:i'),
            'hour_close' => $this->faker->time($format = 'H:i'),
            'day_open' => $this->faker->dayOfWeek,
            'day_close' => $this->faker->dayOfWeek,
            'user_id' => User::factory(),
        ];
    }
}
