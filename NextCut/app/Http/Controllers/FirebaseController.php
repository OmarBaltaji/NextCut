<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class FirebaseController extends Controller
{
    public function index() {
        $factory = (new Factory)->withServiceAccount(__DIR__.'/FirebaseKey.json');

        $database = $factory->createDatabase();
        return $database;
        $ref = $database->getReference('Something');

        $key = $ref->push()->getKey();
        return $key;
        $ref->getChild($key)->set([
            'Some' => 15,
        ]);


    }
}
