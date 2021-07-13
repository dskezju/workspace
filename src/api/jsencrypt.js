import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK6/mOUCb5pq9tpFTyLvKEnM1P0/720P
                  /Ci5Q1xx3alPP1t8rJkUUd6/bkFvM/jQbPVeK/iMw1/qhyv8kOBcZ6ECAwEAAQ==`

const privateKey = `MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEArr+Y5QJvmmr22kVP
                    Iu8oSczU/T/vbQ/8KLlDXHHdqU8/W3ysmRRR3r9uQW8z+NBs9V4r+IzDX+qHK/yQ
                    4FxnoQIDAQABAkAZ9yo2zRfcMAyh/i52GGc6IA992eQvpnJncq/JqrmvEHJwLOR+
                    iTzR/xK2xZZ2BMuPkqDaYc/aGna7dNR7HKOBAiEA4jOYUr7FRf/wSqFgSc+njFIM
                    nnBR/KmaaAiSGJlo8dkCIQDFxM0Koim7tbJBY2A4P66yx9rfyhd9lDwD2krEaTO/
                    CQIhAKDfEtjeRgyXjjx1crZr0XwRKlpQBW8M6/xLBCQsjp9ZAiAvtZRJVml+8Qw5
                    ngGeUC6SzofMqPIVx2ba/xQ+YaqsEQIgC23B5IH+SSQD3V/9xz6v10Rd2/zPehcW
                    ikzpVA4m+9E=`

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

