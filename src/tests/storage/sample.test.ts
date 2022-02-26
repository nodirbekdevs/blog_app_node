import { ISample } from '../../models/Sample'
import { SampleStorage } from '../../storage/mongo/sample'
import Database from '../../core/db'

const storage = new SampleStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.sample', () => {
    const sample = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        name: 'Name',
        description: 'THis is a description'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new sample: success', () => {
        return storage.create(sample as ISample).then((data) => {
            expect(data._id).toEqual(sample._id)
        })
    })

    test('Get all sample: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one sample: success', () => {
        return storage.findOne({ _id: sample._id }).then((data) => {
            expect(data._id).toEqual(sample._id)
        })
    })

    test('Get one sample: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update sample: success', () => {
        const name = 'Name updated'
        return storage.update(sample._id, { name } as ISample).then((data) => {
            expect(data._id).toEqual(sample._id)
        })
    })

    test('Get update sample: fail', () => {
        const name = 'Name not updated'
        return storage.update(fake_id, { name } as ISample).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete sample: succes', () => {
        return storage.delete(sample._id).then((data) => {
            expect(data._id).toEqual(sample._id)
        })
    })

    test('Get delete sample: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
