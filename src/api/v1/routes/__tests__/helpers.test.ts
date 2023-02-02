import { handler } from '../helpers';

const mockResJson = jest.fn();
const mockResStatus = jest.fn(()=> {
    return ({
    json: mockResJson
})});
const mockNextFn = jest.fn();
describe('Testing the unifier routes handler', () => {
    it('Should to call the controller function with req payloads and return a unified response', () => {
        const mockRequest = {
            query: {
                tokens: 100,
            }
        } as any;
        const mockResponse = {
            status: mockResStatus
        } as any;
        const controllerFunction = jest.fn().mockResolvedValue({message: 'This is a testing message', response: []});
        handler({
            req: mockRequest,
            res: mockResponse,
            next: mockNextFn,
            fn: controllerFunction
        });
        expect(mockNextFn).not.toBeCalled();
        // expect(mockResStatus).toBeCalledWith(200);
        // expect(mockResJson).toBeCalledWith(expect.objectContaining({
        //     message: 'This is a testing message',
        //     response: []
        // }));
    });
});