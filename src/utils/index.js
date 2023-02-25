const FormatData = (data) => {
    if(data){
        return { data }
    }else{
        throw new Error('Data Not found!')
    }
}

const initiateError = (code, msg) => {
    const e = new Error()
    e.statusCode = code;
    e.message = msg;
    throw e;
}

module.exports = {
    FormatData,
    initiateError,
}