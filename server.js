const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); // 引入 MongoDB 模块

const app = express();
// Render 通常会自动分配 PORT 环境变量，默认使用 10000
const PORT = process.env.PORT || 10000; 

// 中间件配置
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

// ==========================================
// 1. 连接 MongoDB 数据库
// ==========================================
// ⚠️ 注意：请一定要把下面代码里的 “您的真实数据库密码” 这几个中文字，替换成您当时设置的密码！
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://g41580387_db_user:1234567890@cluster0.mwlsnzl.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Cloud Database connected perfectly!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ==========================================
// 2. 定义数据模型 (Schema)
// ==========================================
// 员工表
const Staff = mongoose.model('Staff', new mongoose.Schema({
    name: String,
    code: String,
    number: String,
    dept: String
}));

// 账号表
const Account = mongoose.model('Account', new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}));

// 初始化默认账号 (如果数据库是空的，自动创建一个 admin 账号以防无法登入)
Account.countDocuments().then(count => {
    if (count === 0) {
        Account.create({ username: "admin", password: "123456" });
        console.log("Default admin account created.");
    }
});

// ==========================================
// A. 员工数据管理 API (Staff API)
// ==========================================

// 获取所有员工
app.get('/api/staff', async (req, res) => {
    try {
        const data = await Staff.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加新员工
app.post('/api/staff', async (req, res) => {
    try {
        await Staff.create(req.body);
        res.json({ message: 'Data saved successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除单个员工 (兼容前端的 index 索引方式)
app.delete('/api/staff/:index', async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const data = await Staff.find(); 
        if (index >= 0 && index < data.length) {
            await Staff.findByIdAndDelete(data[index]._id); 
            res.json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 清空所有员工
app.delete('/api/staff-clear', async (req, res) => {
    try {
        await Staff.deleteMany({});
        res.json({ message: 'All staff data cleared!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// B. 系统账号管理 API (Accounts API)
// ==========================================

// 获取所有账号
app.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加新账号
app.post('/api/accounts', async (req, res) => {
    try {
        await Account.create(req.body);
        res.json({ message: 'Account added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 修改/更新账号
app.put('/api/accounts/:index', async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const accounts = await Account.find();
        if (index >= 0 && index < accounts.length) {
            await Account.findByIdAndUpdate(accounts[index]._id, req.body);
            res.json({ message: 'Account updated successfully!' });
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除单个账号
app.delete('/api/accounts/:index', async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const accounts = await Account.find();
        if (index >= 0 && index < accounts.length) {
            await Account.findByIdAndDelete(accounts[index]._id);
            res.json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 启动服务器
// ==========================================
app.listen(PORT, () => {
    console.log(`Backend Server is running perfectly on port ${PORT}!`);
});
