# Movies Explorer

> Дипломный проект студента Яндекс Практикума 

Бэкенд для одностраничного приложения по поиску фильмов с возможностью регистрации и авторизации пользователей; хранения списка понравивишихся им фильмов.

## Введение

Ради интереса и общего развития я поставил себе сверхзадачи:
- писать на асинхронных функциях вместо цепочек промисов
- использовать ES6-модули вместо common-js
- вместо JWT-токена использовать cookies 
- вкатиться в test-driven development

Целью было избавиться от соблазна тупо копировать код из своих предыдущих работ, плюс — изучить новые приёмы и технологии.

Всё это, конечно, отняло уйму времени, а когда я заменил токен на куки, половина тестов вообще сломалась, так что *в этой ситуации мы просто наши к это самое мы уже здесь наши полномочия всё, окончены...*
Реанимировать их у меня не хвтило ни сил ни времени ни желания, благо в ТЗ этого не требовалось.

В репозитории есть пара тупиковых веток развития. Например, добавление и удаление фильмов я планировал реализовать через массив `owners` (по аналогии с лайками из проекта «Место»), что позволило бы не плодить множества одинаковых записей для разных пользователей. Однако я увидел, что логика выковыривания этих списков становится слишком сложной и громоздкой поэтому пришлось отказаться от этой реализации на полпути.

## API

Само API покоится на домене [api.eoneof-diploma.nomoredomains.icu](api.eoneof-diploma.nomoredomains.icu). В нем реализовано восемь роутов:  

**Публичные**

| Роут             | Принимает                 | Возвращает          | Описание                                                                        |
| ---------------- | ------------------------- | ------------------- | ------------------------------------------------------------------------------- |
| **POST /signup** | `{name, email, password}` | `{message}`         | создаёт пользователя с переданными в теле `email`, `password` и `name`          |
| **POST /signin** | `{name, email}`           | `{id, name, email}` | проверяет переданные в теле почту и пароль и устанавливает куки `auth` и `user` |

**Защищенные авторизацией** — проверяют наличие куков при каждом запросе

| Роут                   | Принимает                                                                                              | Возвращает                     | Описание                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ | ----------------------------------------------------------------------------- |
| **GET /users/me**      | —                                                                                                      | `{id, name, email}`            | берет информацию о пользователе из куков возвращает информацию о пользователе |
| **PATCH /users/me**    | `{name, email}`                                                                                        | `{id, name, email}`            | обновляет информацию о пользователе                                           |
| **POST /signout**      | —                                                                                                      | `{message}`                    | удаляет куки пользователя                                                     |
| **GET /movies**        | —                                                                                                      | `[{movieEntry}]`               | возвращает все сохранённые текущим  пользователем фильмы                      |
| **POST /movies**       | `{country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId}` | `{message, movieEntry: {...}`  | создает запись фильма из полученных данных                                    |
| **DELETE /movies/_id** | —                                                                                                      | `{message, movieEntry: {...}}` | удаляет запись фильма по id                                                   |
