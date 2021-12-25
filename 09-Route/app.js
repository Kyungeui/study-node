/*--------------------------------------------------------
| 1) 모듈참조
----------------------------------------------------------*/
// 직접 구현한 모듈
const logger = require("../helper/LogHelper");
const util = require("../helper/UtilHelper");
const fileHelper = require("../helper/FileHelper");
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
const cookieParser = require("cookie-parser"); // Cookie 처리
const expressSession = require("express-session"); // Session 처리
const multer = require("multer"); // 업로드 모듈
const nodemailer = require("nodemailer"); // 메일발송 --> app.use()로 추가설정 필요 없음.
const thumbnail = require("node-thumbnail").thumb; // 썸네일 이미지 생성 모듈


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
const upload_path = path.join(__dirname, "../_files/upload");
app.use("/", static(public_path));
// -> upload 폴더의 웹  상의 위치 : http://아이피:포트번호/upload
app.use("/upload", static(upload_path));

/** favicon 설정 */
app.use(favicon(public_path + "/favicon.png"));

/** 라우터(URL 분배기) 객체 설정 --> 맨 마지막에 설정 */
const router = express.Router();
// 라우터를 express에 등록
app.use("/", router);

/** multer 객체 속성 --> 파일 제한 : 5개, 20M */
const multipart = multer({
  storage: multer.diskStorage({
    /** 업로드 된 파일이 저장될 디렉토리 설정 */
    // req는 요청정보 , file은 최종적으로 업로드된 결과 데이터가 저장되어 있을 객체
    destination: (req, file, callback) => {
      // 폴더 생성
      fileHelper.mkdirs(upload_path);
      console.debug(file);

      // 업로드 정보에 백엔드의 업로드 파일 저장 폴더 위치를 추가한다.
      file.dir = upload_path.replace(/\\/gi, "/");

      //  multer 객체에게 업로드 경로를 전달
      callback(null, upload_path);
    },
    /** 업로드 된 파일이 저장될 파일명 설정 */
    // file.originalname 변수에 파일이름이 저장되어 있다. -> ex) helloworld.png
    filename: (req, file, callback) => {
      // 파일의 확장자만 추출 --> .png
      const extName = path.extname(file.originalname);
      // 파일이 저장될 이름 (현재 시각)
      const saveName = new Date().getTime().toString() + extName.toLowerCase();
      // 업로드 정보에 백엔드의 파일 이름을 추가한다.
      file.savename = saveName;
      // 업로드 정보 파일에 접근할 수 있는 URL값 추가
      file.url = path.join("/upload", saveName).replace(/\\/gi, "/");
      // 구성된 정보를 req 객체에게 추가
      if (req.file instanceof Array) {
        req.file.push(file);
      } else {
        req.file = file;
      }
      callback(null, saveName);
    },
  }),
  /** 요량, 최대 업로드 파일 수 제한 설정 */
  limits: {
    files: 5,
    fileSize: 1024 * 1024 * 20,
  },
  /** 업로드 될 파일의 확장자 제한 */
  fileFilter: (req, file, callback) => {
    // 파일의 종류 얻기
    var mimetype = file.mimetype;

    // 파일 종류 문자열에 "image/"가 포함되어 있지 않은 경우
    if (mimetype.indexOf("image/") == -1) {
      const err = new Error();
      err.result_code = 500;
      err.result_msg = "이미지 파일만 업로드 가능합니다.";
      return callback(err);
    }
    callback(null, true);
  },
});

/** 쿠키를 처리할 수 있는 객체 연결 */
// cookie-parser는 데이터를 저장,조회 할 때 암호화 처리를 동반한다.
// 이 때 암호화에 사용되는 key문자열을 개발자가 정해야 한다.
const cookie_encrypt_key = "helloworld";
app.use(cookieParser(cookie_encrypt_key));

/** 세션 설정 */
app.use(
  expressSession({
    // 암호화 키
    secret: cookie_encrypt_key,
    // 세션을 쿠키 상태로 클라이언트에게 노출시킬지 여부
    resave: false,
    // 세션이 저장되기 전에 기존의 세션을 초기화 상태로 만들지 여부
    saveUninitialized: false,
  })
);

/*--------------------------------------------------------
| 5) 각 URL별 백엔드 기능 정의
----------------------------------------------------------*/
app.use(require('./routes/Setup'));
app.use(require('./routes/Params'));
app.use(require('./routes/Cookie'));
app.use(require('./routes/Session'));
app.use(require('./routes/FileUpload'));
app.use(require('./routes/SendMail'));

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
