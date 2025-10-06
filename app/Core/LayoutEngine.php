<?php

namespace App\Core;

class LayoutEngine {

    public static function resolveLayout($viewName){
        $pattern = '/@section\("([^"]+)"\)\s*(.*?)\s*@endsection/s';
        $view = file_get_contents(__DIR__ . '/../Views/' . $viewName);

        preg_match_all($pattern, $view, $matches);

        $website = file_get_contents(__DIR__ . '/../Views/layout.html');

        foreach($matches[1] as $index => $name){
            $website = str_replace("@showsection(\"$name\")", $matches[2][$index], $website);
        }

        $website = preg_replace('/@showsection\(\"([^"]+)\"\)/', "", $website);

        return $website;
    }

};