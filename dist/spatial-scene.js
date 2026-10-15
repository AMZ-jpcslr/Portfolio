// Three.js is fetched only when the gallery approaches the viewport.
export async function createProjectScene({container, projects, onContextLost}) {
  const canvas = document.createElement('canvas');
  const constrained = matchMedia('(max-width:760px), (pointer:coarse)');
  let compact = constrained.matches;
  const context = canvas.getContext('webgl2', {alpha: false, antialias: true, powerPreference: 'low-power'});
  if (!context) throw new Error('3D context unavailable');
  const THREE = await import('./vendor/three/three.module.min.js');
  await document.fonts.ready;
  const palette = getComputedStyle(document.documentElement);
  const ink = palette.getPropertyValue('--ink').trim();
  const paper = palette.getPropertyValue('--panel').trim();
  const accent = palette.getPropertyValue('--editorial-accent').trim();
  const wash = palette.getPropertyValue('--wash').trim();
  const renderer = new THREE.WebGLRenderer({canvas, context, antialias: true});
  renderer.setClearColor(ink);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(ink, 12, 24);
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
  const rig = new THREE.Group();
  scene.add(rig);
  scene.add(new THREE.HemisphereLight(paper, ink, 2.3));
  const light = new THREE.DirectionalLight(paper, 3);
  light.position.set(-4, 7, 5);
  scene.add(light);

  const geometries = new Set(), materials = new Set(), textures = new Set();
  const geometry = item => (geometries.add(item), item);
  const material = item => (materials.add(item), item);
  const paperSide = material(new THREE.MeshStandardMaterial({color: paper, roughness: .72, metalness: .1}));
  const darkSide = material(new THREE.MeshStandardMaterial({color: ink, roughness: .55, metalness: .2}));
  const orange = material(new THREE.MeshStandardMaterial({color: accent, roughness: .5, metalness: .15}));
  const shell = geometry(new THREE.BoxGeometry(2.04, 2.65, .11));
  const surface = geometry(new THREE.PlaneGeometry(2, 2.61));
  const edges = geometry(new THREE.EdgesGeometry(shell));
  const edgeMaterial = material(new THREE.LineBasicMaterial({color: '#a9b8b8', transparent: true, opacity: .5}));

  function drawTexture(project) {
    const image = document.createElement('canvas');
    image.width = 1024; image.height = 1328;
    const c = image.getContext('2d');
    c.scale(2, 2);
    c.fillStyle = paper; c.fillRect(0, 0, 512, 664);
    c.fillStyle = accent; c.fillRect(28, 30, 44, 4);
    c.font = '500 19px "Portfolio Sans", sans-serif';
    c.fillStyle = ink; c.fillText(`${project.number} / 07`, 390, 39);
    c.font = '500 17px "Portfolio Sans", sans-serif';
    c.fillText(project.label, 30, 83);
    c.font = '600 34px "Portfolio Sans", sans-serif';
    let line = '', y = 137;
    for (const char of project.title) {
      if (c.measureText(line + char).width > 450) { c.fillText(line, 30, y); line = ''; y += 43; }
      line += char;
    }
    c.fillText(line, 30, y);
    c.fillStyle = wash; c.fillRect(28, 255, 456, 315);
    c.strokeStyle = ink; c.lineWidth = 2;
    const box = (x, yy, w, h, fill = paper) => { c.fillStyle = fill; c.fillRect(x, yy, w, h); };
    const stroke = (x, yy, w, h) => c.strokeRect(x, yy, w, h);
    const circle = (x, yy, radius, fill) => { c.beginPath(); c.arc(x, yy, radius, 0, Math.PI * 2); c.fillStyle = fill; c.fill(); };
    if (project.kind === 'career') {
      box(50, 279, 412, 38, ink); box(65, 294, 105, 6, paper);
      for (let row = 0; row < 5; row++) for (let col = 0; col < 6; col++) {
        stroke(50 + col * 69, 333 + row * 40, 68, 40);
      }
      box(122, 383, 127, 15, accent); box(261, 463, 125, 15, ink); box(53, 422, 57, 15, accent);
    } else if (project.kind === 'stream') {
      box(49, 279, 414, 264, ink); box(62, 293, 60, 235, wash); box(367, 293, 82, 235, wash);
      box(135, 306, 219, 190, paper); c.strokeStyle = accent; stroke(156, 337, 173, 75);
      c.fillStyle = ink; c.font = '600 22px "Portfolio Sans", sans-serif'; c.fillText('YOUR SCREEN', 158, 382);
      box(384, 318, 49, 12, accent); box(384, 347, 49, 5, ink); box(384, 366, 33, 5, ink);
    } else if (project.kind === 'voice') {
      circle(113, 346, 32, ink); box(170, 320, 249, 72, paper); box(190, 342, 179, 8, ink); box(190, 365, 137, 6, ink);
      circle(113, 466, 32, accent); c.strokeStyle = accent; c.lineWidth = 3; c.beginPath(); c.arc(113, 466, 43, 0, Math.PI * 2); c.stroke();
      for (let i = 0; i < 15; i++) box(176 + i * 16, 466 - (i % 4 * 7 + 10), 6, i % 4 * 14 + 20, ink);
    } else if (project.kind === 'weather') {
      box(55, 281, 402, 60, ink); box(71, 301, 152, 12, paper);
      c.strokeStyle = accent; c.lineWidth = 4; c.beginPath(); c.moveTo(55, 447);
      for (const [x, yy] of [[108,447],[134,425],[156,465],[185,377],[214,483],[243,408],[273,452],[302,427],[331,447],[455,447]]) c.lineTo(x, yy);
      c.stroke(); box(70, 511, 128, 8, ink); box(269, 511, 118, 8, ink);
    } else if (project.kind === 'moral') {
      for (let i = 0; i < 3; i++) { box(52 + i * 140, 340, 121, 131, paper); c.strokeStyle = i === 2 ? accent : ink; stroke(52 + i * 140, 340, 121, 131); circle(113 + i * 140, 382, 15, i === 2 ? accent : ink); box(70 + i * 140, 423, 86, 5, ink); }
      c.strokeStyle = ink; c.lineWidth = 2; c.beginPath(); c.moveTo(173, 404); c.lineTo(192, 404); c.moveTo(313, 404); c.lineTo(332, 404); c.stroke();
    } else if (project.kind === 'proxy') {
      box(50, 282, 412, 45, ink);
      for (let i = 0; i < 5; i++) { box(50, 344 + i * 36, 412, 29, paper); box(65, 355 + i * 36, 35, 5, accent); box(119, 355 + i * 36, 220 - i * 22, 5, ink); }
    } else {
      box(48, 279, 416, 268, ink); c.strokeStyle = wash; c.lineWidth = 2; stroke(64, 294, 384, 237);
      c.beginPath(); c.moveTo(256, 294); c.lineTo(256, 531); c.stroke(); c.beginPath(); c.arc(256, 412, 48, 0, Math.PI * 2); c.stroke();
      for (const [x, yy] of [[108,414],[173,344],[210,460],[310,344],[354,460],[408,414]]) circle(x, yy, 12, x < 256 ? paper : accent);
      circle(276, 434, 6, '#e9b67d');
    }
    c.fillStyle = ink; c.font = '500 16px "Portfolio Sans", sans-serif';
    c.fillText('PERSONAL PROJECT / UI STUDY', 30, 616);
    const texture = new THREE.CanvasTexture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), compact ? 4 : 8);
    textures.add(texture);
    return texture;
  }

  const cards = projects.map((project, index) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(shell, index % 2 ? darkSide : paperSide);
    const face = new THREE.Mesh(surface, material(new THREE.MeshBasicMaterial({map: drawTexture(project), toneMapped: false})));
    face.position.z = .059;
    face.userData.index = index;
    body.userData.index = index;
    group.add(body, face, new THREE.LineSegments(edges, edgeMaterial));
    const spine = new THREE.Mesh(geometry(new THREE.BoxGeometry(.035, 2.65, .14)), orange);
    spine.position.set(-1.01, 0, 0); group.add(spine);
    rig.add(group);
    return {group, face, body};
  });
  const podium = new THREE.Mesh(geometry(new THREE.CylinderGeometry(4.08, 4.13, .10, 72)), material(new THREE.MeshStandardMaterial({color: '#26373e', roughness: .9})));
  podium.position.y = -1.77; rig.add(podium);
  const track = new THREE.Mesh(geometry(new THREE.TorusGeometry(3.66, .011, 5, 100)), orange);
  track.rotation.x = Math.PI / 2; track.position.y = -1.70; rig.add(track);
  const tickGeometry = geometry(new THREE.BoxGeometry(.035, .008, .14));
  for (let i = 0; i < 42; i++) {
    const angle = i * Math.PI / 21;
    const tick = new THREE.Mesh(tickGeometry, i % 6 ? darkSide : paperSide);
    tick.position.set(Math.sin(angle) * 3.88, -1.70, Math.cos(angle) * 3.88);
    tick.rotation.y = angle; rig.add(tick);
  }
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 64;
  const sc = shadowCanvas.getContext('2d');
  const gradient = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, '#00000075'); gradient.addColorStop(1, '#00000000');
  sc.fillStyle = gradient; sc.fillRect(0, 0, 64, 64);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas); textures.add(shadowTexture);
  const shadowMaterial = material(new THREE.MeshBasicMaterial({map: shadowTexture, transparent: true, depthWrite: false}));
  const shadows = cards.map(() => { const plane = new THREE.Mesh(geometry(new THREE.PlaneGeometry(2.7, 2.0)), shadowMaterial); plane.rotation.x = -Math.PI / 2; plane.position.y = -1.708; rig.add(plane); return plane; });
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let width = 1, height = 1;
  function resize() {
    width = container.clientWidth; height = container.clientHeight;
    if (!width || !height) return;
    compact = constrained.matches;
    // Sharpen high-density displays, while bounding the total fill cost.
    const pixelBudget = compact ? 550000 : 2400000;
    renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.5 : 2, Math.sqrt(pixelBudget / (width * height))));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(0, camera.aspect < 1.3 ? 4.5 : 3.4, camera.aspect < 1.3 ? 12.9 : 10.7);
    camera.lookAt(0, -.12, 0);
    camera.updateProjectionMatrix();
  }
  function draw({angle, time = 0, pointerX = 0, pointerY = 0}) {
    rig.rotation.y = pointerX * .055;
    rig.rotation.x = pointerY * .025;
    cards.forEach(({group}, i) => {
      const a = i * Math.PI * 2 / cards.length - angle;
      group.position.set(Math.sin(a) * 3.08, .18 + Math.sin(time * .7 + i) * .075, Math.cos(a) * 2.0);
      group.rotation.set(-.045 + Math.sin(time * .45 + i) * .025, -Math.sin(a) * .35, Math.sin(a) * -.06);
      shadows[i].position.x = group.position.x; shadows[i].position.z = group.position.z;
    });
    renderer.render(scene, camera);
  }
  function hit(clientX, clientY) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set((clientX - bounds.left) / width * 2 - 1, -(clientY - bounds.top) / height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(cards.flatMap(card => [card.face, card.body]), false)[0]?.object.userData.index;
  }
  const lost = event => { event.preventDefault(); onContextLost(); };
  canvas.addEventListener('webglcontextlost', lost);
  container.append(canvas);
  resize();
  return {
    draw, resize, hit, get compact() { return compact; },
    dispose() {
      canvas.removeEventListener('webglcontextlost', lost);
      for (const item of geometries) item.dispose();
      for (const item of materials) item.dispose();
      for (const item of textures) item.dispose();
      renderer.dispose(); canvas.remove();
    }
  };
}
