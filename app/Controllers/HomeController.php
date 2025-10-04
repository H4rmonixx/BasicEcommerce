<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
use App\Core\Request;

class HomeController {
    public function index(Request $request) {
        $body = file_get_contents(__DIR__ . '/../Views/index.html');
        $styles = <<<EOD
        <link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="/css/index.css">
        EOD;
        $scripts = <<<EOD
        <script src="/js/index.js"></script>
        <script src="/js/loadProductTiles.js"></script>
        <script src="/js/loadCartSize.js"></script>
        <script src="/js/infobox.js"></script>
        EOD;
        
        include __DIR__ . '/../Views/layout.php';

        return true;
    }

    public function test(Request $request) {
        echo $request->param('tekst');

        return true;
    }
}