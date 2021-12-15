var fs = require('fs');             
var target = './output_await.txt';   // 읽어들일 파일의 경로

if (fs.existsSync(target)) {
    (async () => {
        try {
            // 성공시에 아무런 결과도 반환하지 않으므로 리턴받지 않음.
            data= await fs.promises.readFile(target, 'utf8');
            console.debug("파일읽기 완료");
        } catch (err) {
            console.error(err);
            console.error('파일읽기 실패');
        }

        console,debug(data);
    })();
        console.log(target + ' 파일을 읽도록 요청했습니다.'); 
} else {
    console.log(target + ' 파일이 존재하지 않습니다.');
}