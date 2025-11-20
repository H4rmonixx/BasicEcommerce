<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

class ErrorController {

    public static $err_code = 404;

    public function show(Request $request) {

        http_response_code(404);

        $filename = "404.html";

        if(file_exists(__DIR__ . "/../Views/Errors/" . self::$err_code . ".html")) $filename = self::$err_code.".html";

        $view = file_get_contents(__DIR__ . '/../Views/Errors/' . $filename);
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function setErrorCode($x){
        self::$err_code = $x;
    }

}