/*--------------------------------------------------------
| 1) 모듈참조
----------------------------------------------------------*/
// 직접 구현한 모듈
const logger = require("../helper/LogHelper");
const util = require("../helper/UtilHelper");
// 내장모듈
const url = require("url");
const path = require("path");
// 설치가 필요한 모듈
const express = require("express"); // Express 본체
const useragent = require("express-useragent"); // 클라이언트의 정보를 조회할 수 있는 기능
const static = require("serve-static"); // 특정 폴더의 파일을 URL로 노출시킴
const favicon = require("serve-favicon"); // favicon 처리
const bodyParser = require("body-parser"); // POST 파라미터 처리
const methodOverride = require("method-override"); // PUT 파라미터 처리

/*--------------------------------------------------------
| 2) Express 객체 생성
----------------------------------------------------------*/
// 여기서 생성한 app 객체의 use() 함수를 사용해서
// 각종 외부 기능, 설정 내용, URL을 계속해서 확장하는 형태로 구현이 진행된다.
const app = express();

/*--------------------------------------------------------
| 3) 클라이언트의 접속시 초기화 -> 접속한 클라이언트의 정보를 파악
----------------------------------------------------------*/
/** app 객체에 UserAgent 모듈을 탑재 */
// --> Express객체(app)에 추가되는 확장 기능들을 Express에서는 미들웨어라고 부른다.
// --> 초기화 콜백함수에 전달되는 req, res객체를 확장하기 때문에
//     다른 모듈들보다 먼저 설정되어야 한다.
app.use(useragent.express());

// 클라리언트의 접속을 감지
app.use((req, res, next) => {
  logger.debug("클라이언트가 접속했습니다.");

  // 클라이언트가 접속한 시간
  const beginTime = Date.now();

  // 클라리언트의 IP주소
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // 클라이언트의 디바이스 정보 기록 (UserAgent 사용)
  logger.debug(
    "[client]" +
      ip +
      "/" +
      req.useragent.os +
      "/" +
      req.useragent.browser +
      "(" +
      req.useragent.version +
      ") /" +
      req.useragent.platform
  );

  // 클라이언트가 요청한 페이지 URL
  // 콜백함수에 전달되는 req 파라미터는 클라이언트가 요청한 URL의 각 부분을 변수로 담고 있다.
  const current_url = url.format({
    protocol: req.protocol, // ex) http://
    host: req.get("host"), // ex) 172.16.141.1
    port: req.port, // ex) 3000
    pathname: req.originalUrl, // ex) /page1.html
  });

  logger.debug("[" + req.method + "]" + decodeURIComponent(current_url));

  // 클라이어늩의 접속이 종료된 경우의 이벤트
  res.on("finish", () => {
    // 접속 종료시간
    const endTime = Date.now();

    // 이번 접속에서 클라이언트가 머문 시간 = 백엔드가 실행하는데 걸린 시간
    const time = endTime - beginTime;
    logger.debug(
      "클라이언트의 접속이 종료되었습니다. ::: [runtime]" + time + "ms"
    );
    logger.debug("----------------------------------------");
  });

  // 이 콜백함수를 종료하고 요청 URL에 연결된 기능으로 제어를 넘김
  next();
});

/*--------------------------------------------------------
| 4) Express 객체의 추가 설정
----------------------------------------------------------*/
/** POST 파라미터 수신 모듈 설정.
 *  추가 모듈들 중 UserAgent를 제외하고 가장 먼저 설정해야 함 */
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
// extended: true --> 지속적 사용
// extended: flase --> 한번만 사용
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text()); // TEXT 형식의 파라미터 수신 가능.
app.use(bodyParser.json()); // JSON 형식의 파라미터 수신 가능.

/** HTTP PUT, DELETE 전송방식 확장 */
// 브라우저 개발사들이 PUT, DELETE 방식으로 전송하는 HTTP Header 이름
app.use(methodOverride("X-HTTP-Method")); // Microsoft
app.use(methodOverride("X-HTTP-Method-Overrise")); // Google/GData
app.use(methodOverride("X-Method-Overrise")); // IBM
// HTML폼에서 PUT, DELETE로 전송할 경우 pot방식을 사용하되, action 주소에 '?_method' 라고 추가.
app.use(methodOverride("_method")); // HTML form

/** HTML,CSS,IMG,JS 등의 정적 파일을 URL에 노출시킬 폴더 연결 */
// "http://아이피:포트번호" 이후의 경로가 router에 등록되지 않은 경로리면
// static 모듈에 연결된 폴더 안에서 해당 경로를 탐색한다.
const public_path = path.join(__dirname, "../public");
app.use("/", static(public_path));

/** favicon 설정 */
app.use(favicon(public_path + "/favicon.png"));

/** 라우터(URL 분배기) 객체 설정 --> 맨 마지막에 설정 */
const router = express.Router();
// 라우터를 express에 등록
app.use("/", router);

/*--------------------------------------------------------
| 5) 각 URL별 백엔드 기능 정의
----------------------------------------------------------*/
// router.route('url경로').get|post|put|delete((req, res, next) => {});
router.route("/page1").get((req, res, next) => {
  /** 방법(1) - router 기능을 사용 (권장) */
  // 브라우저에게 전달할 응답 내용
  let html = "<h1>Page1</h1>";
  html += "<h2>Express로 구현한 Node.js 백엔드 페이지</h2>";

  // 브라우저에세 전달할 결과코드
  res.status(200);
  res.send(html);
});

router.route("/page2").get((req, res, next) => {
  /** 방법(2) - express 기능을 사용 */
  // 브라우저에게 전달할 응답 내용
  let html = "<h1>Page2</h1>";
  html += "<h2>Node.js Backend Page</h2>";

  res.writeHead(200);
  res.write(html);
  res.end();
});

router.route("/page3").get((req, res, next) => {
  // 페이지 강제 이동
  res.redirect("http://www.naver.com");
});

/** 02-GetParams */
/** Get 파라미터를 처리하기 위한 페이지 정의 */
router.route("/send_get").get((req, res, next) => {
  // GET파라미터들은 req.query 객체의 하위 데이터로 저장된다.
  for (key in req.query) {
    const str =
      "프론트엔드로부터 전달받은 변수 ::: " + key + "=" + req.query[key];
    logger.debug(str);
  }

  // /send_get?answer=0000 형태로 접근한 경우 answer파라미터 값 추출
  const answer = req.query.answer;
  let html = null;

  if (parseInt(answer) == 300) {
    html = "<h1 style=' color:#0066ff'>정답입니다</h1>";
  } else {
    html = "<h1 style=' color:#ff6600'>틀렸습니다</h1>";
  }

  res.status(200).send(html);
});

/** URL 파라미터를 처이하기 위한 라우터 등록 */
// http://<hostname>:<post>/페이지이름/변수1/변수2
router.route("/send_url/:username/:age").get((req, res, next) => {
  // URL 파라미터들은 req.params 객체의 하위 데이터로 저장된다.
  // 전달받은 URL 파라미터는 GET파라미터와 같은 방법으로 사용 가능함.
  for (key in req.params) {
    const str =
      "프론트엔트로부터 전달받은 변수 ::: " + key + "=" + req.params[key];
    logger.debug(str);
  }

  const html =
    "<h1><spna style='color:#0066ff'>" +
    req.params.username +
    "</spna>님은 <span style='color:#ff6600'>" +
    req.params.age +
    "</span>세 입니다.</h1>";

  res.status(200).send(html);
});

/** 03-Post,Put,Delete.js */
/** POST 파라미터를 처리하기 위한 라우터 등록 */
router.route("/send_post").post((req, res, next) => {
  // URL 파라미터들은 req.body 객체의 하위 데이터로 저장된다.
  for (key in req.body) {
    const str =
      "프론트엔드로부터 전달받은 변수 ::: " + key + "=" + req.body[key];
    logger.debug(str);
  }

  const html =
    "<h1><spna style='color:#0066ff'>" +
    req.body.username +
    "</spna>님의 이메일 주소는 <span style='color:#ff6600'>" +
    req.body.email +
    "</span> 입니다.</h1>";

  res.status(200).send(html);
});
/** PUT 파라미터를 처리하기 위한 라우터 등록 */
router.route("/send_put").put((req, res, next) => {
  // URL 파라미터들은 req.body 객체의 하위 데이터로 저장된다.
  for (key in req.body) {
    const str =
      "프론트엔드로부터 전달받은 변수 ::: " + key + "=" + req.body[key];
    logger.debug(str);
  }

  const html =
    "<h1><spna style='color:#0066ff'>" +
    req.body.username +
    "</spna>님은 <span style='color:#ff6600'>" +
    req.body.grade +
    "</span>학년 입니다.</h1>";

  res.status(200).send(html);
});

/** DELETE 파라미터를 처리하기 위한 라우터 등록 */
router.route("/send_delete").delete((req, res, next) => {
  // URL 파라미터들은 req.body 객체의 하위 데이터로 저장된다.
  for (key in req.body) {
    const str =
      "프론트엔드로부터 전달받은 변수 ::: " + key + "=" + req.body[key];
    logger.debug(str);
  }

  const html =
    "<h1><spna style='color:#0066ff'>" +
    req.body.username +
    "</spna>님은 <span style='color:#ff6600'>" +
    req.body.point +
    "</span>점 입니다.</h1>";

  res.status(200).send(html);
});

/** 상품에 대한 Restful API 정의하기 */
// 위의 형태처럼 개별적인 함수로 구현 가능하지만 대부분 하나의 URL에 메서드 체인을 사용해서 4가지 전송방식을 한번에 구현
router
  .route("/product")
  .get((req, res, next) => {
    // URL Params 형식으로 조회할 상품의 일련번호를 전달받아야 한다.
    const html =
      "<h1><spna style='color:#0066ff'>" +
      req.query.productNumber +
      "</spna> 번 상품 <span style='color:#ff6600'>조회</span>하기</h1>";
    res.status(200).send(html);
  })
  .post((req, res, next) => {
    // <form> 상에 저장할 상품 정보를 입력 후 전송한다.(주로 관리자 기능)
    // 저장시에는 일련번호는 전송하지 않으며 저장후 자동으로 발급되는 일련번호를 프론트에게 돌려줘야 한다.
    const html =
      "<h1><spna style='color:#0066ff'>" +
      req.body.productNumber +
      "</spna> 상품 <span style='color:#ff6600'> 등록 </span>하기</h1>";
    res.status(200).send(html);
  })
  .put((req, res, next) => {
    // <form> 상에 수정 상품 정보를 입력 후 전송한다.(주로 관리자 기능)
    // 몇번 상품을 수정할지 식별하기 위해 상품 일련번호가 함께 전송된다.
    const html =
      "<h1><spna style='color:#0066ff'>" +
      req.body.productNumber +
      "</spna> 상품 <span style='color:#ff6600'> 수정 </span>하기</h1>";
    res.status(200).send(html);
  })
  .delete((req, res, next) => {
    // 삭제할 상품의 일련번호 전송
    const html =
      "<h1><spna style='color:#0066ff'>" +
      req.body.productNumber +
      "</spna> 상품 <span style='color:#ff6600'> 삭제 </span>하기</h1>";
    res.status(200).send(html);
  });
/*--------------------------------------------------------
| 6) 설정한 내용을 기반으로 서버 구동 시작
----------------------------------------------------------*/
// 백엔드를 가동하고 3000번 포트에서 대기
const port = 3000;
const ip = util.myip();

app.listen(port, () => {
  logger.debug("-----------------------------------");
  logger.debug("|       Start Express Server       |");
  logger.debug("-----------------------------------");

  ip.forEach((v, i) => {
    logger.debug("server address => http://" + v + ":" + port);
  });

  logger.debug("-----------------------------------");
});
