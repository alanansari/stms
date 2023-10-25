import joi from 'joi';

const Schemas = {
    login: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }),
    createStudent: joi.object().keys({
        name: joi.string().required(),
        email: joi.string().email().required(),
        department: joi.string().required(),
        password: joi.string().required(),
    }),
    createTask: joi.object().keys({
        name: joi.string().required(),
        description: joi.string(),
        dueTime: joi.date().required(),
    }), 
};

export default Schemas;