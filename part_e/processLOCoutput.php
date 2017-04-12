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

    $newFile = fopen("locStatsCSV.csv", "w");
    fwrite($newFile, "name,loc\n");
    foreach ($output as $line) {
        $toWrite = $line[0].",".$line[1]."\n";
        fwrite($newFile, $toWrite);
    }
    fclose($newFile);
?>