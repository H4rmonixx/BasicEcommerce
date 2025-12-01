<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Article.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Article;

class ArticleController {
    public function showArticles(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/articles.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }
    
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

    public function countPages(Request $request){

        $filters = $request->json();
        if($filters == null){
            echo null;
            return true;
        }
        $count = Article::getCount($filters);
        echo json_encode($count);

        return true;
    }

    public function loadArticles(Request $request){

        $filters = $request->json();
        if($filters == null){
            echo null;
            return true;
        }
        $articles = Article::getPublicArticles($filters);
        echo json_encode($articles);
        
        return true;
    }

    public function loadArticlesList(Request $request){

        $articles = Article::getAllArticles();
        echo json_encode($articles);
        
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

    public function addArticle(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $artid = Article::createArticle($data);
        echo json_encode([true, $artid]);
        return true;
    }

    public function deleteArticle(Request $request){
        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        $id_int = intval($id);
        if($id_int >= 1 && $id_int <= 5){
            echo json_encode([false, "Article protected"]);
            return true;
        }

        $result = Article::deleteArticle($id);
        echo json_encode([$result]);
        return true;
    }

    public function editContent(Request $request){
        $artid = $request->param("articleid");
        if($artid == null){
            echo null;
            return true;
        }
        $data = $request->post('content');
        if($data == null){
            echo null;
            return true;
        }

        if(!Article::editContent($artid, $data)){
            echo null;
            return true;
        }

        echo json_encode([true]);
        return true;
    }

    public function editInfo(Request $request){
        $artid = $request->param("articleid");
        if($artid == null){
            echo null;
            return true;
        }

        $id_int = intval($artid);
        if($id_int >= 1 && $id_int <= 5){
            echo json_encode([false, "Article info protected"]);
            return true;
        }

        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        if(!Article::editInfo($artid, $data)){
            echo null;
            return true;
        }

        echo json_encode([true]);
        return true;
    }

}