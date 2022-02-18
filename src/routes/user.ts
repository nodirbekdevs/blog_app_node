import { Router } from 'express'
import multer from './../middleware/multer'
// import { upload } from '../middleware/multer1'
import { UserController } from '../controllers/user'
import { UserValidator } from '../validators/user'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 20).single('photo')

router.get('/all', middleware.auth(['admin']), controller.getAll)
router.get('/:id', middleware.auth(['admin']), controller.get)
router.post('/create', middleware.auth(['admin']), upload, validator.create, controller.create)
router.post('/register', validator.login, controller.register)
router.post('/login', validator.login, controller.login)
router.patch('/update/profile', middleware.auth(['user']), upload, validator.update, controller.updateProfile)
router.patch('/:id', middleware.auth(['admin']), upload, validator.update, controller.update)
router.delete('/:id', middleware.auth(['admin']), controller.delete)

export default router
