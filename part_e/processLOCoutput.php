<?php
    $myfile = fopen("locStats.txt", "r") or die("Unable to open file!");
    // Output one line until end-of-file
    $output = array();
    
    while(!feof($myfile)) {
        $line = trim(fgets($myfile));
        if (strlen($line) == 0) {
            continue;
        }
        echo $line;
        $tokens = explode(" ", $line, 3);
        $output[] = array($tokens[2], $tokens[0]);
        
    }
    fclose($myfile);

    var_dump($output);
?>