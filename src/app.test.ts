import { handleCloseConnections } from "./app";

jest.mock('express');
jest.mock('./api/v1/routes/', () => {
    return 'test';
})

describe('Testing App.ts', () => {
    const mockApp = {
        on: jest.fn().mockImplementation()
    };
    process.on = jest.fn();
    it('Should test handleCloseConnections, it will call app.on and process.on', () => {
        handleCloseConnections(mockApp as any);
        expect(mockApp.on).toBeCalled();
        expect(process.on).toBeCalled();
    });
});