// EventEmiter를 사용하여 직접 정의한 객체가 이벤트를 갖도록 구현하기

/* (1) 모듈 가져오기 */
const events = require('events'); // EvenEmiter 모듈 참조
const util = require('util');     // Util 모듈 참조 --> 클래스의 상속을 제공

/* (2) 클래스를 만들기 위한 생성자 함수 정의하기 */
// -> new를 통해 호출되기 전까지 동작 안함
const Radio = function () {
    /** (5) 객체 생성됨 **/
    // (3)에서 클래스의 상속이 이루어 졌으므로 
    // 생성자에게 상위 클래스의 생성자를 호출하도록 지정. --> 상속구현
    events.EventEmiter.call(this);
};

/* (3) 클래스의 상속처리 --> util.inherits(자식클래스, 부모클래스) */
// --> (2)에서 정의한 Radio의 기능이 확장된다.
util.inherits(Radio, events.EventEmiter);

/* (4) 직접 정의한 클래스에 대한 객체를 생성 */
// --> 생성자 함수를 실행한다는 의미
// --> Radio 클래스의 모든 기능(상속받은 events.EventEmiter의 시능 포함)이 radio객체에게 부여된다.
const radio = new Radio();

/* (5) 이벤트 수 설정하기 */
/*------------------------------------------------------
 * emitter.setMaxListeners(n)
 * 해당 eventEmitter에 연결될 수 있는 이벤트 리스너의 수를 설정한다.
 * 기본값 10개
 *------------------------------------------------------*/
radio.serMaxListners(5);

/* (6) 이벤트 리스너에 이벤트 핸들러 연결하기 --> 이벤트 이름은 사용자가 직접 정의 */
/*------------------------------------------------------
|  emitter.on('eventname','listener function') 
|  emitter.addListener('eventname','listener function') 
|-------------------------------------------------------
|  "eventname"에 해당하는 이벤트에 대ㅐ서 
|  "listener function" 이름의 함수가 매번 호출 되도록 한다.
|  이벤트에 함수를 binding 할때는 하나의 이벤트에 여러 개의 listener를 연결 할 수 있으면,
|  최대 바인딩 개수는 디폴트 값은 10개이다.
--------------------------------------------------------*/
function onTurnOn(channel) {
    console.log('라디오가 켜졌습니다. 채널번호=' +channel);
}

radio.on('turnon', onTurnOn);

// 한 이벤트에 두 개 이상의 함수 설정 가능 --> 기본 최대 10개까지
radio.on('turnon', function(channel) {
    console.log('Hello Radio' + channel);
});

// on과 같은 기능 + 화살표 함수
radio.addListener('changechannel', channel => console.log('채널이 %d 번으로 변경되었습니다.', channel));

/* (7) 1회용 이벤트 */
/*------------------------------------------------------
|  emitter.once('eventname','listener function')
|       "eventname"에 해당하는 이벤트에 대해서
|       "listener function" 이름의 함수가 처음 한번만 호출 되도록 한다.
 *------------------------------------------------------*/
radio.once('turnoff', channel => console.log('라디오가 꺼졌습니다. 채널번호=' +channel));

/* (8) 이벤트 발생시키기 */
/*------------------------------------------------------
|  emitter.emit('eventname',[args])
|       "eventname"의 이벤트를 생성하고, 이벤트를 생성할 당시
|       [args]에 정의된 값 들을 이벤트와 함께 전달한다.
 *------------------------------------------------------*/
for (let i=0; i<2; i++) {
    console.group('%d번째 실행중...', (i+1));
    radio.emit('turnon', i);
    radio.emit('changechannel', i);
    // once로 이벤트가 정의되었으므로 한번만 실행된다.
    radio.emit('turnoff', i);
    console.debug();
    console.groupEnd();
}

/* (9) 이벤트 제거하기 */
/*------------------------------------------------------
|  emitter.removeListener('eventname','listener function')
|       "eventname"에 연결 되어 있는 "listener function"
|        이름의 함수와의 binding을 제거한다.
|        익명 함수 방식이 아닌, 별도로 이름을 갖는 함수를
|        정의해야만 한다.
 *------------------------------------------------------*/
radio.removeListener('turn', onTurnOn);
// 제거결과 확인하기
radio.emit('turn', 1000);
