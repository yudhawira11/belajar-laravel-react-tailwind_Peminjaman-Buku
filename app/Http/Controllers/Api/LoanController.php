<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLoanRequest;
use App\Http\Resources\LoanResource;
use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $status = $request->query('status', 'active');

        $this->authorize('viewAny', Loan::class);

        $isAdmin = $user->role === 'admin';

        $query = Loan::query()
            ->with($isAdmin ? ['book', 'user'] : ['book'])
            ->latest('borrowed_at');

        if (! $isAdmin) {
            $query->where('user_id', $user->id);
        }

        if ($status === 'returned') {
            $query->whereNotNull('returned_at');
        } elseif ($status === 'overdue') {
            $query->whereNull('returned_at')->where('due_at', '<', now());
        } else {
            $query->whereNull('returned_at')->where('due_at', '>=', now());
        }

        return LoanResource::collection($query->get());
    }

    public function store(StoreLoanRequest $request)
    {
        $user = $request->user();
        $days = $request->validated()['days'] ?? (int) (config('loan.default_days') ?? 7);

        $loan = DB::transaction(function () use ($request, $user, $days) {
            $book = Book::lockForUpdate()->findOrFail($request->validated()['book_id']);

            if ($book->stock <= 0) {
                abort(422, 'Stok buku habis.');
            }

            $alreadyBorrowed = Loan::query()
                ->where('user_id', $user->id)
                ->where('book_id', $book->id)
                ->whereNull('returned_at')
                ->exists();

            if ($alreadyBorrowed) {
                abort(422, 'Kamu masih meminjam buku ini.');
            }

            $book->decrement('stock');

            return Loan::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrowed_at' => now(),
                'due_at' => now()->addDays($days),
            ]);
        });

        return new LoanResource($loan->load('book'));
    }

    public function markReturned(Loan $loan, Request $request)
    {
        $user = $request->user();
        $this->authorize('update', $loan);

        if ($loan->returned_at) {
            return response()->json(['message' => 'Pinjaman sudah dikembalikan.']);
        }

        DB::transaction(function () use ($loan) {
            $loan->update(['returned_at' => now()]);
            $loan->book()->increment('stock');
        });

        $isAdmin = $user->role === 'admin';

        return new LoanResource($loan->load($isAdmin ? ['book', 'user'] : ['book']));
    }
}
