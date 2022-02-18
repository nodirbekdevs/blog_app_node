import { Router } from 'express'
import { AdminController } from '../controllers/admin'
import { AdminValidator } from '../validators/admin'
import { Middleware } from '../middleware/auth'
import multer from '../middleware/multer'

const router = Router({ mergeParams: true })
const controller = new AdminController()
const validator = new AdminValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 20).single('photo')

router.get('/all', middleware.auth(['super_admin']), controller.getAll)
router.get('/:id', middleware.auth(['super_admin']), controller.get)
router.post('/create', middleware.auth(['super_admin']), upload, validator.create, controller.create)
router.post('/login', validator.login, controller.login)
router.patch('/:id', middleware.auth(['super_admin']), upload, validator.update, controller.update)
router.delete('/:id', middleware.auth(['super_admin']), controller.delete)

export default router
