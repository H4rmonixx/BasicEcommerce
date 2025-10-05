<?php

namespace App\Core;

class Request
{
    private array $get;
    private array $post;
    private array $server;
    private array $routeParams = [];

    public function __construct()
    {
        $this->get = $_GET;
        $this->post = $_POST;
        $this->server = $_SERVER;
        
        if($this->uri() !== '/' && str_ends_with($this->uri(), '/')){
            $cleanUri = rtrim($this->uri(), '/');
            header("Location: $cleanUri", true, 301);
            exit;
        }
    }

    public function method(): string
    {
        return strtoupper($this->server['REQUEST_METHOD'] ?? 'GET');
    }

    public function uri(): string
    {
        return $this->server['REQUEST_URI'] ?? '/';
    }

    public function path(): string
    {
        return parse_url($this->uri(), PHP_URL_PATH) ?? '/';
    }

    public function get(string $key, $default = null)
    {
        return $this->get[$key] ?? $default;
    }

    public function post(string $key, $default = null)
    {
        return $this->post[$key] ?? $default;
    }

    public function json(): ?array
    {
        $input = file_get_contents('php://input');
        return $input ? json_decode($input, true) : null;
    }

    public function param(string $key, $default = null)
    {
        return $this->routeParams[$key] ?? $default;
    }

    public function setParam(string $key, $value): void
    {
        $this->routeParams[$key] = $value;
    }
}
