import jwt from 'jsonwebtoken'

const adminAuth = async(req,res,next)=>
{
    try{
        const {token}=req.headers

        if(!token)
        {
            return res.json({success:false,message:"NOt Authorized Login Again!"})
        }

        const tokendecode=jwt.verify(token,process.env.JWT_SECRET);

        if(tokendecode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD)
        {
            return res.json({success:false,message:"NOt Authorized Login Again!"})
        }
        next()
    }
    catch(error)
    {
        console.log(error);
        res.json({sucess:false,message:error.message})
    }
}

export default adminAuth