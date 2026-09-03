import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowUpRight, Box, Camera, ChevronDown, ChevronLeft, ChevronRight, Cpu, ExternalLink, FileText, GitFork, Globe2, HardDrive, Languages, Mail, Moon, Music2, Network, Star, Sun, Wrench, X } from 'lucide-react'
import { FaDiscord, FaLinkedinIn, FaMicrochip, FaWindows } from 'react-icons/fa6'
import { SiArduino, SiBlender, SiBootstrap, SiCplusplus, SiCss, SiGithub, SiHtml5, SiMysql, SiNodedotjs, SiPhp, SiPython, SiReact } from 'react-icons/si'
import galleryImageUrls from 'virtual:gallery-images'
import './styles.css'
import './gallery.css'
import './activity.css'
import './projects.css'

const text = {
  pt: {
    nav: ['Sobre', 'Experiência', 'Competências', 'Projetos', 'Galeria', 'Contacto'], role: 'Técnico de Sistemas & Programador', shortRole: 'IT · Sistemas · Web', status: 'Disponível para oportunidades', city: 'Porto, Portugal',
    intro: 'Sou o Francisco, um jovem técnico de informática do Porto. Gosto de perceber como as coisas funcionam — do hardware e das redes até às interfaces que usamos todos os dias.',
    aboutTitle: 'Construo, reparo e continuo a aprender.',
    about: 'Concluí o curso profissional de Técnico de Gestão e Programação de Sistemas Informáticos, nível 4 EQF. Procuro uma oportunidade onde possa aplicar o que já aprendi, enfrentar desafios maiores e crescer com uma equipa experiente.',
    experience: 'Experiência', experienceLead: 'Três contextos reais que me ensinaram a diagnosticar, adaptar e comunicar.',
    experiences: [
      { period: 'Abr — Jul 2026', location: 'Porto', company: 'Escola Secundária de Aurélia de Sousa', role: 'Estagiário · Técnico de Sistemas', points: ['Diagnóstico e reparação de desktops e portáteis', 'Instalação de Windows e software', 'Manutenção preventiva de equipamento', 'Impressoras e apoio à impressão 3D'] },
      { period: 'Mai — Jun 2026', location: 'Huelva, Espanha', company: 'Centro Juan Luis Vives', role: 'Estagiário Erasmus+ · Técnico de Sistemas', points: ['Manutenção de computadores', 'Apoio técnico a professores e alunos', 'Instalação e configuração de Windows'] },
      { period: 'Mar — Abr 2025', location: 'Porto', company: 'FTP Soluções Empresariais', role: 'Estagiário · Técnico de Sistemas', points: ['Windows Server', 'Configuração e gestão de NAS', 'Configuração de switches de rede', 'Diagnóstico de hardware e software'] },
    ],
    skills: 'Competências', groups: [
      { name: 'Programação', icon: 'code', items: ['PHP', 'C++', 'Python', 'MySQL'] }, { name: 'Web', icon: 'web', items: ['HTML', 'CSS', 'React.js', 'Node.js', 'Bootstrap'] },
      { name: 'Sistemas & redes', icon: 'server', items: ['Windows Server', 'NAS', 'Switches', 'Hardware'] }, { name: 'Laboratório', icon: 'cpu', items: ['Arduino Uno', 'PIC', 'Blender', 'Impressão 3D'] },
    ],
    education: 'Formação', course: 'Técnico de Gestão e Programação de Sistemas Informáticos', school: 'Escola Básica e Secundária de Águas Santas', educationDate: '2023 — 2026 · Nível 4 EQF',
    contactTitle: 'Tem um problema interessante para resolver?', contactText: 'Estou disponível para estágio, primeiro emprego ou uma colaboração interessante.', mail: 'Enviar email', cv: 'Descarregar CV',
    stats: [['03', 'estágios'], ['02', 'países'], ['EQF 4', 'qualificação'], ['2026', 'formação concluída']], profile: 'Perfil', toolkit: 'Toolkit', currently: 'Neste momento', currentlyText: 'A aprofundar React, Node.js, sistemas e redes enquanto procuro o próximo desafio.',
    gallery: 'Galeria', galleryLead: 'Alguns momentos fora do código e dos sistemas.', galleryOpen: 'Ampliar fotografia', galleryMore: 'Ver mais', galleryLess: 'Ver menos', galleryPrevious: 'Fotografia anterior', galleryNext: 'Fotografia seguinte',
    projects: 'Projetos', projectsLead: 'Projetos públicos e experiências que vou construindo no GitHub.', projectsLoading: 'A carregar projetos…', projectsError: 'Não foi possível carregar os projetos.', projectsEmpty: 'Ainda não existem projetos públicos.', projectsMore: 'Ver mais projetos', projectsLess: 'Ver menos projetos', projectOpen: 'Ver no GitHub', projectDescription: 'Este projeto ainda não tem uma descrição no GitHub.',
    discordActive: 'Atividade no Discord', discordIdle: 'Sem atividade de jogo', discordIdleText: 'Online no Discord', discordOffline: 'Offline no Discord', discordLoading: 'A ligar ao Discord…', discordSession: 'Nesta sessão',
  },
  en: {
    nav: ['About', 'Experience', 'Skills', 'Projects', 'Gallery', 'Contact'], role: 'IT Systems Technician & Developer', shortRole: 'IT · Systems · Web', status: 'Open to opportunities', city: 'Porto, Portugal',
    intro: "I'm Francisco, a young IT technician from Porto. I like understanding how things work — from hardware and networks to the interfaces we use every day.",
    aboutTitle: 'I build, repair and keep learning.',
    about: 'I completed a vocational course in IT Systems Management and Programming, EQF level 4. I am looking for an opportunity to apply what I have learned, take on bigger challenges and grow alongside an experienced team.',
    experience: 'Experience', experienceLead: 'Three real settings that taught me to diagnose, adapt and communicate.',
    experiences: [
      { period: 'Apr — Jul 2026', location: 'Porto', company: 'Escola Secundária de Aurélia de Sousa', role: 'IT Systems Technician Intern', points: ['Diagnosed and repaired desktops and laptops', 'Installed Windows and software', 'Preventive equipment maintenance', 'Printers and 3D printing support'] },
      { period: 'May — Jun 2026', location: 'Huelva, Spain', company: 'Centro Juan Luis Vives', role: 'Erasmus+ · IT Systems Technician Intern', points: ['Computer maintenance', 'Technical support for teachers and students', 'Installed and configured Windows'] },
      { period: 'Mar — Apr 2025', location: 'Porto', company: 'FTP Soluções Empresariais', role: 'IT Systems Technician Intern', points: ['Windows Server', 'NAS setup and management', 'Network switch configuration', 'Hardware and software diagnosis'] },
    ],
    skills: 'Skills', groups: [
      { name: 'Programming', icon: 'code', items: ['PHP', 'C++', 'Python', 'MySQL'] }, { name: 'Web', icon: 'web', items: ['HTML', 'CSS', 'React.js', 'Node.js', 'Bootstrap'] },
      { name: 'Systems & networks', icon: 'server', items: ['Windows Server', 'NAS', 'Switches', 'Hardware'] }, { name: 'Lab', icon: 'cpu', items: ['Arduino Uno', 'PIC', 'Blender', '3D printing'] },
    ],
    education: 'Education', course: 'IT Systems Management and Programming Technician', school: 'Escola Básica e Secundária de Águas Santas', educationDate: '2023 — 2026 · EQF level 4',
    contactTitle: 'Got an interesting problem to solve?', contactText: "I'm available for an internship, first role or an interesting collaboration.", mail: 'Send email', cv: 'Download CV',
    stats: [['03', 'internships'], ['02', 'countries'], ['EQF 4', 'qualification'], ['2026', 'course completed']], profile: 'Profile', toolkit: 'Toolkit', currently: 'Right now', currentlyText: 'Going deeper into React, Node.js, systems and networks while looking for the next challenge.',
    gallery: 'Gallery', galleryLead: 'A few moments away from code and systems.', galleryOpen: 'Enlarge photo', galleryMore: 'View more', galleryLess: 'View less', galleryPrevious: 'Previous photo', galleryNext: 'Next photo',
    projects: 'Projects', projectsLead: 'Public projects and experiments I keep building on GitHub.', projectsLoading: 'Loading projects…', projectsError: 'Projects could not be loaded.', projectsEmpty: 'There are no public projects yet.', projectsMore: 'View more projects', projectsLess: 'View fewer projects', projectOpen: 'View on GitHub', projectDescription: 'This project does not have a GitHub description yet.',
    discordActive: 'Discord activity', discordIdle: 'No gaming activity', discordIdleText: 'Online on Discord', discordOffline: 'Offline on Discord', discordLoading: 'Connecting to Discord…', discordSession: 'This session',
  },
}

const LangContext = createContext(null)
function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('xxsi-lang') || 'pt')
  useEffect(() => { localStorage.setItem('xxsi-lang', lang); document.documentElement.lang = lang }, [lang])
  const value = useMemo(() => ({ lang, t: text[lang], toggle: () => setLang(v => v === 'pt' ? 'en' : 'pt') }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
const useLang = () => useContext(LangContext)
function LangButton({ label = true }) { const { lang, toggle } = useLang(); return <button className="lang" onClick={toggle} aria-label="Switch language"><Languages size={14}/>{label && <span>{lang === 'pt' ? 'EN' : 'PT'}</span>}</button> }
function Clock() { const [now, setNow] = useState(new Date()); useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, []); return <time>{new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(now)}</time> }
const toolIcons = {
  PHP: [SiPhp, '#777bb4'], 'C++': [SiCplusplus, '#659ad2'], Python: [SiPython, '#3776ab'], MySQL: [SiMysql, '#4479a1'],
  HTML: [SiHtml5, '#e34f26'], CSS: [SiCss, '#663399'], 'React.js': [SiReact, '#61dafb'], 'Node.js': [SiNodedotjs, '#5fa04e'], Bootstrap: [SiBootstrap, '#7952b3'],
  'Windows Server': [FaWindows, '#00a4ef'], NAS: [HardDrive, '#78909c'], Switches: [Network, '#4f86c6'], Hardware: [Cpu, '#e59f34'],
  'Arduino Uno': [SiArduino, '#00878f'], PIC: [FaMicrochip, '#cc2d2d'], Blender: [SiBlender, '#e87d0d'], 'Impressão 3D': [Box, '#8a6dd3'], '3D printing': [Box, '#8a6dd3'],
}
function ToolIcon({ name }) { const [Icon, color] = toolIcons[name] || [Wrench, '#6f7874']; return <Icon size={21} style={{ color }} aria-hidden="true"/> }
const email = 'almeidafrancisco1527@gmail.com'
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
const linkedInUrl = 'https://www.linkedin.com/in/francisco-almeida-175778199'
const MailLink = ({ children, className = '', ...props }) => <a className={className} href={gmailComposeUrl} target="_blank" rel="noreferrer" {...props}>{children}</a>
const CVLink = ({ children, className = '', ...props }) => <a className={className} href="/Francisco%20Correia%20Almeida.pdf" download {...props}>{children}</a>

const galleryItems = galleryImageUrls.map(src => {
  const filename = decodeURIComponent(src.split('/').pop()).replace(/\.[^.]+$/, '')
  const caption = filename.replace(/[-_]+/g, ' ')
  return { src, alt: caption, caption: { pt: caption, en: caption } }
})

function Gallery() {
  const { t, lang } = useLang()
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? galleryItems : galleryItems.slice(0, 8)
  const selectedIndex = selected ? galleryItems.indexOf(selected) : -1
  const moveSelection = direction => setSelected(current => {
    const currentIndex = galleryItems.indexOf(current)
    const nextIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length
    return galleryItems[nextIndex]
  })

  useEffect(() => {
    if (!selected) return undefined
    const handleKey = event => {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowLeft') moveSelection(-1)
      if (event.key === 'ArrowRight') moveSelection(1)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  return <section className="pgrid-gallery" id="p4">
    <div className="pgrid-section-title"><span>04</span><h2>{t.gallery}</h2><p>{t.galleryLead}</p></div>
    <div className="gallery-grid">
      {visibleItems.map((photo, index) => <button className={`gallery-photo ${expanded && index >= 8 ? 'gallery-reveal' : ''}`} style={{ animationDelay: `${Math.max(0, index - 8) * 45}ms` }} key={photo.src} onClick={() => setSelected(photo)} aria-label={`${t.galleryOpen}: ${photo.caption[lang]}`}>
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async"/>
        <span><Camera size={14}/>{photo.caption[lang]}</span>
        <b>{String(index + 1).padStart(2, '0')}</b>
      </button>)}
    </div>
    {galleryItems.length > 8 && <button className="gallery-more" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>
      {expanded ? t.galleryLess : t.galleryMore}
    </button>}
    {selected && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.caption[lang]} onClick={() => setSelected(null)}>
      <button className="gallery-close" onClick={() => setSelected(null)} aria-label={lang === 'pt' ? 'Fechar fotografia' : 'Close photo'}><X size={20}/></button>
      {galleryItems.length > 1 && <>
        <button className="gallery-nav gallery-prev" onClick={event => { event.stopPropagation(); moveSelection(-1) }} aria-label={t.galleryPrevious}><ChevronLeft size={27}/></button>
        <button className="gallery-nav gallery-next" onClick={event => { event.stopPropagation(); moveSelection(1) }} aria-label={t.galleryNext}><ChevronRight size={27}/></button>
      </>}
      <img src={selected.src} alt={selected.alt} onClick={event => event.stopPropagation()}/>
      <p>{selectedIndex + 1} / {galleryItems.length} · {selected.caption[lang]}</p>
    </div>}
  </section>
}

function SpotifyCard() {
  const { lang } = useLang()
  const [track, setTrack] = useState(null)
  const [state, setState] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTrack() {
      try {
        const response = await fetch('/api/spotify-recent', { signal: controller.signal })
        if (!response.ok) throw new Error('Spotify is not configured')
        const data = await response.json()
        setTrack(data)
        setState('ready')
      } catch (error) {
        if (error.name !== 'AbortError') setState('unconfigured')
      }
    }

    loadTrack()
    const interval = window.setInterval(loadTrack, 30_000)
    window.addEventListener('focus', loadTrack)

    return () => {
      controller.abort()
      window.clearInterval(interval)
      window.removeEventListener('focus', loadTrack)
    }
  }, [])

  const playedAt = track?.playedAt
    ? new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(track.playedAt))
    : null

  return <article className="spotify-card">
    <div className="spotify-cover">
      {track?.albumImageUrl ? <img src={track.albumImageUrl} alt=""/> : <Music2 size={22}/>} 
    </div>
    <div className="spotify-copy">
      <span><i></i>{track?.isPlaying ? (lang === 'pt' ? 'A ouvir agora' : 'Now playing') : (lang === 'pt' ? 'Última música' : 'Last played')}</span>
      {state === 'ready' ? <><h3>{track.title}</h3><p>{track.artist}{playedAt && !track.isPlaying ? ` · ${playedAt}` : ''}</p></> : state === 'loading' ? <><h3>{lang === 'pt' ? 'A ligar ao Spotify…' : 'Connecting to Spotify…'}</h3><p>spotify</p></> : <><h3>{lang === 'pt' ? 'Liga o teu Spotify' : 'Connect your Spotify'}</h3><p>{lang === 'pt' ? 'Adiciona as credenciais no deployment' : 'Add credentials to the deployment'}</p></>}
    </div>
    {track?.songUrl && <a href={track.songUrl} target="_blank" rel="noreferrer" aria-label="Open on Spotify"><ExternalLink size={15}/></a>}
  </article>
}

const discordUserId = '880526653103702148'

function discordActivityImage(activity) {
  const image = activity?.assets?.large_image
  if (!image || image.startsWith('spotify:')) return null
  if (/^https?:\/\//.test(image)) return image
  if (image.startsWith('mp:')) return `https://media.discordapp.net/${image.slice(3)}`
  if (activity.application_id) return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`
  return null
}

function sessionDuration(startedAt, now) {
  if (!startedAt) return null
  const totalMinutes = Math.max(0, Math.floor((now - startedAt) / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`
}

function DiscordActivity() {
  const { t } = useLang()
  const [presence, setPresence] = useState(null)
  const [state, setState] = useState('loading')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const controller = new AbortController()
    async function loadPresence() {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Discord presence unavailable')
        const result = await response.json()
        if (!result.success) throw new Error('Discord presence unavailable')
        setPresence(result.data)
        setState('ready')
      } catch (error) {
        if (error.name !== 'AbortError') setState('unavailable')
      }
    }

    loadPresence()
    const refresh = window.setInterval(loadPresence, 30_000)
    const timer = window.setInterval(() => setNow(Date.now()), 1_000)
    window.addEventListener('focus', loadPresence)
    return () => {
      controller.abort()
      window.clearInterval(refresh)
      window.clearInterval(timer)
      window.removeEventListener('focus', loadPresence)
    }
  }, [])

  const activity = presence?.activities?.find(item => item.type !== 2 && item.type !== 4 && item.name?.toLowerCase() !== 'spotify')
  const image = discordActivityImage(activity)
  const avatar = presence?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUserId}/${presence.discord_user.avatar}.png?size=128`
    : null
  const duration = sessionDuration(activity?.timestamps?.start, now)
  const online = presence?.discord_status && presence.discord_status !== 'offline'

  return <article className="discord-card">
    <div className="discord-cover">
      {image || avatar ? <img src={image || avatar} alt=""/> : <FaDiscord size={23}/>} 
    </div>
    <div className="discord-copy">
      <span><i className={online ? 'online' : ''}></i>{activity ? t.discordActive : online ? t.discordIdleText : t.discordOffline}</span>
      {state === 'loading' && <><h3>{t.discordLoading}</h3><p>Discord</p></>}
      {state === 'unavailable' && <><h3>{t.discordOffline}</h3><p>Lanyard</p></>}
      {state === 'ready' && activity && <><h3>{activity.name}</h3><p>{activity.details || activity.state || t.discordActive}{duration ? ` · ${t.discordSession} ${duration}` : ''}</p></>}
      {state === 'ready' && !activity && <><h3>{t.discordIdle}</h3><p>{online ? presence.discord_user?.display_name || presence.discord_user?.username : t.discordOffline}</p></>}
    </div>
  </article>
}

function GitHubProjects() {
  const { t } = useLang()
  const [projects, setProjects] = useState([])
  const [state, setState] = useState('loading')
  const [expanded, setExpanded] = useState(false)
  const [openProject, setOpenProject] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    async function loadProjects() {
      try {
        const response = await fetch('https://api.github.com/users/Xxsi07/repos?sort=updated&per_page=100&type=owner', {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('GitHub projects unavailable')
        const repositories = await response.json()
        setProjects(repositories.filter(repository => !repository.fork))
        setState('ready')
      } catch (error) {
        if (error.name !== 'AbortError') setState('error')
      }
    }
    loadProjects()
    return () => controller.abort()
  }, [])

  const visibleProjects = expanded ? projects : projects.slice(0, 4)

  return <section className="pgrid-projects" id="p3">
    <div className="pgrid-section-title"><span>03</span><h2>{t.projects}</h2><p>{t.projectsLead}</p></div>
    {state === 'loading' && <div className="projects-grid" aria-label={t.projectsLoading}>{[0, 1, 2, 3].map(item => <div className="project-skeleton" key={item}/>)}</div>}
    {state === 'error' && <div className="projects-message"><SiGithub size={19}/><span>{t.projectsError}</span><a href="https://github.com/Xxsi07" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a></div>}
    {state === 'ready' && projects.length === 0 && <div className="projects-message"><SiGithub size={19}/><span>{t.projectsEmpty}</span></div>}
    {state === 'ready' && projects.length > 0 && <>
      <div className="projects-grid">
        {visibleProjects.map((project, index) => {
          const isOpen = openProject === project.id
          return <article className={`project-card ${expanded && index >= 4 ? 'project-reveal' : ''}`} style={{ animationDelay: `${Math.max(0, index - 4) * 55}ms` }} key={project.id}>
            <button className="project-card-toggle" onClick={() => setOpenProject(isOpen ? null : project.id)} aria-expanded={isOpen}>
              <span className="project-icon"><SiGithub size={18}/></span>
              <span className="project-title"><strong>{project.name}</strong><small>{project.language || 'GitHub'}</small></span>
              <span className="project-stats"><small><Star size={12}/>{project.stargazers_count}</small><small><GitFork size={12}/>{project.forks_count}</small></span>
              <ChevronDown className="project-chevron" size={17}/>
            </button>
            {isOpen && <div className="project-details">
              <p>{project.description || t.projectDescription}</p>
              <a href={project.html_url} target="_blank" rel="noreferrer"><SiGithub size={14}/>{t.projectOpen}<ExternalLink size={13}/></a>
            </div>}
          </article>
        })}
      </div>
      {projects.length > 4 && <button className="projects-more" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{expanded ? t.projectsLess : t.projectsMore}</button>}
    </>}
  </section>
}

function V1() {
  const { t, lang } = useLang(); const start = new Date(new Date().getFullYear(),0,1); const end = new Date(new Date().getFullYear()+1,0,1); const year = Math.round(((Date.now()-start)/(end-start))*100)
  const [dark, setDark] = useState(() => localStorage.getItem('xxsi-theme') === 'dark')
  useEffect(() => { localStorage.setItem('xxsi-theme', dark ? 'dark' : 'light') }, [dark])
  return <main className={`pgrid ${dark ? 'pgrid-dark' : ''}`}><header className="pgrid-nav"><Link to="/" className="pgrid-logo">FA</Link><nav>{t.nav.map((x,i)=><a href={`#p${i}`} key={x}>{x}</a>)}</nav><div className="pgrid-actions"><LangButton/><button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label={dark ? (lang === 'pt' ? 'Ativar tema claro' : 'Use light mode') : (lang === 'pt' ? 'Ativar tema escuro' : 'Use dark mode')}>{dark ? <Sun size={14}/> : <Moon size={14}/>}<span>{dark ? 'LIGHT' : 'DARK'}</span></button></div></header><div className="pgrid-wrap">
    <section className="pgrid-head" id="p0"><div className="identity"><img src="/profile.png" alt="Francisco Almeida"/><div><h1>Francisco Almeida <b>✓</b></h1><p>{t.role}<i></i></p><MailLink>{email}</MailLink></div></div><div className="local"><Clock/><span>WEST · {t.city}</span></div></section>
    <section className="pgrid-about"><p>{t.intro}</p><div className="socials"><a href="https://github.com/Xxsi07" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><SiGithub size={15}/></a><a href={linkedInUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><FaLinkedinIn size={14}/></a><MailLink aria-label="Email" title="Email"><Mail size={14}/></MailLink><CVLink className="cv-icon" aria-label="CV" title="CV"><FileText size={14}/></CVLink></div></section>
    <section className="pgrid-widgets"><div className="now-card"><span>● {t.currently}</span><p>{t.currentlyText}</p></div><div className="status-card"><i></i><span>{t.status}</span></div><SpotifyCard/><DiscordActivity/></section>
    <section className="year-card"><b>{new Date().getFullYear()}</b><span>PROGRESS</span><div><i style={{width:`${year}%`}}></i></div><strong>{year}% · DAY {Math.ceil((Date.now()-start)/86400000)}/365</strong></section>
    <section className="pgrid-tools" id="p2"><p>{t.toolkit}</p><div>{t.groups.flatMap(g=>g.items).map(x=><span key={x} title={x}><ToolIcon name={x}/><small>{x}</small></span>)}</div></section>
    <section className="pgrid-exp" id="p1"><div className="pgrid-section-title"><span>01</span><h2>{t.experience}</h2><p>{t.experienceLead}</p></div>{t.experiences.map((e,i)=><article key={e.company}><div className="exp-icon">{i===0?<Wrench/>:i===1?<Globe2/>:<Network/>}</div><div><h3>{e.company}</h3><p>{e.role}</p><ul>{e.points.map(p=><li key={p}>{p}</li>)}</ul></div><div><span>{e.period}</span><small>{e.location}</small></div></article>)}</section>
    <section className="pgrid-edu"><div><span>02</span><h2>{t.education}</h2></div><article><h3>{t.course}</h3><p>{t.school}</p><b>{t.educationDate}</b></article></section>
    <GitHubProjects/>
    <Gallery/>
    <section className="pgrid-contact" id="p5"><div><span>05 / {t.nav[5]}</span><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><MailLink>{t.mail} <ArrowUpRight/></MailLink></section>
  </div><footer className="pgrid-foot"><span>xxsi.me © 2026</span><span>React · Spotify API</span></footer></main>
}


function ScrollTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0,0) }, [pathname]); return null }
function App() { return <LangProvider><ScrollTop/><Routes><Route path="/" element={<V1/>}/><Route path="/1" element={<V1/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></LangProvider> }
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>)

