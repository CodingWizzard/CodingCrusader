<?php
$stateClause = "";
if (isset($_POST["state"])) {
    $values = $_POST["state"];

    $filtered = [];
    if ($values['stateOpen'] === 'true') $filtered[] = 'open';
    if ($values['stateDeclined'] === 'true') $filtered[] = 'declined';
    if ($values['stateAccepted'] === 'true') $filtered[] = 'accepted';
    if ($values['stateCompleted'] === 'true') $filtered[] = 'completed';

    if (count($filtered)) {
        $quotedValues  = implode(",", array_map(function($value) { return "'$value'"; }, $filtered));
        $stateClause = "state IN (" . $quotedValues . ")";
    }
}

$elementsClause = "";
if (isset($_POST["elements"])) {
    $values = $_POST["elements"];

    $filtered = [];
    if ($values['elements5'] === 'true') $filtered[] = '5';
    if ($values['elements15'] === 'true') $filtered[] = '15';
    if ($values['elementsMore'] === 'true') $filtered[] = 'more';
    if ($values['elementsEmpty'] === 'true') $filtered[] = '';

    if (count($filtered)) {
        $quotedValues  = implode(",", array_map(function($value) { return "'$value'"; }, $filtered));
        $elementsClause = "elements IN (" . $quotedValues . ")";
    }
}

$serviceClause = "";
if (isset($_POST["service"])) {
    $values = $_POST["service"];

    $filtered = [];
    if ($values['serviceWindows'] === 'true') $filtered[] = 'windows';
    if ($values['serviceAssembly'] === 'true') $filtered[] = 'assembly';
    if ($values['serviceDisposal'] === 'true') $filtered[] = 'disposal';
    if ($values['serviceEmpty'] === 'true') $filtered[] = '';

    if (count($filtered)) {
        $quotedValues  = implode(",", array_map(function($value) { return "'$value'"; }, $filtered));
        $serviceClause = "service IN (" . $quotedValues . ")";
    }
}

$typeClause = "";
if (isset($_POST["type"])) {
    $values = $_POST["type"];

    $filtered = [];
    if ($values['typeNew'] === 'true') $filtered[] = 'new';
    if ($values['typeOffer'] === 'true') $filtered[] = 'repair';
    if ($values['typeRepair'] === 'true') $filtered[] = 'offer';
    if ($values['typeEmpty'] === 'true') $filtered[] = '';

    if (count($filtered)) {
        $quotedValues  = implode(",", array_map(function($value) { return "'$value'"; }, $filtered));
        $typeClause = "type IN (" . $quotedValues . ")";
    }
}

$limitClause = "";
if (isset($_POST["limit"])) {
    $values = $_POST["limit"];

    if ($values['lastWeeks'] !== '') {
        $limitClause = "time >= DATE_SUB(NOW(), INTERVAL {$values['lastWeeks']} WEEK)";
    }
}


$xAxis = "state";
$yAxis = "count(*)";
$zAxis = "";
if (isset($_POST["axis"])) {
    $xAxis = $_POST["axis"]["xAxis"];
    $yAxis = $_POST["axis"]["yAxis"];
    $zAxis = $_POST["axis"]["zAxis"];
}

function getLabel($axis) {

    switch ($axis) {
        case "count":
            return "count(*) as value";
        case "sum(budget)":
            return "sum(budget) as value";


        case "year":
            return "year(time) as {$axis}";
        case "month":
            return "month(time) as {$axis}";
        case "month/year":
            return "concat(month(time), '/', year(time)) as {$axis}";

        case "state":
            return "CASE
                        WHEN request.state = 'open' THEN 'offen'
                        WHEN request.state = 'declined' THEN 'abgelehnt'
                        WHEN request.state = 'accepted' THEN 'angenommen'
                        WHEN request.state = 'completed' THEN 'abgeschlossen'
                        ELSE ''
                    END AS {$axis}";

        case "elements":
            return "CASE
                        WHEN request.elements = 5 THEN 'bis 5'
                        WHEN request.elements = 15 THEN 'bis 15'
                        WHEN request.elements = 'more' THEN 'über 15'
                        ELSE ''
                    END AS {$axis}";

        case "service":
            return "CASE
                        WHEN request.service = 'windows' then 'Fenster'
                        WHEN request.service = 'assembly' then 'Montage'
                        WHEN request.service = 'disposal' then 'Demontage'
                        ELSE ''
                    END AS  {$axis}";

        case "type":
            return "CASE
                        WHEN request.type = 'new' then 'Neue Fenster/Türen'
                        WHEN request.type = 'repair' then 'Reparatur'
                        WHEN request.type = 'offer' then 'Gegenangebot'
                        ELSE ''
                    END AS  {$axis}";
    }

    return "";
}

$xLabel = getLabel($xAxis);
$yLabel = getLabel($yAxis);
$zLabel = getLabel($zAxis);

$sql = "SELECT {$yLabel}, {$xLabel}, {$zLabel}
        FROM request
        WHERE 1=1 <stateClause> <elementsClause> <serviceClause> <typeClause> <limitClause>
        GROUP BY {$xAxis}, {$zAxis}
        ORDER BY {$xAxis}, {$zAxis}";

if ($stateClause != '') {
    $sql = str_replace('<stateClause>', 'AND ' . $stateClause, $sql);
}
else {
    $sql = str_replace('<stateClause>', '', $sql);
}

if ($elementsClause != '') {
    $sql = str_replace('<elementsClause>', 'AND ' . $elementsClause, $sql);
}
else {
    $sql = str_replace('<elementsClause>', '', $sql);
}

if ($serviceClause != '') {
    $sql = str_replace('<serviceClause>', 'AND ' . $serviceClause, $sql);
}
else {
    $sql = str_replace('<serviceClause>', '', $sql);
}

if ($typeClause != '') {
    $sql = str_replace('<typeClause>', 'AND ' . $typeClause, $sql);
}
else {
    $sql = str_replace('<typeClause>', '', $sql);
}

if ($limitClause != '') {
    $sql = str_replace('<limitClause>', 'AND ' . $limitClause, $sql);
}
else {
    $sql = str_replace('<limitClause>', '', $sql);
}

// todo: Daten aus der config.php entnehmen:
$servername = "127.0.0.1:3306";
$username = "root";
$password = "root";
$database = "c1w2db1";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = [];
$data['data'] = [];
$data['sql'] = $sql;
$rows = $conn->query($sql);
foreach ($rows as $row) {
    $data['data'][] = [
        'value' => floatval($row["value"]),
        'xAxis' => $row["{$xAxis}"],
        'zAxis' => $row["{$zAxis}"]
    ];
}
$conn->close();

$json = json_encode($data, true);
echo $json;


