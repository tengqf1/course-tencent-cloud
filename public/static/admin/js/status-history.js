layui.use(['jquery', 'layer'], function () {

    var $ = layui.jquery;
    var layer = layui.layer;

    $('.kg-status-history').on('click', function () {
        layer.open({
            type: 2,
            title: 'εε²ηΆζ',
            content: $(this).data('url'),
            area: ['640px', '320px']
        });
    });

});