const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const extension = path.extname(originalname);
        const basename = path.basename(originalname, extension);
        file.originalname = basename + extension;
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage,
    limits:{ 
        fileSize: 20 * 1024 * 1024 //20MB
    }
} );
app.set('view engine', 'ejs');
// 设置静态文件目录
app.use(express.static('public'));
app.use('uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
// 文件上传路由
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        // 如果没有文件上传，返回错误信息
        return res.status(400).send({ message: '没有选择文件' });
    }
    // 文件上传成功，打印并返回文件的原始名称
    console.log('文件上传成功:', req.file.originalname);
    res.status(200).send({ message: '文件上传成功', filename: req.file.originalname });
});
app.use((err,req,res,next) =>{
    if(err instanceof multer.MulterError){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(413).send({message: 'File too large'});
        }
    }
    return res.status(500).send('Unknown error');

})

const downloadDir = path.join(__dirname, 'uploads');
//下载文件
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log('Attempting to serve file from path:', filename);
    const filePath = path.join(downloadDir, filename);

    if (fs.existsSync(filePath)) {
        const encodedFilename = encodeURIComponent(filename);
        res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"`);
        fs.createReadStream(filePath).pipe(res);
    } else {
        console.log('Attempting to serve file from path:', filePath);
        res.status(404).send({ message: '文件未找到' });
    }
});
//显示文件
app.get('/api/files', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads'); // 指定目录路径
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to retrieve the file list.');
        }
        // 将文件列表发送给客户端
        res.json(files);
    });
});

// 设置端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});