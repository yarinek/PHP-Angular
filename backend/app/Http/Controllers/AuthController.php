<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{

    public function register(Request $request) 
    {
        if (User::where('email', $request -> email) -> first()) {
            return response([
                'message' => "error.auth.user.uniqueEmail"
            ], Response::HTTP_CONFLICT);
        }
        
        return User::create([
            'name' => $request ->input('name'),
            'email' => $request ->input('email'),
            'password' => Hash::make($request ->input('password')),
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response([
                'message' => "error.auth.user.invalidCredentials"
            ], Response::HTTP_UNAUTHORIZED);
        };

        /** @var \App\Models\User $user **/
        $user = Auth::user();
        $token = $user->createToken('token') -> plainTextToken;
        $cookie = cookie('jwt', $token, 60 * 24); // 1 day

        return response([
            'message' => 'notifications.auth.user.loginSuccess',
        ])->withCookie($cookie);
    }

    public function user()
    {
        return Auth::user();
    }

    public function logout()
    {
        $cookie = Cookie::forget('jwt');

        return response([
            'message' => 'notifications.auth.user.logoutSuccess'
        ])->withCookie($cookie);
    }
}
