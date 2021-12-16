// 모든 노드 프로젝트마다 다음을 우선 수헹 헤애 한다.
// 1) /helper/_config.js 파일을 통해 로그의 수준과 저장 경로를 지정
// 2) (필요하다면) /helper/log_helper.js 에서 로그의 출력 형식이나 저장 파일 이름 형식을 수정
// 3) 모든 노드 js 파일에서 log_helper를 require
// 4) 브라우저용 js에서 console.log를 사용하듯 노드에서 logger.debug를 사용
// --> 웹 브라우저의 콘솔 대신 지정된 파일에 출력내용들이 기록된다.
// --> 이 내용을 확인하려 백엔드의 실행 과정을 가늠할 수 있다.

const logger = require('../helper/LogHelper(날짜기호주의)');

logger.error('error 메세지 입니다.');
logger.warn('warn 메세지 입니다.');
logger.info('info 메세지 입니다.');
logger.debug('debug 메세지 입니다.');
logger.verbose('verbose 메세지 입니다.');
console.log("Hello World")