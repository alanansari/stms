class ErrorHandler extends Error {
    statusCode: number;
    constructor(statusCode: number,message: string){
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMiddleware = (err:any,req:any,res:any,next:any) => {
    err.message = err.message || "Interal Server Error";
    err.statusCode = err.statusCode || 500;
    console.log(err);

    return res.status(err.statusCode).json({
        success:false,
        message: err.message
    });
}


export {
    errorMiddleware,
    ErrorHandler
}