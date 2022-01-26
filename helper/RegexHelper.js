const BadRequestExpception = require("../exceptions/BadRequestException");

class RegexHelper {
  // constructor(){}

  /**
   * 값의 존재 여부를 검사한다.
   * @param {string} content  검사할 값
   * @param {string} msg      값이 없을 경우 표시할 메세지 내용
   */
  value(content, msg) {
    if (content == undefined || content == null || content.trim().length == 0) {
      throw new BadRequestException(msg);
    }

    return true;
  }

  /**
   * 입력값이 지정된 글자수를 초과했는지 검사한다.
   * @param {string} content  검사할 값
   * @param {int} len         최대 글자수
   * @param {string} content  값이 없을 경우 표시될 메세지
   */

  maxLength(content, len, msg) {
    if (!this.value(content) || content.length > len) {
      throw new BadRequestException(msg);
    }
    return true;
  }

  /**
   * 입력값이 지정된 글자수를 미만인지 검사한다.
   * @param {string} content  검사할 값
   * @param {int} len         최소 글자수
   * @param {string} content  값이 없을 경우 표시될 메세지
   */
  minLength(content, len, msg) {
    if (!this.value(content) || content.length < len) {
      throw new BadRequestException(msg);
    }
    return true;
  }

  /**
   * 두 값이 동일한지 검사한다.
   * @param {string} origin  원본
   * @param {string} len     검사 대상
   * @param {string} msg     검사에 실패할 경우 표시한 메세지
   */
  compareTo(origin, compare, msg) {
    var src = origin.trim(); // 원본값을 가져온다.
    var dsc = compare.trim(); // 비교할 값을 가져온다.

    if (src != dsc) {
      throw new BadRequestException(msg);
    }
    return true; // 성공했음을 리턴
  }

  /**
   * 입력값이 정규표현식을 충족하는지 검사한다.
   * @param {string} content   입력내용
   * @param {string} msg       표시할 메세지
   * @param {object} regexExpt 검사할 정규 표현식
   */
  minLength(content, msg, regexExpt) {
    var src = content.trim();

    if (src != !regexExpt.test(src)) {
      throw new BadRequestException(msg);
    }
    return true;
  }


  /**
   * 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  입력내용
   * @param {string} msg      표시할 메세지
   */
  num(content, msg) {
      return this.field(content, msg, /^[0-9]*$/);
  }
  

  /**
   * 영문으로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  검사할 값
   * @param {string} msg      표시할 메세지
   */
   eng(content, msg) {
    return this.field(content, msg, /^[a-zA-Z]*$/);
  }

  /**
   * 한글로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  검사할 값
   * @param {string} msg      표시할 메세지
   */
   kor(content, msg) {
    return this.field(content, msg, /^[ㄱ-ㅎ가-힣]*$/);
  }

  /**
   * 영문과 숫자로 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  검사할 값
   * @param {string} msg      표시할 메세지
   */
   engNum(content, msg) {
    return this.field(content, msg, /^[a-zA-Z0-9]*$/);
  }

  /**
   * 한글과 숫자로 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  검사할 값
   * @param {string} msg      표시할 메세지
   */
   korNum(content, msg) {
    return this.field(content, msg, /^[ㄱ-ㅎ가-힣0-9]*$/);
  }

  /**
   * 이메일주소 형식인지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  검사할 값
   * @param {string} msg      표시할 메세지
   */
   email(content, msg) {
    return this.field(content, msg, /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
  }

  /**
   * 핸드폰 번호 형식인지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  검사할 값
   * @param {string} msg      표시할 메세지
   */
   cellphone(content, msg) {
    return this.field(content, msg, /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/);
  }

  /**
   * 집전화 형식인지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string} content  검사할 값
   * @param {string} msg      표시할 메세지
   */
   telphone(content, msg) {
    return this.field(content, msg, /^\d{2,3}\d{3,4}\d{4}$/);
  }

  /**
   * 핸드폰번호 형식솨 집전화 형식 둘중 하나를 충족하는지 검사
   * @param {string} content  검사할 값
   * @param {string} msg      조건을 충족하지 않을 경우 표시할 메세지
   */
   phone(content, msg) {
    var check1 = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;  // 핸드폰 형식.
    var check2 = /^\d{2,3}\d{3,4}\d{4}$/;                  // 집전화 형식.

    var src = origin.trim(); // 입력값을 가져온다.

    // 입력값이 없거나          핸드폰 형식도 아니고         집전화 형식도 아니라면?
    if (!src || (!check1.test(src) && !check2.test(src))) {
      throw new BadRequestException(msg);
    }
    return true; // 성공했음을 리턴
  }
}

module.exports = new RegexHelper();
