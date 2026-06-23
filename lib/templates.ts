import { gridTemplate } from "../components/template/grid";
import { masonryTemplate } from "../components/template/masonry";
import { carouselTemplate } from "../components/template/carousel";

export interface Template {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js?: string;
}

export const defaultTemplates: Template[] = [
  gridTemplate,
  masonryTemplate,
  carouselTemplate
];
