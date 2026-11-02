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
     SCENE 2: 3D INTERACTIVE SHOWCASE (BRAND PILLARS)
     Floating Icosahedron, Torus Knot & Octahedron
     ========================================================================== */
  const showcaseCanvas = document.getElementById('showcase-canvas');
  if (showcaseCanvas) {
    const showcaseSection = document.getElementById('brand-pillars');
    let showcaseVisible = false;
    let showcaseAnimId = null;

    const showcaseScene = new THREE.Scene();
    const showcaseCamera = new THREE.PerspectiveCamera(45, showcaseCanvas.clientWidth / showcaseCanvas.clientHeight, 0.1, 100);
    showcaseCamera.position.set(0, 0, 18);

    const showcaseRenderer = new THREE.WebGLRenderer({
      canvas: showcaseCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    showcaseRenderer.setSize(showcaseCanvas.clientWidth, showcaseCanvas.clientHeight);
    showcaseRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    showcaseScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc9a96e, 2.5, 50);
    pointLight1.position.set(10, 15, 15);
    showcaseScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xdfc28d, 1.8, 50);
    pointLight2.position.set(-10, -10, 10);
    showcaseScene.add(pointLight2);

    // Group for objects
    const objectsGroup = new THREE.Group();
    showcaseScene.add(objectsGroup);

    // Material helper: Luxury Gold Wireframe + Faceted Core
    function createLuxuryObject(geometry, solidGeometry, scale = 1.8) {
      const container = new THREE.Group();

      // Outer Wireframe
      const wireframeMat = new THREE.MeshStandardMaterial({
        color: 0xc9a96e,
        wireframe: true,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0x3d2f17,
        emissiveIntensity: 0.3
      });
      const wireMesh = new THREE.Mesh(geometry, wireframeMat);
      wireMesh.scale.set(scale, scale, scale);
      container.add(wireMesh);

      // Inner Core Mesh
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x141414,
        roughness: 0.2,
        metalness: 0.6,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.85
      });
      const coreMesh = new THREE.Mesh(solidGeometry || geometry, coreMat);
      coreMesh.scale.set(scale * 0.88, scale * 0.88, scale * 0.88);
      container.add(coreMesh);

      // Halo Accent ring
      const haloGeo = new THREE.RingGeometry(scale * 1.3, scale * 1.34, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xc9a96e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2.2;
      container.add(haloMesh);

      return { container, wireMesh, coreMesh, haloMesh };
    }

    // Geometry 1: ICOSAHEDRON (Quality)
    const icoDetail = isMobile ? 0 : 1;
    const icoGeo = new THREE.IcosahedronGeometry(1.6, icoDetail);
    const objQuality = createLuxuryObject(icoGeo, icoGeo, 1.3);

    // Geometry 2: TORUS KNOT (Curation)
    const knotTubular = isMobile ? 32 : 64;
    const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.32, knotTubular, 16);
    const objCuration = createLuxuryObject(knotGeo, knotGeo, 1.25);

    // Geometry 3: OCTAHEDRON (Experience)
    const octaGeo = new THREE.OctahedronGeometry(1.7, 0);
    const objExperience = createLuxuryObject(octaGeo, octaGeo, 1.3);

    objectsGroup.add(objQuality.container);
    objectsGroup.add(objCuration.container);
    objectsGroup.add(objExperience.container);

    // Initial positioning based on screen size
    function updateObjectSpread(spreadProgress = 1) {
      const spreadFactor = isMobile ? 3.5 : 6.8;
      objQuality.container.position.x = -spreadFactor * spreadProgress;
      objCuration.container.position.x = 0;
      objExperience.container.position.x = spreadFactor * spreadProgress;

      if (isMobile) {
        // Vertical stack on small screens
        objQuality.container.position.y = 4.2 * spreadProgress;
        objQuality.container.position.x = 0;
        objCuration.container.position.y = 0;
        objExperience.container.position.y = -4.2 * spreadProgress;
        objExperience.container.position.x = 0;
      } else {
        objQuality.container.position.y = 0;
        objCuration.container.position.y = 0;
        objExperience.container.position.y = 0;
      }
    }

    updateObjectSpread(1);

    // Expose spread controller for GSAP ScrollTrigger
    window.pillarObjectsController = {
      setSpread: function (val) {
        updateObjectSpread(val);
      },
      setScale: function (val) {
        objectsGroup.scale.set(val, val, val);
      }
    };

    // Mouse Tracking for Parallax
    let showcaseMouseX = 0;
    let showcaseMouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    window.addEventListener('mousemove', (e) => {
      showcaseMouseX = (e.clientX / window.innerWidth - 0.5) * 3;
      showcaseMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Interactive Hover raycaster on pillar cards
    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        const targetObj = index === 0 ? objQuality : (index === 1 ? objCuration : objExperience);
        gsap.to(targetObj.container.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.5, ease: 'power2.out' });
        targetObj.wireMesh.material.emissiveIntensity = 0.8;
      });
      card.addEventListener('mouseleave', () => {
        const targetObj = index === 0 ? objQuality : (index === 1 ? objCuration : objExperience);
        gsap.to(targetObj.container.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'power2.out' });
        targetObj.wireMesh.material.emissiveIntensity = 0.3;
      });
    });

    const showcaseClock = new THREE.Clock();

    function renderShowcase() {
      if (!showcaseVisible) return;

      const delta = showcaseClock.getDelta();
      const time = showcaseClock.getElapsedTime();

      // Camera parallax lerp
      targetCamX += (showcaseMouseX - targetCamX) * 0.05;
      targetCamY += (-showcaseMouseY - targetCamY) * 0.05;
      showcaseCamera.position.x = targetCamX;
      showcaseCamera.position.y = targetCamY;
      showcaseCamera.lookAt(0, 0, 0);

      // Autonomous rotation for each geometric object
      if (!prefersReducedMotion) {
        // Quality (Icosahedron)
        objQuality.container.rotation.x = time * 0.35;
        objQuality.container.rotation.y = time * 0.45;
        objQuality.haloMesh.rotation.z = -time * 0.2;

        // Curation (Torus Knot)
        objCuration.container.rotation.x = time * 0.25;
        objCuration.container.rotation.y = time * 0.38;
        objCuration.haloMesh.rotation.z = time * 0.25;

        // Experience (Octahedron)
        objExperience.container.rotation.x = time * 0.4;
        objExperience.container.rotation.z = time * 0.3;
        objExperience.haloMesh.rotation.z = -time * 0.3;
      }

      showcaseRenderer.render(showcaseScene, showcaseCamera);
      showcaseAnimId = requestAnimationFrame(renderShowcase);
    }

    // Visibility Observer
    const showcaseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        showcaseVisible = entry.isIntersecting;
        if (showcaseVisible) {
          if (!showcaseAnimId) renderShowcase();
        } else {
          cancelAnimationFrame(showcaseAnimId);
          showcaseAnimId = null;
        }
      });
    }, { threshold: 0.1 });

    showcaseObserver.observe(showcaseSection || showcaseCanvas);

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!showcaseCanvas) return;
      showcaseCamera.aspect = showcaseCanvas.clientWidth / showcaseCanvas.clientHeight;
      showcaseCamera.updateProjectionMatrix();
      showcaseRenderer.setSize(showcaseCanvas.clientWidth, showcaseCanvas.clientHeight);
      updateObjectSpread(1);
    });

    renderShowcase();
  }
})();
