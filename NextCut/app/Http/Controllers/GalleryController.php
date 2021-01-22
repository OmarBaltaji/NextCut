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
        $galleries = $barber->gallery;
        return response()->json($galleries, 200);
    }

    public function store(Request $request) {
        $user = Auth::user();
        $barber = $user->barber->first();

        if($request->hasFile('image')) {
            $photo = $request['image']->store(env('BARBER_GALLERIES_PATH') . '/' .  $user->id);
            $photoInDB = Storage::url($photo);
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
