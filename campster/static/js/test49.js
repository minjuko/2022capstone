// variables
let state = 'SUCCESS';
let cnt = 1;
// functions
function Message(arg) {
    this.text = arg.text;
    this.message_side = arg.message_side;

    this.draw = function (_this) {
        return function () {
            let $message;
            $message = $($('.message_template').clone().html());
            $message.addClass(_this.message_side).find('.text').html(_this.text);
            $('.messages').append($message);

            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
}

function getMessageText() {
    let $message_input;
    $message_input = $('.message_input');
    return $message_input.val();
}

function show (item) {
        let $message = $($('.message_template').clone().html());
        $message.addClass('left');
        $message.find('.text').append('<p>'+item.facltNm+"</p>");
        $message.find('.text').append('<p>'+item.lineIntro+"</p>");
        $message.find('.text').append('<p>'+item.animalCmgCl+"</p>");
        $message.find('.text').append('<p>'+item.posblFcltyCl+"</p>");
        $message.find('.text').append('<p>'+item.homepage+"</p>");

        $('.messages').append($message);
        setTimeout(function() {
            $message.addClass('appeared')
        },0);

        $('.messages').animate({scrollTop: $('.messages').prop('scrollHeight')}, 500);

    }

function sendMessageList(data, size){
        let $message = $($('.message_template').clone().html());
        $message.addClass('left');
        $message.attr('id','msg'+cnt);
        for(let i = 0 ; i < parseInt(size);i++)
        {
            $message.find('.text').append('<div class="item_card" id=\"item'+(i+1)+'\"'+'>');
            let facltNm = data[i].facltNm;
            let lineIntro = (data[i].lineIntro =='') ?'' : (": "+data[i].lineIntro);
            let image = (data[i].firstImageUrl=='')? 'static/images/alt_image.jpg':data[i].firstImageUrl;
            let $text  = $('<p>').html("☆"+data[i].facltNm+"☆");
            let $img = $('<img>').attr('src',image).attr('alt','').attr('width','180px').attr('height','150px');
            let $btn = $('<input id='+(i+1)+'>').addClass('specific_btn')
            .attr('type','button').
            attr('value','세부정보');
            $message.find('#item'+(i+1)).append($text);
            $message.find('#item'+(i+1)).append($img);
            $message.find('#item'+(i+1)).append($btn);

            $(document).on("click","#msg"+cnt+" div.item_card #"+(i+1),function(e){
                e.stopPropagation();
                show(data[i])});
        }

        $('.messages').append($message);
        cnt += 1;
        setTimeout(function() {
            $message.addClass('appeared')
        },0);
        $('.messages').animate({scrollTop: $('.messages').prop('scrollHeight')}, 500);
    }

function sendMessage(text, message_side) {
    let $messages, message;
    $('.message_input').val('');
    $messages = $('.messages');
    message = new Message({
        text: text,
        message_side: message_side
    });
    message.draw();
    $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 300);
}

function greet() {
    setTimeout(sendMessage, 1000, '안녕하세요! 여러분의 캠핑 가이드 캠스터에요!\n 저는 여러분들에게 전국의 캠핑지 추천 및 \n관련 세부정보 제공과 캠핑용품 추천 서비스를 제공하고 있습니다.','left');
    setTimeout(sendMessage, 1500, '무엇을 도와드릴까요?','left')
}

function onClickAsEnter(e) {
    if (e.keyCode === 13) {
        onSendButtonClicked()
    }
}





function requestChat(messageText, url_pattern) {
    $.ajax({
        url: "http://127.0.0.1:8080/test/" + url_pattern + '/' + messageText,
        type: "GET",
        dataType: "jsonp",
        cache:"no-store",
        // jsonp:"callback",

        success: function (data) {
             if (data.size == 0)
             {
                 setTimeout(sendMessage,1000,'알려주신 정보에 맞는 캠핑장이 없습니다.','left')
                 setTimeout(sendMessage, 1500, '다른 정보를 알려주시겠어요?', 'left');
                 return;
             }

             setTimeout(sendMessage,1000,'알려주신 정보를 토대로 추천 캠핑장을 가져와봤어요.','left')
             setTimeout(sendMessage,1500,'세부정보를 원하시는 캠핑장이 있으면 버튼을 눌러주세요.','left')
             setTimeout(sendMessageList, 2500,[data.r1, data.r2, data.r3], data.size)
        },

        error: function (request, status, error) {
            console.log(error);

            return sendMessage('죄송합니다. 서버 연결에 실패했습니다.', 'left');
        }
    });
}

function onSendButtonClicked() {
    let messageText = getMessageText();

    sendMessage(messageText, 'right');


    if (messageText.includes('안녕')) {
        setTimeout(function () {
            return sendMessage("안녕하세요. 여기는 test 용입니다.", 'left');
        }, 1000);
    } else if (messageText.includes('고마워')) {
        setTimeout(function () {
            return sendMessage("천만에요. 더 물어보실 건 없나요?", 'left');
        }, 1000);
    } else if (messageText.includes('없어')) {
        setTimeout(function () {
            return sendMessage("그렇군요. 알겠습니다!", 'left');
        }, 1000);

    }
    else
        return requestChat(messageText, 'request_chat');

}