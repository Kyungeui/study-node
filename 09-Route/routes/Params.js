module.exports = (app) => {
  const router = require("express").Router();
  const logger = require("../../helper/LogHelper");

  // 1) router.route("url경로").get|post|put|delete((req,res)) => {});
  // 2) router.get|post|put|delete("url경로", (req,res) => {});
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

  return router;
};
