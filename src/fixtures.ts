export enum RequestEvents {
  GET_METADATA = 'get-metadata-request',
  ENCRYPT = 'encrypt-request',
  DECRYPT = 'decrypt-request',
  GENERATE_KEY_PAIR = 'generate-key-pair-request'
}

export enum ResponseEvents {
  GET_METADATA = 'get-metadata-response',
  ENCRYPT = 'encrypt-response',
  DECRYPT = 'decrypt-response',
  GENERATE_KEY_PAIR = 'generate-key-pair-response'
}
