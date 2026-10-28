export const timeZone='Asia/Tokyo';
const formatters=new Map();const parts=(value,options)=>{const key=JSON.stringify(options);if(!formatters.has(key))formatters.set(key,new Intl.DateTimeFormat('en-CA',{timeZone,...options}));return Object.fromEntries(formatters.get(key).formatToParts(new Date(value)).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]))};
export function monthKey(value){if(/^\d{4}-\d{2}$/.test(value))return value;const p=parts(value,{year:'numeric',month:'2-digit'});return p.year+'-'+p.month}
export const monthLabel=value=>monthKey(value).replace('-','.');
export function stamp(value){if(/^\d{4}-\d{2}$/.test(value))return monthLabel(value)+'（年月）';const p=parts(value,{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});return `${p.year}/${p.month}/${p.day} ${p.hour}:${p.minute} JST`}
