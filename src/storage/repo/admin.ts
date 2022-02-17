import { IAdmin } from '../../models/Admin'

export interface IAdminAllResponse {
    payloads: IAdmin[]
    count: number
}

export interface AdminRepo {
    find(query: Object): Promise<IAdmin[]>
    findOne(query: Object): Promise<IAdmin>
    create(payload: IAdmin): Promise<IAdmin>
    update(id: string, payload: IAdmin): Promise<IAdmin>
    delete(id: string): Promise<IAdmin>
}
