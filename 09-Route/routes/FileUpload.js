module.exports = (app) => {
  const router = require("express").Router();

  // 1) router.route("url경로").get|post|put|delete((req,res)) => {});
  // 2) router.get|post|put|delete("url경로", (req,res) => {});
  router.route("/upload/simple").post((req, res, next) => {
    // name 속성값이 myphto인 경우, 업로드를 수행
    const upload = multipart.single("myphoto");

    upload(req, res, async (err) => {
      let result_code = 200;
      let result_msg = "ok";

      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case "LIMIT_FILE_COUNT":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 수를 초과했습니다.";
              break;
            case "LIMIT_FILE_SIZE":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 용량을 초과했습니다.";
              break;
            default:
              err.result_code = 500;
              err.result_msg = "알 수 없는 에러가 발생했습니다.";
              break;
          }
        }
        logger.error(err);
        result_code = err.result_code;
        result_msg = err.result_msg;
      }

      /** 업로드 결과에 이상이 없다면 썸네일 이미지 생성 */
      const thumb_size_list = [480, 750, 1080];

      // 원하는 썸네일 사이즈만큼 반복처리
      for (let i = 0; i < thumb_size_list.length; i++) {
        const v = thumb_size_list[i];

        // 생성될 썸네일 파일의 옵션과 파일이름을 생성
        const thumb_options = {
          source: req.file.path, // 썸네일을 생성할 원본 경로
          destination: thumb_path, // 썸네일이 생성될 경로
          width: v, // 썸네일의 크기(기본값 800)
          prefix: "thumb_",
          suffix: "_" + v + "w",
          override: true,
        };

        // 생성될 썸네일 파일의 이름을 예상
        const basename = req.file.savename;
        const filename = basename.substring(0, basename.lastIndexOf("."));
        const thumbname =
          thumb_options.prefix +
          filename +
          thumb_options.suffix +
          path.extname(basename);

        // 썸네일 정보를 width를 key로 갖는 json 형태로 후가하기 위해 key 이름 생성
        const key = v + "w";

        // 프론트엔드에게 전송될 정보에 'thumbnail'이라는 프로퍼티가 없다면 빈 json 형태로 생성
        if (!req.file.hasOwnProperty("thumbnail")) {
          req.file.thumbnail = {};
        }

        req.file.thumbnail[key] = "/thumb/" + thumbname;

        try {
          await thumbnail(thumb_options);
        } catch (error) {
          console.log(error);
        }
      }

      const result = {
        rt: result_code,
        rtmsg: result_msg,
        item: req.file,
      };

      res.status(result_code).send(result);
    });
  });

  router.route("/upload/multiple").post((req, res, next) => {
    // 요청정보 안에 업로드 된 정보를 저장할 빈 배열을 준비
    req.file = [];

    // name 속성값이 myphto이고 multiple 속성이 부여된 다중 업로드를 처리
    const upload = multipart.array("myphoto");

    upload(req, res, (err) => {
      let result_code = 200;
      let result_msg = "ok";

      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case "LIMIT_FIELD_COUNT":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 수를 초과했습니다.";
              break;
            case "LIMIT_FIELD_SIZE":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 용량을 초과했습니다.";
              break;
            default:
              err.result_code = 500;
              err.result_msg = "알 수 없는 에러가 발생했습니다.";
              break;
          }
        }
        logger.error(err);
        result_code = err.result_code;
        result_msg = err.result_msg;
      }

      /** 업로드 결과에 이상이 없다면 썸네일 이미지 생성 */
      const thumb_size_list = [640, 750, 1020];

      // 원하는 썸네일 사이즈만큼 반복처리
      req.file.map((v, i) => {
        // 원하는 썸네일 사이즈만큼 반복처리
        thumb_size_list.map(async (w, j) => {
          // 생성될 썸네일 파일의 옵션과 파일이름을 생성
          const thumb_options = {
            source: v.path, // 썸네일을 생성할 원본 경로
            destination: thumb_path, // 썸네일이 생성될 경로
            width: w, // 썸네일의 크기(기본값 800)
            prefix: "thumb_",
            suffix: "_" + w + "w",
            override: true,
          };

          // 생성될 썸네일 파일의 이름을 예상
          const basename = v.savename;
          const filename = basename.substring(0, basename.lastIndexOf("."));
          const thumbname =
            thumb_options.prefix +
            filename +
            thumb_options.suffix +
            path.extname(basename);

          // 썸네일 정보를 width를 key로 갖는 json 형태로 후가하기 위해 key 이름 생성
          const key = w + "w";

          // 프론트엔드에게 전송될 정보에 'thumbnail'이라는 프로퍼티가 없다면 빈 json 형태로 생성
          if (!v.hasOwnProperty("thumbnail")) {
            v.thumbnail = {};
          }

          v.thumbnail[key] = "/thumb/" + thumbname;

          try {
            await thumbnail(thumb_options);
          } catch (error) {
            console.log(error);
          }
        });
      });
      const result = {
        rt: result_code,
        rtmsg: result_msg,
        item: req.file,
      };

      res.status(result_code).send(result);
    });
  });

  return router;
};
