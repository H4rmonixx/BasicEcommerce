<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Models/Category.php';
use App\Core\Request;
use App\Models\Category;

class CategoryController {

    public function loadAllCategories(Request $request){
        
        $categories = Category::getAllCategories();
        echo json_encode($categories);

        return true;
    }

}