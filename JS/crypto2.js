// AES-256-GCM 암호화 함수
async function encryptAESGCM(plainText, password) {
  const enc = new TextEncoder();
  const pwUtf8 = enc.encode(password);
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96비트 IV
  const alg = { name: 'AES-GCM', iv: iv };

  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'encrypt',
  ]);

  const plainBuffer = enc.encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt(alg, key, plainBuffer);

  // IV + 암호문을 base64로 합쳐서 반환
  const ivStr = btoa(String.fromCharCode(...iv));
  const cipherStr = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)));
  return ivStr + ':' + cipherStr;
}

// AES-256-GCM 복호화 함수
async function decryptAESGCM(cipherText, password) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const [ivStr, cipherStr] = cipherText.split(':');
  const iv = Uint8Array.from(atob(ivStr), (c) => c.charCodeAt(0));
  const cipherBuffer = Uint8Array.from(atob(cipherStr), (c) => c.charCodeAt(0));

  const pwUtf8 = enc.encode(password);
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

  const alg = { name: 'AES-GCM', iv: iv };
  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'decrypt',
  ]);

  const plainBuffer = await crypto.subtle.decrypt(alg, key, cipherBuffer);
  return dec.decode(plainBuffer);
}
