import { categoryMap } from "../iconMap";

const categoryToIcon = {
  cleaning: "Sparkles",
  plumbing: "Wrench",
  electrical: "PlugZap",
  cooking: "CookingPot",
  repairs: "Hammer",
  gardening: "Leaf",
  painting: "Brush",
  tutoring: "BookOpen",
};

function Icon({ name, size = 20, ...rest }) {
  const resolved = categoryToIcon[name] || name;
  const C = categoryMap[resolved] || categoryMap.Sparkles;
  return <C size={size} {...rest} />;
}

export default Icon;