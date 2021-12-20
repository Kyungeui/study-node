/** 모듈참조 */
const logger = require('../helper/LogHelper')
const util = require('../helper/UtilHelper');
const http = require('http');

/** 웹 서버 구동 */
const port = 3216; // 포트번호 설정
const ip = util.myip();
const server = http.createServer(); // 웹 서버 객체 만들기

/** 포트번호에 대해 리스닝 시작 */
// listen을 시작하면 호출될 콜백함수 지정.
// listen을 시작 --> backend(server)가 가동을 시작했다는 의미.
server.listen(port, () => {
    logger.debug(port + '번 포트에서 백엔드가 구동되었습니다.');
    logger.debug('------------------------');

    // 나(백엔드)에게 접속할 수 있는 주소를 출력함.
    ip.forEach((v, i) => {
        logger.debug('http://' + v + ':' + port);
    });
});

//** 프론트엔드가 접속했을 때 발생하는 이벤트 */
server.on('connection', (socket) => {
    //콜백함수에 전달되는 socket 객체를 사용하여 접속한 클라이언트의 정보를 파악한다.
    logger.debug('프론트엔드가 접속했습니다. :' + socket.remoteAddress + ',' + socket.remotePort);
});

/** connection이벤트  */