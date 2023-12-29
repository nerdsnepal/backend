
exports.metaData = (req,res,next)=>{
    
    const ip = req.headers['x-real-ip']
    ||req.headers['true-client-ip']
    || req.headers['x-forwarded-for']
    ||req.headers['cf-connecting-ip']
    || req.socket.remoteAddress
    ||'';
    const userAgent = req.headers['user-agent']||"";
    req.meta = {ipaddress:ip,userAgent};
    next()
}