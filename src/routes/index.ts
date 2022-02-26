const express = require('express')
const path = require('path')
import sampleRouter from './sample'
import adminRouter from './admin'
import blogRouter from './blog'
import categoryRouter from './category'
import userRouter from './user'

const router = express.Router({ mergeParams: true })

router.use('/file', express.static(path.join(__dirname, '../../uploads')))
router.use('/sample', sampleRouter)
router.use('/admin', adminRouter)
router.use('/blog', blogRouter)
router.use('/category', categoryRouter)
router.use('/user', userRouter)

export default router
