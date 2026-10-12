const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 【专属云数据库连接密钥】
// 包含了您的账号、密码，以及专属于您的集群地址 mwlsnzl，并自动创建 BankDB 数据库
const MONGO_URI = 'mongodb+srv://g41580387_db_user:HU8XOtVjBbUThApp@cluster0.mwlsnzl.mongodb.net/BankDB?appName=Cluster0';

// 中间件配置
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// 尝试连接 MongoDB 数据库
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Cloud Database connected perfectly!'))
    .catch(err => console.log('❌ Database connection error:', err));

// 定义数据模型 (表格结构)
const staffSchema = new mongoose.Schema({
    name: String,
    code: String,
    number: String,
    dept: String
});
const Staff = mongoose.model('Staff', staffSchema);

// ---------------------------
// 1. 获取所有数据 API
// ---------------------------
app.get('/api/staff', async (req, res) => {
    try {
        const data = await Staff.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// ---------------------------
// 2. 添加新数据 API
// ---------------------------
app.post('/api/staff', async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
        await newStaff.save();
        res.json({ message: 'Data saved successfully to Cloud!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// ---------------------------
// 3. 删除单条数据 API (匹配前端的 index)
// ---------------------------
app.delete('/api/staff/:index', async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const allStaff = await Staff.find();
        if (index >= 0 && index < allStaff.length) {
            const targetId = allStaff[index]._id;
            await Staff.findByIdAndDelete(targetId);
            res.json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete data' });
    }
});

// ---------------------------
// 4. 清空所有数据 API
// ---------------------------
app.delete('/api/staff-clear', async (req, res) => {
    try {
        await Staff.deleteMany({});
        res.json({ message: 'All data cleared!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear data' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});
