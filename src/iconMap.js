import {
  Sparkles, Wrench, PlugZap, CookingPot, Hammer, Leaf, Brush, BookOpen,
} from "lucide-react";

export const categoryMap = {
  Sparkles, Wrench, PlugZap, CookingPot, Hammer, Leaf, Brush, BookOpen,
};

export const categoryIcon = (name) => categoryMap[name] || Sparkles;