<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
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

    $sortBy = $request->input('sort_by', 'created_at');
    $sortOrder = $request->input('sort_order', 'desc');
    
    $allowedSorts = ['name', 'created_at'];
    
    if (in_array($sortBy, $allowedSorts)) {
        $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
    } else {
        $query->latest();
    }

    $limit = $request->input('limit', 10);
    $users = $query->paginate($limit)->withQueryString();
    
    return UserResource::collection($users);
}

    /**
     * POST /api/users
     */
    public function store(UserRequest $request)
{
    $validated = $request->validated();
    $validated['password'] = Hash::make($validated['password']);

    $user = User::create($validated);

    return (new UserResource($user))
        ->additional(['message' => 'Pengguna berhasil ditambahkan'])
        ->response()
        ->setStatusCode(201);
}

    /**
     * GET /api/users/{id}
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * PUT /api/users/{id}
     */
   public function update(UserRequest $request, User $user)
{
    $validated = $request->validated();

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
     * DELETE /api/users/{id}
     */
    public function destroy(Request $request, User $user)
{
    if ($request->user()->id === $user->id) {
        return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.'], 403);
    }

    if ($user->peminjamanSebagaiPeminjam()->exists()) {
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
