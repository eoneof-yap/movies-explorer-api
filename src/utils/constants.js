// status codes
export const CREATED = 201;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const SERVER_ERROR = 500;

// schemas strings
export const PASSWORD_MIN_TXT = 'пароль должен быть не менее восьми символов';
export const USER_NAME_MAX_TXT = 'имя не должно быть длиннее 30 символов';
export const USER_NAME_MIN_TXT = 'имя должно быть длиной не менее двух символов';

// endpoints
export const LOGIN_PATH = '/signin';
export const REGISTER_PATH = '/signup';

export const USERS_PATH = '/users';
export const CURRENT_USER_PATH = `${USERS_PATH}/me`;

export const MOVIES_PATH = '/movies';
export const MOVIE_ID_PATH = `${MOVIES_PATH}/:id`;

// status messages
export const AUTH_REQUIRED_TXT = 'Необходима авторизация';
export const BAD_REQUEST_TXT = 'Ошибка в запросе';
export const EMAIL_EXIST_TXT = 'Пользователь с такой почтой уже существует';
export const LOGIN_SUCCESFUL = 'Успешная авторизация';
export const MOVIE_DELETED_TXT = 'Фильм удален';
export const MOVIE_EXIST_TXT = 'Такой фильм уже есть в списке';
export const MOVIE_NOT_FOUND_TXT = 'Фильм не найден';
export const MOVIE_RESTRICTED_TXT = 'Нельзя удалять чужие фильмы';
export const PATH_NOT_FOUND_TXT = 'Путь не найден';
export const SERVER_ERROR_TXT = 'Сервер не смог обработать запрос';
export const TOKEN_EXPIRED_TXT = 'Авторизуйтесь заново';
export const TOKEN_INVALID_TXT = 'Токен недействителен';
export const USER_NOT_FOUND_TXT = 'Пользователь не найден';
export const WRONG_CREDENTIALS_TXT = 'Неправильные почта или пароль';
export const WRONG_ID_TXT = 'Неверный формат id';

// error names
export const CAST_ERROR_NAME = 'CastError';
export const DB_DUPLICATE_KEY_CODE = 11000;
export const TYPE_ERROR_NAME = 'TypeError';
export const VALIDATION_ERROR_NAME = 'ValidationError';

// misc
export const JWT_EXPIRATION_TIMEOUT = 3600000 * 24 * 7; // 7 days
export const SALT_ROUNDS = 10;
export const TOKEN_PREFIX = 'Bearer ';
