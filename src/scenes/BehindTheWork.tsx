import { ArrowUpRight } from "lucide-react";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import profilePortrait from "../assets/images/my-portrait.jpg";
import "../styles/behind-the-work.css";

const strengths = [
  "Problem Solving",
  "Adaptability",
  "Continuous Learning",
  "Attention to Detail",
  "Team Collaboration",
  "Curiosity & Initiative",
];

const principles = [
  "Build with Purpose",
  "Keep Learning",
  "Quality over Quantity",
  "Collaborate with Respect",
  "Never Stop Improving",
];

export default function BehindTheWork() {
  const { navigateToScene } = useSceneNavigation();

  return (
    <section
      id="behind-the-work"
      data-portfolio-section
      data-cinematic-scene={2}
      aria-labelledby="behind-the-work-title"
      className="about-profile professional-theme portfolio-section relative"
    >
      <div className="about-profile__guides" aria-hidden="true" />

      <div className="about-profile__layout professional-container professional-container--wide">
        <header className="about-profile__intro">
          <div className="about-profile__marker professional-label professional-enter">
            <span className="about-profile__marker-index">02 / ABOUT</span>
            <span className="about-profile__marker-line" aria-hidden="true" />
            <span>BEHIND THE WORK</span>
          </div>

          <h2 data-section-heading tabIndex={-1} id="behind-the-work-title" className="about-profile__headline professional-heading professional-enter">
            A developer focused on <span>useful, thoughtful software.</span>
          </h2>

          <div className="about-profile__intro-copy professional-body professional-enter">
            <p>
              Hi, my name is Jonel Bryan Ablog. I&apos;m a web developer from the Philippines who enjoys
              creating modern web applications with thoughtful user experiences. I love turning
              ideas into polished projects that feel intuitive, useful, and enjoyable to use.
            </p>
            <p>
              I&apos;m currently expanding my skills in full-stack development while working toward a
              career in software engineering.
            </p>
          </div>
        </header>

        <aside className="about-profile__identity professional-enter" aria-label="Professional profile">
          <figure className="about-profile__portrait-wrap">
            <span className="about-profile__coordinate about-profile__coordinate--top" aria-hidden="true">P / 02</span>
            <div className="about-profile__portrait professional-media-frame">
              <img
                src={profilePortrait}
                alt="Graduation portrait of Jonel Bryan Ablog"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="about-profile__caption">
              <span>JONEL BRYAN ABLOG</span>
              <span>PHILIPPINES</span>
            </figcaption>
            <span className="about-profile__coordinate about-profile__coordinate--bottom" aria-hidden="true">PROFILE / JBA</span>
          </figure>

          <dl className="about-profile__metadata">
            <div><dt>ROLE</dt><dd>Web Developer</dd></div>
            <div><dt>DIRECTION</dt><dd>Software Engineer</dd></div>
            <div><dt>FOCUS</dt><dd>Full-Stack + AI</dd></div>
          </dl>
        </aside>

        <div className="about-profile__details">
          <section className="about-profile__record about-profile__record--education" aria-labelledby="about-education-title">
            <div className="about-profile__section-heading">
              <span className="about-profile__section-number" aria-hidden="true">01</span>
              <h3 id="about-education-title">Education</h3>
            </div>
            <div className="about-profile__section-body">
              <p className="about-profile__record-name">University of Northern Philippines</p>
              <p className="about-profile__record-detail">Bachelor of Science in Information Technology</p>
              <p className="about-profile__honor">Cum Laude Graduate</p>
              <p className="about-profile__body-copy">
                Focused on software engineering, database systems, web development, and building
                practical applications through hands-on projects.
              </p>
            </div>
          </section>

          <section className="about-profile__record" aria-labelledby="about-direction-title">
            <div className="about-profile__section-heading">
              <span className="about-profile__section-number" aria-hidden="true">02</span>
              <h3 id="about-direction-title">Career Direction</h3>
            </div>
            <div className="about-profile__section-body">
              <p className="about-profile__record-name">Software Engineer</p>
              <p className="about-profile__body-copy">
                To become a software engineer who creates thoughtful, reliable, and user-centered
                software while continuously learning modern technologies and building meaningful
                digital experiences.
              </p>
            </div>
          </section>

          <section className="about-profile__record" aria-labelledby="about-strengths-title">
            <div className="about-profile__section-heading">
              <span className="about-profile__section-number" aria-hidden="true">03</span>
              <h3 id="about-strengths-title">Professional Strengths</h3>
            </div>
            <ol className="about-profile__indexed-list about-profile__indexed-list--strengths">
              {strengths.map((strength) => <li key={strength}>{strength}</li>)}
            </ol>
          </section>

          <section className="about-profile__record about-profile__record--focus" aria-labelledby="about-focus-title">
            <div className="about-profile__section-heading">
              <span className="about-profile__section-number" aria-hidden="true">04</span>
              <h3 id="about-focus-title">Current Focus</h3>
            </div>
            <p className="about-profile__body-copy">
              Currently seeking opportunities as a Software Engineer where I can contribute to
              real-world projects, expand my technical expertise, and continue crafting modern
              full-stack and AI-powered applications.
            </p>
          </section>

          <section className="about-profile__record" aria-labelledby="about-principles-title">
            <div className="about-profile__section-heading">
              <span className="about-profile__section-number" aria-hidden="true">05</span>
              <h3 id="about-principles-title">Working Principles</h3>
            </div>
            <ol className="about-profile__indexed-list about-profile__indexed-list--principles">
              {principles.map((principle) => <li key={principle}>{principle}</li>)}
            </ol>
          </section>

          <div className="about-profile__actions">
            <button
              type="button"
              className="professional-button professional-button--primary"
              onClick={(event) => navigateToScene(2, { focus: event.detail === 0 })}
            >
              Explore My Projects <ArrowUpRight aria-hidden="true" size={17} />
            </button>
            <button
              type="button"
              className="professional-button professional-button--secondary"
              onClick={(event) => navigateToScene(5, { focus: event.detail === 0 })}
            >
              Contact Me <ArrowUpRight aria-hidden="true" size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
