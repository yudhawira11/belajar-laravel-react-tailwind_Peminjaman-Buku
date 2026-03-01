<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoanResource;
use App\Http\Resources\UserResource;
use App\Models\Loan;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $overdueLoans = Loan::query()
            ->where('user_id', $user->id)
            ->whereNull('returned_at')
            ->where('due_at', '<', now())
            ->with('book')
            ->latest('due_at')
            ->get();

        $data = (new UserResource($user))->resolve();
        $data['overdue_loans'] = LoanResource::collection($overdueLoans)->resolve();
        $data['overdue_loans_count'] = $overdueLoans->count();

        return response()->json(['data' => $data]);
    }
}
