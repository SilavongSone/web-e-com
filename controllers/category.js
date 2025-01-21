
exports.create = async (req, res)=>{
    try{
        //code
        res.send('Hello category Introller')

    } catch (err){
        //err
        console.log(err) 
        res.status(500).json({ massage: "Server Error In Controllers/category" })
    }
}
exports.list = async (req, res)=>{
    try{
        //code
        res.send('Hello category list')

    } catch (err){
        //err
        console.log(err) 
        res.status(500).json({ massage: "Server Error In Controllers/category/list" })
    }
}
exports.remove = async (req, res)=>{
    try{
        //code
        const { id } = req.params 
        console.log( id )
        res.send('Hello category remove')

    } catch (err){
        //err
        console.log(err) 
        res.status(500).json({ massage: "Server Error In Controllers/category/remove" })
    }
}