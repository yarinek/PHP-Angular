<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    use HasFactory;

    protected $fillable = [
        'userId',
        'photo',
        'title',
    ];

    protected $hidden = [
        'likesNumber',
    ];

    public function likes()
    {
        return $this->belongsToMany('App\User', 'likes', 'postId', 'userId');
    }
}
