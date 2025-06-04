const check_xss = (input) => {
  // DOMPurify 라이브러리 로드 (CDN사용)
  const DOMPurify = window.DOMPurify;

  // 입력값을 정화하여 XSS 공격을 방지
  const sanitizedInput = DOMPurify.sanitize(input);

  // Sanitized된 값과 원본 입력값 비교
  if (sanitizedInput !== input) {
    // XSS 공격 가능성이 있는 입력값 발견시 에러 처리
    alert('입력값에 XSS 공격이 감지되었습니다. 올바른 값을 입력해주세요.');
    return false;
  }

  // Sanitized된 값 반환
  return sanitizedInput;
};

const check_input = () => {
  const loginForm = document.getElementById('login_form');
  const loginBtn = document.getElementById('login_btn');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  const sanitizedPassword = check_xss(passwordValue);
  // check_xss 함수로 비밀번호 const Sanitize
  const sanitizedEmail = check_xss(emailValue);
  // check_xss 함수로 이메일 Sanitize

  if (!sanitizedEmail) {
    // Sanitize된 이메일 사용
    return false;
  }

  if (!sanitizedPassword) {
    // Sanitize된 비밀번호 사용
    return false;
  }

  // const c = '아이디, 패스워드를 체크합니다';
  // alert(c);

  // if (emailValue === '') {
  //   alert('이메일을 입력하세요.');
  //   return false;
  // }

  // if (passwordValue === '') {
  //   alert('비밀번호를 입력하세요.');
  //   return false;
  // }

  if (emailValue.length > 10) {
    alert('아이디는 최대 10글자 이내로 입력해야 합니다.');
    return false;
  }

  if (passwordValue.length > 15) {
    alert('비밀번호는 최대 15글자 이내로 입력해야 합니다.');
    return false;
  }

  // 3글자 이상 반복 입력 제한 (예: aaa, bbb, 111 등)
  const repeatPattern = /(.)\1\1+/;
  if (repeatPattern.test(emailValue) || repeatPattern.test(passwordValue)) {
    alert('동일한 문자를 3글자 이상 반복할 수 없습니다.');
    return false;
  }

  // 연속되는 숫자 2개 이상 반복 제한 (예: 1212, 3434 등)
  const consecutiveNumberPattern = /(\d{2,})\1+/;
  if (
    consecutiveNumberPattern.test(emailValue) ||
    consecutiveNumberPattern.test(passwordValue)
  ) {
    alert('연속되는 숫자 패턴이 2번 이상 반복될 수 없습니다.');
    return false;
  }

  const hasSpecialChar =
    passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
  if (!hasSpecialChar) {
    alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
    return false;
  }

  const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
  const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
  if (!hasUpperCase || !hasLowerCase) {
    alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
    return false;
  }

  console.log('이메일:', emailValue);
  console.log('비밀번호:', passwordValue);

  loginForm.submit();
};

document.getElementById('login_btn').addEventListener('click', check_input);
