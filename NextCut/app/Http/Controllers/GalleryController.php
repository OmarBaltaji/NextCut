<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Auth;
use Illuminate\Http\Request;
use Storage;

class GalleryController extends Controller
{
    public function index() {
        $user = Auth::user();
        $barber = $user->barber->first();
        $galleries = $barber->gallery; // Get the authenticated barber's gallery
        return response()->json($galleries, 200);
    }

    public function store(Request $request) {
        $user = Auth::user();
        $barber = $user->barber->first(); // Only barbers have access to gallery

        if($request->hasFile('image')) {
            $photo = $request['image']->store(env('BARBER_GALLERIES_PATH') . '/' .  $user->id); // To store the image locally
            $photoInDB = Storage::url($photo); // The url which we store in the database to be called later
            }

        $gallery = Gallery::create([
            'image' => $photoInDB,
            'barber_id' => $barber->id,
        ]);

        return response()->json($gallery, 200);
    }

    public function destroy(Gallery $gallery) {
        $gallery->delete();
        return response()->json(['message' => 'deleted!'], 200);
    }
}
