import { checkIsTokenExpired, generateToken } from "../utils";
import * as uuid from 'uuid';

jest.mock('uuid', () => ({ v4: jest.fn().mockImplementation(() => 'testing-id' ) }));

describe('It should test the services utilities file', () => {
    it('Should test the checkIsTokenExpired', () => {
        const mockTokenTime = 1674012538259;
        const mockTtlDays = 10;
        const result = checkIsTokenExpired(mockTokenTime, mockTtlDays);
        expect(result).toBe(true);
    });

    it('Should test generateToken function', () => {
        const result = generateToken();
        expect(uuid.v4).toBeCalled();
        expect(typeof result.createdAt).toBe('number');
        expect(result.id).toBe('testing-id');
        expect(result.status).toBe('available');
    });

});