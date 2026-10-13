const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 定义两个数据文件的路径
const DATA_FILE = path.join(__dirname, 'database.json');     // 存员工数据
const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json'); // 存账号数据

// 中间件配置
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // 自动托管 public 文件夹下的网页

// ---------------------------
// 数据库初始化
// ---------------------------
// 1. 初始化员工数据库
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}
// 2. 初始化账号数据库（如果不存在，默认创建一个 admin 账号）
if (!fs.existsSync(ACCOUNTS_FILE)) {
    const defaultAccount = [{ username: "admin", password: "123456" }];
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(defaultAccount, null, 2));
}


// ==========================================
// A. 员工数据管理 API (Staff API)
// ==========================================

// 获取所有员工数据
app.get('/api/staff', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// 添加新员工数据
app.post('/api/staff', (req, res) => {
    const newStaff = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.push(newStaff);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); // 保存到文件
    res.json({ message: 'Data saved successfully!' });
});

// 删除单个员工数据
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

// 清空所有员工数据
app.delete('/api/staff-clear', (req, res) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    res.json({ message: 'All staff data cleared!' });
});


// ==========================================
// B. 系统账号管理 API (Accounts API) - 新增
// ==========================================

// 1. 获取所有账号
app.get('/api/accounts', (req, res) => {
    const accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE));
    res.json(accounts);
});

// 2. 添加新账号
app.post('/api/accounts', (req, res) => {
    const newAccount = req.body;
    const accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE));
    accounts.push(newAccount);
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
    res.json({ message: 'Account added successfully!' });
});

// 3. 修改/更新账号
app.put('/api/accounts/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const updatedAccount = req.body;
    const accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE));
    
    if (index >= 0 && index < accounts.length) {
        accounts[index] = updatedAccount;
        fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
        res.json({ message: 'Account updated successfully!' });
    } else {
        res.status(404).json({ error: 'Account not found' });
    }
});

// 4. 删除单个账号
app.delete('/api/accounts/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE));
    
    if (index >= 0 && index < accounts.length) {
        accounts.splice(index, 1);
        fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
        res.json({ message: 'Account deleted successfully' });
    } else {
        res.status(404).json({ error: 'Account not found' });
    }
});


// ==========================================
// 启动服务器
// ==========================================
app.listen(PORT, () => {
    console.log(`Backend Server is running perfectly on port ${PORT}!`);
});
