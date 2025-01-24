const AsyncHandler = (handlingFunction)=>{
    return (req,res,next)=>{
        Promise.resolve(handlingFunction(req,res,next)).catch((err)=>next(err))
    }
}

export {AsyncHandler};