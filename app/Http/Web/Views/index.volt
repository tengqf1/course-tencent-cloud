<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>{{ site_settings.title }}</title>
    {{ icon_link("favicon.ico") }}
    {{ css_link("lib/layui/css/layui.css") }}
    {{ js_include("lib/layui/layui.js") }}
</head>
<body class="layui-layout-body">
{{ content() }}
</body>
</html>