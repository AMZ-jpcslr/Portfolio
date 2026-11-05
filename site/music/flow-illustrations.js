// Original SVG artwork for the explanatory films. No third-party artwork or logos.
const box=(x,y,w,h,fill,r=4,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
export function drawPerson(x,y,color='#6f8978'){
 return `<g transform="translate(${x} ${y})"><g class="flow-person"><ellipse cx="3" cy="58" rx="29" ry="5" fill="#304b4120"/>
 <path d="M-19-15q-14 0-13 17l3 25 16 1 7-34z" fill="#d6a26a"/><path d="M-22-13q-6-7-12 4" fill="none" stroke="#8b623e" stroke-width="3"/>
 <g class="flow-leg-left"><path d="M-14 19 2 20-1 40-10 55-22 52-14 34z" fill="#334d61"/><path d="M-22 50-9 53-8 60h-24q-3-6 10-10" fill="#f8f3e9" stroke="#677476" stroke-width="1.5"/></g>
 <g class="flow-leg-right"><path d="M0 20 14 18 15 35 25 51 14 57 2 39z" fill="#425f74"/><path d="m14 52 12-3 11 9q1 4-6 4H13z" fill="#f8f3e9" stroke="#677476" stroke-width="1.5"/></g>
 <path d="M-15-17q15-10 29 1l6 37q-20 10-40 1z" fill="${color}"/><path d="m-6-19 6 17 7-17z" fill="#f8ecd8"/><path d="m-6-19-6 11 10 7m10-18 6 11-11 7" fill="none" stroke="#ffffff75" stroke-width="1.5"/>
 <path d="M-14-14q-11 6-13 29l9 3 11-26z" fill="${color}"/><circle cx="-23" cy="19" r="5" fill="#e8b38e"/>
 <path d="M13-14q13 8 15 24l-9 5-13-24z" fill="${color}"/><circle cx="25" cy="11" r="5" fill="#e8b38e"/>${box(24,-2,9,18,'#263e49',2)}${box(26,0,5,11,'#bddbe0',1)}
 <path d="m-10-17 28 35" stroke="#d4ad75" stroke-width="3.5"/>${box(5,9,22,19,'#bb8054',4)}<path d="M7 17h18" stroke="#eac898" stroke-width="2"/>
 <path d="M-5-23v9q5 5 11 0v-10" fill="#dca17f"/><circle cx="-12" cy="-31" r="3" fill="#e3ac89"/><circle cx="12" cy="-31" r="3" fill="#e3ac89"/><path d="M-12-37q0-15 14-14 15 1 13 17l-4 15q-9 10-19 0z" fill="#e9b894"/>
 <path d="M-13-29q-5-19 7-25 11-6 20 5 7 6 1 23l-4-12q-11 1-18-8-1 11-6 17" fill="#374342"/><circle cx="-4" cy="-31" r="1.1" fill="#374342"/><circle cx="6" cy="-31" r="1.1" fill="#374342"/><path d="m1-29-1 4h3m-7 5q5 4 9-1" fill="none" stroke="#b17560" stroke-width="1.2" stroke-linecap="round"/>
 </g></g>`;
}
export function drawTrain(x,y,scale=1){
 return `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="38" cy="67" rx="38" ry="4" fill="#263e4420"/>${box(1,0,74,61,'#e7ede3',12,'#47675a')}${box(18,3,40,8,'#354b43',2)}<text x="28" y="9" font-size="5" fill="#e8dfaa" font-family="sans-serif">LOCAL</text>${box(8,14,60,23,'#a9cbd2',5)}<path d="m12 18 14-1-11 16m24-19v23" fill="none" stroke="#edf5ef" stroke-width="2"/>${box(2,40,72,12,'#577d65',1)}<circle cx="12" cy="46" r="3" fill="#f5df9b"/><circle cx="64" cy="46" r="3" fill="#f5df9b"/>${box(29,54,18,7,'#405449',2)}${box(9,59,12,7,'#405449',2)}${box(55,59,12,7,'#405449',2)}<path d="M-4 69h84M-7 74h90" stroke="#8d9a8a" stroke-width="2"/></g>`;
}
export function drawStation(x,y){
 return `<g transform="translate(${x} ${y})"><ellipse cx="75" cy="145" rx="77" ry="6" fill="#405b4920"/>
 <path d="M-7 40 24 13h99l31 27-8 7H0z" fill="#526f5a"/><path d="m2 37 25-21h94l24 21" stroke="#91a17c" stroke-width="2" fill="none"/>${box(7,40,135,78,'#f4ebd7',3,'#c0b99e')}${box(23,18,102,29,'#fff9eb',5,'#869778')}
 <rect x="31" y="25" width="13" height="13" rx="3" fill="#4e6d57"/><path d="M34 29h7m-7 3h7m-6 4-2 3m7-3 2 3" stroke="#fff8e2" stroke-width="1"/><text x="51" y="37" font-size="13" font-weight="700" fill="#314d3b" font-family="Meiryo,sans-serif">サンプル駅</text>
 ${box(16,52,34,24,'#b8d0cd',2,'#97aaa2')}${box(102,52,31,24,'#b8d0cd',2,'#97aaa2')}<path d="M33 53v22m84-22v22" stroke="#f7f1df" stroke-width="2"/>${box(58,56,35,59,'#d5e0d0',2,'#97aaa2')}
 <text x="63" y="70" font-size="11" fill="#3d5946" font-family="Meiryo,sans-serif">改札</text>${box(63,79,9,34,'#607d6c',2)}${box(80,79,9,34,'#607d6c',2)}<path d="m65 87 3-3 3 3m11 0 3-3 3 3" fill="none" stroke="#e4efbb" stroke-width="1.5"/>
 ${box(0,115,151,9,'#b8b9aa',2)}${box(0,116,151,3,'#e0bf63',0)}<path d="M-3 137h158m-158 9h158" stroke="#8a9589" stroke-width="3"/>${Array.from({length:11},(_,i)=>`<path d="M${i*15} 134v15" stroke="#b0b3a2" stroke-width="2"/>`).join('')}${drawTrain(101,105,.52)}
 </g>`;
}
export function drawCity(){
 return `<g opacity=".85">${box(33,61,51,33,'#e0d7bc',5)}${box(92,60,55,36,'#dce3cd',5)}${box(38,108,29,29,'#d9dfc9',5)}${box(149,210,63,27,'#e3d8bb',5)}${box(228,61,56,29,'#e1ddc8',5)}<path d="M34 155h212V107h38M126 64v170M38 228h252" fill="none" stroke="#fffdf1" stroke-width="13"/><path d="M34 155h212V107h38M126 64v170M38 228h252" fill="none" stroke="#dce2d0" stroke-width="1.5"/><g fill="#a9be95"><circle cx="266" cy="205" r="15"/><circle cx="282" cy="219" r="11"/><circle cx="213" cy="76" r="10"/></g><path d="M266 203v21m16-7v16m-69-160v17" stroke="#82987a" stroke-width="2"/></g>`;
}
export function drawIcon(name,x,y,size=24,color='#627b68'){
 const paths={calendar:'M4 5h16v16H4zM4 10h16M8 2v6m8-6v6M7 14h3m3 0h3m-9 4h3m3 0h3',document:'M6 2h9l5 5v15H6zM15 2v6h5M9 12h8m-8 4h8',bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zm5 3h4',server:'M3 3h18v7H3zM3 14h18v7H3zM6 6h1m3 0h7M6 17h1m3 0h7',browser:'M3 4h18v16H3zM3 9h18M6 6h1m2 0h1m2 0h1',search:'M16 16l6 6M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',arrow:'M3 12h17m-7-7 7 7-7 7',clock:'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18M12 7v6l4 2'};
 return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]?`<path d="${paths[name]}"/>`:''}</svg>`;
}
export function drawBot(cx,cy){return `<g><circle cx="${cx}" cy="${cy}" r="33" fill="#4d6c5b" stroke="#a1d5ae" stroke-width="4"/>${box(cx-19,cy-14,38,30,'#d3e5cf',9)}${box(cx-14,cy-8,28,14,'#415e50',5)}<circle cx="${cx-7}" cy="${cy-1}" r="3" fill="#bce8d1"/><circle cx="${cx+7}" cy="${cy-1}" r="3" fill="#bce8d1"/><path d="M${cx-7} ${cy+11}h14m-7-25v-7" stroke="#769b77" stroke-width="2"/><circle cx="${cx}" cy="${cy-23}" r="3" fill="#e1c17c"/></g>`}
export function drawAvatar(cx,cy){return `<g><circle cx="${cx}" cy="${cy}" r="33" fill="#607a96" stroke="#c5d7ed" stroke-width="2"/><path d="M${cx-22} ${cy+23}q2-22 22-22t22 22" fill="#d3e0e1"/><circle cx="${cx}" cy="${cy-7}" r="12" fill="#e7b28d"/><path d="M${cx-12} ${cy-6}q-5-20 10-20 18 0 15 20l-6-11q-10 5-19 0z" fill="#394751"/></g>`}
export function drawRobot(x,y,color,id){return `<g><ellipse cx="${x+1}" cy="${y+3}" rx="12" ry="10" fill="#2e4b3425"/><circle cx="${x}" cy="${y}" r="10" fill="${color}" stroke="#f7f8ec" stroke-width="2"/><path d="m${x+9} ${y-4} 4 4-4 4" fill="#f7f8ec"/><text x="${x-3}" y="${y+3}" fill="#fff" font-size="8" font-family="sans-serif">${id}</text></g>`}
