<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\PostsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('preview', [PostsController::class, 'getAll']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('posts', [PostsController::class, 'getAllAuth']);
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('posts', [PostsController::class, 'create']);
    Route::delete('posts/{id}', [PostsController::class, 'delete']);
    Route::put('posts/{id}/like', [PostsController::class, 'addLike']);
    Route::put('posts/{id}/unlike', [PostsController::class, 'removeLike']);
    Route::post('posts/{id}/comment', [PostsController::class, 'addComment']);
    Route::delete('comments/{id}', [CommentsController::class, 'deleteComment']);
});
