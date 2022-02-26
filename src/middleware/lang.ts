import { NextFunction, Request, Response } from 'express'

export const langMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const languages = {
        en: 'en',
        ru: 'ru',
        uz: 'uz'
    } as { [filedname: string]: string }

    let { lang } = req.headers as { lang: string }

    if (!lang || !languages[lang]) {
        lang = 'uz'
    }

    res.locals.lang = lang

    next()
}
