const log = console.log.bind(console)

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

/**
 * [requestAsync 异步化 request]
 * @param  {[object]} option [爬取网址]
 * @return {[object]}     [返回一个 Promise 对象]
 */
function requestAsync(option) {
    return new Promise((resolve, reject) => {
        request(option, (err, res, body) => {
			option.headers = {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36',
				'Cookie': res.headers['set-cookie'],
			}
            if (!err && res.statusCode === 200) resolve(body)
            else reject(err)
        })
    })
}

/**
 * [writeFileAsync 异步化 写入文件]
 * @param  {[string]} path [地址]
 * @param  {[string]} data [内容]
 * @return {[object]}      [返回一个 Promise 对象]
 */
function writeFileAsync(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

/**
 * [mkdirSync 建立文件夹]
 * @param  {[string]} dirname [文件夹名称]
 * @return {[boolen]}         [返回一个布尔值]
 */
function mkdirSync (dirname) {
    if (fs.existsSync(dirname)) {
        return true
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname)
            return true
        }
    }
    return false
}

const headers = {
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36',
}

// 初始化爬取页面
const initOption = {
    url: 'http://jandan.net/ooxx/page-101#comments',
	headers: headers,
}

// 初始化对象
const obj = {
    title: null,
    array: [],
}

log('\n爬虫开始工作...\n')

requestAsync(initOption).then(() => {
	requestAsync(initOption).then((body) => {
		const $ = cheerio.load(body)
		log($('.commentlist .row .text img'))
	})
})
// .then(() => {
//     log('图片个数：' + obj.array.length + '\n')
//     // 创建文件夹
//     mkdirSync('dist/' + obj.title)
// }).then(() => {
//     // 遍历数组，下载图片
//     obj.array.map((value, index) => {
//         const option = {
//             url: value,
//             encoding: null,
//         }
//         requestAsync(option).then((body) => {
//             writeFileAsync('dist/' + obj.title + '/' + (index + 1) + '.jpg', body)
//         })
//     })
// })
