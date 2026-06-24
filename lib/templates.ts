import { gridTemplate } from "../components/template/grid";
import { masonryTemplate } from "../components/template/masonry";
import { carouselTemplate } from "../components/template/carousel";
import { dynamicTemplate } from "../components/template/dynamic";
import { sphereTemplate } from "../components/template/sphere";
import { cylinderTemplate } from "../components/template/cylinder";

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
  carouselTemplate,
  dynamicTemplate,
  sphereTemplate,
  cylinderTemplate
];
