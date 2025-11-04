<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Article {
    public $article_id;
    public $content;
    public $title;


    public static function getByID(int $id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Article WHERE article_id = ? AND public = 1");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $article = new self();
        $article->article_id = $data['article_id'];
        $article->content = $data['content'];
        $article->title = $data['title'];

        return $article;
    }

}
