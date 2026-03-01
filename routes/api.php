<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\MeController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [MeController::class, 'show']);

    Route::post('/loans', [LoanController::class, 'store']);
    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans/{loan}/return', [LoanController::class, 'markReturned']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{book}', [BookController::class, 'update']);
        Route::delete('/books/{book}', [BookController::class, 'destroy']);
    });
});
