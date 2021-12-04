<?php

namespace App\GraphQL\Mutations;

use GraphQL\Error\Error;
use Illuminate\Support\Facades\Auth;

class Login
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $guard = Auth::guard(config('sanctum.guard', 'web'));

        if (!$guard->attempt($args)) {
            throw new Error('Invalid credentials!');
        }

        $user = $guard->user();

        return $user;
    }
}
