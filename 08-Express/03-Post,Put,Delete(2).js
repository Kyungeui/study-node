/*--------------------------------------------------------
| 4) Express 객체의 추가 설정
----------------------------------------------------------*/
/** POST 파라미터 수신 모듈 설정.
 *  추가 모듈들 중 UserAgent를 제외하고 가장 먼저 설정해야 함 */
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
// extended: true --> 지속적 사용

const methodOverride = require("method-override");

// extended: flase --> 한번만 사용
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());     // TEXT 형식의 파라미터 수신 가능.
app.use(bodyParser.json());     // JSON 형식의 파라미터 수신 가능.

/** HTTP PUT, DELETE 전송방식 확장 */
// 브라우저 개발사들이 PUT, DELETE 방식으로 전송하는 HTTP Header 이름
app.use(methodOverride('X-HTTP-Method'));            // Microsoft
app.use(methodOverride('X-HTTP-Method-Overrise'));   // Google/GData
app.use(methodOverride('X-Method-Overrise'));        // IBM

app.use(methodOverride('X-HTTP-Method'));   // Microsoft