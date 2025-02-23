class ApiError {
    constructor(statusCode,message="something went wrong",errors=[],stack=""){
        this.statusCode=statusCode;
        this.message=message;
        this.errors=errors;
        this.data=null;
        this.success=false;
        if(stack){
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this,this.stack);
        }
    }
}

  
export {ApiError }