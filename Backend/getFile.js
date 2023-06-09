const path= require("path");
const fs= require("fs");

const { v4:uuid}=require("uuid");

const newdir = path.join(__dirname,"codefile");

if(!fs.existsSync(newdir)){
    fs.mkdirSync(newdir, { recursive: true });
};

const getFile = async (language,code) =>{
    var id=uuid();
    if(language === 'c_cpp'){
        language='cpp';
    }else if(language === 'python'){
        language='py';
    }else if(language === 'javascript'){
        language='js';
        
    }else{
        id='Main';
    }
    const filename= `${id}.${language}`;
    const filepath=path.join(newdir,filename);
    await fs.writeFileSync(filepath, code);
    return filepath;
};

module.exports={
    getFile,
};

