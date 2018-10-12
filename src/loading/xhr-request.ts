/*
    This is a singleton class to for wrapping headers in XHR fetch requests.
 */
export class XhrRequest
{
    private static instance: XhrRequest;

    private headers: Headers;

    private constructor()
    {
        this.headers = new Headers();
    }

    public static get Instance()
    {
        return this.instance || (this.instance = new this());
    }

    public static setHeader(name: string, value: string): void
    {
        XhrRequest.Instance.headers.set(name, value);
    }

    public static fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
    {
        return fetch(input,
            init || {
                headers: XhrRequest.Instance.headers,
                mode: 'cors'
            });
    }
}
