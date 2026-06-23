import { gridTemplate } from "../components/template/grid";
import { masonryTemplate } from "../components/template/masonry";
import { carouselTemplate } from "../components/template/carousel";
import { dynamicTemplate } from "../components/template/dynamic";
import { fluidTemplate } from "../components/template/fluid";
import { clayTemplate } from "../components/template/clay";

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
  fluidTemplate,
  clayTemplate
];

