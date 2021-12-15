var fs = require('fs');             
var target = './output_sync.txt';   // 읽어들일 파일의 경로

if (fs.existsSync(target)) {
    // 파일을 비동기식으로 파일 읽기
    // 파일을 다 읽을 때까지 대기하지 않고 프로그래은 다음으로 진행.
    // --> 파일 읽기가 종료되면 세번째 파라미터인 콜백함수가 호출된다.
    fs.readFile(target, 'utf8', (err, data) => {
        if (err) {
            console.err(err);
            return;
        }
        console.debug(data); // 읽어 들인 데이터 출력
    });
    console.debug(target + ' 파일을 읽도록 요청했습니다.');
} else {
    console.debug(target + ' 파일이 존재하지 않습니다.');
}