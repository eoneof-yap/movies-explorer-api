import httpMocks  from 'node-mocks-http';
import { getUserInfo } from './controllers.js';

describe('getUserInfo', () => {
    test('Получить данные о пользователе', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users/me'
        });

        const res = httpMocks.createResponse();

        getUserInfo(req, res, (err) => {
            expect(err).toBeFalsy();
        });

        console.log(res.json());

        expect(res.statusCode).toBe(200);
        expect.anything()
        });
    });
