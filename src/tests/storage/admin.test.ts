import { IAdmin } from '../../models/Admin'
import { AdminStorage } from '../../storage/mongo/admin'
import Database from '../../core/db'

const storage = new AdminStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.admin', () => {
    const admin = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        name: {
            firstName:'John',
            lastName:'Doe'
        },
        phone_number:'+998912345678',
        password:'8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        photo:'images/photo-bb08f46a-fb76-43b3-b81b-716cb3cb1af4.png',
        type: 'admin'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new admin: success', () => {
        return storage.create(admin as IAdmin).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get all admin: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one admin: success', () => {
        return storage.findOne({ _id: admin._id }).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get one admin: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(401)
        })
    })

    test('Get update admin: success', () => {
        const phone_number = '+998935526875'
        return storage.update(admin._id, { phone_number } as IAdmin).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get update admin: fail', () => {
        const phone_number = '+998935526875'
        return storage.update(fake_id, { phone_number } as IAdmin).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete admin: success', () => {
        return storage.delete(admin._id).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get delete admin: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
