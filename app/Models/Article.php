<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Article {
    public $article_id;
    public $title;
    public $public;
    public $date;
    public $content;

    public static function getByID(int $id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Article WHERE article_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $article = new self();
        $article->article_id = $data['article_id'];
        $article->title = $data['title'];
        $article->public = $data['public'];
        $article->date = $data['date'];
        $article->content = $data['content'];

        return $article;
    }

    public static function getPublicArticles($filters){
        $pdo = Database::getConnection();
        
        $sql = "SELECT * FROM Article WHERE public = 1 AND title LIKE ?";
        $params = ["%".$filters['search']."%"];

        if($filters['omit_id'] != null){
            $sql .= " AND article_id <> ?";
            array_push($params, intval($filters['omit_id']));
        }
        if($filters['limit'] != null){
            $sql .= " LIMIT ".intval($filters['limit']);
            if($filters['page'] != null){
                $sql .= " OFFSET ".(intval($filters['page']) - 1);
            }
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function getAllArticles(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Article");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function getCount($filters){
        $pdo = Database::getConnection();
        
        $sql = "SELECT Count(*) FROM Article WHERE public = 1 AND title LIKE ?";
        $params = ["%".$filters['search']."%"];

        if($filters['omit_id'] != null){
            $sql .= " AND article_id <> ?";
            array_push($params, intval($filters['omit_id']));
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        if($filters['limit'] == null) $filters['limit'] = 8;

        $data = ["pagesCount" => (int) ($stmt->fetchColumn() / $filters['limit'] + 1)];

        return $data;
    }

    public static function ifExists(int $id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT article_id FROM Article WHERE article_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return false;
        }

        return true;
    }

    public static function createArticle($data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Article (title, public) VALUES (?, ?)");
        $stmt->execute([$data['title'], $data['public']]);
        
        return $pdo->lastInsertId();
    }

    public static function deleteArticle($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM Article WHERE article_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount();
    }

    public static function editContent($article_id, $new_content){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Article SET content = ? WHERE article_id = ?");
        $stmt->execute([$new_content, $article_id]);

        return true;
    }

    public static function editInfo($article_id, $data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Product SET title = ?, public = ?  WHERE article_id = ?");
        $stmt->execute([$data['title'], $data['public'], $article_id]);

        return true;
    }

}
