<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;

class BookController extends Controller
{
    public function index()
    {
        $perPage = (int) request('per_page', 10);
        $search = request('search');

        $books = Book::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%")
                        ->orWhere('publisher', 'like', "%{$search}%")
                        ->orWhere('isbn', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);

        return BookResource::collection($books);
    }

    public function store(StoreBookRequest $request)
    {
        $book = Book::create($request->validated());

        return new BookResource($book);
    }

    public function show(Book $book)
    {
        return new BookResource($book);
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        $book->update($request->validated());

        return new BookResource($book);
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(['message' => 'Buku berhasil dihapus.']);
    }
}
