/** (1) 모듈참조 */
// React에서는 import 구문으로 변경됨(참고)
// 참조 가능한 모듈은 내 컴퓨터에 설치된 Node.js 기본모듈, npm명령으로 설피한 오픈소스 모듈, 내가 작성한 코드
// 직접 작성한 코드를 참조할 경우 "./", "../" 등을 반드시 적용해야함.
// 모듈 이름 앞에 "./" 등의 경로 표시가 없는 경우 기본모듈 혹은 npm명령으로 설치한 모듈로 인식하고,
// 모듈 저장소를 탐색함. --> 사용자 홈디렉토리/node_modules, 프로젝트위치/node_modules
const path = require('path');


/** (2) 경로 합치기 */
// 파라미터의 제한이 없다.
// 조합된 경로 문자열에 해당하는 Path가 실제로 존재하는지는 상관없다.
const currentPath = path.join('C:/Users?hello?world', 'myphoto', '../photo.jpg');
console.group("path.join");
console.debug(currentPath);
console.groupEnd();

/** (3) 경로에서 디렉토리, 파일명, 확장자 구분하기 */
const dirname = path.dirname(currentPath);
const basename = path.basename(currentPath);
const extname = path.extname(currentPath);
console.group('경로 분하하기');
console.debug('디렉토리 : %s', dirname);
console.debug('파일이름 : %s', basename);
console.debug('확장자 : %s', extname);
console.groupEnd();

/** (4) 경로정보 파싱 */
// 경로의 성분을 JSON형태로 한번에 분할
const parse = path.parse(currentPath);
console.group('경로정보 파싱');
console.debug('%o', parse);
console.debug('root', + parse.root);
console.debug('dir', + parse.dir);
console.debug('name', + parse.name);
console.debug('ext', + parse.ext);
console.groupEnd();
