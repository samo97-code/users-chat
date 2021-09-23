<?php
$domain = "http://127.0.0.1:8001";
// $token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MGQ5NGRmOTQxODNiZjFjYWY1NTg2NDUiLCJpYXQiOjE2MjQ4ODk3MDUsIm5iZiI6MTYyNDg4OTcwNSwianRpIjoiOGZkMDU3OGUtZDkxOS00Yjg5LTk3NDYtZTQ2OWFjYTAxNWVhIiwiZXhwIjoxNjI0OTc2MTA1LCJ0eXBlIjoiYWNjZXNzIiwiZnJlc2giOmZhbHNlfQ.LFw3ArbvLne9s_iPWsA8GH6MpJtuaFDvOD4ykdfLP8U";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="icon" href="/favicon.ico">
    <title>chat</title>
    <link href="<?=$domain?>/css/app.css" rel="stylesheet">
</head>
<body style="background: url(https://pixelfield.cz/_assetsimg/projects/breegy/breegy.png)">
<chat-widget token="<?=$token?>" title="Vuidget live example"></chat-widget>
<script src="<?=$domain?>/js/app.js"></script>
</body>
</html>
