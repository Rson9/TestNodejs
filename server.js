const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const fileName = iconv.decode(file.originalname, 'utf-8');
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB
    }
});
// 设置静态文件目录
app.use(express.static('src/main'));
// 使用express.json()中间件解析JSON请求体,就是json在file.body中
app.use(express.json());

//返回主界面
app.get('/', (req, res) => {

    return res.sendFile(path.join(__dirname, 'src/main/html/index.html'));
})

// 单个文件上传路由
app.post('/upload', upload.single('file'), (req, res) => {
    // 文件上传成功，打印并返回文件的原始名称
    console.log('文件上传成功:', req.file.originalname);
    return res.status(200).send({ message: '文件上传成功'});
}
);

//处理错误
app.use((err, req, res, next) => { 
    if (err instanceof multer.MulterError & err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send({message: '文件大小超过限制'});
    }
    next(err);
}
)

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