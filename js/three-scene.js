/**
 * GABBS LUXURY STOREFRONT - THREE.JS 3D SCENES
 * 1. Hero Celestial Gold Particle Mesh
 * 2. Interactive 3D Brand Pillars Showcase (Icosahedron, Torus Knot, Octahedron)
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    console.warn('Three.js or WebGL not supported. Falling back to CSS visuals.');
    return;
  }

  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     SCENE 1: HERO CELESTIAL GOLD PARTICLE FIELD
     ========================================================================== */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const heroSection = document.getElementById('hero');
    let heroVisible = true;
    let heroAnimId = null;

    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(60, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
    heroCamera.position.z = 40;

    const heroRenderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle field
    const particleCount = isMobile ? 220 : (prefersReducedMotion ? 120 : 550);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      scales[i] = Math.random() * 2.2 + 0.8;
      alphas[i] = Math.random() * 0.7 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom circle texture for soft glowing gold dust
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 240, 215, 1)');
    grad.addColorStop(0.3, 'rgba(201, 169, 110, 0.85)');
    grad.addColorStop(0.7, 'rgba(166, 130, 68, 0.3)');
    grad.addColorStop(1, 'rgba(166, 130, 68, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const material = new THREE.PointsMaterial({
      size: 1.6,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color('#c9a96e')
    });

    const particles = new THREE.Points(geometry, material);
    heroScene.add(particles);

    // Ambient floating golden geometric cage
    const ringGeo = new THREE.TorusGeometry(18, 0.08, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc9a96e,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    heroScene.add(ringMesh);

    // Mouse parallax tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 8;
      targetY = (e.clientY / window.innerHeight - 0.5) * 8;
    }, { passive: true });

    // Scroll parallax integration
    let scrollOffset = 0;
    window.addEventListener('scroll', () => {
      if (heroVisible) {
        scrollOffset = window.scrollY * 0.035;
      }
    }, { passive: true });

    // Render loop
    const clock = new THREE.Clock();

    function renderHero() {
      if (!heroVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      if (!prefersReducedMotion) {
        particles.rotation.y = time * 0.05 + currentX * 0.05;
        particles.rotation.x = time * 0.03 + currentY * 0.05;
        ringMesh.rotation.z = time * 0.04;
        ringMesh.rotation.y = time * 0.02 + currentX * 0.03;
      }

      heroCamera.position.x = currentX * 0.8;
      heroCamera.position.y = -currentY * 0.8 - scrollOffset;
      heroCamera.lookAt(heroScene.position);

      heroRenderer.render(heroScene, heroCamera);
      heroAnimId = requestAnimationFrame(renderHero);
    }

    // Intersection observer for performance
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) {
          if (!heroAnimId) renderHero();
        } else {
          cancelAnimationFrame(heroAnimId);
          heroAnimId = null;
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(heroSection || heroCanvas);

    // Window resize
    window.addEventListener('resize', () => {
      if (!heroCanvas) return;
      heroCamera.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
    });

    renderHero();
  }


  /* ==========================================================================
     SCENE 2: FIVE PILLARS 3D CRYSTAL-CLEAR SHOWCASE
     Ultra-sharp, vivid product presentation:
     - Full high-DPI retina rendering (pixelRatio up to 2.5x)
     - sRGB color space outputEncoding for rich, punchy, uncompressed colors
     - 16x Anisotropic filtering for razor-sharp micro-detail at all angles
     - toneMapped: false for 100% pure RGB fidelity
     - Minimal alpha threshold (0.005) preserving every subpixel edge
     - iOS Liquid Glass crystal box plinth with ultra-high transmission & bevel glints
     ========================================================================== */

  var pillarDefs = [
    {
      id: 'pillar-canvas-0',
      key: 'supermarket',
      fallback: 'supermarket.png',
      name: 'Supermarket',
      accent: 0xc9a96e, // Warm Champagne Gold
      innerGlow: 0xd4af37,
      boxW: 3.1,
      boxH: 3.1,
      planeW: 2.85,
      planeH: 2.85
    },
    {
      id: 'pillar-canvas-1',
      key: 'fashion',
      fallback: 'fashion.png',
      name: 'Fashion & Lifestyle',
      accent: 0x3b82f6, // Royal Sapphire
      innerGlow: 0x1d4ed8,
      boxW: 3.1,
      boxH: 3.1,
      planeW: 1.98,
      planeH: 2.95
    },
    {
      id: 'pillar-canvas-2',
      key: 'health',
      fallback: 'health.png',
      name: 'Health & Wellness',
      accent: 0xef4444, // Ruby Crimson
      innerGlow: 0xdc2626,
      boxW: 3.1,
      boxH: 3.1,
      planeW: 2.95,
      planeH: 2.20
    },
    {
      id: 'pillar-canvas-3',
      key: 'bakery',
      fallback: 'bakery.png',
      name: 'Bakery',
      accent: 0xf59e0b, // Warm Amber
      innerGlow: 0xd97706,
      boxW: 3.1,
      boxH: 3.1,
      planeW: 2.95,
      planeH: 2.20
    },
    {
      id: 'pillar-canvas-4',
      key: 'village',
      fallback: 'village.png',
      name: 'Village Market',
      accent: 0x10b981, // Emerald Green
      innerGlow: 0x059669,
      boxW: 3.1,
      boxH: 3.1,
      planeW: 2.95,
      planeH: 2.20
    }
  ];

  // ---------------------------------------------------------------------------
  // HELPER: Resolve Texture URL (Base64 cache fallback guarantees zero CORS)
  // ---------------------------------------------------------------------------
  function getPillarTextureUrl(key, fallbackFile) {
    if (window.PILLAR_TEXTURE_DATA && window.PILLAR_TEXTURE_DATA[key]) {
      return window.PILLAR_TEXTURE_DATA[key];
    }
    return 'assets/images/pillars/' + fallbackFile;
  }

  // ---------------------------------------------------------------------------
  // HELPER: Create Extruded Rounded Square / Box Geometry with Smooth Bevel
  // ---------------------------------------------------------------------------
  function createRoundedBoxGeometry(w, h, depth, radius, bevel) {
    radius = Math.min(radius !== undefined ? radius : 0.36, Math.min(w, h) / 2);
    bevel = bevel !== undefined ? bevel : 0.04;

    var shape = new THREE.Shape();
    var x = -w / 2;
    var y = -h / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + w - radius, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + radius);
    shape.lineTo(x + w, y + h - radius);
    shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    shape.lineTo(x + radius, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    var extrudeSettings = {
      depth: depth,
      bevelEnabled: bevel > 0,
      bevelSegments: 4,
      steps: 1,
      bevelSize: bevel,
      bevelThickness: bevel
    };

    var geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }

  // ---------------------------------------------------------------------------
  // HELPER: Build 3D Liquid-Glass Box Tile & Ultra-Vivid Product Artwork
  // ---------------------------------------------------------------------------
  function buildPillarObject(def, textureLoader, renderer) {
    var root = new THREE.Group();

    // 1. Outer Liquid Glass Rounded Box Tile (Pristine High-Clarity Crystal)
    var boxGeo = createRoundedBoxGeometry(def.boxW, def.boxH, 0.14, 0.36, 0.04);
    var boxMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(def.accent).lerp(new THREE.Color(0xffffff), 0.82),
      transparent: true,
      opacity: 0.85,
      transmission: 0.85,
      ior: 1.52,
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    var boxMesh = new THREE.Mesh(boxGeo, boxMat);
    root.add(boxMesh);

    // 2. Inner Luminescent Core Halo Slab
    var coreGeo = createRoundedBoxGeometry(def.boxW * 0.94, def.boxH * 0.94, 0.08, 0.3, 0.02);
    var coreMat = new THREE.MeshBasicMaterial({
      color: def.innerGlow,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    var coreMesh = new THREE.Mesh(coreGeo, coreMat);
    root.add(coreMesh);

    // 3. Specular Perimeter Edge Ring (crisp 1px glowing contour)
    var edges = new THREE.EdgesGeometry(boxGeo, 24);
    var rimMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(def.accent).lerp(new THREE.Color(0xffffff), 0.8),
      transparent: true,
      opacity: 0.28,
      depthWrite: false
    });
    var rimMesh = new THREE.LineSegments(edges, rimMat);
    root.add(rimMesh);

    // 4. Load & Configure Ultra-Sharp, Vivid Texture
    var maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16;
    var texUrl = getPillarTextureUrl(def.key, def.fallback);
    var artTexture = textureLoader.load(texUrl);

    // Color space & extreme sharpness filtering
    artTexture.encoding = THREE.sRGBEncoding;
    artTexture.anisotropy = maxAnisotropy;
    artTexture.generateMipmaps = true;
    artTexture.minFilter = THREE.LinearMipmapLinearFilter;
    artTexture.magFilter = THREE.LinearFilter;

    var artPlaneGeo = new THREE.PlaneGeometry(def.planeW, def.planeH);

    // Front Graphic Plane (floating in front of crystal tile with pure RGB fidelity)
    var frontArtMat = new THREE.MeshBasicMaterial({
      map: artTexture,
      transparent: true,
      alphaTest: 0.005,
      toneMapped: false,
      depthWrite: false,
      side: THREE.FrontSide
    });
    var frontPlane = new THREE.Mesh(artPlaneGeo, frontArtMat);
    frontPlane.position.z = 0.12;
    root.add(frontPlane);

    // Front Contact Drop Shadow (casts soft ambient occlusion onto glass surface)
    var shadowMat = new THREE.MeshBasicMaterial({
      map: artTexture,
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.FrontSide
    });
    var shadowPlane = new THREE.Mesh(artPlaneGeo, shadowMat);
    shadowPlane.position.set(0.03, -0.03, 0.03);
    shadowPlane.scale.set(0.96, 0.96, 1.0);
    root.add(shadowPlane);

    // Back Graphic Plane (finished double-sided crystal tile)
    var backArtMat = new THREE.MeshBasicMaterial({
      map: artTexture,
      transparent: true,
      alphaTest: 0.005,
      toneMapped: false,
      depthWrite: false,
      side: THREE.FrontSide
    });
    var backPlane = new THREE.Mesh(artPlaneGeo, backArtMat);
    backPlane.rotation.y = Math.PI;
    backPlane.position.z = -0.12;
    root.add(backPlane);

    var backShadowPlane = new THREE.Mesh(artPlaneGeo, shadowMat);
    backShadowPlane.rotation.y = Math.PI;
    backShadowPlane.position.set(-0.03, -0.03, -0.03);
    backShadowPlane.scale.set(0.96, 0.96, 1.0);
    root.add(backShadowPlane);

    return root;
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: Smooth Mouse & Touch Dragging with Elastic Settle
  // ---------------------------------------------------------------------------
  function setupDragInteraction(canvasEl, state) {
    var isDown = false;
    var prevX = 0, prevY = 0;

    function onStart(x, y) {
      isDown = true;
      state.isDragging = true;
      prevX = x;
      prevY = y;
      state.velocityX = 0;
      state.velocityY = 0;
    }

    function onMove(x, y) {
      if (!isDown) return;
      var dx = x - prevX;
      var dy = y - prevY;
      state.dragYaw += dx * 0.01;
      state.dragPitch += dy * 0.01;
      state.velocityY = dx * 0.01;
      state.velocityX = dy * 0.01;
      prevX = x;
      prevY = y;
    }

    function onEnd() {
      isDown = false;
      state.isDragging = false;
    }

    canvasEl.addEventListener('mousedown', function (e) {
      onStart(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', function (e) {
      if (isDown) onMove(e.clientX, e.clientY);
    }, { passive: true });
    window.addEventListener('mouseup', function () {
      if (isDown) onEnd();
    });

    canvasEl.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (isDown && e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchend', function () {
      if (isDown) onEnd();
    });

    // Mouse hover parallax tilt
    canvasEl.addEventListener('mousemove', function (e) {
      if (isDown) return;
      var rect = canvasEl.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width - 0.5;
      var ny = (e.clientY - rect.top) / rect.height - 0.5;
      state.targetHoverYaw = nx * 0.32;
      state.targetHoverPitch = -ny * 0.22;
    });
    canvasEl.addEventListener('mouseleave', function () {
      state.targetHoverYaw = 0;
      state.targetHoverPitch = 0;
    });
  }

  // ---------------------------------------------------------------------------
  // MAIN SETUP: Initialize scenes, cameras, lighting & renderers
  // ---------------------------------------------------------------------------
  var pillarInstances = [];
  var pillarsVisible = false;
  var pillarAnimId = null;
  var pillarSection = document.getElementById('brand-pillars');
  var activePillarCount = 0;
  var textureLoader = new THREE.TextureLoader();

  for (var pi = 0; pi < pillarDefs.length; pi++) {
    var def = pillarDefs[pi];
    var canvas = document.getElementById(def.id);

    if (!canvas) {
      pillarInstances.push(null);
      continue;
    }
    activePillarCount++;

    var scene = new THREE.Scene();

    var w = canvas.clientWidth || 260;
    var h = canvas.clientHeight || 260;
    var aspect = w / h;

    // Optimized closer camera distance (5.1) for crystal-clear micro-details
    var camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.z = 5.1;

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    // CRITICAL: setPixelRatio BEFORE setSize for true high-DPI retina sharpness
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);

    // Set sRGB color space output for vivid, punchy colors
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Studio lighting with chromatic dispersion & internal luminescence
    var ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    // Specular key light (crisp highlight glints across box bevel)
    var keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Chromatic dispersion rim light 1 (cool cyan-blue edge)
    var cyanRim = new THREE.PointLight(0x38bdf8, 1.3, 25);
    cyanRim.position.set(-4, 3, -4);
    scene.add(cyanRim);

    // Chromatic dispersion rim light 2 (warm magenta-gold edge)
    var warmRim = new THREE.PointLight(0xf43f5e, 1.1, 25);
    warmRim.position.set(4, -3, -3);
    scene.add(warmRim);

    // Soft internal luminescence centered within the crystal tile
    var internalGlow = new THREE.PointLight(def.innerGlow, 1.6, 7);
    internalGlow.position.set(0, 0, 0);
    scene.add(internalGlow);

    // Build the 3D liquid-glass box tile with ultra-sharp product artwork
    var objectGroup = buildPillarObject(def, textureLoader, renderer);
    scene.add(objectGroup);

    var state = {
      scene: scene,
      camera: camera,
      renderer: renderer,
      canvas: canvas,
      objectGroup: objectGroup,
      isDragging: false,
      dragYaw: 0,
      dragPitch: 0,
      velocityX: 0,
      velocityY: 0,
      hoverYaw: 0,
      hoverPitch: 0,
      targetHoverYaw: 0,
      targetHoverPitch: 0,
      baseScale: 1.0,
      scrollScale: 1.0,
      tumblePhase: pi * 1.25
    };

    setupDragInteraction(canvas, state);
    pillarInstances.push(state);
  }

  // ---------------------------------------------------------------------------
  // SHARED RENDER LOOP: Organic floating, perspective tilt & elastic settle
  // ---------------------------------------------------------------------------
  var pillarClock = new THREE.Clock();
  var lastRenderTime = performance.now();

  function renderPillars() {
    if (!pillarsVisible) return;

    var now = performance.now();
    var delta = Math.min((now - lastRenderTime) / 1000, 0.1);
    lastRenderTime = now;
    var time = pillarClock.getElapsedTime();

    for (var i = 0; i < pillarInstances.length; i++) {
      var inst = pillarInstances[i];
      if (!inst) continue;

      var obj = inst.objectGroup;

      // 1. Natural Bounded 3D Gyroscopic Floating Motion (keeps artwork crisp and prominent)
      var autoYaw = Math.sin(time * 0.85 + inst.tumblePhase) * 0.28;   // ~16° left/right sway
      var autoPitch = Math.cos(time * 0.65 + inst.tumblePhase) * 0.15; // ~8.5° up/down tilt
      var autoRoll = Math.sin(time * 0.45 + inst.tumblePhase) * 0.04;  // ~2.3° banking roll

      // 2. Mouse Hover Parallax Smooth Interpolation
      inst.hoverYaw += (inst.targetHoverYaw - inst.hoverYaw) * 0.1;
      inst.hoverPitch += (inst.targetHoverPitch - inst.hoverPitch) * 0.1;

      if (!inst.isDragging) {
        // Elastic decay on drag release momentum
        inst.velocityX *= 0.90;
        inst.velocityY *= 0.90;
        inst.dragPitch += inst.velocityX;
        inst.dragYaw += inst.velocityY;

        // Smoothly settle drag back toward center
        inst.dragYaw *= 0.985;
        inst.dragPitch *= 0.985;
      }

      // 3. Composite Final 3D Orientation
      obj.rotation.y = autoYaw + inst.dragYaw + inst.hoverYaw;
      obj.rotation.x = autoPitch + inst.dragPitch + inst.hoverPitch;
      obj.rotation.z = autoRoll;

      // 4. Weightless Floating Bob on Y Axis
      obj.position.y = Math.sin(time * 1.5 + inst.tumblePhase) * 0.08;

      // 5. Constellation Scale Modulation (Scroll morph)
      var targetScale = inst.baseScale * inst.scrollScale;
      obj.scale.set(targetScale, targetScale, targetScale);

      inst.renderer.render(inst.scene, inst.camera);
    }

    pillarAnimId = requestAnimationFrame(renderPillars);
  }

  // ---------------------------------------------------------------------------
  // INTERSECTION OBSERVER: Pause rendering when off-screen for peak 60fps performance
  // ---------------------------------------------------------------------------
  if (activePillarCount > 0 && pillarSection) {
    var pillarObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        pillarsVisible = entry.isIntersecting;
        if (pillarsVisible) {
          if (!pillarAnimId) {
            lastRenderTime = performance.now();
            pillarClock.getDelta();
            renderPillars();
          }
        } else {
          if (pillarAnimId) {
            cancelAnimationFrame(pillarAnimId);
            pillarAnimId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    pillarObserver.observe(pillarSection);
  }

  // ---------------------------------------------------------------------------
  // RESIZE HANDLER (Preserves High-DPI sharpness on all screens)
  // ---------------------------------------------------------------------------
  window.addEventListener('resize', function () {
    for (var i = 0; i < pillarInstances.length; i++) {
      var inst = pillarInstances[i];
      if (!inst) continue;
      var w = inst.canvas.clientWidth;
      var h = inst.canvas.clientHeight;
      if (w === 0 || h === 0) continue;
      inst.camera.aspect = w / h;
      inst.camera.updateProjectionMatrix();
      inst.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
      inst.renderer.setSize(w, h, false);
    }
  });

  // ---------------------------------------------------------------------------
  // GLOBAL CONTROLLER INTERFACE
  // ---------------------------------------------------------------------------
  window.pillarObjectsController = {
    setSpread: function () { /* No-op: independent grid */ },
    setScale: function (val) {
      for (var i = 0; i < pillarInstances.length; i++) {
        if (pillarInstances[i]) {
          pillarInstances[i].baseScale = val;
        }
      }
    },
    onScroll: function (progress) {
      // Morph constellation on scroll through section
      var morph = 1.0 + Math.sin(progress * Math.PI) * 0.08;
      for (var i = 0; i < pillarInstances.length; i++) {
        if (pillarInstances[i]) {
          pillarInstances[i].scrollScale = morph;
        }
      }
    }
  };

  // Start rendering if in view on initial load
  if (activePillarCount > 0 && !pillarSection) {
    pillarsVisible = true;
    renderPillars();
  }

})();
