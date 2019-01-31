const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const resolve = (...file) => path.resolve(__dirname, ...file);

const log = message => console.log(chalk.green(message));
const errorLog = message => console.log((chalk.red(message)));
const successLog = message => console.log((chalk.blue(message)));

const { entryTemplate, vueTemplate } = require("./template.js");

// 写入文件
const generateFile = (path, data) => {
    if (fs.existsSync(path)) {
        errorLog('文件已经存在');
        return;
    }
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, data, 'utf-8', err => {
            if (err) {
                errorLog(err.message);
                reject(err)
            } else {
                resolve(true)
            }
        })
    });
};

log('请输入要生成的组件名称,如要生成全局组件,请在前面加上global/');

let componentName = "";

process.stdin.on('data', async chunk => {
    // 输入的名字
    let inputName = String(chunk).trim().toString();
    // 文件夹路径
    const componentDirectory = resolve('../src/components', inputName);
    // 组件.vue路径
    const componentVueName = resolve(componentDirectory, 'main.vue');
    // 入口文件路径(index.js)
    const entryComponentName = resolve(componentDirectory, 'index.js');

    // 判断输入的组件名是否已经存在了
    const hasComponentDirectory = fs.existsSync(componentDirectory);

    // 如果该文件夹已经存在
    if (hasComponentDirectory) {
        errorLog(`${inputName}组件已经存在了,请重新输入`);
        return;
        // 如果不存在    
    } else {
        await dotExistDirecotryCreate(componentDirectory)
    }

    // 写文件
    try {
        if (inputName.includes('/')) {
            let inputArr = inputName.split('/');
            componentName = inputArr[inputArr.length - 1];
        } else {
            componentName = inputName
        }

        log(`正在生成${componentName}.vue文件`);
        await generateFile(componentVueName, vueTemplate(componentName));
        log(`正在生成${componentName}组件入口文件`);
        await generateFile(entryComponentName, entryTemplate);
        log(`生成成功`);

    } catch (e) {
        errorLog(e.message)
    }
    process.stdin.emit('end')
});

process.stdin.on('end', function(){
    log('退出');
    process.exit()
})


// 递归
function dotExistDirecotryCreate(directory) {
    return new Promise((resolve, reject) => {
        mkdirs(directory, function () {
            // resolve(true)之后，await才不再等待
            resolve(true);
        })
    })
}

// 创建文件夹(递归创建)**重点中的重点！
function mkdirs(directory, callback) {
    // 如果存在则，不执行添加创建文件
    if (fs.existsSync(directory)) {
        callback();
    } else {
        // 如果本级目录下不存在该文件夹，则向上一层创建
        mkdirs(path.dirname(directory), function () {
            fs.mkdirSync(directory);
            callback();
        })
    }
}






