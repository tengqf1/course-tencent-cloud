layui.use(['jquery', 'layim'], function () {

    var $ = layui.jquery;
    var layim = layui.layim;
    var socket = new WebSocket(window.im.ws.connect_url);

    socket.onopen = function () {
        console.log('socket connect success');
        setInterval(function () {
            socket.send('ping');
            console.log('ping...');
        }, 1000 * parseInt(window.im.ws.ping_interval));
    };

    socket.onclose = function () {
        console.log('socket connect close');
    };

    socket.onerror = function () {
        console.log('socket connect error');
    };

    socket.onmessage = function (e) {
        var data = JSON.parse(e.data);
        console.log(data);
        if (data.type === 'bind_user') {
            bindUser(data);
            refreshMessageBox();
        } else if (data.type === 'new_group_user') {
            showNewGroupUserMessage(data);
        } else if (data.type === 'show_online_tips') {
            showOnlineTips(data);
        } else if (data.type === 'show_chat_msg') {
            setChatMessageCount(data);
            showChatMessage(data);
        } else if (data.type === 'refresh_msg_box') {
            refreshMessageBox();
        } else if (data.type === 'friend_accepted') {
            friendAccepted(data);
            refreshMessageBox();
        } else if (data.type === 'group_accepted') {
            groupAccepted(data);
            refreshMessageBox();
        }
    };

    var options = {
        init: {url: '/im/init'},
        members: {url: '/im/group/users'},
        msgbox: '/im/msgbox',
        chatLog: '/im/chatlog',
        title: window.im.main.title,
        maxLength: window.im.main.msg_max_length,
        isAudio: false,
        isVideo: false
    };

    if (window.im.main.upload_img_enabled === '1') {
        options.uploadImage = {url: '/upload/im/img'};
    }

    if (window.im.main.upload_file_enabled === '1') {
        options.uploadFile = {url: '/upload/im/file'};
    }

    if (window.im.main.tool_audio_enabled === '1') {
        options.isAudio = true;
    }

    if (window.im.main.tool_video_enabled === '1') {
        options.isVideo = true;
    }

    layim.config(options);

    layim.on('ready', function (options) {
        if (options.friend.length > 0) {
            layui.each(options.friend, function (i, group) {
                layui.each(group.list, function (j, user) {
                    var $li = $('.layui-layim-list > .layim-friend' + user.id);
                    if (user.msg_count > 0) {
                        $li.append('<em class="msg-count layui-badge">' + user.msg_count + '</em>');
                    }
                });
            });
        }
    });

    layim.on('sendMessage', function (res) {
        sendChatMessage(res);
    });

    layim.on('chatChange', function (res) {
        resetChatMessageCount(res);
        if (res.data.type === 'friend') {
            setFriendStatus(res);
        }
    });

    layim.on('online', function (status) {
        $.ajax({
            type: 'POST',
            url: '/im/status/update',
            data: {status: status}
        });
    });

    layim.on('sign', function (sign) {
        $.ajax({
            type: 'POST',
            url: '/im/sign/update',
            data: {sign: sign}
        });
    });

    layim.on('setSkin', function (filename, src) {
        $.ajax({
            type: 'POST',
            url: '/im/skin/update',
            data: {skin: filename}
        });
    });

    function bindUser(res) {
        $.ajax({
            type: 'POST',
            url: '/im/user/bind',
            data: {client_id: res.client_id}
        });
    }

    function sendChatMessage(res) {
        $.ajax({
            type: 'POST',
            url: '/im/msg/chat/send',
            data: {from: res.mine, to: res.to}
        });
    }

    function showChatMessage(res) {
        layim.getMessage(res.message);
    }

    function setChatMessageCount(res) {
        var $li = $('.layim-chatlist-' + res.message.type + res.message.id);
        if ($li.hasClass('layim-this')) {
            return;
        }
        var $msgCount = $li.find('.msg-count');
        if ($msgCount.length > 0) {
            var count = parseInt($msgCount.text());
            $msgCount.text(count + 1).removeClass('layui-hide');
        } else {
            $li.append('<em class="msg-count layui-badge">1</em>');
        }
    }

    function resetChatMessageCount(res) {
        var $tabMsgCount = $('.layim-chatlist-' + res.data.type + res.data.id + ' > .msg-count');
        var $listMsgCount = $('.layui-layim-list > .layim-friend' + res.data.id + ' > .msg-count');
        var unreadListMsgCount = parseInt($listMsgCount.text());
        if (res.data.type === 'friend' && unreadListMsgCount > 0) {
            $.ajax({
                type: 'GET',
                url: '/im/friend/msg/unread',
                data: {id: res.data.id}
            });
        }
        $tabMsgCount.text(0).addClass('layui-hide');
        $listMsgCount.text(0).addClass('layui-hide');
    }

    function setFriendStatus(res) {
        var date = new Date();
        var lastQueryTime = parseInt($('#online-status-' + res.data.id).data('time'));
        if (lastQueryTime > 0 && date.getTime() - lastQueryTime < 600000) {
            return;
        }
        $.ajax({
            type: 'GET',
            url: '/im/friend/status',
            data: {id: res.data.id},
            success: function (data) {
                if (data.status === 'online') {
                    layim.setChatStatus('<span id="online-status-' + res.data.id + '" class="online" data-time="' + date.getTime() + '">??????</span>');
                    layim.setFriendStatus(res.data.id, 'online');
                } else if (data.status === 'offline') {
                    layim.setChatStatus('<span id="online-status-' + res.data.id + '" class="offline" data-time="' + date.getTime() + '">??????</span>');
                    layim.setFriendStatus(res.data.id, 'offline');
                } else {
                    layim.setChatStatus('<span id="online-status-' + res.data.id + '" class="unknown" data-time="' + date.getTime() + '"></span>');
                }
            }
        });
    }

    function showNewGroupUserMessage(res) {
        var content = '<a href="/user/' + res.user.id + '" target="_blank">[' + res.user.name + ']</a> ????????????';
        layim.getMessage({
            system: true,
            type: 'group',
            id: res.group.id,
            content: content
        });
    }

    function refreshMessageBox() {
        $.ajax({
            type: 'GET',
            url: '/im/notice/unread',
            success: function (res) {
                if (res.count > 0) {
                    layim.msgbox(res.count);
                }
            }
        });
    }

    function showOnlineTips(res) {
        var msg = res.friend.name + '?????????';
        layer.msg(msg, {
            icon: 6,
            offset: 'b',
            anim: 6
        });
        layim.setFriendStatus(res.friend.id, res.status);
    }

    function friendAccepted(res) {
        layim.addList({
            type: 'friend',
            groupid: res.group.id,
            username: res.friend.name,
            avatar: res.friend.avatar,
            id: res.friend.id
        });
    }

    function groupAccepted(res) {
        layim.addList({
            type: 'group',
            groupname: res.group.name,
            avatar: res.group.avatar,
            id: res.group.id
        });
    }

});