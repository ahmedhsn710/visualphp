<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
    <script src="script.js" defer></script>
    <title>Visual Php</title>
</head>

<body onload="startingInfo()">
      <nav class="nav">
        <a href="#">Visual PHP</a>
        <i class="uil uil-question-circle" id="help" onclick="startingInfo()" title="help"></i>
      </nav>
    
      <div class="container-fluid " id="main">
        <div class="blockly-wrapper">
          <div class="blockly-column">
            <div class="heading">
              Components
            </div>
            <div class="blockly-toolbox">
              <div class="draggable components" draggable="true" comp="echo">
                echo
              </div>
              <div class="draggable components" draggable="true" comp="comment">
                comment
              </div>
              <div class="draggable components" draggable="true" comp="variable">
                variable
              </div>
              <div class="draggable components" draggable="true" comp="for">
                for
              </div>
              <div class="draggable components" draggable="true" comp="while">
                while
              </div>
              <div class="draggable components" draggable="true" comp="if">
                if
              </div>
              <div class="draggable components" draggable="true" comp="else-if">
                else if
              </div>
              <div class="draggable components" draggable="true" comp="else">
                else
              </div>
              <div class="draggable components" draggable="true" comp="read-file">
                read file
              </div>
              <div class="draggable components" draggable="true" comp="write-file">
                write file
              </div>
              <div class="draggable components" draggable="true" comp="create-function">
                create function
              </div>
              <div class="draggable components" draggable="true" comp="call-function">
                call function
              </div>
              <div class="draggable components" draggable="true" comp="code">
                code manually
              </div>
            </div>
          </div>
          <div class="blockly-column" id="center">
            <div class="heading">
              Workspace
            </div>
            <div class="workspace">
              <div class="line">
                &lt;?php
              </div>
              <div class="line last" >
                ?> 
              </div>
            </div>
            <div class="workspace">
              <div class="line">
                &lt;?php
              </div>
              <div class="line last" >
                ?> 
              </div>
            </div>
            <button class="run" id="run-button">Run</button>
          </div>
          <div class="blockly-column">
            <div class="heading">
              Output
            </div>
            <div class="output" id="output"></div>
          </div>
        </div>
      </div>
    
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    
</body>

</html>