import { IUser } from '../../models/User'

export interface IUserAllResponse {
    payloads: IUser[]
    count: number
}

export interface UserRepo {
    find(query: Object): Promise<IUser[]>
    findOne(query: Object): Promise<IUser>
    create(payload: IUser): Promise<IUser>
    update(id: string, payload: IUser): Promise<IUser>
    delete(id: string): Promise<IUser>
}
