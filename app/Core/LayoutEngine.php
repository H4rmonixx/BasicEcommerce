<?php

namespace App\Core;

class LayoutEngine {

    public static $extensions = [];

    public static function resolveLayout($view){
        $pattern = '/@section\("([^"]+)"\)\s*(.*?)\s*@endsection/s';

        $website = file_get_contents(__DIR__ . '/../Views/layout.html');

        foreach(self::$extensions as $ex){
            $t = file_get_contents(__DIR__ . '/../Views/LayoutExtensions/'.$ex['file']);
            foreach($ex['vars'] as $var => $val){
                $t = str_replace("@var(\"".$var."\")", $val, $t);
            }
            $t = preg_replace('/@var\(\"([^"]+)\"\)/', "", $t);
            $website = str_replace("@extension(\"".$ex['name']."\")", $t, $website);
        }

        preg_match_all($pattern, $view, $matches);
        foreach($matches[1] as $index => $name){
            $website = str_replace("@showsection(\"$name\")", $matches[2][$index], $website);
        }

        $website = preg_replace('/@showsection\(\"([^"]+)\"\)/', "", $website);
        $website = preg_replace('/@extension\(\"([^"]+)\"\)/', "", $website);

        return $website;
    }

    public static function enableExtension($name, $file, $vars = []){
        array_push(self::$extensions, ["name" => $name, "file" => $file, "vars" => $vars]);
    }

    public static function updateView(&$view, $section, $str){
        $pattern = '/(@section\("'.$section.'"\)\s*)(.*?)(\s*@endsection)/s';
        preg_match_all($pattern, $view, $matches);
        $old = $matches[2][0];
        $view = preg_replace($pattern,
        "$1" . "$2" . $str . "$3",
        $view);
    }

};