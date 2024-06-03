const APIRequest = async (url : string, optionsObj : RequestInit) => {

    let errMsg = '';

    try {
        const response = await fetch(url, optionsObj);
        if (!response.ok) throw Error('Please reload the app');
    } catch (err) {
        if(err instanceof Error)
            errMsg = err.message;
    } finally {
        return errMsg;
    }
}

export default APIRequest;