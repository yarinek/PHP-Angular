<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class PostsController extends Controller
{
    public function getAll() 
    {
        $posts = Posts::all();
        foreach($posts as $post) {
            $destinationPath = env('APP_URL') . Storage::url('public/images/posts/'. $post->userId .'/'. $post->photo);
            if(Storage::exists($destinationPath)){
                $post -> photo = $destinationPath;
            } else {
                $post -> photo = null;
            }
            $post -> author = User::find($post->userId)->name;
        }
        return $posts;
    }

    public function create(Request $request)
    {
        $user = Auth::user();
        $post = new Posts;
        $post -> title = $request ->input('title');
        $post -> userId = $user -> id;
        $post -> likesNumber = 0;
        // Add photo to storage + database
        if($request->hasFile('photo')) {
            $file = $request->file('photo');
            $extension = $file->getClientOriginalExtension();
            $fileName = time().'.'.$extension;
            $destinationPath = 'public/images/posts/'. $user->id;
            Storage::putFileAs($destinationPath, $file, $fileName);
            $post -> photo = $fileName;
        }
        $post -> save();
        return response([
            'message' => "Posted successfully"
        ], Response::HTTP_CREATED);
    }

    public function delete($id)
    {
        if(Posts::where('id', $id)->exists()){
            $post = Posts::find($id);
            $user = Auth::user();
            $destinationPath = 'public/images/posts/'.$user->id.'/'.$post->photo;
            if (Storage::exists($destinationPath)) {
                Storage::delete($destinationPath);
            }
            $post -> delete();

            return response([
                'message' => "Post deleted successfully"
            ]);
        }

        return response([
            'message'=> "error.posts.recordNotExists"
        ], Response::HTTP_NO_CONTENT);
    }
}
