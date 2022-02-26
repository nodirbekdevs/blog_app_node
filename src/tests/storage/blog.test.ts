import { IBlog } from '../../models/Blog'
import { BlogStorage } from '../../storage/mongo/blog'
import Database from '../../core/db'

const storage = new BlogStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.blog', () => {
    const blog = {
        _id: '8bf5fc5c-0558-408c-a12f-95dca952a56',
        maker: '8bf5fc5c-0558-408c-a12-5995dca962a0cd',
        category:'8bf5fc5c-0558-408c-a12-5995dca962a0cd',
        title:'What is your name?',
        content:"JavaScript unit testing using Jest. We will look at how to setup.",
        images:['images/photo-bb08f46a-fb76-43b3-b81b-716cb3cb1af4.png', 'images/photo-299ef7a3-60d6-4c30-b487-497c18f8b79a.png']
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create a new blog: success', () => {
        return storage.create(blog as IBlog).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get all blogs: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one blogs: success', () => {
        return storage.findOne({ _id: blog._id }).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get one blog: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update a blog: success', () => {
        const title = 'Africa'
        return storage.update(blog._id, { title } as IBlog).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get update a blog: fail', () => {
        const title = 'Africa'
        return storage.update(fake_id, { title } as IBlog).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    // test('Get updateMany a blog: success', () => {
    //     const title = 'Africa'
    //     return storage.updateMany(fake_id, { title } as IBlog).then((data) => expect(data.ok).toEqual(0))
    // })

    test('Get updateMany a blog: fail', () => {
        const title = 'Africa'
        return storage.updateMany(fake_id, { title } as IBlog).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete a blog: success', () => {
        return storage.delete(blog._id).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get delete a blog: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
