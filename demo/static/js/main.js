// 시트 참고, 지역 기반
// 장비는 문장 3개 다 보내는거, 테마 기반은 선택한 해시태그 여러개 보내는거


// variables 
let userName = null;
let state = 'SUCCESS';
let selectedBUTTON = 0;

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
    setTimeout(function () {
        return sendMessage("안녕하세요, 사용자 맞춤형 캠핑 가이드 캠스터에요!", 'left');
    }, 1000);

    setTimeout(function () {
        return sendMessage("사용할 닉네임을 알려주세요.", 'left');
    }, 2000);
}

function seperateURL(textUrlMsg) {  // 서버에서 문자열 받아서 채팅창에 올리는 함수. 
    let fromServerMsg = new String();
    fromServerMsg = textUrlMsg; // 여기에 서버에서 온 문자열(textUrlMsg) 넣기
    let leftIndex = fromServerMsg.indexOf('{{',[0]);
    let rightIndex = fromServerMsg.indexOf('}}',[0]) + 2;
    let leftMsg = fromServerMsg.substring(0,leftIndex);
    let rightMsg = fromServerMsg.substring(rightIndex,fromServerMsg.length);
    let textMsg = leftMsg.concat(rightMsg);
    let urlMsg = fromServerMsg.substring(leftIndex+2,rightIndex-2);
    
    sendMessage("서버에서 온 메세지가 '텍스트{{1234}}텍스트'일 때 url 분리하기", 'left');
    sendMessage("Text:" + textMsg + "<br> url:" + urlMsg, 'left');
}

function FinSelectTheme(){

    let themeArray = new Array();
    let themeIndex = 0;

    const checkbox1 = document.getElementById('노을');
    const is_checked1 = checkbox1.checked;
    if(is_checked1) themeArray[themeIndex++] = '노을';


    const checkbox2 = document.getElementById('바다'); 
    const is_checked2 = checkbox2.checked;
    if(is_checked2) themeArray[themeIndex++] = '바다';
    

    const checkbox3 = document.getElementById('반려동물');
    const is_checked3 = checkbox3.checked;
    if(is_checked3) themeArray[themeIndex++] = '반려동물';
    
    const checkbox4 = document.getElementById('별');
    const is_checked4 = checkbox4.checked;
    if(is_checked4) themeArray[themeIndex++] = '별';
    
    const checkbox5 = document.getElementById('아이');
    const is_checked5 = checkbox5.checked;
    if(is_checked5) themeArray[themeIndex++] = '아이';

    const checkbox6 = document.getElementById('물놀이');
    const is_checked6 = checkbox6.checked;
    if(is_checked6) themeArray[themeIndex++] = '물놀이';

    const checkbox7 = document.getElementById('한적한');
    const is_checked7 = checkbox7.checked;
    if(is_checked7) themeArray[themeIndex++] = '한적한';

    const checkbox8 = document.getElementById('단풍');
    const is_checked8 = checkbox8.checked;
    if(is_checked8) themeArray[themeIndex++] = '단풍';

    const checkbox9 = document.getElementById('바베큐');
    const is_checked9 = checkbox9.checked;
    if(is_checked9) themeArray[themeIndex++] = '바베큐';

    const checkbox10 = document.getElementById('구경');
    const is_checked10 = checkbox10.checked;
    if(is_checked10) themeArray[themeIndex++] = '구경';

    if(themeIndex>3){
        alert("3개까지 선택 가능");
    }
    else{
        sendMessage("[테마기반 서버에 보낼 메세지:" + themeArray + "]", 'left');
    }
    
}

function onClickAsEnter(e) {
    if (e.keyCode === 13) {
        onSendButtonClicked()
    }
}

function selectNUM1() {
    selectedBUTTON = 1;
    sendMessage("원하는 지역이나 입지가 있으시다면 입력해주세요",'left');
    /* 기본?틀에 맞춰서 진행시키면 될듯. 아래에서 else if(selectedBUTTON == 1)은 없애도 될것같기도...?*/
}

function selectNUM2() {

    selectedBUTTON = 2;
    sendMessage("<div class= 'boxes'>" + 
                "<input type=checkbox name='chk' value='노을' id='노을' > <label for='노을'>#노을 뷰가 있는</label><br>" +
                "<input type=checkbox name='chk' id='바다' > <label for='바다'>#바다가 보이는</label><br>"+
                "<input type=checkbox name='chk' id='반려동물' > <label for='반려동물'>#반려동물과 함께하는</label><br>"+
                "<input type=checkbox name='chk' id='별' > <label for='별'>#별이 잘 보이는</label><br>"+
                "<input type=checkbox name='chk' id='아이' > <label for='아이'>#아이들 놀기 좋은</label><br>"+
                "<input type=checkbox name='chk' id='물놀이' > <label for='물놀이'>#물놀이 하기 좋은</label><br>"+
                "<input type=checkbox name='chk' id='한적한' > <label for='한적한'>#조용하고 한적한</label><br>"+
                "<input type=checkbox name='chk' id='단풍'> <label for='단풍'>#단풍 보기 좋은</label><br>"+
                "<input type=checkbox name='chk' id='바베큐' > <label for='바베큐'>#바베큐하기 좋은</label><br>"+
                "<input type=checkbox name='chk' id='구경'> <label for='구경'>#구경거리가 있는</label><br>"+

                "<button class='check' onclick='FinSelectTheme();'>선택완료</button>", 'left');
   


    /* 테마(10개) 제시 후 뭘 선택했는지 저장하거나 서버에 보내기 
    더 입력 안받고 테마로 처리할거면 아래 else if(selectedBUTTON == 2) 없애도 됨*/
    // 사용자한테 텍스트 입력 안받고 테마 버튼 선택 후 바로 서버에 보내기
    // url_pattern 정해서 서버에 메세지 보내기
    $.ajax({
        url: "http://103.218.159.163.8080/" + url_pattern + '/' + userName + '/' + messageText,
        type: "GET",
        dataType: "json",
        success: function (data) {
            state = data['state'];

            if (state === 'SUCCESS') {
                return sendMessage(data['answer'], 'left');
            } else {
                return sendMessage('죄송합니다. 무슨말인지 잘 모르겠어요.', 'left');
            }
        },

        error: function (request, status, error) {
            console.log(error);
            return sendMessage('죄송합니다. 서버 연결에 실패했습니다.', 'left');
        }
    });
}

function selectNUM3() {
    selectedBUTTON = 3;
    sendMessage("텐트, 침낭 등 원하는 캠핑 용품을 입력해주세요",'left');
    /* 원하는 장비 단어 입력 요청하기 -> 텍스트는 아래에서 처리*/
}



function setUserName(username) {
    let selectNUM;
    if (username != null && username.replace(" ", "" !== "")) {
        setTimeout(function () {
            return sendMessage("반가워요 " + username + "님! <br> 아래 세 가지 기능 중 원하시는 기능을 선택해주세요 <i class='fa-regular fa-face-smile'></i>", 'left');
        }, 1000);
        setTimeout(function () {
            return sendMessage("<button class='region' onclick='selectNUM1();'>1. 지역 기반 캠핑지 추천</button><br><button class='theme' onclick='selectNUM2();'>2. 테마 기반 캠핑지 추천</button><br><button class='equipment' onclick='selectNUM3();'>3. 캠핑 장비 추천</button>", 'left');
        }, 2000);

        return username;

    } else {
        setTimeout(function () {
            return sendMessage("올바른 닉네임을 이용해주세요.", 'left');
        }, 1000);

        return null;
    }
}

function requestChat(messageText, url_pattern) {
    $.ajax({
        url: "http://103.218.159.163.8080/" + url_pattern + '/' + userName + '/' + messageText,
        type: "GET",
        dataType: "json",
        success: function (data) {
            state = data['state'];

            if (state === 'SUCCESS') {
                return sendMessage(data['answer'], 'left');
            } else if (state === 'REQUIRE_LOCATION') {
                return sendMessage('어느 지역을 알려드릴까요?', 'left');
            } else {
                return sendMessage('죄송합니다. 무슨말인지 잘 모르겠어요.', 'left');
            }
        },

        error: function (request, status, error) {
            console.log(error);

            return sendMessage('죄송합니다. 서버 연결에 실패했습니다.', 'left');
        }
    });
}

function onSendButtonClicked() {    // 전송 버튼을 누르면
    let messageText = getMessageText();
    sendMessage(messageText, 'right');

    if (userName == null) {
        userName = setUserName(messageText);

    } else {
        if (messageText.includes('안녕')) {
            setTimeout(function () {
                return sendMessage("안녕하세요. 저는 Kochat 여행봇입니다.", 'left');
            }, 1000);
        } else if (messageText.includes('고마워')) {
            setTimeout(function () {
                return sendMessage("천만에요. 더 물어보실 건 없나요?", 'left');
            }, 1000);
        } else if (messageText.includes('없어')) {
            setTimeout(function () {
                return sendMessage("그렇군요. 알겠습니다!", 'left');
            }, 1000);


        } else if(selectedBUTTON == 1){
            sendMessage("지역기반 선택된 후 채팅(자연어 처리 필요) : " + messageText, 'left');
        } else if(selectedBUTTON == 3){
            sendMessage("[캠핑장비 서버에 보낼 메세지: " + messageText + "]", 'left');
            // url_pattern 정해서 서버에 메세지 보내기
            $.ajax({
                url: "http://103.218.159.163.8080/" + url_pattern + '/' + userName + '/' + messageText,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    state = data['state'];
        
                    if (state === 'SUCCESS') {
                        return sendMessage(data['answer'], 'left');
                    } else {
                        return sendMessage('죄송합니다. 무슨말인지 잘 모르겠어요.', 'left');
                    }
                },
        
                error: function (request, status, error) {
                    console.log(error);
                    return sendMessage('죄송합니다. 서버 연결에 실패했습니다.', 'left');
                }
            });
        }
        else if (state.includes('REQUIRE')) {
            return requestChat(messageText, 'fill_slot');
        } else {
            return requestChat(messageText, 'request_chat');
        }
    }
}

/*
let tabnav = document.getElementsByClassName("tabnav");

      function handleClick(event) {
        console.log(event.target);
        // console.log(this);
        // 콘솔창을 보면 둘다 동일한 값이 나온다

        console.log(event.target.classList);

        if (event.target.classList[1] === "active") {
          event.target.classList.remove("active");
        } else {
          for (var i = 0; i < tabnav.length; i++) {
            tabnav[i].classList.remove("active");
          }
          event.target.classList.add("active");
        }
      }

      function init() {
        for (var i = 0; i < tabnav.length; i++) {
            tabnav[i].addEventListener("click", handleClick);
        }
      }

      init();

/*
function getFocus() {
    document.getElementByName().focus();
}
function loseFocus() {
    document.getElementById().blur();
}
function click() {
    home_btn.style.backgroundColor = "white";
    cat_btn.style.backgroundColor = "white";
    community_btn.style.backgroundColor = "white";

    this.style.backgroundColor = "#3b8c87";

    home_btn.addEventListener("click", click);
    cat_btn.addEventListener("click", click);
    community_btn.addEventListener("click", click);
}

$(function(){
    /*
    const home_btn = document.getElementByName('home');
    const chat_btn = document.getElementByName('chat');
    const community_btn = document.getElementByName('community');
    home_btn.addEventListener('click', click);
    chat_btn.addEventListener('click', click);
    community_btn.addEventListener('click', click);
    $('.tabnav a').click(function () {
      $('.tabnav a').removeClass('active');
      $(this).addClass('active');
      return false;
    }).filter(':eq(0)').click();
});
*/