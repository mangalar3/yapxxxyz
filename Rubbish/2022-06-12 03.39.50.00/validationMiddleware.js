const { body } = require('express-validator');


const validateNewUser = () => {
    return [
        body('email').trim()
            .isEmail().withMessage('Geçerli bir mail adresi giriniz!'),

        body('sifre').trim()
            .isLength({ min: 3 }).withMessage('Şifre en az 6 karakter olmalıdır!')
            .isLength({ max: 20 }).withMessage('Şifre en fazla 20 karakter olmalıdır!'),

        body('kullaniciAdi').trim()
            .isLength({ min: 2 }).withMessage('Kullanıcı Adı en az 2 karakter olmalıdır!')
            .isLength({ max: 20 }).withMessage('Kullanıcı Adı en fazla 20 karakter olmalıdır!'),

        body('resifre').trim().custom((value, { req }) => {
            if (value !== req.body.sifre) {
                throw new Error('Şifreler aynı değil');
            }
            return true;
        })
    ];
};

const validateLogin = () => {
    return [
        body('kullaniciAdi').trim()
            .notEmpty().withMessage('Geçerli bir kullanıcı adı giriniz!'),

        body('sifre').trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır!')
            .isLength({ max: 20 }).withMessage('Şifre en fazla 20 karakter olmalıdır!'),
    ];
};

const validateEmail = () => {
    return [
        body('email').trim()
            .isEmail().withMessage('Geçerli bir mail adresi giriniz!'),

    ];
}

const validateNewPassword = () => {
    return [
        body('sifre').trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır!')
            .isLength({ max: 20 }).withMessage('Şifre en fazla 20 karakter olmalıdır!'),

        body('resifre').trim().custom((value, { req }) => {
            if (value !== req.body.sifre) {
                throw new Error('Şifreler aynı değil');
            }
            return true;
        })
    ];
};

const validateNewService = () => {
    return [
        body('serviceName')
            .notEmpty().withMessage('Please enter service name!'),
        body('serviceDescription')
            .notEmpty().withMessage('Please enter service description!')
    ];

};

const validateNewReference = () => {
    return [
        body('referenceName')
            .notEmpty().withMessage('Please enter reference name!'),

    ];

};

const validateNewWorkHistory = () => {
    return [
        body('workCompany')
            .notEmpty().withMessage('Please enter work company!'),
        body('workTitle')
            .notEmpty().withMessage('Please enter work title!'),
        body('workDescription')
            .notEmpty().withMessage('Please enter work description!'),
        body('workStartDate')
            .notEmpty().withMessage('Please enter work start date!'),
        body('workFinishDate')
            .notEmpty().withMessage('Please enter work finish date!'),
    ];

};

const validateNewEducation = () => {
    return [
        body('educationYear')
            .notEmpty().withMessage('Please enter education year!'),
        body('educationTitle')
            .notEmpty().withMessage('Please enter education title!'),
        body('educationDescription')
            .notEmpty().withMessage('Please enter education description!'),
        body('educationSchool')
            .notEmpty().withMessage('Please enter education school!')
    ];

};

const validateNewSkillCategory = () => {
    return [
        body('skillCatName')
            .notEmpty().withMessage('Please skill category name!'),
    ];
};

const validateNewSkill = () => {
    return [
        body('skillName')
            .notEmpty().withMessage('Please skill name!'),
        body('skillPoint')
            .notEmpty().withMessage('Please skill point!'),

    ];
};

const validateNewPortfolioCategory = () => {
    return [
        body('portfolioCatName')
            .notEmpty().withMessage('Please enter portfolio category name!'),
        body('portfolioCatSubName')
            .notEmpty().withMessage('Please enter portfolio category sub name!'),

    ];
};

const validateNewPortfolio = () => {
    return [
        body('portfolioName')
            .notEmpty().withMessage('Please enter portfolio name!'),
        body('portfolioDesc')
            .notEmpty().withMessage('Please enter portfolio description!'),

    ];
};

const validateSettings = () => {
    return [
        body('title')
            .notEmpty().withMessage('Please enter title!'),
        body('description')
            .notEmpty().withMessage('Please enter description!'),
        body('keywords')
            .notEmpty().withMessage('Please enter keywords!'),
        body('job')
            .notEmpty().withMessage('Please enter job!'),
        body('name')
            .notEmpty().withMessage('Please enter name!'),
        body('scrollingtext')
            .notEmpty().withMessage('Please enter scrolling text!'),

    ];
};

const validateNewBlog = () => {
    return [
        body('blogTitle')
            .notEmpty().withMessage('Please enter blog title!'),
        body('blogDescription')
            .notEmpty().withMessage('Please enter blog description!'),
        body('blogKeywords')
            .notEmpty().withMessage('Please enter blog keywords!'),
        body('blogSeo')
            .notEmpty().withMessage('Please enter blog seo link!'),
        body('blogText')
            .notEmpty().withMessage('Please enter blog text!'),
        body('blogImage')
            .notEmpty().withMessage('Please enter blog image!'),
    ];
};

module.exports = {
    validateNewUser,
    validateLogin,
    validateEmail,
    validateNewPassword,
    validateNewService,
    validateNewReference,
    validateNewWorkHistory,
    validateNewEducation,
    validateNewSkillCategory,
    validateNewSkill,
    validateNewPortfolioCategory,
    validateNewPortfolio,
    validateSettings,
    validateNewBlog
}