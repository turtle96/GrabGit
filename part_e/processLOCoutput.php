<?php
    $myfile = fopen("locStats.txt", "r") or die("Unable to open file!");
    // Output one line until end-of-file
    $output = array();
    
    while(!feof($myfile)) {
        $line = trim(fgets($myfile));
        if (strlen($line) == 0) {
            continue;
        }
        $tokens = explode(" ", $line, 3);
        $output[] = array($tokens[0], $tokens[2]);
    }
    fclose($myfile);
    
    rsort($output);

    $newFile = fopen("locStatsCSV.csv", "w");
    fwrite($newFile, "name,value\n");
    foreach ($output as $line) {
        $toWrite = $line[1].",".$line[0]."\n";
        fwrite($newFile, $toWrite);
    }
    fclose($newFile);
?>