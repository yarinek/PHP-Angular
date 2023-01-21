<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CommentsController extends Controller
{
    public static function getAllCommentsByPostId($id) 
    {
        $comments = Comments::where('postId', $id)->get();
        foreach($comments as $comment) {
            $comment -> author = User::find($comment->userId)->name;
        }
        return $comments;
    }

    public function deleteComment($id)
    {
        $comment = Comments::where('id', $id)->first();
        if($comment){
            $userId = Auth::user() -> id;
            if($comment -> userId == $userId){
                $comment -> delete();
                return response([
                    'message' => "Comment deleted succesfully",
                    'comments' => $this -> getAllCommentsByPostId($comment -> postId)
                ], Response::HTTP_OK);
            }
            return response([
                'message' => "error.posts.comments.commentIsNotCreatedByUser"
            ], Response::HTTP_BAD_REQUEST);
        }
        return response([
            'message' => "error.posts.commentNotExists"
        ], Response::HTTP_BAD_REQUEST);
    }
}
