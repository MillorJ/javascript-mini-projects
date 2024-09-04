<?php

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    
    $db_conn = mysqli_connect('localhost', 'root', '', 'contacts');

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];

    $query = "DELETE FROM contact WHERE id = $id";
    mysqli_query($db_conn, $query);

    mysqli_close($db_conn);
    
}

?>