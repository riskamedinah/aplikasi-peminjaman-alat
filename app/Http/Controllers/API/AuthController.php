<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;

        LogAktivitas::create([
            'user_id' => $user->id,
            'peminjaman_id' => null,
            'aksi' => 'login',
            'keterangan' => 'User ' . $user->name . ' login ke sistem',
        ]);

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => $user,
            'token'   => $token,
            'role'    => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        LogAktivitas::create([
            'user_id' => $user->id,
            'peminjaman_id' => null,
            'aksi' => 'logout',
            'keterangan' => 'User ' . $user->name . ' logout dari sistem',
        ]);

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}