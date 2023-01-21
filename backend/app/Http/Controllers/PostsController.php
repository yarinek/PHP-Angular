<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Models\Likes;
use App\Models\Posts;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\CommentsController;

class PostsController extends Controller
{
    public function getAll(Request $request) 
    {
        $posts = Posts::orderBy('created_at', 'desc')->paginate($request->size, ['*'], 'page', $request->page);
        foreach($posts as $post) {
            $pathToFile = 'public/images/posts/'. $post->userId .'/'. $post->photo;
            $destinationPath = env('APP_URL') . Storage::url($pathToFile);
            if(Storage::exists($pathToFile)){
                $post -> photo = $destinationPath;
            } else {
                $post -> photo = null;
            }
            $post -> author = User::find($post->userId)->name;
            $post -> likes = $post -> likesNumber;
            $post -> comments = CommentsController::getAllCommentsByPostId($post->id);
        }
        return $posts;
    }

    public function getAllAuth(Request $request)
    {
        $posts = $this->getAll($request);
        $userId = Auth::user() -> id;
        foreach($posts as $post) {
            if($post->userId == $userId) {
                $post -> postOwner = true;
            } else {
                $post -> postOwner = false;
            }

            if(Likes::where('userId', $userId)->where('postId', $post->id)->exists()){
                $post -> isLiked = true;
            } else {
                $post -> isLiked = false;
            }
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
            if($post->userId == $user -> id) {
                $destinationPath = 'public/images/posts/'.$user->id.'/'.$post->photo;
                if (Storage::exists($destinationPath)) {
                    Storage::delete($destinationPath);
                }
                $post -> delete();
    
                return response([
                    'message' => "notifications.posts.deleteSuccess"
                ]);
            }
            return response([
                'message' => "error.posts.deleteNotUsersPost"
            ]);
        }

        return response([
            'message'=> "error.posts.recordNotExists"
        ], Response::HTTP_NO_CONTENT);
    }

    public function addLike($id) {
        if(Posts::where('id', $id)->exists()) {
            $userId = Auth::user() -> id;
            if(!Likes::where('userId', $userId)->where('postId', $id)->exists()) {
                // Increment likes
                $post = Posts::find($id);
                $post -> increment('likesNumber');
                $post -> save();

                // Add like to table
                $like = new Likes();
                $like -> userId = $userId;
                $like -> postId = $id;
                $like -> save();
                return response($post->likesNumber, Response::HTTP_OK);
            }
            return response(['message'=>"error.posts.alreadyLiked"], Response::HTTP_BAD_REQUEST);
        };

        return response([
            'message' => "error.posts.recordNotExists"
        ], Response::HTTP_BAD_REQUEST);
    }

    public function removeLike($id) {
        if(Posts::where('id', $id)->exists()) {
            $userId = Auth::user() -> id;
            if(Likes::where('userId', $userId)->where('postId', $id)->exists()) {
                // Increment likes
                $post = Posts::find($id);
                $post -> decrement('likesNumber');
                $post -> save();

                // Remove like in table
                $like = Likes::where('userId', $userId)->where('postId', $id)->first();
                $like -> delete();
                return response($post->likesNumber, Response::HTTP_OK);
            }
            return response(['message'=>"error.posts.notLiked"], Response::HTTP_BAD_REQUEST);
        };

        return response([
            'message' => "error.posts.recordNotExists"
        ], Response::HTTP_BAD_REQUEST);
    }

    public function addComment(Request $request, $id) {
        if(Posts::where('id', $id)->exists()){
            $userId = Auth::user() -> id;
            $comment = new Comments();
            $comment -> userId = $userId;
            $comment -> postId = $id;
            $comment -> comment = $request -> comment;
            $comment -> save();
            return response([
                'message' => "Commented succesfully",
                'comments' => CommentsController::getAllCommentsByPostId($id)
            ], Response::HTTP_OK);
        }
        return response([
            'message' => "error.posts.recordNotExists"
        ], Response::HTTP_BAD_REQUEST);
    }
}
