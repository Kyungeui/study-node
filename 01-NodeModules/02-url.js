/** (1) url모듈 참조하기 */
const url = require('url');

/** (2) 주소 문자열을 URL 객체로 만들기 */
const myurl = 'http://www.itpaper.co.kr:8765/hello/world.html?a=123&b=456#home';

// URL의 각 성분을 분해 --> javascript의 location객체와 동일한 기능
const location = url.parse(myurl);

console.group('URL 성분 정보 확인');
console.debug(location);
console.debug('href: ' + location.href);
console.debug('protocol: ' + location.protocol);  // 통신방식 (http:, https:)
console.debug('port: ' + location.port);          // 포트번호
console.debug('host: ' + location.host);          // 사이트 주소
console.debug('hostname: ' + location.hostname);  // 사이트 주소에서 포트번호를 제외한 값
console.debug('path: ' + location.path);          // 사이트 주소 이후의 값 (#부분은 제외)
console.debug('pathname: ' + location.pathname);  // 사이트 주소에서 변수 영역 제외한 값
console.debug('search: ' + location.search);      // "?"를 포함한 변수 영역
console.debug('query: ' + location.query);        // search에서 "?"를 제외
console.debug('hash: ' + location.hash);          // "#"과 함께 표시되는 마지막 값
console.groupEnd();

/** (3) JSON객체를 주소 문자열로 만들기 */
// 불필요한 정보를 제외할 수 있다.
const info = {
    protocol: 'http:',
    hostname: 'www.itpaper.co.kr',
    port: '8080',
    pathname: '/hello/world.html',
    search: '?name=노드JS&age=10',
    hash: '#target'
}
const urlString = url.format(info);
console.group("URL성분을 결합");
console.debug(urlString);
console.groupEnd();