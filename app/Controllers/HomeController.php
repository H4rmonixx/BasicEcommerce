<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

class HomeController {
    public function index(Request $request) {

        echo LayoutEngine::resolveLayout('index.html');

        return true;
    }

    public function test(Request $request) {
        echo $request->param('tekst');

        return true;
    }
}