export function currentDate(){
    let now = new Date();
    var m = (now.getMonth()+1).toString()
    if (m.length < 2)
        m = '0' + m;
    var d = now.getDate().toString();
    if (d.length < 2)
        d = '0' + d;
    return now.getFullYear() + "-" +  m + "-" + d;
}