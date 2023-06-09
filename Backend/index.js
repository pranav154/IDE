
const express = require('express');
const { exec } = require("child_process");
const fs = require('fs');
const app = express();
const { getFile } = require('./getFile');
const cors = require('cors');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
      return res.status(400).json({ success: false, error: 'Empty code!' });
    }
  const filepath = await getFile(language, code);
  const inputfilepath = await getFile('txt', input);
    var k="";
    if(language === 'python'){
      k = `python '${filepath}' < '${inputfilepath}'`;
    }else if(language === 'c_cpp'){
      k = `g++ '${filepath}' -o '${filepath}.exe' && '${filepath}.exe' < '${inputfilepath}'`;
    }else if(language === 'javascript'){
      k = `node '${filepath}' < '${inputfilepath}'`;
    }else{
      const filename = filepath.split('/').pop();
      const className = filename.substring(0, filename.lastIndexOf('.'));
      k = `javac '${filepath}' && cd codefile &&  java ${className} < '${inputfilepath}'`;
    }
 
  exec(k, (error, stdout, stderr) => {
    if (error) {
      
      console.error(`Error executing code: ${error}`);
      return res.status(500).json({ success: false, error: "Error executing code" });
    }

    // Save the output to a file
    const outputFilePath = `${filepath}.output.txt`;
    fs.writeFileSync(outputFilePath, stdout);

    res.json({ output : stdout });
  });
});

app.listen(4040, () => {
  console.log("app is listening on port 4040");
});
