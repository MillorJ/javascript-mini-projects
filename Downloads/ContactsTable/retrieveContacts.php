<?php
    if($_SERVER['REQUEST_METHOD'] == "GET") {

        $db_conn = mysqli_connect('localhost', 'root', '', 'contacts');

        $data = array();

        $query = "SELECT * FROM contact";
        if($r = mysqli_query($db_conn, $query)) {
            if(mysqli_num_rows($r) > 0) {
                while($row = mysqli_fetch_array($r)) {
                    $data[] = $row;
                }
                header('Content-Type: application/json');
                echo json_encode($data);
            } else echo json_encode(-1);
        }
    }
?>