<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Auth;
use Illuminate\Http\Request;
use File;
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

        $attribute = $request->validate([
            'image' => 'required',
        ]);

        //Image
        if($request->hasFile('image')) {
            // $image = $request->file('image');
            $photo = $request['image']->store(env('BARBER_GALLERIES_PATH') . '/' .  $user->id);
            $photoInDB = Storage::url($photo);
            }


        // if($request->hasFile('image')) {
        //     $image = $request->file('image');
        //     $PhotoNameWithExtension = $image->getClientOriginalName();
        //     $PhotoNameOnly = pathinfo($PhotoNameWithExtension, PATHINFO_FILENAME);
        //     $photoExtension = $image->getClientOriginalExtension();
        //     $publicPhotoName = $PhotoNameOnly . '_' . time() . '.' . $photoExtension;

        //     if(!File::exists(public_path()."/Images/barberGallery")){
        //         File::makeDirectory(public_path()."/Images/barberGallery");
        //     }

        //     $image->move(public_path().'/Images/barberGallery/', $publicPhotoName );

        // }

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
