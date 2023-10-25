import joi from 'joi';

const Schemas = {
    login: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }),
    changeStatus: joi.object().keys({
        status: joi.string().valid('pending','completed').required(),
    }),
};

export default Schemas;