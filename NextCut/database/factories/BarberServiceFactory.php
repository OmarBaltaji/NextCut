<?php

namespace Database\Factories;

use App\Models\Barber;
use App\Models\BarberService;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class BarberServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BarberService::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'price' => $this->faker->randomNumber(4),
            'estimated_time' => $this->faker->time($format = 'i'),
            'barber_id' => Barber::factory(),
            'service_id' => Service::factory(),
        ];
    }
}
