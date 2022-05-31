const http = require('http');
const fs = require('fs');
const fileProcess = require('./file-process');
const getUserByToken = require('./auth/checkToken');

// Tạo một server bằng hàm createServer
const server = http.createServer(function (yeu_cau, phan_hoi) {
    var chuoi_nhan = "";
    var dinh_tuyen = yeu_cau.url;
    // Lắng nghe sự kiện data
    yeu_cau.on('data', (chunk) => { chuoi_nhan += chunk });
    // Lắng nghe sự kiện yêu cầu kết thúc
    yeu_cau.on('end', () => {
        phan_hoi.setHeader("Access-Control-Allow-Origin", '*')
        phan_hoi.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        phan_hoi.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        phan_hoi.setHeader('Access-Control-Allow-Credentials', true);
        console.log(chuoi_nhan);
        // Cài đặt định tuyến

        if (dinh_tuyen == '/get-task') {
            const { token } = JSON.parse(chuoi_nhan);
            const userInfo = getUserByToken(token);
            if (userInfo == null) {
                return phan_hoi.end(new Error('Token không hợp lệ'));
            }
            const taskData = fs.readFileSync('./database/task/task.json', 'utf-8');
            return phan_hoi.end(taskData);
        };

        if (dinh_tuyen == '/fix_card') {
            var du_lieu = JSON.parse(chuoi_nhan);
            var new_card_fixed = du_lieu[0];
            var index_thu = du_lieu[1];
            var index_card_fix = du_lieu[2];
            var taskData = fileProcess.getJsonFile('./database/task/task.json');
            taskData[index_thu].thong_tin[index_card_fix] = new_card_fixed;
            fileProcess.writeJsonFile('./database/task/task.json', taskData);
            return phan_hoi.end(JSON.stringify(taskData));
        };

        if (dinh_tuyen == '/add') {
            var du_lieu = JSON.parse(chuoi_nhan);
            var new_card = du_lieu[0];
            var index_thu = du_lieu[1];
            var taskData = fileProcess.getJsonFile('./database/task/task.json');
            taskData[index_thu].thong_tin.push(new_card);
            fileProcess.writeJsonFile('./database/task/task.json', taskData);
            return phan_hoi.end(JSON.stringify(taskData));
        };

        if (dinh_tuyen == '/xoa_cong_viec') {
            var du_lieu = JSON.parse(chuoi_nhan);
            var index = du_lieu.index;
            var chi_so = du_lieu.chi_so;
            var taskData = fileProcess.getJsonFile('./database/task/task.json');
            if (taskData[index].thong_tin.length != 1) {
                taskData[index].thong_tin.splice(chi_so, 1);
                fileProcess.writeJsonFile('./database/task/task.json', taskData);
                return phan_hoi.end(JSON.stringify(taskData));
            } else {
                taskData.splice(index, 1);
                fileProcess.writeJsonFile('./database/task/task.json', taskData);
                return phan_hoi.end(JSON.stringify(taskData));
            }
        };

        if (dinh_tuyen == '/xoa_list') {
            var du_lieu = JSON.parse(chuoi_nhan);
            var thu = du_lieu.chi_so;
            var taskData = fileProcess.getJsonFile('./database/task/task.json');
            taskData.splice(thu, 1);
            fileProcess.writeJsonFile('./database/task/task.json', taskData);
            return phan_hoi.end(JSON.stringify(taskData));
        };

        if (dinh_tuyen == '/login') {
            var loginInfo = JSON.parse(chuoi_nhan);
            var authArray = fileProcess.getAuthData();
            var loginData = authArray.find(auth => auth.username == loginInfo.username);
            if (loginData != undefined && loginData.password == loginInfo.password) {
                return phan_hoi.end(JSON.stringify({ token: loginData.token }));
            }
            return phan_hoi.end(new Error('Đăng nhập thất bại.'));
        }
    });
});

// Mở port 9000 cho server lắng nghe
const PORT = 9000;
server.listen(PORT, () => {
    console.log(`Server đang chạy ở PORT (${PORT})`);
});
