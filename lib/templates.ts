import { gridTemplate } from "../components/template/grid";
import { masonryTemplate } from "../components/template/masonry";
import { carouselTemplate } from "../components/template/carousel";
import { dynamicTemplate } from "../components/template/dynamic";
import { sphereTemplate } from "../components/template/sphere";
import { cylinderTemplate } from "../components/template/cylinder";
import { fluidTemplate } from "../components/template/fluid";
import { clayTemplate } from "../components/template/clay";
import { bentoTemplate } from "../components/template/bento";
import { glowTemplate } from "../components/template/glow";

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
  fluidTemplate,
  clayTemplate,
  bentoTemplate,
  glowTemplate
];

