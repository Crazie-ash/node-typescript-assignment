export interface CommonResponseData<T> {
    status: boolean;
    message: string;
    data: T;
}
