<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /api/users
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('email', 'like', $searchTerm);
            });
        }

        if ($request->has('filter.role')) {
            $query->where('role', $request->input('filter.role'));
        }

        if ($request->has('sort')) {
            $sortField = $request->input('sort');
            $sortOrder = $request->input('order', 'asc');
            
            $allowedSorts = ['name', 'created_at'];
            
            if (in_array($sortField, $allowedSorts)) {
                $query->orderBy($sortField, $sortOrder);
            }
        } else {
            $query->latest();
        }

        $users = $query->paginate(10)->withQueryString();
        
        return UserResource::collection($users);
    }

    /**
     * Store a newly created resource in storage.
     * POST /api/users
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'petugas', 'peminjam'])],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return (new UserResource($user))
            ->additional(['message' => 'Pengguna berhasil ditambahkan'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     * GET /api/users/{id}
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     * PUT /api/users/{id}
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'role' => ['sometimes', 'required', Rule::in(['admin', 'petugas', 'peminjam'])],
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return (new UserResource($user))
            ->additional(['message' => 'Pengguna berhasil diperbarui']);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/users/{id}
     */
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.'], 403);
        }

        if ($user->peminjaman()->exists()) {
            return response()->json([
                'message' => 'Pengguna tidak dapat dihapus karena memiliki riwayat peminjaman.'
            ], 409);
        }

        $user->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus'
        ]);
    }
}
