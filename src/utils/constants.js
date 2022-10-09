export const CREATED = 201;
// usrer schema strings
export const USER_NAME_MIN_TXT = 'Имя должно быть длиной не менее двух символов';
export const USER_NAME_MAX_TXT = 'Имя не должно быть длиннее 30 символов';

// endpoints
export const LOGIN_PATH = '/signin';
export const REGISTER_PATH = '/signup';

export const USERS_PATH = '/users';
export const CURRENT_USER_PATH = `${USERS_PATH}/me`;
export const MOVIES_PATH = '/movies';

export const BAD_REQUEST_TXT = 'Ошибка в запросе';
export const EMAIL_EXIST_TXT = 'Пользователь с такой почтой уже существует';
export const SALT_ROUNDS = 10;
export const JWT_EXPIRATION_TIMEOUT = '7d';
export const DB_DUPLICATE_KEY_CODE = 11000;
