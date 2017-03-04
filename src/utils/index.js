import path from 'path'

export const SUCCESS_CODE = 0
export const ERROR_CODE = 1
export const JWT_SECRET = 'h5app'

export const DATA_SAVE_PATH = path.join(__dirname, '../../public', 'data')

export const PASS_ROUTES = [
  '/user/login',
  '/user/register',
  '/projects'
]
