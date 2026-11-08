import { useState } from "react";

const WebDevelopmentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M8 21h8m-4-4v4M8 9l-2 2 2 2m8-4 2 2-2 2m-4-4-1 4" />
  </svg>
);

const MobileDevelopmentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M10 5h4m-3 13h2" />
  </svg>
);

const DesignIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m14 4 6 6M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z" />
    <path d="M12 20h8" />
  </svg>
);

const skills = [
  {
    name: "Web Development",
    icon: <WebDevelopmentIcon />,
    items: [
      "Single Page Applications (SPAs)",
      "Landing pages and business websites",
      "Portfolio websites",
    ],
  },
  {
    name: "Mobile Development",
    icon: <MobileDevelopmentIcon />,
    items: ["Mobile-friendly web apps", "React Native mobile apps"],
  },
  {
    name: "UI/UX Design & Prototyping",
    icon: <DesignIcon />,
    items: [
      "UI design with Figma & Canva",
      "UX research & improvements",
      "Prototyping for websites & mobile apps",
    ],
  },
];

export default function SkillsList() {
  const [openItem, setOpenItem] = useState(null);

  return (
    <ul className="mt-4 space-y-4 text-lg">
      {skills.map(({ name, icon, items }) => {
        const isOpen = openItem === name;
        const detailsId = `skills-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

        return (
          <li key={name}>
            <button
              type="button"
              className="skill-toggle"
              aria-expanded={isOpen}
              aria-controls={detailsId}
              onClick={() => setOpenItem(isOpen ? null : name)}
            >
              <span className="skill-icon">{icon}</span>
              <span>{name}</span>
              <span className="skill-chevron" aria-hidden="true">⌄</span>
            </button>
            <ul id={detailsId} className={`skill-details${isOpen ? "" : " hidden"}`}>
              {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
