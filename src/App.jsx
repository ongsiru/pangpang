import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  CheckCircle2,
  Code2,
  Compass,
  DatabaseZap,
  Gauge,
  Globe2,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Paintbrush,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Wand2,
  X,
} from "lucide-react";

const navItems = [
  { href: "#work", label: "작업물" },
  { href: "#services", label: "서비스" },
  { href: "#process", label: "프로세스" },
  { href: "#contact", label: "문의" },
];

const metrics = [
  { value: "2-6주", label: "런칭 평균 기간" },
  { value: "React", label: "모던 프론트엔드" },
  { value: "SEO/AEO", label: "검색과 AI 노출 고려" },
  { value: "운영형", label: "관리자와 자동화 포함" },
];

const services = [
  {
    icon: Globe2,
    title: "브랜드 홈페이지",
    desc: "처음 만나는 화면에서 신뢰와 차이를 전달하는 회사 소개, 병원, 학원, 매장, 포트폴리오 사이트를 설계합니다.",
    tags: ["카피라이팅", "반응형", "검색 최적화"],
  },
  {
    icon: Rocket,
    title: "랜딩페이지",
    desc: "광고 유입, 예약, 상담, 구매 같은 목표 행동을 중심으로 섹션 구조와 전환 흐름을 촘촘하게 만듭니다.",
    tags: ["전환율", "A/B 테스트", "빠른 제작"],
  },
  {
    icon: Store,
    title: "커머스와 예약",
    desc: "상품, 결제, 예약, 견적, 알림까지 고객이 막히지 않고 끝까지 진행하는 웹 경험을 구축합니다.",
    tags: ["결제", "예약", "알림"],
  },
  {
    icon: LayoutDashboard,
    title: "관리자와 대시보드",
    desc: "운영자가 매일 보는 주문, 고객, 재고, 콘텐츠, 지표 화면을 보기 쉽고 고치기 쉬운 구조로 만듭니다.",
    tags: ["CMS", "데이터", "권한"],
  },
  {
    icon: DatabaseZap,
    title: "업무 자동화",
    desc: "반복 입력, 엑셀 정리, 문의 분류, 문자 발송, 리포트 생성 같은 뒤쪽 일을 웹에서 처리되게 연결합니다.",
    tags: ["API 연동", "CRM", "리포트"],
  },
  {
    icon: ShieldCheck,
    title: "운영과 개선",
    desc: "런칭 후 속도, 접근성, 보안, 로그, 콘텐츠 수정까지 실제로 굴러가는 사이트로 계속 다듬습니다.",
    tags: ["유지보수", "속도 개선", "보안"],
  },
];

const caseStudies = [
  {
    label: "브랜드",
    title: "전문 서비스 회사 홈페이지",
    result: "문의 전환 38% 상승",
    desc: "흩어진 장점과 사례를 첫 화면, 서비스, 후기, 문의 흐름으로 재배치해 신뢰를 빠르게 쌓는 구조로 정리했습니다.",
    color: "lime",
    stack: ["React", "Content Strategy", "SEO"],
  },
  {
    label: "커머스",
    title: "로컬 브랜드 쇼핑몰",
    result: "모바일 구매 완료율 24% 상승",
    desc: "상품 탐색, 옵션 선택, 장바구니, 결제 전환을 모바일 기준으로 다시 설계하고 운영자 상품 관리 화면을 붙였습니다.",
    color: "coral",
    stack: ["React", "Payments", "CMS"],
  },
  {
    label: "예약",
    title: "상담 예약 랜딩",
    result: "상담 신청 2.1배 증가",
    desc: "광고 키워드별 메시지와 예약 동선을 분리하고, 상담 가능 시간과 자동 알림을 연동했습니다.",
    color: "cyan",
    stack: ["Landing", "Automation", "Analytics"],
  },
  {
    label: "B2B",
    title: "운영 대시보드",
    result: "주간 리포트 작업 70% 절감",
    desc: "엑셀로 관리하던 매출, 문의, 진행 상황을 한 화면에서 확인하고 자동 리포트로 공유되게 만들었습니다.",
    color: "violet",
    stack: ["Dashboard", "API", "Role Control"],
  },
];

const process = [
  {
    icon: Compass,
    title: "목표 정리",
    desc: "누가 들어오고, 무엇을 보고, 어떤 행동을 해야 하는지 먼저 좁힙니다.",
  },
  {
    icon: Paintbrush,
    title: "화면 설계",
    desc: "브랜드 톤, 섹션 순서, 문구, UI 컴포넌트를 실제 화면 기준으로 만듭니다.",
  },
  {
    icon: Code2,
    title: "React 개발",
    desc: "반응형, 접근성, 속도, 관리자 연동까지 배포 가능한 코드로 구현합니다.",
  },
  {
    icon: Gauge,
    title: "런칭과 개선",
    desc: "검색, 분석, 폼, 이벤트 추적을 붙이고 실제 데이터로 다음 개선점을 잡습니다.",
  },
];

const stacks = [
  "React",
  "Vite",
  "Next.js",
  "TypeScript",
  "Supabase",
  "Node.js",
  "Shopify",
  "Framer Motion",
  "GA4",
  "Search Console",
  "SEO",
  "AEO",
];

const packages = [
  {
    title: "Launch",
    period: "2-3주",
    desc: "회사 소개, 랜딩, 이벤트 페이지처럼 빠르게 공개해야 하는 웹사이트에 적합합니다.",
    points: ["반응형 1-5페이지", "기본 SEO 세팅", "문의 폼과 분석 연동"],
  },
  {
    title: "Growth",
    period: "4-6주",
    desc: "브랜드 스토리, 포트폴리오, CMS, 전환 개선까지 함께 필요한 프로젝트에 맞습니다.",
    points: ["콘텐츠 구조 설계", "관리자/CMS", "전환 이벤트 추적"],
  },
  {
    title: "System",
    period: "협의",
    desc: "예약, 결제, 대시보드, 자동화처럼 내부 운영과 연결되는 웹앱을 구축합니다.",
    points: ["API와 데이터베이스", "권한과 관리자 화면", "운영 자동화"],
  },
];

function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
}

function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className={`site-header ${solid ? "is-solid" : ""}`}>
      <a className="brand" href="#top" aria-label="Pangpang Web 홈">
        <span className="brand-mark" aria-hidden="true">
          P
        </span>
        <span>Pangpang Web</span>
      </a>

      <nav className="desktop-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contact">
        상담하기
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={`mobile-panel ${open ? "is-open" : ""}`}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className="mobile-contact" href="#contact" onClick={() => setOpen(false)}>
          프로젝트 상담
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <img
        className="hero-bg"
        src="/assets/pangpang-showcase.png"
        alt=""
        aria-hidden="true"
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-kicker">Web Development Studio in Seoul</p>
        <h1>Pangpang Web</h1>
        <p className="hero-lead">
          브랜드가 보이고, 고객이 행동하고, 운영이 쉬워지는 웹사이트와 웹앱을
          기획부터 디자인, React 개발, 런칭 이후 개선까지 함께 만듭니다.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            프로젝트 상담
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a className="button button-glass" href="#work">
            작업물 보기
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-tags" aria-label="핵심 역량">
          <span>UX/UI</span>
          <span>React</span>
          <span>SEO/AEO</span>
          <span>Automation</span>
        </div>
      </div>
      <div className="hero-status" aria-label="현재 프로젝트 상태">
        <span className="status-dot" aria-hidden="true" />
        2026 신규 프로젝트 슬롯 오픈
      </div>
    </section>
  );
}

function SignalStrip() {
  return (
    <section className="signal-strip" aria-label="Pangpang Web 핵심 지표">
      {metrics.map((metric) => (
        <div className="metric" key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </section>
  );
}

function ServiceCard({ service, index }) {
  const Icon = service.icon;
  return (
    <article className="service-card" data-reveal style={{ "--delay": `${index * 70}ms` }}>
      <div className="service-icon">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3>{service.title}</h3>
      <p>{service.desc}</p>
      <div className="tag-list">
        {service.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

function WorkPreview({ active }) {
  const bars = useMemo(() => [88, 64, 76, 92, 58, 81], [active]);

  return (
    <div className={`work-preview theme-${active.color}`} aria-hidden="true">
      <div className="preview-topbar">
        <span />
        <span />
        <span />
        <strong>{active.label}</strong>
      </div>
      <div className="preview-layout">
        <div className="preview-sidebar">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="preview-main">
          <div className="preview-headline" />
          <div className="preview-copy" />
          <div className="preview-copy short" />
          <div className="preview-row">
            {bars.slice(0, 3).map((bar) => (
              <span key={bar} style={{ "--bar": `${bar}%` }} />
            ))}
          </div>
          <div className="preview-chart">
            {bars.map((bar) => (
              <i key={bar} style={{ "--bar": `${bar}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = caseStudies[activeIndex];

  return (
    <section className="section work-section" id="work">
      <div className="section-heading" data-reveal>
        <span className="section-kicker">Selected Work</span>
        <h2>예쁜 화면에서 끝나지 않게, 결과가 남는 구조로 만듭니다.</h2>
        <p>
          업종은 달라도 목표는 비슷합니다. 더 잘 설명하고, 더 쉽게 행동하게 하고,
          운영자가 덜 헤매게 만드는 것.
        </p>
      </div>

      <div className="work-grid">
        <div className="work-tabs" data-reveal>
          {caseStudies.map((item, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              key={item.title}
              onClick={() => setActiveIndex(index)}
            >
              <span>{item.label}</span>
              {item.title}
            </button>
          ))}
        </div>

        <article className="work-detail" data-reveal>
          <WorkPreview active={active} />
          <div className="work-copy">
            <span className={`case-chip chip-${active.color}`}>{active.result}</span>
            <h3>{active.title}</h3>
            <p>{active.desc}</p>
            <div className="stack-row">
              {active.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="section services-section" id="services">
      <div className="section-heading compact" data-reveal>
        <span className="section-kicker">What We Build</span>
        <h2>웹에 필요한 앞쪽 화면과 뒤쪽 운영을 같이 봅니다.</h2>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section process-section" id="process">
      <div className="section-heading" data-reveal>
        <span className="section-kicker">Process</span>
        <h2>작게 시작해도 완성도는 크게 가져갑니다.</h2>
        <p>
          말로만 정리된 아이디어를 실제 화면, 실제 코드, 실제 운영 흐름으로 바꾸는
          순서입니다.
        </p>
      </div>

      <div className="process-list">
        {process.map((item, index) => {
          const Icon = item.icon;
          return (
            <article className="process-item" data-reveal key={item.title}>
              <span className="process-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="process-icon">
                <Icon size={22} aria-hidden="true" />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StackBand() {
  const repeated = [...stacks, ...stacks];
  return (
    <section className="stack-band" aria-label="사용 기술">
      <div className="stack-track">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function PackageSection() {
  return (
    <section className="section package-section">
      <div className="section-heading compact" data-reveal>
        <span className="section-kicker">Project Modes</span>
        <h2>필요한 속도와 범위에 맞춰 시작합니다.</h2>
      </div>
      <div className="package-grid">
        {packages.map((item) => (
          <article className="package-card" data-reveal key={item.title}>
            <div className="package-head">
              <h3>{item.title}</h3>
              <span>{item.period}</span>
            </div>
            <p>{item.desc}</p>
            <ul>
              {item.points.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const company = form.get("company") || "새 프로젝트";
    const message = form.get("message") || "";
    const subject = encodeURIComponent(`[Pangpang Web] ${company} 상담 문의`);
    const body = encodeURIComponent(
      `회사/브랜드: ${company}\n연락처: ${form.get("contact") || ""}\n예산/일정: ${
        form.get("budget") || ""
      }\n\n프로젝트 내용:\n${message}`
    );
    setSent(true);
    window.location.href = `mailto:hello@pangpang.kr?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-copy" data-reveal>
        <span className="section-kicker">Start a Project</span>
        <h2>만들고 싶은 웹사이트가 있다면, 지금 가진 메모만으로도 충분합니다.</h2>
        <p>
          목표, 참고 사이트, 필요한 기능, 대략적인 일정만 알려주시면 우선순위와 제작
          범위를 정리해서 답변드릴게요.
        </p>
        <div className="contact-points">
          <span>
            <BadgeCheck size={18} aria-hidden="true" />
            1차 상담 무료
          </span>
          <span>
            <Sparkles size={18} aria-hidden="true" />
            디자인과 개발 동시 진행
          </span>
          <span>
            <MonitorSmartphone size={18} aria-hidden="true" />
            모바일 우선 제작
          </span>
        </div>
      </div>

      <form className="contact-form" data-reveal onSubmit={onSubmit}>
        <label>
          회사/브랜드명
          <input name="company" type="text" placeholder="예: 팡팡커피" required />
        </label>
        <label>
          연락처
          <input name="contact" type="text" placeholder="이메일 또는 전화번호" required />
        </label>
        <label>
          예산/희망 일정
          <input name="budget" type="text" placeholder="예: 5월 중 런칭, 300만원대" />
        </label>
        <label>
          프로젝트 내용
          <textarea
            name="message"
            rows="5"
            placeholder="필요한 페이지, 기능, 참고 사이트, 현재 고민을 적어주세요."
            required
          />
        </label>
        <button className="button button-primary" type="submit">
          문의 메일 작성
          <MessageCircle size={18} aria-hidden="true" />
        </button>
        {sent && <p className="form-note">메일 앱이 열리면 내용을 확인하고 보내주세요.</p>}
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <a className="brand" href="#top" aria-label="Pangpang Web 홈">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Pangpang Web</span>
        </a>
        <p>웹사이트, 웹앱, 운영 자동화를 만드는 작은 개발 스튜디오.</p>
      </div>
      <div className="footer-links">
        <a href="mailto:hello@pangpang.kr">hello@pangpang.kr</a>
        <a href="tel:+8215001234">1500-1234</a>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <SignalStrip />
        <section className="intro-section">
          <div className="intro-copy" data-reveal>
            <span className="section-kicker">Why Pangpang</span>
            <h2>디자인만 예쁜 사이트보다, 사업에 맞게 굴러가는 화면을 더 중요하게 봅니다.</h2>
          </div>
          <div className="intro-grid">
            <article data-reveal>
              <Blocks size={24} aria-hidden="true" />
              <h3>구조부터 정리</h3>
              <p>서비스 설명, 고객 여정, 문의 흐름을 먼저 잡아 화면이 목적 없이 늘어나지 않게 합니다.</p>
            </article>
            <article data-reveal>
              <Wand2 size={24} aria-hidden="true" />
              <h3>요즘 감각의 UI</h3>
              <p>큰 타이포, 명확한 여백, 선명한 컬러 시스템, 실제 작업물을 보여주는 비주얼로 차별화합니다.</p>
            </article>
            <article data-reveal>
              <Smartphone size={24} aria-hidden="true" />
              <h3>운영까지 연결</h3>
              <p>관리자, 폼, 알림, 분석, SEO까지 붙여서 런칭 후에도 손이 덜 가는 사이트를 만듭니다.</p>
            </article>
          </div>
        </section>
        <WorkSection />
        <ServicesSection />
        <StackBand />
        <ProcessSection />
        <PackageSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
