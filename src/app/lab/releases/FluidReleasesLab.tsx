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
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
} from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react"
import { PlayReleaseButton } from "@/Components/PlayReleaseButton"
import { staticReleases, type Release } from "@/data/releases"
import { getReleaseListenTarget } from "@/lib/releaseLinks"
import { useScrollLock } from "@/motion/useScrollLock"
import styles from "./fluid-releases.module.css"

const LAB_RELEASE_COUNT = 16
const DECELERATION = 0.998
const MAX_RELEASE_VELOCITY = 2400

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function projectVelocity(velocity: number, deceleration = DECELERATION) {
  return (velocity / 1000) * (deceleration / (1 - deceleration))
}

function releaseIdentity(release: Release) {
  return release.id ?? release.slug ?? `${release.title}-${release.releaseDate}`
}

interface ReleaseCardProps {
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

function ReleaseCard({
  release,
  index,
  step,
  x,
  active,
  reducedMotion,
  setButtonRef,
  onActivate,
  onOpen,
}: ReleaseCardProps) {
  const proximity = useCallback(
    (latest: number) => Math.min(Math.abs(latest + index * step) / step, 1),
    [index, step],
  )
  const scale = useTransform(x, (latest) => 1 - proximity(latest) * 0.16)
  const y = useTransform(x, (latest) => proximity(latest) * 38)
  const opacity = useTransform(x, (latest) => 1 - proximity(latest) * 0.48)
  const identity = releaseIdentity(release)

  return (
    <motion.article
      className={styles.cardPosition}
      data-active={active}
      style={reducedMotion ? { opacity: active ? 1 : 0.58 } : { scale, y, opacity }}
    >
      <motion.button
        ref={setButtonRef}
        type="button"
        className={styles.releaseCard}
        aria-label={`${active ? "Open" : "Focus"} ${release.title}`}
        aria-current={active ? "true" : undefined}
        tabIndex={active ? 0 : -1}
        onFocus={onActivate}
        onClick={active ? onOpen : onActivate}
        whileTap={reducedMotion ? undefined : { scale: 0.975 }}
      >
        <motion.div
          className={styles.cardArtwork}
          layoutId={`archive-art-${identity}`}
          transition={{ type: "spring", stiffness: 410, damping: 42, mass: 0.82 }}
        >
          <Image
            src={release.img}
            alt={`${release.title} cover artwork`}
            fill
            sizes="(max-width: 640px) 76vw, (max-width: 1024px) 48vw, 34vw"
            className={styles.coverImage}
            priority={index < 3}
          />
          <span className={styles.artworkCut} aria-hidden="true" />
          <span className={styles.cardOrdinal} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        </motion.div>

        <span className={styles.cardCopy}>
          <span className={styles.cardEyebrow}>
            <span>{release.releaseDate}</span>
            <span>{release.albumType}</span>
          </span>
          <span className={styles.cardTitle}>{release.title}</span>
          <span className={styles.cardFooter}>
            <span>{release.tracks?.length ?? release.totalTracks ?? 1} tracks</span>
            <span>{active ? "press to inspect" : "press to focus"}</span>
          </span>
        </span>
      </motion.button>
    </motion.article>
  )
}

interface DossierProps {
  release: Release
  reducedMotion: boolean
  onClose: () => void
}

function ReleaseDossier({ release, reducedMotion, onClose }: DossierProps) {
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const listenTarget = getReleaseListenTarget(release)
  const identity = releaseIdentity(release)
  const tracks = release.tracks?.slice(0, 5) ?? []

  const startDismissDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    dragControls.start(event)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 800) {
      onClose()
      return
    }

    animate(y, 0, {
      type: "spring",
      stiffness: 440,
      damping: 44,
      velocity: clamp(info.velocity.y, -MAX_RELEASE_VELOCITY, MAX_RELEASE_VELOCITY),
    })
  }

  return (
    <motion.div
      className={styles.dossierBackdrop}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.18 }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        className={styles.dossier}
        data-testid="release-dossier"
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-dossier-title"
        style={{ y }}
        drag={reducedMotion ? false : "y"}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        onDragEnd={handleDragEnd}
      >
        <div
          className={styles.dossierHandle}
          data-testid="dossier-drag-handle"
          onPointerDown={startDismissDrag}
          aria-hidden="true"
        >
          <span />
        </div>

        <div className={styles.dossierTopline}>
          <span>release dossier</span>
          <span>{release.releaseDate}</span>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close dossier">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.dossierGrid}>
          <motion.div
            className={styles.dossierArtwork}
            layoutId={`archive-art-${identity}`}
            transition={{ type: "spring", stiffness: 410, damping: 42, mass: 0.82 }}
          >
            <Image
              src={release.img}
              alt={`${release.title} cover artwork`}
              fill
              sizes="(max-width: 760px) 86vw, 46vw"
              className={styles.coverImage}
              priority
            />
          </motion.div>

          <div className={styles.dossierContent}>
            <div className={styles.dossierMeta}>
              <span>{release.year}</span>
              <span>{release.albumType}</span>
              <span>{release.tracks?.length ?? release.totalTracks ?? 1} tracks</span>
            </div>

            <h2 id="archive-dossier-title" className={styles.dossierTitle}>
              {release.title}
            </h2>

            {release.genres?.length ? (
              <p className={styles.genreLine}>{release.genres.slice(0, 3).join(" / ")}</p>
            ) : null}

            <div className={styles.dossierActions}>
              <PlayReleaseButton release={release} />
              {release.slug ? (
                <Link href={`/releases/${release.slug}`} className={styles.primaryLink}>
                  full dossier <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ) : null}
              <a
                href={listenTarget.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                {listenTarget.label} <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>

            {tracks.length ? (
              <ol className={styles.trackPreview} aria-label="Track preview">
                {tracks.map((track, index) => (
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

export default function FluidReleasesLab() {
  const releases = useMemo(() => staticReleases.slice(0, LAB_RELEASE_COUNT), [])
  const reducedMotion = Boolean(useReducedMotion())
  const [viewportWidth, setViewportWidth] = useState(1280)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const x = useMotionValue(0)
  const settling = useRef<AnimationPlaybackControls | null>(null)
  const activeIndexRef = useRef(0)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const returnFocusIndex = useRef(0)

  const cardWidth = viewportWidth < 640
    ? Math.min(viewportWidth * 0.76, 340)
    : viewportWidth < 1024
      ? Math.min(viewportWidth * 0.48, 460)
      : Math.min(viewportWidth * 0.34, 500)
  const gap = viewportWidth < 640 ? 18 : 28
  const step = cardWidth + gap
  const minX = -(releases.length - 1) * step
  const activeRelease = releases[activeIndex]
  const selectedRelease = selectedIndex === null ? null : releases[selectedIndex]

  useScrollLock(selectedIndex !== null)

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth)
    updateViewport()
    window.addEventListener("resize", updateViewport, { passive: true })
    return () => window.removeEventListener("resize", updateViewport)
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
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
  })

  const settleTo = useCallback(
    (index: number, velocity = 0, focus = false) => {
      const nextIndex = clamp(index, 0, releases.length - 1)
      const target = -nextIndex * step

      settling.current?.stop()
      setActiveIndex(nextIndex)

      if (reducedMotion) {
        x.set(target)
      } else {
        settling.current = animate(x, target, {
          type: "spring",
          stiffness: 430,
          damping: 43,
          mass: 0.82,
          velocity: clamp(velocity, -MAX_RELEASE_VELOCITY, MAX_RELEASE_VELOCITY),
        })
      }

      if (focus) {
        window.setTimeout(() => cardRefs.current[nextIndex]?.focus({ preventScroll: true }), reducedMotion ? 0 : 180)
      }
    },
    [reducedMotion, releases.length, step, x],
  )

  const openDossier = useCallback((index: number) => {
    returnFocusIndex.current = index
    setSelectedIndex(index)
  }, [])

  const closeDossier = useCallback(() => {
    const focusIndex = returnFocusIndex.current
    setSelectedIndex(null)
    window.setTimeout(
      () => cardRefs.current[focusIndex]?.focus({ preventScroll: true }),
      reducedMotion ? 0 : 420,
    )
  }, [reducedMotion])

  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDossier()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [closeDossier, selectedIndex])

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
    const projectedIndex = Math.round(-projected / step)
    settleTo(projectedIndex, releaseVelocity)
  }

  const rootStyle = {
    "--archive-card-width": `${cardWidth}px`,
    "--archive-gap": `${gap}px`,
  } as CSSProperties

  return (
    <LayoutGroup id="release-archive-lab">
      <main
        className={styles.root}
        style={rootStyle}
        data-premid-page="release-interaction-lab"
        onKeyDown={handleRailKeyDown}
      >
        <header className={styles.header}>
          <Link href="/releases" className={styles.backLink}>
            <ArrowLeft size={15} aria-hidden="true" /> release archive
          </Link>
          <p className={styles.labStatus}>
            <span aria-hidden="true" /> interaction lab / direct manipulation
          </p>
        </header>

        <section className={styles.intro} aria-labelledby="archive-title">
          <p className={styles.kicker}>OKISO / complete chronology</p>
          <div className={styles.titleRow}>
            <h1 id="archive-title">
              signal<span>archive</span>
            </h1>
            <div className={styles.activeSummary} aria-live="polite" aria-atomic="true">
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(releases.length).padStart(2, "0")}</span>
              <strong>{activeRelease.title}</strong>
              <span>{activeRelease.releaseDate}</span>
            </div>
          </div>
        </section>

        <section className={styles.railRegion} aria-label="Release chronology">
          <div className={styles.axis} aria-hidden="true" />
          <motion.div
            className={styles.releaseTrack}
            data-testid="release-track"
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
              <ReleaseCard
                key={releaseIdentity(release)}
                release={release}
                index={index}
                step={step}
                x={x}
                active={index === activeIndex}
                reducedMotion={reducedMotion}
                setButtonRef={(node) => {
                  cardRefs.current[index] = node
                }}
                onActivate={() => settleTo(index)}
                onOpen={() => openDossier(index)}
              />
            ))}
          </motion.div>
        </section>

        <footer className={styles.controls}>
          <p>{reducedMotion ? "use arrows or controls to browse" : "drag covers / flick to travel / press active cover"}</p>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ transform: `scaleX(${(activeIndex + 1) / releases.length})` }} />
          </div>
          <div className={styles.paging}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => settleTo(activeIndex - 1, 0, true)}
              disabled={activeIndex === 0}
              aria-label="Previous release"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => settleTo(activeIndex + 1, 0, true)}
              disabled={activeIndex === releases.length - 1}
              aria-label="Next release"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </footer>

        <AnimatePresence initial={false}>
          {selectedRelease ? (
            <ReleaseDossier
              key={releaseIdentity(selectedRelease)}
              release={selectedRelease}
              reducedMotion={reducedMotion}
              onClose={closeDossier}
            />
          ) : null}
        </AnimatePresence>
      </main>
    </LayoutGroup>
  )
}
