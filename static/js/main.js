// variables 
let userName = null;
let state = 'SUCCESS';
let selectedBUTTON = 0;
let btnNums = 0;
let specific_data = [];
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
    
    sendMessage("서버에서 온 메세지에서 url 분리하기", 'left');
    sendMessage("<img width=80% height=80% src='"+urlMsg+"'> <br>" + textMsg  , 'left');
}

function FinSelectTheme(){

    let themestr = new String("");
    let isFirst = true;
    
    const checkbox1 = document.getElementById('노을');
    const is_checked1 = checkbox1.checked;
    if(is_checked1) {
        if(isFirst){
            themestr+='노을';
            isFirst=false;
        }
        else {
            themestr +=',노을';
        }
    }


    const checkbox2 = document.getElementById('바다');
    const is_checked2 = checkbox2.checked;
    if(is_checked2) {
        if(isFirst){
            themestr+='바다';
            isFirst=false;
        }
        else {
            themestr +=',바다';
        }
    }

    const checkbox3 = document.getElementById('반려동물');
    const is_checked3 = checkbox3.checked;
    if(is_checked3) {
        if(isFirst){
            themestr+='반려동물';
            isFirst=false;
        }
        else {
            themestr +=',반려동물';
        }
    }

    const checkbox4 = document.getElementById('별');
    const is_checked4 = checkbox4.checked;
    if(is_checked4) {
        if(isFirst){
            themestr+='별';
            isFirst=false;
        }
        else {
            themestr +=',별';
        }
    }

    const checkbox5 = document.getElementById('아이');
    const is_checked5 = checkbox5.checked;
    if(is_checked5) {
        if(isFirst){
            themestr+='아이';
            isFirst=false;
        }
        else {
            themestr +=',아이';
        }
    }

    const checkbox6 = document.getElementById('물놀이');
    const is_checked6 = checkbox6.checked;
    if(is_checked6) {
        if(isFirst){
            themestr+='물놀이';
            isFirst=false;
        }
        else {
            themestr +=',물놀이';
        }
    }

    const checkbox7 = document.getElementById('한적한');
    const is_checked7 = checkbox7.checked;
    if(is_checked7) {
        if(isFirst){
            themestr+='한적한';
            isFirst=false;
        }
        else {
            themestr +=',한적한';
        }
    }

    const checkbox8 = document.getElementById('단풍');
    const is_checked8 = checkbox8.checked;
    if(is_checked8) {
        if(isFirst){
            themestr+='단풍';
            isFirst=false;
        }
        else {
            themestr +=',단풍';
        }
    }

    const checkbox9 = document.getElementById('바베큐');
    const is_checked9 = checkbox9.checked;
    if(is_checked9) {
        if(isFirst){
            themestr+='바베큐';
            isFirst=false;
        }
        else {
            themestr +=',바베큐';
        }
    }

    const checkbox10 = document.getElementById('구경');
    const is_checked10 = checkbox10.checked;
    if(is_checked10) {
        if(isFirst){
            themestr+='구경';
            isFirst=false;
        }
        else {
            themestr +=',구경';
        }
    }

    if(themeIndex>3){
        alert("3개까지 선택 가능");
    }
    else{
        sendMessage("[테마기반 서버에 보낼 메세지:" + themeArray + "]", 'left');
    }

}
function FinSelectTheme(){

    let themestr = "";
    let isFirst = true;
    let themeIndex = 0;

    const checkbox1 = document.getElementById('노을');
    const is_checked1 = checkbox1.checked;
    if(is_checked1) {
        if(isFirst){
            themestr+='노을';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',노을';
        }
    }


    const checkbox2 = document.getElementById('바다');
    const is_checked2 = checkbox2.checked;
    if(is_checked2) {
        if(isFirst){
            themestr+='바다';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',바다';
        }
    }

    const checkbox3 = document.getElementById('반려동물');
    const is_checked3 = checkbox3.checked;
    if(is_checked3) {
        if(isFirst){
            themestr+='반려동물';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',반려동물';
        }
    }

    const checkbox4 = document.getElementById('별');
    const is_checked4 = checkbox4.checked;
    if(is_checked4) {
        if(isFirst){
            themestr+='별';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',별';
        }
    }

    const checkbox5 = document.getElementById('아이');
    const is_checked5 = checkbox5.checked;
    if(is_checked5) {
        if(isFirst){
            themestr+='아이';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',아이';
        }
    }

    const checkbox6 = document.getElementById('물놀이');
    const is_checked6 = checkbox6.checked;
    if(is_checked6) {
        if(isFirst){
            themestr+='물놀이';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',물놀이';
        }
    }

    const checkbox7 = document.getElementById('한적한');
    const is_checked7 = checkbox7.checked;
    if(is_checked7) {
        if(isFirst){
            themestr+='한적한';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',한적한';
        }
    }

    const checkbox8 = document.getElementById('단풍');
    const is_checked8 = checkbox8.checked;
    if(is_checked8) {
        if(isFirst){
            themestr+='단풍';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',단풍';
        }
    }

    const checkbox9 = document.getElementById('바베큐');
    const is_checked9 = checkbox9.checked;
    if(is_checked9) {
        if(isFirst){
            themestr+='바베큐';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',바베큐';
        }
    }

    const checkbox10 = document.getElementById('구경');
    const is_checked10 = checkbox10.checked;
    if(is_checked10) {
        if(isFirst){
            themestr+='구경';
            isFirst=false;
            themeIndex++
        }
        else {
            themestr +=',구경';
        }
    }

    if(themeIndex>3){
        alert("3개까지 선택 가능");
    }
    else{
        tagRequest(themestr,'selection2');
    }

}

function 장비선택(){
    return sendMessage("<button class='selectequipment' onclick='텐트();' >텐트</button>" +
                        "<button class='selectequipment' onclick='침낭ㆍ매트();'>침낭ㆍ매트</button>" +
                        "<button class='selectequipment' onclick='퍼니처();'>퍼니처</button>" +
                    "<button class='selectequipment' onclick='라이팅();'>라이팅</button>" +
                    "<button class='selectequipment' onclick='화로();' >화로 ㆍ BBQ</button>" +
                    "<button class='selectequipment' onclick='키친();' >키친</button>" +
                    "<button class='selectequipment' onclick='계절용품();' >계절용품</button>" +
                    "<button class='selectequipment' onclick='스토리지();' >스토리지</button>" +
                    "<button class='selectequipment' onclick='RV용품();'>RV용품</button>" +
                    "<button class='selectequipment' onclick='악세서리();'>악세서리</button>" +
                    "<button class='selectequipment' onclick='등산용품();'>등산용품</button>" , 'left');
}
function 텐트(){
    return sendMessage("<button class='selectequipment' onclick=FinEq('거실형텐트'); >거실형텐트</button>" +
    "<button class='selectequipment' onclick=FinEq('돔형텐트') >돔형텐트</button>" +
    "<button class='selectequipment' onclick=FinEq('티피/루프탑텐트'); >티피/루프탑텐트</button>" +
    "<button class='selectequipment' onclick=FinEq('백패킹텐트'); >백패킹텐트</button>" +
    "<button class='selectequipment' onclick=FinEq('면텐트'); >면텐트</button>" +
    "<button class='selectequipment' onclick=FinEq('타프텐트/타프옵션'); >타프텐트/타프옵션</button>" +
    "<button class='selectequipment' onclick=FinEq('팝업/그늘막/스크린'); >팝업/그늘막/스크린</button>" +
    "<button class='selectequipment' onclick=FinEq('폴대/펙/스트링/스토퍼'); >폴대/펙/스트링/스토퍼</button>" ,'left'); 
}

function 침낭ㆍ매트(){
    return sendMessage("<button class='selectequipment' onclick=FinEq('침낭'); >침낭</button>" +
    "<button class='selectequipment' onclick=FinEq('자충/에어매트') >자충/에어매트</button>" +
    "<button class='selectequipment' onclick=FinEq('카페트/블랑켓/러그'); >카페트/블랑켓/러그</button>" +
    "<button class='selectequipment' onclick=FinEq('발포매트/폼매트/레저시트'); >발포매트/폼매트/레저시트</button>" +
    "<button class='selectequipment' onclick=FinEq('전기매트'); >전기매트</button>" +
    "<button class='selectequipment' onclick=FinEq('베개/방석/쿠션'); >베개/방석/쿠션</button>" ,'left'); 
}

function 퍼니처(){
    return sendMessage("<button class='selectequipment' onclick=FinEq('테이블'); >테이블</button>" +
    "<button class='selectequipment' onclick=FinEq('릴렉스체어') >릴렉스체어</button>" +
    "<button class='selectequipment' onclick=FinEq('미니/경량체어'); >미니/경량체어</button>" +
    "<button class='selectequipment' onclick=FinEq('야전침대'); >야전침대</button>" +
    "<button class='selectequipment' onclick=FinEq('해먹/스탠드'); >해먹/스탠드</button>",'left'); 
}

function 라이팅(){
    return sendMessage("<button class='selectequipment' onclick=FinEq('스토브'); >스토브</button>" +
    "<button class='selectequipment' onclick=FinEq('가스/오일랜턴') >가스/오일랜턴</button>" +
    "<button class='selectequipment' onclick=FinEq('LED랜턴/충전식랜턴'); >LED랜턴/충전식랜턴</button>" +
    "<button class='selectequipment' onclick=FinEq('헤드랜턴/후레쉬'); >헤드랜턴/후레쉬</button>" +
    "<button class='selectequipment' onclick=FinEq('릴선/연장선'); >릴선/연장선</button>" ,'left'); 
}

function 화로() {
    return sendMessage("<button class='selectequipment' onclick=FinEq('화로대');>화로대</button>" +
                        "<button class='selectequipment' onclick=FinEq('그릴/플레이트');>그릴/플레이트</button>" +
                        "<button class='selectequipment' onclick=FinEq('가스/연료/착화제');>가스/연료/착화제</button>" +
                        "<button class='selectequipment' onclick=FinEq('BBQ용품');>BBQ 용품</button>" +
                        "<button class='selectequipment' onclick=FinEq('토치/연료통');>토치/연료통</button>" +
                        "<button class='selectequipment' onclick=FinEq('기타용품');>기타용품</button>", 'left');
}

function 키친() {
    return sendMessage("<button class='selectequipment'onclick=FinEq('코펠/쿠커'); >코펠/쿠커</button>" +
                        "<button class='selectequipment' onclick=FinEq('냄비/팬/솥/더치오븐');>냄비/팬/솥/더치오븐</button>" +
                        "<button class='selectequipment' onclick=FinEq('식기/주전자');>식기/주전자</button>" +
                        "<button class='selectequipment' onclick=FinEq('수저/칼/도마/조리도구');>수저/칼/도마/조리도구</button>" +
                        "<button class='selectequipment' onclick=FinEq('컵/잔/시에라');>컵/잔/시에라</button>" +
                        "<button class='selectequipment' onclick=FinEq('양념통/수납통');>양념통/수납통</button>" +
                        "<button class='selectequipment' onclick=FinEq('식기건조/설거지용품/선반');>식기건조/설거지용품/선반</button>" +
                        "<button class='selectequipment' onclick=FinEq('쿨러/아이스박스/스탠드');>쿨러/아이스박스/스탠드</button>" +
                        "<button class='selectequipment' onclick=FinEq('보온보냉병/물통/워터저그');>보온보냉병/물통/워터저그</button>" +
                        "<button class='selectequipment' onclick=FinEq('키친소품');>키친소품</button>", 'left');
}

function 계절용품() {
    return sendMessage("<button class='selectequipment' onclick=FinEq('쿨러');>쿨러</button>" +
                        "<button class='selectequipment' onclick=FinEq('선풍기/서큘레이터');>선풍기/서큘레이터</button>" +
                        "<button class='selectequipment' onclick=FinEq('화목난로');>화목난로</button>" +
                        "<button class='selectequipment' onclick=FinEq('등유/가스난로');>등유/가스난로</button>" +
                        "<button class='selectequipment' onclick=FinEq('팬히터');>팬히터</button>" +
                        "<button class='selectequipment' onclick=FinEq('전기요/핫팩');>전기요/핫팩</button>"+
                        "<button class='selectequipment' onclick=FinEq('기타용품');>기타용품</button>", 'left');
}

function 스토리지() {
    return sendMessage("<button class='selectequipment' onclick=FinEq('수납박스/웨건');>수납박스/웨건</button>" +
                        "<button class='selectequipment' onclick=FinEq('대형수납케이스');>대형수납케이스</button>" +
                        "<button class='selectequipment' onclick=FinEq('소형수납케이스');>소형수납케이스</button>" +
                        "<button class='selectequipment' onclick=FinEq('대형가방(20L이상)');>대형가방(20L이상)</button>" +
                        "<button class='selectequipment' onclick=FinEq('소형가방(20L미만)');>소형가방(20L미만)</button>" +
                        "<button class='selectequipment' onclick=FinEq('기타용품');>기타용품</button>", 'left');
}

function RV용품(){
    return sendMessage("<button class='selectequipment' onclick=FinEq('트레일러'); >트레일러</button>" +
    "<button class='selectequipment' onclick=FinEq('루프탑텐트') >루프탑텐트</button>" +
    "<button class='selectequipment' onclick=FinEq('루프백/루프박스'); >루프백/루프박스</button>" +
    "<button class='selectequipment' onclick=FinEq('차량용에어매트'); >차량용에어매트</button>" ,'left'); 
}

function 악세서리(){
    return sendMessage("<button class='selectequipment' onclick=FinEq('해머/톱/삽/도끼'); >해머/톱/삽/도끼</button>" +
    "<button class='selectequipment' onclick=FinEq('나이프/TOOL') >나이프/TOOL</button>" +
    "<button class='selectequipment' onclick=FinEq('비너/열쇠고리'); >비너/열쇠고리</button>" +
    "<button class='selectequipment' onclick=FinEq('데코/장식용품'); >데코/장식용품</button>",'left'); 
}

function 등산용품(){
    return sendMessage("<button class='selectequipment' onclick=FinEq('샤워/청소/세탁용품'); >샤워/청소/세탁용품</button>" +
    "<button class='selectequipment' onclick=FinEq('영상/음향/캠핑도서') >영상/음향/캠핑도서</button>" ,'left'); 
}



let NUM=0;
function CheckNum(e){
    if(e.target.checked){
        if(NUM>=3){
            e.target.checked = false;
            return alert("원활한 검색결과를 찾기 위해, 테마는 3개까지 선택할 수 있습니다.");
        }
        NUM++;
    }else if(!e.target.checked) {
        NUM--;
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
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='노을' > <label for='노을'>#노을 뷰가 있는</label><br>" +
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='바다' > <label for='바다'>#바다가 보이는</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='반려동물' > <label for='반려동물'>#반려동물과 함께하는</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='별' > <label for='별'>#별이 잘 보이는</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='아이' > <label for='아이'>#아이들 놀기 좋은</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='물놀이' > <label for='물놀이'>#물놀이 하기 좋은</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='한적한' > <label for='한적한'>#조용하고 한적한</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='단풍'> <label for='단풍'>#단풍 보기 좋은</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='바베큐' > <label for='바베큐'>#바베큐하기 좋은</label><br>"+
                "<input type=checkbox name='chk' onchange='CheckNum(event);' id='구경'> <label for='구경'>#구경거리가 있는</label><br>"+
                "<button class='check' onclick='FinSelectTheme();'>선택완료</button>", 'left');
            
}

function selectNUM3() {
    selectedBUTTON = 3;
    sendMessage("텐트, 침낭 등 원하는 캠핑 용품을 입력해주세요",'left');
    장비선택();
    /* 원하는 장비 단어 입력 요청하기 -> 텍스트는 아래에서 처리*/
}



function setUserName(username) {
    let selectNUM;
    if (username != null && username.replace(" ", "" !== "")) {
        setTimeout(function () {
            return sendMessage("반가워요 " + username + "님! <br> 아래 세 가지 기능 중 원하시는 기능을 선택해주세요 <i class='fa-regular fa-face-smile'></i>", 'left');
        }, 1000);
        setTimeout(function () {
            return sendMessage("<div class='selectBtns'><button class='region' onclick='selectNUM1();'>1. 지역 기반 캠핑지 추천</button><br><button class='theme' onclick='selectNUM2();'>2. 테마 기반 캠핑지 추천</button><br><button class='equipment' onclick='selectNUM3();'>3. 캠핑 장비 추천</button></div>", 'left');
        }, 2000);

        return username;

    } else {
        setTimeout(function () {
            return sendMessage("올바른 닉네임을 이용해주세요.", 'left');
        }, 1000);

        return null;
    }
}

// 지역 기반 전용 request

function requestChat(messageText, url_pattern) {
    $.ajax({
        url: "http://127.0.0.1:8080/" + url_pattern + '/' + userName + '/' + messageText,
        type: "GET",
        dataType: "json",
        success: function (data) {
            state = data['state'];
            if (state === 'SUCCESS') {
                sendAnswer(data['answer'],'left');
                // return sendMessage(data['answer'], 'left');
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


// tag 기능 전용 reqeust 
function tagRequest(messageText , url_pattern) {

    $.ajax({
        url: "http://127.0.0.1:8080/" + url_pattern + '/' + userName + '/' + messageText,
        type: "GET",
        dataType: "json",
        success: function (data) {
            state = data['state'];
            if (state === 'SUCCESS') {
                setTimeout(function() {sendMessage(messageText+" 태그에 맞는 캠핑장을 알려드릴게요.", "left")}, 500);
                setTimeout(function() {tagAnswer(data['answer'],'left')}, 1000);
                // return sendMessage(data['answer'], 'left');
            }  
            else {
                return sendMessage('죄송합니다. 무슨말인지 잘 모르겠어요.', 'left');
            }
        },

        error: function (request, status, error) {
            console.log(error);

            return sendMessage('죄송합니다. 서버 연결에 실패했습니다.', 'left');
        }
    });

}

// 장비 전용 request 
function FinEq(text){    // obj 문자열로 바꾸고
    text= text.split('/');
    let choice = text[0];
    
    $.ajax({
        url: "http://127.0.0.1:8080/selection1/"+ userName + '/' + choice,   
        type: "GET",
        dataType: "json",
        success: function (data) {
            state = data['state'];

            if (state === 'SUCCESS') {
                // 장비 답변 받기
                return EquipAnswer(data['answer'], 'left');
            } 
            else if (state == 'NOT_FOUND') {
                return sendMessage(data['answer'],'left');
            }
            
            else {
                return sendMessage('죄송합니다. 무슨말인지 잘 모르겠어요.', 'left');
            }
        },

        error: function (request, status, error) {
            console.log(error);
            return sendMessage('죄송합니다. 서버 연결에 실패했습니다.', 'left');
        }
    });
}


// 장비 정보 메시지 호출
function EquipAnswer(data, message_side) {
    let $messages, message;
    $('.message_input').val('');
    $messages = $('.messages');
		// 기본 정보 답변 메시지 호출
    message = new equipResultMessage({
        text: data, // 3가지 캠핑장중 제일 첫번째 캠핑장 정보만 넘김
        message_side: message_side
    });
    setTimeout(function () {
        message.draw();
        $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 300);
    }, 1000);
    setTimeout(replyMessage, 2000);
}

// 태그 기반 검색 정보 메시지 호출

function tagAnswer(jsonArray, message_side){

     // jsonArray에는 3가지의 캠핑장 정보를 담고 있음.
     specific_data[btnNums] = jsonArray[0];
     let $messages, message;
     $('.message_input').val('');
     $messages = $('.messages');
         // 기본 정보 답변 메시지 호출
     message = new sendResultMessage({
         text: jsonArray[0], // 3가지 캠핑장중 제일 첫번째 캠핑장 정보만 넘김
         message_side: message_side
     });
     setTimeout(function () {
         message.draw();
         $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 300);
     }, 1500);
}



// 지역 기반 검색 정보 메시지 호출
function sendAnswer(jsonArray, message_side) {
    // jsonArray에는 3가지의 캠핑장 정보를 담고 있음.
    specific_data[btnNums] = jsonArray[0];
    let $messages, message;
    $('.message_input').val('');
    $messages = $('.messages');
		// 기본 정보 답변 메시지 호출
    message = new sendResultMessage({
        text: jsonArray[0], // 3가지 캠핑장중 제일 첫번째 캠핑장 정보만 넘김
        message_side: message_side
    });
    setTimeout(function () {
        message.draw();
        $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 300);
    }, 1000);

    
}

// 지역기반 상세정보 메시지 호출
function sendSpecificAnswer(data, message_side, idx) {
   
    let $messages, message;
    $('.message_input').val('');
    $messages = $('.messages');
    message = new sendSpecificMessage({
        data : specific_data[idx],
        message_side: message_side
    });
    message.draw();
    $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 300);
    setTimeout(replyMessage, 500);
   
}

/*

{"brand":"",
"category1":"스포츠/레저",
"category2":"캠핑",
"category3":"취사용품",
"image":"https://shopping-phinf.pstatic.net/main_8250644/82506445789.jpg",
"link":"https://search.shopping.naver.com/gate.nhn?id=82506445789",
"lprice":"25900",
"title":"쇳소리비장탄 통나무버너 <b>헬리녹스</b>이소가스 통나무<b>화로</b> 14KG"}
*/

// 장비 정보 메시지
function equipResultMessage(arg){
    data = arg.text;
    let title = '⚒️'+data.title+'⚒️';
    let image = data.image;
    let link = data.link;
    let lprice = data.lprice;
    let brand = data.brand;

    // make div.answer
    let answer_div = document.createElement('div');
    answer_div.classList.add('answer');
    // make title
    let p_name = document.createElement('p');
    p_name.innerHTML = title;
    // make image 150*150
    let img =  document.createElement('img');
    img.src = image;
    img.width = 150;
    img.height = 150;
    let link_container = document.createElement('p');
    let a_link = document.createElement('a');
    a_link.href = link;
    a_link.innerHTML = '해당 정보로 바로가기';
    link_container.append(a_link);
    
    let p_lprice = document.createElement('p');
    p_lprice.innerHTML = '가격 : '+ lprice;
    let p_brand = document.createElement('p');
    p_brand.innerHTML = '브랜드 : '+ brand;

    answer_div.append(p_name);
    answer_div.append(img);
    answer_div.append(link_container);
    answer_div.append(p_lprice);
    answer_div.append(p_brand);
    

    this.message_side = arg.message_side;

    // 메시지 출력 멤버 함수 정의
    this.draw = function (_this) {
        return function () {
            let messages =document.querySelector('.messages');
            // get message_template .message
            let message_template = document.querySelector('.message_template > .message');
            // copy .message
            let  message = message_template.cloneNode(true);
            // addClassName 
            message.classList.add(_this.message_side);
            // get div class='text_wrapper'
            let text_wrapper = message.querySelector('.text_wrapper');
            // get div class ='text'
            let text = text_wrapper.querySelector('.text');
            text.style.textAlign = 'center';
            text.append(answer_div);
            
            messages.appendChild(message);
           
            return setTimeout(function () {
                return message.classList.add('appeared');
            }, 0);
        };
    }(this);
    return this;

}

// 지역, 태그 기반 검색 정보 메시지
function sendResultMessage(arg) {
    // arg.text = {"facltNm":... , "lineIntro":... , ... }
    
    setTimeout(function() {sendMessage('상세보기를 원하시면 버튼을 눌러주세요.', 'left')}, 500);
    data = arg.text;
    let imgUrl = data.firstImageUrl.length > 0 ? data.firstImageUrl : './alt_image.jpg';
    let facltNm = '🏕️'+data.facltNm+'🏕️';
    // make div.answer
    let answer_div = document.createElement('div');
    answer_div.classList.add('answer');
    // make title
    let p_name = document.createElement('p');
    p_name.innerHTML = facltNm;
    // make image 150*150
    let img =  document.createElement('img');
    img.src = imgUrl;
    img.width = 150;
    img.height = 150;
    // make button 
    let btn = document.createElement('input');
    btn.type = 'button';
    btn.value = '상세보기';
    btn.style.marginTop = '10px';
    btn.id = 'btn'+btnNums;
    btn.idx = btnNums;
    // add eventListener  , 상세정보 메시지 출력 함수(sendSpecificAnswer) callback
    
    answer_div.append(p_name);
    answer_div.append(img);
    answer_div.append(btn);
    

    this.message_side = arg.message_side;

    // 메시지 출력 멤버 함수 정의
    this.draw = function (_this) {
        return function () {
            let messages =document.querySelector('.messages');
            // get message_template .message
            let message_template = document.querySelector('.message_template > .message');
            // copy .message
            let  message = message_template.cloneNode(true);
            // addClassName 
            message.classList.add(_this.message_side);
            // get div class='text_wrapper'
            let text_wrapper = message.querySelector('.text_wrapper');
            // get div class ='text'
            let text = text_wrapper.querySelector('.text');
            text.style.textAlign = 'center';
            text.append(answer_div);
            
            messages.appendChild(message);
            let btn = document.querySelector('#btn'+btnNums++);
            btn.addEventListener('click' , function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                sendSpecificAnswer(data, arg.message_side, btn.idx);
            })
            return setTimeout(function () {
                return message.classList.add('appeared');
            }, 0);
        };
    }(this);
    return this;
}

// 지역기반 상세 메시지 
function sendSpecificMessage(arg){
    let data = arg.data;

    let replaceEmptyData = '해당 정보는 제공할 수 없습니다.';
    let facltNm = (data.facltNm.length > 0) ? data.facltNm : replaceEmptyData;
    let homepage = (data.homepage.length>0)? data.homepage : replaceEmptyData;
    let animalCmgCl = (data.animalCmgCl.length>0)? data.animalCmgCl : replaceEmptyData;
    let lineIntro = (data.lineIntro.length>0)? data.lineIntro : replaceEmptyData;
    let posblFcltyCl = (data.posblFcltyCl.length>0)? data.posblFcltyCl : replaceEmptyData;
    let tel = (data.tel.length > 0) ? data.tel : replaceEmptyData;

    let specific_object = {
        '이름' :facltNm,
        '한줄소개': lineIntro,
        '전화' : tel,
        '장비대여' : posblFcltyCl,
        '홈페이지' : homepage,
        '애완동물 출입' : animalCmgCl,
        
    };

    let ul = document.createElement('ul');
    
    for(specific in specific_object){
       let li =  document.createElement('li');
       if(specific != '홈페이지'){
       let text = specific+" : "+ specific_object[specific];
       li.innerHTML = text;
       }
       else {
        li.append('홈페이지 : ');
        let a = document.createElement('a');
        if(homepage != replaceEmptyData)
            a.href = homepage;
        a.innerHTML = specific_object[specific];
        li.append(a);
       }
       ul.appendChild(li);

       
    }
    
    this.message_side = arg.message_side;
		// 메시지 출력 멤버 함수 정의
    this.draw = function (_this) {
        return function () {
            let messages =document.querySelector('.messages');
            // get message_template .message
            let message_template = document.querySelector('.message_template > .message');
            // copy .message
            let  message = message_template.cloneNode(true);
            // addClassName 
            message.classList.add(_this.message_side);
            // get div class='text_wrapper'
            let text_wrapper = message.querySelector('.text_wrapper');
            // get div class ='text'
            let text = text_wrapper.querySelector('.text');
           // append specific data unorderd list 
            text.append(ul);
            
            messages.appendChild(message);
            return setTimeout(function () {
                return message.classList.add('appeared');
            }, 0);
        };
    }(this);
    return this;
    
    // addr1
    // addr2
    // animalCmgCl
    // facltNm
    // firstImageUrl
    // homepage
    // lctCl
    // lineIntro
    // posblFcltyCl
    // tel
}






function replyMessage () {
    themeIndex = 0;
    NUM = 0;
    let chk_btn  = document.querySelectorAll('[name=chk]');
    for(chk of chk_btn){
        //chk.sele
    }
    setTimeout(function () {sendMessage('가져온 정보는 마음에 들었나요?','left')}, 500);
    setTimeout(function () {sendMessage('또 다른 기능을 원하시면 버튼을 클릭해 주세요','left')},1500);
    setTimeout(function () {
        return sendMessage("<div class='selectBtns'><button class='region' onclick='selectNUM1();'>1. 지역 기반 캠핑지 추천</button><br><button class='theme' onclick='selectNUM2();'>2. 테마 기반 캠핑지 추천</button><br><button class='equipment' onclick='selectNUM3();'>3. 캠핑 장비 추천</button></div>", 'left');
    }, 2500);
    
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


        } 
        // 아래는 지역기반(자연어처리)
        else if (state.includes('REQUIRE')) {
            return requestChat(messageText, 'fill_slot');
        } else {
            return requestChat(messageText, 'request_chat');
        }
    }
}