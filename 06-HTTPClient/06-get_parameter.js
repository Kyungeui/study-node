const axios = require('axios');

(async () => {
    let json = null;
    try {
      // axios를 활용하여 다른 백엔드에게 HTTP GET 파라미터를 전달하고 결과를 리턴받는다.
      const response = await axios.get("http://itpaper.co.kr/data/get.php", {
          parmas: {
              num1: 200,
              num2: 800
          }
      });

      result = response.data;
    } catch (error) {
      const errorMsg = "[" + error.response.status + "]" + error.response.statusText
      console.error(errorMsg);
      return;
    }

    console.log("다른 백엔드로부터 응답받은 결과값: " + result);
  })();