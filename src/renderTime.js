// 处理后台发送的数据库返回的时间格式
const renderTime = (list, str) => {
    for (let k of list) {
        var date = new Date(k[str]).toJSON()
        k[str] = new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    }
    return list;
}

export default renderTime