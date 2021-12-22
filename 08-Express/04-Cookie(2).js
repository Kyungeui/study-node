/*--------------------------------------------------------
| 4) Express 객체의 추가 설정
----------------------------------------------------------*/
/** HTML,CSS,IMG,JS 등의 정적 파일을 URL에 노출시킬 폴더 연결 */
// "http://아이피:포트번호" 이후의 경로가 router에 등록되지 않은 경로리면

const cookieParser = require("cookie-parser");

// static 모듈에 연결된 폴더 안에서 해당 경로를 탐색한다.
const public_path = path.join(__dirname, '../public');
app.use("/", static(public_path));

/** favicon 설정 */
app.use(favicon(public_path + '/favicon.png'));

/** 라우터(URL 분배기) 객체 설정 --> 맨 마지막에 설정 */
const router = express.Router();
// 라우터를 express에 등록
app.use('/', router);

/*--------------------------------------------------------
| 4) 2 Express 객체의 추가 설정
----------------------------------------------------------*/
/** POST 파라미터 수신 모듈 설정.
 *  추가 모듈들 중 UserAgent를 제외하고 가장 먼저 설정해야 함 */
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
// extended: true --> 지속적 사용
// extended: flase --> 한번만 사용
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());     // TEXT 형식의 파라미터 수신 가능.
app.use(bodyParser.json());     // JSON 형식의 파라미터 수신 가능.

/** HTTP PUT, DELETE 전송방식 확장 */
// 브라우저 개발사들이 PUT, DELETE 방식으로 전송하는 HTTP Header 이름
app.use(methodOverride('X-HTTP-Method'));            // Microsoft
app.use(methodOverride('X-HTTP-Method-Overrise'));   // Google/GData
app.use(methodOverride('X-Method-Overrise'));        // IBM
// HTML폼에서 PUT, DELETE로 전송할 경우 pot방식을 사용하되, action 주소에 '?_method' 라고 추가.
app.use(methodOverride('_method'));                  // HTML form

const cookie_encrypt_key = 'helloworld';
app.use(cookieParser(cookie_encrypt_key));