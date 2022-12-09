<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PostsController extends Controller
{
    public function getAll() 
    {
        return Posts::all();
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
            $file->move('posts/'.$user->id, $fileName);
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
