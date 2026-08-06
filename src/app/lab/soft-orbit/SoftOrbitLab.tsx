"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import Image from "next/image"
import Link from "next/link"
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
} from "framer-motion"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Disc3,
  Headphones,
  Pause,
  Play,
  X,
} from "lucide-react"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import { staticReleases, type Release } from "@/data/releases"
import { getReleaseListenTarget } from "@/lib/releaseLinks"
import { useScrollLock } from "@/motion/useScrollLock"
import styles from "./soft-orbit.module.css"

const FEATURED_TITLES = ["PRODIGY", "VAC", "for a chance to look beyond the stars"] as const
const ORBIT_GLOWS = ["#f2677a", "#8fb9cf", "#afa4d4"] as const
const DECELERATION = 0.998
const MAX_RELEASE_VELOCITY = 2200

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function projectVelocity(velocity: number, deceleration = DECELERATION) {
  return (velocity / 1000) * (deceleration / (1 - deceleration))
}

function releaseIdentity(release: Release) {
  return release.id ?? release.slug ?? `${release.title}-${release.releaseDate}`
}

function releaseTrackTitle(release: Release) {
  return release.tracks?.[0]?.title ?? release.title
}

interface OrbitCardProps {
  release: Release
  index: number
  step: number
  x: MotionValue<number>
  active: boolean
  reducedMotion: boolean
  setButtonRef: (node: HTMLButtonElement | null) => void
  onActivate: () => void
  onOpen: () => void
}

function OrbitCard({
  release,
  index,
  step,
  x,
  active,
  reducedMotion,
  setButtonRef,
  onActivate,
  onOpen,
}: OrbitCardProps) {
  const distance = useCallback(
    (latest: number) => (latest + index * step) / step,
    [index, step],
  )
  const scale = useTransform(x, (latest) => 1 - Math.min(Math.abs(distance(latest)), 1) * 0.13)
  const y = useTransform(x, (latest) => Math.min(Math.abs(distance(latest)), 1) * 46)
  const rotate = useTransform(x, (latest) => clamp(distance(latest) * 4.5, -5, 5))
  const opacity = useTransform(x, (latest) => 1 - Math.min(Math.abs(distance(latest)), 1) * 0.44)
  const identity = releaseIdentity(release)

  return (
    <motion.article
      className={styles.orbitCardPosition}
      data-active={active}
      style={reducedMotion ? { opacity: active ? 1 : 0.62 } : { scale, y, rotate, opacity }}
    >
      <motion.button
        ref={setButtonRef}
        type="button"
        className={styles.orbitCard}
        aria-label={`${active ? "Open" : "Focus"} ${release.title}`}
        aria-current={active ? "true" : undefined}
        tabIndex={active ? 0 : -1}
        onFocus={onActivate}
        onClick={active ? onOpen : onActivate}
        whileTap={reducedMotion ? undefined : { scale: 0.975 }}
      >
        <motion.div
          className={styles.coverShell}
          layoutId={`soft-orbit-art-${identity}`}
          transition={{ type: "spring", stiffness: 390, damping: 38, mass: 0.84 }}
        >
          <Image
            src={release.img}
            alt={`${release.title} cover artwork`}
            fill
            sizes="(max-width: 640px) 74vw, (max-width: 1024px) 42vw, 29vw"
            className={styles.coverImage}
            priority={index < 2}
          />
          <span className={styles.coverShine} aria-hidden="true" />
        </motion.div>

        <span className={styles.cardCopy}>
          <span className={styles.cardTitle}>{release.title}</span>
          <span className={styles.cardMeta}>{release.releaseDate} · {release.albumType}</span>
        </span>
      </motion.button>
    </motion.article>
  )
}

interface ReleaseSheetProps {
  release: Release
  reducedMotion: boolean
  onClose: () => void
}

function ReleaseSheet({ release, reducedMotion, onClose }: ReleaseSheetProps) {
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const listenTarget = getReleaseListenTarget(release)
  const identity = releaseIdentity(release)
  const trackTitle = releaseTrackTitle(release)
  const {
    currentTrackId,
    isPlaying,
    playTrack,
    togglePlayPause,
  } = useMusicPlayer()
  const isActive = currentTrackId === trackTitle

  useEffect(() => {
    const id = window.requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(id)
  }, [])

  const handlePlay = () => {
    if (isActive) {
      togglePlayPause()
      return
    }
    playTrack(trackTitle, "OKISO", release.img, release.link)
  }

  const startDismissDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!reducedMotion) dragControls.start(event)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 760) {
      onClose()
      return
    }
    animate(y, 0, {
      type: "spring",
      stiffness: 430,
      damping: 42,
      velocity: clamp(info.velocity.y, -MAX_RELEASE_VELOCITY, MAX_RELEASE_VELOCITY),
    })
  }

  return (
    <motion.div
      className={styles.sheetBackdrop}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.2 }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        id="release-sheet"
        className={styles.releaseSheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="soft-orbit-sheet-title"
        style={{ y }}
        drag={reducedMotion ? false : "y"}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.18 }}
        onDragEnd={handleDragEnd}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 390, damping: 39, mass: 0.86 }}
      >
        <div
          id="sheet-drag-handle"
          className={styles.sheetHandle}
          onPointerDown={startDismissDrag}
          aria-hidden="true"
        >
          <span />
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          className={styles.sheetClose}
          onClick={onClose}
          aria-label="Close release details"
        >
          <X size={19} aria-hidden="true" />
        </button>

        <div className={styles.sheetGrid}>
          <motion.div
            className={styles.sheetArtwork}
            layoutId={`soft-orbit-art-${identity}`}
            transition={{ type: "spring", stiffness: 390, damping: 38, mass: 0.84 }}
          >
            <Image
              src={release.img}
              alt={`${release.title} cover artwork`}
              fill
              sizes="(max-width: 760px) 84vw, 42vw"
              className={styles.coverImage}
              priority
            />
          </motion.div>

          <div className={styles.sheetContent}>
            <p className={styles.sheetEyebrow}>OKISO · {release.releaseDate}</p>
            <h2 id="soft-orbit-sheet-title">{release.title}</h2>
            <p className={styles.sheetDescription}>
              {release.description ?? "A release by OKISO, held inside the soft orbit."}
            </p>

            <div className={styles.sheetMeta}>
              <span>{release.albumType}</span>
              <span>{release.tracks?.length ?? release.totalTracks ?? 1} tracks</span>
              {release.primaryGenre ? <span>{release.primaryGenre}</span> : null}
            </div>

            <div className={styles.sheetActions}>
              <button type="button" className={styles.primaryAction} onClick={handlePlay}>
                {isActive && isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
                {isActive && isPlaying ? "Pause" : "Play this signal"}
              </button>
              <a
                href={listenTarget.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryAction}
              >
                {listenTarget.label} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>

            {release.tracks?.length ? (
              <ol className={styles.trackList} aria-label="Track list">
                {release.tracks.slice(0, 4).map((track, index) => (
                  <li key={track.id ?? `${track.title}-${index}`}>
                    <span>{String(track.trackNumber ?? index + 1).padStart(2, "0")}</span>
                    <strong>{track.title}</strong>
                    <span>{track.duration?.replace("PT", "").toLowerCase() ?? "--"}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default function SoftOrbitLab() {
  const releases = useMemo(
    () => FEATURED_TITLES
      .map((title) => staticReleases.find((release) => release.title === title))
      .filter((release): release is Release => Boolean(release)),
    [],
  )
  const reducedMotion = Boolean(useReducedMotion())
  const [viewportWidth, setViewportWidth] = useState(1280)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [navHidden, setNavHidden] = useState(false)
  const activeIndexRef = useRef(0)
  const returnFocusIndex = useRef(0)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const settling = useRef<AnimationPlaybackControls | null>(null)
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const wordmarkY = useTransform(scrollY, [0, 900], [0, 120])
  const characterY = useTransform(scrollY, [0, 900], [0, 72])
  const {
    currentTrackId,
    currentTrackTitle,
    currentTrackArtist,
    currentTrackCover,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    togglePlayPause,
    closePlayer,
  } = useMusicPlayer()

  const cardWidth = viewportWidth < 640
    ? Math.min(viewportWidth * 0.74, 310)
    : viewportWidth < 1024
      ? Math.min(viewportWidth * 0.42, 390)
      : Math.min(viewportWidth * 0.29, 420)
  const gap = viewportWidth < 640 ? 20 : 34
  const step = cardWidth + gap
  const minX = -(releases.length - 1) * step
  const activeRelease = releases[activeIndex]
  const selectedRelease = selectedIndex === null ? null : releases[selectedIndex]
  const nowPlayingProgress = duration > 0 ? clamp(currentTime / duration, 0, 1) : 0

  useScrollLock(selectedIndex !== null)

  useEffect(() => {
    document.body.classList.add("soft-orbit-active")
    return () => document.body.classList.remove("soft-orbit-active")
  }, [])

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth)
    updateViewport()
    window.addEventListener("resize", updateViewport, { passive: true })
    return () => window.removeEventListener("resize", updateViewport)
  }, [])

  useEffect(() => {
    let lastY = window.scrollY
    const handleScroll = () => {
      const nextY = window.scrollY
      setNavHidden(nextY > 140 && nextY > lastY + 5)
      lastY = nextY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    settling.current?.stop()
    x.set(-activeIndexRef.current * step)
  }, [step, x])

  useMotionValueEvent(x, "change", (latest) => {
    const nextIndex = clamp(Math.round(-latest / step), 0, releases.length - 1)
    setActiveIndex((current) => current === nextIndex ? current : nextIndex)
  })

  const settleTo = useCallback((index: number, velocity = 0, focus = false) => {
    const nextIndex = clamp(index, 0, releases.length - 1)
    const target = -nextIndex * step
    settling.current?.stop()
    setActiveIndex(nextIndex)

    if (reducedMotion) {
      x.set(target)
    } else {
      settling.current = animate(x, target, {
        type: "spring",
        stiffness: 420,
        damping: 42,
        mass: 0.84,
        velocity: clamp(velocity, -MAX_RELEASE_VELOCITY, MAX_RELEASE_VELOCITY),
      })
    }

    if (focus) {
      window.setTimeout(
        () => cardRefs.current[nextIndex]?.focus({ preventScroll: true }),
        reducedMotion ? 0 : 170,
      )
    }
  }, [reducedMotion, releases.length, step, x])

  const openRelease = useCallback((index: number) => {
    returnFocusIndex.current = index
    setSelectedIndex(index)
  }, [])

  const closeRelease = useCallback(() => {
    const focusIndex = returnFocusIndex.current
    setSelectedIndex(null)
    window.setTimeout(
      () => cardRefs.current[focusIndex]?.focus({ preventScroll: true }),
      reducedMotion ? 0 : 360,
    )
  }, [reducedMotion])

  useEffect(() => {
    if (selectedIndex === null) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRelease()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [closeRelease, selectedIndex])

  const handleRailKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (selectedIndex !== null) return
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      settleTo(activeIndex - 1, 0, true)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      settleTo(activeIndex + 1, 0, true)
    } else if (event.key === "Home") {
      event.preventDefault()
      settleTo(0, 0, true)
    } else if (event.key === "End") {
      event.preventDefault()
      settleTo(releases.length - 1, 0, true)
    }
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const releaseVelocity = clamp(info.velocity.x, -MAX_RELEASE_VELOCITY, MAX_RELEASE_VELOCITY)
    const projected = clamp(x.get() + projectVelocity(releaseVelocity), minX, 0)
    settleTo(Math.round(-projected / step), releaseVelocity)
  }

  const handlePlay = (release: Release) => {
    const title = releaseTrackTitle(release)
    if (currentTrackId === title) {
      togglePlayPause()
      return
    }
    playTrack(title, "OKISO", release.img, release.link)
  }

  const rootStyle = {
    "--orbit-card-width": `${cardWidth}px`,
    "--orbit-card-gap": `${gap}px`,
    "--orbit-active-glow": ORBIT_GLOWS[activeIndex] ?? ORBIT_GLOWS[0],
  } as CSSProperties

  if (!activeRelease) return null

  return (
    <LayoutGroup id="soft-orbit-lab">
      <main
        id="soft-orbit-root"
        className={`${styles.softOrbitRoot} softOrbitRoot`}
        style={rootStyle}
        data-premid-page="soft-orbit-lab"
      >
        <motion.header
          className={styles.floatingNav}
          initial={false}
          animate={{ y: navHidden ? -104 : 0, opacity: navHidden ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 430, damping: 42 }}
        >
          <Link href="/" className={styles.navBrand} aria-label="Back to OKISO home">
            <span className={styles.brandOrb} aria-hidden="true" />
            <span>OKISO</span>
          </Link>
          <nav className={styles.navLinks} aria-label="Prototype navigation">
            <a href="#releases">music</a>
            <Link href="/vault">vault</Link>
            <a href="https://www.youtube.com/@okiso7" target="_blank" rel="noopener noreferrer">watch</a>
          </nav>
          <span className={styles.navStatus}><span /> online</span>
        </motion.header>

        <section className={styles.hero} aria-labelledby="soft-orbit-title">
          <div className={styles.heroAtmosphere} aria-hidden="true" />

          <motion.p
            className={styles.heroWordmark}
            style={reducedMotion ? undefined : { y: wordmarkY }}
            aria-hidden="true"
          >
            OKISO
          </motion.p>

          <svg
            className={styles.ribbonOrbit}
            viewBox="0 0 1600 1050"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="soft-orbit-ribbon" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f2677a" />
                <stop offset="0.52" stopColor="#eedee8" />
                <stop offset="1" stopColor="#b6dfef" />
              </linearGradient>
            </defs>
            <motion.path
              d="M -120 820 C 250 650, 430 910, 770 650 S 1190 120, 1710 310"
              fill="none"
              stroke="url(#soft-orbit-ribbon)"
              strokeWidth="7"
              strokeLinecap="round"
              initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          <motion.div
            className={styles.characterStage}
            style={reducedMotion ? undefined : { y: characterY }}
          >
            <div className={styles.characterGlow} aria-hidden="true" />
            <Image
              src="/hero_character.png"
              alt="OKISO, a virtual artist with white hair and coral ribbon details"
              fill
              priority
              sizes="(max-width: 720px) 112vw, 46vw"
              className={styles.characterImage}
            />
          </motion.div>

          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}><span /> virtual artist · producer · vtuber</p>
            <h1 id="soft-orbit-title">the signal<br />is alive.</h1>
            <p className={styles.heroLead}>
              electronic worlds with a human pulse—soft at the center, precise at the edges.
            </p>
            <div className={styles.heroActions}>
              <button type="button" className={styles.heroPrimary} onClick={() => handlePlay(activeRelease)}>
                {currentTrackId === releaseTrackTitle(activeRelease) && isPlaying
                  ? <Pause size={17} fill="currentColor" />
                  : <Play size={17} fill="currentColor" />}
                {currentTrackId === releaseTrackTitle(activeRelease) && isPlaying ? "pause prodigy" : "play prodigy"}
              </button>
              <a href="#releases" className={styles.heroSecondary}>
                enter the orbit <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.heroSignal} aria-label="Featured release">
            <span>featured signal</span>
            <strong>{activeRelease.title}</strong>
            <span>{activeRelease.releaseDate}</span>
          </div>
        </section>

        <section
          id="releases"
          className={styles.releasesSection}
          aria-labelledby="release-orbit-title"
          onKeyDown={handleRailKeyDown}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={releaseIdentity(activeRelease)}
              className={styles.releaseAmbient}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.28 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.08 : 0.45 }}
              aria-hidden="true"
            >
              <Image src={activeRelease.img} alt="" fill sizes="80vw" className={styles.releaseAmbientImage} />
            </motion.div>
          </AnimatePresence>

          <header className={styles.releaseHeader}>
            <div>
              <p className={styles.releaseKicker}>music in motion</p>
              <h2 id="release-orbit-title">three signals,<br />one orbit.</h2>
            </div>
            <p className={styles.releaseIntro}>
              drag through the releases. tap the one in focus and let its world open from the artwork.
            </p>
          </header>

          <div id="release-orbit" className={styles.orbitViewport} aria-label="Featured releases">
            <motion.div
              className={styles.orbitTrack}
              style={{ x }}
              drag={reducedMotion ? false : "x"}
              dragConstraints={{ left: minX, right: 0 }}
              dragElastic={0.1}
              dragMomentum={false}
              onPointerDown={() => settling.current?.stop()}
              onDragStart={() => settling.current?.stop()}
              onDragEnd={handleDragEnd}
            >
              {releases.map((release, index) => (
                <OrbitCard
                  key={releaseIdentity(release)}
                  release={release}
                  index={index}
                  step={step}
                  x={x}
                  active={index === activeIndex}
                  reducedMotion={reducedMotion}
                  setButtonRef={(node) => { cardRefs.current[index] = node }}
                  onActivate={() => settleTo(index)}
                  onOpen={() => openRelease(index)}
                />
              ))}
            </motion.div>
          </div>

          <footer className={styles.orbitControls}>
            <div className={styles.orbitSummary} aria-live="polite" aria-atomic="true">
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(releases.length).padStart(2, "0")}</span>
              <strong>{activeRelease.title}</strong>
            </div>
            <div className={styles.orbitProgress} aria-hidden="true">
              <span style={{ transform: `scaleX(${(activeIndex + 1) / releases.length})` }} />
            </div>
            <div className={styles.orbitPaging}>
              <button
                type="button"
                onClick={() => settleTo(activeIndex - 1, 0, true)}
                disabled={activeIndex === 0}
                aria-label="Previous release"
              >
                <ArrowLeft size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => settleTo(activeIndex + 1, 0, true)}
                disabled={activeIndex === releases.length - 1}
                aria-label="Next release"
              >
                <ArrowRight size={19} aria-hidden="true" />
              </button>
            </div>
          </footer>
        </section>

        <footer className={styles.pageFooter}>
          <p>OKISO</p>
          <div>
            <span>music, motion, and a little gravity.</span>
            <Link href="/releases">all releases <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </footer>

        <AnimatePresence initial={false}>
          {selectedRelease ? (
            <ReleaseSheet
              key={releaseIdentity(selectedRelease)}
              release={selectedRelease}
              reducedMotion={reducedMotion}
              onClose={closeRelease}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {currentTrackId ? (
            <motion.aside
              className={styles.softPlayer}
              aria-label="Now playing"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 430, damping: 42 }}
            >
              <div className={styles.playerArt}>
                {currentTrackCover
                  ? <Image src={currentTrackCover} alt="" fill sizes="48px" className={styles.coverImage} />
                  : <Disc3 size={18} aria-hidden="true" />}
              </div>
              <div className={styles.playerCopy}>
                <span>{currentTrackArtist ?? "OKISO"}</span>
                <strong>{currentTrackTitle}</strong>
                <span className={styles.playerProgress} aria-hidden="true">
                  <span style={{ transform: `scaleX(${nowPlayingProgress})` }} />
                </span>
              </div>
              <button type="button" className={styles.playerPlay} onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
              </button>
              <button type="button" className={styles.playerClose} onClick={closePlayer} aria-label="Close player">
                <X size={17} aria-hidden="true" />
              </button>
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <div className={styles.prototypeBadge} aria-hidden="true">
          <Headphones size={14} /> soft orbit / visual lab
        </div>
      </main>
    </LayoutGroup>
  )
}
