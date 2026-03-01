<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'borrowed_at' => $this->borrowed_at?->toISOString(),
            'due_at' => $this->due_at?->toISOString(),
            'returned_at' => $this->returned_at?->toISOString(),
            'borrowed_at_human' => $this->borrowed_at?->format('d M Y'),
            'due_at_human' => $this->due_at?->format('d M Y'),
            'returned_at_human' => $this->returned_at?->format('d M Y'),
            'book' => new BookResource($this->whenLoaded('book')),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
