import { IUser } from '../../models/User'
import { UserStorage } from '../../storage/mongo/user'
import Database from '../../core/db'

const storage = new UserStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})


describe('Checking storage.user', () => {
    const user = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        name: {
            firstName:'John',
            lastName:'Doe'
        },
        phone_number:'+998912345678',
        password:'8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        interestedCategories:['32131231', '32131123121'],
        photo:'images/photo/8bf5fc5c-0558-408c-a12-5995dca952a0cd'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create a new user: success', () => {
        return storage.create(user as IUser).then(data => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get all user: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one user: success', () => {
        return storage.findOne({ _id: user._id }).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get one user: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update user: success', () => {
        const phone_number = '+998935526875'
        return storage.update(user._id, { phone_number } as IUser).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get update user: fail', () => {
        const phone_number = '+998935526875'
        return storage.update(fake_id, { phone_number } as IUser).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete user: success', () => {
        return storage.delete(user._id).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get delete user: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
