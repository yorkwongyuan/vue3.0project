const fs = require("fs");
const chalk = require('chalk');
const console = require("console");
const path = require("path");

const resolve = (...files) => path.resolve(__dirname, ...files);

const log = (msg) => console.log(chalk.green(msg));

const errorLog = (msg) => console.log(chalk.red(msg));

const successLog = (msg) => console.log(chalk.blue(msg));

const {vueTemplate} = require("./template");

log('请输入要生成的页面组件名称、会生成在 views/目录下');

 let fileName = "";
process.stdin.on('data', async chunk => {
    const inputName = String(chunk).trim().toString();

    // .vue文件目录
    let vuePath = resolve('../src/views', inputName);
    if(!vuePath.endsWith('.vue')) {
        vuePath = vuePath + '.vue'
    }
    // .vue文件上级文件夹路径
    let vueDirPath = path.dirname(vuePath);
    // 是否存在.vue文件
    let hasVueFile = fs.existsSync(vuePath);
    // .vue文件是否已经存在
    if(hasVueFile){
        log('该文件已经存在了')
    }else{
        await createDirector(vueDirPath)
    }
    // 创建文件夹
    try{
        console.log(vuePath)
        // 如果存在/
        if(inputName.includes('/')){
            let inputArr = vuePath.split('/');
            fileName = inputArr[inputArr.length-1];
        }else{
            fileName = inputName;
        }
        log(`正在生成${fileName}文件`);
        await createFile(vuePath, vueTemplate(fileName));
    }catch(e){
        console.log(e)
    }
    process.stdin.emit('end');
});

process.stdin.on('end', () => {
    process.exit()
})
function createFile(filePath, data){
    if(fs.existsSync(filePath)){
        log(`文件已经存在`);
        return
    };
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf-8', err =>{
            if(err){
                reject(err);
            }else{
                resolve(true)
            }
        })
    })
}
function createDirector(directory){
    return new Promise((resolve,reject) => {
        mkdir(directory, function(){
            resolve(true)
        })
    })
}

// 递归创建文件夹
function mkdir(directory,callback){
    let isExist = fs.existsSync(directory);
    if(isExist){
        callback()
    }else{
        mkdir(path.dirname(directory), function(){
            fs.mkdirSync(directory);
            callback();
        })
    }
}