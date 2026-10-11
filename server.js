const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'database.json');

// 中间件配置
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // 自动托管 public 文件夹下的网页

// 初始化数据库文件：如果没有 database.json，自动创建一个空的
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ---------------------------
// 1. 获取所有员工数据 API
// ---------------------------
app.get('/api/staff', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// ---------------------------
// 2. 添加新员工数据 API
// ---------------------------
app.post('/api/staff', (req, res) => {
    const newStaff = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.push(newStaff);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); // 保存到文件
    res.json({ message: 'Data saved successfully!' });
});

// ---------------------------
// 3. 删除员工数据 API
// ---------------------------
app.delete('/api/staff/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    if (index >= 0 && index < data.length) {
        data.splice(index, 1);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ message: 'Deleted successfully' });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

// ---------------------------
// 4. 清空所有数据 API
// ---------------------------
app.delete('/api/staff-clear', (req, res) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    res.json({ message: 'All data cleared!' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Backend Server is running perfectly!`);
    console.log(`Please open in browser: http://localhost:${PORT}/index.html`);
});