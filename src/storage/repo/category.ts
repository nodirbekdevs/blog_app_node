import { ICategory } from '../../models/Category'

export interface ICategoryAllResponse {
    payloads: ICategory[]
    count: number
}

export interface CategoryRepo {
    find(query: Object): Promise<ICategory[]>
    findOne(query: Object): Promise<ICategory>
    // add(id: string): Promise<ICategory>
    create(payload: ICategory): Promise<ICategory>
    update(id: string, payload: ICategory): Promise<ICategory>
    delete(id: string): Promise<ICategory>
}
