<?php

namespace App\Core;

class Router
{
    private array $routes = [];

    public function get(string $pattern, callable|array $handler): void
    {
        $this->routes['GET'][] = ['pattern' => $pattern, 'handler' => $handler];
    }

    public function post(string $pattern, callable|array $handler): void
    {
        $this->routes['POST'][] = ['pattern' => $pattern, 'handler' => $handler];
    }

    public function dispatch(string $method, string $uri, Request $request): bool
    {
        $path = parse_url($uri, PHP_URL_PATH);

        foreach ($this->routes[$method] ?? [] as $route) {
            $regex = $this->convertPatternToRegex($route['pattern'], $params);

            if (preg_match($regex, $path, $matches)) {

                if($params != null){
                    foreach ($params as $name) {
                        $request->setParam($name, $matches[$name]);
                    }
                }
                
                $handler = $route['handler'];

                if (is_array($handler)) {
                    [$class, $method] = $handler;
                    $controller = new $class;
                    return $controller->$method($request);
                }

                return call_user_func($handler, $request);
            }
        }

        return false;
    }

    private function convertPatternToRegex(string $pattern, &$params): string
    {
        $regex = preg_replace_callback('/\{(\w+)\}/', function ($matches) use (&$params) {
            $params[] = $matches[1];
            return '(?P<' . $matches[1] . '>[^/]+)';
        }, $pattern);

        return "#^" . $regex . "$#";
    }
}
