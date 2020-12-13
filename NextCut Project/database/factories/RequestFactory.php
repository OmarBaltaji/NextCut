<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Request;
use Illuminate\Database\Eloquent\Factories\Factory;

class RequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Request::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'completed' => $this->faker->boolean,
            'state' => $this->faker->numberBetween(0,2),
            'customer_id' => Customer::factory(),
        ];
    }
}
