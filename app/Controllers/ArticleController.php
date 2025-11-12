<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Article.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Article;

class ArticleController {
    public function showArticle(Request $request) {

        $id = $request->param("id");
        if($id == null){
            return false;
        }
        if(!Article::ifExists($id)){
            return false;
        }

        $view = file_get_contents(__DIR__ . '/../Views/article.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function loadArticle(Request $request){

        $id = $request->param("id");
        if($id == null){
            echo json_encode(null);
            return true;
        }

        $article = Article::getByID($id);
        echo json_encode($article);
        
        return true;
    }

}