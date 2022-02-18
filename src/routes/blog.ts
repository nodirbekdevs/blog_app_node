import { Router } from 'express'
import multer from '../middleware/multer'
import { BlogController } from '../controllers/blog'
import { BlogValidator } from '../validators/blog'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new BlogController()
const validator = new BlogValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 20).array('images', 3)


router.get('/all', middleware.auth(['user', 'admin']), controller.getAll)
router.get('/:id', middleware.auth(['user', 'admin']), controller.get)
router.post('/create', middleware.auth(['admin']), upload, validator.create, controller.create)
router.patch('/:id', middleware.auth(['admin']), upload, validator.update, controller.update)
router.delete('/:id', middleware.auth(['admin']), controller.delete)

export default router
