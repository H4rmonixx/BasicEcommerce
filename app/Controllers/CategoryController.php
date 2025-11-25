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

    public function loadCategory(Request $request){
        
        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        $cat = Category::getByID($id);
        echo json_encode($cat);

        return true;
    }

    public function addCategory(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $catid = Category::createCategory($data);
        echo json_encode([true, $catid]);
        return true;
    }

    public function editCategory(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        $result = Category::editCategory($id, $data);
        echo json_encode([$result]);
        return true;
    }

}