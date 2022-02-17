import { SampleStorage } from './mongo/sample'
import { CategoryStorage} from "./mongo/category";
import { BlogStorage} from "./mongo/blog";
import {AdminStorage} from "./mongo/admin";
import { UserStorage } from "./mongo/user";

interface IStorage {
    sample: SampleStorage,
    category: CategoryStorage,
    blog: BlogStorage,
    admin: AdminStorage,
    user: UserStorage,
}

export let storage: IStorage = {
    sample: new SampleStorage(),
    category: new CategoryStorage(),
    blog: new BlogStorage(),
    admin: new AdminStorage(),
    user: new UserStorage(),
}
