<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Product.php';
require_once __DIR__ . '/../Models/Photo.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Product;
use App\Models\Photo;

use finfo;

class ProductController {
    public function showProducts(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/products.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function showProduct(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/product.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function loadProductsFiltered(Request $request){
        
        $filters = $request->json();
        if($filters == null){
            echo json_encode([]);
            return true;
        }
        $products = Product::getFilteredProducts($filters);
        echo json_encode($products);
        
        return true;
    }

    public function loadProductsList(Request $request){
        
        $products = Product::getProductsList();
        echo json_encode($products);
        
        return true;
    }

    public function loadProduct(Request $request){
        
        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        $product = Product::getByID($id);
        echo json_encode($product);
        
        return true;
    }

    public function loadProductByVariant(Request $request){
        
        $variantid = $request->param("variantid");
        if($variantid == null){
            echo null;
            return true;
        }

        $product = Product::getByVariantID($variantid);
        echo json_encode($product);
        
        return true;
    }

    public function countPages(Request $request){

        $filters = $request->json();
        if($filters == null){
            echo null;
            return true;
        }
        $count = Product::getCount($filters);
        echo json_encode($count);

        return true;
    }

    public function addProduct(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $product_id = Product::createProduct($data);
        echo json_encode([true, $product_id]);
        return true;
    }

    public function addPhoto(Request $request){

        $file = $request->file("product-file");
        if($file == null || $file['error'] !== UPLOAD_ERR_OK){
            echo null;
            return true;
        }
        $product_id = $request->post("product-id");
        if($product_id == null){
            echo null;
            return true;
        }
        
        $uploadDir = Photo::$fileDir;

        $allowedMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);
        if (!in_array($mimeType, $allowedMime)) {
            echo json_encode([false, "File is not an image"]);
            return true;
        }

        $extensionsMap = ['image/jpeg' => 'jpg', 'image/png'  => 'png', 'image/gif'  => 'gif', 'image/webp' => 'webp'];
        $extension = $extensionsMap[$mimeType];
        
        do{
            $uniqueName = bin2hex(random_bytes(8)) . '_' . uniqid();
        } while(file_exists($uploadDir . $uniqueName . "." . $extension));

        if(move_uploaded_file($file['tmp_name'], $uploadDir . $uniqueName . "." . $extension)){
            if(Photo::createPhoto($product_id, $uniqueName . "." . $extension) <= 0){
                unlink($uploadDir . $uniqueName . "." . $extension);
                echo null;
                return true;
            }
            echo json_encode([true, $uniqueName . "." . $extension]);
        } else {
            echo null;
        }

        return true;
    }

    public function deletePhoto(Request $request){
        $photoid = $request->param("id");
        if($photoid == null){
            echo null;
            return true;
        }

        $photo = Photo::getByID($photoid);
        if($photo == null){
            echo null;
            return true;
        }

        if(!file_exists(Photo::$fileDir . $photo->filename)){
            echo null;
            return true;
        }

        if(Photo::deletePhoto($photo->photo_id) <= 0){
            echo null;
            return true;
        }

        unlink(Photo::$fileDir . $photo->filename);

        echo json_encode([true]);
        return true;
    }

}