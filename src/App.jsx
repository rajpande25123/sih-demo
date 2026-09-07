import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Layers3,
  Map,
  Menu,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  UsersRound,
  X,
} from 'lucide-react'
import './App.css'

const projects = [
  { name: 'Delhi–Mumbai Expressway', code: 'NHAI / NH-48', state: 'Rajasthan', status: 'At risk', progress: 68, parcels: '4,820', area: '2,146 ha', color: 'coral' },
  { name: 'Mumbai–Ahmedabad HSR', code: 'NHSRCL / MAHSR', state: 'Gujarat', status: 'On track', progress: 84, parcels: '1,936', area: '862 ha', color: 'green' },
  { name: 'Ken–Betwa Link Project', code: 'MoWR / KBLP', state: 'Madhya Pradesh', status: 'On track', progress: 52, parcels: '3,118', area: '1,420 ha', color: 'yellow' },
  { name: 'Amritsar–Kolkata Freight Corridor', code: 'DFCCIL / EDFC', state: 'Uttar Pradesh', status: 'Delayed', progress: 41, parcels: '6,250', area: '3,675 ha', color: 'coral' },
]

const scopeRows = [
  ['01', 'Proposal & scrutiny', 'Central ministry / LRB', 'Digital submission, checklist validation, inter-departmental comments'],
  ['02', 'Notification & survey', 'State / District', 'Gazette events, parcel survey, GIS geo-tagging, affected family register'],
  ['03', 'Award & compensation', 'LAO / Treasury', 'Award calculation, beneficiary verification, DBT disbursal and reconciliation'],
  ['04', 'Possession & R&R', 'District / R&R cell', 'Possession memo, resettlement sites, livelihood support and grievance closure'],
  ['05', 'Monitoring & insight', 'DoLR / leadership', 'National dashboard, alerts, MIS exports, predictive risk indicators'],
]

const techRows = [
  ['Experience', 'React + TypeScript + PWA', 'Responsive workflows for ministry, state and field teams'],
  ['Workflow', 'Temporal / Camunda', 'Configurable approvals, SLA timers and escalation rules'],
  ['Spatial', 'PostGIS + GeoServer + MapLibre', 'Cadastral layers, parcel geometry and map-based progress'],
  ['Data', 'PostgreSQL + object storage', 'Versioned master data and secure document repository'],
  ['Integration', 'API Gateway + REST / FHIR-style contracts', 'Land records, treasury, e-sign, SMS and state portals'],
  ['Intelligence', 'Python + ML feature store', 'Delay prediction, anomaly detection and policy reporting'],
]

const pageMeta = {
  Projects: ['PROJECT CONTROL', 'Projects registry', 'Track every active acquisition project, milestone, owner and risk signal.'],
  'Parcels & GIS': ['SPATIAL OPERATIONS', 'Parcels & GIS', 'Review geo-tagged parcels, survey coverage and possession boundaries.'],
  Compensation: ['FINANCIAL CONTROL', 'Compensation tracker', 'Monitor assessed awards, DBT disbursals and reconciliation exceptions.'],
  'R&R & Families': ['PEOPLE & RESETTLEMENT', 'R&R and affected families', 'Follow rehabilitation commitments and family-level support delivery.'],
  Reports: ['DECISION SUPPORT', 'Reports centre', 'Generate operational, financial and executive reports from the national register.'],
}

const moduleRows = {
  Projects: [
    ['Delhi–Mumbai Expressway', 'Rajasthan', 'At risk', '68%', '24 milestones due'],
    ['Mumbai–Ahmedabad HSR', 'Gujarat', 'On track', '84%', 'Survey complete'],
    ['Ken–Betwa Link Project', 'Madhya Pradesh', 'On track', '52%', 'Award stage'],
    ['Amritsar–Kolkata Freight Corridor', 'Uttar Pradesh', 'Delayed', '41%', 'R&R plan pending'],
  ],
  'Parcels & GIS': [
    ['RJ-ALW-004821', 'Rajasthan · Alwar', 'Expressway', 'Verified', '18.4 ha'],
    ['GJ-VLS-001936', 'Gujarat · Valsad', 'HSR corridor', 'Survey due', '7.2 ha'],
    ['MP-CHT-003118', 'Madhya Pradesh · Chhatarpur', 'Ken–Betwa', 'Verified', '12.8 ha'],
    ['UP-KNP-006250', 'Uttar Pradesh · Kanpur', 'Freight corridor', 'Exception', '21.6 ha'],
  ],
  Compensation: [
    ['Award batch #RJ-042', 'Rajasthan', '₹ 1,284 Cr', '₹ 1,012 Cr', '79%', 'Reconciliation due'],
    ['Award batch #GJ-018', 'Gujarat', '₹ 846 Cr', '₹ 812 Cr', '96%', 'On track'],
    ['Award batch #MP-031', 'Madhya Pradesh', '₹ 1,090 Cr', '₹ 874 Cr', '80%', 'Bank validation'],
    ['Award batch #UP-057', 'Uttar Pradesh', '₹ 2,410 Cr', '₹ 1,296 Cr', '54%', 'At risk'],
  ],
  'R&R & Families': [
    ['Rajasthan · Alwar', '2,842 families', '1,996 settled', '70%', 'Livelihood plans due'],
    ['Gujarat · Valsad', '1,206 families', '1,112 settled', '92%', 'On track'],
    ['Madhya Pradesh · Chhatarpur', '3,614 families', '2,318 settled', '64%', 'Site handover due'],
    ['Uttar Pradesh · Kanpur', '4,882 families', '2,004 settled', '41%', 'Escalation required'],
  ],
}

const reportRows = [
  ['National portfolio brief', 'Executive', 'Updated today', 'PDF'],
  ['State-wise acquisition progress', 'Operations', 'Updated yesterday', 'XLSX'],
  ['Compensation disbursal register', 'Finance', 'Updated 2 days ago', 'CSV'],
  ['R&R action register', 'District teams', 'Updated today', 'XLSX'],
]

function StatusPill({ value }) {
  const tone = value.toLowerCase().includes('risk') || value.toLowerCase().includes('exception') || value.toLowerCase().includes('escalation') || value.toLowerCase().includes('delayed') ? 'coral' : value.toLowerCase().includes('due') || value.toLowerCase().includes('pending') || value.toLowerCase().includes('validation') ? 'yellow' : 'green'
  return <span className={`status ${tone}`}><i></i>{value}</span>
}

function ReportBuilder({ onClose, onGenerated }) {
  const [reportType, setReportType] = useState('National portfolio brief')
  const [state, setState] = useState('All states')
  const [fromDate, setFromDate] = useState('2026-04-01')
  const [toDate, setToDate] = useState('2026-09-07')
  const [generating, setGenerating] = useState(false)

  const generate = (event) => {
    event.preventDefault()
    setGenerating(true)
    const rows = projects.filter((project) => state === 'All states' || project.state === state)
    const reportRows = [
      ['BHUMISETU report', reportType],
      ['State filter', state],
      ['Date range', `${fromDate} to ${toDate}`],
      [],
      ['Project', 'State', 'Status', 'Progress', 'Parcels', 'Area acquired'],
      ...rows.map((project) => [project.name, project.state, project.status, `${project.progress}%`, project.parcels, project.area]),
    ]
    const content = reportRows.map((row) => row.map((cell) => `"${cell || ''}"`).join(',')).join('\n')
    window.setTimeout(() => {
      const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `${reportType.toLowerCase().replaceAll(' ', '-')}-${state.toLowerCase().replaceAll(' ', '-')}.csv`
      link.click()
      URL.revokeObjectURL(url)
      setGenerating(false)
      onGenerated(`${reportType} generated for ${state}.`)
    }, 450)
  }

  return <div className="modal-backdrop" onClick={onClose}><section className="report-builder" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">REPORT BUILDER</p><h2>Create a new report</h2><span>Choose the data scope and download a spreadsheet-ready CSV report.</span></div><button className="icon-button" onClick={onClose} aria-label="Close report builder"><X size={17} /></button></div><form onSubmit={generate}><div className="report-form-grid"><label>Report type<select value={reportType} onChange={(event) => setReportType(event.target.value)}><option>National portfolio brief</option><option>State-wise acquisition progress</option><option>Compensation disbursal register</option><option>R&R action register</option></select></label><label>State<select value={state} onChange={(event) => setState(event.target.value)}><option>All states</option><option>Rajasthan</option><option>Gujarat</option><option>Madhya Pradesh</option><option>Uttar Pradesh</option></select></label><label>From date<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} required /></label><label>To date<input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} required /></label><label>Format<input value="CSV" readOnly /></label></div><div className="report-preview"><FileText size={18} /><div><b>{reportType}</b><span>{state} · {fromDate} to {toDate} · {projects.filter((project) => state === 'All states' || project.state === state).length} project records</span></div><CheckCircle2 size={16} /></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={generating}>{generating ? <><RefreshCw size={15} className="spin" />Generating...</> : <><Download size={15} />Generate & download</>}</button></div></form></section></div>
}

function OperationalPage({ page, onAction }) {
  const [moduleQuery, setModuleQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const meta = pageMeta[page]
  const rows = moduleRows[page] || []
  const filteredRows = rows.filter((row) => row.join(' ').toLowerCase().includes(moduleQuery.toLowerCase()))

  const refresh = () => {
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 700)
  }

  if (page === 'Reports') {
    return <div className="module-page"><section className="module-heading"><div><p className="eyebrow">{meta[0]}</p><h1>{meta[1]}</h1><p>{meta[2]}</p></div><div className="module-actions"><button className="secondary-button" onClick={refresh}><RefreshCw size={15} className={refreshing ? 'spin' : ''} />Refresh</button><button className="primary-button" onClick={() => setShowReportBuilder(true)}><Plus size={15} />New report</button></div></section><div className="report-cards"><div className="module-stat"><span>Saved reports</span><b>18</b><small>4 shared with leadership</small></div><div className="module-stat"><span>Scheduled exports</span><b>07</b><small>Next run in 2 hours</small></div><div className="module-stat"><span>Data freshness</span><b>98.6%</b><small>All state feeds healthy</small></div></div><section className="data-panel"><div className="data-panel-heading"><div><p className="eyebrow">REPORT LIBRARY</p><h2>Available reports</h2></div><div className="search compact"><Search size={15} /><input value={moduleQuery} onChange={(event) => setModuleQuery(event.target.value)} placeholder="Search reports" /></div></div><div className="table-wrap"><table><thead><tr><th>Report</th><th>Audience</th><th>Last generated</th><th>Format</th><th></th></tr></thead><tbody>{reportRows.filter((row) => row.join(' ').toLowerCase().includes(moduleQuery.toLowerCase())).map((row) => <tr key={row[0]}><td><div className="report-name"><FileText size={16} /><b>{row[0]}</b></div></td><td>{row[1]}</td><td>{row[2]}</td><td><span className="file-type">{row[3]}</span></td><td><button className="row-action" onClick={() => onAction(`${row[0]} is ready to download.`)} aria-label={`Download ${row[0]}`}><Download size={15} /></button></td></tr>)}</tbody></table></div></section>{showReportBuilder && <ReportBuilder onClose={() => setShowReportBuilder(false)} onGenerated={(message) => { setShowReportBuilder(false); onAction(message) }} />}</div>
  }

  return <div className="module-page"><section className="module-heading"><div><p className="eyebrow">{meta[0]}</p><h1>{meta[1]}</h1><p>{meta[2]}</p></div><div className="module-actions"><button className="secondary-button" onClick={refresh}><RefreshCw size={15} className={refreshing ? 'spin' : ''} />Refresh data</button><button className="primary-button" onClick={() => onAction(`New ${page === 'Parcels & GIS' ? 'parcel verification' : page.toLowerCase().replace(' & ', ' and ')} workflow started.`)}><Plus size={15} />Create record</button></div></section><div className="module-stats"><div className="module-stat"><span>{page === 'Parcels & GIS' ? 'Geo-tagged parcels' : page === 'Compensation' ? 'Total assessed' : page === 'R&R & Families' ? 'Affected families' : 'Active projects'}</span><b>{page === 'Parcels & GIS' ? '14,892' : page === 'Compensation' ? '₹ 11,208 Cr' : page === 'R&R & Families' ? '12,544' : '263'}</b><small><TrendingUp size={12} /> 8.4% from last month</small></div><div className="module-stat"><span>{page === 'Parcels & GIS' ? 'Survey coverage' : page === 'Compensation' ? 'Disbursed' : page === 'R&R & Families' ? 'Settled families' : 'On track'}</span><b>{page === 'Parcels & GIS' ? '81%' : page === 'Compensation' ? '₹ 8,942 Cr' : page === 'R&R & Families' ? '7,430' : '187'}</b><small>Current national position</small></div><div className="module-stat"><span>Open actions</span><b>{page === 'Parcels & GIS' ? '142' : page === 'Compensation' ? '36' : page === 'R&R & Families' ? '2,804' : '24'}</b><small className="warning-text"><AlertTriangle size={12} /> Requires attention</small></div></div>{page === 'Parcels & GIS' && <div className="module-map"><div className="module-map-copy"><p className="eyebrow">GIS WORKSPACE</p><h2>Parcel verification map</h2><p>Choose a parcel row to open its survey record and verification history.</p><button className="secondary-button" onClick={() => onAction('GIS layer controls are ready for the next integration.')}><Layers3 size={15} />Manage layers</button></div><div className="module-map-art"><div className="map-grid-lines"></div><div className="india-shape"><span className="state-dot d1"></span><span className="state-dot d2"></span><span className="state-dot d3"></span><span className="state-dot d4"></span></div><span className="map-label label-north">NORTH ZONE</span><span className="map-label label-south">SOUTH ZONE</span></div></div>}<section className="data-panel"><div className="data-panel-heading"><div><p className="eyebrow">LIVE REGISTER</p><h2>{page === 'Projects' ? 'Project portfolio' : page === 'Parcels & GIS' ? 'Parcel register' : page === 'Compensation' ? 'Award batches' : 'District R&R register'}</h2></div><div className="data-tools"><div className="search compact"><Search size={15} /><input value={moduleQuery} onChange={(event) => setModuleQuery(event.target.value)} placeholder="Search register" /></div><button className="icon-button" onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filters"><Filter size={15} /></button></div></div>{showFilters && <div className="inline-filters"><span>Showing {filteredRows.length} of {rows.length} records</span><button onClick={() => { setModuleQuery(''); setShowFilters(false) }}>Clear filters <X size={13} /></button></div>}<div className="table-wrap"><table><thead><tr>{(page === 'Projects' ? ['Project', 'State', 'Status', 'Progress', 'Next action'] : page === 'Parcels & GIS' ? ['Parcel ID', 'Location', 'Project', 'Verification', 'Area'] : page === 'Compensation' ? ['Batch', 'State', 'Assessed', 'Paid', 'Progress', 'Status'] : ['District', 'Affected families', 'Settled', 'Progress', 'Next action']).map((heading) => <th key={heading}>{heading}</th>)}<th></th></tr></thead><tbody>{filteredRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{index === (page === 'Projects' ? 2 : page === 'Parcels & GIS' ? 3 : page === 'Compensation' ? 5 : 4) ? <StatusPill value={cell} /> : index === (page === 'Projects' ? 3 : page === 'Compensation' ? 4 : page === 'R&R & Families' ? 3 : -1) ? <div className="table-progress"><span><i style={{ width: cell }}></i></span><b>{cell}</b></div> : index === 0 ? <b className="cell-strong">{cell}</b> : cell}</td>)}<td><button className="row-action" onClick={() => onAction(`${row[0]} opened for detailed review.`)} aria-label={`Open ${row[0]}`}><ChevronRight size={15} /></button></td></tr>)}</tbody></table>{filteredRows.length === 0 && <div className="empty-state">No records match your search.</div>}</div></section></div>
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [activeView, setActiveView] = useState('Overview')
  const [stateFilter, setStateFilter] = useState('All states')
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [mapZoom, setMapZoom] = useState(1)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello Ananya. I can help you investigate projects, compensation, parcels, milestones, and R&R progress from the current BHUMISETU portfolio.' },
  ])

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesState = stateFilter === 'All states' || project.state === stateFilter
    const matchesQuery = `${project.name} ${project.code}`.toLowerCase().includes(query.toLowerCase())
    return matchesState && matchesQuery
  }), [query, stateFilter])

  const navItems = [
    ['Overview', Activity], ['Projects', Layers3], ['Parcels & GIS', Map], ['Compensation', FileCheck2], ['R&R & Families', UsersRound], ['Reports', FileText],
  ]

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const navigate = (page) => {
    setActivePage(page)
    setActiveView('Overview')
    setSidebarOpen(false)
  }

  const exportReport = () => {
    const csv = [['Project', 'State', 'Status', 'Progress', 'Parcels', 'Area acquired'], ...projects.map((project) => [project.name, project.state, project.status, `${project.progress}%`, project.parcels, project.area])].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'bhumisetu-project-progress.csv'
    link.click()
    URL.revokeObjectURL(url)
    notify('Project progress report downloaded.')
  }

  const sendChatMessage = async (event) => {
    event.preventDefault()
    const question = chatInput.trim()
    if (!question || chatLoading) return

    setChatInput('')
    setChatMessages((messages) => [...messages, { role: 'user', content: question }])
    setChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: {
            dashboard: { proposedLand: '18,462 ha', acquiredLand: '11,207 ha', compensationPaid: '₹8,942 Cr', affectedFamilies: '1,24,680', familiesNeedingRr: '8,420' },
            projects,
            alerts: ['24 milestones due this week; 5 overdue', '36 proposals awaiting scrutiny', '8,420 families need R&R action'],
          },
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Assistant service unavailable')
      }
      const data = await response.json()
      setChatMessages((messages) => [...messages, { role: 'assistant', content: data.answer }])
    } catch (error) {
      setChatMessages((messages) => [...messages, { role: 'assistant', content: `I could not complete that request: ${error.message}` }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><ShieldCheck size={19} /></div><div><strong>BHUMI<span>SETU</span></strong><small>National Land Mission</small></div></div>
        <div className="workspace-label">MONITORING CONSOLE <span>v2.4</span></div>
        <nav>{navItems.map(([label, Icon]) => <button key={label} className={activePage === label ? 'active' : ''} onClick={() => navigate(label)}><Icon size={17} /><span>{label}</span>{label === 'Reports' && <em>3</em>}</button>)}</nav>
        <div className="sidebar-bottom"><button onClick={() => notify('Workspace settings are available to National Admin users.')}><Settings2 size={17} />Workspace settings</button><button className="help-card" onClick={() => setShowHelp(!showHelp)}><CircleHelp size={16} /><div><b>Need assistance?</b><span>Open the operations guide</span></div><ArrowUpRight size={14} /></button><div className="user-row"><div className="avatar">AS</div><div><b>Ananya Sharma</b><span>National Admin</span></div><MoreHorizontal size={17} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation"><Menu size={19} /></button><div className="crumb"><span>BHUMISETU</span><b>/</b><strong>{activePage === 'Overview' ? 'National overview' : activePage}</strong></div><div className="top-actions"><div className="sync-state"><span className="pulse"></span>Live data <small>Updated 2 min ago</small></div><div className="top-popover-wrap"><button className="icon-button" onClick={() => { setShowNotifications(!showNotifications); setShowHelp(false) }} aria-label="Notifications"><Bell size={18} /><i>4</i></button>{showNotifications && <div className="top-popover"><b>Notifications</b><span>5 milestones are overdue in Rajasthan.</span><span>36 proposals await scrutiny.</span><button onClick={() => { setShowNotifications(false); navigate('Projects') }}>Review actions <ArrowUpRight size={13} /></button></div>}</div><div className="top-popover-wrap"><button className="icon-button" onClick={() => { setShowHelp(!showHelp); setShowNotifications(false) }} aria-label="Help"><CircleHelp size={18} /></button>{showHelp && <div className="top-popover help-popover"><b>Operations guide</b><span>Use the left navigation to move between registers. Every row opens a detailed review action.</span><button onClick={() => { setShowHelp(false); notify('Guide request sent to support.') }}>Contact support <ArrowUpRight size={13} /></button></div>}</div></div></header>
        <div className="page-wrap">
          {activePage === 'Overview' ? <>
          <section className="page-heading"><div><p className="eyebrow">MINISTRY OF RURAL DEVELOPMENT · DOLR</p><h1>National overview</h1><p className="heading-copy">A live view of land acquisition, compensation and rehabilitation across India.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => setShowPlan(!showPlan)}><FileText size={16} />{showPlan ? 'Hide implementation plan' : 'View implementation plan'}</button><button className="primary-button" onClick={exportReport}><Download size={16} />Export report</button></div></section>

          <section className="kpi-grid">
            <div className="kpi-card accent"><div className="kpi-top"><span>Total land proposed</span><span className="kpi-icon"><Map size={17} /></span></div><strong>18,462 <small>ha</small></strong><div className="kpi-foot positive"><TrendingUp size={14} /> 8.4% <span>vs last quarter</span></div></div>
            <div className="kpi-card"><div className="kpi-top"><span>Land acquired</span><span className="kpi-icon"><CheckCircle2 size={17} /></span></div><strong>11,207 <small>ha</small></strong><div className="progress-line"><span style={{ width: '61%' }}></span></div><div className="kpi-foot"><b>61%</b><span>of proposed area</span></div></div>
            <div className="kpi-card"><div className="kpi-top"><span>Compensation paid</span><span className="kpi-icon"><FileCheck2 size={17} /></span></div><strong>₹ 8,942 <small>Cr</small></strong><div className="kpi-foot positive"><TrendingUp size={14} /> 12.1% <span>disbursed this FY</span></div></div>
            <div className="kpi-card"><div className="kpi-top"><span>Affected families</span><span className="kpi-icon"><UsersRound size={17} /></span></div><strong>1,24,680</strong><div className="kpi-foot warning"><AlertTriangle size={14} /> 8,420 <span>need R&R action</span></div></div>
          </section>

          <div className="filter-bar"><div className="tabs">{['Overview', 'Projects', 'State progress', 'Milestones'].map((tab) => <button key={tab} className={activeView === tab ? 'selected' : ''} onClick={() => { setActiveView(tab); if (tab === 'Projects') setQuery('') }}>{tab}</button>)}</div><div className="filters"><div className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" /></div><label><Filter size={15} /><select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}><option>All states</option><option>Rajasthan</option><option>Gujarat</option><option>Madhya Pradesh</option><option>Uttar Pradesh</option></select><ChevronDown size={14} /></label><button className="icon-button filter-button" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} aria-label="More filters"><SlidersHorizontal size={17} /></button></div></div>
          {showAdvancedFilters && <div className="advanced-filter-row"><span><Check size={13} /> Showing live portfolio data</span><button onClick={() => { setStateFilter('All states'); setQuery(''); setShowAdvancedFilters(false) }}>Reset filters <X size={13} /></button></div>}

          <section className="dashboard-grid"><div className="panel map-panel"><div className="panel-heading"><div><p className="eyebrow">SPATIAL MONITORING</p><h2>Acquisition footprint</h2></div><div className="map-legend"><span><i className="dot green"></i>On track</span><span><i className="dot yellow"></i>In review</span><span><i className="dot coral"></i>At risk</span></div></div><div className="map-stage"><div className="map-grid-lines"></div><div className="india-shape" style={{ transform: `scale(${mapZoom})` }}><span className="state-dot d1"></span><span className="state-dot d2"></span><span className="state-dot d3"></span><span className="state-dot d4"></span><span className="state-dot d5"></span><span className="state-dot d6"></span><span className="state-dot d7"></span></div><div className="map-label label-north">NORTH ZONE</div><div className="map-label label-west">WEST ZONE</div><div className="map-label label-east">EAST ZONE</div><div className="map-label label-south">SOUTH ZONE</div><div className="map-tooltip"><span className="dot coral"></span><div><b>Rajasthan</b><small>2,146 ha acquired · 68%</small></div><ArrowUpRight size={14} /></div><div className="map-controls"><button onClick={() => setMapZoom(Math.min(mapZoom + .1, 1.4))}>+</button><button onClick={() => setMapZoom(Math.max(mapZoom - .1, .8))}>−</button><button onClick={() => navigate('Parcels & GIS')}><Map size={14} /></button></div><div className="map-scale">{Math.round(100 / mapZoom)} km</div></div><div className="map-footer"><span><b>17</b> States active</span><span><b>263</b> Projects tracked</span><span><b>11,207 ha</b> Acquired</span><button onClick={() => navigate('Parcels & GIS')}>Open full map <ArrowUpRight size={14} /></button></div></div>
            <div className="panel insight-panel"><div className="panel-heading"><div><p className="eyebrow">DECISION SUPPORT</p><h2>Attention required</h2></div><button className="text-button" onClick={() => navigate('Projects')}>View all <ArrowUpRight size={14} /></button></div><div className="alert-list"><button className="alert-item high" onClick={() => navigate('Projects')}><div className="alert-symbol"><AlertTriangle size={16} /></div><div><b>24 milestones due this week</b><span>Across 8 projects · 5 are already overdue</span></div><ArrowUpRight size={15} /></button><button className="alert-item" onClick={() => notify('Proposal scrutiny queue opened.')}><div className="alert-symbol"><FileText size={16} /></div><div><b>36 proposals awaiting scrutiny</b><span>Oldest submission is 12 days old</span></div><ArrowUpRight size={15} /></button><button className="alert-item" onClick={() => navigate('R&R & Families')}><div className="alert-symbol"><UsersRound size={16} /></div><div><b>8,420 families need R&R action</b><span>District plans pending validation</span></div><ArrowUpRight size={15} /></button></div><div className="insight-note"><Activity size={16} /><span><b>Predictive signal:</b> 3 projects may miss possession targets in the next 30 days.</span></div></div></section>

          <section className="panel projects-panel"><div className="panel-heading"><div><p className="eyebrow">PORTFOLIO HEALTH</p><h2>Project progress</h2></div><button className="text-button" onClick={() => navigate('Projects')}>All projects <ArrowUpRight size={14} /></button></div><div className="table-wrap"><table><thead><tr><th>Project</th><th>State</th><th>Status</th><th>Progress</th><th>Parcels</th><th>Area acquired</th><th></th></tr></thead><tbody>{visibleProjects.map((project) => <tr key={project.name}><td><div className="project-name"><span className={`project-bar ${project.color}`}></span><div><b>{project.name}</b><small>{project.code}</small></div></div></td><td>{project.state}</td><td><span className={`status ${project.color}`}><i></i>{project.status}</span></td><td><div className="table-progress"><span><i style={{ width: `${project.progress}%` }}></i></span><b>{project.progress}%</b></div></td><td>{project.parcels}</td><td>{project.area}</td><td><button className="row-action" onClick={() => setSelectedProject(project)} aria-label={`Open ${project.name}`}><Eye size={15} /></button></td></tr>)}</tbody></table>{visibleProjects.length === 0 && <div className="empty-state">No projects match the current filters.</div>}</div></section>

          {showPlan && <section className="plan-section"><div className="plan-heading"><div><p className="eyebrow">IMPLEMENTATION BLUEPRINT</p><h2>Scope of study & technology plan</h2><p>Phased delivery structure for a secure, interoperable national platform.</p></div><span className="plan-badge"><ShieldCheck size={15} />Designed for scale</span></div><div className="plan-grid"><div className="plan-table"><h3>Scope of study</h3><table><thead><tr><th>#</th><th>Workstream</th><th>Owner</th><th>Coverage</th></tr></thead><tbody>{scopeRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={index === 1 ? 'strong-cell' : ''}>{cell}</td>)}</tr>)}</tbody></table></div><div className="plan-table"><h3>Suggested components-wise technology</h3><table><thead><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr></thead><tbody>{techRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={index === 0 ? 'strong-cell' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div></section>}
          <footer><span>BHUMISETU · National Land Acquisition & Management System</span><span>Data classification: <b>Government use</b> · Last sync 09 Sep 2026, 11:42 IST</span></footer>
          </> : <OperationalPage page={activePage} onAction={notify} />}
        </div>
        {selectedProject && <div className="modal-backdrop" onClick={() => setSelectedProject(null)}><section className="project-modal" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">PROJECT DETAIL</p><h2>{selectedProject.name}</h2><span>{selectedProject.code} · {selectedProject.state}</span></div><button className="icon-button" onClick={() => setSelectedProject(null)} aria-label="Close project detail"><X size={17} /></button></div><div className="modal-grid"><div><span>Current status</span><StatusPill value={selectedProject.status} /></div><div><span>Completion</span><b>{selectedProject.progress}%</b></div><div><span>Area acquired</span><b>{selectedProject.area}</b></div><div><span>Parcels tracked</span><b>{selectedProject.parcels}</b></div></div><div className="modal-timeline"><div><CheckCircle2 size={16} /><span><b>Proposal approved</b><small>Completed 14 Jan 2025</small></span></div><div><CheckCircle2 size={16} /><span><b>Notification and survey</b><small>Completed 22 Apr 2025</small></span></div><div className="current"><CalendarDays size={16} /><span><b>Award and compensation</b><small>Current workflow stage · next review in 4 days</small></span></div></div><div className="modal-actions"><button className="secondary-button" onClick={() => notify('Project record opened in review mode.')}><Eye size={15} />Open full record</button><button className="primary-button" onClick={() => { setSelectedProject(null); notify('Project owner has been notified.') }}><Send size={15} />Notify owner</button></div></section></div>}
        {toast && <div className="toast"><CheckCircle2 size={16} />{toast}</div>}
        <button className={`assistant-launcher ${chatOpen ? 'is-hidden' : ''}`} onClick={() => setChatOpen(true)} aria-label="Open AI assistant"><Sparkles size={17} /><span>Ask BHUMI AI</span></button>
        {chatOpen && <aside className="assistant-panel"><div className="assistant-header"><div className="assistant-title"><span className="assistant-icon"><Bot size={17} /></span><div><b>BHUMI AI</b><small>Portfolio intelligence assistant</small></div></div><button className="assistant-close" onClick={() => setChatOpen(false)} aria-label="Close AI assistant"><X size={17} /></button></div><div className="assistant-scope"><Sparkles size={13} /> Has access to current dashboard data</div><div className="chat-messages">{chatMessages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'assistant' ? <Bot size={13} /> : 'AS'}</div><p>{message.content}</p></div>)}{chatLoading && <div className="chat-message assistant"><div className="message-avatar"><Bot size={13} /></div><p className="typing"><span></span><span></span><span></span></p></div>}</div><div className="chat-suggestions"><button onClick={() => setChatInput('Which projects are at risk and why?')}>At-risk projects</button><button onClick={() => setChatInput('Summarize the R&R situation.')}>R&R summary</button></div><form className="chat-form" onSubmit={sendChatMessage}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about the portfolio..." aria-label="Ask BHUMI AI" /><button type="submit" disabled={!chatInput.trim() || chatLoading} aria-label="Send message"><Send size={16} /></button></form><div className="assistant-disclaimer">AI suggestions should be verified against official records before action.</div></aside>}
      </main>
    </div>
  )
}

export default App
