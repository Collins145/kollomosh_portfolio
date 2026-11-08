import { createRoot } from "react-dom/client";
import SkillsList from "./React/SkillsList.jsx";
import LetterGlitch from "./React/LetterGlitch.jsx";
import LikeButton from "./React/LikeButton.jsx";

const skillsRoot = document.getElementById("skills-root");
if (skillsRoot) createRoot(skillsRoot).render(<SkillsList />);

const glitchRoot = document.getElementById("glitch-root");
if (glitchRoot) {
  createRoot(glitchRoot).render(
    <LetterGlitch
      glitchColors={["#18d26e", "#0b8f4a", "#a5ffcb"]}
      glitchSpeed={33}
      outerVignette
      smooth
    />,
  );
}

const likeRoot = document.getElementById("like-root");
if (likeRoot) createRoot(likeRoot).render(<LikeButton />);
